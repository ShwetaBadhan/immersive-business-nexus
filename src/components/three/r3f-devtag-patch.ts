import * as THREE from "three";

/**
 * The dev-time JSX source tagger injects `data-tsd-source` on every JSX element,
 * including react-three-fiber elements. R3F treats dashed props as nested paths
 * (`object.data.tsd.source`) and throws "Cannot set data-tsd-source" on update.
 *
 * Declaring the key on the three.js prototypes makes R3F resolve it as a plain
 * property assignment instead of a nested path, so the tag is harmlessly stored.
 */
const DEV_TAGS = ["data-tsd-source"];

const prototypes: object[] = [
  THREE.Object3D.prototype,
  THREE.Material.prototype,
  THREE.BufferGeometry.prototype,
  THREE.Texture.prototype,
];

for (const proto of prototypes) {
  for (const tag of DEV_TAGS) {
    if (tag in proto) continue;
    Object.defineProperty(proto, tag, {
      value: undefined,
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }
}

export {};
