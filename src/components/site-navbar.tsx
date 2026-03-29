"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavbarSectionLinks } from "@/components/navbar-section-links";

export function SiteNavbar() {
  const pathname = usePathname();

  if (pathname === "/homepage") {
    return null;
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-20 h-28 bg-background/90 backdrop-blur-md"
      />
      <div className="relative z-30 mt-4 flex justify-center px-3 sm:px-4 md:px-8 lg:px-14">
        <nav
          data-navbar
          className="flex w-full max-w-5xl -translate-y-7 items-center justify-between rounded-xl border border-border bg-background/88 px-3 py-3 opacity-0 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/78 sm:px-4 md:px-5 lg:px-7"
        >
          <h1 className="shrink-0 whitespace-nowrap text-lg font-bold sm:text-xl md:text-2xl">
            <Link href="/">UnlockHousing</Link>
          </h1>
          <div className="hidden flex-1 justify-center px-8 lg:flex">
            <NavbarSectionLinks />
          </div>
          <div className="flex shrink-0 items-center gap-2 whitespace-nowrap sm:gap-3">
            <Link
              href="/auth?mode=signin"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:h-10 sm:px-4 sm:text-base"
            >
              Sign In
            </Link>
            <Link
              href="/auth?mode=signup"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-transparent bg-foreground px-2.5 text-sm font-medium text-background transition-colors hover:opacity-90 sm:h-10 sm:px-4 sm:text-base"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
