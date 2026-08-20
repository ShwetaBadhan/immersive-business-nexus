import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { Action, Overlay, SectionMarker, SplitHeading, Telemetry } from "@/components/site/ui";
import { getProject, nextProject } from "@/lib/site-data";
import { cursorProps } from "@/components/experience/Cursor";

export const Route = createFileRoute("/case-studies/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Case study not found — 239" }, { name: "robots", content: "noindex" }],
      };
    }
    const { project } = loaderData;
    const title = `${project.title} — ${project.client} | 239 Case Study`;
    const description = project.kicker;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  notFoundComponent: ProjectNotFound,
  component: CaseStudy,
});

function ProjectNotFound() {
  return (
    <Overlay className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <h1 className="display-lg text-foreground">Project not found</h1>
      <div className="mt-10">
        <Action to="/case-studies" label="Back">
          All case studies
        </Action>
      </div>
    </Overlay>
  );
}

function CaseStudy() {
  const { project } = Route.useLoaderData();
  const next = nextProject(project.slug);
  useReveal([project.slug]);

  const overview = [
    { k: "Client", v: project.client },
    { k: "Industry", v: project.industry },
    { k: "Services", v: project.services.join(", ") },
    { k: "Year", v: project.year },
  ];

  const chapters = [
    { n: "01", t: "The challenge", b: project.challenge },
    { n: "02", t: "The approach", b: project.approach },
    { n: "03", t: "The solution", b: project.solution },
  ];

  return (
    <>
      <Telemetry tag={`239 / ${project.index}`} />
      <Overlay>
        <section className="flex min-h-svh flex-col justify-end px-5 pb-16 pt-32 md:px-10 md:pb-20">
          <SectionMarker index={project.index} title={project.category} />
          <SplitHeading text={project.title} className="display-xl max-w-[14ch] text-foreground" />
          <p className="mt-8 max-w-[46ch] text-sm leading-relaxed text-muted-foreground md:text-base" data-reveal data-reveal-delay={420}>
            {project.kicker}
          </p>
        </section>

        <section className="px-5 py-24 md:px-10">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 border-t border-border pt-10 md:grid-cols-4">
            {overview.map((o, i) => (
              <div key={o.k} data-reveal data-reveal-delay={i * 90}>
                <span className="label">{o.k}</span>
                <p className="mt-3 text-sm text-foreground">{o.v}</p>
              </div>
            ))}
          </div>
        </section>

        {chapters.map((c) => (
          <section key={c.n} className="min-h-[70svh] px-5 py-24 md:px-10">
            <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <SectionMarker index={c.n} title={c.t} />
              </div>
              <p
                className="text-base leading-relaxed text-muted-foreground md:col-span-7 md:text-xl md:leading-relaxed"
                data-reveal
                data-reveal-delay={120}
              >
                {c.b}
              </p>
            </div>
          </section>
        ))}

        <section className="min-h-svh px-5 py-24 md:px-10">
          <div className="mx-auto max-w-6xl">
            <SectionMarker index="04" title="Results" />
            <div className="grid gap-10 border-t border-border pt-12 md:grid-cols-3">
              {project.results.map((r, i) => (
                <div key={r.label} data-reveal data-reveal-delay={i * 140}>
                  <div
                    className="font-display text-6xl leading-none text-glow md:text-8xl"
                    style={{ textShadow: "var(--glow-soft)" }}
                  >
                    {r.value}
                  </div>
                  <p className="label mt-5">{r.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-svh flex-col justify-center px-5 py-24 md:px-10">
          <div className="mx-auto w-full max-w-6xl">
            <span className="label">Next project</span>
            <Link
              to="/case-studies/$slug"
              params={{ slug: next.slug }}
              {...cursorProps("Open")}
              className="pointer-events-auto group mt-6 block border-t border-border pt-8"
            >
              <h2 className="display-xl text-foreground transition-all duration-700 ease-out group-hover:translate-x-3 group-hover:text-glow">
                {next.title}
              </h2>
              <p className="mt-6 max-w-[40ch] text-xs text-muted-foreground">{next.kicker}</p>
            </Link>
            <div className="mt-16 flex flex-wrap gap-5">
              <Action to="/case-studies" label="Index">
                All case studies
              </Action>
              <Action to="/contact" label="Talk">
                Start a project
              </Action>
            </div>
          </div>
        </section>
      </Overlay>
    </>
  );
}
