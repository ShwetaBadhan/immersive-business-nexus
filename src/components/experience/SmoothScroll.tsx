import { useEffect } from "react";
import Lenis from "lenis";
import { useRouterState } from "@tanstack/react-router";
import { live, setWorld } from "@/lib/world-store";

let lenisRef: Lenis | null = null;

export function scrollToTop(immediate = true) {
  lenisRef?.scrollTo(0, { immediate });
}

/**
 * Lenis smooth scrolling. Publishes a normalized, smoothed scroll progress into
 * `live.progress` so the 3D world can be driven directly from the render loop.
 */
export function SmoothScroll() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      lerp: 0.085,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      smoothWheel: true,
    });
    lenisRef = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      const max = Math.max(1, lenis.limit);
      live.progress = Math.min(1, Math.max(0, lenis.scroll / max));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onScroll = () => {
      setWorld({ progress: live.progress });
    };
    lenis.on("scroll", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef = null;
    };
  }, []);

  useEffect(() => {
    live.progress = 0;
    setWorld({ progress: 0 });
    lenisRef?.scrollTo(0, { immediate: true });
    // resize recalculation after new route content mounts
    const t = window.setTimeout(() => lenisRef?.resize(), 260);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return null;
}
