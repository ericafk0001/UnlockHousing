"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
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
  lat: number;
  lng: number;
  imageUrl: string;
};

type NewListingForm = {
  listingTitle: string;
  streetAddress: string;
  neighborhood: string;
  monthlyRent: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  contactEmail: string;
  ownerFullName: string;
  opaAccountNumber: string;
  propertyLookupUrl: string;
  supportNote: string;
  certifyOwnership: boolean;
};

const defaultNewListingForm: NewListingForm = {
  listingTitle: "",
  streetAddress: "",
  neighborhood: "",
  monthlyRent: "",
  bedrooms: "",
  bathrooms: "",
  squareFeet: "",
  contactEmail: "",
  ownerFullName: "",
  opaAccountNumber: "",
  propertyLookupUrl: "",
  supportNote: "",
  certifyOwnership: false,
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
    lat: 39.9896,
    lng: -75.1426,
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
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
    lat: 39.9526,
    lng: -75.2205,
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
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
    lat: 39.9945,
    lng: -75.1299,
    imageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
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
    lat: 39.9286,
    lng: -75.1629,
    imageUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=400&h=300&fit=crop",
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
    lat: 40.0406,
    lng: -75.1387,
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    title: "Modern 2BR Loft",
    neighborhood: "Fishtown",
    rent: 950,
    beds: 2,
    baths: 1.5,
    sqft: 850,
    supportNote: "Inclusive community focus, supportive management team.",
    lat: 39.9659,
    lng: -75.1372,
    imageUrl:
      "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400&h=300&fit=crop",
  },
  {
    id: 7,
    title: "Studio Near Center City",
    neighborhood: "University City",
    rent: 725,
    beds: 0,
    baths: 1,
    sqft: 500,
    supportNote: "Walking distance to public transit and resources.",
    lat: 39.9495,
    lng: -75.1933,
    imageUrl:
      "https://images.unsplash.com/photo-1675675784246-f2147bbed60d?w=400&h=300&fit=crop",
  },
  {
    id: 8,
    title: "Spacious 3BR Townhouse",
    neighborhood: "Northeast Philadelphia",
    rent: 1100,
    beds: 3,
    baths: 2,
    sqft: 1200,
    supportNote: "Family-friendly building with on-site support services.",
    lat: 40.0614,
    lng: -75.0651,
    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
  },
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

const MapComponent = dynamic(() => import("@/components/interactive-map"), {
  ssr: false,
});

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
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [pendingIntroduction, setPendingIntroduction] =
    useState<Listing | null>(null);
  const [requestSuccessMessage, setRequestSuccessMessage] = useState<
    string | null
  >(null);
  const [isNewListingOpen, setIsNewListingOpen] = useState(false);
  const [newListingForm, setNewListingForm] = useState<NewListingForm>(
    defaultNewListingForm,
  );
  const [newListingError, setNewListingError] = useState<string | null>(null);
  const [newListingSuccess, setNewListingSuccess] = useState<string | null>(
    null,
  );

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

  const handleRequestIntroduction = (listing: Listing) => {
    setPendingIntroduction(listing);
  };

  const confirmIntroductionRequest = () => {
    if (!pendingIntroduction) {
      return;
    }

    setRequestSuccessMessage(
      `Your introduction request for ${pendingIntroduction.title} has been recorded. A housing coordinator will follow up soon.`,
    );
    setPendingIntroduction(null);
  };

  const updateNewListingField = <K extends keyof NewListingForm>(
    field: K,
    value: NewListingForm[K],
  ) => {
    setNewListingForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitNewListing = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewListingError(null);

    const lookupUrl = newListingForm.propertyLookupUrl.trim();
    if (!/^https?:\/\/property\.phila\.gov/i.test(lookupUrl)) {
      setNewListingError(
        "Please include a valid property.phila.gov verification link.",
      );
      return;
    }

    if (!newListingForm.certifyOwnership) {
      setNewListingError(
        "You must certify that you are authorized to list this property.",
      );
      return;
    }

    setIsNewListingOpen(false);
    setNewListingSuccess(
      `Listing submission received for ${newListingForm.streetAddress}. Verification via property.phila.gov is marked as complete (proof of concept).`,
    );
    setNewListingForm(defaultNewListingForm);
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
        className={`fixed left-0 top-0 z-50 h-full w-[320px] border-r border-emerald-200/70 bg-white/95 p-4 shadow-xl backdrop-blur transition-transform duration-300 will-change-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="External housing resources"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Resources</h2>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-sm text-emerald-900 transition hover:bg-emerald-100"
          >
            Close
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Trusted external support links for housing, legal aid, and reentry.
        </p>

        <div className="mt-4 space-y-3">
          {externalResources.map((resource) => (
            <a
              key={resource.label}
              href={resource.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-sky-200/80 bg-gradient-to-br from-white to-sky-50 p-3 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-sm"
            >
              <p className="text-sm font-semibold text-slate-900">
                {resource.label}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {resource.description}
              </p>
            </a>
          ))}
        </div>
      </aside>

      <main className="flex min-h-[calc(100svh-5rem)] w-full flex-col bg-gradient-to-b from-emerald-50/70 via-sky-50/60 to-amber-50/65">
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
                  <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                    Housing Search
                  </h1>
                  <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                    {isLoading
                      ? "Loading your dashboard..."
                      : `Welcome back, ${displayName}. Affordable homes for formerly incarcerated neighbors.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setNewListingError(null);
                    setIsNewListingOpen(true);
                  }}
                >
                  New Listing
                </Button>
                <Link
                  href="/resume"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-emerald-700 bg-emerald-600 px-3 text-sm font-medium text-white transition hover:bg-emerald-700"
                >
                  AI Resume Builder
                </Link>
                <Link
                  href="/profile"
                  className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-sky-300 bg-sky-100 transition hover:opacity-90"
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
                    <span className="text-sm font-semibold text-slate-700">
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
              <label className="flex min-w-[220px] flex-1 items-center rounded-xl border border-sky-200 bg-white/90 px-3 shadow-sm">
                <span className="mr-2 text-sm text-slate-600">Search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-11 w-full bg-transparent text-sm text-slate-900 outline-none"
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
                        ? "border-emerald-700 bg-emerald-600 text-white"
                        : "border-sky-200 bg-white/90 text-slate-700 hover:bg-sky-50"
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
              <MapComponent
                listings={listings}
                onPinClick={setSelectedListing}
              />

              <aside
                className="max-h-[520px] space-y-3 overflow-y-auto rounded-2xl border border-sky-200/80 bg-white/85 p-3 shadow-[0_8px_24px_rgba(2,132,199,0.08)]"
                style={{
                  WebkitOverflowScrolling: "touch",
                  contain: "strict",
                  willChange: "scroll-position",
                }}
              >
                {listings.map((listing) => (
                  <article
                    key={listing.id}
                    className="cursor-pointer rounded-xl border border-sky-100 bg-gradient-to-br from-white to-emerald-50/40 p-3 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                    style={{ contain: "paint", backfaceVisibility: "hidden" }}
                    onClick={() => setSelectedListing(listing)}
                  >
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-sky-700">
                        {listing.neighborhood}
                      </p>
                      <h2 className="mt-1 text-base font-semibold text-slate-900">
                        {listing.title}
                      </h2>
                    </div>

                    <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-700">
                      ${listing.rent}
                      <span className="ml-1 text-sm font-medium text-slate-500">
                        /month
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {listing.beds === 0 ? "Studio" : `${listing.beds} bd`} |{" "}
                      {listing.baths} ba | {listing.sqft} sqft
                    </p>

                    <p className="mt-2 text-sm text-slate-700">
                      {listing.supportNote}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        type="button"
                        className="h-9 px-3 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedListing(listing);
                        }}
                      >
                        Request intro
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 px-3 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Save
                      </Button>
                    </div>
                  </article>
                ))}
              </aside>
            </div>

            {selectedListing && (
              <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/35 p-4 sm:items-center">
                <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-sky-200 bg-white shadow-xl">
                  <div className="sticky top-0 z-10 flex items-center justify-between border-b border-sky-100 bg-gradient-to-r from-white via-sky-50 to-emerald-50 px-6 py-4 backdrop-blur">
                    <h2 className="text-2xl font-semibold text-slate-900">
                      {selectedListing.title}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setSelectedListing(null)}
                      className="rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-sky-50"
                    >
                      Close
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <img
                      src={selectedListing.imageUrl}
                      alt={selectedListing.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-64 object-cover rounded-xl border border-border"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Location</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {selectedListing.neighborhood}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Monthly Rent</p>
                        <p className="text-3xl font-bold text-emerald-700">
                          ${selectedListing.rent}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 rounded-xl bg-gradient-to-r from-sky-50 to-emerald-50 p-4">
                      <div className="text-center">
                        <p className="text-xs text-slate-500">Bedrooms</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {selectedListing.beds === 0
                            ? "Studio"
                            : selectedListing.beds}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500">Bathrooms</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {selectedListing.baths}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500">Sq. Ft.</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {selectedListing.sqft}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 font-semibold text-slate-900">
                        Housing Support
                      </h3>
                      <p className="text-sm text-slate-700">
                        {selectedListing.supportNote}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        className="flex-1"
                        onClick={() =>
                          handleRequestIntroduction(selectedListing)
                        }
                      >
                        Request Introduction
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                      >
                        Save Listing
                      </Button>
                    </div>

                    <p className="text-xs text-slate-500">
                      Disclaimer: By requesting an introduction, you voluntarily
                      agree to share your submitted contact and profile
                      information with the housing provider.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {pendingIntroduction && (
              <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/45 p-4 sm:items-center">
                <div className="w-full max-w-lg rounded-2xl border border-sky-200 bg-white shadow-2xl">
                  <div className="border-b border-sky-100 px-5 py-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Confirm Information Sharing
                    </h3>
                  </div>
                  <div className="space-y-4 px-5 py-4">
                    <p className="text-sm text-slate-700">
                      You are requesting an introduction for{" "}
                      <span className="font-semibold text-slate-900">
                        {pendingIntroduction.title}
                      </span>
                      .
                    </p>
                    <p className="text-sm text-slate-700">
                      By continuing, you voluntarily agree to share your
                      submitted profile and contact information with this
                      housing provider for application review.
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2 border-t border-sky-100 px-5 py-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPendingIntroduction(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="button" onClick={confirmIntroductionRequest}>
                      I Agree, Continue
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {requestSuccessMessage && (
              <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/45 p-4 sm:items-center">
                <div className="w-full max-w-lg rounded-2xl border border-emerald-200 bg-white shadow-2xl">
                  <div className="border-b border-emerald-100 px-5 py-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Request Sent
                    </h3>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-sm text-slate-700">
                      {requestSuccessMessage}
                    </p>
                  </div>
                  <div className="flex justify-end border-t border-emerald-100 px-5 py-4">
                    <Button
                      type="button"
                      onClick={() => setRequestSuccessMessage(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {isNewListingOpen && (
              <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/45 p-4 sm:items-center">
                <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-sky-200 bg-white shadow-2xl">
                  <div className="sticky top-0 z-10 flex items-center justify-between border-b border-sky-100 bg-gradient-to-r from-white via-sky-50 to-emerald-50 px-6 py-4">
                    <h3 className="text-xl font-semibold text-slate-900">
                      Submit New Listing
                    </h3>
                    <button
                      type="button"
                      className="rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-sky-50"
                      onClick={() => setIsNewListingOpen(false)}
                    >
                      Close
                    </button>
                  </div>

                  <form className="space-y-6 p-6" onSubmit={submitNewListing}>
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                        Required Listing Details
                      </h4>
                      <p className="mt-1 text-xs text-slate-500">
                        All fields below are required for this proof-of-concept
                        listing intake.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-1 text-sm text-slate-700">
                        <span>Listing Title *</span>
                        <input
                          required
                          type="text"
                          value={newListingForm.listingTitle}
                          onChange={(event) =>
                            updateNewListingField(
                              "listingTitle",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-sky-200 px-3 py-2 outline-none focus:border-emerald-400"
                          placeholder="2BR Row Home Near Transit"
                        />
                      </label>

                      <label className="space-y-1 text-sm text-slate-700">
                        <span>Street Address *</span>
                        <input
                          required
                          type="text"
                          value={newListingForm.streetAddress}
                          onChange={(event) =>
                            updateNewListingField(
                              "streetAddress",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-sky-200 px-3 py-2 outline-none focus:border-emerald-400"
                          placeholder="1234 W Girard Ave, Philadelphia, PA"
                        />
                      </label>

                      <label className="space-y-1 text-sm text-slate-700">
                        <span>Neighborhood *</span>
                        <input
                          required
                          type="text"
                          value={newListingForm.neighborhood}
                          onChange={(event) =>
                            updateNewListingField(
                              "neighborhood",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-sky-200 px-3 py-2 outline-none focus:border-emerald-400"
                          placeholder="North Philadelphia"
                        />
                      </label>

                      <label className="space-y-1 text-sm text-slate-700">
                        <span>Contact Email *</span>
                        <input
                          required
                          type="email"
                          value={newListingForm.contactEmail}
                          onChange={(event) =>
                            updateNewListingField(
                              "contactEmail",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-sky-200 px-3 py-2 outline-none focus:border-emerald-400"
                          placeholder="owner@example.com"
                        />
                      </label>

                      <label className="space-y-1 text-sm text-slate-700">
                        <span>Monthly Rent (USD) *</span>
                        <input
                          required
                          min={1}
                          type="number"
                          value={newListingForm.monthlyRent}
                          onChange={(event) =>
                            updateNewListingField(
                              "monthlyRent",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-sky-200 px-3 py-2 outline-none focus:border-emerald-400"
                          placeholder="850"
                        />
                      </label>

                      <label className="space-y-1 text-sm text-slate-700">
                        <span>Bedrooms *</span>
                        <input
                          required
                          min={0}
                          type="number"
                          value={newListingForm.bedrooms}
                          onChange={(event) =>
                            updateNewListingField(
                              "bedrooms",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-sky-200 px-3 py-2 outline-none focus:border-emerald-400"
                          placeholder="2"
                        />
                      </label>

                      <label className="space-y-1 text-sm text-slate-700">
                        <span>Bathrooms *</span>
                        <input
                          required
                          min={0}
                          step="0.5"
                          type="number"
                          value={newListingForm.bathrooms}
                          onChange={(event) =>
                            updateNewListingField(
                              "bathrooms",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-sky-200 px-3 py-2 outline-none focus:border-emerald-400"
                          placeholder="1"
                        />
                      </label>

                      <label className="space-y-1 text-sm text-slate-700">
                        <span>Square Feet *</span>
                        <input
                          required
                          min={100}
                          type="number"
                          value={newListingForm.squareFeet}
                          onChange={(event) =>
                            updateNewListingField(
                              "squareFeet",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-sky-200 px-3 py-2 outline-none focus:border-emerald-400"
                          placeholder="860"
                        />
                      </label>
                    </div>

                    <label className="space-y-1 text-sm text-slate-700">
                      <span>Housing Support Note *</span>
                      <textarea
                        required
                        rows={3}
                        value={newListingForm.supportNote}
                        onChange={(event) =>
                          updateNewListingField(
                            "supportNote",
                            event.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-sky-200 px-3 py-2 outline-none focus:border-emerald-400"
                        placeholder="Describe fair-chance or supportive housing policies for applicants."
                      />
                    </label>

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-emerald-900">
                        Ownership Verification (property.phila.gov)
                      </h4>
                      <p className="mt-1 text-xs text-emerald-800">
                        Proof of concept: provide matching ownership details
                        from property.phila.gov so this listing can be reviewed.
                      </p>
                      <a
                        href="https://property.phila.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex text-xs font-medium text-emerald-900 underline"
                      >
                        Open property.phila.gov
                      </a>

                      <div className="mt-3 grid gap-4 sm:grid-cols-2">
                        <label className="space-y-1 text-sm text-slate-700">
                          <span>Owner Name on Record *</span>
                          <input
                            required
                            type="text"
                            value={newListingForm.ownerFullName}
                            onChange={(event) =>
                              updateNewListingField(
                                "ownerFullName",
                                event.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 outline-none focus:border-emerald-400"
                            placeholder="Name listed on property record"
                          />
                        </label>

                        <label className="space-y-1 text-sm text-slate-700">
                          <span>OPA Account Number *</span>
                          <input
                            required
                            type="text"
                            value={newListingForm.opaAccountNumber}
                            onChange={(event) =>
                              updateNewListingField(
                                "opaAccountNumber",
                                event.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 outline-none focus:border-emerald-400"
                            placeholder="123456700"
                          />
                        </label>
                      </div>

                      <label className="mt-4 block space-y-1 text-sm text-slate-700">
                        <span>property.phila.gov Property Link *</span>
                        <input
                          required
                          type="url"
                          value={newListingForm.propertyLookupUrl}
                          onChange={(event) =>
                            updateNewListingField(
                              "propertyLookupUrl",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 outline-none focus:border-emerald-400"
                          placeholder="https://property.phila.gov/?p=..."
                        />
                      </label>

                      <label className="mt-4 flex items-start gap-2 text-sm text-slate-700">
                        <input
                          required
                          type="checkbox"
                          checked={newListingForm.certifyOwnership}
                          onChange={(event) =>
                            updateNewListingField(
                              "certifyOwnership",
                              event.target.checked,
                            )
                          }
                          className="mt-0.5 rounded"
                        />
                        <span>
                          I certify that I am the property owner or an
                          authorized representative and that the verification
                          information above is accurate.
                        </span>
                      </label>
                    </div>

                    {newListingError && (
                      <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {newListingError}
                      </p>
                    )}

                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsNewListingOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Submit for Verification</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {newListingSuccess && (
              <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/45 p-4 sm:items-center">
                <div className="w-full max-w-lg rounded-2xl border border-emerald-200 bg-white shadow-2xl">
                  <div className="border-b border-emerald-100 px-5 py-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Listing Submitted
                    </h3>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-sm text-slate-700">
                      {newListingSuccess}
                    </p>
                  </div>
                  <div className="flex justify-end border-t border-emerald-100 px-5 py-4">
                    <Button
                      type="button"
                      onClick={() => setNewListingSuccess(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
