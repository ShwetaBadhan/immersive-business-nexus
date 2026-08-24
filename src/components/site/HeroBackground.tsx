/**
 * Hero atmosphere overlay.
 *
 * The environment itself is WebGL (see HeroEnvironment) — this layer only adds
 * the cinematic finish: a soft legibility veil behind the typography, a warm
 * top light, and a fine film grain. No parallax happens here.
 */
export function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 isolate z-0 overflow-hidden">
      {/* legibility veil — keeps the centred headline sharp over the 3D world */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(52% 46% at 50% 48%, color-mix(in oklab, var(--background) 82%, transparent) 0%, color-mix(in oklab, var(--background) 52%, transparent) 46%, color-mix(in oklab, var(--background) 10%, transparent) 76%, transparent 100%)",
        }}
      />
      {/* atmospheric top light + grounded base */}
      <div
        className="absolute inset-x-0 top-0 h-48"
        style={{ background: "linear-gradient(to bottom, color-mix(in oklab, var(--background) 88%, transparent), transparent)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to top, color-mix(in oklab, var(--background) 90%, transparent), transparent)" }}
      />
      {/* film grain */}
      <div
        className="absolute inset-0 opacity-[0.055] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "140px 140px",
        }}
      />
    </div>
  );
}
