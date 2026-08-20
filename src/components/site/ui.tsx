import { Link } from "@tanstack/react-router";
import { useRef, type ReactNode } from "react";
import { cursorProps } from "@/components/experience/Cursor";
import { playCue } from "@/lib/audio";
import { cn } from "@/lib/utils";

/** Overlay page shell: HTML floats above the 3D world without blocking it. */
export function Overlay({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main className={cn("pointer-events-none relative z-10", className)}>{children}</main>
  );
}

export function SectionMarker({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-8 flex items-center gap-4" data-reveal>
      <span className="font-mono text-[0.6rem] tracking-[0.3em] text-glow">{index}</span>
      <span className="h-px w-10 bg-neon/60" />
      <span className="label">{title}</span>
    </div>
  );
}

/** Magnetic, glowing primary action. */
export function Action({
  children,
  to,
  href,
  onClick,
  label,
  type,
  className,
}: {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  label?: string;
  type?: "submit" | "button";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  const magnet = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    el.style.transform = `translate(${dx * 12}px, ${dy * 8}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
    cursorProps().onPointerLeave();
  };

  const inner = (
    <span className="relative flex items-center gap-3 overflow-hidden">
      <span className="label !text-[0.65rem] !text-foreground transition-colors duration-500 group-hover:!text-glow">
        {children}
      </span>
      <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5 text-glow">
        →
      </span>
    </span>
  );

  const shared = cn(
    "group pointer-events-auto inline-flex items-center border border-border px-7 py-4 transition-[border-color,box-shadow,transform] duration-500 ease-out hover:border-neon",
    className,
  );
  const glowStyle = { boxShadow: "none" } as const;

  const handlers = {
    onPointerMove: magnet,
    onPointerEnter: () => {
      cursorProps(label ?? "Open").onPointerEnter();
      playCue("hover");
    },
    onPointerLeave: reset,
    onClick: () => {
      playCue("click");
      onClick?.();
    },
  };

  if (to) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        to={to}
        className={shared}
        style={glowStyle}
        {...handlers}
      >
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={shared} {...handlers}>
        {inner}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type ?? "button"}
      className={shared}
      {...handlers}
    >
      {inner}
    </button>
  );
}

/** Word-by-word editorial reveal for large statements. */
export function SplitHeading({
  text,
  className,
  delay = 0,
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const words = text.split(" ");
  return (
    <Tag className={className}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span
            className="inline-block"
            data-reveal
            data-reveal-delay={delay + i * 70}
            style={{ paddingRight: "0.22em" }}
          >
            {w}
          </span>
        </span>
      ))}
    </Tag>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-6">
      <div className="marquee-track flex w-max gap-10">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="display-md whitespace-nowrap text-muted-foreground/70">{t}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-neon" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Faint spatial telemetry — coordinates, markers, numbers 2/3/9. */
export function Telemetry({ tag }: { tag: string }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-10 hidden md:block">
      <span className="label absolute left-10 top-1/2 -rotate-90 origin-left tracking-[0.5em]">{tag}</span>
      <span className="label absolute right-10 top-1/2 rotate-90 origin-right tracking-[0.5em]">
        23°N / 09°E
      </span>
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-6">
        {["2", "3", "9"].map((n) => (
          <span key={n} className="font-mono text-[0.6rem] text-neon/50">
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ScrollHint({ text = "Scroll to explore" }: { text?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="label">{text}</span>
      <span className="relative block h-8 w-px bg-border">
        <span className="absolute inset-x-0 top-0 h-3 bg-neon pulse-dot" />
      </span>
    </div>
  );
}
