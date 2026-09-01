/**
 * Thin editorial connector arrow used between the hero statistics.
 * A hairline rule with a slow flowing highlight and a fine chevron head —
 * it reads as part of the type system rather than an HTML glyph.
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
      className="flow-arrow flex shrink-0 items-center justify-center"
      style={{
        transform: vertical ? "rotate(90deg)" : undefined,
        animationDelay: `${delay}ms`,
      }}
    >
      <svg
        width="46"
        height="8"
        viewBox="0 0 46 8"
        fill="none"
        className="overflow-visible"
      >
        <line x1="0" y1="4" x2="38" y2="4" stroke="currentColor" strokeWidth="1" opacity="0.28" />
        <line
          x1="0"
          y1="4"
          x2="38"
          y2="4"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="9 29"
          className="flow-arrow-dash"
          style={{ animationDelay: `${delay}ms` }}
        />
        <path
          d="M34.5 0.9 L38.6 4 L34.5 7.1"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.55"
        />
      </svg>
    </span>
  );
}
