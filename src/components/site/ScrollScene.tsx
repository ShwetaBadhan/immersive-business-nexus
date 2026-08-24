import { Stage } from "@/components/three/Stage";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlignmentRings,
  ArrivalCore,
  DepthDust,
  Flight,
  MomentumForm,
  PracticeLattice,
  TrajectoryRibbon,
  type FlightPattern,
} from "@/components/three/scroll-scene";

export type SceneKind = "momentum" | "practices" | "trajectory" | "alignment" | "arrival";

type Cfg = {
  pattern: FlightPattern;
  depth: number;
  /** small canvas anchored in the section's negative space */
  box: string;
  /** secondary mote-only canvas on the opposite side */
  motes?: string;
  scale: number;
};

const CONFIG: Record<SceneKind, Cfg> = {
  momentum: {
    pattern: "approach",
    depth: 7,
    box: "top-[8%] right-[4%] w-[110px] h-[110px] md:right-[7%] md:w-[150px] md:h-[150px]",
    motes: "bottom-[10%] left-[5%] w-[150px] h-[190px]",
    scale: 0.5,
  },
  practices: {
    pattern: "sweep",
    depth: 7.5,
    box: "top-[4%] left-[2%] w-[100px] h-[100px] md:left-[5%] md:w-[140px] md:h-[140px]",
    motes: "bottom-[6%] right-[4%] w-[160px] h-[200px]",
    scale: 0.46,
  },
  trajectory: {
    pattern: "orbit",
    depth: 8,
    box: "bottom-[8%] right-[3%] w-[130px] h-[110px] md:right-[6%] md:w-[180px] md:h-[150px]",
    motes: "top-[6%] left-[4%] w-[150px] h-[180px]",
    scale: 0.5,
  },
  alignment: {
    pattern: "rise",
    depth: 7,
    box: "top-[12%] right-[5%] w-[90px] h-[130px] md:right-[9%] md:w-[120px] md:h-[170px]",
    scale: 0.5,
  },
  arrival: {
    pattern: "converge",
    depth: 7.5,
    box: "top-[10%] left-[6%] w-[90px] h-[90px] md:left-[12%] md:w-[120px] md:h-[120px]",
    motes: "bottom-[12%] right-[8%] w-[140px] h-[160px]",
    scale: 0.44,
  },
};

/**
 * Micro-detail 3D layer for a home-page section (never the hero).
 * A single tiny object anchored in the section's negative space, plus an
 * optional sparse mote haze on the opposite side. Non-interactive and
 * always behind content.
 */
export function ScrollScene({ kind }: { kind: SceneKind }) {
  const mobile = useIsMobile();
  const cfg = CONFIG[kind];
  const intensity = mobile ? 0.4 : 1;
  const scale = cfg.scale * (mobile ? 0.7 : 1);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className={`absolute ${cfg.box}`}>
        <Stage
          className="h-full w-full opacity-70 md:opacity-90"
          camera={[0, 0, 5.4]}
          fov={mobile ? 34 : 30}
        >
          <Flight pattern={cfg.pattern} depth={cfg.depth} intensity={intensity} scale={scale}>
            {kind === "momentum" && <MomentumForm />}
            {kind === "practices" && <PracticeLattice compact={mobile} />}
            {kind === "trajectory" && <TrajectoryRibbon />}
            {kind === "alignment" && <AlignmentRings />}
            {kind === "arrival" && <ArrivalCore />}
          </Flight>
        </Stage>
      </div>

      {cfg.motes && !mobile && (
        <div className={`absolute ${cfg.motes}`}>
          <Stage className="h-full w-full opacity-60" camera={[0, 0, 5]} fov={32}>
            <DepthDust count={34} depth={cfg.depth} />
          </Stage>
        </div>
      )}
    </div>
  );
}
