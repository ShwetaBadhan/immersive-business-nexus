import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Action, Overlay } from "@/components/site/ui";
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
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
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

/** Editorial case-study reader: quiet motion, strong type, content first. */
function CaseStudy() {
  const { project } = Route.useLoaderData();
  const next = nextProject(project.slug);

  const overview = [
    { k: "Client", v: project.client },
    { k: "Industry", v: project.industry },
    { k: "Services", v: project.services.join(", ") },
    { k: "Year", v: project.year },
  ];

  const chapters = [
  { n: "01", t: "The challenge", b: project.challenge },
  { n: "02", t: "The approach", b: project.approach },
];

  return (
    <Overlay>
      <article className="pointer-events-auto mx-auto mb-0 mt-24 max-w-5xl border border-border bg-card/90 backdrop-blur-xl md:mt-28">
        {/* header */}
        <header className="px-6 pb-14 pt-16 md:px-14 md:pb-20 md:pt-24">
          <div className="flex flex-wrap items-center gap-4">
            <span className="label !text-glow">{project.index}</span>
            <span className="h-px w-8 bg-border" />
            <span className="label">{project.category}</span>
          </div>
          <h1
            className="display-lg mt-8 max-w-[18ch] text-foreground"
          >
            {project.title}
          </h1>
          <p
            className="mt-8 max-w-[54ch] text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {project.kicker}
          </p>
        </header>

        {/* large visual */}
        <div
          className="mx-6 h-[42svh] border border-border md:mx-14 md:h-[52svh]"
          style={{
            background: `linear-gradient(135deg,
              oklch(0.9445 0.0132 152.3),
              oklch(0.8358 0.0281 158.2) 55%,
              oklch(0.6248 0.1268 157.8 / 55%))`,
          }}
        >
          <div className="flex h-full items-end justify-between p-6 md:p-10">
            <span className="font-display text-6xl uppercase leading-none tracking-[-0.05em] text-foreground/70 md:text-8xl">
              239
            </span>
            <span className="label">{project.client}</span>
          </div>
        </div>

        {/* overview */}
        <section className="px-6 py-16 md:px-14 md:py-20">
          <div className="grid grid-cols-2 gap-8 border-t border-border pt-10 md:grid-cols-4">
            {overview.map((o) => (
              <div key={o.k}>
                <span className="label">{o.k}</span>
                <p className="mt-3 text-sm leading-relaxed text-foreground">{o.v}</p>
              </div>
            ))}
          </div>
        </section>

       {/* chapters */}
<div className="px-6 md:px-14">
  {chapters.map((c) => (
    <section
      key={c.n}
      className="grid gap-6 border-t border-border py-14 md:grid-cols-12 md:gap-10"
    >
      <div className="md:col-span-4">
        <span className="label !text-glow">{c.n}</span>
        <h2 className="display-md mt-4 text-foreground">{c.t}</h2>
      </div>

      <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground md:col-span-8 md:text-lg md:leading-relaxed">
        {c.b}
      </p>
    </section>
  ))}
</div>

{/* results */}
<section className="px-6 pb-16 md:px-14 md:pb-20">
  <div className="border-t border-border pt-12">
    <span className="label">03 — Results</span>

    <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
      {project.results.map((r) => (
        <div key={r.label} className="min-w-0">
          <div className="font-display text-4xl leading-[0.95] tracking-[-0.04em] text-glow sm:text-5xl md:text-[3.5rem] lg:text-[4rem]">
            {r.value}
          </div>

          <p className="label mt-4 max-w-[24ch] leading-relaxed">
            {r.label}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* impact */}
<section className="px-6 md:px-14">
  <section className="grid gap-6 border-t border-border py-14 md:grid-cols-12 md:gap-10">
    <div className="md:col-span-4">
      <span className="label !text-glow">04</span>
      <h2 className="display-md mt-4 text-foreground">
        Our impact
      </h2>
    </div>

    <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground md:col-span-8 md:text-lg md:leading-relaxed">
      {project.impact}
    </p>
  </section>
</section>

        {/* next */}
        <section className="border-t border-border px-6 py-14 md:px-14 md:py-16">
          <span className="label">Next project</span>
          <Link
            to="/case-studies/$slug"
            params={{ slug: next.slug }}
            {...cursorProps("Open")}
            className="group mt-6 block"
          >
            <h2 className="display-md text-foreground transition-colors duration-500 group-hover:text-glow">
              {next.title}
            </h2>
            <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
              {next.kicker}
            </p>
          </Link>
          <div className="mt-12 flex flex-wrap gap-5">
            <Action to="/case-studies" label="Index">
              All case studies
            </Action>
            <Action to="/contact" label="Talk">
              Start a project
            </Action>
          </div>
        </section>
      </article>
    </Overlay>
  );
}
