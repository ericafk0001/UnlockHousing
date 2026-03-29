"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
} from "lucide-react";

export interface ResumeFormData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    summary?: string;
  };
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa?: string;
    relevantCoursework?: string;
  }>;
  experience: Array<{
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    achievements: string[];
  }>;
  leadershipCommunity: Array<{
    id: string;
    position: string;
    organization: string;
    location: string;
    startDate: string;
    endDate: string;
    currentlyHolding: boolean;
    achievements: string[];
  }>;
  skills: {
    softSkills: string[];
    languages: string[];
    programming: string[];
  };
  honors: Array<{
    id: string;
    title: string;
    year: string;
  }>;
  criminalHistory: {
    include: boolean;
    details: string;
  };
}

interface ResumeFormBuilderProps {
  onDataChange: (data: ResumeFormData) => void;
}

type ActiveTab =
  | "personal"
  | "education"
  | "experience"
  | "leadership"
  | "skills"
  | "honors"
  | "criminalHistory";
type ExperienceField = keyof ResumeFormData["experience"][number];
type LeadershipField = keyof ResumeFormData["leadershipCommunity"][number];

const sanitizeAchievementLine = (input: string): string => {
  return input
    .replace(/^\s*[-*\u2022\d.)]+\s*/, "")
    .replace(/^["'`]+|["'`]+$/g, "")
    .replace(/^\{\s*"?achievements"?\s*:\s*\[/i, "")
    .replace(/\]\s*\}?\s*$/i, "")
    .trim();
};

const defaultData: ResumeFormData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
  },
  education: [],
  experience: [],
  leadershipCommunity: [],
  skills: {
    softSkills: [],
    languages: [],
    programming: [],
  },
  honors: [],
  criminalHistory: {
    include: false,
    details: "",
  },
};

export const ResumeFormBuilder: React.FC<ResumeFormBuilderProps> = ({
  onDataChange,
}) => {
  const [formData, setFormData] = useState<ResumeFormData>(defaultData);
  const [activeTab, setActiveTab] = useState<ActiveTab>("personal");
  const [expandedEducation, setExpandedEducation] = useState<string | null>(
    null,
  );
  const [expandedExperience, setExpandedExperience] = useState<string | null>(
    null,
  );
  const [expandedLeadership, setExpandedLeadership] = useState<string | null>(
    null,
  );
  const [achievementDrafts, setAchievementDrafts] = useState<
    Record<string, string>
  >({});
  const [aiLoadingByExperience, setAiLoadingByExperience] = useState<
    Record<string, boolean>
  >({});
  const [aiErrorByExperience, setAiErrorByExperience] = useState<
    Record<string, string>
  >({});

  const handlePersonalChange = (
    field: keyof typeof formData.personalInfo,
    value: string,
  ) => {
    const updated = {
      ...formData,
      personalInfo: { ...formData.personalInfo, [field]: value },
    };
    setFormData(updated);
    onDataChange(updated);
  };

  const addEducation = () => {
    const newId = `edu-${Date.now()}`;
    const updated = {
      ...formData,
      education: [
        ...formData.education,
        {
          id: newId,
          school: "",
          degree: "",
          field: "",
          graduationDate: "",
          gpa: "",
          relevantCoursework: "",
        },
      ],
    };
    setFormData(updated);
    setExpandedEducation(newId);
    onDataChange(updated);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...formData.education];
    updated[index] = { ...updated[index], [field]: value };
    const formUpdate = { ...formData, education: updated };
    setFormData(formUpdate);
    onDataChange(formUpdate);
  };

  const deleteEducation = (index: number) => {
    const updated = formData.education.filter((_, i) => i !== index);
    const formUpdate = { ...formData, education: updated };
    setFormData(formUpdate);
    onDataChange(formUpdate);
  };

  const addExperience = () => {
    const newId = `exp-${Date.now()}`;
    const updated = {
      ...formData,
      experience: [
        ...formData.experience,
        {
          id: newId,
          jobTitle: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          achievements: [],
        },
      ],
    };
    setFormData(updated);
    setExpandedExperience(newId);
    onDataChange(updated);
  };

  const updateExperience = <K extends ExperienceField>(
    index: number,
    field: K,
    value: ResumeFormData["experience"][number][K],
  ) => {
    const updated = [...formData.experience];
    updated[index] = { ...updated[index], [field]: value };
    const formUpdate = { ...formData, experience: updated };
    setFormData(formUpdate);
    onDataChange(formUpdate);
  };

  const deleteExperience = (index: number) => {
    const updated = formData.experience.filter((_, i) => i !== index);
    const formUpdate = { ...formData, experience: updated };
    setFormData(formUpdate);
    onDataChange(formUpdate);
  };

  const addAchievement = (index: number, achievement: string) => {
    if (achievement.trim()) {
      const updated = [...formData.experience];
      updated[index].achievements = [
        ...updated[index].achievements,
        achievement.trim(),
      ];
      const formUpdate = { ...formData, experience: updated };
      setFormData(formUpdate);
      onDataChange(formUpdate);
    }
  };

  const removeAchievement = (expIndex: number, achIndex: number) => {
    const updated = [...formData.experience];
    updated[expIndex].achievements = updated[expIndex].achievements.filter(
      (_, i) => i !== achIndex,
    );
    const formUpdate = { ...formData, experience: updated };
    setFormData(formUpdate);
    onDataChange(formUpdate);
  };

  const addLeadership = () => {
    const newId = `lead-${Date.now()}`;
    const updated = {
      ...formData,
      leadershipCommunity: [
        ...formData.leadershipCommunity,
        {
          id: newId,
          position: "",
          organization: "",
          location: "",
          startDate: "",
          endDate: "",
          currentlyHolding: false,
          achievements: [],
        },
      ],
    };
    setFormData(updated);
    setExpandedLeadership(newId);
    onDataChange(updated);
  };

  const updateLeadership = <K extends LeadershipField>(
    index: number,
    field: K,
    value: ResumeFormData["leadershipCommunity"][number][K],
  ) => {
    const updated = [...formData.leadershipCommunity];
    updated[index] = { ...updated[index], [field]: value };
    const formUpdate = { ...formData, leadershipCommunity: updated };
    setFormData(formUpdate);
    onDataChange(formUpdate);
  };

  const enhanceAchievements = async (
    index: number,
    mode: "rewrite" | "generate",
  ) => {
    const experience = formData.experience[index];
    if (!experience) return;

    const contextText = achievementDrafts[experience.id] || "";
    if (
      !experience.jobTitle &&
      !experience.company &&
      !contextText &&
      mode === "generate"
    ) {
      setAiErrorByExperience((prev) => ({
        ...prev,
        [experience.id]:
          "Add at least a role, company, or notes so AI has context.",
      }));
      return;
    }

    setAiLoadingByExperience((prev) => ({ ...prev, [experience.id]: true }));
    setAiErrorByExperience((prev) => ({ ...prev, [experience.id]: "" }));

    try {
      const response = await fetch("/api/resume/achievements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          experience,
          context: contextText,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to enhance achievements");
      }

      const normalizedAchievements = Array.isArray(payload.achievements)
        ? payload.achievements
            .filter((item: unknown): item is string => typeof item === "string")
            .map((item: string) => sanitizeAchievementLine(item))
            .filter(
              (item: string) =>
                item.length > 0 && !item.includes('{"achievements"'),
            )
            .slice(0, 5)
        : [];

      if (normalizedAchievements.length === 0) {
        throw new Error(
          "AI response could not be parsed into clean bullet points. Try adding more notes and retry.",
        );
      }

      const updated = [...formData.experience];
      updated[index] = {
        ...updated[index],
        achievements: normalizedAchievements,
      };

      const formUpdate = { ...formData, experience: updated };
      setFormData(formUpdate);
      onDataChange(formUpdate);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "AI request failed";
      setAiErrorByExperience((prev) => ({ ...prev, [experience.id]: message }));
    } finally {
      setAiLoadingByExperience((prev) => ({ ...prev, [experience.id]: false }));
    }
  };

  const deleteLeadership = (index: number) => {
    const updated = formData.leadershipCommunity.filter((_, i) => i !== index);
    const formUpdate = { ...formData, leadershipCommunity: updated };
    setFormData(formUpdate);
    onDataChange(formUpdate);
  };

  const addLeadershipAchievement = (index: number, achievement: string) => {
    if (achievement.trim()) {
      const updated = [...formData.leadershipCommunity];
      updated[index].achievements = [
        ...updated[index].achievements,
        achievement.trim(),
      ];
      const formUpdate = { ...formData, leadershipCommunity: updated };
      setFormData(formUpdate);
      onDataChange(formUpdate);
    }
  };

  const removeLeadershipAchievement = (leadIndex: number, achIndex: number) => {
    const updated = [...formData.leadershipCommunity];
    updated[leadIndex].achievements = updated[leadIndex].achievements.filter(
      (_, i) => i !== achIndex,
    );
    const formUpdate = { ...formData, leadershipCommunity: updated };
    setFormData(formUpdate);
    onDataChange(formUpdate);
  };

  const addSkill = (
    category: "softSkills" | "languages" | "programming",
    skill: string,
  ) => {
    if (skill.trim() && !formData.skills[category].includes(skill.trim())) {
      const updated = {
        ...formData,
        skills: {
          ...formData.skills,
          [category]: [...formData.skills[category], skill.trim()],
        },
      };
      setFormData(updated);
      onDataChange(updated);
    }
  };

  const removeSkill = (
    category: "softSkills" | "languages" | "programming",
    skill: string,
  ) => {
    const updated = {
      ...formData,
      skills: {
        ...formData.skills,
        [category]: formData.skills[category].filter((s) => s !== skill),
      },
    };
    setFormData(updated);
    onDataChange(updated);
  };

  const addHonor = () => {
    const newId = `hon-${Date.now()}`;
    const updated = {
      ...formData,
      honors: [
        ...formData.honors,
        {
          id: newId,
          title: "",
          year: "",
        },
      ],
    };
    setFormData(updated);
    onDataChange(updated);
  };

  const updateHonor = (index: number, field: string, value: string) => {
    const updated = [...formData.honors];
    updated[index] = { ...updated[index], [field]: value };
    const formUpdate = { ...formData, honors: updated };
    setFormData(formUpdate);
    onDataChange(formUpdate);
  };

  const deleteHonor = (index: number) => {
    const updated = formData.honors.filter((_, i) => i !== index);
    const formUpdate = { ...formData, honors: updated };
    setFormData(formUpdate);
    onDataChange(formUpdate);
  };

  const updateCriminalHistory = (
    field: keyof ResumeFormData["criminalHistory"],
    value: boolean | string,
  ) => {
    const updated = {
      ...formData,
      criminalHistory: {
        ...formData.criminalHistory,
        [field]: value,
      },
    };
    setFormData(updated);
    onDataChange(updated);
  };

  const tabs: Array<{ id: ActiveTab; label: string; number: number }> = [
    { id: "personal", label: "Personal Info", number: 1 },
    { id: "education", label: "Education", number: 2 },
    { id: "experience", label: "Experience", number: 3 },
    { id: "leadership", label: "Leadership", number: 4 },
    { id: "skills", label: "Skills", number: 5 },
    { id: "honors", label: "Honors & Awards", number: 6 },
    { id: "criminalHistory", label: "Criminal History", number: 7 },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold bg-gray-100">
                {tab.number}
              </span>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* Personal Info */}
        {activeTab === "personal" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.personalInfo.fullName}
                onChange={(e) =>
                  handlePersonalChange("fullName", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Full Name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.personalInfo.phone}
                  onChange={(e) =>
                    handlePersonalChange("phone", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="215-555-0123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) =>
                    handlePersonalChange("email", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.location}
                  onChange={(e) =>
                    handlePersonalChange("location", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Philadelphia, PA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.personalInfo.linkedin}
                  onChange={(e) =>
                    handlePersonalChange("linkedin", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="linkedin.com/in/yourname"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Summary
              </label>
              <textarea
                value={formData.personalInfo.summary}
                onChange={(e) =>
                  handlePersonalChange("summary", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Brief overview of your professional background and goals..."
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Education */}
        {activeTab === "education" && (
          <div className="space-y-4">
            {formData.education.map((edu, index) => (
              <div
                key={edu.id}
                className="rounded-lg border border-gray-200 bg-gray-50"
              >
                <div
                  onClick={() =>
                    setExpandedEducation(
                      expandedEducation === edu.id ? null : edu.id,
                    )
                  }
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      {edu.school || "School"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {edu.degree || "Degree"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEducation(index);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {expandedEducation === edu.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>

                {expandedEducation === edu.id && (
                  <div className="border-t border-gray-200 px-4 py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          School/University *
                        </label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) =>
                            updateEducation(index, "school", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                          placeholder="University Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Degree
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(index, "degree", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                          placeholder="Bachelor of Science"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) =>
                            updateEducation(index, "field", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                          placeholder="Computer Science"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Graduation Date
                        </label>
                        <input
                          type="month"
                          value={edu.graduationDate}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              "graduationDate",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GPA
                        </label>
                        <input
                          type="text"
                          value={edu.gpa}
                          onChange={(e) =>
                            updateEducation(index, "gpa", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                          placeholder="3.7"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relevant Coursework
                      </label>
                      <textarea
                        value={edu.relevantCoursework}
                        onChange={(e) =>
                          updateEducation(
                            index,
                            "relevantCoursework",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., Data Structures, Web Development, Machine Learning..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={addEducation}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Education
            </button>
          </div>
        )}

        {/* Experience */}
        {activeTab === "experience" && (
          <div className="space-y-4">
            {formData.experience.map((work, index) => (
              <div
                key={work.id}
                className="rounded-lg border border-gray-200 bg-gray-50"
              >
                <div
                  onClick={() =>
                    setExpandedExperience(
                      expandedExperience === work.id ? null : work.id,
                    )
                  }
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      {work.jobTitle || "Job Title"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {work.company || "Company"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteExperience(index);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {expandedExperience === work.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>

                {expandedExperience === work.id && (
                  <div className="border-t border-gray-200 px-4 py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Title *
                        </label>
                        <input
                          type="text"
                          value={work.jobTitle}
                          onChange={(e) =>
                            updateExperience(index, "jobTitle", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                          placeholder="Job Title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company *
                        </label>
                        <input
                          type="text"
                          value={work.company}
                          onChange={(e) =>
                            updateExperience(index, "company", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                          placeholder="Company Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={work.location}
                        onChange={(e) =>
                          updateExperience(index, "location", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="Philadelphia, PA"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date
                        </label>
                        <input
                          type="month"
                          value={work.startDate}
                          onChange={(e) =>
                            updateExperience(index, "startDate", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date
                        </label>
                        <input
                          type="month"
                          value={work.endDate}
                          disabled={work.currentlyWorking}
                          onChange={(e) =>
                            updateExperience(index, "endDate", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={work.currentlyWorking}
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "currentlyWorking",
                              e.target.checked,
                            )
                          }
                          className="rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Currently working here
                        </span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Achievements
                      </label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add an achievement (e.g., Led team of 5 engineers)"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                addAchievement(
                                  index,
                                  (e.target as HTMLInputElement).value,
                                );
                                (e.target as HTMLInputElement).value = "";
                              }
                            }}
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                          />
                          <button
                            onClick={(e) => {
                              const input = e.currentTarget
                                .previousElementSibling as HTMLInputElement;
                              addAchievement(index, input.value);
                              input.value = "";
                            }}
                            className="rounded-lg bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                          >
                            Add
                          </button>
                        </div>
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 space-y-2">
                          <label className="block text-xs font-semibold text-blue-900">
                            AI Notes (optional)
                          </label>
                          <textarea
                            value={achievementDrafts[work.id] || ""}
                            onChange={(e) =>
                              setAchievementDrafts((prev) => ({
                                ...prev,
                                [work.id]: e.target.value,
                              }))
                            }
                            className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Paste rough notes, metrics, or impact details for better bullets..."
                            rows={3}
                          />
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                enhanceAchievements(index, "generate")
                              }
                              disabled={!!aiLoadingByExperience[work.id]}
                              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                              {aiLoadingByExperience[work.id] ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Sparkles className="h-3.5 w-3.5" />
                              )}
                              Generate Bullets
                            </button>
                            <button
                              onClick={() =>
                                enhanceAchievements(index, "rewrite")
                              }
                              disabled={
                                !!aiLoadingByExperience[work.id] ||
                                work.achievements.length === 0
                              }
                              className="inline-flex items-center gap-2 rounded-md bg-slate-700 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                            >
                              {aiLoadingByExperience[work.id] ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Sparkles className="h-3.5 w-3.5" />
                              )}
                              Rewrite Existing
                            </button>
                          </div>
                          {aiErrorByExperience[work.id] && (
                            <p className="text-xs text-red-600">
                              {aiErrorByExperience[work.id]}
                            </p>
                          )}
                        </div>
                        {work.achievements.map((ach, achIndex) => (
                          <div
                            key={achIndex}
                            className="flex items-center justify-between rounded-lg bg-white p-2 border border-gray-200"
                          >
                            <span className="text-sm">● {ach}</span>
                            <button
                              onClick={() => removeAchievement(index, achIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={addExperience}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Experience
            </button>
          </div>
        )}

        {/* Leadership & Community */}
        {activeTab === "leadership" && (
          <div className="space-y-4">
            {formData.leadershipCommunity.map((lead, index) => (
              <div
                key={lead.id}
                className="rounded-lg border border-gray-200 bg-gray-50"
              >
                <div
                  onClick={() =>
                    setExpandedLeadership(
                      expandedLeadership === lead.id ? null : lead.id,
                    )
                  }
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      {lead.position || "Position"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {lead.organization || "Organization"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLeadership(index);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {expandedLeadership === lead.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>

                {expandedLeadership === lead.id && (
                  <div className="border-t border-gray-200 px-4 py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Position *
                        </label>
                        <input
                          type="text"
                          value={lead.position}
                          onChange={(e) =>
                            updateLeadership(index, "position", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                          placeholder="Leadership Role"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Organization *
                        </label>
                        <input
                          type="text"
                          value={lead.organization}
                          onChange={(e) =>
                            updateLeadership(
                              index,
                              "organization",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                          placeholder="Organization Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={lead.location}
                        onChange={(e) =>
                          updateLeadership(index, "location", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="Philadelphia, PA"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date
                        </label>
                        <input
                          type="month"
                          value={lead.startDate}
                          onChange={(e) =>
                            updateLeadership(index, "startDate", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date
                        </label>
                        <input
                          type="month"
                          value={lead.endDate}
                          disabled={lead.currentlyHolding}
                          onChange={(e) =>
                            updateLeadership(index, "endDate", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={lead.currentlyHolding}
                          onChange={(e) =>
                            updateLeadership(
                              index,
                              "currentlyHolding",
                              e.target.checked,
                            )
                          }
                          className="rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Currently holding this position
                        </span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contributions
                      </label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a contribution or achievement"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                addLeadershipAchievement(
                                  index,
                                  (e.target as HTMLInputElement).value,
                                );
                                (e.target as HTMLInputElement).value = "";
                              }
                            }}
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                          />
                          <button
                            onClick={(e) => {
                              const input = e.currentTarget
                                .previousElementSibling as HTMLInputElement;
                              addLeadershipAchievement(index, input.value);
                              input.value = "";
                            }}
                            className="rounded-lg bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                          >
                            Add
                          </button>
                        </div>
                        {lead.achievements.map((ach, achIndex) => (
                          <div
                            key={achIndex}
                            className="flex items-center justify-between rounded-lg bg-white p-2 border border-gray-200"
                          >
                            <span className="text-sm">● {ach}</span>
                            <button
                              onClick={() =>
                                removeLeadershipAchievement(index, achIndex)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={addLeadership}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Leadership Role
            </button>
          </div>
        )}

        {/* Skills */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            {/* Soft Skills */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Soft Skills</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g., Leadership, Communication"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addSkill(
                        "softSkills",
                        (e.target as HTMLInputElement).value,
                      );
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    addSkill("softSkills", input.value);
                    input.value = "";
                  }}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              {formData.skills.softSkills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.softSkills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-900"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill("softSkills", skill)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Languages */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Languages</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g., English, Spanish"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addSkill(
                        "languages",
                        (e.target as HTMLInputElement).value,
                      );
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    addSkill("languages", input.value);
                    input.value = "";
                  }}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              {formData.skills.languages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.languages.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1 text-sm text-green-900"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill("languages", skill)}
                        className="text-green-600 hover:text-green-800"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Programming */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Programming</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g., Python, JavaScript, React"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addSkill(
                        "programming",
                        (e.target as HTMLInputElement).value,
                      );
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    addSkill("programming", input.value);
                    input.value = "";
                  }}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              {formData.skills.programming.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.programming.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-2 rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-900"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill("programming", skill)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Honors & Awards */}
        {activeTab === "honors" && (
          <div className="space-y-4">
            {formData.honors.map((honor, index) => (
              <div
                key={honor.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    value={honor.title}
                    onChange={(e) =>
                      updateHonor(index, "title", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none text-sm"
                    placeholder="Award or Honor Title"
                  />
                </div>
                <input
                  type="text"
                  value={honor.year}
                  onChange={(e) => updateHonor(index, "year", e.target.value)}
                  className="w-24 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none text-sm"
                  placeholder="2025"
                />
                <button
                  onClick={() => deleteHonor(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addHonor}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Honor or Award
            </button>
          </div>
        )}

        {/* Criminal History */}
        {activeTab === "criminalHistory" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-900">
                You do not have to include expunged criminal charges.
              </p>
              <p className="mt-1 text-xs text-amber-800">
                Share only what you are comfortable disclosing for this resume
                and role.
              </p>
            </div>

            <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3">
              <input
                type="checkbox"
                checked={formData.criminalHistory.include}
                onChange={(e) =>
                  updateCriminalHistory("include", e.target.checked)
                }
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Include criminal history on this resume
              </span>
            </label>

            {formData.criminalHistory.include && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Criminal History Details
                </label>
                <textarea
                  value={formData.criminalHistory.details}
                  onChange={(e) =>
                    updateCriminalHistory("details", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Optional: Include context, rehabilitation efforts, certifications, and positive outcomes."
                  rows={6}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
