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
            {children}
          </div>
        </ScrollEffects>
      </body>
    </html>
  );
}
