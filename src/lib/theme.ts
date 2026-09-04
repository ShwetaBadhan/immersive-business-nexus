import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const KEY = "239-theme";
let theme: Theme = "light";
const listeners = new Set<() => void>();

function apply(next: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", next === "dark");
}

export function initTheme() {
  if (typeof window === "undefined") return;
  const stored = window.localStorage.getItem(KEY) as Theme | null;
  const prefers =
    window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  theme = stored ?? prefers;
  apply(theme);
  listeners.forEach((l) => l());
}

export function setTheme(next: Theme) {
  if (next === theme) return;
  theme = next;
  apply(next);
  try {
    window.localStorage.setItem(KEY, next);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function toggleTheme() {
  setTheme(theme === "dark" ? "light" : "dark");
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => theme,
    () => "light" as Theme,
  );
}
