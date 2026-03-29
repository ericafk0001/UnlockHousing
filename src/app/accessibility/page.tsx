import Link from "next/link";

export default function AccessibilityPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 text-foreground sm:px-6 lg:px-10">
      <a
        href="#main-content"
        className="inline-block rounded border border-border px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Skip to main content
      </a>

      <header className="mt-6 border-b border-border pb-6">
        <p className="text-sm font-medium text-foreground/80">
          Connecting formerly incarcerated individuals
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Unearth your advantage. Transform for growth.
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground/85">
          A fair-chance housing platform connecting returning citizens with
          landlords through verified profiles that highlight stability,
          rehabilitation, and real potential, not just past records.
        </p>
      </header>

      <div id="main-content" className="mt-8 space-y-8">
        <section id="about" aria-labelledby="about-title" className="space-y-4">
          <h2
            id="about-title"
            className="text-3xl font-semibold tracking-tight"
          >
            About
          </h2>
          <p className="max-w-4xl text-lg leading-relaxed text-foreground/90">
            People who have served their sentence are still widely treated as
            permanently dangerous. That assumption shuts returning citizens out
            of housing and community, even when they have accepted
            responsibility and done the work to rebuild their lives.
          </p>
          <p className="max-w-4xl text-lg leading-relaxed text-foreground/90">
            Unlock Housing creates a faster, fairer path into stable homes by
            connecting homeowners and returning citizens through a trusted
            intermediary that helps reduce stigma and build confidence on both
            sides.
          </p>
        </section>

        <section
          id="insights"
          aria-labelledby="insights-title"
          className="space-y-4 border-t border-border pt-8"
        >
          <h2
            id="insights-title"
            className="text-3xl font-semibold tracking-tight"
          >
            Insights
          </h2>
          <ul className="list-disc space-y-3 pl-6 text-lg leading-relaxed text-foreground/90">
            <li>
              Nearly 8 out of 10 returning citizens report being denied housing
              because of a criminal conviction.
            </li>
            <li>
              983 incarcerated individuals in Pennsylvania missed their parole
              release date in one year because they lacked a home plan.
            </li>
            <li>
              Stable housing is strongly linked to lower re-arrest rates and
              reduced reliance on crisis services.
            </li>
          </ul>
        </section>

        <section
          id="contact"
          aria-labelledby="contact-title"
          className="space-y-3 border-t border-border pt-8"
        >
          <h2
            id="contact-title"
            className="text-3xl font-semibold tracking-tight"
          >
            Contact
          </h2>
          <p className="text-lg text-foreground/90">
            Email:{" "}
            <a href="mailto:ninachenners@gmail.com">ninachenners@gmail.com</a>
          </p>
          <p className="text-lg text-foreground/90">
            Location: Philadelphia, PA
          </p>
          <p>
            <Link href="/" className="underline underline-offset-4">
              Return to main site
            </Link>
          </p>
        </section>
      </div>

      <footer className="mt-10 border-t border-border pt-6 text-base text-foreground/85">
        <p>©2026 Unlock Housing All Rights Reserved.</p>
      </footer>
    </main>
  );
}
