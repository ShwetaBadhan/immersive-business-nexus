import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { COL } from "./palette";
import { CHROME, DEEP, EMERALD, GLASS, useStageMotion } from "./Stage";

/* ================================================================== *
 * Scroll-driven depth layer for the home page (below the hero).
 *
 * Every object lives on a "flight path": it starts far in the
 * background, travels toward the viewer as the section reaches its
 * focal point, then smoothly leaves — sideways, upward or backward —
 * as the reader keeps scrolling. All motion is eased and interpolated
 * per frame, driven by the stage's element scroll progress.
 * ================================================================== */

export type FlightPattern = "approach" | "sweep" | "rise" | "converge" | "orbit";

const EASE = (x: number) => x * x * (3 - 2 * x);
/** 0 at the edges, 1 at the section focal point */
const FOCUS = (p: number) => Math.sin(Math.PI * THREE.MathUtils.clamp(p, 0, 1)) ** 1.35;

function pathAt(pattern: FlightPattern, p: number, depth: number) {
  const e = EASE(p);
  const f = FOCUS(p);
  switch (pattern) {
    case "approach":
      return {
        pos: [
          THREE.MathUtils.lerp(-1.5, 1.9, e),
          THREE.MathUtils.lerp(1.1, -1.3, e),
          THREE.MathUtils.lerp(-depth, depth * 0.42, e),
        ] as THREE.Vector3Tuple,
        rot: [f * 0.18, THREE.MathUtils.lerp(-0.9, 0.9, e), (e - 0.5) * 0.24] as THREE.Vector3Tuple,
        scale: 0.5 + f * 0.85,
      };
    case "sweep":
      return {
        pos: [
          THREE.MathUtils.lerp(-3.6, 3.6, e),
          Math.sin(p * Math.PI) * 0.5 - 0.2,
          THREE.MathUtils.lerp(-depth, -depth * 0.2, f) + f * depth * 0.9,
        ] as THREE.Vector3Tuple,
        rot: [0.1, THREE.MathUtils.lerp(-1.4, 1.4, e), Math.sin(p * Math.PI) * 0.2] as THREE.Vector3Tuple,
        scale: 0.45 + f * 0.8,
      };
    case "rise":
      return {
        pos: [
          THREE.MathUtils.lerp(1.4, -1.1, e),
          THREE.MathUtils.lerp(-2.6, 2.8, e),
          THREE.MathUtils.lerp(-depth, depth * 0.5, f),
        ] as THREE.Vector3Tuple,
        rot: [THREE.MathUtils.lerp(0.5, -0.5, e), e * 1.6, 0.08] as THREE.Vector3Tuple,
        scale: 0.5 + f * 0.9,
      };
    case "converge":
      return {
        pos: [
          Math.sin(p * Math.PI * 1.2) * 0.9,
          THREE.MathUtils.lerp(0.9, -0.9, e),
          THREE.MathUtils.lerp(-depth, depth * 0.62, f),
        ] as THREE.Vector3Tuple,
        rot: [f * 0.24, e * 2.1, 0] as THREE.Vector3Tuple,
        scale: 0.4 + f * 1.05,
      };
    case "orbit":
    default: {
      const a = THREE.MathUtils.lerp(-1.15, 1.15, e);
      return {
        pos: [Math.sin(a) * 2.9, THREE.MathUtils.lerp(0.9, -0.9, e), -depth + (Math.cos(a) * 0.5 + 0.5) * depth * 1.2] as THREE.Vector3Tuple,
        rot: [0.12, -a * 1.4, Math.sin(a) * 0.16] as THREE.Vector3Tuple,
        scale: 0.5 + f * 0.85,
      };
    }
  }
}

/**
 * Places children on a scroll flight path with inertial smoothing.
 * `intensity` scales the whole travel (used to calm things down on mobile).
 */
export function Flight({
  pattern,
  depth = 9,
  intensity = 1,
  children,
}: {
  pattern: FlightPattern;
  depth?: number;
  intensity?: number;
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
    const k = Math.min(1, dt * 3.2);

    // smooth the scroll signal itself so wheel jumps never snap the object
    p.current += (motion.scroll - p.current) * k * 0.55;
    const { pos, rot, scale } = pathAt(pattern, p.current, depth);

    target.set(
      pos[0] * intensity + motion.x * 0.55 * intensity,
      pos[1] * intensity + Math.sin(t * 0.45) * 0.09 - motion.y * 0.3 * intensity,
      THREE.MathUtils.lerp(-depth, pos[2], intensity),
    );
    g.position.lerp(target, k * 0.5);

    g.rotation.x += (rot[0] * intensity + motion.y * 0.1 - g.rotation.x) * k * 0.4;
    g.rotation.y += (rot[1] * intensity + t * 0.05 + motion.x * 0.22 - g.rotation.y) * k * 0.4;
    g.rotation.z += (rot[2] * intensity - g.rotation.z) * k * 0.4;

    const s = THREE.MathUtils.lerp(0.55, scale, intensity);
    g.scale.lerp(target.set(s, s, s), k * 0.45);
    // restore target for the next frame's position use
  });

  return <group ref={group}>{children}</group>;
}

/* ------------------------------- objects ------------------------------- */

/** 02 INTRODUCTION — a glass monolith wrapped in chrome momentum arcs. */
export function MomentumForm() {
  const arcs = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (arcs.current) arcs.current.rotation.z = s.clock.elapsedTime * 0.18;
  });
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshPhysicalMaterial {...GLASS} thickness={1.8} color="#eef7f1" />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.97, 1]} />
        <meshBasicMaterial color={COL.neon} wireframe transparent opacity={0.18} />
      </mesh>
      <group ref={arcs}>
        {[1.35, 1.7, 2.05].map((r, i) => (
          <mesh key={r} rotation={[Math.PI / 2 + i * 0.42, i * 0.6, 0]}>
            <torusGeometry args={[r, i === 1 ? 0.022 : 0.01, 12, 128]} />
            <meshStandardMaterial
              {...(i === 1 ? EMERALD : CHROME)}
              transparent
              opacity={i === 1 ? 0.85 : 0.55}
            />
          </mesh>
        ))}
      </group>
      <mesh position={[1.1, 0.7, 0.6]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial {...EMERALD} />
      </mesh>
      <mesh position={[-1.2, -0.6, 0.4]}>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
    </group>
  );
}

/** 03 WHAT WE DO — a layered practice lattice: stacked glass planes + spine. */
export function PracticeLattice({ compact = false }: { compact?: boolean }) {
  const spin = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (spin.current) spin.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.22) * 0.5;
  });
  const layers = compact ? 3 : 5;
  return (
    <group ref={spin}>
      {Array.from({ length: layers }, (_, i) => {
        const o = i - (layers - 1) / 2;
        return (
          <mesh key={i} position={[o * 0.16, o * 0.42, o * -0.34]} rotation={[-0.36, 0.28, o * 0.05]}>
            <boxGeometry args={[1.9 - Math.abs(o) * 0.18, 1.15 - Math.abs(o) * 0.1, 0.022]} />
            <meshPhysicalMaterial {...GLASS} thickness={0.7} color="#f1faf5" />
          </mesh>
        );
      })}
      <mesh rotation={[0.2, 0, 0.12]}>
        <cylinderGeometry args={[0.014, 0.014, 2.6, 10]} />
        <meshStandardMaterial {...EMERALD} />
      </mesh>
      {[-0.8, 0, 0.8].map((y, i) => (
        <mesh key={y} position={[i === 1 ? 0.5 : -0.45, y, 0.35]}>
          <sphereGeometry args={[0.075, 20, 20]} />
          {i === 1 ? <meshStandardMaterial {...EMERALD} /> : <meshStandardMaterial {...CHROME} />}
        </mesh>
      ))}
    </group>
  );
}

/** 04 CASE STUDIES — a chrome trajectory ribbon threading glass markers. */
export function TrajectoryRibbon() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.1, -1.1, -0.8),
        new THREE.Vector3(-0.8, 0.2, 0.5),
        new THREE.Vector3(0.5, -0.35, -0.5),
        new THREE.Vector3(1.9, 1.05, 0.4),
      ]),
    [],
  );
  const markers = useMemo(() => [0.08, 0.36, 0.64, 0.94].map((u) => curve.getPointAt(u)), [curve]);
  const glow = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (glow.current) glow.current.rotation.y = s.clock.elapsedTime * 0.4;
  });
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 160, 0.055, 18, false]} />
        <meshPhysicalMaterial {...GLASS} thickness={1.3} color="#edf6f0" />
      </mesh>
      <mesh scale={1.001}>
        <tubeGeometry args={[curve, 120, 0.013, 8, false]} />
        <meshStandardMaterial {...EMERALD} />
      </mesh>
      {markers.map((p, i) => (
        <mesh key={i} position={p} ref={i === 2 ? glow : null}>
          <icosahedronGeometry args={i === 2 ? [0.17, 1] : [0.1, 1]} />
          {i === 2 ? <meshStandardMaterial {...EMERALD} /> : <meshStandardMaterial {...CHROME} />}
        </mesh>
      ))}
      <Line
        points={markers}
        color={COL.brand}
        lineWidth={0.6}
        transparent
        opacity={0.3}
      />
    </group>
  );
}

/** 05 PHILOSOPHY — three offset rings resolving into alignment. */
export function AlignmentRings() {
  const g = useRef<THREE.Group>(null);
  const motion = useStageMotion();
  useFrame((s, dt) => {
    if (!g.current) return;
    const k = Math.min(1, dt * 3);
    const align = FOCUS(motion.scroll);
    g.current.children.forEach((c, i) => {
      const off = (1 - align) * (i - 1) * 0.55;
      c.position.x += (off - c.position.x) * k * 0.5;
      c.rotation.z += ((1 - align) * (i - 1) * 0.5 - c.rotation.z) * k * 0.5;
      c.rotation.y = s.clock.elapsedTime * (0.12 + i * 0.05);
    });
  });
  return (
    <group ref={g}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[1.15 - i * 0.22, i === 1 ? 0.055 : 0.028, 20, 128]} />
          {i === 1 ? (
            <meshPhysicalMaterial {...GLASS} thickness={1.2} color="#eef7f1" />
          ) : (
            <meshStandardMaterial {...(i === 0 ? CHROME : DEEP)} />
          )}
        </mesh>
      ))}
    </group>
  );
}

/** 06 FINAL CTA — a glass core with an emerald aperture, arriving at the reader. */
export function ArrivalCore() {
  const shell = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Group>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (shell.current) {
      shell.current.rotation.x = t * 0.14;
      shell.current.rotation.z = -t * 0.1;
    }
    if (ring.current) ring.current.rotation.y = t * 0.3;
  });
  return (
    <group>
      <mesh ref={shell}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshPhysicalMaterial {...GLASS} thickness={2} color="#f0f9f4" />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.34, 1]} />
        <meshStandardMaterial {...EMERALD} />
      </mesh>
      <group ref={ring}>
        {[0, 1].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2 + i * 0.9, i * 0.7, 0]}>
            <torusGeometry args={[1.45 - i * 0.2, 0.012, 10, 128]} />
            <meshStandardMaterial {...CHROME} transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ---------------------------- depth particles ---------------------------- */

/** Fine dust layers that drift toward the viewer with scroll — pure depth cue. */
export function DepthDust({ count = 220, depth = 12 }: { count?: number; depth?: number }) {
  const motion = useStageMotion();
  const points = useRef<THREE.Points>(null);
  const base = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 2] = -Math.random() * depth;
    }
    return arr;
  }, [count, depth]);

  const positions = useMemo(() => base.slice(), [base]);

  useFrame((state) => {
    const geo = points.current?.geometry;
    if (!geo) return;
    const t = state.clock.elapsedTime;
    const travel = motion.scroll * depth * 0.9;
    const attr = geo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const z = ((base[i * 3 + 2]! + travel) % depth + depth) % depth - depth * 0.85;
      positions[i * 3] = base[i * 3]! + Math.sin(t * 0.2 + i) * 0.06 + motion.x * 0.4;
      positions[i * 3 + 1] = base[i * 3 + 1]! + Math.cos(t * 0.16 + i) * 0.06 - motion.y * 0.25;
      positions[i * 3 + 2] = z;
    }
    attr.array = positions;
    attr.needsUpdate = true;
    if (points.current) points.current.rotation.z = t * 0.005;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.032}
        sizeAttenuation
        color={COL.brand}
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  );
}
