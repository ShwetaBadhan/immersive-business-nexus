import { useSyncExternalStore } from "react";

export type WorldVariant = "home" | "about" | "services" | "work" | "project" | "contact";

export type WorldState = {
  entered: boolean;
  sound: boolean;
  variant: WorldVariant;
  /** 0..1 normalized page scroll progress (smoothed by Lenis) */
  progress: number;
  /** -1..1 pointer coords */
  pointer: { x: number; y: number };
  /** 0..1 transition veil amount */
  veil: number;
  /** index of focused floating object, -1 = none */
  focus: number;
  cursorLabel: string | null;
  cursorMode: "dot" | "ring" | "label";
  quality: "high" | "low";
};

const state: WorldState = {
  entered: false,
  sound: false,
  variant: "home",
  progress: 0,
  pointer: { x: 0, y: 0 },
  veil: 0,
  focus: -1,
  cursorLabel: null,
  cursorMode: "dot",
  quality: "high",
};

/** Mutable, non-reactive values read inside the render loop every frame. */
export const live = {
  progress: 0,
  pointerX: 0,
  pointerY: 0,
  smoothX: 0,
  smoothY: 0,
  dragX: 0,
  dragVel: 0,
  veil: 0,
};

const listeners = new Set<() => void>();
let snapshot: WorldState = { ...state };

function emit() {
  snapshot = { ...state, pointer: { ...state.pointer } };
  listeners.forEach((l) => l());
}

export function setWorld(patch: Partial<WorldState>) {
  let changed = false;
  for (const key of Object.keys(patch) as (keyof WorldState)[]) {
    if (state[key] !== patch[key]) {
      // @ts-expect-error index write
      state[key] = patch[key];
      changed = true;
    }
  }
  if (changed) emit();
}

export function getWorld() {
  return snapshot;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useWorld<T>(select: (s: WorldState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => select(snapshot),
    () => select(snapshot),
  );
}
