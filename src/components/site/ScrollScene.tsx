import type { ReactNode } from "react";
import { Stage } from "@/components/three/Stage";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlignmentRings,
  ArrivalCore,
  CrystalShard,
  DepthDust,
  Flight,
  GlassMonolith,
  MomentumForm,
  NodeCluster,
  PracticeLattice,
  RibbonArc,
  RingStack,
  TrajectoryRibbon,
  WireCage,
  type FlightPattern,
} from "@/components/three/scroll-scene";

export type SceneKind = "momentum" | "practices" | "trajectory" | "alignment" | "arrival";

type Layer = {
  /** anchor box (Tailwind position + size utilities) */
  box: string;
  pattern: FlightPattern;
  depth: number;
  scale: number;
  opacity: string;
  fov?: number;
  /** rendered on mobile too */
  mobile?: boolean;
  /** mobile-specific anchor box */
  mobileBox?: string;
  node: ReactNode;
};

type Cfg = {
  layers: Layer[];
  /** background mote haze */
  motes?: { box: string; count: number; depth: number };
};

/**
 * Each section below the hero gets one foreground form (120-220px) plus one or
 * two midground companions (60-140px) anchored to the page edges / corners,
 * and a sparse background mote haze. Content always sits above at z-10.
 */
const CONFIG: Record<SceneKind, Cfg> = {
  momentum: {
    layers: [
      {
        box: "top-[6%] -right-[3%] w-[190px] h-[190px] md:right-[2%] md:w-[240px] md:h-[240px]",
        mobileBox: "top-[3%] -right-[8%] w-[150px] h-[150px]",
        pattern: "approach",
        depth: 7,
        scale: 0.95,
        opacity: "opacity-90",
        mobile: true,
      },
      {
        box: "bottom-[8%] left-[1%] w-[120px] h-[120px] md:left-[3%] md:w-[150px] md:h-[150px]",
        mobileBox: "bottom-[4%] -left-[6%] w-[105px] h-[105px]",
        pattern: "rise",
        depth: 8.5,
        scale: 0.7,
        opacity: "opacity-70",
        mobile: true,
        node: <NodeCluster />,
      },
    ].map((l) => l) as Layer[],
    motes: { box: "inset-0", count: 60, depth: 9 },
  },
  practices: {
    layers: [],
    motes: { box: "inset-0", count: 54, depth: 9.5 },
  },
  trajectory: {
    layers: [],
    motes: { box: "inset-0", count: 58, depth: 10 },
  },
  alignment: {
    layers: [],
    motes: { box: "inset-0", count: 48, depth: 9 },
  },
  arrival: {
    layers: [],
    motes: { box: "inset-0", count: 64, depth: 9.5 },
  },
};

/* primary + companion forms per section */
CONFIG.momentum.layers[0]!.node = <MomentumForm />;

CONFIG.practices.layers = [
  {
    box: "top-[2%] -left-[4%] w-[180px] h-[180px] md:left-[1%] md:w-[230px] md:h-[230px]",
    mobileBox: "top-[1%] -left-[9%] w-[145px] h-[145px]",
    pattern: "sweep",
    depth: 7.5,
    scale: 0.9,
    opacity: "opacity-90",
    mobile: true,
    node: <PracticeLattice />,
  },
  {
    box: "top-[40%] -right-[4%] w-[140px] h-[170px] md:right-[1%] md:w-[170px] md:h-[210px]",
    mobileBox: "bottom-[8%] -right-[8%] w-[120px] h-[140px]",
    pattern: "rise",
    depth: 9,
    scale: 0.72,
    opacity: "opacity-75",
    mobile: true,
    node: <CrystalShard />,
  },
  {
    box: "bottom-[4%] left-[6%] w-[110px] h-[110px]",
    pattern: "orbit",
    depth: 10,
    scale: 0.6,
    opacity: "opacity-60",
    node: <WireCage />,
  },
];

CONFIG.trajectory.layers = [
  {
    box: "bottom-[6%] -right-[4%] w-[210px] h-[170px] md:right-[1%] md:w-[260px] md:h-[210px]",
    mobileBox: "bottom-[2%] -right-[10%] w-[165px] h-[135px]",
    pattern: "orbit",
    depth: 8,
    scale: 0.95,
    opacity: "opacity-90",
    mobile: true,
    node: <TrajectoryRibbon />,
  },
  {
    box: "top-[4%] -left-[3%] w-[150px] h-[150px] md:left-[2%] md:w-[185px] md:h-[185px]",
    mobileBox: "top-[2%] -left-[8%] w-[120px] h-[120px]",
    pattern: "converge",
    depth: 9,
    scale: 0.75,
    opacity: "opacity-75",
    mobile: true,
    node: <RingStack />,
  },
];

CONFIG.alignment.layers = [
  {
    box: "top-[10%] -right-[3%] w-[170px] h-[220px] md:right-[3%] md:w-[210px] md:h-[260px]",
    mobileBox: "top-[4%] -right-[8%] w-[135px] h-[175px]",
    pattern: "rise",
    depth: 7,
    scale: 0.95,
    opacity: "opacity-90",
    mobile: true,
    node: <AlignmentRings />,
  },
  {
    box: "bottom-[10%] -left-[3%] w-[130px] h-[150px] md:left-[2%] md:w-[160px] md:h-[190px]",
    mobileBox: "bottom-[5%] -left-[8%] w-[110px] h-[130px]",
    pattern: "sweep",
    depth: 9.5,
    scale: 0.68,
    opacity: "opacity-70",
    mobile: true,
    node: <RibbonArc />,
  },
];

CONFIG.arrival.layers = [
  {
    box: "top-[8%] -left-[4%] w-[200px] h-[200px] md:left-[6%] md:w-[250px] md:h-[250px]",
    mobileBox: "top-[3%] -left-[9%] w-[155px] h-[155px]",
    pattern: "converge",
    depth: 7.5,
    scale: 1,
    opacity: "opacity-95",
    mobile: true,
    node: <ArrivalCore />,
  },
  {
    box: "bottom-[10%] -right-[4%] w-[150px] h-[180px] md:right-[5%] md:w-[185px] md:h-[220px]",
    mobileBox: "bottom-[4%] -right-[9%] w-[120px] h-[145px]",
    pattern: "approach",
    depth: 9,
    scale: 0.72,
    opacity: "opacity-75",
    mobile: true,
    node: <GlassMonolith />,
  },
];

export function ScrollScene({ kind }: { kind: SceneKind }) {
  const mobile = useIsMobile();
  const cfg = CONFIG[kind];
  const intensity = mobile ? 0.62 : 1;

  const layers = mobile ? cfg.layers.filter((l) => l.mobile) : cfg.layers;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {cfg.motes && (
        <div className={`absolute ${cfg.motes.box}`}>
          <Stage className="h-full w-full opacity-50 md:opacity-70" camera={[0, 0, 5]} fov={38}>
            <DepthDust
              count={mobile ? Math.round(cfg.motes.count * 0.45) : cfg.motes.count}
              depth={cfg.motes.depth}
            />
          </Stage>
        </div>
      )}

      {layers.map((l, i) => (
        <div key={i} className={`absolute ${mobile ? (l.mobileBox ?? l.box) : l.box}`}>
          <Stage
            className={`h-full w-full ${mobile ? "opacity-70" : l.opacity}`}
            camera={[0, 0, 5.4]}
            fov={l.fov ?? (mobile ? 36 : 31)}
          >
            <Flight
              pattern={l.pattern}
              depth={l.depth}
              intensity={intensity}
              scale={l.scale * (mobile ? 0.82 : 1)}
            >
              {l.node}
            </Flight>
          </Stage>
        </div>
      ))}
    </div>
  );
}
