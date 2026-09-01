import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { Action, Marquee, Overlay, ScrollHint, SectionMarker, SplitHeading, Telemetry } from "@/components/site/ui";
import { ServiceCard } from "@/components/site/ServiceCard";
import { HeroBackdrop } from "@/components/site/HeroBackdrop";
import { FlowArrow, FlowReturnArrow } from "@/components/site/FlowArrow";
import { ScrollScene } from "@/components/site/ScrollScene";


import { HOME_DISCIPLINES, PROJECTS, SERVICES } from "@/lib/site-data";

import { cursorProps } from "@/components/experience/Cursor";
import { Link } from "@tanstack/react-router";
import { playCue } from "@/lib/audio";

const HERO_STATS = [
  { k: "Practices", v: "Thirteen" },
  { k: "Growth Ecosystem", v: "360*" },
  { k: "Years of momentum", v: "Ten" },
  { k: "Based in", v: "India" },
];

function StatBlock({ s }: { s: typeof HERO_STATS[0] }) {
  return (
    <div className="flex flex-col gap-2 text-center sm:text-left">
      <span className="font-display text-lg leading-none text-foreground md:text-2xl">{s.v}</span>
      <span className="label !tracking-[0.18em]">{s.k}</span>
    </div>
  );
}

const TITLE = "239 The Business Developer LLP — Build What Moves Business Forward";
const DESC =
  "239 The Business Developer LLP creates strategic, digital and creative solutions that help ambitious businesses grow, connect and stand apart.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Home,
});

function Home() {
  useReveal();

  return (
    <>
      <Telemetry tag="239 / Home" />
      <Overlay>
        {/* 01 — HERO */}
        <section className="relative flex min-h-svh flex-col justify-between overflow-hidden px-5 pb-10 pt-28 md:px-10 md:pb-12 md:pt-32">
          <HeroBackdrop />

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2" data-reveal>
              <span className="font-mono text-[0.6rem] tracking-[0.3em] text-glow">01</span>
              <span className="h-px w-10 bg-neon/60" />
              <span className="label whitespace-nowrap !text-[0.6rem] md:!text-[0.65rem]">Research × Strategize × Execute × Scale</span>
            </div>

            <SplitHeading
              text="Build what moves"
              className="display-xl text-foreground !text-[clamp(2.4rem,6vw,5.4rem)]"
            />
            <SplitHeading
              text="business forward."
              className="display-xl text-foreground !text-[clamp(2.4rem,6vw,5.4rem)]"
            />

            <p
              className="mt-8 max-w-[48ch] text-sm leading-relaxed text-muted-foreground md:text-base"
              data-reveal
              data-reveal-delay={500}
            >
              239 The Business Developers LLP is one of the oldest and most trusted business growth consulting and e-commerce solutions companies, helping brands establish, expand, and scale their business operations across online and offline channels.
            </p>

            <div
              className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6"
              data-reveal
              data-reveal-delay={620}
            >
              <Action to="/about" label="Explore">
                Explore 239
              </Action>
              <ScrollHint />
            </div>
          </div>

          {/* hero footer strip — statistics connected by flowing arrows */}
          <div
            className="relative z-10 mt-10 border-t border-border pt-8"
            data-reveal
            data-reveal-delay={760}
          >
            {/* curved return path: Ten → 360° */}
            <FlowReturnArrow delay={1560} />

            {/* Desktop: arrows as separate flex items so they sit centered in the gaps */}
            <div className="hidden items-center justify-between gap-4 sm:flex">
              {HERO_STATS.map((s, i) => (
                <Fragment key={s.k}>
                  <StatBlock s={s} />
                  {i < HERO_STATS.length - 2 && (
                    <FlowArrow delay={(i + 1) * 520} />
                  )}
                </Fragment>
              ))}
            </div>

            {/* Mobile: keep the existing compact attached layout */}
            <div className="flex flex-col gap-6 sm:hidden">
              {HERO_STATS.map((s, i) => (
                <div key={s.k} className="flex items-center gap-4">
                  {i > 0 && i < HERO_STATS.length - 1 && (
                    <FlowArrow vertical delay={i * 520} />
                  )}
                  <StatBlock s={s} />
                </div>
              ))}
            </div>
          </div>

        </section>


        {/* 02 — INTRODUCTION */}
        <section className="relative min-h-svh px-5 py-32 md:px-10">
          <ScrollScene kind="momentum" />
          <div className="relative z-10 mx-auto max-w-6xl">
            <SectionMarker index="02" title="Introduction" />

            <SplitHeading
              as="h2"
              text="We turn ideas into business momentum."
              className="display-lg max-w-[18ch] text-foreground"
            />
            <div className="mt-16 grid gap-12 md:grid-cols-12">
              <p className="text-sm leading-relaxed text-muted-foreground md:col-span-5 md:col-start-7 md:text-base" data-reveal data-reveal-delay={200}>
                Our approach begins with understanding the client's business, industry, objectives, competition, available resources, and growth potential. We identify the most profitable and sustainable path for growth before recommending any service or investment.
              </p>
            </div>
            <div className="mt-24 grid grid-cols-3 gap-6 border-t border-border pt-10" data-reveal data-reveal-delay={280}>
              {[
                { n: "2", l: "Disciplines fused — business & creative" },
                { n: "3", l: "Continents of client work" },
                { n: "9", l: "Years building momentum" },
              ].map((s) => (
                <div key={s.n}>
                  <div className="font-display text-5xl leading-none text-glow md:text-7xl" style={{ textShadow: "var(--glow-soft)" }}>
                    {s.n}
                  </div>
                  <p className="label mt-4 max-w-[18ch] !tracking-[0.18em]">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 03 — WHAT WE DO */}
        <section className="relative px-5 py-24 md:px-10 md:py-32">
          <ScrollScene kind="practices" />
          <div className="relative z-10 mx-auto max-w-6xl">

            <SectionMarker index="03" title="What we do" />
            <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SplitHeading
                as="h2"
                text="Thirteen practices, one team."
                className="display-lg max-w-[16ch] text-foreground"
              />
              <p className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground" data-reveal data-reveal-delay={220}>
                Each practice stands on its own. Most engagements combine two or three, run by the same senior team.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 md:gap-7 lg:grid-cols-3">
              {SERVICES.map((s, i) => (
                <ServiceCard key={s.id} service={s} delay={i * 80} />
              ))}
            </div>


            {/* approach / value */}
            <div className="mt-32 grid gap-14 border-t border-border pt-16 md:grid-cols-12">
              <div className="md:col-span-5">
                <span className="label">Our approach</span>
                <SplitHeading
                  as="h2"
                  text="Business logic first. Craft always."
                  className="display-md mt-6 max-w-[18ch] text-foreground"
                />
              </div>
              <div className="md:col-span-7">
                <p className="text-base leading-relaxed text-foreground md:text-lg" data-reveal>
                  239 works where commercial strategy and creative execution meet. We start with the maths of the
                  business — where demand sits, what it is worth, what stands in the way — and only then design
                  the brand, product or campaign that moves it.
                </p>
                <p className="mt-6 max-w-[58ch] text-sm leading-relaxed text-muted-foreground" data-reveal data-reveal-delay={140}>
                  Small senior team. Direct access to decision-makers. Evidence over opinion, and work that holds
                  up in the market long after the launch.
                </p>
                <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3">
                  {[
                    { t: "Evidence-led", d: "Interviews, data and category study before direction." },
                    { t: "Senior only", d: "The people who pitch are the people who build." },
                    { t: "Built to last", d: "Systems and playbooks that survive handover." },
                  ].map((v, i) => (
                    <div key={v.t} data-reveal data-reveal-delay={i * 110}>
                      <h3 className="text-sm font-medium text-foreground">{v.t}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{v.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-24">
              <Marquee items={HOME_DISCIPLINES} />
            </div>
          </div>
        </section>


        {/* 04 — SELECTED CASE STUDIES */}
        <section className="relative min-h-svh px-5 py-32 md:px-10">
          <ScrollScene kind="trajectory" />
          <div className="relative z-10 mx-auto max-w-6xl">

            <SectionMarker index="04" title="Selected case studies" />
            <p className="label mb-14 max-w-[40ch]" data-reveal>
              Selected engagements across strategy, brand, digital and growth
            </p>
            <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
              {PROJECTS.slice(0, 4).map((p, i) => (
                <Link
                  key={p.slug}
                  to="/case-studies/$slug"
                  params={{ slug: p.slug }}
                  {...cursorProps("Open")}
                  onClick={() => playCue("open")}
                  className="pointer-events-auto group block"
                  data-reveal
                  data-reveal-delay={i * 90}
                  style={{ marginTop: i % 2 ? "3rem" : 0 }}
                >
                  <div className="flex items-baseline justify-between border-b border-border pb-4">
                    <span className="label !text-glow">Project {p.index}</span>
                    <span className="label">{p.category}</span>
                  </div>
                  <h3 className="display-md mt-5 text-foreground transition-all duration-700 group-hover:translate-x-1.5 group-hover:text-glow">
                    {p.title}
                  </h3>
                  <p className="mt-4 max-w-[38ch] text-xs leading-relaxed text-muted-foreground">{p.kicker}</p>
                </Link>
              ))}
            </div>
            <div className="mt-24" data-reveal>
              <Action to="/case-studies" label="View all">
                All case studies
              </Action>
            </div>
          </div>
        </section>

        {/* 05 — PHILOSOPHY */}
        <section className="relative flex min-h-svh flex-col justify-center px-5 py-32 md:px-10">
          <ScrollScene kind="alignment" />
          <div className="relative z-10 mx-auto w-full max-w-6xl">

            <SectionMarker index="05" title="239 Philosophy" />
            {["Think different.", "Build better.", "Move forward."].map((line, i) => (
              <h2
                key={line}
                className="display-lg text-foreground"
                data-reveal
                data-reveal-delay={i * 220}
                style={{ color: i === 2 ? "var(--color-glow)" : undefined, paddingLeft: `${i * 6}%` }}
              >
                {line}
              </h2>
            ))}
          </div>
        </section>

        {/* 06 — FINAL CTA */}
        <section className="relative flex min-h-svh flex-col items-center justify-center px-5 py-32 text-center md:px-10">
          <ScrollScene kind="arrival" />
          <div className="relative z-10 flex w-full flex-col items-center">
          <SplitHeading
            as="h2"
            text="Let's build something that moves."
            className="display-lg max-w-[20ch] text-foreground"
          />

          <div className="mt-14" data-reveal data-reveal-delay={320}>
            <Action to="/contact" label="Start">
              Start a project
            </Action>
          </div>
          <div className="mt-24 flex w-full max-w-6xl items-center justify-between border-t border-border pt-8">
            <span className="label">239 The Business Developer LLP</span>
            <span className="label">India</span>
          </div>
          </div>
        </section>

      </Overlay>
    </>
  );
}
