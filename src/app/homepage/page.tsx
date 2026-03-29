"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type ProfileRow = {
  first_name: string | null;
  avatar_url: string | null;
};

type Listing = {
  id: number;
  title: string;
  neighborhood: string;
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  supportNote: string;
};

type MapPin = {
  id: number;
  top: string;
  left: string;
  rent: number;
  featured?: boolean;
};

const listings: Listing[] = [
  {
    id: 1,
    title: "2BR Row Home Near Transit",
    neighborhood: "North Philadelphia",
    rent: 890,
    beds: 2,
    baths: 1,
    sqft: 860,
    supportNote: "Second-chance friendly landlord and flexible deposit plan.",
  },
  {
    id: 2,
    title: "Studio With Reentry Support",
    neighborhood: "West Philadelphia",
    rent: 640,
    beds: 0,
    baths: 1,
    sqft: 420,
    supportNote: "Partnered with local case managers and job services.",
  },
  {
    id: 3,
    title: "Shared 3BR Family Unit",
    neighborhood: "Kensington",
    rent: 780,
    beds: 3,
    baths: 1,
    sqft: 980,
    supportNote: "Co-signer alternatives available through community partners.",
  },
  {
    id: 4,
    title: "1BR Apartment With Utilities Cap",
    neighborhood: "South Philadelphia",
    rent: 735,
    beds: 1,
    baths: 1,
    sqft: 590,
    supportNote: "No blanket background denial policy.",
  },
  {
    id: 5,
    title: "Transitional Duplex Unit",
    neighborhood: "Olney",
    rent: 820,
    beds: 2,
    baths: 1,
    sqft: 760,
    supportNote: "Application fee waived for referred applicants.",
  },
];

const mapPins: MapPin[] = [
  { id: 1, top: "24%", left: "56%", rent: 640, featured: true },
  { id: 2, top: "35%", left: "42%", rent: 890 },
  { id: 3, top: "48%", left: "51%", rent: 780 },
  { id: 4, top: "58%", left: "60%", rent: 735 },
  { id: 5, top: "66%", left: "43%", rent: 820 },
  { id: 6, top: "39%", left: "63%", rent: 710 },
  { id: 7, top: "30%", left: "34%", rent: 695 },
  { id: 8, top: "72%", left: "55%", rent: 760 },
];

const externalResources = [
  {
    label: "HUD Reentry Housing Help",
    href: "https://www.hud.gov/topics/rental_assistance",
    description: "Government rental assistance and fair housing guidance.",
  },
  {
    label: "PA Legal Aid Network",
    href: "https://palegalaid.net/",
    description: "Free legal support for housing disputes in Pennsylvania.",
  },
  {
    label: "CareerOneStop Reentry",
    href: "https://www.careeronestop.org/ExOffender/default.aspx",
    description: "Job training and reentry employment programs.",
  },
  {
    label: "211 Housing Services",
    href: "https://www.211.org/get-help/housing-expenses",
    description: "Find local emergency and long-term housing support.",
  },
  {
    label: "SEPTA Senior Fare Card",
    href: "https://wwww.septa.org/fares/senior-fare-card/",
    description:
      "Affordable public transit options for seniors and eligible riders.",
  },
  {
    label: "SEPTA Reduced Fare Program",
    href: "https://wwww.septa.org/fares/reduced-fare-program/",
    description: "Discounted transit fares for qualifying individuals.",
  },
  {
    label: "PENN CAMP Reentry Citizens",
    href: "https://penncamp.org/re-entry-citizens/",
    description:
      "Community advocacy and support for formerly incarcerated individuals.",
  },
];

const resolveAvatarDisplayUrl = async (
  supabase: ReturnType<typeof createSupabaseBrowserClient>,
  avatarValue: string,
) => {
  if (avatarValue.startsWith("http://") || avatarValue.startsWith("https://")) {
    return avatarValue;
  }

  const { data: signedData, error: signedError } = await supabase.storage
    .from("avatars")
    .createSignedUrl(avatarValue, 60 * 60 * 24 * 365);

  if (!signedError && signedData?.signedUrl) {
    return signedData.signedUrl;
  }

  const { data: publicData } = supabase.storage
    .from("avatars")
    .getPublicUrl(avatarValue);

  return publicData.publicUrl;
};

export default function Homepage() {
  const router = useRouter();
  const [supabase, setSupabase] = useState<ReturnType<
    typeof createSupabaseBrowserClient
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState("there");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("Philadelphia, PA");
  const [activeFilter, setActiveFilter] = useState("Lowest Rent");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient());
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isCancelled = false;

    const loadHome = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (isCancelled) {
        return;
      }

      if (!user) {
        router.replace("/auth?mode=signin");
        return;
      }

      const metadata = user.user_metadata ?? {};
      const metadataName = String(metadata.first_name ?? "").trim();
      if (metadataName) {
        setDisplayName(metadataName);
      }

      const { data } = await supabase
        .from("profiles")
        .select("first_name,avatar_url")
        .eq("id", user.id)
        .maybeSingle<ProfileRow>();

      if (isCancelled) {
        return;
      }

      const chosenName = data?.first_name ?? metadataName;
      if (chosenName) {
        setDisplayName(chosenName);
      }

      const profileAvatar =
        data?.avatar_url ?? String(metadata.avatar_url ?? "");
      const avatarValue = profileAvatar.trim();
      if (avatarValue) {
        setAvatarUrl(await resolveAvatarDisplayUrl(supabase, avatarValue));
      }

      setIsLoading(false);
    };

    void loadHome();

    return () => {
      isCancelled = true;
    };
  }, [router, supabase]);

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <>
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[320px] border-r border-border bg-background/95 p-4 shadow-xl backdrop-blur transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="External housing resources"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Resources</h2>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-md border border-input px-2 py-1 text-sm text-foreground hover:bg-muted"
          >
            Close
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Trusted external support links for housing, legal aid, and reentry.
        </p>

        <div className="mt-4 space-y-3">
          {externalResources.map((resource) => (
            <a
              key={resource.label}
              href={resource.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-border bg-card p-3 transition hover:bg-muted"
            >
              <p className="text-sm font-semibold text-foreground">
                {resource.label}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {resource.description}
              </p>
            </a>
          ))}
        </div>
      </aside>

      <main className="flex min-h-[calc(100svh-5rem)] w-full flex-col">
        <section className="w-full">
          <div className="w-full">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 pt-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-input bg-background hover:bg-muted"
                  aria-label="Open resources menu"
                >
                  <span className="space-y-1">
                    <span className="block h-0.5 w-4 bg-foreground" />
                    <span className="block h-0.5 w-4 bg-foreground" />
                    <span className="block h-0.5 w-4 bg-foreground" />
                  </span>
                </button>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    Housing Search
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://resumebuilder.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-transparent bg-foreground px-3 text-sm font-medium text-background transition hover:opacity-90"
                >
                  AI Resume Builder
                </a>
                <Link
                  href="/profile"
                  className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-border bg-muted transition hover:opacity-90"
                  aria-label="Open profile"
                  title="Profile"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-muted-foreground">
                      {displayName.slice(0, 1).toUpperCase() || "U"}
                    </span>
                  )}
                </Link>
                <Button type="button" variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 px-4 sm:px-6 lg:px-8">
              <label className="flex min-w-[220px] flex-1 items-center rounded-xl border border-input bg-background px-3">
                <span className="mr-2 text-sm text-muted-foreground">
                  Search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-11 w-full bg-transparent text-sm text-foreground outline-none"
                  placeholder="City, zip, or neighborhood"
                />
              </label>

              {["Lowest Rent", "Near Transit", "Move-in This Month"].map(
                (filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-xl border px-4 py-2.5 text-sm transition ${
                      activeFilter === filter
                        ? "border-foreground bg-foreground text-background"
                        : "border-input bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {filter}
                  </button>
                ),
              )}
            </div>

            <div
              className="flex-1 grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px] px-4 sm:px-6 lg:px-8 py-4"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            >
              <div className="relative min-h-[520px] overflow-hidden rounded-2xl border border-border/80 bg-muted/50 will-change-auto">
                <div className="absolute left-3 top-3 rounded-lg border border-border/80 bg-background/95 px-3 py-2 shadow-sm">
                  <p className="text-xs font-medium text-muted-foreground">
                    {activeFilter}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {listings.length} affordable matches in {searchQuery}
                  </p>
                </div>

                {mapPins.map((pin) => (
                  <button
                    key={pin.id}
                    type="button"
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm transition hover:scale-105 ${
                      pin.featured
                        ? "border-emerald-700 bg-emerald-700 text-white"
                        : "border-rose-800 bg-rose-700 text-white"
                    }`}
                    style={{ top: pin.top, left: pin.left }}
                  >
                    ${pin.rent}
                  </button>
                ))}

                <div className="absolute bottom-3 right-3 rounded-xl border border-border/70 bg-background/95 px-3 py-2 text-xs text-muted-foreground">
                  Map preview for housing clusters
                </div>
              </div>

              <aside
                className="max-h-[520px] space-y-3 overflow-y-auto rounded-2xl border border-border/80 bg-muted/40 p-3 will-change-auto scrollbar-gutter-stable"
                style={{
                  scrollBehavior: "smooth",
                  WebkitOverflowScrolling: "touch",
                  contain: "layout paint",
                }}
              >
                {listings.map((listing) => (
                  <article
                    key={listing.id}
                    className="rounded-xl border border-border bg-background p-3 shadow-sm flex-shrink-0"
                    style={{ contain: "content" }}
                  >
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {listing.neighborhood}
                      </p>
                      <h2 className="mt-1 text-base font-semibold text-foreground">
                        {listing.title}
                      </h2>
                    </div>

                    <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                      ${listing.rent}
                      <span className="ml-1 text-sm font-medium text-muted-foreground">
                        /month
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {listing.beds === 0 ? "Studio" : `${listing.beds} bd`} |{" "}
                      {listing.baths} ba | {listing.sqft} sqft
                    </p>

                    <p className="mt-2 text-sm text-foreground/85">
                      {listing.supportNote}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <Button type="button" className="h-9 px-3 text-xs">
                        Request intro
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 px-3 text-xs"
                      >
                        Save
                      </Button>
                    </div>
                  </article>
                ))}
              </aside>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
