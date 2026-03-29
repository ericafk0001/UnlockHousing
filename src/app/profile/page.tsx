"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type ProfileRow = {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
};

type YesNoValue = "yes" | "no" | "";

type TenantQuestionnaire = {
  dateOfBirth: string;
  highestEducationLevel: string;
  school: string;
  graduationDate: string;
  majorDegree: string;
  employmentStatus: "" | "employed" | "unemployed";
  currentEmployer: string;
  currentPosition: string;
  fullTimePartTimeStatus: string;
  lengthOfEmployment: string;
  monthlyIncome: string;
  employedSupervisorContact: string;
  employedPermissionToContactSupervisor: YesNoValue;
  recentEmployer: string;
  unemployedEmploymentDates: string;
  unemployedSupervisorContact: string;
  unemployedPermissionToContactSupervisor: YesNoValue;
  reasonForLeaving: string;
  currentlySeekingEmployment: YesNoValue;
  otherIncomeSources: string;
  previousAddresses: string;
  lengthOfStays: string;
  leaseViolationsOrEvictions: string;
  previousLandlordContacts: string;
  permissionToContactPreviousLandlords: YesNoValue;
  references: string;
  misdemeanorConvictionPast5Years: YesNoValue;
  felonyConvictionPast5Years: YesNoValue;
  convictionDetails: string;
  sexOffenderRegistration: YesNoValue;
  pendingCharges: YesNoValue;
  pendingChargesDetails: string;
  additionalInfoForHomeowners: string;
};

const TENANT_QUESTIONNAIRE_STORAGE_KEY = "uh_tenant_questionnaire_v1";
const TENANT_QUESTIONNAIRE_COMPLETE_KEY = "uh_tenant_questionnaire_complete";

const defaultTenantQuestionnaire: TenantQuestionnaire = {
  dateOfBirth: "",
  highestEducationLevel: "",
  school: "",
  graduationDate: "",
  majorDegree: "",
  employmentStatus: "",
  currentEmployer: "",
  currentPosition: "",
  fullTimePartTimeStatus: "",
  lengthOfEmployment: "",
  monthlyIncome: "",
  employedSupervisorContact: "",
  employedPermissionToContactSupervisor: "",
  recentEmployer: "",
  unemployedEmploymentDates: "",
  unemployedSupervisorContact: "",
  unemployedPermissionToContactSupervisor: "",
  reasonForLeaving: "",
  currentlySeekingEmployment: "",
  otherIncomeSources: "",
  previousAddresses: "",
  lengthOfStays: "",
  leaseViolationsOrEvictions: "",
  previousLandlordContacts: "",
  permissionToContactPreviousLandlords: "",
  references: "",
  misdemeanorConvictionPast5Years: "",
  felonyConvictionPast5Years: "",
  convictionDetails: "",
  sexOffenderRegistration: "",
  pendingCharges: "",
  pendingChargesDetails: "",
  additionalInfoForHomeowners: "",
};

const getFileExtension = (filename: string) => {
  const parts = filename.split(".");
  if (parts.length < 2) {
    return "jpg";
  }
  return parts[parts.length - 1].toLowerCase();
};

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

export default function ProfilePage() {
  const router = useRouter();
  const [supabase, setSupabase] = useState<ReturnType<
    typeof createSupabaseBrowserClient
  > | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [tenantQuestionnaire, setTenantQuestionnaire] =
    useState<TenantQuestionnaire>(defaultTenantQuestionnaire);

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient());
  }, []);

  useEffect(() => {
    const raw = window.localStorage.getItem(TENANT_QUESTIONNAIRE_STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<TenantQuestionnaire>;
      setTenantQuestionnaire({
        ...defaultTenantQuestionnaire,
        ...parsed,
      });
    } catch {
      window.localStorage.removeItem(TENANT_QUESTIONNAIRE_STORAGE_KEY);
      window.localStorage.removeItem(TENANT_QUESTIONNAIRE_COMPLETE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isCancelled = false;

    const loadProfile = async () => {
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

      setUserId(user.id);
      setEmail(user.email ?? "");

      const metadata = user.user_metadata ?? {};

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name,last_name,phone,avatar_url")
        .eq("id", user.id)
        .maybeSingle<ProfileRow>();

      if (isCancelled) {
        return;
      }

      if (error) {
        setStatusMessage(
          "Profile table is not ready yet. Follow the Supabase setup steps below.",
        );
        setFirstName(String(metadata.first_name ?? ""));
        setLastName(String(metadata.last_name ?? ""));
        setPhone(String(metadata.phone ?? ""));
        const metadataAvatar = String(metadata.avatar_url ?? "").trim();
        if (metadataAvatar) {
          setAvatarPath(metadataAvatar);
          setAvatarUrl(await resolveAvatarDisplayUrl(supabase, metadataAvatar));
        }
        setIsLoading(false);
        return;
      }

      setFirstName(data?.first_name ?? String(metadata.first_name ?? ""));
      setLastName(data?.last_name ?? String(metadata.last_name ?? ""));
      setPhone(data?.phone ?? String(metadata.phone ?? ""));
      const metadataAvatar = String(metadata.avatar_url ?? "").trim();
      const storedAvatar = data?.avatar_url ?? (metadataAvatar || null);

      if (storedAvatar) {
        setAvatarPath(storedAvatar);
        setAvatarUrl(await resolveAvatarDisplayUrl(supabase, storedAvatar));
      } else {
        setAvatarPath(null);
        setAvatarUrl(null);
      }
      setIsLoading(false);
    };

    void loadProfile();

    return () => {
      isCancelled = true;
    };
  }, [router, supabase]);

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userId) {
      setStatusMessage("Not authenticated. Please sign in again.");
      return;
    }

    if (!supabase) {
      setStatusMessage("Initialization error. Please refresh the page.");
      return;
    }

    const isBlank = (value: string) => value.trim().length === 0;

    if (
      isBlank(tenantQuestionnaire.dateOfBirth) ||
      isBlank(tenantQuestionnaire.highestEducationLevel) ||
      isBlank(tenantQuestionnaire.school) ||
      isBlank(tenantQuestionnaire.graduationDate) ||
      isBlank(tenantQuestionnaire.majorDegree) ||
      isBlank(tenantQuestionnaire.employmentStatus) ||
      isBlank(tenantQuestionnaire.previousAddresses) ||
      isBlank(tenantQuestionnaire.lengthOfStays) ||
      isBlank(tenantQuestionnaire.leaseViolationsOrEvictions) ||
      isBlank(tenantQuestionnaire.previousLandlordContacts) ||
      isBlank(tenantQuestionnaire.permissionToContactPreviousLandlords) ||
      isBlank(tenantQuestionnaire.references) ||
      isBlank(tenantQuestionnaire.sexOffenderRegistration)
    ) {
      setStatusMessage(
        "Please complete all required tenant questionnaire fields before saving.",
      );
      return;
    }

    if (tenantQuestionnaire.employmentStatus === "employed") {
      if (
        isBlank(tenantQuestionnaire.currentEmployer) ||
        isBlank(tenantQuestionnaire.currentPosition) ||
        isBlank(tenantQuestionnaire.fullTimePartTimeStatus) ||
        isBlank(tenantQuestionnaire.lengthOfEmployment) ||
        isBlank(tenantQuestionnaire.monthlyIncome) ||
        isBlank(tenantQuestionnaire.employedSupervisorContact) ||
        isBlank(tenantQuestionnaire.employedPermissionToContactSupervisor)
      ) {
        setStatusMessage(
          "Please complete all required employed fields in the questionnaire.",
        );
        return;
      }
    }

    if (tenantQuestionnaire.employmentStatus === "unemployed") {
      if (
        isBlank(tenantQuestionnaire.recentEmployer) ||
        isBlank(tenantQuestionnaire.unemployedEmploymentDates) ||
        isBlank(tenantQuestionnaire.unemployedSupervisorContact) ||
        isBlank(tenantQuestionnaire.unemployedPermissionToContactSupervisor) ||
        isBlank(tenantQuestionnaire.reasonForLeaving) ||
        isBlank(tenantQuestionnaire.currentlySeekingEmployment) ||
        isBlank(tenantQuestionnaire.otherIncomeSources)
      ) {
        setStatusMessage(
          "Please complete all required unemployed fields in the questionnaire.",
        );
        return;
      }
    }

    if (
      tenantQuestionnaire.misdemeanorConvictionPast5Years === "yes" ||
      tenantQuestionnaire.felonyConvictionPast5Years === "yes"
    ) {
      if (isBlank(tenantQuestionnaire.convictionDetails)) {
        setStatusMessage(
          "Please provide conviction details for voluntary criminal history disclosures.",
        );
        return;
      }
    }

    if (tenantQuestionnaire.pendingCharges === "yes") {
      if (isBlank(tenantQuestionnaire.pendingChargesDetails)) {
        setStatusMessage(
          "Please provide details for pending charges when marked yes.",
        );
        return;
      }
    }

    setIsSaving(true);
    setStatusMessage("");

    const { error } = await supabase.from("profiles").upsert(
      {
        id: userId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        avatar_url: avatarPath,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        avatar_url: avatarPath,
      },
    });

    setIsSaving(false);

    if (error || metadataError) {
      setStatusMessage(
        `Could not fully save profile. ${error?.message ?? metadataError?.message ?? "Check profiles table and RLS policies in Supabase."}`,
      );
      return;
    }

    window.localStorage.setItem(
      TENANT_QUESTIONNAIRE_STORAGE_KEY,
      JSON.stringify(tenantQuestionnaire),
    );
    window.localStorage.setItem(TENANT_QUESTIONNAIRE_COMPLETE_KEY, "true");

    setStatusMessage(
      "Profile and tenant questionnaire saved. You can now apply for housing.",
    );
  };

  const updateTenantQuestionnaire = <K extends keyof TenantQuestionnaire>(
    field: K,
    value: TenantQuestionnaire[K],
  ) => {
    setTenantQuestionnaire((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) {
      return;
    }

    if (!supabase) {
      setStatusMessage("Initialization error. Please refresh the page.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatusMessage("Please upload an image file.");
      return;
    }

    setIsUploading(true);
    setStatusMessage("");

    const extension = getFileExtension(file.name);
    const filePath = `${userId}/avatar.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setIsUploading(false);
      setStatusMessage(`Could not upload image. ${uploadError.message}`);
      return;
    }

    const displayUrl = await resolveAvatarDisplayUrl(supabase, filePath);
    setAvatarPath(filePath);
    setAvatarUrl(displayUrl);

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: userId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        avatar_url: filePath,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        avatar_url: filePath,
      },
    });

    setIsUploading(false);

    if (profileError || metadataError) {
      setStatusMessage(
        `Avatar uploaded, but profile sync failed. ${profileError?.message ?? metadataError?.message ?? "Please check Supabase policies."}`,
      );
      return;
    }

    setStatusMessage("Avatar uploaded and saved.");
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    router.replace("/");
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  return (
    <main className="mx-auto flex min-h-[calc(100svh-7rem)] w-full max-w-5xl flex-1 items-center justify-center px-4 pb-12 pt-24 sm:px-6 lg:px-8">
      <section className="w-full rounded-3xl border border-border bg-card/90 p-6 shadow-md backdrop-blur sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Button
              type="button"
              variant="ghost"
              onClick={handleGoBack}
              className="-ml-3 mb-2"
            >
              Go Back
            </Button>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Your Profile
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Manage your name, phone number, and profile picture.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Loading profile...
          </p>
        ) : (
          <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-24 w-24 overflow-hidden rounded-full border border-border bg-muted">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    No photo
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="avatar"
                  className="text-sm font-medium text-foreground"
                >
                  Profile Picture
                </label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isUploading}
                  className="block text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-1.5 file:text-sm file:text-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  {isUploading ? "Uploading..." : "JPG/PNG/WebP recommended"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-foreground"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-foreground"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                  required
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-muted/25 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-foreground sm:text-xl">
                Tenant Questionnaire
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Complete this questionnaire before applying for a house.
              </p>

              <div className="mt-5 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
                    Basic Information
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="dateOfBirth"
                        className="text-sm font-medium text-foreground"
                      >
                        Date of Birth
                      </label>
                      <input
                        id="dateOfBirth"
                        type="date"
                        value={tenantQuestionnaire.dateOfBirth}
                        onChange={(event) =>
                          updateTenantQuestionnaire(
                            "dateOfBirth",
                            event.target.value,
                          )
                        }
                        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
                    Education Information
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="highestEducationLevel"
                        className="text-sm font-medium text-foreground"
                      >
                        Highest Level of Education
                      </label>
                      <input
                        id="highestEducationLevel"
                        type="text"
                        value={tenantQuestionnaire.highestEducationLevel}
                        onChange={(event) =>
                          updateTenantQuestionnaire(
                            "highestEducationLevel",
                            event.target.value,
                          )
                        }
                        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="school"
                        className="text-sm font-medium text-foreground"
                      >
                        School
                      </label>
                      <input
                        id="school"
                        type="text"
                        value={tenantQuestionnaire.school}
                        onChange={(event) =>
                          updateTenantQuestionnaire("school", event.target.value)
                        }
                        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="graduationDate"
                        className="text-sm font-medium text-foreground"
                      >
                        Graduation Date
                      </label>
                      <input
                        id="graduationDate"
                        type="month"
                        value={tenantQuestionnaire.graduationDate}
                        onChange={(event) =>
                          updateTenantQuestionnaire(
                            "graduationDate",
                            event.target.value,
                          )
                        }
                        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="majorDegree"
                        className="text-sm font-medium text-foreground"
                      >
                        Major / Degree
                      </label>
                      <input
                        id="majorDegree"
                        type="text"
                        value={tenantQuestionnaire.majorDegree}
                        onChange={(event) =>
                          updateTenantQuestionnaire(
                            "majorDegree",
                            event.target.value,
                          )
                        }
                        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
                    Employment Information
                  </h3>

                  <div className="space-y-2">
                    <label
                      htmlFor="employmentStatus"
                      className="text-sm font-medium text-foreground"
                    >
                      Current Employment Status
                    </label>
                    <select
                      id="employmentStatus"
                      value={tenantQuestionnaire.employmentStatus}
                      onChange={(event) =>
                        updateTenantQuestionnaire(
                          "employmentStatus",
                          event.target.value as TenantQuestionnaire["employmentStatus"],
                        )
                      }
                      className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                      required
                    >
                      <option value="">Select status</option>
                      <option value="employed">Employed</option>
                      <option value="unemployed">Unemployed</option>
                    </select>
                  </div>

                  {tenantQuestionnaire.employmentStatus === "employed" ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="currentEmployer"
                          className="text-sm font-medium text-foreground"
                        >
                          Current Employer
                        </label>
                        <input
                          id="currentEmployer"
                          type="text"
                          value={tenantQuestionnaire.currentEmployer}
                          onChange={(event) =>
                            updateTenantQuestionnaire(
                              "currentEmployer",
                              event.target.value,
                            )
                          }
                          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="currentPosition"
                          className="text-sm font-medium text-foreground"
                        >
                          Current Position
                        </label>
                        <input
                          id="currentPosition"
                          type="text"
                          value={tenantQuestionnaire.currentPosition}
                          onChange={(event) =>
                            updateTenantQuestionnaire(
                              "currentPosition",
                              event.target.value,
                            )
                          }
                          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="fullTimePartTimeStatus"
                          className="text-sm font-medium text-foreground"
                        >
                          Full-time or Part-time Status
                        </label>
                        <input
                          id="fullTimePartTimeStatus"
                          type="text"
                          value={tenantQuestionnaire.fullTimePartTimeStatus}
                          onChange={(event) =>
                            updateTenantQuestionnaire(
                              "fullTimePartTimeStatus",
                              event.target.value,
                            )
                          }
                          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="lengthOfEmployment"
                          className="text-sm font-medium text-foreground"
                        >
                          Length of Employment
                        </label>
                        <input
                          id="lengthOfEmployment"
                          type="text"
                          value={tenantQuestionnaire.lengthOfEmployment}
                          onChange={(event) =>
                            updateTenantQuestionnaire(
                              "lengthOfEmployment",
                              event.target.value,
                            )
                          }
                          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="monthlyIncome"
                          className="text-sm font-medium text-foreground"
                        >
                          Monthly Income
                        </label>
                        <input
                          id="monthlyIncome"
                          type="text"
                          value={tenantQuestionnaire.monthlyIncome}
                          onChange={(event) =>
                            updateTenantQuestionnaire(
                              "monthlyIncome",
                              event.target.value,
                            )
                          }
                          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="employedSupervisorContact"
                          className="text-sm font-medium text-foreground"
                        >
                          Supervisor Contact Information
                        </label>
                        <input
                          id="employedSupervisorContact"
                          type="text"
                          value={tenantQuestionnaire.employedSupervisorContact}
                          onChange={(event) =>
                            updateTenantQuestionnaire(
                              "employedSupervisorContact",
                              event.target.value,
                            )
                          }
                          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                          required
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label
                          htmlFor="employedPermissionToContactSupervisor"
                          className="text-sm font-medium text-foreground"
                        >
                          Permission to Contact Supervisor
                        </label>
                        <select
                          id="employedPermissionToContactSupervisor"
                          value={tenantQuestionnaire.employedPermissionToContactSupervisor}
                          onChange={(event) =>
                            updateTenantQuestionnaire(
                              "employedPermissionToContactSupervisor",
                              event.target.value as YesNoValue,
                            )
                          }
                          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                          required
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>
                  ) : null}

                  {tenantQuestionnaire.employmentStatus === "unemployed" ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="recentEmployer"
                          className="text-sm font-medium text-foreground"
                        >
                          Most Recent Employer
                        </label>
                        <input
                          id="recentEmployer"
                          type="text"
                          value={tenantQuestionnaire.recentEmployer}
                          onChange={(event) =>
                            updateTenantQuestionnaire(
                              "recentEmployer",
                              event.target.value,
                            )
                          }
                          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="unemployedEmploymentDates"
                          className="text-sm font-medium text-foreground"
                        >
                          Dates of Employment
                        </label>
                        <input
                          id="unemployedEmploymentDates"
                          type="text"
                          value={tenantQuestionnaire.unemployedEmploymentDates}
                          onChange={(event) =>
                            updateTenantQuestionnaire(
                              "unemployedEmploymentDates",
                              event.target.value,
                            )
                          }
                          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="unemployedSupervisorContact"
                          className="text-sm font-medium text-foreground"
                        >
                          Supervisor Contact Information
                        </label>
                        <input
                          id="unemployedSupervisorContact"
                          type="text"
                          value={tenantQuestionnaire.unemployedSupervisorContact}
                          onChange={(event) =>
                            updateTenantQuestionnaire(
                              "unemployedSupervisorContact",
                              event.target.value,
                            )
                          }
                          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="unemployedPermissionToContactSupervisor"
                          className="text-sm font-medium text-foreground"
                        >
                          Permission to Contact Supervisor
                        </label>
                        <select
                          id="unemployedPermissionToContactSupervisor"
                          value={tenantQuestionnaire.unemployedPermissionToContactSupervisor}
                          onChange={(event) =>
                            updateTenantQuestionnaire(
                              "unemployedPermissionToContactSupervisor",
                              event.target.value as YesNoValue,
                            )
                          }
                          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                          required
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label
                          htmlFor="reasonForLeaving"
                          className="text-sm font-medium text-foreground"
                        >
                          Reason for Leaving
                        </label>
                        <textarea
                          id="reasonForLeaving"
                          value={tenantQuestionnaire.reasonForLeaving}
                          onChange={(event) =>
                            updateTenantQuestionnaire(
                              "reasonForLeaving",
                              event.target.value,
                            )
                          }
                          className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="currentlySeekingEmployment"
                          className="text-sm font-medium text-foreground"
                        >
                          Currently Seeking Employment?
                        </label>
                        <select
                          id="currentlySeekingEmployment"
                          value={tenantQuestionnaire.currentlySeekingEmployment}
                          onChange={(event) =>
                            updateTenantQuestionnaire(
                              "currentlySeekingEmployment",
                              event.target.value as YesNoValue,
                            )
                          }
                          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                          required
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="otherIncomeSources"
                          className="text-sm font-medium text-foreground"
                        >
                          Other Sources of Income
                        </label>
                        <input
                          id="otherIncomeSources"
                          type="text"
                          value={tenantQuestionnaire.otherIncomeSources}
                          onChange={(event) =>
                            updateTenantQuestionnaire(
                              "otherIncomeSources",
                              event.target.value,
                            )
                          }
                          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                          required
                        />
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
                    Prior Housing
                  </h3>
                  <div className="space-y-2">
                    <label
                      htmlFor="previousAddresses"
                      className="text-sm font-medium text-foreground"
                    >
                      List All Previous Addresses
                    </label>
                    <textarea
                      id="previousAddresses"
                      value={tenantQuestionnaire.previousAddresses}
                      onChange={(event) =>
                        updateTenantQuestionnaire(
                          "previousAddresses",
                          event.target.value,
                        )
                      }
                      className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="lengthOfStays"
                      className="text-sm font-medium text-foreground"
                    >
                      Length of Stay(s)
                    </label>
                    <textarea
                      id="lengthOfStays"
                      value={tenantQuestionnaire.lengthOfStays}
                      onChange={(event) =>
                        updateTenantQuestionnaire("lengthOfStays", event.target.value)
                      }
                      className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="leaseViolationsOrEvictions"
                      className="text-sm font-medium text-foreground"
                    >
                      Any Lease Violations, Evictions, or Notices
                    </label>
                    <textarea
                      id="leaseViolationsOrEvictions"
                      value={tenantQuestionnaire.leaseViolationsOrEvictions}
                      onChange={(event) =>
                        updateTenantQuestionnaire(
                          "leaseViolationsOrEvictions",
                          event.target.value,
                        )
                      }
                      className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="previousLandlordContacts"
                      className="text-sm font-medium text-foreground"
                    >
                      Previous Landlord Contact Information
                    </label>
                    <textarea
                      id="previousLandlordContacts"
                      value={tenantQuestionnaire.previousLandlordContacts}
                      onChange={(event) =>
                        updateTenantQuestionnaire(
                          "previousLandlordContacts",
                          event.target.value,
                        )
                      }
                      className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="permissionToContactPreviousLandlords"
                      className="text-sm font-medium text-foreground"
                    >
                      Permission to Contact Previous Landlord(s)
                    </label>
                    <select
                      id="permissionToContactPreviousLandlords"
                      value={tenantQuestionnaire.permissionToContactPreviousLandlords}
                      onChange={(event) =>
                        updateTenantQuestionnaire(
                          "permissionToContactPreviousLandlords",
                          event.target.value as YesNoValue,
                        )
                      }
                      className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                      required
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
                    References
                  </h3>
                  <label
                    htmlFor="references"
                    className="text-sm font-medium text-foreground"
                  >
                    Reference Information
                  </label>
                  <textarea
                    id="references"
                    value={tenantQuestionnaire.references}
                    onChange={(event) =>
                      updateTenantQuestionnaire("references", event.target.value)
                    }
                    className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring"
                    required
                  />
                </div>

                <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-900">
                    Criminal History / Record Information [Voluntary Disclosure]
                  </h3>
                  <p className="text-xs text-amber-800">
                    You may provide this information voluntarily.
                  </p>

                  <div className="space-y-2">
                    <label
                      htmlFor="misdemeanorConvictionPast5Years"
                      className="text-sm font-medium text-foreground"
                    >
                      Convicted of a misdemeanor involving violence, property
                      damage, or fraud within past 5 years?
                    </label>
                    <select
                      id="misdemeanorConvictionPast5Years"
                      value={tenantQuestionnaire.misdemeanorConvictionPast5Years}
                      onChange={(event) =>
                        updateTenantQuestionnaire(
                          "misdemeanorConvictionPast5Years",
                          event.target.value as YesNoValue,
                        )
                      }
                      className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="felonyConvictionPast5Years"
                      className="text-sm font-medium text-foreground"
                    >
                      Convicted of a felony within past 5 years?
                    </label>
                    <select
                      id="felonyConvictionPast5Years"
                      value={tenantQuestionnaire.felonyConvictionPast5Years}
                      onChange={(event) =>
                        updateTenantQuestionnaire(
                          "felonyConvictionPast5Years",
                          event.target.value as YesNoValue,
                        )
                      }
                      className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="convictionDetails"
                      className="text-sm font-medium text-foreground"
                    >
                      If yes, provide offense details, dates, convictions, and
                      time served
                    </label>
                    <textarea
                      id="convictionDetails"
                      value={tenantQuestionnaire.convictionDetails}
                      onChange={(event) =>
                        updateTenantQuestionnaire(
                          "convictionDetails",
                          event.target.value,
                        )
                      }
                      className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="sexOffenderRegistration"
                      className="text-sm font-medium text-foreground"
                    >
                      Are you currently required to register as a sex offender?
                    </label>
                    <select
                      id="sexOffenderRegistration"
                      value={tenantQuestionnaire.sexOffenderRegistration}
                      onChange={(event) =>
                        updateTenantQuestionnaire(
                          "sexOffenderRegistration",
                          event.target.value as YesNoValue,
                        )
                      }
                      className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                      required
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="pendingCharges"
                      className="text-sm font-medium text-foreground"
                    >
                      Do you have pending criminal charges not yet resolved?
                    </label>
                    <select
                      id="pendingCharges"
                      value={tenantQuestionnaire.pendingCharges}
                      onChange={(event) =>
                        updateTenantQuestionnaire(
                          "pendingCharges",
                          event.target.value as YesNoValue,
                        )
                      }
                      className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="pendingChargesDetails"
                      className="text-sm font-medium text-foreground"
                    >
                      If yes, provide pending charge details and dates
                    </label>
                    <textarea
                      id="pendingChargesDetails"
                      value={tenantQuestionnaire.pendingChargesDetails}
                      onChange={(event) =>
                        updateTenantQuestionnaire(
                          "pendingChargesDetails",
                          event.target.value,
                        )
                      }
                      className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="additionalInfoForHomeowners"
                      className="text-sm font-medium text-foreground"
                    >
                      Additional Information for Homeowners
                    </label>
                    <textarea
                      id="additionalInfoForHomeowners"
                      value={tenantQuestionnaire.additionalInfoForHomeowners}
                      onChange={(event) =>
                        updateTenantQuestionnaire(
                          "additionalInfoForHomeowners",
                          event.target.value,
                        )
                      }
                      className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-foreground"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="h-11 w-full rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSaving || isUploading}
              className="h-11 w-full sm:w-auto"
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        )}

        {statusMessage ? (
          <p className="mt-4 text-sm text-muted-foreground">{statusMessage}</p>
        ) : null}
      </section>
    </main>
  );
}
