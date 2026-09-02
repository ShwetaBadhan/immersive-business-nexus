import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COL } from "./palette";
import { CHROME, DEEP, EMERALD, GLASS, useStageMotion } from "./Stage";

/* ================================================================== *
 * Large-scale cinematic background worlds for the home page sections
 * (everything below the hero).
 *
 * One dominant composition per section. Each sculpture is oversized and
 * often extends past the frame, sits deep in Z, and travels through the
 * background as the section passes the viewport: emerging from depth,
 * drifting closer and sideways, rotating slowly, then receding again.
 * Content always renders above these canvases at z-10.
 * ================================================================== */

const clamp01 = (x: number) => THREE.MathUtils.clamp(x, 0, 1);
const EASE = (x: number) => x * x * (3 - 2 * x);
/** 0 at the section edges, 1 at its focal point */
const FOCUS = (p: number) => Math.sin(Math.PI * clamp01(p)) ** 1.1;

/** marks a material's authored opacity so Drift can fade it relatively */
export function base(o: number) {
  return { transparent: true, opacity: o, userData: { baseOpacity: o } };
}

export type DriftSide = "left" | "right" | "center";

/**
 * Cinematic depth driver for one large sculpture.
 *
 * `near`/`far` are camera-space Z bounds: the form emerges around `far`,
 * reaches `near` at the section's focal point, then falls back. `side`
 * pushes the mass off to one edge so the reading column stays clear.
 */
export function Drift({
  children,
  side = "right",
  near = -4.5,
  far = -13,
  offsetX = 2.5,
  offsetY = 0,
  scale = 3.2,
  spin = 0.05,
  tilt = 0.12,
  intensity = 1,
  fade = 1,
}: {
  children: ReactNode;
  side?: DriftSide;
  near?: number;
  far?: number;
  offsetX?: number;
  offsetY?: number;
  scale?: number;
  spin?: number;
  tilt?: number;
  intensity?: number;
  /** master opacity multiplier — keeps the form behind the content */
  fade?: number;
}) {
  const motion = useStageMotion();
  const group = useRef<THREE.Group>(null);
  const p = useRef(0.5);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const dir = side === "left" ? -1 : side === "right" ? 1 : 0;

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const k = Math.min(1, dt * 2.4);

    p.current += (motion.scroll - p.current) * k * 0.5;
    const e = EASE(p.current);
    const f = FOCUS(p.current);

    // lateral slide across the section + gentle vertical rise
    const x = dir * offsetX + THREE.MathUtils.lerp(-0.9, 0.9, e) * (dir === 0 ? 1.1 : 0.55);
    const y = offsetY + THREE.MathUtils.lerp(-0.85, 0.85, e) * 0.6 + Math.sin(t * 0.22) * 0.08;
    const z = THREE.MathUtils.lerp(far, near, f);

    tmp.set(
      x * intensity + motion.x * 0.5 * intensity,
      y * intensity - motion.y * 0.32 * intensity,
      z,
    );
    g.position.lerp(tmp, k * 0.35);

    const ry = t * spin + e * 0.9 + motion.x * 0.14;
    const rx = tilt + motion.y * 0.07 + Math.sin(t * 0.17) * 0.05;
    g.rotation.x += (rx - g.rotation.x) * k * 0.3;
    g.rotation.y += (ry - g.rotation.y) * k * 0.6;
    g.rotation.z += ((e - 0.5) * 0.14 - g.rotation.z) * k * 0.3;

    const s = scale * (0.82 + f * 0.26) * THREE.MathUtils.lerp(0.72, 1, intensity);
    g.scale.lerp(tmp.set(s, s, s), k * 0.3);

    // depth-based opacity: deepest = faintest, never fights the text
    const o = (0.3 + f * 0.5) * fade;
    g.traverse((c) => {
      const m = (c as THREE.Mesh).material as THREE.Material & { opacity?: number };
      if (m && m.transparent) m.opacity = (m.userData["baseOpacity"] ?? 1) * o;
    });
  });

  return <group ref={group}>{children}</group>;
}

/* --------------------------- 02 INTRODUCTION --------------------------- */
/**
 * An abstract, minimal pen: a slender glass barrel, a chrome tapered nib and a
 * single emerald band, held in a wide chrome orbit. Reads as strategy, ideas
 * and creative thinking rather than a literal office pen.
 */
export function MomentumWorld({ compact = false }: { compact?: boolean }) {
  const pen = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Group>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (halo.current) halo.current.rotation.z = t * 0.05;
    if (pen.current) {
      pen.current.rotation.y = t * 0.16;
      pen.current.position.y = Math.sin(t * 0.5) * 0.07;
      pen.current.rotation.z = -0.42 + Math.sin(t * 0.33) * 0.05;
    }
  });
  const seg = compact ? 16 : 32;
  return (
    <group>
      <group ref={pen} rotation={[0, 0, -0.42]}>
        {/* barrel */}
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.085, 0.1, 1.5, seg]} />
          <meshPhysicalMaterial {...GLASS} thickness={1.2} roughness={0.18} color="#eef7f1" {...base(0.72)} />
        </mesh>
        {/* tapered nib — apex points down toward the writing surface */}
        <mesh position={[0, -0.66, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.085, 0.36, seg]} />
          <meshStandardMaterial {...CHROME} {...base(0.7)} />
        </mesh>
        {/* nib tip */}
        <mesh position={[0, -0.87, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.018, 0.1, 8]} />
          <meshStandardMaterial {...EMERALD} {...base(0.8)} />
        </mesh>
        {/* grip band */}
        <mesh position={[0, -0.42, 0]}>
          <cylinderGeometry args={[0.098, 0.098, 0.08, seg]} />
          <meshStandardMaterial {...EMERALD} {...base(0.62)} />
        </mesh>
        {/* cap ring */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.092, 0.092, 0.22, seg]} />
          <meshStandardMaterial {...CHROME} {...base(0.58)} />
        </mesh>
        {/* clip — a single thin line */}
        <mesh position={[0.1, 0.78, 0]} rotation={[0, 0, 0.04]}>
          <boxGeometry args={[0.016, 0.42, 0.05]} />
          <meshStandardMaterial {...CHROME} {...base(0.5)} />
        </mesh>
      </group>

      <group ref={halo}>
        <mesh rotation={[Math.PI / 2.4, 0.25, 0]}>
          <torusGeometry args={[1.55, 0.012, 6, 96]} />
          <meshStandardMaterial {...CHROME} {...base(0.45)} />
        </mesh>
        <mesh rotation={[Math.PI / 1.9, -0.4, 0.3]}>
          <torusGeometry args={[1.9, 0.008, 6, 96]} />
          <meshStandardMaterial {...EMERALD} {...base(0.3)} />
        </mesh>
      </group>
      {!compact && (
        <mesh position={[1.3, 0.7, 0.4]}>
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshStandardMaterial {...EMERALD} {...base(0.7)} />
        </mesh>
      )}
    </group>
  );
}


/* ---------------------------- 03 WHAT WE DO ---------------------------- */
/** Stacked translucent architectural panels — a tall glass massing. */
export function PracticeWorld({ compact = false }: { compact?: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) g.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.11) * 0.3;
  });
  const n = compact ? 3 : 4;
  return (
    <group ref={g}>
      {Array.from({ length: n }, (_, i) => {
        const o = i - (n - 1) / 2;
        return (
          <mesh key={i} position={[o * 0.22, o * 0.52, o * -0.34]} rotation={[-0.18, 0.24, o * 0.05]}>
            <boxGeometry args={[1.9 - Math.abs(o) * 0.14, 0.9, 0.03]} />
            <meshPhysicalMaterial
              {...GLASS}
              thickness={0.7}
              roughness={0.2}
              color="#f1f9f4"
              {...base(0.6)}
            />
          </mesh>
        );
      })}
      <mesh rotation={[0.1, 0, 0.06]}>
        <cylinderGeometry args={[0.014, 0.014, 3.6, 8]} />
        <meshStandardMaterial {...CHROME} {...base(0.5)} />
      </mesh>
      <mesh position={[0.9, -1.1, 0.5]} rotation={[0.4, 0.3, 0]}>
        <torusGeometry args={[0.5, 0.02, 6, 64]} />
        <meshStandardMaterial {...EMERALD} {...base(0.42)} />
      </mesh>
    </group>
  );
}

/* --------------------------- 04 CASE STUDIES --------------------------- */
/** A long twisted ribbon threading a large wireframe shell. */
export function TrajectoryWorld({ compact = false }: { compact?: boolean }) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.4, -1.1, -0.7),
        new THREE.Vector3(-0.9, 0.35, 0.5),
        new THREE.Vector3(0.6, -0.4, -0.5),
        new THREE.Vector3(2.3, 1.05, 0.4),
      ]),
    [],
  );
  const shell = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (shell.current) {
      shell.current.rotation.y = s.clock.elapsedTime * 0.07;
      shell.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.09) * 0.2;
    }
  });
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, compact ? 60 : 110, 0.055, 10, false]} />
        <meshPhysicalMaterial {...GLASS} thickness={1} roughness={0.16} color="#eff8f2" {...base(0.64)} />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial {...DEEP} wireframe {...base(0.12)} />
      </mesh>
      {[-1.6, 0.2, 1.8].map((x, i) => (
        <mesh key={i} position={[x, i % 2 ? 0.75 : -0.7, 0.35]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial {...EMERALD} {...base(0.4)} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------------------- 05 PHILOSOPHY ---------------------------- */
/** Giant concentric alignment rings — mostly off-frame. */
export function AlignmentWorld({ compact = false }: { compact?: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) g.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.08) * 0.24;
  });
  const rings = compact ? 2 : 4;
  return (
    <group ref={g} rotation={[0.3, 0.4, 0]}>
      {Array.from({ length: rings }, (_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.16]} position={[0, i * 0.26 - rings * 0.13, 0]}>
          <torusGeometry args={[1.1 + i * 0.34, 0.02 - i * 0.002, 6, 90]} />
          <meshStandardMaterial {...(i % 2 ? EMERALD : CHROME)} {...base(0.52 - i * 0.06)} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshPhysicalMaterial {...GLASS} thickness={1.6} roughness={0.28} color="#f2faf6" {...base(0.62)} />
      </mesh>
    </group>
  );
}

/* ------------------------------ 06 CTA -------------------------------- */
/** The closing sculpture: a large glass core in a chrome exo-frame. */
export function ArrivalWorld({ compact = false }: { compact?: boolean }) {
  const frame = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (frame.current) {
      frame.current.rotation.y = s.clock.elapsedTime * 0.1;
      frame.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.13) * 0.18;
    }
  });
  return (
    <group>
      <mesh>
        <dodecahedronGeometry args={[1.1, 0]} />
        <meshPhysicalMaterial {...GLASS} thickness={1.8} roughness={0.2} color="#eef7f1" {...base(0.68)} />
      </mesh>
      <group ref={frame}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[i * 1.05, i * 0.7, i * 0.4]}>
            <torusGeometry args={[1.75 + i * 0.2, 0.014, 6, 96]} />
            <meshStandardMaterial {...(i === 1 ? EMERALD : CHROME)} {...base(0.45 - i * 0.08)} />
          </mesh>
        ))}
      </group>
      {!compact && (
        <mesh position={[-1.5, -1.1, 0.6]} rotation={[0.5, 0.2, 0.3]}>
          <torusKnotGeometry args={[0.32, 0.08, 64, 12]} />
          <meshStandardMaterial {...CHROME} {...base(0.4)} />
        </mesh>
      )}
    </group>
  );
}

/** Far-background haze that drifts toward the viewer with scroll. */
export function DepthHaze({ count = 90, depth = 16 }: { count?: number; depth?: number }) {
  const motion = useStageMotion();
  const points = useRef<THREE.Points>(null);
  const seed = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 11;
      arr[i * 3 + 2] = -Math.random() * depth;
    }
    return arr;
  }, [count, depth]);
  const positions = useMemo(() => seed.slice(), [seed]);

  useFrame((state) => {
    const geo = points.current?.geometry;
    if (!geo) return;
    const t = state.clock.elapsedTime;
    const travel = motion.scroll * depth * 0.5;
    const attr = geo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const z = ((seed[i * 3 + 2]! + travel) % depth + depth) % depth - depth * 0.92;
      positions[i * 3] = seed[i * 3]! + Math.sin(t * 0.12 + i) * 0.08 + motion.x * 0.3;
      positions[i * 3 + 1] = seed[i * 3 + 1]! + Math.cos(t * 0.1 + i) * 0.08 - motion.y * 0.2;
      positions[i * 3 + 2] = z;
    }
    attr.array = positions;
    attr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.042}
        sizeAttenuation
        color={COL.brand}
        transparent
        opacity={0.22}
        depthWrite={false}
      />
    </points>
  );
}
