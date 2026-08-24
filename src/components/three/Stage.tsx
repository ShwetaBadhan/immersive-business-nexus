import "./r3f-devtag-patch";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
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
function Rig({ tint = 1 }: { tint?: number }) {
  return (
    <>
      <ambientLight intensity={1.15} />
      <hemisphereLight intensity={0.7} color={"#ffffff"} groundColor={COL.moss} />
      <directionalLight position={[3.4, 5.2, 4.2]} intensity={2.1} color="#ffffff" />
      <directionalLight position={[-4.2, -1.4, 2.6]} intensity={0.9} color={COL.neon} />
      <Environment resolution={128}>
        <Lightformer intensity={2.4} position={[0, 4, 3]} scale={[9, 4, 1]} color="#ffffff" />
        <Lightformer intensity={1.1 * tint} position={[-4, 1, 2]} scale={[4, 6, 1]} color={COL.neon} />
        <Lightformer intensity={0.8 * tint} position={[4.5, -1.5, 1]} scale={[4, 5, 1]} color={COL.brand} />
        <Lightformer intensity={0.7} position={[0, -4, -2]} scale={[9, 4, 1]} color={COL.forest} />
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
}: {
  children: ReactNode;
  className?: string;
  camera?: THREE.Vector3Tuple;
  fov?: number;
  tint?: number;
  /** externally controlled hover energy (e.g. a card owns the hover state) */
  hover?: boolean;
  onHoverChange?: (hovered: boolean) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
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
      { rootMargin: "20% 0px 20% 0px" },
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

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", read);
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
          dpr={[1, 1.75]}
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
  transmission: 0.92,
  thickness: 1.1,
  roughness: 0.08,
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
