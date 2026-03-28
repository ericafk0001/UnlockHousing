# UnlockHousing

A modern Next.js application with TypeScript, Tailwind CSS, shadcn/ui components, and Supabase backend.

## Tech Stack

- **Framework**: Next.js 16+ with TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: Supabase
- **Package Manager**: npm

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your [Supabase project dashboard](https://app.supabase.com).

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── favicon.ico
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   ├── supabase.ts      # Supabase client
│   └── utils.ts         # Helper utilities
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Adding shadcn/ui Components

Use the shadcn CLI to add new components:

```bash
npx shadcn@latest add [component-name]
```

Example:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

## Using Supabase

Example: Fetch data from your Supabase table

```typescript
import { supabase } from "@/lib/supabase";

// In an async function or Server Component
const { data, error } = await supabase.from("your_table_name").select("*");

if (error) {
  console.error("Error fetching data:", error);
} else {
  console.log("Data:", data);
}
```

## Environment Variables

The following environment variables are used:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (exposed to browser)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key (exposed to browser)

**Important**: The `.env.local` file is git-ignored and should never be committed. Store secrets securely.

## Deployment

This project is ready to deploy on Vercel, Netlify, or any Node.js hosting platform.

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

## Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## License

MIT
