import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { Action, Overlay, ScrollHint, SectionMarker, SplitHeading } from "@/components/site/ui";
import { SERVICES } from "@/lib/site-data";
import { ServiceCard } from "@/components/site/ServiceCard";

const TITLE = "Services — Strategy, Brand, Digital & Growth | 239";
const DESC =
  "Business development, brand strategy, digital experiences, creative solutions, growth strategy and digital transformation from 239.";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Services,
});

function Services() {
  useReveal();

  return (
    <Overlay>
      <section className="flex min-h-[70svh] flex-col justify-end px-5 pb-16 pt-32 md:px-10 md:pb-20">
        <SectionMarker index="—" title="Services" />
        <SplitHeading text="Six ways we move business." className="display-xl max-w-[14ch] text-foreground" />
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[46ch] text-sm leading-relaxed text-muted-foreground" data-reveal data-reveal-delay={400}>
            Business thinking and creative execution, offered as six focused practices. Each one can stand
            alone — most of our work combines two or three.
          </p>
          <ScrollHint text="Scroll the practices" />
        </div>
      </section>

      <section className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.id} service={s} delay={i * 80} />
          ))}
        </div>
      </section>

      <section className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <SectionMarker index="02" title="How we engage" />
          <div className="grid gap-10 md:grid-cols-3">
            {[
              { t: "Sprint", d: "Two to four weeks. One sharp question answered with evidence and a direction." },
              { t: "Build", d: "Six to twelve weeks. Brand, platform or campaign designed and shipped." },
              { t: "Partner", d: "Ongoing. Embedded growth, iteration and business development." },
            ].map((m, i) => (
              <div key={m.t} className="border-t border-border pt-6" data-reveal data-reveal-delay={i * 120}>
                <h3 className="display-md text-foreground">{m.t}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-20" data-reveal>
            <Action to="/contact" label="Brief us">
              Brief us on your challenge
            </Action>
          </div>
        </div>
      </section>
    </Overlay>
  );
}
