import { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { COL } from "./palette";
import { live, setWorld } from "@/lib/world-store";

/**
 * Hero composition for 239 — an abstract growth network.
 * Nodes climb a slow upward helix, connected by thin green lines
 * (partnerships / connection), circled by four refined satellites that
 * stand for strategy, digital, growth and business.
 * Everything reacts subtly to pointer movement and fades out on scroll.
 */

const NODE_COUNT = 26;
const LINK_DISTANCE = 1.95;

type Node = { base: THREE.Vector3; speed: number; phase: number; key: boolean };

function buildNodes(): Node[] {
  const nodes: Node[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const t = i / (NODE_COUNT - 1);
    const a = t * Math.PI * 4.2;
    // radius narrows as it climbs — an upward, focusing structure
    const r = 1.85 - t * 0.75 + (i % 3) * 0.12;
    nodes.push({
      base: new THREE.Vector3(Math.cos(a) * r, t * 3.5 - 1.75, Math.sin(a) * r * 0.72),
      speed: 0.16 + (i % 4) * 0.05,
      phase: i * 0.7,
      key: i % 6 === 0,
    });
  }
  return nodes;
}

export function GrowthNetwork({ quality }: { quality: "high" | "low" }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);

  const nodes = useMemo(buildNodes, []);
  const narrow = useThree((st) => st.size.width < 900);
  const positions = useMemo(() => nodes.map((n) => n.base.clone()), [nodes]);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // worst case: every pair — allocate generously once, draw range set per frame
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(NODE_COUNT * NODE_COUNT * 6), 3));
    return g;
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    // parallax + gentle drift away as the page scrolls
    const p = live.progress;
    g.position.x = (narrow ? 0 : 2.35) + live.smoothX * 0.45;
    g.position.y = (narrow ? 1.05 : -0.3) + live.smoothY * 0.3 - p * 3.6;
    g.position.z = -0.4 - p * 3;
    g.scale.setScalar((narrow ? 0.72 : 0.92) * (1 - p * 0.15));

    if (inner.current) {
      inner.current.rotation.y += dt * 0.09;
      inner.current.rotation.x = THREE.MathUtils.lerp(inner.current.rotation.x, live.smoothY * -0.18, 0.04);
      inner.current.rotation.z = THREE.MathUtils.lerp(inner.current.rotation.z, live.smoothX * 0.08, 0.04);
    }

    // nodes climb slowly and wrap — an evolving, growing structure
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i]!;
      const rise = ((t * n.speed + n.phase) % 3.5) - 1.75;
      const pos = positions[i]!;
      pos.set(
        n.base.x + Math.sin(t * 0.4 + n.phase) * 0.06,
        rise,
        n.base.z + Math.cos(t * 0.33 + n.phase) * 0.06,
      );
      const mesh = nodeRefs.current[i];
      if (mesh) mesh.position.copy(pos);
    }

    // rebuild the visible links
    const attr = lineGeo.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    let o = 0;
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const a = positions[i]!;
        const b = positions[j]!;
        if (a.distanceTo(b) > LINK_DISTANCE) continue;
        arr[o++] = a.x; arr[o++] = a.y; arr[o++] = a.z;
        arr[o++] = b.x; arr[o++] = b.y; arr[o++] = b.z;
      }
    }

    lineGeo.setDrawRange(0, o / 3);
    attr.needsUpdate = true;
    if (lines.current) lines.current.visible = o > 0;
  });

  return (
    <group ref={group}>
      <group ref={inner}>
        <lineSegments ref={lines} geometry={lineGeo}>
          <lineBasicMaterial color={COL.brand} transparent opacity={0.42} />
        </lineSegments>

        {nodes.map((n, i) => (
          <mesh key={i} ref={(m) => { nodeRefs.current[i] = m; }} position={n.base}>
            <sphereGeometry args={n.key ? [0.075, 20, 16] : [0.036, 14, 12]} />
            <meshStandardMaterial
              color={n.key ? COL.glow : COL.neon}
              roughness={0.25}
              metalness={0.2}
              emissive={n.key ? COL.glow : COL.neon}
              emissiveIntensity={n.key ? 0.5 : 0.28}
            />
          </mesh>
        ))}

        {/* central spine — the strategy axis the network grows along */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 3.9, 6]} />
          <meshBasicMaterial color={COL.brand} transparent opacity={0.35} />
        </mesh>

        <GrowthBars />
        <StrategyPrism />
        <DigitalFrame />
        <ConnectionRing quality={quality} />
      </group>
    </group>
  );
}

/* ---------- satellites ------------------------------------------------ */

function useHover() {
  const [hovered, setHovered] = useState(false);
  return {
    hovered,
    bind: {
      onPointerOver: (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        setHovered(true);
        setWorld({ cursorMode: "ring" });
      },
      onPointerOut: () => {
        setHovered(false);
        setWorld({ cursorMode: "dot" });
      },
    },
  };
}

/** Upward growth — a small ascending stack of bars. */
function GrowthBars() {
  const ref = useRef<THREE.Group>(null);
  const { hovered, bind } = useHover();
  const bars = [0.34, 0.6, 0.92, 1.28];

  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y += dt * 0.16;
    g.position.y = -1.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, hovered ? 1.16 : 1, 0.08));
  });

  return (
    <group ref={ref} position={[1.55, -1.15, 0.9]} {...bind}>
      {bars.map((h, i) => (
        <mesh key={i} position={[(i - 1.5) * 0.17, h / 2, 0]}>
          <boxGeometry args={[0.1, h, 0.1]} />
          <meshStandardMaterial
            color={i === bars.length - 1 ? COL.glow : COL.brand}
            roughness={0.3}
            metalness={0.35}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Strategy — a faceted, deliberate solid. */
function StrategyPrism() {
  const ref = useRef<THREE.Mesh>(null);
  const { hovered, bind } = useHover();

  useFrame((state, dt) => {
    const m = ref.current;
    if (!m) return;
    m.rotation.y += dt * 0.22;
    m.rotation.x += dt * 0.1;
    m.position.y = 1.42 + Math.sin(state.clock.elapsedTime * 0.42) * 0.08;
    m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, hovered ? 1.2 : 1, 0.08));
  });

  return (
    <mesh ref={ref} position={[-1.5, 1.42, 0.6]} {...bind}>
      <octahedronGeometry args={[0.32, 0]} />
      <meshStandardMaterial color={COL.brand} roughness={0.18} metalness={0.5} flatShading />
    </mesh>
  );
}

/** Digital — a thin wire square, quietly turning. */
function DigitalFrame() {
  const ref = useRef<THREE.Group>(null);
  const { hovered, bind } = useHover();

  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.z += dt * 0.12;
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, hovered ? 1.14 : 1, 0.08));
  });

  return (
    <group ref={ref} position={[1.75, 1.05, -0.6]} {...bind}>
      <mesh>
        <torusGeometry args={[0.46, 0.008, 6, 4]} />
        <meshBasicMaterial color={COL.glow} transparent opacity={0.75} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.34, 0.006, 6, 4]} />
        <meshBasicMaterial color={COL.neon} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

/** Connection / partnership — two interlocking rings. */
function ConnectionRing({ quality }: { quality: "high" | "low" }) {
  const ref = useRef<THREE.Group>(null);
  const { hovered, bind } = useHover();
  const seg = quality === "high" ? 96 : 48;

  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y += dt * 0.2;
    g.position.x = -1.5 + Math.cos(state.clock.elapsedTime * 0.35) * 0.06;
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, hovered ? 1.14 : 1, 0.08));
  });

  return (
    <group ref={ref} position={[-1.5, -1.05, -0.5]} rotation={[0.5, 0, 0.2]} {...bind}>
      <mesh position={[-0.16, 0, 0]}>
        <torusGeometry args={[0.3, 0.014, 10, seg]} />
        <meshStandardMaterial color={COL.brand} roughness={0.25} metalness={0.5} />
      </mesh>
      <mesh position={[0.16, 0, 0]} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.3, 0.014, 10, seg]} />
        <meshStandardMaterial color={COL.glow} roughness={0.25} metalness={0.5} />
      </mesh>
    </group>
  );
}
