import { useEffect } from "react";

/**
 * Adds `reveal-in` to every `[data-reveal]` element when it enters the viewport.
 * Staggers by `data-reveal-delay` (ms).
 *
 * A failsafe pass guarantees content is never left stuck at opacity 0 (mobile
 * smooth-scroll containers can otherwise starve the observer).
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const DIRS: Record<string, string> = {
      left: "reveal-left",
      right: "reveal-right",
      up: "reveal-up",
      zoom: "reveal-zoom",
    };
    nodes.forEach((n) => {
      n.classList.add("reveal");
      const dir = DIRS[n.dataset["reveal"] ?? ""];
      if (dir) n.classList.add(dir);
    });

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const show = (el: HTMLElement) => {
      if (el.classList.contains("reveal-in")) return;
      const raw = Number(el.dataset["revealDelay"] ?? 0);
      // shorter, tighter stagger on phones — polish without waiting
      const delay = mobile ? Math.min(raw * 0.45, 320) : raw;
      window.setTimeout(() => el.classList.add("reveal-in"), delay);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          show(el);
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));

    // failsafe: anything already inside the viewport must be visible
    const sweep = () => {
      nodes.forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          show(n);
          io.unobserve(n);
        }
      });
    };
    const t1 = window.setTimeout(sweep, 600);
    const t2 = window.setTimeout(sweep, 2200);
    window.addEventListener("scroll", sweep, { passive: true });
    window.addEventListener("resize", sweep);

    return () => {
      io.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("scroll", sweep);
      window.removeEventListener("resize", sweep);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
