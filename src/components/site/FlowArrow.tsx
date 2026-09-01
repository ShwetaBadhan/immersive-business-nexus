/**
 * Premium connector arrows for the hero statistics strip.
 *
 * `FlowArrow` — straight right/left or up/down connector with a slow
 * travelling highlight and a refined filled chevron.
 */
export function FlowArrow({
  vertical = false,
  reverse = false,
  delay = 0,
  compact = false,
}: {
  vertical?: boolean;
  reverse?: boolean;
  delay?: number;
  compact?: boolean;
}) {
  const transforms = [
    vertical ? "rotate(90deg)" : undefined,
    reverse ? "scaleX(-1)" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  const width = compact ? 24 : 84;
  const height = compact ? 6 : 16;
  const viewBox = compact ? "0 0 24 6" : "0 0 84 16";
  const stemEnd = compact ? 16 : 68;
  const headX = compact ? 14 : 66;
  const headTipX = compact ? 22 : 79;
  const headY1 = compact ? 0.5 : 2;
  const headY2 = compact ? 5.5 : 14;
  const midY = compact ? 3 : 8;
  const strokeMain = compact ? 0.75 : 1.5;
  const strokeGlow = compact ? 1 : 2;

  return (
    <span
      aria-hidden
      className="flow-arrow inline-flex shrink-0 items-center justify-center text-glow"
      style={{
        transform: transforms || undefined,
        animationDelay: `${delay}ms`,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={viewBox}
        fill="none"
        className="overflow-visible"
      >
        {/* soft ambient glow line */}
        <line
          x1="1"
          y1={midY}
          x2={stemEnd}
          y2={midY}
          stroke="currentColor"
          strokeWidth={strokeGlow}
          strokeLinecap="round"
          opacity="0.22"
        />
        {/* main stem */}
        <line
          x1="1"
          y1={midY}
          x2={stemEnd}
          y2={midY}
          stroke="currentColor"
          strokeWidth={strokeMain}
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* travelling highlight */}
        <line
          x1="1"
          y1={midY}
          x2={stemEnd}
          y2={midY}
          stroke="currentColor"
          strokeWidth={strokeMain}
          strokeLinecap="round"
          strokeDasharray={compact ? "8 24" : "14 54"}
          className="flow-arrow-dash"
          style={{ animationDelay: `${delay}ms` }}
        />
        {/* chevron head */}
        <path
          d={`M${headX} ${headY1} L${headTipX} ${midY} L${headX} ${headY2} Z`}
          fill="currentColor"
          opacity="0.95"
        />
        <path
          d={`M${headX} ${headY1} L${headTipX} ${midY} L${headX} ${headY2}`}
          stroke="currentColor"
          strokeWidth={strokeMain}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
}
