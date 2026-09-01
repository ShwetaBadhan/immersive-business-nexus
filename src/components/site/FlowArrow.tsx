/**
 * Elegant connector arrow used between the hero statistics.
 * A refined horizontal rule with a clean chevron head and a slow
 * traveling highlight — sized to sit confidently between blocks.
 *
 * `reverse` mirrors the arrow so it can point back toward an earlier
 * statistic (e.g. Ten → 360°) while keeping the exact same proportions
 * and animation.
 */
export function FlowArrow({
  vertical = false,
  reverse = false,
  delay = 0,
}: {
  vertical?: boolean;
  reverse?: boolean;
  delay?: number;
}) {
  const transforms = [
    vertical ? "rotate(90deg)" : undefined,
    reverse ? "scaleX(-1)" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      aria-hidden
      className="flow-arrow inline-flex shrink-0 items-center justify-center"
      style={{
        transform: transforms || undefined,
        animationDelay: `${delay}ms`,
      }}
    >
      <svg
        width="104"
        height="20"
        viewBox="0 0 104 20"
        fill="none"
        className="overflow-visible"
      >
        <line
          x1="2"
          y1="10"
          x2="86"
          y2="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="2"
          y1="10"
          x2="86"
          y2="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="18 70"
          className="flow-arrow-dash"
          style={{ animationDelay: `${delay}ms` }}
          opacity="0.5"
        />
        <path
          d="M84 3 L98 10 L84 17 Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
