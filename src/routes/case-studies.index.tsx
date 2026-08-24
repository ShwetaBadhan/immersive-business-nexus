import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { SectionBackdrop } from "@/components/site/SectionBackdrop";
import { Overlay, ScrollHint, SectionMarker, SplitHeading, Telemetry } from "@/components/site/ui";
import { CATEGORIES, PROJECTS } from "@/lib/site-data";
import { ProjectsVisual, useActiveIndex } from "@/components/site/Visual3D";
import { cursorProps } from "@/components/experience/Cursor";
import { playCue } from "@/lib/audio";

const TITLE = "Case Studies — Selected Work | 239";
const DESC =
  "An interactive 3D gallery of brand transformations, digital experiences, growth strategy and creative work by 239.";

export const Route = createFileRoute("/case-studies/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: CaseStudies,
});

function CaseStudies() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");
  const list = useMemo(
    () => (filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter],
  );
  const { activeRef, active, set } = useActiveIndex();
  useReveal([filter]);

  return (
    <>
      <Telemetry tag="239 / Case studies" />
      <Overlay>
        <section className="relative flex min-h-svh flex-col justify-end overflow-hidden px-5 pb-16 pt-32 md:px-10 md:pb-20">
          <SectionBackdrop label="Work" />
          <SectionMarker index="—" title="Selected work" />
          <SplitHeading text="Work that moved something." className="display-xl max-w-[14ch] text-foreground" />
          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-[44ch] text-sm leading-relaxed text-muted-foreground" data-reveal data-reveal-delay={380}>
              Brand transformations, digital platforms and growth programmes. Filter the index below, then open a case study.
            </p>
            <ScrollHint text="Read the index" />
          </div>
        </section>

        <section className="relative min-h-svh px-5 py-32 md:px-10">
          {/* one quiet project environment behind the whole index */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <ProjectsVisual activeRef={activeRef} />
          </div>
          <div className="relative mx-auto max-w-6xl">
            <div className="mb-12 flex flex-wrap items-center gap-x-6 gap-y-3" data-no-drag>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  {...cursorProps(c)}
                  onClick={() => {
                    setFilter(c);
                    playCue("click");
                  }}
                  className="link-underline pointer-events-auto label transition-colors duration-500"
                  style={{
                    color: filter === c ? "var(--color-glow)" : undefined,
                    textShadow: filter === c ? "var(--glow-hard)" : "none",
                  }}
                >
                  {c}
                  <sup className="ml-1 !text-[0.5rem]">
                    {c === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.category === c).length}
                  </sup>
                </button>
              ))}
            </div>

            <ul className="border-t border-border">
              {list.map((p, i) => (
                <li key={p.slug} data-reveal data-reveal-delay={i * 80}>
                  <Link
                    to="/case-studies/$slug"
                    params={{ slug: p.slug }}
                    {...cursorProps("Open")}
                    onPointerEnter={() => {
                      cursorProps("Open").onPointerEnter();
                      playCue("hover");
                      set(i);
                    }}
                    onPointerLeave={() => {
                      cursorProps().onPointerLeave();
                      set(-1);
                    }}
                    onClick={() => playCue("open")}
                    className="pointer-events-auto group grid grid-cols-12 items-baseline gap-4 border-b border-border py-7 transition-[transform,opacity,background-color] duration-500 ease-out md:py-9"
                    style={{
                      transform: active === i ? "translateZ(0) scale(1.008)" : undefined,
                      opacity: active === -1 || active === i ? 1 : 0.45,
                    }}
                  >
                    <span className="col-span-2 font-mono text-[0.6rem] text-neon md:col-span-1">{p.index}</span>
                    <span className="display-md col-span-10 text-foreground transition-all duration-700 ease-out group-hover:translate-x-2 group-hover:text-glow md:col-span-5">
                      {p.title}
                    </span>
                    <span className="col-span-12 text-xs leading-relaxed text-muted-foreground md:col-span-4">
                      {p.kicker}
                    </span>
                    <span className="label col-span-6 md:col-span-1">{p.category}</span>
                    <span className="label col-span-6 text-right md:col-span-1">{p.year}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {list.length === 0 && (
              <p className="label mt-10">No projects in this category yet.</p>
            )}
          </div>
        </section>
      </Overlay>
    </>
  );
}
