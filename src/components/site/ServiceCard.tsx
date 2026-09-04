import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ServiceGlyphVisual } from "@/components/site/Visual3D";
import type { GlyphKind } from "@/components/three/visuals";
import { cursorProps } from "@/components/experience/Cursor";
import { playCue } from "@/lib/audio";
import { SERVICE_IMAGES } from "@/lib/service-images";
import type { Service } from "@/lib/site-data";

/**
 * Compact, clearly bounded service card: own surface, border, soft shadow and
 * a distinct image area. Hover is intentionally minimal — a border tint, a
 * whisper of lift and a slow image scale.
 */
export function ServiceCard({ service, delay = 0 }: { service: Service; delay?: number }) {
  const image = SERVICE_IMAGES[service.id];
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to="/services/$serviceId"
      params={{ serviceId: service.id }}
      {...cursorProps("View")}
      onPointerEnter={() => {
        cursorProps("View").onPointerEnter();
        playCue("hover");
        setHovered(true);
      }}
      onPointerLeave={() => {
        cursorProps().onPointerLeave();
        setHovered(false);
      }}
      onClick={() => playCue("click")}
      className="pointer-events-auto group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-[0_1px_2px_oklch(0.23_0.03_165/6%)] transition-[border-color,box-shadow,transform] duration-500 ease-out hover:-translate-y-0.5 hover:border-neon/45 hover:shadow-[var(--glow-soft)]"
      data-reveal
      data-reveal-delay={delay}
    >
      <div className="relative overflow-hidden border-b border-border bg-muted/40">
        {image && (
          <img
            src={image}
            alt={service.title}
            loading="lazy"
            width={1200}
            height={900}
            className="aspect-[16/10] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03] dark:brightness-[0.78] dark:contrast-[1.05] dark:saturate-[0.9]"
          />
        )}
        {/* 3D practice glyph — same materials and light as the rest of the site */}
        <div className="absolute right-2.5 top-2.5 h-[78px] w-[78px] md:h-[92px] md:w-[92px]">
          <ServiceGlyphVisual kind={service.id as GlyphKind} hovered={hovered} />
        </div>
        <span className="absolute left-3 top-3 rounded-sm bg-background/85 px-2 py-1 font-mono text-[0.58rem] tracking-[0.2em] text-neon backdrop-blur-sm">
          {service.index}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="font-display text-[1.05rem] uppercase leading-tight tracking-tight text-foreground transition-colors duration-500 group-hover:text-glow md:text-[1.2rem]">
          {service.title}
        </h3>
        <p className="mt-2.5 text-[0.8rem] leading-relaxed text-muted-foreground">{service.short}</p>
        <span className="label mt-5 inline-flex items-center gap-2 !tracking-[0.18em] text-muted-foreground transition-colors duration-500 group-hover:!text-glow">
          View practice
          <span className="h-px w-5 bg-current transition-all duration-500 group-hover:w-8" />
        </span>
      </div>
    </Link>
  );
}
