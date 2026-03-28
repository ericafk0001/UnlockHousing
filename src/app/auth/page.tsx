"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function AuthPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const searchParams = useSearchParams();
  const initialMode =
    searchParams.get("mode") === "signin" ? "signin" : "signup";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const hasCredentials = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasCredentials) {
      setMessage(
        initialMode === "signin"
          ? "Enter both email and password to sign in."
          : "Enter both email and password to sign up.",
      );
      return;
    }

    setIsLoading(true);
    setMessage("");

    const result =
      initialMode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth`,
            },
          });

    setIsLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setMessage(
      initialMode === "signin"
        ? "Signed in successfully."
        : "Sign up successful. If email confirmation is enabled, check your inbox before signing in.",
    );
  };

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl backdrop-blur">
        <h2 className="text-2xl font-semibold">Supabase Authentication</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {initialMode === "signin"
            ? "Welcome back. Sign in with your email and password."
            : "Create your account with email and password."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none ring-0 transition focus:border-ring"
              placeholder="you@example.com"
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
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none ring-0 transition focus:border-ring"
              placeholder="At least 6 characters"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading
              ? "Working..."
              : initialMode === "signin"
                ? "Sign In"
                : "Sign Up"}
          </Button>
        </form>

        {message ? (
          <p className="mt-4 text-sm text-muted-foreground">{message}</p>
        ) : null}
      </section>
    </main>
  );
}
