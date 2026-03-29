"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Google } from "@deemlol/next-icons";
import { FaApple } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export function AuthForm() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const searchParams = useSearchParams();
  const initialMode =
    searchParams.get("mode") === "signin" ? "signin" : "signup";
  const isSignInMode = initialMode === "signin";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasAcceptedPolicies, setHasAcceptedPolicies] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthProviderLoading, setOauthProviderLoading] = useState<
    "google" | "apple" | null
  >(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient());
  }, []);

  const hasCredentials = email.trim() !== "" && password.trim() !== "";
  const hasSignUpDetails =
    firstName.trim() !== "" && lastName.trim() !== "" && phone.trim() !== "";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      setMessage("Initialization error. Please refresh the page.");
      return;
    }

    if (!hasCredentials) {
      setMessage(
        isSignInMode
          ? "Enter both email and password to sign in."
          : "Enter both email and password to sign up.",
      );
      return;
    }

    if (!isSignInMode && !hasSignUpDetails) {
      setMessage("First name, last name, and phone are required to sign up.");
      return;
    }

    if (!isSignInMode && !hasAcceptedPolicies) {
      setMessage("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const result = isSignInMode
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              phone: phone.trim(),
            },
          },
        });

    setIsLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setMessage(
      isSignInMode
        ? "Signed in successfully."
        : "Sign up successful. If email confirmation is enabled, check your inbox before signing in.",
    );
  };

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    if (!supabase) {
      setMessage("Initialization error. Please refresh the page.");
      return;
    }

    setOauthProviderLoading(provider);
    setMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth`,
      },
    });

    setOauthProviderLoading(null);

    if (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="flex min-h-[calc(100svh-10rem)] w-full max-w-xl items-center rounded-3xl border border-border/70 bg-card/90 shadow-2xl backdrop-blur supports-backdrop-filter:bg-card/80">
      <div className="w-full p-6 sm:p-10 lg:p-12">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            {isSignInMode ? "Welcome back" : "Create your account"}
          </h2>
          <Link
            href={isSignInMode ? "/auth?mode=signup" : "/auth?mode=signin"}
            className="rounded-md px-2 py-1 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            {isSignInMode ? "Need an account?" : "Already have one?"}
          </Link>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {isSignInMode
            ? "Sign in with email and password or continue with a provider."
            : "Add your details below to create your account."}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            className="h-11"
            disabled={oauthProviderLoading !== null || isLoading}
            onClick={() => handleOAuthSignIn("google")}
          >
            <Google size={16} aria-hidden="true" className="mr-1" />
            {oauthProviderLoading === "google"
              ? "Connecting..."
              : "Continue with Google"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11"
            disabled={oauthProviderLoading !== null || isLoading}
            onClick={() => handleOAuthSignIn("apple")}
          >
            <FaApple size={16} aria-hidden="true" className="mr-1" />
            {oauthProviderLoading === "apple"
              ? "Connecting..."
              : "Continue with Apple"}
          </Button>
        </div>

        <div className="my-6 flex items-center gap-3 text-xs uppercase">
          <span className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground">Or use email</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignInMode ? (
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
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none ring-0 transition focus:border-ring"
                  placeholder="John"
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
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none ring-0 transition focus:border-ring"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
          ) : null}

          {!isSignInMode ? (
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
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none ring-0 transition focus:border-ring"
                placeholder="(555) 123-4167"
                required
              />
            </div>
          ) : null}

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
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none ring-0 transition focus:border-ring"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={isSignInMode ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none ring-0 transition focus:border-ring"
              placeholder="At least 6 characters"
              required
            />
          </div>

          {!isSignInMode ? (
            <label className="flex items-start gap-3 rounded-md border border-input/70 bg-background/70 p-3">
              <input
                type="checkbox"
                checked={hasAcceptedPolicies}
                onChange={(event) =>
                  setHasAcceptedPolicies(event.target.checked)
                }
                className="mt-0.5 h-4 w-4 accent-foreground"
                required
              />
              <span className="text-xs leading-5 text-muted-foreground">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          ) : null}

          <Button
            type="submit"
            disabled={
              isLoading ||
              oauthProviderLoading !== null ||
              (!isSignInMode && !hasAcceptedPolicies)
            }
            className="mt-2 h-11 w-full"
          >
            {isLoading
              ? "Working..."
              : isSignInMode
                ? "Sign In"
                : "Create Account"}
          </Button>
        </form>

        {message ? (
          <p className="mt-4 text-sm text-muted-foreground">{message}</p>
        ) : null}
      </div>
    </section>
  );
}
