import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { live, setWorld, useWorld } from "@/lib/world-store";
import { COL } from "./palette";
import { ORGANIC_FRAG, ORGANIC_VERT, PANEL_FRAG, PANEL_VERT } from "./shaders";
import { PROJECTS, SERVICES } from "@/lib/site-data";
import { playCue } from "@/lib/audio";

const deep = new THREE.Color(COL.deep);
const brand = new THREE.Color(COL.brand);
const neon = new THREE.Color(COL.neon);
const glow = new THREE.Color(COL.glow);

/* ------------------------------------------------------------------ *
 * Organic centrepiece — growth + connection + movement
 * ------------------------------------------------------------------ */

export function OrganicCore({
  detail = 40,
  scale = 1,
  amp = 0.28,
  position = [0, 0, 0] as [number, number, number],
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: amp },
      uFreq: { value: 1.15 },
      uProgress: { value: 0 },
      uDeep: { value: deep.clone() },
      uBrand: { value: brand.clone() },
      uNeon: { value: neon.clone() },
    }),
    [amp],
  );

  useFrame((_, dt) => {
    const u = mat.current?.uniforms;
    if (u) {
      u["uTime"]!.value += dt;
      u["uProgress"]!.value += (live.progress - u["uProgress"]!.value) * 0.04;
      u["uAmp"]!.value = amp * (1 + live.progress * 0.5);
    }
    const m = mesh.current;
    if (!m) return;
    m.rotation.y += dt * 0.055;
    m.rotation.x = THREE.MathUtils.lerp(m.rotation.x, live.smoothY * 0.18, 0.05);
    m.rotation.z = THREE.MathUtils.lerp(m.rotation.z, live.smoothX * -0.14, 0.05);
    const breathe = 1 + Math.sin(performance.now() * 0.00042) * 0.035;
    m.scale.setScalar(scale * breathe);
  });

  return (
    <mesh ref={mesh} position={position}>
      <icosahedronGeometry args={[1.5, detail]} />
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={ORGANIC_VERT} fragmentShader={ORGANIC_FRAG} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ *
 * Translucent glass forms
 * ------------------------------------------------------------------ */

type GlassSpec = {
  pos: [number, number, number];
  rot: [number, number, number];
  kind: "knot" | "ring" | "shard" | "lens";
  size: number;
  speed: number;
};

export function GlassForms({ specs, quality }: { specs: GlassSpec[]; quality: "high" | "low" }) {
  return (
    <>
      {specs.map((s, i) => (
        <GlassForm key={i} spec={s} index={i} quality={quality} />
      ))}
    </>
  );
}

function GlassForm({ spec, index, quality }: { spec: GlassSpec; index: number; quality: "high" | "low" }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.rotation.x += dt * spec.speed * 0.4;
    m.rotation.y += dt * spec.speed;
    m.position.y = spec.pos[1] + Math.sin(t * 0.32 + index) * 0.34;
    m.position.x = spec.pos[0] + live.smoothX * 0.3 * (index % 2 ? -1 : 1);
    m.position.z = spec.pos[2] + live.progress * 7.5;
  });

  const seg = quality === "high" ? 1 : 0.5;

  return (
    <mesh ref={ref} position={spec.pos} rotation={spec.rot} scale={spec.size}>
      {spec.kind === "knot" && <torusKnotGeometry args={[0.6, 0.17, Math.round(140 * seg), Math.round(18 * seg)]} />}
      {spec.kind === "ring" && <torusGeometry args={[0.9, 0.055, Math.round(20 * seg), Math.round(120 * seg)]} />}
      {spec.kind === "shard" && <octahedronGeometry args={[0.75, 0]} />}
      {spec.kind === "lens" && <sphereGeometry args={[0.6, Math.round(48 * seg), Math.round(32 * seg)]} />}
      <meshPhysicalMaterial
        color={COL.glow}
        transparent
        opacity={0.42}
        roughness={0.12}
        metalness={0.1}
        transmission={quality === "high" ? 0.92 : 0}
        thickness={1.4}
        ior={1.4}
        emissive={COL.brand}
        emissiveIntensity={0.35}
        clearcoat={0.6}
      />
    </mesh>
  );
}

export const HOME_GLASS: GlassSpec[] = [
  { pos: [-3.6, 1.1, -2.2], rot: [0.4, 0.2, 0], kind: "knot", size: 1.05, speed: 0.12 },
  { pos: [3.9, -0.9, -3.4], rot: [1.1, 0.4, 0.3], kind: "ring", size: 1.6, speed: 0.09 },
  { pos: [2.4, 2.1, -6.5], rot: [0.2, 0.9, 0.1], kind: "shard", size: 1.2, speed: 0.16 },
  { pos: [-4.4, -1.8, -7.5], rot: [0.7, 0.1, 0.6], kind: "lens", size: 1.3, speed: 0.07 },
  { pos: [0.6, -2.6, -10.5], rot: [0.3, 0.6, 0.2], kind: "ring", size: 2.3, speed: 0.05 },
];

/* ------------------------------------------------------------------ *
 * Metallic architectural slabs — abstract structure
 * ------------------------------------------------------------------ */

export function Monoliths({ count = 9 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const slabs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        const r = 7.5 + (i % 3) * 1.4;
        return {
          pos: [Math.cos(a) * r, ((i % 4) - 1.5) * 1.7, Math.sin(a) * r - 6] as [number, number, number],
          rot: [0, -a, ((i % 3) - 1) * 0.16] as [number, number, number],
          h: 3 + (i % 5) * 1.1,
        };
      }),
    [count],
  );

  useFrame((_, dt) => {
    if (group.current) {
      group.current.rotation.y += dt * 0.012;
      group.current.position.z = live.progress * 16;
    }
  });

  return (
    <group ref={group}>
      {slabs.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot}>
          <boxGeometry args={[0.14, s.h, 1.1]} />
          <meshStandardMaterial
            color={COL.moss}
            metalness={0.92}
            roughness={0.26}
            emissive={COL.brand}
            emissiveIntensity={0.22}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Node network — people + ideas + connection (About)
 * ------------------------------------------------------------------ */

export function NodeNetwork({ nodes = 26 }: { nodes?: number }) {
  const group = useRef<THREE.Group>(null);

  const { points, lineGeo } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < nodes; i++) {
      // golden-spiral distribution on a stretched sphere
      const y = 1 - (i / (nodes - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * 2.399963;
      pts.push(new THREE.Vector3(Math.cos(theta) * r * 5.4, y * 3.4, Math.sin(theta) * r * 5.4 - 2));
    }
    const segs: number[] = [];
    pts.forEach((p, i) => {
      pts.forEach((q, j) => {
        if (j <= i) return;
        if (p.distanceTo(q) < 3.6) segs.push(p.x, p.y, p.z, q.x, q.y, q.z);
      });
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(segs, 3));
    return { points: pts, lineGeo: g };
  }, [nodes]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += dt * 0.05;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, live.smoothY * 0.2 + live.progress * 0.5, 0.04);
    g.position.z = live.progress * 12;
    g.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.02);
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={COL.neon} transparent opacity={0.24} blending={THREE.AdditiveBlending} />
      </lineSegments>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i % 5 === 0 ? 0.13 : 0.062, 18, 14]} />
          <meshStandardMaterial
            color={i % 5 === 0 ? COL.glow : COL.neon}
            emissive={i % 5 === 0 ? COL.glow : COL.neon}
            emissiveIntensity={i % 5 === 0 ? 2.4 : 1.1}
            toneMapped={false}
          />
        </mesh>
      ))}
      <OrganicCore detail={28} scale={0.85} amp={0.34} position={[0, 0, -1]} />
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Service universe — 6 interactive floating objects
 * ------------------------------------------------------------------ */

export function ServiceUniverse({ quality }: { quality: "high" | "low" }) {
  const focus = useWorld((s) => s.focus);
  const group = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += dt * (focus >= 0 ? 0.004 : 0.045);
    g.rotation.y += live.dragX * 0.35;
    g.position.z = live.progress * 9;
  });

  return (
    <group ref={group}>
      {SERVICES.map((s, i) => {
        const a = (i / SERVICES.length) * Math.PI * 2;
        const r = 5.2;
        return (
          <ServiceObject
            key={s.id}
            index={i}
            position={[Math.cos(a) * r, ((i % 3) - 1) * 1.5, Math.sin(a) * r - 1]}
            active={focus === i}
            dim={focus >= 0 && focus !== i}
            quality={quality}
          />
        );
      })}
    </group>
  );
}

function ServiceObject({
  index,
  position,
  active,
  dim,
  quality,
}: {
  index: number;
  position: [number, number, number];
  active: boolean;
  dim: boolean;
  quality: "high" | "low";
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const seg = quality === "high" ? 1 : 0.6;

  useFrame((state, dt) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.rotation.x += dt * 0.16;
    m.rotation.y += dt * 0.22;
    m.position.y = position[1] + Math.sin(t * 0.4 + index) * 0.26;
    const target = active ? 1.75 : hover ? 1.32 : 1;
    m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, target, 0.09));
    const mat = m.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = THREE.MathUtils.lerp(
      mat.emissiveIntensity,
      active ? 2.1 : hover ? 1.4 : 0.4,
      0.09,
    );
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, dim ? 0.3 : 1, 0.08);
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        setWorld({ cursorMode: "label", cursorLabel: "Explore" });
        playCue("hover");
      }}
      onPointerOut={() => {
        setHover(false);
        setWorld({ cursorMode: "dot", cursorLabel: null });
      }}
      onClick={(e) => {
        e.stopPropagation();
        setWorld({ focus: active ? -1 : index });
        playCue("open");
      }}
    >
      {index % 6 === 0 && <octahedronGeometry args={[0.9, 1]} />}
      {index % 6 === 1 && <torusGeometry args={[0.7, 0.24, Math.round(24 * seg), Math.round(90 * seg)]} />}
      {index % 6 === 2 && <coneGeometry args={[0.8, 1.5, Math.round(6 * seg) + 3]} />}
      {index % 6 === 3 && <dodecahedronGeometry args={[0.85, 0]} />}
      {index % 6 === 4 && <capsuleGeometry args={[0.42, 0.9, 6, Math.round(20 * seg)]} />}
      {index % 6 === 5 && <torusKnotGeometry args={[0.55, 0.19, Math.round(120 * seg), Math.round(16 * seg)]} />}
      <meshStandardMaterial
        color={COL.brand}
        emissive={COL.neon}
        emissiveIntensity={0.4}
        metalness={0.75}
        roughness={0.24}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ *
 * Project ring — draggable curved panels (Case studies)
 * ------------------------------------------------------------------ */

export function ProjectRing({ onOpen }: { onOpen: (slug: string) => void }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    live.dragVel *= 0.94;
    g.rotation.y += dt * 0.06 + live.dragVel;
    g.position.z = live.progress * 10;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, live.smoothY * 0.1, 0.05);
  });

  return (
    <group ref={group}>
      {PROJECTS.map((p, i) => {
        const a = (i / PROJECTS.length) * Math.PI * 2;
        const r = 6.4;
        return (
          <ProjectPanel
            key={p.slug}
            hue={p.hue}
            position={[Math.cos(a) * r, ((i % 2) - 0.5) * 1.1, Math.sin(a) * r - 1]}
            rotationY={-a + Math.PI / 2}
            onOpen={() => onOpen(p.slug)}
            label={p.title}
          />
        );
      })}
    </group>
  );
}

function ProjectPanel({
  position,
  rotationY,
  hue,
  onOpen,
  label,
}: {
  position: [number, number, number];
  rotationY: number;
  hue: number;
  onOpen: () => void;
  label: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const [hover, setHover] = useState(false);

  const uniforms = useMemo(
    () => ({
      uTime: { value: Math.random() * 10 },
      uHover: { value: 0 },
      uCurve: { value: -0.45 },
      uHue: { value: hue },
      uDeep: { value: deep.clone() },
      uBrand: { value: brand.clone() },
      uNeon: { value: glow.clone() },
    }),
    [hue],
  );

  useFrame((state, dt) => {
    const u = mat.current?.uniforms;
    if (u) {
      u["uTime"]!.value += dt;
      u["uHover"]!.value += ((hover ? 1 : 0) - u["uHover"]!.value) * 0.1;
    }
    const m = mesh.current;
    if (m) m.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.35 + hue * 8) * 0.16;
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      rotation={[0, rotationY, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        setWorld({ cursorMode: "label", cursorLabel: "View" });
        playCue("hover");
      }}
      onPointerOut={() => {
        setHover(false);
        setWorld({ cursorMode: "dot", cursorLabel: null });
      }}
      onClick={(e) => {
        e.stopPropagation();
        playCue("open");
        onOpen();
      }}
    >
      <planeGeometry args={[3.1, 2, 40, 24]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={PANEL_VERT}
        fragmentShader={PANEL_FRAG}
        transparent
        side={THREE.DoubleSide}
      />
      <group name={label} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ *
 * Single project world
 * ------------------------------------------------------------------ */

export function ProjectWorld({ hue }: { hue: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0.4 },
      uCurve: { value: -1.1 },
      uHue: { value: hue },
      uDeep: { value: deep.clone() },
      uBrand: { value: brand.clone() },
      uNeon: { value: glow.clone() },
    }),
    [hue],
  );

  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms["uTime"]!.value += dt;
    const g = group.current;
    if (!g) return;
    g.position.z = live.progress * 14;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, live.smoothX * 0.16, 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, live.smoothY * 0.08 + live.progress * 0.3, 0.05);
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0, -3]}>
        <planeGeometry args={[13, 8, 64, 40]} />
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          vertexShader={PANEL_VERT}
          fragmentShader={PANEL_FRAG}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      <OrganicCore detail={24} scale={0.55} amp={0.4} position={[3.4, -1.4, 2]} />
      <Monoliths count={7} />
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Contact world — pulsing lattice
 * ------------------------------------------------------------------ */

export function ContactWorld({ burst }: { burst: boolean }) {
  const inst = useRef<THREE.InstancedMesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 300;
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        a: Math.random() * Math.PI * 2,
        b: Math.acos(2 * Math.random() - 1),
        r: 3.4 + Math.random() * 3.4,
        s: 0.03 + Math.random() * 0.07,
        p: Math.random() * Math.PI * 2,
      })),
    [],
  );
  const boost = useRef(0);

  useFrame((state, dt) => {
    boost.current += ((burst ? 1 : 0) - boost.current) * 0.04;
    const t = state.clock.elapsedTime;
    const m = inst.current;
    if (m) {
      seeds.forEach((s, i) => {
        const r = s.r * (1 + Math.sin(t * 0.5 + s.p) * 0.06 + boost.current * 0.55);
        dummy.position.set(
          Math.sin(s.b) * Math.cos(s.a + t * 0.04) * r,
          Math.cos(s.b) * r * 0.72,
          Math.sin(s.b) * Math.sin(s.a + t * 0.04) * r - 2,
        );
        dummy.rotation.set(t * 0.2 + s.p, t * 0.15, 0);
        dummy.scale.setScalar(s.s * (1 + boost.current * 1.6));
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
      });
      m.instanceMatrix.needsUpdate = true;
    }
    const sh = shell.current;
    if (sh) {
      sh.rotation.y += dt * 0.05;
      sh.rotation.x = THREE.MathUtils.lerp(sh.rotation.x, live.smoothY * 0.2, 0.04);
      sh.scale.setScalar(1 + boost.current * 0.25 + live.progress * 0.2);
    }
  });

  return (
    <group position={[0, 0, live.progress * 6]}>
      <instancedMesh ref={inst} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={COL.glow} emissive={COL.neon} emissiveIntensity={1.5} toneMapped={false} />
      </instancedMesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[4.4, 2]} />
        <meshBasicMaterial color={COL.brand} wireframe transparent opacity={0.16} />
      </mesh>
      <OrganicCore detail={30} scale={0.8} amp={0.32} />
    </group>
  );
}
