# Next.js Project Setup

This project is built with:

- **Framework**: Next.js 15+ with TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Backend**: Supabase

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your Supabase project credentials. You can find these in your Supabase project settings.

## Project Structure

```
src/
├── app/              # Next.js App Router
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── lib/             # Utility functions
│   └── supabase.ts  # Supabase client configuration
└── styles/          # Global styles
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up your `.env.local` file with Supabase credentials

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Using shadcn/ui Components

Add components with:

```bash
npx shadcn@latest add button
```

## Using Supabase

Import and use the Supabase client from `@/lib/supabase`:

```typescript
import { supabase } from "@/lib/supabase";

// Example: Fetch data
const { data, error } = await supabase.from("your_table").select("*");
```

## Development Guidelines

- Use TypeScript for type safety
- Follow Next.js conventions and best practices
- Use Tailwind CSS for styling
- Leverage shadcn/ui for UI components
- Keep environment variables in `.env.local` (never commit sensitive keys)
