import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { NavbarSectionLinks } from "@/components/navbar-section-links";
import { ScrollEffects } from "@/components/scroll-effects";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UnlockHousing",
  description:
    "An app that connects formerly incarcerated individuals with fair-chance housing opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={
        {
          "--font-sans": "var(--font-geist-sans)",
        } as React.CSSProperties
      }
    >
      <body className="relative min-h-full overflow-x-hidden bg-background text-foreground">
        <ScrollEffects>
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(1100px 700px at 8% 18%, rgba(255, 255, 255, 0.65), transparent 62%), radial-gradient(900px 650px at 96% 82%, rgba(226, 226, 226, 0.52), transparent 64%)",
              }}
            />
            <div className="absolute inset-0 backdrop-blur-[2px]" />
          </div>

          <div className="relative z-10 flex min-h-full flex-col">
            <div className="relative z-30 mt-4 flex justify-center px-3 sm:px-4 md:px-8 lg:px-14">
              <nav
                data-navbar
                className="flex w-full max-w-5xl -translate-y-7 flex-col items-center gap-3 rounded-xl border border-border bg-background/95 px-4 py-4 opacity-0 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/80 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-0 md:px-7"
              >
                <h1 className="text-xl font-bold md:text-2xl">
                  <Link href="/">UnlockHousing</Link>
                </h1>
                <div className="w-full justify-self-center px-0 md:w-auto md:px-4 lg:px-8">
                  <NavbarSectionLinks />
                </div>
                <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:gap-3 md:w-auto md:justify-end">
                  <Link
                    href="/auth?mode=signin"
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:px-4 sm:text-base"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth?mode=signup"
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-transparent bg-foreground px-3 text-sm font-medium text-background transition-colors hover:opacity-90 sm:px-4 sm:text-base"
                  >
                    Sign Up
                  </Link>
                </div>
              </nav>
            </div>
            {children}
          </div>
        </ScrollEffects>
      </body>
    </html>
  );
}
