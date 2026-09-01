import { useEffect, useRef, useState } from "react";
import { cursorProps } from "./Cursor";
import { setWorld, useWorld } from "@/lib/world-store";
import { playCue, setAudioEnabled } from "@/lib/audio";

const GLYPHS = ["2", "3", "9"] as const;
const ENTERED_KEY = "239:entered";

/**
 * Cinematic entry: 239 forms out of noise and distortion, the digits count in,
 * then the user chooses to enter with or without sound. The overlay dissolves
 * into the live 3D world instead of cutting away.
 */
export function Loader() {
  const entered = useWorld((s) => s.entered);
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [glyph, setGlyph] = useState(0);
  /** null until we know whether this session already entered */
  const [session, setSession] = useState<"unknown" | "fresh" | "returning">("unknown");
  const shell = useRef<HTMLDivElement>(null);

  // the intro belongs to a session, not to a page load: a refresh (on any
  // route) keeps the visitor exactly where they were
  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(ENTERED_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) {
      setWorld({ entered: true, sound: false });
      setSession("returning");
    } else {
      setSession("fresh");
    }
  }, []);

  useEffect(() => {
    if (session !== "fresh") return;
    const timers: number[] = [];
    let n = 0;
    const id = window.setInterval(() => {
      n = Math.min(100, n + Math.random() * 9 + 2);
      setCount(Math.floor(n));
      if (n >= 100) {
        window.clearInterval(id);
        timers.push(window.setTimeout(() => setReady(true), 420));
      }
    }, 90);
    GLYPHS.forEach((_, i) => timers.push(window.setTimeout(() => setGlyph(i + 1), 500 + i * 420)));
    return () => {
      window.clearInterval(id);
      timers.forEach(window.clearTimeout);
    };
  }, [session]);


  const enter = (withSound: boolean) => {
    if (leaving) return;
    setLeaving(true);
    try {
      window.sessionStorage.setItem(ENTERED_KEY, "1");
    } catch {
      /* storage unavailable — intro simply shows again next load */
    }
    if (withSound) {
      setAudioEnabled(true);
      setWorld({ sound: true });
    }
    playCue("transition");
    window.setTimeout(() => setWorld({ entered: true }), 1150);
  };

  useEffect(() => {
    if (session === "fresh" && !entered) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [entered, session]);

  if (entered || session !== "fresh") return null;

  const blur = ready ? 0 : Math.max(0, 26 - count * 0.26);

  return (
    <div
      ref={shell}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-background transition-all duration-1000 ease-out"
      style={{
        opacity: leaving ? 0 : 1,
        transform: leaving ? "scale(1.18)" : "none",
        filter: leaving ? "blur(14px)" : "none",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: "var(--gradient-veil)" }}
      />

      <div className="relative flex flex-col items-center">
        <div
          className="relative select-none font-display uppercase leading-none tracking-[-0.06em] text-foreground"
          style={{
            fontSize: "clamp(5rem, 22vw, 18rem)",
            filter: `blur(${blur}px)`,
            letterSpacing: `${Math.max(0, (100 - count) * 0.004)}em`,
            transition: "filter 0.5s linear, letter-spacing 0.5s linear",
            textShadow: "var(--glow-soft)",
          }}
        >
          <span style={{ opacity: 0.16, position: "absolute", inset: 0, transform: `translateX(${(100 - count) * 0.1}px)`, color: "var(--color-neon)" }}>
            239
          </span>
          <span style={{ opacity: 0.16, position: "absolute", inset: 0, transform: `translateX(-${(100 - count) * 0.1}px)`, color: "var(--color-glow)" }}>
            239
          </span>
          239
        </div>

        <div className="mt-6 flex items-center gap-6">
          {GLYPHS.map((g, i) => (
            <span
              key={g}
              className="font-mono text-sm transition-all duration-700"
              style={{
                opacity: glyph > i ? 1 : 0.18,
                color: glyph > i ? "var(--color-glow)" : "var(--color-muted-foreground)",
                transform: glyph > i ? "none" : "translateY(6px)",
                textShadow: glyph > i ? "var(--glow-hard)" : "none",
              }}
            >
              {g}
            </span>
          ))}
        </div>

        <p
          className="label mt-8 transition-opacity duration-1000"
          style={{ opacity: glyph >= 3 ? 1 : 0 }}
        >
          The Business Developer LLP
        </p>
      </div>

      <div
        className="absolute bottom-20 flex flex-col items-center gap-5 transition-all duration-1000 md:bottom-10"
        style={{ opacity: ready ? 1 : 0, transform: ready ? "none" : "translateY(1rem)" }}
      >
        <button
          {...cursorProps("Enter")}
          onClick={() => enter(true)}
          disabled={!ready}
          className="group pointer-events-auto flex items-center gap-4 border border-border bg-card/60 px-9 py-4 backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5 hover:border-glow hover:bg-card"
          style={{ boxShadow: "var(--glow-soft)" }}
        >
          <span className="label !text-[0.65rem] !text-foreground transition-colors duration-500 group-hover:!text-glow">
            Enter Experience
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-glow pulse-dot" />
        </button>
        <button
          {...cursorProps()}
          onClick={() => enter(false)}
          disabled={!ready}
          className="link-underline label pointer-events-auto transition-colors duration-500 hover:!text-glow"
        >
          Enter without sound
        </button>

      </div>

      <div className="absolute bottom-5 left-6 md:bottom-10 md:left-10">
        <span className="label">{String(count).padStart(3, "0")}</span>
      </div>
      <div className="absolute bottom-5 right-6 md:bottom-10 md:right-10">
        <span className="label">{ready ? "World ready" : "Building world"}</span>
      </div>
    </div>
  );
}
