import { HeroOrbs } from "@/components/hero-orbs";
import { InsightsCharts } from "@/components/insights-charts";

export default function Home() {
  return (
    <>
      <div className="relative z-20">
        <main
          data-scroll-section
          className="relative isolate flex min-h-svh flex-1 items-center overflow-visible bg-white px-4 py-6 sm:px-6 lg:px-10"
        >
          <HeroOrbs />

          <section
            data-fade-in
            className="relative z-10 w-full max-w-6xl lg:pr-[24vw] xl:pr-[28vw] 2xl:pr-[30vw]"
          >
            <div className="inline-flex items-center border border-border bg-muted/55 px-4 py-2 text-sm font-medium text-foreground/90">
              Connecting formerly incarcerated individuals
            </div>

            <h1 className="relative z-20 mt-6 max-w-5xl text-[clamp(2rem,6.2vw,4.6rem)] leading-[0.98] tracking-tight text-foreground sm:mt-8 lg:mr-[-8vw] xl:mr-[-10vw]">
              <span className="font-serif italic">Unearth</span> your advantage.
              <br className="hidden sm:block" />
              Transform for <span className="font-serif italic">growth.</span>
            </h1>

            <p className="mt-6 max-w-[66ch] text-[clamp(1.05rem,1.8vw,1.45rem)] leading-relaxed text-foreground/75 text-pretty sm:mt-8">
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
          data-scroll-section
          className="h-svh border-t border-black bg-white p-4 sm:p-6 lg:p-10"
        >
          <div className="mx-auto grid h-full w-full max-w-7xl gap-4 lg:grid-cols-2">
            <article
              data-fade-in
              className="flex h-full flex-col rounded-[2.1rem] border border-black/8 bg-[#ded9d2] px-8 py-9 sm:px-10 sm:py-11"
            >
              <p className="max-w-[18ch] text-[clamp(2.05rem,3.8vw,3.7rem)] font-semibold leading-[1.04] tracking-tight text-[#1a1d23] text-pretty">
                People who have served their sentence are still widely treated
                as permanently dangerous.
              </p>
              <p className="mt-7 max-w-[44ch] text-[clamp(1.18rem,1.9vw,1.95rem)] leading-[1.35] text-[#394046] text-pretty">
                That assumption shuts returning citizens out of housing and
                community, even when they have accepted responsibility and done
                the work to rebuild their lives.
              </p>
            </article>

            <article
              data-fade-in
              className="flex h-full flex-col rounded-[2.1rem] border border-black/8 bg-[#cec6e5] px-8 py-9 sm:px-10 sm:py-11"
            >
              <p className="max-w-[22ch] text-[clamp(2.05rem,3.8vw,3.7rem)] font-semibold leading-[1.04] tracking-tight text-[#1a1d23] text-pretty">
                Unlock Housing creates a faster, fairer path into stable homes.
              </p>
              <p className="mt-7 max-w-[46ch] text-[clamp(1.18rem,1.9vw,1.95rem)] leading-[1.35] text-[#394046] text-pretty">
                UnlockHousing is a Zillow-style rental marketplace that connects
                homeowners and returning citizens through a trusted
                intermediary, streamlines applications, and gives applicants
                room to share their story to reduce stigma and build confidence
                on both sides.
              </p>
            </article>
          </div>
        </section>

        <section
          id="insights"
          data-scroll-section
          className="bg-white p-4 sm:p-6 lg:p-10"
        >
          <div className="mx-auto w-full max-w-7xl">
            <article
              data-fade-in
              className="flex flex-col rounded-[2.1rem] border border-black/8 bg-[#d8e7df] px-8 py-9 sm:px-10 sm:py-11"
            >
              <p className="text-[clamp(2.25rem,4.4vw,4rem)] font-semibold leading-[1.03] tracking-tight text-[#1a1d23]">
                The data behind the housing gap
              </p>

              <div className="mt-8 grid auto-rows-min content-start gap-4">
                <div
                  data-fade-in
                  className="rounded-2xl border border-black/10 bg-white/55 px-6 py-5"
                >
                  <p className="text-[clamp(1.15rem,1.6vw,1.55rem)] leading-relaxed text-[#394046] text-pretty">
                    In interviews with formerly incarcerated people and their
                    family members, nearly 8 out of 10 report being denied
                    housing because of a criminal conviction, and access to
                    affordable housing and livable wages are often listed among
                    the top things that would have kept people out of prison in
                    the first place.
                  </p>
                </div>

                <div
                  data-fade-in
                  className="rounded-2xl border border-black/10 bg-white/55 px-6 py-5"
                >
                  <p className="text-[clamp(1.15rem,1.6vw,1.55rem)] leading-relaxed text-[#394046] text-pretty">
                    According to the Re-Entry Program Manager at the
                    Pennsylvania Department of Corrections, 983 incarcerated
                    individuals were not released on their parole date over one
                    year because they lacked a home plan.
                  </p>
                </div>

                <div
                  data-fade-in
                  className="rounded-2xl border border-black/10 bg-white/55 px-6 py-5"
                >
                  <p className="text-[clamp(1.15rem,1.6vw,1.55rem)] leading-relaxed text-[#394046] text-pretty">
                    Two-thirds of people released who did not have stable
                    housing were re-arrested within 12 months of release,
                    compared with only one-quarter of those who did have
                    housing. When ex-offenders have stable homes, they are less
                    likely to be return users of expensive crisis services (such
                    as emergency rooms) and less likely to return to prisons and
                    jails.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <InsightsCharts />
      </div>

      <div className="w-full" aria-hidden="true"></div>
      <footer className="sticky bottom-0 z-0 h-160 border-t border-black/10 bg-[#1a1d23] text-white">
        {" "}
        <div className="pointer-events-auto mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
          <div>
            <div className="group mt-3 flex w-full max-w-full flex-wrap items-center gap-4 perspective-[700px] sm:flex-nowrap sm:gap-6">
              <a
                href="mailto:team@unlockhousing.org"
                className="max-w-[11ch] min-w-0 text-[clamp(2.8rem,11vw,8.2rem)] font-semibold leading-[0.92] tracking-tight text-white transition-opacity hover:opacity-80"
              >
                Contact Us
              </a>
              <span className="inline-flex h-[clamp(4rem,10vw,7.5rem)] w-[clamp(4rem,10vw,7.5rem)] shrink-0 items-center justify-center rounded-full bg-blue-500 text-[clamp(2.1rem,5vw,4rem)] leading-none text-white transition-transform duration-300 group-hover:transform-[rotateY(45deg)_rotateX(25deg)]">
                <span className="inline-block transition-transform duration-300 transform-[rotate(-140deg)] group-hover:transform-[rotate(-140deg)_rotateY(45deg)_rotateX(25deg)]">
                  ↓
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-t border-black/10 bg-[#f4f4f4] px-6 py-7 text-[#1b1b1b] sm:px-8 lg:px-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 text-[clamp(1.1rem,1.6vw,2rem)] sm:flex-row sm:items-center sm:justify-between">
            <p className="font-medium">
              ©2026 Unlock Housing All Rights Reserved.
            </p>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
              <a href="#" className="transition-opacity hover:opacity-70">
                Privacy Policy
              </a>
              <a href="#" className="transition-opacity hover:opacity-70">
                Terms of Service
              </a>
              <a href="#" className="transition-opacity hover:opacity-70">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
