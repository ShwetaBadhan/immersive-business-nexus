import "./r3f-devtag-patch";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { COL } from "./palette";

/* ------------------------------------------------------------------ *
 * Shared stage for the section-level 3D visuals.
 *
 * Every visual on the site is rendered through this component so they
 * all share the same lighting rig, environment reflections, materials
 * and interaction model (inertial pointer + element scroll progress).
 * ------------------------------------------------------------------ */

export type StageMotion = {
  /** smoothed pointer, -1..1, relative to the stage element */
  x: number;
  y: number;
  /** raw pointer target */
  tx: number;
  ty: number;
  /** 0..1 progress of the element travelling through the viewport */
  scroll: number;
  /** 1 while the pointer is over the stage's section */
  hover: number;
};

const MotionCtx = createContext<StageMotion>({ x: 0, y: 0, tx: 0, ty: 0, scroll: 0.5, hover: 0 });

/** Live, mutable motion values for the closest stage. Read inside useFrame. */
export function useStageMotion() {
  return useContext(MotionCtx);
}

function useHydrated() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}

/** Smooths the pointer target into inertial values once per frame. */
function MotionDriver({ motion }: { motion: StageMotion }) {
  useFrame((_, dt) => {
    const k = Math.min(1, dt * 6);
    motion.x += (motion.tx - motion.x) * k;
    motion.y += (motion.ty - motion.y) * k;
  });
  return null;
}

/** Chrome / glass reflections without any network fetch. */
function Rig({ tint = 1, dark = false }: { tint?: number; dark?: boolean }) {
  const k = dark ? 0.4 : 1;
  return (
    <>
      <ambientLight intensity={1.25 * k} />
      <hemisphereLight intensity={0.7 * k} color={COL.paper} groundColor={COL.moss} />
      <directionalLight position={[3.4, 5.2, 4.2]} intensity={1.6 * (dark ? 0.55 : 1)} color={COL.paper} />
      <directionalLight position={[-4.2, -1.4, 2.6]} intensity={dark ? 1.1 : 0.6} color={COL.neon} />
      <Environment resolution={64}>
        <Lightformer intensity={2.4 * k} position={[0, 4, 3]} scale={[9, 4, 1]} color={COL.paper} />
        <Lightformer intensity={1.1 * tint * (dark ? 1.4 : 1)} position={[-4, 1, 2]} scale={[4, 6, 1]} color={COL.neon} />
        <Lightformer intensity={0.8 * tint * (dark ? 1.3 : 1)} position={[4.5, -1.5, 1]} scale={[4, 5, 1]} color={COL.brand} />
      </Environment>
    </>
  );
}


export function Stage({
  children,
  className = "",
  camera = [0, 0, 6.2],
  fov = 34,
  tint = 1,
  hover,
  onHoverChange,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  camera?: THREE.Vector3Tuple;
  fov?: number;
  tint?: number;
  /** externally controlled hover energy (e.g. a card owns the hover state) */
  hover?: boolean;
  onHoverChange?: (hovered: boolean) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const coarse =
    typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches;
  const [visible, setVisible] = useState(false);
  const motion = useRef<StageMotion>({ x: 0, y: 0, tx: 0, ty: 0, scroll: 0.5, hover: 0 }).current;

  /* only render while the visual is anywhere near the viewport */
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setVisible(entry.isIntersecting);
      },
      { rootMargin: "10% 0px 10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* pointer + scroll drivers live outside the canvas so they keep working
     even while the canvas is unmounted */
  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const read = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      motion.scroll = THREE.MathUtils.clamp((vh - r.top) / (vh + r.height), 0, 1);
    };

    const onMove = (e: PointerEvent) => {
      if (reduce) return;
      const r = el.getBoundingClientRect();
      motion.tx = THREE.MathUtils.clamp(((e.clientX - r.left) / r.width) * 2 - 1, -2, 2);
      motion.ty = THREE.MathUtils.clamp(((e.clientY - r.top) / r.height) * 2 - 1, -2, 2);
    };

    let queued = 0;
    const onScroll = () => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        read();
      });
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", read);
    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }
    return () => {
      if (queued) cancelAnimationFrame(queued);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", read);
      window.removeEventListener("pointermove", onMove);
    };
  }, [motion]);

  /* mirror externally owned hover into the live motion object */
  useEffect(() => {
    if (hover === undefined) return;
    motion.hover = hover ? 1 : 0;
  }, [hover, motion]);

  return (
    <div
      ref={host}
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      style={style}
      onPointerEnter={() => {
        if (hover === undefined) motion.hover = 1;
        onHoverChange?.(true);
      }}
      onPointerLeave={() => {
        if (hover === undefined) motion.hover = 0;
        onHoverChange?.(false);
      }}
    >
      {hydrated && visible && (
        <Canvas
          dpr={coarse ? [1, 1.15] : [1, 1.4]}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
          camera={{ position: camera, fov, near: 0.1, far: 40 }}
          style={{ background: "transparent" }}
        >
          <MotionCtx.Provider value={motion}>
            <MotionDriver motion={motion} />
            <Rig tint={tint} />
            {children}
          </MotionCtx.Provider>
        </Canvas>
      )}
    </div>
  );
}

/* ------------------------------ materials ------------------------------ */

export const GLASS = {
  transparent: true,
  transmission: 0.78,
  thickness: 1.1,
  roughness: 0.14,
  ior: 1.42,
  metalness: 0,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
  opacity: 1,
} as const;

export const CHROME = {
  metalness: 1,
  roughness: 0.16,
  color: "#e9f1ec",
} as const;

export const EMERALD = {
  metalness: 0.75,
  roughness: 0.22,
  color: COL.neon,
} as const;

export const DEEP = {
  metalness: 0.6,
  roughness: 0.3,
  color: COL.glow,
} as const;
