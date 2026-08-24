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
  { text: "Strategy", x: 6, y: 16, side: "right", delay: 700 },
  { text: "Digital", x: 68, y: 26, side: "left", delay: 780 },
  { text: "Connection", x: 4, y: 50, side: "right", delay: 860 },
  { text: "Growth", x: 66, y: 74, side: "left", delay: 940 },
  { text: "Business", x: 10, y: 86, side: "right", delay: 1020 },
];

export function HeroDiagram() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* quiet framing lines */}
      <span className="absolute left-1/2 top-6 h-[calc(100%-3rem)] w-px -translate-x-1/2 bg-border" />
      <span className="absolute left-8 right-8 top-1/2 h-px bg-border" />

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
