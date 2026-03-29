"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

const backgroundAssets = ["/grain-noise.svg"];

const waitForWindowLoad = () => {
  if (document.readyState === "complete") {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
};

const waitForFonts = () => {
  if (typeof document.fonts === "undefined") {
    return Promise.resolve();
  }
  return document.fonts.ready.then(() => undefined);
};

const waitForImageElement = (image: HTMLImageElement) => {
  if (image.complete && image.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const onDone = () => resolve();
    image.addEventListener("load", onDone, { once: true });
    image.addEventListener("error", onDone, { once: true });
  });
};

const waitForImageUrl = (url: string) =>
  new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = url;
    if (image.complete) {
      resolve();
    }
  });

type LocomotiveInstance = {
  destroy?: () => void;
  update?: () => void;
  resize?: () => void;
};

const refreshLocomotive = (instance: LocomotiveInstance | undefined) => {
  if (!instance) {
    return;
  }

  if (typeof instance.update === "function") {
    instance.update();
    return;
  }

  if (typeof instance.resize === "function") {
    instance.resize();
  }
};

export function ScrollEffects({ children }: { children: ReactNode }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const locomotiveRef = useRef<LocomotiveInstance | undefined>(undefined);
  const pathname = usePathname();
  const isAccessibilityRoute = pathname === "/accessibility";
  const isAuthRoute = pathname.startsWith("/auth");
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isAccessibilityRoute) {
      setProgress(100);
      setIsReady(true);
      return;
    }

    let cancelled = false;

    const preloadAssets = async () => {
      const imageElements = Array.from(document.images);
      const trackedPromises: Promise<void>[] = [
        waitForWindowLoad(),
        waitForFonts(),
        ...imageElements.map((image) => waitForImageElement(image)),
        ...backgroundAssets.map((url) => waitForImageUrl(url)),
      ];

      const total = Math.max(trackedPromises.length, 1);
      let loaded = 0;

      const track = (promise: Promise<void>) =>
        promise.finally(() => {
          loaded += 1;
          if (!cancelled) {
            setProgress(Math.min(100, Math.round((loaded / total) * 100)));
          }
        });

      await Promise.all(trackedPromises.map((promise) => track(promise)));

      if (!cancelled) {
        setProgress(100);
        setIsReady(true);
      }
    };

    void preloadAssets();

    return () => {
      cancelled = true;
    };
  }, [isAccessibilityRoute]);

  useEffect(() => {
    if (!isReady || isAccessibilityRoute) {
      return;
    }

    const navbar = document.querySelector<HTMLElement>("[data-navbar]");
    if (!navbar) {
      return;
    }

    if (isAccessibilityRoute) {
      gsap.set(navbar, { autoAlpha: 1, y: 0 });
      return;
    }

    if (isAuthRoute) {
      gsap.set(navbar, { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.to(navbar, {
      autoAlpha: 1,
      y: 0,
      duration: 0.85,
      delay: 1.5,
      ease: "power3.out",
    });
  }, [isReady, pathname, isAccessibilityRoute, isAuthRoute]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    let cancelled = false;

    const initLocomotive = async () => {
      const locomotiveModule = await import("locomotive-scroll");
      if (cancelled) {
        return;
      }

      const LocomotiveScroll = locomotiveModule.default;
      locomotiveRef.current?.destroy?.();
      locomotiveRef.current = new LocomotiveScroll({
        el: container,
        smooth: true,
        lerp: 0.08,
        smartphone: { smooth: true },
        tablet: { smooth: true },
      } as any);

      window.setTimeout(() => {
        refreshLocomotive(locomotiveRef.current);
      }, 250);
    };

    void initLocomotive();

    return () => {
      cancelled = true;
      if (pathname === "/") {
        return;
      }

      locomotiveRef.current?.destroy?.();
      locomotiveRef.current = undefined;
    };
  }, [isReady, pathname, isAccessibilityRoute]);

  useLayoutEffect(() => {
    if (!isReady || isAccessibilityRoute) {
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const targets = Array.from(
      container.querySelectorAll<HTMLElement>("[data-fade-in]"),
    );

    if (!targets.length) {
      return;
    }

    gsap.set(targets, { autoAlpha: 0, y: 20 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          gsap.to(entry.target, {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "power2.out",
          });

          observer.unobserve(entry.target);
        });
      },
      {
        root: null,
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    targets.forEach((target) => observer.observe(target));

    window.setTimeout(() => {
      refreshLocomotive(locomotiveRef.current);
    }, 60);

    return () => {
      observer.disconnect();
    };
  }, [isReady, pathname, isAccessibilityRoute]);

  return (
    <>
      {!isAccessibilityRoute && (
        <div
          aria-hidden={isReady}
          className={`fixed inset-0 z-80 flex items-center justify-center bg-white transition-opacity duration-500 ${
            isReady ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <div className="w-[min(24rem,84vw)]">
            <p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-[#1f2830]">
              LOADING
            </p>
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[#e6e8eb]">
              <div
                className="h-full rounded-full bg-[#1f2830] transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-center text-xs text-[#57616b]">
              {progress}%
            </p>
          </div>
        </div>
      )}

      <div ref={scrollContainerRef} data-scroll-container>
        {children}
      </div>
    </>
  );
}
