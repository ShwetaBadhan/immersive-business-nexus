import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { COL } from "./palette";
import { live } from "@/lib/world-store";

/**
 * 239 hero environment — one art-directed scene.
 *
 * A single slender arch/portal stands on a calm, softly reflective pale floor,
 * with a very quiet ring of light around it and two barely-there wall planes
 * for depth. Pointer + drag move the whole scene with inertia so it reads as a
 * space you can look into. Nothing else: no particles, no floating objects.
 */

const ARCH_SEGMENTS = 44;

function archCurve(width: number, height: number) {
  const pts: THREE.Vector3[] = [];
  const legs = 8;
  for (let i = 0; i <= legs; i++) pts.push(new THREE.Vector3(-width, -2.4 + (i / legs) * height, 0));
  for (let i = 1; i <= ARCH_SEGMENTS; i++) {
    const a = Math.PI - (i / ARCH_SEGMENTS) * Math.PI;
    pts.push(new THREE.Vector3(Math.cos(a) * width, -2.4 + height + Math.sin(a) * width * 0.72, 0));
  }
  for (let i = legs - 1; i >= 0; i--) pts.push(new THREE.Vector3(width, -2.4 + (i / legs) * height, 0));
  return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.06);
}

export function HeroEnvironment({ quality }: { quality: "high" | "low" }) {
  const root = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const accent = useRef<THREE.PointLight>(null);

  const narrow = useThree((s) => s.size.width < 760);

  const archGeo = useMemo(() => new THREE.TubeGeometry(archCurve(1.5, 1.5), 220, 0.032, 12, false), []);
  const innerGeo = useMemo(() => new THREE.TubeGeometry(archCurve(1.05, 1.2), 200, 0.012, 8, false), []);

  useFrame((state, dt) => {
    const g = root.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const k = Math.min(1, dt * 60);

    // inertia — drag velocity decays, idle drifts gently back to centre
    live.dragVel *= Math.pow(0.93, k);
    live.dragVelY *= Math.pow(0.9, k);
    live.orbitX = THREE.MathUtils.clamp(live.orbitX + live.dragVel * 1.7, -0.9, 0.9);
    live.orbitY = THREE.MathUtils.clamp(live.orbitY + live.dragVelY * 1.1, -0.35, 0.35);
    if (Math.abs(live.dragVel) < 0.0004) live.orbitX *= Math.pow(0.99, k);
    if (Math.abs(live.dragVelY) < 0.0004) live.orbitY *= Math.pow(0.99, k);

    const px = live.smoothX;
    const py = live.smoothY;

    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, px * 0.13 + live.orbitX * 0.34, 0.12);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -py * 0.05 - live.orbitY * 0.14, 0.12);
    g.position.x = THREE.MathUtils.lerp(g.position.x, px * -0.55 + live.orbitX * 0.7, 0.12);
    g.position.y = THREE.MathUtils.lerp(
      g.position.y,
      -0.2 + py * 0.26 - live.orbitY * 0.45 + Math.sin(t * 0.32) * 0.05,
      0.12,
    );

    if (halo.current) {
      halo.current.rotation.z = t * 0.045;
      const s = 1 + Math.sin(t * 0.4) * 0.012;
      halo.current.scale.setScalar(s);
    }

    if (accent.current) {
      accent.current.position.set(px * 3, 2.2 + py * -1.2, 1.4);
      accent.current.intensity = 7 + Math.abs(live.dragVel) * 50;
    }

    g.visible = !narrow;
  });

  return (
    <group ref={root} position={[0, -0.2, 0]} visible={!narrow}>
      <pointLight ref={accent} color={COL.neon} intensity={7} distance={18} decay={2} />

      {/* calm pale floor with a whisper of reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.9, -4]}>
        <planeGeometry args={[70, 70]} />
        <MeshReflectorMaterial
          resolution={quality === "high" ? 512 : 256}
          mirror={0.3}
          mixBlur={7}
          mixStrength={0.6}
          blur={[300, 90]}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.3}
          depthScale={0.6}
          color={COL.forest}
          metalness={0.15}
          roughness={0.85}
        />
      </mesh>

      {/* focal element — the arch */}
      <group position={[0, -0.55, -5.2]}>
        <mesh geometry={archGeo}>
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.22}
            metalness={0.04}
            transmission={0.35}
            thickness={0.7}
            transparent
            opacity={0.96}
          />
        </mesh>
        <mesh geometry={innerGeo}>
          <meshBasicMaterial color={COL.brand} transparent opacity={0.4} />
        </mesh>

        {/* quiet ring of light behind the arch */}
        <mesh ref={halo} position={[0, 0.35, -1.4]}>
          <ringGeometry args={[2.1, 2.115, 128]} />
          <meshBasicMaterial color={COL.glow} transparent opacity={0.14} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* two faint wall planes for depth only */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 6.2, 0.2, -9]} rotation={[0, -s * 0.34, 0]}>
          <planeGeometry args={[7, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.14} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
