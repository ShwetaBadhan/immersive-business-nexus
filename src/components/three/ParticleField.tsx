import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { live } from "@/lib/world-store";
import { PARTICLE_FRAG, PARTICLE_VERT } from "./shaders";
import { COL } from "./palette";

export function ParticleField({ count = 4200, spread = 34 }: { count?: number; spread?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const dpr = useThree((s) => s.viewport.dpr);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const scale = new Float32Array(count);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // radial cloud, denser toward the centre channel the camera flies through
      const r = Math.pow(Math.random(), 0.62) * 13 + 1.2;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(a) * r * 0.72;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      scale[i] = 0.3 + Math.random() * 1.5;
      seed[i] = Math.random();
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count, spread]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uSize: { value: 4.4 },
      uPixelRatio: { value: dpr },
      uSpread: { value: spread },
      uNeon: { value: new THREE.Color(COL.brand) },
      uGlow: { value: new THREE.Color(COL.neon) },
    }),
    [dpr, spread],
  );

  useFrame((_, dt) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u["uTime"]!.value += dt;
    u["uProgress"]!.value += (live.progress - u["uProgress"]!.value) * 0.05;
    (u["uPointer"]!.value as THREE.Vector2).set(live.smoothX * 1.2, live.smoothY * 1.2);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={PARTICLE_VERT}
        fragmentShader={PARTICLE_FRAG}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
