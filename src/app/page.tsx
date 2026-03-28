import { HeroOrbs } from "@/components/hero-orbs";

export default function Home() {
  return (
    <>
      <main className="relative isolate flex min-h-[100svh] flex-1 items-center overflow-visible px-4 py-6 sm:px-6 lg:px-10">
        <HeroOrbs />

        <section className="relative z-10 w-full max-w-6xl lg:pr-[24vw] xl:pr-[28vw] 2xl:pr-[30vw]">
          <div className="inline-flex items-center border border-border bg-muted/55 px-4 py-2 text-sm font-medium text-foreground/90">
            Connecting formerly incarcerated individuals
          </div>

          <h1 className="relative z-20 mt-6 max-w-5xl text-[clamp(2rem,6.2vw,4.6rem)] leading-[0.98] tracking-tight text-foreground sm:mt-8 lg:mr-[-8vw] xl:mr-[-10vw]">
            <span className="font-serif italic">Unearth</span> your advantage.
            <br className="hidden sm:block" />
            Transform for <span className="font-serif italic">growth.</span>
          </h1>

          <p className="mt-6 max-w-[66ch] text-[clamp(1.05rem,1.8vw,1.45rem)] leading-relaxed text-foreground/75 [text-wrap:pretty] sm:mt-8">
            A fair-chance housing platform connecting returning citizens with
            landlords through verified profiles that highlight stability,
            rehabilitation, and real potential—not just past records.
          </p>

          <div className="mt-8 flex items-center gap-3 sm:mt-10">
            <span className="text-2xl font-semibold leading-none text-foreground sm:text-3xl">
              Discover how
            </span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xl leading-none text-background sm:h-10 sm:w-10 sm:text-2xl">
              ↓
            </span>
          </div>
        </section>
      </main>

      <section
        id="about"
        className="min-h-[100svh] border-t border-black bg-white px-4 py-20 sm:px-6 lg:px-10"
      >
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-3xl font-semibold text-black sm:text-4xl">
            About
          </h2>
        </div>
      </section>
    </>
  );
}
