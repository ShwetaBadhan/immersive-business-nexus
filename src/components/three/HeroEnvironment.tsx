import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { COL } from "./palette";
import { live } from "@/lib/world-store";

/**
 * 239 hero environment — a light architectural/digital world.
 *
 * Colonnades + pathways (business / structure), a rising node lattice
 * (connection / growth), translucent glass planes (digital) and a fast,
 * subtle reflective water floor. Pointer + drag drive the whole group with
 * inertia, so the scene reads as an explorable place, not a looping animation.
 */

const COLUMNS = 22;
const NODES = 30;

function noiseTexture() {
  const size = 128;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const v = 110 + Math.random() * 90;
    data[i * 4] = v;
    data[i * 4 + 1] = v;
    data[i * 4 + 2] = 255;
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

type NodeDef = { base: THREE.Vector3; speed: number; phase: number; key: boolean };

function buildNodes(): NodeDef[] {
  const out: NodeDef[] = [];
  for (let i = 0; i < NODES; i++) {
    const t = i / (NODES - 1);
    const a = t * Math.PI * 4.6 + (i % 2 ? 0.4 : 0);
    const r = 2.4 - t * 0.9 + (i % 3) * 0.16;
    out.push({
      base: new THREE.Vector3(Math.cos(a) * r, t * 3.6 - 1.2, Math.sin(a) * r * 0.6 - 1.2),
      speed: 0.5 + (i % 4) * 0.14,
      phase: i * 0.83,
      key: i % 5 === 0,
    });
  }
  return out;
}

export function HeroEnvironment({ quality }: { quality: "high" | "low" }) {
  const root = useRef<THREE.Group>(null);
  const lattice = useRef<THREE.Group>(null);
  const nodeMesh = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const colonnade = useRef<THREE.InstancedMesh>(null);
  const glass = useRef<THREE.Group>(null);
  const accent = useRef<THREE.PointLight>(null);

  const narrow = useThree((s) => s.size.width < 820);
  const nodes = useMemo(buildNodes, []);
  const live3 = useMemo(() => nodes.map((n) => n.base.clone()), [nodes]);
  const distortion = useMemo(noiseTexture, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(NODES * NODES * 6), 3));
    return g;
  }, []);

  // static colonnade layout — two receding rows framing the centre
  const columns = useMemo(
    () =>
      Array.from({ length: COLUMNS }, (_, i) => {
        const row = i % 2 === 0 ? -1 : 1;
        const depth = Math.floor(i / 2);
        return {
          x: row * (4.2 + depth * 0.55),
          z: -depth * 3.1 + 3.4,
          h: 5.4 + ((i * 37) % 11) * 0.28,
        };
      }),
    [],
  );

  useFrame((state, dt) => {
    const g = root.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const k = Math.min(1, dt * 60);

    // ---- inertia: drag velocity decays, pointer eases quickly ----
    live.dragVel *= Math.pow(0.94, k);
    live.dragVelY *= Math.pow(0.9, k);
    live.orbitX += live.dragVel * 2.2;
    live.orbitY += live.dragVelY * 1.6;
    live.orbitX = THREE.MathUtils.clamp(live.orbitX, -1.5, 1.5);
    live.orbitY = THREE.MathUtils.clamp(live.orbitY, -0.6, 0.6);
    // settle back toward centre when idle
    if (Math.abs(live.dragVel) < 0.0004) live.orbitX *= Math.pow(0.985, k);
    if (Math.abs(live.dragVelY) < 0.0004) live.orbitY *= Math.pow(0.985, k);

    const px = live.smoothX;
    const py = live.smoothY;

    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, px * 0.24 + live.orbitX * 0.55, 0.14);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -py * 0.1 - live.orbitY * 0.25, 0.14);
    g.position.x = THREE.MathUtils.lerp(g.position.x, px * -0.9 + live.orbitX * 1.1, 0.14);
    g.position.y = THREE.MathUtils.lerp(g.position.y, py * 0.5 - live.orbitY * 0.8 + Math.sin(t * 0.5) * 0.06, 0.14);

    // ---- rising lattice: organic idle motion, faster while interacting ----
    const energy = 1 + Math.min(1.4, Math.abs(live.dragVel) * 26 + Math.abs(px) * 0.5);
    if (lattice.current) {
      lattice.current.rotation.y += dt * 0.06 * energy;
    }
    if (nodeMesh.current) {
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]!;
        const y = n.base.y + Math.sin(t * n.speed * energy + n.phase) * 0.16 + (((t * 0.16 + i / nodes.length) % 1) - 0.5) * 0.5;
        live3[i]!.set(
          n.base.x + Math.sin(t * 0.36 * energy + n.phase) * 0.13,
          y,
          n.base.z + Math.cos(t * 0.3 * energy + n.phase) * 0.13,
        );
        dummy.position.copy(live3[i]!);
        const s = n.key ? 0.075 : 0.042;
        dummy.scale.setScalar(s * (1 + Math.sin(t * 1.6 + n.phase) * 0.14));
        dummy.updateMatrix();
        nodeMesh.current.setMatrixAt(i, dummy.matrix);
      }
      nodeMesh.current.instanceMatrix.needsUpdate = true;
    }
    if (linesRef.current) {
      const attr = linesRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      let p = 0;
      const max = quality === "high" ? 2.35 : 1.9;
      for (let i = 0; i < live3.length; i++) {
        for (let j = i + 1; j < live3.length; j++) {
          if (live3[i]!.distanceTo(live3[j]!) > max) continue;
          arr[p++] = live3[i]!.x; arr[p++] = live3[i]!.y; arr[p++] = live3[i]!.z;
          arr[p++] = live3[j]!.x; arr[p++] = live3[j]!.y; arr[p++] = live3[j]!.z;
        }
      }
      attr.needsUpdate = true;
      linesRef.current.geometry.setDrawRange(0, p / 3);
    }

    if (glass.current) {
      glass.current.children.forEach((c, i) => {
        c.position.y = Math.sin(t * (0.32 + i * 0.08) * energy + i) * 0.24 + (i % 2 ? 0.7 : -0.2);
        c.rotation.y = Math.sin(t * 0.12 + i) * 0.2 + px * 0.16;
      });
    }

    if (accent.current) {
      accent.current.position.set(px * 5.5, 1.6 + py * -2.4, 2.6 + Math.sin(t * 0.5) * 1.1);
      accent.current.intensity = 22 + Math.abs(live.dragVel) * 240;
    }

    // fast, subtle water motion
    distortion.offset.x = t * 0.14;
    distortion.offset.y = t * 0.1;

    g.visible = !narrow;
  });

  const nodeColor = useMemo(() => new THREE.Color(COL.glow), []);

  return (
    <group ref={root} position={[0, -0.2, 0]} visible={!narrow}>
      <pointLight ref={accent} color={COL.neon} intensity={22} distance={26} decay={1.7} />

      {/* reflective water floor — architectural pool */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, -2]}>
        <planeGeometry args={[60, 60, 1, 1]} />
        <MeshReflectorMaterial
          resolution={quality === "high" ? 1024 : 256}
          mirror={0.55}
          mixBlur={5}
          mixStrength={1.1}
          blur={[220, 60]}
          minDepthThreshold={0.3}
          maxDepthThreshold={1.2}
          depthScale={0.9}
          distortion={0.14}
          distortionMap={distortion}
          color={COL.forest}
          metalness={0.34}
          roughness={0.72}
        />
      </mesh>

      {/* pathway lines on the floor — strategy / direction */}
      <group position={[0, -2.46, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} position={[(i - 4) * 1.6, 0, 0]}>
            <planeGeometry args={[0.012, 44]} />
            <meshBasicMaterial color={COL.brand} transparent opacity={0.16} />
          </mesh>
        ))}
      </group>

      {/* colonnade — receding architecture */}
      <instancedMesh
        ref={colonnade}
        args={[undefined, undefined, COLUMNS]}
        castShadow={false}
        onUpdate={(m) => {
          const d = new THREE.Object3D();
          columns.forEach((c, i) => {
            d.position.set(c.x, -2.5 + c.h / 2, c.z);
            d.scale.set(1, c.h, 1);
            d.updateMatrix();
            m.setMatrixAt(i, d.matrix);
          });
          m.instanceMatrix.needsUpdate = true;
        }}
      >
        <boxGeometry args={[0.34, 1, 0.34]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.35}
          metalness={0.04}
          transmission={0.25}
          thickness={0.6}
          transparent
          opacity={0.88}
        />
      </instancedMesh>

      {/* translucent digital planes */}
      <group ref={glass}>
        {[
          { p: [-2.9, 0, -1.2], r: 0.3, s: [2.4, 3.2] },
          { p: [3.1, 0, -0.4], r: -0.34, s: [2.1, 2.7] },
          { p: [0.2, 0, -5.2], r: 0.06, s: [5.2, 3.4] },
        ].map((pl, i) => (
          <mesh key={i} position={pl.p as THREE.Vector3Tuple} rotation={[0, pl.r, 0]}>
            <planeGeometry args={pl.s as [number, number]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transparent
              opacity={0.14}
              roughness={0.1}
              metalness={0}
              transmission={0.9}
              thickness={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* rising node lattice — connection & growth */}
      <group ref={lattice}>
        <instancedMesh ref={nodeMesh} args={[undefined, undefined, NODES]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color={nodeColor} emissive={COL.neon} emissiveIntensity={0.45} roughness={0.3} />
        </instancedMesh>
        <lineSegments ref={linesRef} geometry={lineGeo}>
          <lineBasicMaterial color={COL.glow} transparent opacity={0.28} />
        </lineSegments>
      </group>
    </group>
  );
}
