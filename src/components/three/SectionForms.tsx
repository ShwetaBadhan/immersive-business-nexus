import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { live } from "@/lib/world-store";
import { COL } from "./palette";

/**
 * Quiet business-relevant geometry that drifts behind the page sections
 * (never the hero): growth bars, connection rings, strategy frames.
 * Scroll drives them gently toward the camera so each section gets its own
 * background form without visual noise.
 */

type Kind = "bars" | "ring" | "frame" | "grid" | "node";

type Spec = {
  kind: Kind;
  pos: [number, number, number];
  rot: [number, number, number];
  size: number;
  spin: number;
};

const SPECS: Spec[] = [
  { kind: "ring", pos: [-5.2, 1.4, -12], rot: [0.5, 0.3, 0.1], size: 1.5, spin: 0.05 },
  { kind: "bars", pos: [5.4, -1.2, -17], rot: [0, -0.5, 0], size: 1.1, spin: 0.03 },
  { kind: "frame", pos: [-4.6, -1.8, -23], rot: [0.2, 0.6, 0.08], size: 1.6, spin: 0.04 },
  { kind: "grid", pos: [5.0, 1.9, -29], rot: [0.35, -0.4, 0.05], size: 1.3, spin: 0.025 },
  { kind: "node", pos: [-3.4, 2.2, -35], rot: [0.1, 0.2, 0], size: 1.2, spin: 0.06 },
  { kind: "ring", pos: [3.6, -2.3, -41], rot: [1.1, 0.2, 0.4], size: 2.0, spin: 0.035 },
];

export function SectionForms({ quality = "high" }: { quality?: "high" | "low" }) {
  const specs = quality === "high" ? SPECS : SPECS.filter((_, i) => i % 2 === 0);
  return (
    <>
      {specs.map((s, i) => (
        <Form key={i} spec={s} index={i} />
      ))}
    </>
  );
}

function Form({ spec, index }: { spec: Spec; index: number }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.rotation.y += dt * spec.spin;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, spec.rot[0] + live.smoothY * 0.1, 0.04);
    g.position.x = spec.pos[0] + live.smoothX * 0.5 * (index % 2 ? -1 : 1);
    g.position.y = spec.pos[1] + Math.sin(t * 0.24 + index) * 0.3;
    g.position.z = spec.pos[2] + live.progress * 34;
  });

  return (
    <group ref={group} position={spec.pos} rotation={spec.rot} scale={spec.size}>
      {spec.kind === "ring" && (
        <mesh>
          <torusGeometry args={[1.1, 0.012, 8, 128]} />
          <Line />
        </mesh>
      )}

      {spec.kind === "bars" &&
        [0.6, 1.05, 1.5, 2.0].map((h, i) => (
          <mesh key={i} position={[(i - 1.5) * 0.42, h / 2 - 0.5, 0]}>
            <boxGeometry args={[0.12, h, 0.12]} />
            <Solid />
          </mesh>
        ))}

      {spec.kind === "frame" && (
        <>
          <mesh>
            <boxGeometry args={[2.2, 1.4, 0.01]} />
            <Wire />
          </mesh>
          <mesh position={[0, 0, 0.35]} scale={0.62}>
            <boxGeometry args={[2.2, 1.4, 0.01]} />
            <Wire />
          </mesh>
        </>
      )}

      {spec.kind === "grid" && <Grid />}

      {spec.kind === "node" && <NodeCluster />}
    </group>
  );
}

function Line() {
  return (
    <meshBasicMaterial
      color={COL.brand}
      transparent
      opacity={0.4}
      toneMapped={false}
      side={THREE.DoubleSide}
    />
  );
}

function Solid() {
  return (
    <meshStandardMaterial
      color={COL.brand}
      metalness={0.2}
      roughness={0.4}
      transparent
      opacity={0.32}
      emissive={COL.brand}
      emissiveIntensity={0.12}
    />
  );
}

function Wire() {
  return <meshBasicMaterial color={COL.brand} wireframe transparent opacity={0.28} toneMapped={false} />;
}

function Grid() {
  const geo = useMemo(() => {
    const pts: number[] = [];
    const n = 5;
    const s = 0.5;
    for (let i = 0; i <= n; i++) {
      const o = (i - n / 2) * s;
      pts.push(-1.25, o, 0, 1.25, o, 0);
      pts.push(o, -1.25, 0, o, 1.25, 0);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={COL.brand} transparent opacity={0.22} toneMapped={false} />
    </lineSegments>
  );
}

function NodeCluster() {
  const { pts, geo } = useMemo(() => {
    const p: THREE.Vector3[] = [];
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      const r = 0.7 + (i % 3) * 0.32;
      p.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r * 0.7, ((i % 4) - 1.5) * 0.24));
    }
    const segs: number[] = [];
    p.forEach((a, i) => {
      p.forEach((b, j) => {
        if (j <= i) return;
        if (a.distanceTo(b) < 1.0) segs.push(a.x, a.y, a.z, b.x, b.y, b.z);
      });
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(segs, 3));
    return { pts: p, geo: g };
  }, []);

  return (
    <group>
      <lineSegments geometry={geo}>
        <lineBasicMaterial color={COL.brand} transparent opacity={0.26} toneMapped={false} />
      </lineSegments>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i % 3 === 0 ? 0.055 : 0.032, 14, 12]} />
          <meshBasicMaterial color={COL.brand} transparent opacity={0.6} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
