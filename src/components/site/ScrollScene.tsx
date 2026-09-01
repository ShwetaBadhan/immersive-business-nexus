import type { ReactNode } from "react";
import { Stage } from "@/components/three/Stage";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlignmentWorld,
  ArrivalWorld,
  DepthHaze,
  Drift,
  MomentumWorld,
  PracticeWorld,
  TrajectoryWorld,
  type DriftSide,
} from "@/components/three/section-worlds";

export type SceneKind = "momentum" | "practices" | "trajectory" | "alignment" | "arrival";

type Cfg = {
  /** dominant sculpture for the section */
  world: (compact: boolean) => ReactNode;
  side: DriftSide;
  offsetX: number;
  offsetY: number;
  scale: number;
  near: number;
  far: number;
  spin: number;
  tilt: number;
  fade: number;
  haze: number;
  /** mobile overrides */
  m: { offsetX: number; offsetY: number; scale: number; fade: number };
};

/**
 * One large cinematic composition per section, rendered full-bleed behind
 * the content (content sits at z-10). Sculptures live deep in camera space
 * and are intentionally larger than the frame so the world reads as
 * continuing beyond the viewport, while depth-based opacity keeps text
 * dominant.
 */
const CONFIG: Record<SceneKind, Cfg> = {
  momentum: {
    world: (c) => <MomentumWorld compact={c} />,
    side: "right",
    offsetX: 2.9,
    offsetY: 0.2,
    scale: 3.1,
    near: -5,
    far: -13,
    spin: 0.05,
    tilt: 0.14,
    fade: 0.62,
    haze: 46,
    m: { offsetX: 1.9, offsetY: 0.6, scale: 2.3, fade: 0.48 },
  },
  practices: {
    world: (c) => <PracticeWorld compact={c} />,
    side: "right",
    offsetX: 3.4,
    offsetY: -0.2,
    scale: 2.6,
    near: -5.6,
    far: -14,
    spin: 0.04,
    tilt: 0.1,
    fade: 0.56,
    haze: 40,
    m: { offsetX: 2.2, offsetY: -0.4, scale: 2, fade: 0.44 },
  },
  trajectory: {
    world: (c) => <TrajectoryWorld compact={c} />,
    side: "left",
    offsetX: 3.1,
    offsetY: 0.1,
    scale: 2.9,
    near: -5.4,
    far: -14,
    spin: 0.045,
    tilt: 0.12,
    fade: 0.58,
    haze: 42,
    m: { offsetX: 2, offsetY: 0.5, scale: 2.2, fade: 0.46 },
  },
  alignment: {
    world: (c) => <AlignmentWorld compact={c} />,
    side: "left",
    offsetX: 3.8,
    offsetY: 0,
    scale: 3.3,
    near: -5.2,
    far: -13.5,
    spin: 0.035,
    tilt: 0.16,
    fade: 0.58,
    haze: 36,
    m: { offsetX: 2.4, offsetY: -0.5, scale: 2.4, fade: 0.44 },
  },
  arrival: {
    world: (c) => <ArrivalWorld compact={c} />,
    side: "center",
    offsetX: 0,
    offsetY: 0.1,
    scale: 3.4,
    near: -6,
    far: -14,
    spin: 0.05,
    tilt: 0.1,
    fade: 0.56,
    haze: 48,
    m: { offsetX: 0, offsetY: 0.2, scale: 2.5, fade: 0.42 },
  },
};

export function ScrollScene({ kind }: { kind: SceneKind }) {
  const mobile = useIsMobile();
  const cfg = CONFIG[kind];
  const intensity = mobile ? 0.6 : 0.88;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <Stage
        className="h-full w-full"
        camera={[0, 0, 6.4]}
        fov={mobile ? 46 : 40}
        tint={0.9}
      >
        <DepthHaze count={mobile ? Math.round(cfg.haze * 0.35) : cfg.haze} depth={16} />
        <Drift
          side={cfg.side}
          offsetX={mobile ? cfg.m.offsetX : cfg.offsetX}
          offsetY={mobile ? cfg.m.offsetY : cfg.offsetY}
          scale={mobile ? cfg.m.scale : cfg.scale}
          near={cfg.near}
          far={cfg.far}
          spin={cfg.spin}
          tilt={cfg.tilt}
          intensity={intensity}
          fade={mobile ? cfg.m.fade : cfg.fade}
        >
          {cfg.world(mobile)}
        </Drift>
      </Stage>
    </div>
  );
}
