import { useRef, useState } from "react";
import { Stage } from "@/components/three/Stage";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ConnectionForm,
  NetworkStructure,
  ProjectEnvironment,
  ServiceGlyph,
  type GlyphKind,
} from "@/components/three/visuals";

/**
 * Section-level 3D visuals. Each one is a single, intentional composition
 * with whitespace around it — mounted only while near the viewport.
 */

/** ABOUT — connection structure: people, ideas, connections, business. */
export function NetworkVisual({ className = "" }: { className?: string }) {
  return (
    <Stage className={`h-[380px] w-full md:h-[520px] ${className}`} camera={[0, 0.2, 5.4]} fov={38}>
      <NetworkStructure />
    </Stage>
  );
}

/** SERVICES — a small unique glyph per practice, alive on card hover. */
export function ServiceGlyphVisual({ kind, hovered = false }: { kind: GlyphKind; hovered?: boolean }) {
  return (
    <Stage className="h-full w-full" camera={[0, 0, 3.4]} fov={36} hover={hovered}>
      <ServiceGlyph kind={kind} />
    </Stage>
  );
}

/** CASE STUDIES — quiet project environment that reacts to the hovered row. */
export function ProjectsVisual({ activeRef }: { activeRef: { current: number } }) {
  const mobile = useIsMobile();
  return (
    <Stage
      className="absolute inset-0 h-full w-full"
      camera={mobile ? [0, 0, 11] : [0, 0, 7.2]}
      fov={40}
      tint={mobile ? 0.6 : 1}
      style={mobile ? { opacity: 0.4 } : undefined}
    >
      <ProjectEnvironment activeRef={activeRef} compact={mobile} />
    </Stage>
  );
}

/** CONTACT — one elegant collaboration form. */
export function ConnectionVisual({ className = "" }: { className?: string }) {
  return (
    <Stage className={`h-[300px] w-full md:h-[420px] ${className}`} camera={[0, 0, 4.6]} fov={38}>
      <ConnectionForm />
    </Stage>
  );
}

/** Hover index tracker: keeps a live ref for the 3D layer, plus a render tick. */
export function useActiveIndex() {
  const activeRef = useRef(-1);
  const [active, setActive] = useState(-1);
  return {
    activeRef,
    active,
    set: (i: number) => {
      activeRef.current = i;
      setActive(i);
    },
  };
}
