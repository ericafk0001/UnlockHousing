import { NextRequest, NextResponse } from 'next/server';

interface AchievementRequestBody {
  mode: 'rewrite' | 'generate';
  experience: {
    jobTitle?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    currentlyWorking?: boolean;
    achievements?: string[];
  };
  context?: string;
}

interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

interface ChatCompletionChoiceLike {
  message?: {
    content?: unknown;
  };
  text?: unknown;
}

const sanitizeAchievement = (input: string): string => {
  return input
    .replace(/^\s*[-*\u2022\d.)]+\s*/, '')
    .replace(/^["'`]+|["'`]+$/g, '')
    .replace(/^\{\s*"?achievements"?\s*:\s*\[/i, '')
    .replace(/\]\s*\}?\s*$/i, '')
    .trim();
};

const toAchievements = (items: unknown[]): string[] => {
  return items
    .filter((item): item is string => typeof item === 'string')
    .map((item) => sanitizeAchievement(item))
    .filter((item) => item.length > 0 && !item.includes('{"achievements"'))
    .slice(0, 5);
};

const parseAchievementsFromContent = (content: string): string[] => {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const rawJson = jsonMatch ? jsonMatch[0] : content;

  try {
    const parsed = JSON.parse(rawJson) as { achievements?: unknown };
    if (Array.isArray(parsed.achievements)) {
      return toAchievements(parsed.achievements);
    }
  } catch {
    // Fall through to line-based extraction.
  }

  return content
    .split('\n')
    .map((line: string) => sanitizeAchievement(line))
    .filter(Boolean)
    .filter((line: string) => !line.includes('{"achievements"') && line !== '{' && line !== '}')
    .slice(0, 5);
};

const extractTextFromUnknown = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
          const textPart = (item as { text?: unknown }).text;
          return typeof textPart === 'string' ? textPart : '';
        }
        return '';
      })
      .filter(Boolean)
      .join('\n')
      .trim();
  }

  if (value && typeof value === 'object') {
    const textPart = (value as { text?: unknown }).text;
    return typeof textPart === 'string' ? textPart : '';
  }

  return '';
};

const callAi = async (apiKey: string, messages: ChatMessage[], temperature: number, maxTokens: number) => {
  const runOnce = async (promptMessages: ChatMessage[]) => {
    const response = await fetch('https://ai.hackclub.com/proxy/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen/qwen3-32b',
        messages: promptMessages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('AI achievements API error:', text);
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    const choice = data?.choices?.[0] as ChatCompletionChoiceLike | undefined;

    const fromMessage = extractTextFromUnknown(choice?.message?.content);
    if (fromMessage) return fromMessage;

    const fromText = extractTextFromUnknown(choice?.text);
    if (fromText) return fromText;

    return '';
  };

  const firstAttempt = await runOnce(messages);
  if (firstAttempt) return firstAttempt;

  const retryMessages: ChatMessage[] = [
    ...messages,
    {
      role: 'user',
      content: 'Your previous response was empty. Return only plain JSON now with the exact required format and no extra commentary.',
    },
  ];
  const secondAttempt = await runOnce(retryMessages);
  if (secondAttempt) return secondAttempt;

  throw new Error('No AI content returned');
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AchievementRequestBody;

    if (!body?.experience || !body?.mode) {
      return NextResponse.json({ error: 'mode and experience are required' }, { status: 400 });
    }

    const apiKey = process.env.HACK_CLUB_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Hack Club AI API key not configured' }, { status: 500 });
    }

    const dateRange = body.experience.startDate
      ? `${body.experience.startDate} - ${body.experience.currentlyWorking ? 'Present' : body.experience.endDate || ''}`.trim()
      : '';

    const systemPrompt =
      'You are an expert resume writer. Return ONLY valid JSON with this exact shape: {"achievements":["...","...","...","..."]}. Output EXACTLY 4 bullet points. Each bullet must follow CAR/XYZ style: strong action + scope/context + measurable result. Use action verbs, include metrics when possible, avoid first-person pronouns, avoid periods at the end, keep each bullet under 170 characters, and do not include markdown.';

    const userPrompt = `Mode: ${body.mode}\n\nRole: ${body.experience.jobTitle || ''}\nCompany: ${body.experience.company || ''}\nLocation: ${body.experience.location || ''}\nTime: ${dateRange}\n\nExisting bullets:\n${(body.experience.achievements || []).map((a, i) => `${i + 1}. ${a}`).join('\n') || 'None'}\n\nAdditional notes:\n${body.context || 'None'}\n\nInstructions:\n- If mode is generate, produce EXACTLY 4 bullets based on role/company/notes\n- If mode is rewrite, improve existing bullets, preserve meaning, and return EXACTLY 4 bullets\n- Prefer quantified business/project impact (revenue, performance, scale, team size, delivery speed)\n- Keep bullets specific, realistic, and professional`;

    const firstContent = await callAi(
      apiKey,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      0.35,
      800
    );

    let achievements = parseAchievementsFromContent(firstContent);

    if (achievements.length !== 4) {
      const repairSystemPrompt =
        'You normalize resume bullets. Return ONLY JSON: {"achievements":["...","...","...","..."]}. Output EXACTLY 4 bullets in CAR/XYZ style, concise and ATS-ready.';
      const repairUserPrompt = `Normalize these bullets into EXACTLY 4 high-quality bullets, preserving truth and meaning:\n${achievements.map((a, i) => `${i + 1}. ${a}`).join('\n') || firstContent}`;

      const repairedContent = await callAi(
        apiKey,
        [
          { role: 'system', content: repairSystemPrompt },
          { role: 'user', content: repairUserPrompt },
        ],
        0.2,
        500
      );

      achievements = parseAchievementsFromContent(repairedContent);
    }

    if (achievements.length > 4) {
      achievements = achievements.slice(0, 4);
    }

    if (achievements.length !== 4) {
      return NextResponse.json(
        { error: 'AI could not produce exactly 4 clean bullet points. Please add a bit more detail and retry.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ achievements });
  } catch (error) {
    console.error('Resume achievements error:', error);
    return NextResponse.json({ error: 'Failed to generate achievements' }, { status: 500 });
  }
}
