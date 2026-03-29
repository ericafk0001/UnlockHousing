import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

function AuthFormFallback() {
  return (
    <div className="flex min-h-[calc(100svh-10rem)] w-full max-w-xl items-center rounded-3xl border border-border/70 bg-card/90">
      <div className="w-full p-6 sm:p-10 lg:p-12">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-4 w-48 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 pb-12 pt-6 sm:px-6 sm:pt-10">
      <Suspense fallback={<AuthFormFallback />}>
        <AuthForm />
      </Suspense>
    </main>
  );
}
