import { createFileRoute, notFound } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { Action, Overlay, SectionMarker, SplitHeading } from "@/components/site/ui";
import { SERVICES, getService } from "@/lib/site-data";
import { SERVICE_IMAGES } from "@/lib/service-images";
import { ServiceCard } from "@/components/site/ServiceCard";

export const Route = createFileRoute("/services/$serviceId")({
  loader: ({ params }) => {
    const service = getService(params.serviceId);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Service unavailable — 239" }, { name: "robots", content: "noindex" }] };
    }
    const { service } = loaderData;
    const title = `${service.title} — 239 The Business Developer LLP`;
    return {
      meta: [
        { title },
        { name: "description", content: service.lede },
        { property: "og:title", content: title },
        { property: "og:description", content: service.lede },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ServiceNotFound,
  component: ServiceDetail,
});

function ServiceNotFound() {
  return (
    <Overlay>
      <section className="flex min-h-svh flex-col items-center justify-center gap-8 px-5 text-center">
        <h1 className="display-lg text-foreground">Service not found</h1>
        <Action to="/services" label="Services">
          All services
        </Action>
      </section>
    </Overlay>
  );
}

function ServiceDetail() {
  useReveal();
  const { service } = Route.useLoaderData();
  const image = SERVICE_IMAGES[service.id];
  const related = SERVICES.filter((s) => s.id !== service.id).slice(0, 3);

  return (
    <Overlay>
      <article className="px-5 pb-24 pt-32 md:px-10">
        <header className="mx-auto max-w-5xl">
          <SectionMarker index={service.index} title="Service" />
          <SplitHeading text={service.title} className="display-xl max-w-[16ch] text-foreground" />
          <p
            className="mt-10 max-w-[54ch] text-base leading-relaxed text-muted-foreground md:text-lg"
            data-reveal
            data-reveal-delay={360}
          >
            {service.lede}
          </p>
        </header>

        {image && (
          <div className="mx-auto mt-16 max-w-6xl overflow-hidden" data-reveal>
            <img
              src={image}
              alt={service.title}
              width={1200}
              height={900}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        )}

        <section className="mx-auto mt-24 grid max-w-5xl gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="label">Overview</span>
          </div>
          <div className="md:col-span-7">
            <p className="text-base leading-relaxed text-foreground md:text-lg" data-reveal>
              {service.body}
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground" data-reveal data-reveal-delay={120}>
              We work as a small senior team, close to the decision-makers, with a bias for shipping. No
              layers, no theatre — evidence, a clear direction and work that holds up in the market.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-24 grid max-w-5xl gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="label">Capabilities</span>
          </div>
          <ul className="md:col-span-7">
            {service.capabilities.map((c, i) => (
              <li
                key={c}
                className="border-b border-border py-5 text-sm text-foreground md:text-base"
                data-reveal
                data-reveal-delay={i * 70}
              >
                {c}
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto mt-24 max-w-5xl">
          <SectionMarker index="—" title="Process" />
          <div className="grid gap-12 md:grid-cols-3">
            {service.process.map((p, i) => (
              <div key={p.step} className="border-t border-border pt-6" data-reveal data-reveal-delay={i * 120}>
                <span className="font-mono text-[0.62rem] tracking-[0.2em] text-neon">{p.step}</span>
                <h3 className="display-md mt-4 text-foreground">{p.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-32 max-w-5xl border-t border-border pt-16 text-center">
          <SplitHeading
            as="h2"
            text="Let's put this to work on your business."
            className="display-lg mx-auto max-w-[22ch] text-foreground"
          />
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6" data-reveal data-reveal-delay={280}>
            <Action to="/contact" label="Start">
              Start a conversation
            </Action>
            <Action to="/case-studies" label="Work">
              See related work
            </Action>
          </div>
        </section>

        <section className="mx-auto mt-32 max-w-6xl">
          <SectionMarker index="—" title="Other services" />
          <div className="grid gap-x-10 gap-y-14 md:grid-cols-3">
            {related.map((s, i) => (
              <ServiceCard key={s.id} service={s} delay={i * 90} />
            ))}
          </div>
        </section>
      </article>
    </Overlay>
  );
}
