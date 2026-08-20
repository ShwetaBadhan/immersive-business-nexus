import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { Action, Overlay, ScrollHint, SectionMarker, SplitHeading, Telemetry } from "@/components/site/ui";

const TITLE = "About 239 — We Build Momentum";
const DESC =
  "239 The Business Developer LLP works at the intersection of business, creativity, technology and growth.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: About,
});

const APPROACH = [
  { n: "01", t: "Strategy", d: "We start with the commercial truth — where the opportunity actually is." },
  { n: "02", t: "Creativity", d: "We give that truth a form people remember and repeat." },
  { n: "03", t: "Technology", d: "We build it so it performs in the real world, at real speed." },
  { n: "04", t: "Execution", d: "We ship, measure, and keep the momentum compounding." },
];

const MINDSET = ["Curious", "Bold", "Connected", "Forward-thinking"];

const JOURNEY = [
  { year: "2017", t: "Founded", d: "Two disciplines, one room, a stubborn idea about business and craft." },
  { year: "2019", t: "First transformation", d: "A legacy brand rebuilt from positioning to storefront." },
  { year: "2021", t: "Digital practice", d: "Experience design and engineering brought fully in-house." },
  { year: "2023", t: "Growth systems", d: "Advisory work formalised into repeatable growth engines." },
  { year: "2026", t: "Now", d: "Business development, brand and technology as one continuous practice." },
];

function About() {
  useReveal();

  return (
    <>
      <Telemetry tag="239 / About" />
      <Overlay>
        <section className="flex min-h-svh flex-col justify-end px-5 pb-16 pt-32 md:px-10 md:pb-20">
          <SectionMarker index="—" title="About 239" />
          <SplitHeading text="We build momentum." className="display-xl text-foreground" />
          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground md:text-base" data-reveal data-reveal-delay={400}>
              239 The Business Developer LLP works at the intersection of business, creativity, technology and
              growth. We help businesses transform ideas into meaningful experiences and measurable
              opportunities.
            </p>
            <ScrollHint text="Enter the structure" />
          </div>
        </section>

        <section className="min-h-svh px-5 py-32 md:px-10">
          <div className="mx-auto max-w-6xl">
            <SectionMarker index="01" title="Our approach" />
            <div className="grid gap-px border border-border md:grid-cols-2">
              {APPROACH.map((a, i) => (
                <div
                  key={a.t}
                  className="pointer-events-auto group relative overflow-hidden border-border p-8 transition-colors duration-700 md:p-12"
                  style={{ borderRightWidth: i % 2 === 0 ? 1 : 0, borderBottomWidth: i < 2 ? 1 : 0 }}
                  data-reveal
                  data-reveal-delay={i * 110}
                >
                  <span
                    className="absolute inset-0 -translate-y-full bg-forest/60 transition-transform duration-700 ease-out group-hover:translate-y-0"
                    aria-hidden
                  />
                  <div className="relative">
                    <span className="font-mono text-[0.6rem] text-neon">{a.n}</span>
                    <h3 className="display-md mt-6 text-foreground transition-colors duration-500 group-hover:text-glow">
                      {a.t}
                    </h3>
                    <p className="mt-4 max-w-[34ch] text-xs leading-relaxed text-muted-foreground">{a.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-svh flex-col justify-center px-5 py-32 md:px-10">
          <div className="mx-auto w-full max-w-6xl">
            <SectionMarker index="02" title="Our mindset" />
            {MINDSET.map((m, i) => (
              <h2
                key={m}
                className="display-lg border-b border-border py-4 text-foreground"
                data-reveal
                data-reveal-delay={i * 150}
                style={{ paddingLeft: `${i * 4}%`, color: i === 3 ? "var(--color-glow)" : undefined }}
              >
                {m}
              </h2>
            ))}
          </div>
        </section>

        <section className="min-h-svh px-5 py-32 md:px-10">
          <div className="mx-auto max-w-6xl">
            <SectionMarker index="03" title="The journey" />
            <ol className="relative ml-3 border-l border-neon/25 pl-8 md:ml-6 md:pl-14">
              {JOURNEY.map((j, i) => (
                <li key={j.year} className="relative pb-16 last:pb-0" data-reveal data-reveal-delay={i * 110}>
                  <span
                    className="absolute -left-[41px] top-2 h-2.5 w-2.5 rounded-full bg-neon md:-left-[63px]"
                    style={{ boxShadow: "var(--glow-hard)" }}
                  />
                  <span className="label !text-glow">{j.year}</span>
                  <h3 className="display-md mt-3 text-foreground">{j.t}</h3>
                  <p className="mt-3 max-w-[44ch] text-xs leading-relaxed text-muted-foreground md:text-sm">
                    {j.d}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="flex min-h-svh flex-col items-center justify-center px-5 py-32 text-center md:px-10">
          <SplitHeading as="h2" text="Let's make something move." className="display-lg max-w-[18ch] text-foreground" />
          <div className="mt-14" data-reveal data-reveal-delay={300}>
            <Action to="/contact" label="Talk">
              Start a conversation
            </Action>
          </div>
        </section>
      </Overlay>
    </>
  );
}
