import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette, DepthOfField } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { useNavigate } from "@tanstack/react-router";
import { live, useWorld, type WorldVariant } from "@/lib/world-store";
import { COL } from "./palette";
import { ParticleField } from "./ParticleField";
import {
  ContactWorld,
  GlassForms,
  HOME_GLASS,
  Monoliths,
  NodeNetwork,
  OrganicCore,
  ProjectRing,
  ProjectWorld,
  ServiceUniverse,
} from "./worlds";

/* ---------------- camera rig: scroll + pointer drive the whole world ------- */

const RIGS: Record<WorldVariant, { from: THREE.Vector3Tuple; to: THREE.Vector3Tuple; fov: number }> = {
  home: { from: [0, 0, 8.2], to: [0, 1.4, -9], fov: 42 },
  about: { from: [0, 0.4, 9.4], to: [0, -1.2, -6.5], fov: 46 },
  services: { from: [0, 0.2, 10.5], to: [0, 0.8, 1.5], fov: 48 },
  work: { from: [0, 0.3, 11.5], to: [0, -0.6, 2.2], fov: 50 },
  project: { from: [0, 0, 8.8], to: [0, 0.9, -4.5], fov: 44 },
  contact: { from: [0, 0, 9.6], to: [0, 0.6, 0.5], fov: 45 },
};

function Rig({ variant, focus }: { variant: WorldVariant; focus: number }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const target = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const smoothProgress = useRef(0);

  useEffect(() => {
    const rig = RIGS[variant];
    camera.position.set(...rig.from);
    camera.fov = rig.fov;
    camera.updateProjectionMatrix();
    smoothProgress.current = 0;
  }, [variant, camera]);

  useFrame((_, dt) => {
    const k = Math.min(1, dt * 3.4);
    live.smoothX += (live.pointerX - live.smoothX) * k * 0.35;
    live.smoothY += (live.pointerY - live.smoothY) * k * 0.35;
    live.dragX *= 0.9;

    smoothProgress.current += (live.progress - smoothProgress.current) * 0.06;
    const p = smoothProgress.current;
    const rig = RIGS[variant];

    // ease the flight path so the world opens up rather than sliding linearly
    const e = p * p * (3 - 2 * p);
    target.set(
      THREE.MathUtils.lerp(rig.from[0], rig.to[0], e) + live.smoothX * 0.85,
      THREE.MathUtils.lerp(rig.from[1], rig.to[1], e) + live.smoothY * 0.55,
      THREE.MathUtils.lerp(rig.from[2], rig.to[2], e) - (focus >= 0 ? 1.6 : 0),
    );
    camera.position.lerp(target, 0.055);

    look.set(live.smoothX * 0.9, live.smoothY * 0.6 - p * 0.6, -4);
    camera.lookAt(look);
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, live.smoothX * -0.035, 0.05);
  });

  return null;
}

/* ---------------- lighting + atmosphere ---------------- */

function Atmosphere({ quality }: { quality: "high" | "low" }) {
  const key = useRef<THREE.PointLight>(null);
  const rim = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (key.current) {
      key.current.position.set(Math.sin(t * 0.18) * 5 + live.smoothX * 2, 3.2, 4 + Math.cos(t * 0.14) * 2);
      key.current.intensity = 42 + Math.sin(t * 0.5) * 6;
    }
    if (rim.current) {
      rim.current.position.set(-5 + live.smoothX * -2, -2.4 + live.smoothY * 2, -5);
    }
  });

  return (
    <>
      <color attach="background" args={[COL.deep]} />
      <fogExp2 attach="fog" args={[COL.deep, quality === "high" ? 0.055 : 0.07]} />
      <ambientLight intensity={0.35} color={COL.forest} />
      <hemisphereLight intensity={0.4} color={COL.neon} groundColor={COL.deep} />
      <pointLight ref={key} color={COL.neon} intensity={42} distance={30} decay={1.6} />
      <pointLight ref={rim} color={COL.glow} intensity={26} distance={24} decay={1.8} />
      <directionalLight position={[4, 6, 6]} intensity={0.7} color={COL.glow} />
    </>
  );
}

/* ---------------- per-route scene ---------------- */

function Scene({ variant, quality, hue }: { variant: WorldVariant; quality: "high" | "low"; hue: number }) {
  const navigate = useNavigate();
  const focus = useWorld((s) => s.focus);
  const contactBurst = useWorld((s) => s.veil > 0.9);

  const count = quality === "high" ? 4600 : 1500;

  return (
    <>
      <Atmosphere quality={quality} />
      <Rig variant={variant} focus={focus} />
      <ParticleField count={count} />

      {variant === "home" && (
        <>
          <OrganicCore detail={quality === "high" ? 44 : 20} scale={1.15} amp={0.3} />
          <GlassForms specs={HOME_GLASS} quality={quality} />
          <Monoliths count={quality === "high" ? 11 : 6} />
        </>
      )}

      {variant === "about" && (
        <>
          <NodeNetwork nodes={quality === "high" ? 30 : 18} />
          <Monoliths count={quality === "high" ? 9 : 5} />
        </>
      )}

      {variant === "services" && (
        <>
          <ServiceUniverse quality={quality} />
          <OrganicCore detail={quality === "high" ? 30 : 16} scale={0.9} amp={0.26} position={[0, 0, -1]} />
        </>
      )}

      {variant === "work" && (
        <>
          <ProjectRing onOpen={(slug) => navigate({ to: "/case-studies/$slug", params: { slug } })} />
          <OrganicCore detail={quality === "high" ? 26 : 14} scale={0.62} amp={0.3} position={[0, 0, -1]} />
        </>
      )}

      {variant === "project" && <ProjectWorld hue={hue} />}
      {variant === "contact" && <ContactWorld burst={contactBurst} />}

      {quality === "high" ? (
        <EffectComposer enableNormalPass={false}>
          <DepthOfField focusDistance={0.012} focalLength={0.05} bokehScale={2.2} height={480} />
          <Bloom intensity={0.85} luminanceThreshold={0.24} luminanceSmoothing={0.5} mipmapBlur radius={0.72} />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
          <Vignette eskil={false} offset={0.24} darkness={0.92} />
        </EffectComposer>
      ) : (
        <EffectComposer enableNormalPass={false}>
          <Bloom intensity={0.6} luminanceThreshold={0.3} luminanceSmoothing={0.5} mipmapBlur />
          <Vignette offset={0.28} darkness={0.9} />
        </EffectComposer>
      )}
      <AdaptiveDpr pixelated={false} />
      <Preload all />
    </>
  );
}

/* ---------------- canvas shell ---------------- */

export default function World({ variant, hue = 0.45 }: { variant: WorldVariant; hue?: number }) {
  const quality = useWorld((s) => s.quality);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        dpr={quality === "high" ? [1, 1.75] : [0.75, 1.1]}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        camera={{ position: [0, 0, 9], fov: 44, near: 0.1, far: 90 }}
        onCreated={({ gl }) => {
          gl.setClearColor(COL.deep);
        }}
      >
        <Suspense fallback={null}>
          <Scene variant={variant} quality={quality} hue={hue} />
        </Suspense>
      </Canvas>
    </div>
  );
}
