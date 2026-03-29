import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConditionalNavbar } from "@/components/conditional-navbar";
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
            <ConditionalNavbar />
            {children}
          </div>
        </ScrollEffects>
      </body>
    </html>
  );
}
