"use client";

import { useEffect, useState } from "react";

type CookieChoice = "accept_all" | "necessary_only" | "decline";

const STORAGE_KEY = "uh_cookie_choice";

export function CookieConsentBox() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const existingChoice = window.localStorage.getItem(STORAGE_KEY);
    if (!existingChoice) {
      setIsVisible(true);
    }
  }, []);

  const handleChoice = (choice: CookieChoice) => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70] w-[min(92vw,360px)] rounded-xl border border-black/10 bg-white/95 p-4 shadow-xl backdrop-blur">
      <p className="text-sm font-semibold text-[#1a1d23]">Cookie Preferences</p>
      <p className="mt-1 text-xs leading-relaxed text-[#394046]">
        We use cookies to keep this site working and improve your experience.
      </p>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => handleChoice("accept_all")}
          className="rounded-md bg-[#1a1d23] px-3 py-2 text-xs font-medium text-white transition hover:opacity-90"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={() => handleChoice("necessary_only")}
          className="rounded-md border border-black/15 bg-white px-3 py-2 text-xs font-medium text-[#1a1d23] transition hover:bg-[#f7f7f7]"
        >
          Necessary Only
        </button>
        <button
          type="button"
          onClick={() => handleChoice("decline")}
          className="rounded-md border border-black/15 bg-white px-3 py-2 text-xs font-medium text-[#1a1d23] transition hover:bg-[#f7f7f7]"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
