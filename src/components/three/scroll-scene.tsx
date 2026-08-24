import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COL } from "./palette";
import { CHROME, DEEP, EMERALD, GLASS, useStageMotion } from "./Stage";

/* ================================================================== *
 * Micro-detail 3D layer for the home page (below the hero).
 *
 * Everything here is deliberately tiny: small glass fragments, thin
 * rings, hairline curves and a few drifting motes. Objects sit in the
 * negative space of each section, drift very slowly toward the viewer
 * as the section passes, fade at the edges of their travel and leave
 * quietly. Nothing ever fills the frame.
 * ================================================================== */

export type FlightPattern = "approach" | "sweep" | "rise" | "converge" | "orbit";

const clamp01 = (x: number) => THREE.MathUtils.clamp(x, 0, 1);
const EASE = (x: number) => x * x * (3 - 2 * x);
/** 0 at the edges of the section, 1 at its focal point */
const FOCUS = (p: number) => Math.sin(Math.PI * clamp01(p)) ** 1.2;

function pathAt(pattern: FlightPattern, p: number, depth: number) {
  const e = EASE(p);
  const f = FOCUS(p);
  switch (pattern) {
    case "approach":
      return {
        pos: [
          THREE.MathUtils.lerp(-0.5, 0.7, e),
          THREE.MathUtils.lerp(0.5, -0.6, e),
          THREE.MathUtils.lerp(-depth, -depth * 0.18, e),
        ] as THREE.Vector3Tuple,
        rot: [f * 0.1, THREE.MathUtils.lerp(-0.4, 0.4, e), (e - 0.5) * 0.12] as THREE.Vector3Tuple,
      };
    case "sweep":
      return {
        pos: [
          THREE.MathUtils.lerp(-1.6, 1.6, e),
          Math.sin(p * Math.PI) * 0.24 - 0.1,
          THREE.MathUtils.lerp(-depth, -depth * 0.24, f),
        ] as THREE.Vector3Tuple,
        rot: [0.06, THREE.MathUtils.lerp(-0.6, 0.6, e), Math.sin(p * Math.PI) * 0.1] as THREE.Vector3Tuple,
      };
    case "rise":
      return {
        pos: [
          THREE.MathUtils.lerp(0.5, -0.4, e),
          THREE.MathUtils.lerp(-1.1, 1.2, e),
          THREE.MathUtils.lerp(-depth, -depth * 0.22, f),
        ] as THREE.Vector3Tuple,
        rot: [THREE.MathUtils.lerp(0.2, -0.2, e), e * 0.7, 0.04] as THREE.Vector3Tuple,
      };
    case "converge":
      return {
        pos: [
          Math.sin(p * Math.PI * 1.1) * 0.35,
          THREE.MathUtils.lerp(0.4, -0.4, e),
          THREE.MathUtils.lerp(-depth, -depth * 0.16, f),
        ] as THREE.Vector3Tuple,
        rot: [f * 0.12, e * 0.9, 0] as THREE.Vector3Tuple,
      };
    case "orbit":
    default: {
      const a = THREE.MathUtils.lerp(-0.9, 0.9, e);
      return {
        pos: [
          Math.sin(a) * 1.25,
          THREE.MathUtils.lerp(0.4, -0.45, e),
          -depth + (Math.cos(a) * 0.5 + 0.5) * depth * 0.8,
        ] as THREE.Vector3Tuple,
        rot: [0.05, -a * 0.6, Math.sin(a) * 0.07] as THREE.Vector3Tuple,
      };
    }
  }
}

/**
 * Places a tiny detail on a slow scroll drift path with inertial smoothing
 * and edge fading. `scale` keeps the object in the 20-100px range.
 */
export function Flight({
  pattern,
  depth = 7,
  intensity = 1,
  scale = 0.22,
  children,
}: {
  pattern: FlightPattern;
  depth?: number;
  intensity?: number;
  /** base object scale — small on purpose */
  scale?: number;
  children: ReactNode;
}) {
  const motion = useStageMotion();
  const group = useRef<THREE.Group>(null);
  const p = useRef(0.5);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const k = Math.min(1, dt * 2.2);

    p.current += (motion.scroll - p.current) * k * 0.4;
    const { pos, rot } = pathAt(pattern, p.current, depth);
    const f = FOCUS(p.current);

    target.set(
      pos[0] * intensity + motion.x * 0.16 * intensity,
      pos[1] * intensity + Math.sin(t * 0.3) * 0.05 - motion.y * 0.1 * intensity,
      THREE.MathUtils.lerp(-depth, pos[2], intensity),
    );
    g.position.lerp(target, k * 0.4);

    g.rotation.x += (rot[0] * intensity + motion.y * 0.04 - g.rotation.x) * k * 0.35;
    g.rotation.y += (rot[1] * intensity + t * 0.03 + motion.x * 0.08 - g.rotation.y) * k * 0.35;
    g.rotation.z += (rot[2] * intensity - g.rotation.z) * k * 0.35;

    const s = scale * (0.7 + f * 0.45) * THREE.MathUtils.lerp(0.7, 1, intensity);
    g.scale.lerp(target.set(s, s, s), k * 0.35);

    // fade at the edges of the travel so nothing ever pops in or out
    const o = 0.15 + f * 0.85;
    g.traverse((c) => {
      const m = (c as THREE.Mesh).material as THREE.Material & { opacity?: number };
      if (m && m.transparent) m.opacity = (m.userData["baseOpacity"] ?? 1) * o;
    });
  });

  return <group ref={group}>{children}</group>;
}

/** marks a material's authored opacity so Flight can fade it relatively */
function base(o: number) {
  return { transparent: true, opacity: o, userData: { baseOpacity: o } };
}

/* ------------------------------ micro details ------------------------------ */

/** 02 INTRODUCTION — a single frosted glass fragment with a hairline ring. */
export function MomentumForm() {
  const ring = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ring.current) ring.current.rotation.z = s.clock.elapsedTime * 0.08;
  });
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshPhysicalMaterial {...GLASS} thickness={0.6} roughness={0.24} color="#f2faf6" {...base(0.9)} />
      </mesh>
      <group ref={ring}>
        <mesh rotation={[Math.PI / 2.3, 0.2, 0]}>
          <torusGeometry args={[0.95, 0.006, 8, 96]} />
          <meshStandardMaterial {...CHROME} {...base(0.4)} />
        </mesh>
      </group>
      <mesh position={[0.8, 0.42, 0.2]}>
        <sphereGeometry args={[0.05, 14, 14]} />
        <meshStandardMaterial {...EMERALD} {...base(0.75)} />
      </mesh>
    </group>
  );
}

/** 03 WHAT WE DO — three miniature glass shards, barely offset. */
export function PracticeLattice({ compact = false }: { compact?: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) g.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.14) * 0.28;
  });
  const n = compact ? 2 : 3;
  return (
    <group ref={g}>
      {Array.from({ length: n }, (_, i) => {
        const o = i - (n - 1) / 2;
        return (
          <mesh key={i} position={[o * 0.3, o * 0.34, o * -0.28]} rotation={[-0.3, 0.22, o * 0.08]}>
            <boxGeometry args={[0.62, 0.4, 0.012]} />
            <meshPhysicalMaterial {...GLASS} thickness={0.4} roughness={0.2} color="#f3fbf7" {...base(0.85)} />
          </mesh>
        );
      })}
      <mesh position={[0.05, 0, 0.1]} rotation={[0.14, 0, 0.1]}>
        <cylinderGeometry args={[0.005, 0.005, 1.2, 8]} />
        <meshStandardMaterial {...EMERALD} {...base(0.6)} />
      </mesh>
    </group>
  );
}

/** 04 CASE STUDIES — one hairline curve threading two tiny nodes. */
export function TrajectoryRibbon() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.1, -0.55, -0.3),
        new THREE.Vector3(-0.3, 0.12, 0.2),
        new THREE.Vector3(0.45, -0.2, -0.2),
        new THREE.Vector3(1.05, 0.5, 0.15),
      ]),
    [],
  );
  const nodes = useMemo(() => [0.18, 0.72].map((u) => curve.getPointAt(u)), [curve]);
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 90, 0.008, 8, false]} />
        <meshStandardMaterial {...CHROME} {...base(0.5)} />
      </mesh>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i === 0 ? 0.04 : 0.055, 16, 16]} />
          {i === 0 ? (
            <meshStandardMaterial {...CHROME} {...base(0.7)} />
          ) : (
            <meshStandardMaterial {...EMERALD} {...base(0.8)} />
          )}
        </mesh>
      ))}
      <mesh position={[0.9, -0.5, -0.4]}>
        <icosahedronGeometry args={[0.09, 0]} />
        <meshPhysicalMaterial {...GLASS} thickness={0.3} color="#f2faf6" {...base(0.75)} />
      </mesh>
    </group>
  );
}

/** 05 PHILOSOPHY — two very thin rings resolving into alignment. */
export function AlignmentRings() {
  const g = useRef<THREE.Group>(null);
  const motion = useStageMotion();
  useFrame((s, dt) => {
    if (!g.current) return;
    const k = Math.min(1, dt * 2);
    const align = FOCUS(motion.scroll);
    g.current.children.forEach((c, i) => {
      const off = (1 - align) * (i - 0.5) * 0.3;
      c.position.x += (off - c.position.x) * k * 0.4;
      c.rotation.y = s.clock.elapsedTime * (0.06 + i * 0.03);
    });
  });
  return (
    <group ref={g}>
      {[0, 1].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[0.6 - i * 0.14, i === 0 ? 0.006 : 0.012, 10, 96]} />
          {i === 0 ? (
            <meshStandardMaterial {...CHROME} {...base(0.55)} />
          ) : (
            <meshStandardMaterial {...DEEP} {...base(0.6)} />
          )}
        </mesh>
      ))}
    </group>
  );
}

/** 06 FINAL CTA — a tiny glass core with an emissive point. */
export function ArrivalCore() {
  const shell = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (shell.current) {
      shell.current.rotation.x = s.clock.elapsedTime * 0.07;
      shell.current.rotation.z = -s.clock.elapsedTime * 0.05;
    }
  });
  return (
    <group>
      <mesh ref={shell}>
        <dodecahedronGeometry args={[0.42, 0]} />
        <meshPhysicalMaterial {...GLASS} thickness={0.7} roughness={0.22} color="#f4fbf8" {...base(0.9)} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.09, 18, 18]} />
        <meshStandardMaterial {...EMERALD} {...base(0.85)} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0.3, 0]}>
        <torusGeometry args={[0.78, 0.005, 8, 96]} />
        <meshStandardMaterial {...CHROME} {...base(0.35)} />
      </mesh>
    </group>
  );
}

/* ---------------------------- depth motes ---------------------------- */

/** A sparse haze of tiny motes — depth cue only, never a particle field. */
export function DepthDust({ count = 60, depth = 9 }: { count?: number; depth?: number }) {
  const motion = useStageMotion();
  const points = useRef<THREE.Points>(null);
  const base = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = -Math.random() * depth;
    }
    return arr;
  }, [count, depth]);

  const positions = useMemo(() => base.slice(), [base]);

  useFrame((state) => {
    const geo = points.current?.geometry;
    if (!geo) return;
    const t = state.clock.elapsedTime;
    const travel = motion.scroll * depth * 0.45;
    const attr = geo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const z = ((base[i * 3 + 2]! + travel) % depth + depth) % depth - depth * 0.9;
      positions[i * 3] = base[i * 3]! + Math.sin(t * 0.14 + i) * 0.05 + motion.x * 0.16;
      positions[i * 3 + 1] = base[i * 3 + 1]! + Math.cos(t * 0.11 + i) * 0.05 - motion.y * 0.1;
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
        size={0.016}
        sizeAttenuation
        color={COL.brand}
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------- midground secondaries ------------------------- *
 * Slightly smaller companions that share the same material language and
 * ride a different flight path, giving each section a second depth level.
 * ----------------------------------------------------------------------- */

/** thin metallic wireframe cage */
export function WireCage() {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) {
      g.current.rotation.y = s.clock.elapsedTime * 0.12;
      g.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.09) * 0.25;
    }
  });
  return (
    <group ref={g}>
      <mesh>
        <icosahedronGeometry args={[0.62, 1]} />
        <meshStandardMaterial {...CHROME} wireframe {...base(0.5)} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.1, 18, 18]} />
        <meshStandardMaterial {...EMERALD} {...base(0.8)} />
      </mesh>
    </group>
  );
}

/** transparent crystal shard */
export function CrystalShard() {
  const m = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (m.current) {
      m.current.rotation.z = s.clock.elapsedTime * 0.1;
      m.current.rotation.y = s.clock.elapsedTime * 0.16;
    }
  });
  return (
    <group>
      <mesh ref={m}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshPhysicalMaterial {...GLASS} thickness={0.9} roughness={0.14} color="#f1faf6" {...base(0.92)} />
      </mesh>
      <mesh rotation={[Math.PI / 2.6, 0.4, 0]}>
        <torusGeometry args={[0.9, 0.008, 8, 96]} />
        <meshStandardMaterial {...CHROME} {...base(0.45)} />
      </mesh>
    </group>
  );
}

/** curved 3D ribbon */
export function RibbonArc() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.95, -0.7, 0),
        new THREE.Vector3(-0.2, 0.1, 0.35),
        new THREE.Vector3(0.55, 0.35, -0.2),
        new THREE.Vector3(0.95, -0.4, 0.1),
      ]),
    [],
  );
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) g.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.13) * 0.5;
  });
  return (
    <group ref={g}>
      <mesh>
        <tubeGeometry args={[curve, 110, 0.028, 10, false]} />
        <meshPhysicalMaterial {...GLASS} thickness={0.6} roughness={0.16} color="#eff9f4" {...base(0.88)} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve, 110, 0.005, 8, false]} />
        <meshStandardMaterial {...EMERALD} {...base(0.55)} />
      </mesh>
    </group>
  );
}

/** stacked hairline rings, architectural */
export function RingStack() {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    const t = s.clock.elapsedTime;
    g.current.children.forEach((c, i) => {
      c.rotation.z = t * (0.07 + i * 0.02) * (i % 2 ? -1 : 1);
      c.position.y = (i - 1) * 0.22 + Math.sin(t * 0.4 + i) * 0.02;
    });
  });
  return (
    <group ref={g}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2.1, 0, 0]}>
          <torusGeometry args={[0.7 - i * 0.16, i === 1 ? 0.016 : 0.007, 10, 96]} />
          {i === 1 ? (
            <meshStandardMaterial {...DEEP} {...base(0.6)} />
          ) : (
            <meshStandardMaterial {...CHROME} {...base(0.5)} />
          )}
        </mesh>
      ))}
    </group>
  );
}

/** small architectural stack of glass slabs */
export function GlassMonolith() {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) g.current.rotation.y = s.clock.elapsedTime * 0.1;
  });
  return (
    <group ref={g}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, (i - 1) * 0.36, 0]} rotation={[0, i * 0.35, 0]}>
          <boxGeometry args={[0.7 - i * 0.12, 0.28, 0.7 - i * 0.12]} />
          <meshPhysicalMaterial {...GLASS} thickness={0.8} roughness={0.18} color="#f2faf6" {...base(0.86)} />
        </mesh>
      ))}
      <mesh position={[0, 0.78, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial {...EMERALD} {...base(0.85)} />
      </mesh>
    </group>
  );
}

/** controlled cluster of small spheres */
export function NodeCluster() {
  const g = useRef<THREE.Group>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2;
        const r = 0.5 + (i % 3) * 0.18;
        return [Math.cos(a) * r, Math.sin(a * 1.3) * 0.4, Math.sin(a) * r * 0.6] as THREE.Vector3Tuple;
      }),
    [],
  );
  useFrame((s) => {
    if (g.current) {
      g.current.rotation.y = s.clock.elapsedTime * 0.14;
      g.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.1) * 0.18;
    }
  });
  return (
    <group ref={g}>
      {seeds.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i % 3 === 0 ? 0.075 : 0.045, 16, 16]} />
          {i % 3 === 0 ? (
            <meshStandardMaterial {...EMERALD} {...base(0.8)} />
          ) : (
            <meshPhysicalMaterial {...GLASS} thickness={0.4} color="#f2faf6" {...base(0.8)} />
          )}
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.72, 0.005, 8, 96]} />
        <meshStandardMaterial {...CHROME} {...base(0.4)} />
      </mesh>
    </group>
  );
}
