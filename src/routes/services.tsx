import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { Action, Overlay, ScrollHint, SectionMarker, SplitHeading, Telemetry } from "@/components/site/ui";
import { SERVICES } from "@/lib/site-data";
import { setWorld, useWorld } from "@/lib/world-store";
import { cursorProps } from "@/components/experience/Cursor";
import { playCue } from "@/lib/audio";

const TITLE = "Services — Strategy, Brand, Digital & Growth | 239";
const DESC =
  "Business development, brand strategy, digital experiences, creative solutions, growth strategy and digital transformation from 239.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Services,
});

function Services() {
  useReveal();
  const focus = useWorld((s) => s.focus);
  const active = focus >= 0 ? SERVICES[focus] : undefined;

  return (
    <>
      <Telemetry tag="239 / Services" />
      <Overlay>
        <section className="flex min-h-svh flex-col justify-end px-5 pb-16 pt-32 md:px-10 md:pb-20">
          <SectionMarker index="—" title="Service universe" />
          <SplitHeading text="Six ways we move business." className="display-xl max-w-[14ch] text-foreground" />
          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-[46ch] text-sm leading-relaxed text-muted-foreground" data-reveal data-reveal-delay={400}>
              Every service exists as an object in the 239 universe. Drag to orbit it, hover to illuminate it,
              click to move the camera in.
            </p>
            <ScrollHint text="Or scroll the index" />
          </div>
        </section>

        <section className="min-h-svh px-5 py-32 md:px-10">
          <div className="mx-auto max-w-6xl">
            <SectionMarker index="01" title="The index" />
            <ul className="border-t border-border">
              {SERVICES.map((s, i) => (
                <li key={s.id} data-reveal data-reveal-delay={i * 70}>
                  <button
                    {...cursorProps(focus === i ? "Close" : "Explore")}
                    onPointerEnter={() => {
                      cursorProps(focus === i ? "Close" : "Explore").onPointerEnter();
                      playCue("hover");
                    }}
                    onClick={() => {
                      setWorld({ focus: focus === i ? -1 : i });
                      playCue("open");
                    }}
                    className="pointer-events-auto group flex w-full items-baseline gap-5 border-b border-border py-6 text-left md:gap-10 md:py-8"
                  >
                    <span className="font-mono text-[0.6rem] text-neon">{s.index}</span>
                    <span
                      className="display-md flex-1 transition-all duration-700 ease-out group-hover:translate-x-2"
                      style={{ color: focus === i ? "var(--color-glow)" : undefined }}
                    >
                      {s.title}
                    </span>
                    <span className="hidden max-w-[34ch] text-xs text-muted-foreground md:block">{s.body}</span>
                    <span className="label whitespace-nowrap opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100">
                      Explore service →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="flex min-h-svh flex-col justify-center px-5 py-32 md:px-10">
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
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{m.d}</p>
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

      {/* editorial overlay revealed when a 3D service object is focused */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-5 pb-14 md:px-10"
        style={{
          opacity: active ? 1 : 0,
          transform: active ? "none" : "translateY(2rem)",
          transition: "all 900ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {active && (
          <div
            className="pointer-events-auto mx-auto max-w-6xl border-t border-neon/40 pt-8 backdrop-blur-md"
            data-no-drag
          >
            <div className="flex items-start justify-between gap-8">
              <div>
                <span className="label !text-glow">Service {active.index}</span>
                <h2 className="display-lg mt-3 max-w-[16ch] text-foreground">{active.title}</h2>
                <p className="mt-5 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">{active.body}</p>
              </div>
              <button
                {...cursorProps("Close")}
                onClick={() => setWorld({ focus: -1 })}
                className="label shrink-0 !text-glow"
              >
                Close ×
              </button>
            </div>
            <div className="mt-8">
              <Action to="/contact" label="Enquire">
                Explore service
              </Action>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
