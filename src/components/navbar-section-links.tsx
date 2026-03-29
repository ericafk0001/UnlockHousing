"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const pendingSectionKey = "unlockhousing:pending-section";

const sectionIds = ["about", "insights"] as const;

const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  if (!section) {
    return;
  }

  section.scrollIntoView({ behavior: "smooth", block: "start" });
};

export function NavbarSectionLinks() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSectionClick = useCallback(
    (id: string) => {
      if (pathname !== "/") {
        sessionStorage.setItem(pendingSectionKey, id);
        router.push("/");
        return;
      }

      scrollToSection(id);
    },
    [pathname, router],
  );

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const pendingSection = sessionStorage.getItem(pendingSectionKey);
    if (
      !pendingSection ||
      !sectionIds.includes(pendingSection as (typeof sectionIds)[number])
    ) {
      return;
    }

    sessionStorage.removeItem(pendingSectionKey);

    window.setTimeout(() => {
      scrollToSection(pendingSection);
    }, 120);
  }, [pathname]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
      <button
        type="button"
        onClick={() => handleSectionClick("about")}
        className="inline-flex items-center justify-center px-2 text-sm font-medium text-foreground md:text-base"
      >
        About
      </button>
      <button
        type="button"
        onClick={() => handleSectionClick("insights")}
        className="inline-flex items-center justify-center px-2 text-sm font-medium text-foreground md:text-base"
      >
        Insights
      </button>
      <button
        type="button"
        onClick={() => router.push("/contact")}
        className="inline-flex items-center justify-center px-2 text-sm font-medium text-foreground md:text-base"
      >
        Contact
      </button>
    </div>
  );
}
