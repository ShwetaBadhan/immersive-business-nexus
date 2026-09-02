import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { COL } from "./palette";
import { CHROME, DEEP, EMERALD, GLASS, useStageMotion } from "./Stage";

/* ================================================================== *
 * One 3D language for 239:
 *   glass + chrome, emerald accents, architectural geometry,
 *   slow float, inertial pointer response, scroll reaction.
 * ================================================================== */

/* ------------------------------------------------------------------ *
 * ABOUT — connection structure: people, ideas, connections, business
 * ------------------------------------------------------------------ */

function buildNetwork() {
  const nodes: THREE.Vector3[] = [];
  const rings = [
    { r: 1.05, y: -0.95, n: 5 },
    { r: 1.55, y: -0.1, n: 7 },
    { r: 1.2, y: 0.8, n: 6 },
    { r: 0.55, y: 1.6, n: 3 },
  ];
  rings.forEach((ring, ri) => {
    for (let i = 0; i < ring.n; i++) {
      const a = (i / ring.n) * Math.PI * 2 + ri * 0.5;
      nodes.push(new THREE.Vector3(Math.cos(a) * ring.r, ring.y, Math.sin(a) * ring.r * 0.72));
    }
  });

  const links: [THREE.Vector3, THREE.Vector3][] = [];
  nodes.forEach((a, i) => {
    const pairs = nodes
      .map((b, j) => ({ b, j, d: a.distanceTo(b) }))
      .filter((p) => p.j > i && p.d < 1.3)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    pairs.forEach((p) => links.push([a, p.b]));
  });

  return { nodes, links };
}

export function NetworkStructure() {
  const motion = useStageMotion();
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const spin = useRef<THREE.Group>(null);
  const { nodes, links } = useMemo(buildNetwork, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const k = Math.min(1, dt * 3);
    if (group.current) {
      group.current.rotation.y += (motion.x * 0.5 + (motion.scroll - 0.5) * 1.5 - group.current.rotation.y) * k * 0.6;
      group.current.rotation.x += (motion.y * 0.18 - 0.06 - group.current.rotation.x) * k * 0.6;
      group.current.position.y = Math.sin(t * 0.5) * 0.07 + (motion.scroll - 0.5) * 0.5;
    }
    if (spin.current) spin.current.rotation.y = t * 0.16;
    if (core.current) {
      core.current.rotation.x = t * 0.22;
      core.current.rotation.z = -t * 0.14;
      const s = 1 + Math.sin(t * 1.1) * 0.03;
      core.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={group} scale={1.05}>
      <group ref={spin}>
        {links.map(([a, b], i) => (
          <Line
            key={i}
            points={[a, b]}
            color={i % 3 === 0 ? COL.neon : COL.brand}
            lineWidth={i % 3 === 0 ? 0.9 : 0.55}
            transparent
            opacity={i % 3 === 0 ? 0.5 : 0.26}
          />
        ))}

        {nodes.map((p, i) => (
          <mesh key={i} position={p}>
            <icosahedronGeometry args={[i % 4 === 0 ? 0.1 : 0.062, 2]} />
            {i % 4 === 0 ? (
              <meshStandardMaterial {...EMERALD} />
            ) : i % 3 === 0 ? (
              <meshPhysicalMaterial {...GLASS} color="#ffffff" />
            ) : (
              <meshStandardMaterial {...CHROME} />
            )}
          </mesh>
        ))}

        {/* structural orbits */}
        {[1.05, 1.55, 1.2].map((r, i) => (
          <mesh key={r} position={[0, [-0.95, -0.1, 0.8][i]!, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.72, 1]}>
            <torusGeometry args={[r, 0.0055, 8, 128]} />
            <meshStandardMaterial color={COL.brand} metalness={0.4} roughness={0.4} transparent opacity={0.4} />
          </mesh>
        ))}
      </group>

      {/* glass core — the business at the centre of the network */}
      <mesh ref={core} position={[0, 0.25, 0]}>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshPhysicalMaterial {...GLASS} color="#eef7f1" thickness={1.6} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <icosahedronGeometry args={[0.44, 1]} />
        <meshBasicMaterial color={COL.neon} wireframe transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * SERVICES — one small, meaningful glyph per practice
 * ------------------------------------------------------------------ */

export type GlyphKind =
  | "business-development"
  | "brand-strategy"
  | "digital-experiences"
  | "creative-solutions"
  | "growth-strategy"
  | "digital-transformation";

function ribbonCurve() {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 90; i++) {
    const t = (i / 90) * Math.PI * 4;
    pts.push(new THREE.Vector3(Math.sin(t) * 0.62, (i / 90 - 0.5) * 1.3, Math.cos(t * 0.75) * 0.42));
  }
  return new THREE.CatmullRomCurve3(pts);
}

function pathCurve() {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.85, -0.5, 0.2),
    new THREE.Vector3(-0.2, -0.1, -0.25),
    new THREE.Vector3(0.25, 0.28, 0.25),
    new THREE.Vector3(0.85, 0.62, -0.1),
  ]);
}

/** Small self-contained glyph. `active` is 0..1 hover energy. */
export function ServiceGlyph({ kind }: { kind: GlyphKind }) {
  const motion = useStageMotion();
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const energy = useRef(0);
  const flow = useMemo(ribbonCurve, []);
  const path = useMemo(pathCurve, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const k = Math.min(1, dt * 5);
    energy.current += (motion.hover - energy.current) * k * 0.6;
    const e = energy.current;

    if (group.current) {
      group.current.rotation.y += (motion.x * 0.45 + t * 0.06 - group.current.rotation.y) * k * 0.4;
      group.current.rotation.x += (motion.y * 0.22 - group.current.rotation.x) * k * 0.4;
      group.current.position.y = Math.sin(t * 0.8) * 0.045 + e * 0.06;
      group.current.scale.setScalar(0.95 + e * 0.1);
    }
    if (inner.current) {
      inner.current.rotation.y = t * (0.3 + e * 0.9);
      inner.current.rotation.z = Math.sin(t * 0.5) * 0.12;
    }
  });

  return (
    <group ref={group}>
      {kind === "business-development" && (
        <group ref={inner}>
          <mesh>
            <tubeGeometry args={[path, 64, 0.035, 12, false]} />
            <meshStandardMaterial {...CHROME} />
          </mesh>
          {[-0.85, 0.25, 0.85].map((x, i) => (
            <mesh key={x} position={[x, [-0.5, 0.28, 0.62][i]!, [0.2, 0.25, -0.1][i]!]}>
              <sphereGeometry args={[0.1, 24, 24]} />
              {i === 2 ? <meshStandardMaterial {...EMERALD} /> : <meshPhysicalMaterial {...GLASS} />}
            </mesh>
          ))}
        </group>
      )}

      {kind === "brand-strategy" && (
        <group ref={inner}>
          <mesh rotation={[Math.PI / 2.4, 0, 0]}>
            <torusGeometry args={[0.72, 0.028, 16, 96]} />
            <meshStandardMaterial {...DEEP} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 5]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshPhysicalMaterial {...GLASS} thickness={1.4} />
          </mesh>
          <mesh rotation={[0.4, 0.8, 0]} scale={0.72}>
            <octahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial {...EMERALD} />
          </mesh>
        </group>
      )}

      {kind === "digital-experiences" && (
        <group ref={inner}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[i * 0.12 - 0.12, i * 0.16 - 0.16, i * 0.26 - 0.26]} rotation={[-0.42, 0.3, 0]}>
              <boxGeometry args={[1.05 - i * 0.12, 0.7 - i * 0.08, 0.02]} />
              <meshPhysicalMaterial {...GLASS} thickness={0.7} color="#f2faf5" />
            </mesh>
          ))}
          <mesh position={[0.16, 0.2, 0.3]} rotation={[-0.42, 0.3, 0]}>
            <boxGeometry args={[0.42, 0.05, 0.03]} />
            <meshStandardMaterial {...EMERALD} />
          </mesh>
        </group>
      )}

      {kind === "creative-solutions" && (
        <group ref={inner}>
          <mesh>
            <tubeGeometry args={[flow, 128, 0.05, 16, false]} />
            <meshPhysicalMaterial {...GLASS} thickness={1.2} color="#eaf6ee" />
          </mesh>
          <mesh scale={0.98}>
            <tubeGeometry args={[flow, 96, 0.012, 8, false]} />
            <meshStandardMaterial {...EMERALD} />
          </mesh>
        </group>
      )}

      {kind === "growth-strategy" && (
        <group ref={inner}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[i * 0.3 - 0.45, (i + 1) * 0.13 - 0.5, 0]}>
              <boxGeometry args={[0.17, (i + 1) * 0.28, 0.17]} />
              {i === 3 ? <meshStandardMaterial {...EMERALD} /> : <meshStandardMaterial {...CHROME} />}
            </mesh>
          ))}
          <mesh position={[0.45, 0.72, 0]}>
            <sphereGeometry args={[0.09, 24, 24]} />
            <meshPhysicalMaterial {...GLASS} />
          </mesh>
        </group>
      )}

      {kind === "digital-transformation" && (
        <group ref={inner}>
          {[0.75, 0.55, 0.35].map((r, i) => (
            <mesh key={r} rotation={[Math.PI / 2 + i * 0.5, i * 0.7, 0]}>
              <torusGeometry args={[r, 0.026, 16, 96]} />
              {i === 1 ? <meshStandardMaterial {...EMERALD} /> : <meshStandardMaterial {...CHROME} />}
            </mesh>
          ))}
          <mesh>
            <icosahedronGeometry args={[0.22, 1]} />
            <meshPhysicalMaterial {...GLASS} thickness={1.5} />
          </mesh>
        </group>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * CASE STUDIES — one quiet project environment behind the index
 * ------------------------------------------------------------------ */

export function ProjectEnvironment({
  activeRef,
  compact = false,
}: {
  activeRef: { current: number };
  compact?: boolean;
}) {
  const motion = useStageMotion();
  const group = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);
  const accent = useRef<THREE.PointLight>(null);
  const shown = useRef(-1);
  const curve = useMemo(ribbonCurve, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const k = Math.min(1, dt * 4);
    const target = activeRef.current;
    shown.current += (target - shown.current) * k * 0.5;
    const active = target >= 0 ? 1 : 0;

    if (group.current) {
      group.current.rotation.y += (motion.x * 0.35 + (motion.scroll - 0.5) * 0.9 - group.current.rotation.y) * k * 0.5;
      group.current.rotation.x += (motion.y * 0.14 - group.current.rotation.x) * k * 0.5;
      group.current.position.y += (Math.sin(t * 0.4) * 0.1 - shown.current * 0.16 - group.current.position.y) * k * 0.4;
      const s = 1 + active * 0.06;
      group.current.scale.lerp(new THREE.Vector3(s, s, s), k * 0.4);
    }
    if (rings.current) rings.current.rotation.z = t * 0.08;
    if (accent.current) {
      accent.current.intensity += (6 + active * 16 - accent.current.intensity) * k * 0.4;
      accent.current.position.x = motion.x * 3;
    }
  });

  return (
    <group ref={group}>
      <pointLight ref={accent} color={COL.neon} intensity={6} distance={16} decay={1.6} position={[0, 1, 3]} />

      <group ref={rings}>
        {(compact ? [2.5] : [2.5, 1.95, 1.4]).map((r, i) => (
          <mesh key={r} rotation={[Math.PI / 2.1, i * 0.22, 0]}>
            <torusGeometry args={[r, 0.008, compact ? 6 : 8, compact ? 80 : 160]} />
            <meshStandardMaterial
              color={i === 1 ? COL.neon : COL.brand}
              metalness={0.5}
              roughness={0.35}
              transparent
              opacity={i === 1 ? 0.55 : 0.3}
            />
          </mesh>
        ))}
      </group>

      <mesh rotation={[0, 0.4, 0]} scale={compact ? 1.05 : 1.25}>
        <tubeGeometry args={[curve, compact ? 80 : 160, 0.045, compact ? 8 : 16, false]} />
        <meshPhysicalMaterial
          {...GLASS}
          thickness={1.4}
          color="#edf6f0"
          transmission={compact ? 0.6 : GLASS.transmission}
          opacity={compact ? 0.6 : 1}
        />
      </mesh>

      {(compact
        ? [[-1.85, 0.9, -0.6]]
        : [
            [-1.85, 0.9, -0.6],
            [1.9, -0.7, -0.4],
            [0.4, 1.5, -1.1],
          ]
      ).map((p, i) => (
        <mesh key={i} position={p as THREE.Vector3Tuple}>
          <icosahedronGeometry args={[i === 0 ? 0.16 : 0.1, 1]} />
          {i === 1 ? <meshStandardMaterial {...EMERALD} /> : <meshStandardMaterial {...CHROME} />}
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * CONTACT — collaboration: two forms interlocking around one core
 * ------------------------------------------------------------------ */

export function ConnectionForm() {
  const motion = useStageMotion();
  const group = useRef<THREE.Group>(null);
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const orbit = useRef<THREE.Group>(null);

  const nodes = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const ang = (i / 8) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(ang) * 1.5, Math.sin(ang * 2) * 0.28, Math.sin(ang) * 1.5);
      }),
    [],
  );

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const k = Math.min(1, dt * 4);
    if (group.current) {
      group.current.rotation.y += (motion.x * 0.6 + t * 0.1 - group.current.rotation.y) * k * 0.5;
      group.current.rotation.x += (motion.y * 0.28 - group.current.rotation.x) * k * 0.5;
      group.current.position.y = Math.sin(t * 0.6) * 0.08;
    }
    if (a.current) a.current.rotation.z = t * 0.3;
    if (b.current) b.current.rotation.x = -t * 0.26;
    if (orbit.current) orbit.current.rotation.y = -t * 0.22;
  });

  return (
    <group ref={group}>
      <mesh ref={a} rotation={[Math.PI / 2.6, 0, 0]}>
        <torusGeometry args={[1.05, 0.11, 32, 144]} />
        <meshPhysicalMaterial {...GLASS} thickness={1.5} color="#eef7f1" />
      </mesh>
      <mesh ref={b} rotation={[0, Math.PI / 2.4, 0.5]}>
        <torusGeometry args={[1.05, 0.045, 24, 144]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>

      <mesh>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial {...EMERALD} />
      </mesh>

      <group ref={orbit}>
        {nodes.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[i % 2 ? 0.045 : 0.07, 20, 20]} />
            {i % 2 ? <meshStandardMaterial {...DEEP} /> : <meshPhysicalMaterial {...GLASS} />}
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.004, 6, 160]} />
          <meshStandardMaterial color={COL.brand} transparent opacity={0.4} metalness={0.4} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
