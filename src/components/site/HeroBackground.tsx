import { useEffect, useRef } from "react";
import envBack from "@/assets/hero-env-back.jpg";
import envFront from "@/assets/hero-env-front.png";

/**
 * Cinematic light environment behind the home hero.
 * Layered parallax with inertia, a cursor-driven light bloom,
 * subtle depth-of-field and a film grain pass.
 */
export function HeroBackground() {
  const root = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLDivElement>(null);
  const mid = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const el = root.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width - 0.5;
      target.y = (e.clientY - r.top) / r.height - 0.5;
    };

    const tick = () => {
      // inertia
      smooth.x += (target.x - smooth.x) * 0.045;
      smooth.y += (target.y - smooth.y) * 0.045;

      // background shifts opposite the cursor, layers move at different depths
      if (back.current) {
        back.current.style.transform = `scale(1.1) translate3d(${smooth.x * -26}px, ${smooth.y * -16}px, 0) rotateY(${smooth.x * -2}deg)`;
      }
      if (mid.current) {
        mid.current.style.transform = `translate3d(${smooth.x * -52}px, ${smooth.y * -28}px, 0)`;
      }
      if (front.current) {
        front.current.style.transform = `translate3d(${smooth.x * 74}px, ${smooth.y * 40}px, 0)`;
      }
      if (light.current) {
        light.current.style.transform = `translate3d(${smooth.x * 160}px, ${smooth.y * 120}px, 0)`;
        light.current.style.opacity = String(0.35 + Math.abs(smooth.x) * 0.3);
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* deep environment */}
      <div ref={back} className="absolute -inset-[8%] will-change-transform">
        <img
          src={envBack}
          alt=""
          width={1920}
          height={1280}
          className="h-full w-full object-cover opacity-[0.95]"
          style={{ filter: "saturate(0.95) contrast(1.02) blur(0.6px)" }}
        />
      </div>

      {/* mid depth haze + green accent wash */}
      <div ref={mid} className="absolute -inset-[10%] will-change-transform">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 30% 30%, color-mix(in oklab, var(--color-neon) 12%, transparent) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, color-mix(in oklab, var(--color-forest) 10%, transparent) 0%, transparent 45%)",
          }}
        />
      </div>

      {/* foreground network — sharper, moves with the cursor */}
      <div ref={front} className="absolute -inset-[6%] will-change-transform">
        <img
          src={envFront}
          alt=""
          width={1536}
          height={1024}
          loading="lazy"
          className="h-full w-full object-cover opacity-[0.16]"
        />
      </div>

      {/* cursor light */}
      <div
        ref={light}
        className="absolute left-1/2 top-1/2 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 68%)",
          mixBlendMode: "screen",
        }}
      />

      {/* depth of field + legibility veil */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, var(--background) 0%, color-mix(in oklab, var(--background) 88%, transparent) 26%, color-mix(in oklab, var(--background) 40%, transparent) 55%, color-mix(in oklab, var(--background) 20%, transparent) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
      />
      <div
        className="absolute inset-x-0 top-0 h-32"
        style={{ background: "linear-gradient(to bottom, var(--background), transparent)" }}
      />

      {/* film grain */}
      <div
        className="absolute inset-0 opacity-[0.16] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          backgroundSize: "160px 160px",
        }}
      />
    </div>
  );
}
