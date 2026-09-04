/**
 * The 3D layer needs literal colour values (WebGL cannot read CSS tokens).
 * These mirror the design-system tokens in src/styles.css one-to-one and
 * swap with the active theme, so the WebGL atmosphere is genuinely dark in
 * dark mode instead of painting a washed-out light layer over the site.
 */
export type Palette = {
  deep: string;
  forest: string;
  brand: string;
  neon: string;
  glow: string;
  moss: string;
  text: string;
  /** near-white tint used by glass / acrylic surfaces */
  paper: string;
};

export const LIGHT: Palette = {
  deep: "#F5F8F5",
  forest: "#E6EFE8",
  brand: "#3D7F5F",
  neon: "#2A9C6B",
  glow: "#0F6B45",
  moss: "#C6D8CC",
  text: "#141F1A",
  paper: "#F1F9F4",
};

export const DARK: Palette = {
  deep: "#0A0D0C",
  forest: "#111614",
  brand: "#2BBF79",
  neon: "#39D98A",
  glow: "#6FE9B0",
  moss: "#1A231F",
  text: "#F2F5F3",
  paper: "#2A3833",
};

let current: Palette = LIGHT;

export function setPaletteTheme(theme: "light" | "dark") {
  current = theme === "dark" ? DARK : LIGHT;
}

export function isDarkPalette() {
  return current === DARK;
}

/** Live palette proxy — always reflects the active theme. */
export const COL = new Proxy({} as Palette, {
  get: (_t, key: string) => current[key as keyof Palette],
}) as Palette;
