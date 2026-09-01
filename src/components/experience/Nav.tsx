import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { cursorProps } from "./Cursor";
import { live, setWorld, useWorld } from "@/lib/world-store";
import { playCue, setAudioEnabled } from "@/lib/audio";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const entered = useWorld((s) => s.entered);
  const sound = useWorld((s) => s.sound);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleSound = () => {
    const next = !sound;
    setAudioEnabled(next);
    setWorld({ sound: next });
    if (next) playCue("open");
  };

  const glass = scrolled || open;

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 transition-opacity duration-1000"
      style={{ opacity: entered ? 1 : 0 }}
    >
      <div
        className={cn(
          "transition-all duration-300 ease-out",
          glass &&
            "border-b border-border/30 bg-deep/85 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-[16px]"
        )}
      >
        <div className="flex items-start justify-between px-5 py-5 md:px-10 md:py-8">
        <Link
          to="/"
          {...cursorProps("Home")}
          onClick={() => playCue("click")}
          className="pointer-events-auto flex items-baseline gap-2"
        >
          <span
            className="font-display text-2xl leading-none tracking-[-0.06em] text-foreground md:text-3xl"
            style={{ textShadow: "var(--glow-soft)" }}
          >
            239
          </span>
          <span className="label hidden md:inline">The Business Developer LLP</span>
        </Link>

        <nav className="pointer-events-auto hidden items-center gap-10 md:flex">
          {LINKS.map((l) => (
            <NavItem key={l.to} to={l.to} label={l.label} active={isActive(pathname, l.to)} />
          ))}
          <SoundToggle sound={sound} onToggle={toggleSound} />
        </nav>

        <button
          {...cursorProps(open ? "Close" : "Menu")}
          onClick={() => {
            setOpen((v) => !v);
            playCue("click");
          }}
          className="pointer-events-auto flex min-h-11 min-w-11 items-center justify-center md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="relative flex h-3.5 w-[26px] items-center justify-center">
            <span
              className="absolute block bg-foreground transition-all duration-500"
              style={{
                width: 26,
                height: open ? 2 : 1,
                transform: open ? "rotate(45deg)" : "translateY(-3px)",
              }}
            />
            <span
              className="absolute block bg-foreground transition-all duration-500"
              style={{
                width: open ? 26 : 16,
                height: open ? 2 : 1,
                transform: open ? "rotate(-45deg)" : "translateY(3px)",
              }}
            />
          </span>
        </button>
        </div>
      </div>

      {/* mobile sheet */}
      <div
        className="pointer-events-auto fixed inset-0 z-40 flex flex-col justify-center gap-1 bg-deep/97 px-6 pt-28 transition-all duration-500 ease-out md:hidden"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {LINKS.map((l, i) => {
          const active = isActive(pathname, l.to);
          return (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => playCue("click")}
              className={cn(
                "display-lg block border-b border-border/20 py-5 text-foreground transition-all duration-700 last:border-b-0",
                active && "text-glow"
              )}
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "none" : "translateY(1.25rem)",
                transitionDelay: `${i * 60 + 90}ms`,
              }}
            >
              {l.label}
            </Link>
          );
        })}
        <button
          onClick={toggleSound}
          className="label mt-10 self-start text-foreground/80 transition-colors duration-500 hover:text-glow"
        >
          Sound {sound ? "on" : "off"}
        </button>
      </div>

      <ScrollProgress />
    </header>
  );
}

function isActive(pathname: string, to: string) {
  return to === "/" ? pathname === "/" : pathname.startsWith(to);
}

function NavItem({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      {...cursorProps(label)}
      onPointerEnter={(e) => {
        cursorProps(label).onPointerEnter();
        playCue("hover");
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onPointerLeave={(e) => {
        cursorProps().onPointerLeave();
        e.currentTarget.style.transform = "none";
      }}
      onClick={() => playCue("click")}
      className="link-underline label !text-[0.78rem] !tracking-[0.12em] !font-medium transition-all duration-500"
      style={{
        color: active ? "var(--color-glow)" : undefined,
        textShadow: active ? "var(--glow-hard)" : "none",
      }}
    >
      {label}
    </Link>
  );
}

function SoundToggle({ sound, onToggle }: { sound: boolean; onToggle: () => void }) {
  return (
    <button
      {...cursorProps(sound ? "Mute" : "Sound")}
      onClick={onToggle}
      className="label flex items-center gap-2 !text-[0.7rem] !tracking-[0.12em] transition-colors duration-500"
      style={{ color: sound ? "var(--color-glow)" : undefined }}
    >
      <span className="flex h-3 items-end gap-[2px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-[2px] bg-current transition-all duration-500"
            style={{
              height: sound ? `${[6, 11, 4][i]}px` : "2px",
              animation: sound ? `pulse-ring ${1.1 + i * 0.3}s ease-in-out infinite` : undefined,
            }}
          />
        ))}
      </span>
      Sound {sound ? "on" : "off"}
    </button>
  );
}

function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (bar.current) bar.current.style.transform = `scaleX(${live.progress})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 h-px bg-border">
      <div
        ref={bar}
        className="h-px origin-left bg-neon"
        style={{ boxShadow: "var(--glow-hard)", transform: "scaleX(0)" }}
      />
    </div>
  );
}
