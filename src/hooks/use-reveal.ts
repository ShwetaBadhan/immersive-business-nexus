import { useEffect } from "react";

/**
 * Adds `reveal-in` to every `[data-reveal]` element when it enters the viewport.
 * Staggers by `data-reveal-delay` (ms).
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    nodes.forEach((n) => n.classList.add("reveal"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = Number(el.dataset["revealDelay"] ?? 0);
          window.setTimeout(() => el.classList.add("reveal-in"), delay);
          io.unobserve(el);
        });
      },
      { rootMargin: "-8% 0px -12% 0px", threshold: 0.05 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
