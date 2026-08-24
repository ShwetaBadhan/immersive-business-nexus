import { useEffect, useRef, useState } from "react";
import heroEnv from "@/assets/hero-environment.jpg";

/**
 * Cinematic hero environment: layered light architectural photograph with
 * inertial, inverse-direction pointer parallax, a cursor-following light,
 * subtle depth-of-field vignette and a fine film grain.
 *
 * On touch / small screens a dedicated composition is used: tighter framing,
 * less blur, a slow ambient drift plus touch-driven parallax so the visual
 * never looks like a cropped desktop version.
 *
 * Purely presentational and pointer-transparent.
 */
export function HeroBackdrop() {
  const far = useRef<HTMLDivElement>(null);
  const near = useRef<HTMLDivElement>(null);
  const lines = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const coarse = !window.matchMedia("(pointer: fine)").matches;
    // gentler amplitudes on small screens so nothing drifts out of frame
    const amp = compact ? 0.55 : 1;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    const start = performance.now();

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      tx = (t.clientX / window.innerWidth) * 2 - 1;
      ty = (t.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = (now: number) => {
      // slow ambient drift keeps the composition alive without input (touch)
      if (coarse) {
        const t = (now - start) / 1000;
        tx += (Math.sin(t * 0.18) * 0.6 - tx) * 0.02;
        ty += (Math.cos(t * 0.13) * 0.4 - ty) * 0.02;
      }

      // inertia
      x += (tx - x) * 0.045;
      y += (ty - y) * 0.045;

      // background shifts opposite to the cursor, layers at different depths
      if (far.current) {
        far.current.style.transform = `scale(${compact ? 1.1 : 1.05}) translate3d(${-x * 22 * amp}px, ${-y * 14 * amp}px, 0)`;
      }
      if (near.current) {
        near.current.style.transform = `scale(${compact ? 1.16 : 1.1}) translate3d(${-x * 46 * amp}px, ${-y * 26 * amp}px, 0)`;
      }
      if (lines.current) {
        lines.current.style.transform = `translate3d(${x * 30 * amp}px, ${y * 18 * amp}px, 0) rotateX(${-y * 2.2}deg) rotateY(${x * 2.8}deg)`;
      }
      if (light.current) {
        light.current.style.transform = `translate3d(${x * 90 * amp}px, ${y * 60 * amp}px, 0)`;
        light.current.style.opacity = String(0.5 + Math.abs(x) * 0.25);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [compact]);

  const framing = compact
    ? { backgroundSize: "cover", backgroundPosition: "52% 44%" }
    : { backgroundSize: "cover", backgroundPosition: "50% 35%" };

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* far plane — soft, defocused environment */}
      <div
        ref={far}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: `url(${heroEnv})`,
          ...framing,
          filter: compact
            ? "blur(2px) saturate(0.62) brightness(1.08) contrast(1)"
            : "blur(4px) saturate(0.55) brightness(1.14) contrast(0.95)",
          opacity: compact ? 0.92 : 0.8,
        }}
      />

      {/* near plane — crisper slice, deeper parallax */}
      <div
        ref={near}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: `url(${heroEnv})`,
          ...framing,
          filter: "blur(1px) saturate(0.6) brightness(1.12)",
          opacity: compact ? 0.3 : 0.45,
          maskImage: compact
            ? "radial-gradient(120% 70% at 50% 66%, rgba(0,0,0,0.95), rgba(0,0,0,0) 74%)"
            : "radial-gradient(120% 90% at 70% 60%, rgba(0,0,0,0.95), rgba(0,0,0,0) 72%)",
          WebkitMaskImage: compact
            ? "radial-gradient(120% 70% at 50% 66%, rgba(0,0,0,0.95), rgba(0,0,0,0) 74%)"
            : "radial-gradient(120% 90% at 70% 60%, rgba(0,0,0,0.95), rgba(0,0,0,0) 72%)",
        }}
      />

      {/* cursor-reactive light */}
      <div
        ref={light}
        className="absolute inset-[-20%] will-change-transform"
        style={{
          background:
            "radial-gradient(45% 45% at 50% 40%, oklch(0.99 0.01 150 / 60%), transparent 70%)",
        }}
      />

      {/* thin green structural lines with subtle 3D tilt */}
      <div ref={lines} className="absolute inset-0 will-change-transform">
        <span className="absolute left-[14%] top-0 h-full w-px bg-neon/25" />
        <span className="absolute left-[52%] top-0 h-full w-px bg-neon/18" />
        <span className="absolute left-[84%] top-0 h-full w-px bg-neon/25" />
        <span className="absolute left-0 top-[32%] h-px w-full bg-foreground/[0.1]" />
        <span className="absolute left-0 top-[74%] h-px w-full bg-foreground/[0.1]" />
        <span className="absolute left-[52%] top-[32%] h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/50" />
        <span className="absolute left-[84%] top-[74%] h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/40" />
        <span className="absolute left-[14%] top-[74%] h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/30" />
      </div>

      {/* paper wash keeps typography legible + depth-of-field falloff */}
      <div
        className="absolute inset-0"
        style={{
          background: compact
            ? "radial-gradient(76% 40% at 50% 38%, oklch(0.99 0.004 150 / 78%), oklch(0.985 0.005 150 / 16%) 84%)"
            : "radial-gradient(60% 50% at 50% 46%, oklch(0.99 0.004 150 / 88%), oklch(0.985 0.005 150 / 30%) 80%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-background) 0%, transparent 16%, transparent 82%, var(--color-background) 100%)",
        }}
      />

      {/* film grain */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
