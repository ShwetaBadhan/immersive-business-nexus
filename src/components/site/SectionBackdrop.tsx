/**
 * Quiet page-header backdrop shared by the inner pages: a soft light wash,
 * thin green structural lines and a fine grain — the same visual language as
 * the home hero, dialled far down so content stays the focus.
 * Purely presentational and pointer-transparent.
 */
export function SectionBackdrop({ label }: { label?: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 68% 22%, oklch(0.97 0.03 158 / 42%), transparent 70%)",
        }}
      />
      <span className="absolute left-[16%] top-0 h-full w-px bg-neon/12" />
      <span className="absolute left-[58%] top-0 h-full w-px bg-neon/[0.09]" />
      <span className="absolute left-[86%] top-0 h-full w-px bg-neon/12" />
      <span className="absolute left-0 top-[38%] h-px w-full bg-foreground/[0.06]" />
      <span className="absolute left-[58%] top-[38%] h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/40" />

      {label && (
        <span className="absolute -right-2 bottom-6 select-none font-display text-[22vw] leading-none text-foreground/[0.035] md:text-[14vw]">
          {label}
        </span>
      )}

      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24"
        style={{ background: "linear-gradient(to bottom, transparent, var(--color-background))" }}
      />
    </div>
  );
}
