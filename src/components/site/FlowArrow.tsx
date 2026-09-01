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
      className="flow-arrow inline-flex shrink-0 items-center justify-center text-glow"
      style={{
        transform: transforms || undefined,
        animationDelay: `${delay}ms`,
      }}
    >
      <svg
        width="84"
        height="16"
        viewBox="0 0 84 16"
        fill="none"
        className="overflow-visible"
      >
        {/* soft ambient glow line */}
        <line
          x1="1"
          y1="8"
          x2="68"
          y2="8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.22"
        />
        {/* main stem */}
        <line
          x1="1"
          y1="8"
          x2="68"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* travelling highlight */}
        <line
          x1="1"
          y1="8"
          x2="68"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="14 54"
          className="flow-arrow-dash"
          style={{ animationDelay: `${delay}ms` }}
        />
        {/* chevron head */}
        <path
          d="M66 2 L79 8 L66 14 Z"
          fill="currentColor"
          opacity="0.95"
        />
        <path
          d="M66 2 L79 8 L66 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
}
