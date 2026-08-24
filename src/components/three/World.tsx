import "./r3f-devtag-patch";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { live, useWorld, type WorldVariant } from "@/lib/world-store";
import { COL } from "./palette";
import { HeroEnvironment } from "./HeroEnvironment";


/* ---------------- camera rig: scroll + pointer drive the whole world ------- */

const RIGS: Record<WorldVariant, { from: THREE.Vector3Tuple; to: THREE.Vector3Tuple; fov: number }> = {
  home: { from: [0, 0.15, 8.6], to: [0, 1.2, -3.5], fov: 42 },
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
    const k = Math.min(1, dt * 14);
    live.smoothX += (live.pointerX - live.smoothX) * k;
    live.smoothY += (live.pointerY - live.smoothY) * k;
    live.dragX *= 0.88;

    smoothProgress.current += (live.progress - smoothProgress.current) * 0.11;
    const p = smoothProgress.current;
    const rig = RIGS[variant];

    // ease the flight path so the world opens up rather than sliding linearly
    const e = p * p * (3 - 2 * p);
    target.set(
      THREE.MathUtils.lerp(rig.from[0], rig.to[0], e) + live.smoothX * 1.15 - live.orbitX * 0.9,
      THREE.MathUtils.lerp(rig.from[1], rig.to[1], e) + live.smoothY * 0.7 + live.orbitY * 0.7,
      THREE.MathUtils.lerp(rig.from[2], rig.to[2], e) - (focus >= 0 ? 1.6 : 0),
    );
    camera.position.lerp(target, Math.min(1, dt * 6));

    look.set(live.smoothX * 1.1 - live.orbitX * 0.5, live.smoothY * 0.7 - p * 0.6, -4);
    camera.lookAt(look);
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, live.smoothX * -0.03, 0.1);
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
      key.current.intensity = 9 + Math.sin(t * 0.5) * 1.5;
    }
    if (rim.current) {
      rim.current.position.set(-5 + live.smoothX * -2, -2.4 + live.smoothY * 2, -5);
    }
  });

  return (
    <>
      <color attach="background" args={[COL.deep]} />
      <fogExp2 attach="fog" args={[COL.deep, 0.026]} />
      <ambientLight intensity={0.9} color={COL.deep} />
      <hemisphereLight intensity={0.9} color={COL.deep} groundColor={COL.moss} />
      <pointLight ref={key} color={COL.neon} intensity={9} distance={26} decay={2} />
      <pointLight ref={rim} color={COL.glow} intensity={5} distance={20} decay={2} />
      <directionalLight position={[4, 6, 6]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-5, -2, 3]} intensity={0.8} color={COL.forest} />
    </>
  );
}

/* ---------------- per-route scene ---------------- */

function Scene({ variant, quality }: { variant: WorldVariant; quality: "high" | "low" }) {
  const focus = useWorld((s) => s.focus);

  return (
    <>
      <Atmosphere quality={quality} />
      <Rig variant={variant} focus={focus} />
      {variant === "home" && <HeroEnvironment quality={quality} />}

      <EffectComposer enableNormalPass={false}>
        <Bloom intensity={0.12} luminanceThreshold={0.9} luminanceSmoothing={0.4} mipmapBlur />
        <Vignette eskil={false} offset={0.5} darkness={0.08} />
      </EffectComposer>

      <AdaptiveDpr pixelated={false} />
      <Preload all />
    </>
  );
}

/* ---------------- canvas shell ---------------- */

export default function World({ variant }: { variant: WorldVariant; hue?: number }) {
  const quality = useWorld((s) => s.quality);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        dpr={quality === "high" ? [1, 2] : [0.75, 1.2]}
        gl={{
          antialias: true,
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
          <Scene variant={variant} quality={quality} />
        </Suspense>
      </Canvas>
    </div>
  );
}
