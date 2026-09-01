/**
 * Elegant connector arrow used between the hero statistics.
 * A refined horizontal rule with a clean chevron head and a slow
 * traveling highlight — sized to sit confidently between blocks.
 */
export function FlowArrow({
  vertical = false,
  delay = 0,
}: {
  vertical?: boolean;
  delay?: number;
}) {
  return (
    <span
      aria-hidden
      className="flow-arrow inline-flex shrink-0 items-center justify-center"
      style={{
        transform: vertical ? "rotate(90deg)" : undefined,
        animationDelay: `${delay}ms`,
      }}
    >
      <svg
        width="56"
        height="16"
        viewBox="0 0 56 16"
        fill="none"
        className="overflow-visible"
      >
        <line
          x1="0"
          y1="8"
          x2="40"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.28"
        />
        <line
          x1="0"
          y1="8"
          x2="40"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="10 34"
          className="flow-arrow-dash"
          style={{ animationDelay: `${delay}ms` }}
        />
        <path
          d="M40 3 L48 8 L40 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </svg>
    </span>
  );
}
