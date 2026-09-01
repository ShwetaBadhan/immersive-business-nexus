/**
 * Premium connector arrows for the hero statistics strip.
 *
 * `FlowArrow` — straight right/left or up/down connector with a slow
 * travelling highlight and a refined filled chevron.
 *
 * `FlowReturnArrow` — curved return path used to show Ten flowing back
 * toward 360° without being mistaken for an India → Ten direction.
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

/**
 * A graceful curved return arrow that arcs above the statistics row to
 * show Ten feeding back into 360°. Rendered as an overlay so it does not
 * compete with the straight inter-stat connectors.
 */
export function FlowReturnArrow({ delay = 0 }: { delay?: number }) {
  return (
    <span
      aria-hidden
      className="flow-return-arrow pointer-events-none absolute inset-x-0 -top-5 hidden h-0 text-glow sm:block"
      style={{ animationDelay: `${delay}ms` }}
    >
      <svg
        className="absolute left-1/2 -translate-x-1/2 overflow-visible"
        width="420"
        height="44"
        viewBox="0 0 420 44"
        fill="none"
      >
        <defs>
          <linearGradient id="returnArrowGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {/* background arc */}
        <path
          d="M 380 36 C 380 8, 40 8, 40 22"
          stroke="url(#returnArrowGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        {/* travelling highlight dash */}
        <path
          d="M 380 36 C 380 8, 40 8, 40 22"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="18 180"
          className="flow-arrow-dash"
          style={{ animationDelay: `${delay}ms` }}
        />
        {/* arrow head at the 360° end */}
        <path
          d="M 40 22 L 52 16 L 48 22 L 52 28 Z"
          fill="currentColor"
          opacity="0.95"
        />
        <path
          d="M 40 22 L 52 16 L 48 22 L 52 28"
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
