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

const CONFIG: Record<SceneKind, { pattern: FlightPattern; depth: number; align: string }> = {
  momentum: { pattern: "approach", depth: 9.5, align: "left-[-6%] w-[78%] md:left-[-2%] md:w-[52%]" },
  practices: { pattern: "sweep", depth: 10, align: "right-[-10%] w-[80%] md:right-[-4%] md:w-[48%]" },
  trajectory: { pattern: "orbit", depth: 10.5, align: "left-[-8%] w-[86%] md:left-[2%] md:w-[54%]" },
  alignment: { pattern: "rise", depth: 9, align: "right-[-8%] w-[76%] md:right-[4%] md:w-[42%]" },
  arrival: { pattern: "converge", depth: 11, align: "left-1/2 -translate-x-1/2 w-[92%] md:w-[62%]" },
};

/**
 * Scroll-driven 3D depth layer for a home-page section (never the hero).
 * Sits behind the content, non-interactive, and travels from background
 * to foreground and away again as the section passes through the viewport.
 */
export function ScrollScene({ kind }: { kind: SceneKind }) {
  const mobile = useIsMobile();
  const cfg = CONFIG[kind];
  const intensity = mobile ? 0.55 : 1;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className={`absolute top-1/2 -translate-y-1/2 ${cfg.align} h-[70%] md:h-[80%]`}>
        <Stage
          className="h-full w-full opacity-[0.72] md:opacity-90"
          camera={[0, 0, 6.4]}
          fov={mobile ? 40 : 34}
        >
          <Flight pattern={cfg.pattern} depth={cfg.depth} intensity={intensity}>
            {kind === "momentum" && <MomentumForm />}
            {kind === "practices" && <PracticeLattice compact={mobile} />}
            {kind === "trajectory" && <TrajectoryRibbon />}
            {kind === "alignment" && <AlignmentRings />}
            {kind === "arrival" && <ArrivalCore />}
          </Flight>
          <DepthDust count={mobile ? 70 : 200} depth={cfg.depth + 2} />
        </Stage>
      </div>
    </div>
  );
}
