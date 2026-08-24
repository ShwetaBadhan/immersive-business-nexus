import * as THREE from "three";

/**
 * The dev-time JSX source tagger injects `data-tsd-source` on every JSX element,
 * including react-three-fiber elements. R3F treats dashed props as nested paths
 * (`object.data.tsd.source`) and throws "Cannot set data-tsd-source" unless the
 * whole dashed key already exists on the target (`key in root`).
 *
 * So we declare those keys everywhere they could land: every three.js class
 * prototype (Object3D, Material, Geometry, Color, Fog, Texture, ...) plus a
 * final Object.prototype fallback for anything constructed elsewhere.
 */
const DEV_TAGS = ["data-tsd-source", "data-lov-id", "data-lov-name", "data-component-path"];

function declare(target: object) {
  for (const tag of DEV_TAGS) {
    if (Object.prototype.hasOwnProperty.call(target, tag)) continue;
    try {
      Object.defineProperty(target, tag, {
        value: undefined,
        writable: true,
        configurable: true,
        enumerable: false,
      });
    } catch {
      /* frozen prototype — ignore */
    }
  }
}

// every three.js constructor prototype
for (const value of Object.values(THREE as unknown as Record<string, unknown>)) {
  if (typeof value === "function" && (value as { prototype?: object }).prototype) {
    declare((value as { prototype: object }).prototype);
  }
}

// catch-all for objects created outside the three namespace
declare(Object.prototype);

export {};
