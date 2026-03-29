"use client";

import { usePathname } from "next/navigation";
import { SiteNavbar } from "@/components/site-navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();

  if (pathname === "/profile") {
    return null;
  }

  return <SiteNavbar />;
}
