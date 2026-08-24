/**
 * Editorial label layer for the hero's WebGL growth network.
 * Pointer-transparent so the 3D composition keeps its hover response.
 */

type Label = {
  text: string;
  /** position in % of the container */
  x: number;
  y: number;
  /** line direction */
  side: "left" | "right";
  delay: number;
};

const LABELS: Label[] = [
  { text: "Strategy", x: 3, y: 14, side: "right", delay: 560 },
  { text: "Digital", x: 88, y: 22, side: "left", delay: 620 },
  { text: "Connection", x: 2, y: 48, side: "right", delay: 680 },
  { text: "Growth", x: 90, y: 62, side: "left", delay: 740 },
  { text: "Business", x: 4, y: 84, side: "right", delay: 800 },
];

export function HeroDiagram() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {LABELS.map((l) => (
        <div
          key={l.text}
          className="absolute flex items-center gap-3"
          style={{
            left: `${l.x}%`,
            top: `${l.y}%`,
            flexDirection: l.side === "right" ? "row" : "row-reverse",
          }}
          data-reveal
          data-reveal-delay={l.delay}
        >
          <span className="label whitespace-nowrap !text-[0.58rem] !tracking-[0.32em] text-foreground/70">
            {l.text}
          </span>
          <span className="flex items-center" style={{ flexDirection: l.side === "right" ? "row" : "row-reverse" }}>
            <span className="block h-px w-10 bg-neon/45" />
            <span className="block h-[5px] w-[5px] rounded-full bg-neon/80" />
          </span>
        </div>
      ))}

      <span className="label absolute bottom-0 left-0 !text-[0.55rem] text-muted-foreground">
        Growth network / live
      </span>
    </div>
  );
}
