import { useEffect, useRef } from "react";
import { live, setWorld, useWorld } from "@/lib/world-store";

/**
 * Custom interpolated cursor: a small dot that expands into a labelled ring
 * over interactive elements. Also the single source of pointer tracking for
 * the whole experience (writes into `live`).
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useWorld((s) => s.cursorLabel);
  const mode = useWorld((s) => s.cursorMode);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let dx = window.innerWidth / 2;
    let dy = window.innerHeight / 2;
    let rx = dx;
    let ry = dy;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      live.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      live.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
      dx = e.clientX;
      dy = e.clientY;
    };

    const tick = () => {
      rx += (dx - rx) * 0.14;
      ry += (dy - ry) * 0.14;
      if (dot.current) dot.current.style.transform = `translate3d(${dx}px,${dy}px,0) translate(-50%,-50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const expanded = mode !== "dot";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] hidden md:block">
      <div
        ref={ring}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-neon/60 transition-[width,height,opacity,background-color] duration-500 ease-out"
        style={{
          width: expanded ? 88 : 30,
          height: expanded ? 88 : 30,
          opacity: expanded ? 1 : 0.4,
          backgroundColor: expanded ? "oklch(0.7316 0.1714 156.53 / 10%)" : "transparent",
          boxShadow: expanded ? "var(--glow-soft)" : "none",
        }}
      >
        <span
          className="label !text-glow transition-opacity duration-300"
          style={{ opacity: mode === "label" && label ? 1 : 0, fontSize: "0.55rem" }}
        >
          {label}
        </span>
      </div>
      <div
        ref={dot}
        className="absolute left-0 top-0 rounded-full bg-glow transition-opacity duration-300"
        style={{ width: 5, height: 5, opacity: expanded ? 0 : 1 }}
      />
    </div>
  );
}

/** Attach to any interactive element to drive the cursor state. */
export function cursorProps(text?: string) {
  return {
    onPointerEnter: () =>
      setWorld({ cursorMode: text ? "label" : "ring", cursorLabel: text ?? null }),
    onPointerLeave: () => setWorld({ cursorMode: "dot", cursorLabel: null }),
  };
}
