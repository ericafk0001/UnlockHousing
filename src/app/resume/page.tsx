"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import {
  ResumeFormBuilder,
  type ResumeFormData,
} from "@/components/resume/resume-form-builder";
import { ResumePreview } from "@/components/resume/resume-preview";
import { generateResumePDF } from "@/components/resume/pdf-generator";

type ProfileRow = {
  first_name: string | null;
  avatar_url: string | null;
};

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

export default function ResumePage() {
  const router = useRouter();
  const [supabase, setSupabase] = useState<ReturnType<
    typeof createSupabaseBrowserClient
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState("there");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<ResumeFormData>({
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
  });

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

  const handleExportPDF = async () => {
    try {
      await generateResumePDF(formData, "my-resume.pdf");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
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

      <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-50 to-slate-100">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
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
                  AI Resume Builder
                </h1>
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                  {isLoading
                    ? "Loading your dashboard..."
                    : `Welcome back, ${displayName}. Build and export your resume.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/homepage"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-emerald-700 bg-emerald-600 px-3 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Housing Search
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
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 flex justify-center">
              <FileText className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              AI Resume Builder
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Build your resume with a step-by-step form and live preview
            </p>

            <div className="mx-auto mt-6 max-w-4xl rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-left">
              <p className="text-sm text-amber-900">
                This resume builder was developed with the assistance of Alibaba
                Cloud&apos;s Qwen 3 to assist in generating resume content based
                on the information that you provided. The AI-generated
                suggestions are for drafting purposes only, and should not be
                considered professional advice. While we strive for accuracy, we
                cannot guarantee that the generated content will be error-free
                nor will the generated content be tailored to specific job
                postings. Please ensure that you review and verify all
                information prior to using it in any professional context.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ResumeFormBuilder onDataChange={setFormData} />
                <div className="mt-8 flex">
                  <button
                    onClick={handleExportPDF}
                    className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700"
                  >
                    Download as PDF
                  </button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="sticky top-20 max-h-[calc(100vh-120px)]">
                  <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
                  <ResumePreview data={formData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
