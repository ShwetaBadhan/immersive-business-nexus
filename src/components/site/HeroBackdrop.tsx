import { useEffect, useRef } from "react";
import heroEnv from "@/assets/hero-environment.jpg";

/**
 * Cinematic hero environment: layered light architectural photograph with
 * inertial, inverse-direction pointer parallax, a cursor-following light,
 * subtle depth-of-field vignette and a fine film grain.
 * Purely presentational and pointer-transparent.
 */
export function HeroBackdrop() {
  const far = useRef<HTMLDivElement>(null);
  const near = useRef<HTMLDivElement>(null);
  const lines = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = () => {
      // inertia
      x += (tx - x) * 0.045;
      y += (ty - y) * 0.045;

      // background shifts opposite to the cursor, layers at different depths
      if (far.current) {
        far.current.style.transform = `scale(1.1) translate3d(${-x * 22}px, ${-y * 14}px, 0)`;
      }
      if (near.current) {
        near.current.style.transform = `scale(1.16) translate3d(${-x * 46}px, ${-y * 26}px, 0)`;
      }
      if (lines.current) {
        lines.current.style.transform = `translate3d(${x * 30}px, ${y * 18}px, 0) rotateX(${-y * 2.2}deg) rotateY(${x * 2.8}deg)`;
      }
      if (light.current) {
        light.current.style.transform = `translate3d(${x * 90}px, ${y * 60}px, 0)`;
        light.current.style.opacity = String(0.5 + Math.abs(x) * 0.25);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

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
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) saturate(0.8) brightness(1.04)",
          opacity: 0.95,
        }}
      />

      {/* near plane — crisper slice, deeper parallax */}
      <div
        ref={near}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: `url(${heroEnv})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(1.5px) saturate(0.8) brightness(1.06)",
          opacity: 0.62,
          maskImage:
            "radial-gradient(120% 90% at 70% 60%, rgba(0,0,0,0.95), rgba(0,0,0,0) 72%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 70% 60%, rgba(0,0,0,0.95), rgba(0,0,0,0) 72%)",
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
          background:
            "radial-gradient(58% 52% at 50% 46%, oklch(0.985 0.004 150 / 82%), oklch(0.97 0.006 150 / 34%) 76%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-background) 0%, transparent 22%, transparent 68%, var(--color-background) 100%)",
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
