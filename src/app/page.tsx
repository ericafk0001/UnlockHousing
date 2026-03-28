import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <section className="w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-950/70 p-8 shadow-xl backdrop-blur">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
          Elephant
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white">
          Build faster with Supabase + Next.js
        </h1>
        <p className="mt-4 text-base text-gray-300">
          This is your landing page. Authentication now lives on a separate page
          so your marketing content and auth flow stay cleanly separated.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/auth?mode=signup"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-transparent bg-white px-2.5 text-sm font-medium text-black transition-colors hover:bg-gray-100"
          >
            Create Account
          </Link>
          <Link
            href="/auth?mode=signin"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-gray-600 px-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Sign In
          </Link>
        </div>
      </section>
    </main>
  );
}
