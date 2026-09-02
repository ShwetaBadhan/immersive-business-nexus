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
  // the remaining practices *after* this one, in the existing order
  const currentIndex = SERVICES.findIndex((s) => s.id === service.id);
  const related = SERVICES.slice(currentIndex + 1);

  return (
    <Overlay>
      <article className="px-5 pb-16 pt-24 md:px-10 md:pb-24 md:pt-32">
        <header className="mx-auto max-w-5xl">
          <SectionMarker index={service.index} title="Service" />
          <SplitHeading text={service.title} className="display-xl max-w-[16ch] text-foreground" />
          <p
            className="mt-5 max-w-[46ch] text-[0.95rem] leading-relaxed text-muted-foreground md:mt-10 md:max-w-[54ch] md:text-lg"
            data-reveal
            data-reveal-delay={360}
          >
            {service.lede}
          </p>
        </header>

        {image && (
          <div className="mx-auto mt-9 max-w-6xl overflow-hidden rounded-lg md:mt-16 md:rounded-none" data-reveal>
            <img
              src={image}
              alt={service.title}
              width={1200}
              height={900}
              className="aspect-[16/10] w-full object-cover md:aspect-[16/9]"
            />
          </div>
        )}

        <section className="mx-auto mt-14 grid max-w-5xl gap-4 md:mt-24 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-5">
            <span className="label" data-reveal>Overview</span>
          </div>
          <div className="md:col-span-7">
            <p className="text-[0.95rem] leading-relaxed text-foreground md:text-lg" data-reveal>
              {service.body}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:mt-6" data-reveal data-reveal-delay={120}>
              We work as a small senior team, close to the decision-makers, with a bias for shipping. No
              layers, no theatre — evidence, a clear direction and work that holds up in the market.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-14 grid max-w-5xl gap-4 md:mt-24 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-5">
            <span className="label" data-reveal>Capabilities</span>
          </div>
          <ul className="md:col-span-7">
            {service.capabilities.map((c, i) => (
              <li
                key={c}
                className="border-b border-border py-4 text-sm text-foreground md:py-5 md:text-base"
                data-reveal
                data-reveal-delay={i * 70}
              >
                {c}
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto mt-14 max-w-5xl md:mt-24">
          <SectionMarker index="—" title="Process" />
          <div className="grid gap-7 md:grid-cols-3 md:gap-12">
            {service.process.map((p, i) => (
              <div key={p.step} className="border-t border-border pt-5 md:pt-6" data-reveal data-reveal-delay={i * 120}>
                <span className="font-mono text-[0.62rem] tracking-[0.2em] text-neon">{p.step}</span>
                <h3 className="display-md mt-3 text-foreground md:mt-4">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:mt-4">{p.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-5xl border-t border-border pt-10 text-center md:mt-32 md:pt-16">
          <SplitHeading
            as="h2"
            text="Let's put this to work on your business."
            className="display-lg mx-auto max-w-[22ch] text-foreground"
          />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:mt-12 md:gap-6" data-reveal data-reveal-delay={280}>
            <Action to="/contact" label="Start">
              Start a conversation
            </Action>
            <Action to="/case-studies" label="Work">
              See related work
            </Action>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mx-auto mt-16 max-w-6xl md:mt-32">
            <SectionMarker index="—" title="Other services" />

            {/* mobile: tactile swipe rail — 1.2 cards visible */}
            <div className="-mx-5 md:hidden">
              <div className="swipe-rail gap-4 px-5 pb-2">
                {related.map((s, i) => (
                  <div key={s.id} className="min-w-0">
                    <ServiceCard service={s} delay={i * 60} />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 px-1">
                <span className="label !text-[0.5rem]">Swipe</span>
                <span className="h-px flex-1 bg-border" />
                <span className="label !text-[0.5rem]">{related.length} more</span>
              </div>
            </div>

            {/* desktop: unchanged grid */}
            <div className="hidden gap-x-10 gap-y-14 md:grid md:grid-cols-3">
              {related.map((s, i) => (
                <ServiceCard key={s.id} service={s} delay={i * 90} />
              ))}
            </div>
          </section>
        )}
      </article>
    </Overlay>
  );
}

