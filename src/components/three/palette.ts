/**
 * The 3D layer needs literal colour values (WebGL cannot read CSS tokens).
 * These mirror the design-system tokens in src/styles.css one-to-one.
 */
export const COL = {
  deep: "#03140F",
  forest: "#06251B",
  brand: "#0B6B45",
  neon: "#18C77A",
  glow: "#5DFFB0",
  moss: "#173E31",
  text: "#F1F7F3",
} as const;
