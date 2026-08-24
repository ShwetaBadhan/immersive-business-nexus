/**
 * The 3D layer needs literal colour values (WebGL cannot read CSS tokens).
 * These mirror the design-system tokens in src/styles.css one-to-one.
 * Light premium theme: off-white paper with sophisticated greens.
 */
export const COL = {
  deep: "#F5F8F5",
  forest: "#E6EFE8",
  brand: "#3D7F5F",
  neon: "#2A9C6B",
  glow: "#0F6B45",
  moss: "#C6D8CC",
  text: "#141F1A",
} as const;
