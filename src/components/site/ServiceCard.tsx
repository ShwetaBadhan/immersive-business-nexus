import { Link } from "@tanstack/react-router";
import { cursorProps } from "@/components/experience/Cursor";
import { playCue } from "@/lib/audio";
import { SERVICE_IMAGES } from "@/lib/service-images";
import type { Service } from "@/lib/site-data";

/** Editorial service card — links straight to the service detail page. */
export function ServiceCard({ service, delay = 0 }: { service: Service; delay?: number }) {
  const image = SERVICE_IMAGES[service.id];

  return (
    <Link
      to="/services/$serviceId"
      params={{ serviceId: service.id }}
      {...cursorProps("View")}
      onPointerEnter={() => {
        cursorProps("View").onPointerEnter();
        playCue("hover");
      }}
      onPointerLeave={() => cursorProps().onPointerLeave()}
      onClick={() => playCue("click")}
      className="pointer-events-auto group flex flex-col border-t border-border pt-6 transition-colors duration-700 hover:border-neon"
      data-reveal
      data-reveal-delay={delay}
    >
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[0.62rem] tracking-[0.2em] text-neon">{service.index}</span>
        <span className="label opacity-0 transition-opacity duration-500 group-hover:opacity-100">View →</span>
      </div>

      <div className="mt-6 overflow-hidden bg-muted/40">
        {image && (
          <img
            src={image}
            alt={service.title}
            loading="lazy"
            width={1200}
            height={900}
            className="aspect-[4/3] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
          />
        )}
      </div>

      <h3 className="display-md mt-7 text-foreground transition-colors duration-700 group-hover:text-glow">
        {service.title}
      </h3>
      <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">{service.short}</p>
    </Link>
  );
}
