import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ClientOnly, useNavigate, useRouterState } from "@tanstack/react-router";
import { live, setWorld, useWorld, type WorldVariant } from "@/lib/world-store";
import { getProject } from "@/lib/site-data";
import { playCue } from "@/lib/audio";

const World = lazy(() => import("@/components/three/World"));

function variantFor(pathname: string): WorldVariant {
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/services")) return "services";
  if (pathname.startsWith("/case-studies/")) return "project";
  if (pathname.startsWith("/case-studies")) return "work";
  if (pathname.startsWith("/contact")) return "contact";
  return "home";
}

/** Persistent 3D world: one canvas for the entire site, morphing per route. */
export function WorldLayer() {
  return (
    <ClientOnly fallback={<div className="fixed inset-0 z-0 bg-background" />}>
      <WorldInner />
    </ClientOnly>
  );
}

function WorldInner() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const variant = variantFor(pathname);
  const entered = useWorld((s) => s.entered);

  const hue = useMemo(() => {
    const slug = pathname.split("/case-studies/")[1];
    return (slug ? getProject(slug)?.hue : undefined) ?? 0.45;
  }, [pathname]);

  // reset per-route interaction state
  useEffect(() => {
    setWorld({ focus: -1 });
    live.dragVel = 0;
  }, [pathname]);

  // device capability detection
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    const weak = mobile || cores <= 4;
    setWorld({ quality: weak ? "low" : "high" });
  }, []);

  // drag the world (mouse + touch) with inertia
  useEffect(() => {
    let dragging = false;
    let lastX = 0;
    const down = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest("a,button,input,textarea,select,[data-no-drag]")) return;
      dragging = true;
      lastX = e.clientX;
      setWorld({ cursorMode: "label", cursorLabel: "Drag" });
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = (e.clientX - lastX) / window.innerWidth;
      lastX = e.clientX;
      live.dragX = dx;
      live.dragVel += dx * 0.09;
      live.dragVel = Math.max(-0.06, Math.min(0.06, live.dragVel));
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      setWorld({ cursorMode: "dot", cursorLabel: null });
    };
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <>
      <Suspense fallback={<div className="fixed inset-0 z-0 bg-background" />}>
        <div
          className="transition-opacity duration-[1600ms] ease-out"
          style={{ opacity: entered ? 1 : 0.55 }}
        >
          <World variant={variant} hue={hue} />
        </div>
      </Suspense>
      <TransitionVeil />
    </>
  );
}

/**
 * Page transitions: intercepts internal navigation, distorts and floods the
 * world with green before the new scene emerges (~1000ms end to end).
 */
function TransitionVeil() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const busy = useRef(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || anchor.target === "_blank") return;
      if (href === window.location.pathname) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      if (busy.current) return;
      busy.current = true;
      setPhase("out");
      live.veil = 1;
      setWorld({ veil: 1 });
      playCue("transition");
      window.setTimeout(() => {
        void navigate({ to: href });
        setPhase("in");
        live.veil = 0.4;
        setWorld({ veil: 0.4 });
      }, 520);
      window.setTimeout(() => {
        setPhase("idle");
        live.veil = 0;
        setWorld({ veil: 0 });
        busy.current = false;
      }, 1120);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigate]);

  const out = phase === "out";
  const active = phase !== "idle";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[65]"
      style={{
        opacity: out ? 1 : 0,
        transition: out ? "opacity 480ms cubic-bezier(0.16,1,0.3,1)" : "opacity 620ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "var(--gradient-veil)",
          transform: out ? "scale(1)" : "scale(1.5)",
          transition: "transform 900ms cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      <div
        className="absolute inset-0 bg-forest"
        style={{ opacity: out ? 0.92 : 0, transition: "opacity 520ms linear" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-display text-6xl tracking-[-0.06em] text-glow md:text-8xl"
          style={{
            opacity: active ? 1 : 0,
            transform: out ? "scale(1)" : "scale(1.4)",
            filter: out ? "blur(0px)" : "blur(10px)",
            transition: "all 780ms cubic-bezier(0.16,1,0.3,1)",
            textShadow: "var(--glow-hard)",
          }}
        >
          239
        </span>
      </div>
    </div>
  );
}
