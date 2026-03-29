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

const getFileExtension = (filename: string) => {
  const parts = filename.split(".");
  if (parts.length < 2) {
    return "jpg";
  }
  return parts[parts.length - 1].toLowerCase();
};

export default function Homepage() {
  const router = useRouter();
  const [supabase, setSupabase] = useState<ReturnType<
    typeof createSupabaseBrowserClient
  > | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient());
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
        setIsLoading(false);
        return;
      }

      setFirstName(data?.first_name ?? String(metadata.first_name ?? ""));
      setLastName(data?.last_name ?? String(metadata.last_name ?? ""));
      setPhone(data?.phone ?? String(metadata.phone ?? ""));
      setAvatarUrl(data?.avatar_url ?? null);
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

    setIsSaving(true);
    setStatusMessage("");

    const { error } = await supabase.from("profiles").upsert(
      {
        id: userId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    setIsSaving(false);

    if (error) {
      setStatusMessage(
        "Could not save profile. Check profiles table and RLS policies in Supabase.",
      );
      return;
    }

    setStatusMessage("Profile saved.");
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
      setStatusMessage(
        "Could not upload image. Ensure the avatars bucket and policies are configured.",
      );
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setAvatarUrl(data.publicUrl);
    setIsUploading(false);
    setStatusMessage("Avatar uploaded. Click Save Profile to persist it.");
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <main className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-5xl flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="w-full rounded-3xl border border-border bg-card/90 p-6 shadow-md backdrop-blur sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
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
