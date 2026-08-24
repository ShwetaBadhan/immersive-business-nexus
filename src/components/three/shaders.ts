export const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

/** Slowly breathing / deforming organic surface. */
export const ORGANIC_VERT = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uProgress;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;

${NOISE_GLSL}

void main(){
  vec3 pos = position;
  float n = snoise(pos * uFreq + vec3(0.0, uTime * 0.16, uTime * 0.09));
  float n2 = snoise(pos * (uFreq * 2.6) - vec3(uTime * 0.11, 0.0, 0.0));
  float disp = n * uAmp + n2 * uAmp * 0.32;
  disp += sin(uTime * 0.5) * 0.035;
  pos += normal * disp;
  pos.y += uProgress * 0.25;

  vDisp = disp;
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

export const ORGANIC_FRAG = /* glsl */ `
uniform vec3 uDeep;
uniform vec3 uBrand;
uniform vec3 uNeon;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;

void main(){
  vec3 n = normalize(vNormal);
  vec3 v = normalize(-vViewPos);
  float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.4);
  float rim = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 6.0);
  float lightA = clamp(dot(n, normalize(vec3(0.6, 0.9, 0.4))), 0.0, 1.0);
  float lightB = clamp(dot(n, normalize(vec3(-0.8, -0.2, 0.6))), 0.0, 1.0);

  vec3 col = mix(uDeep, uBrand, lightA * 0.85);
  col += uNeon * lightB * 0.16;
  col = mix(col, uNeon, fres * 0.5);
  col += uNeon * rim * 0.65;
  col += uNeon * smoothstep(0.06, 0.22, vDisp) * 0.22;
  col *= 0.9 + sin(uTime * 0.6) * 0.05;

  gl_FragColor = vec4(col, 1.0);
}
`;

/** GPU particle field: instanced points with per-point drift + mouse parallax. */
export const PARTICLE_VERT = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform vec2 uPointer;
uniform float uSize;
uniform float uPixelRatio;
uniform float uSpread;
attribute float aScale;
attribute float aSeed;
varying float vFade;
varying float vSeed;

void main(){
  vec3 pos = position;
  float t = uTime * (0.05 + aSeed * 0.09);
  pos.x += sin(t + aSeed * 12.0) * 0.7;
  pos.y += cos(t * 0.8 + aSeed * 7.0) * 0.7;
  pos.z = mod(pos.z + uProgress * uSpread * 1.6 + uTime * 0.22, uSpread) - uSpread * 0.5;
  pos.xy += uPointer * (0.55 + aSeed * 0.9);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float dist = -mv.z;
  vFade = smoothstep(0.0, 6.0, dist) * (1.0 - smoothstep(18.0, 34.0, dist));
  vSeed = aSeed;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * aScale * uPixelRatio * (10.0 / max(dist, 0.6));
}
`;

export const PARTICLE_FRAG = /* glsl */ `
uniform vec3 uNeon;
uniform vec3 uGlow;
varying float vFade;
varying float vSeed;

void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float alpha = smoothstep(0.5, 0.0, d);
  alpha *= vFade;
  if (alpha < 0.01) discard;
  vec3 col = mix(uNeon, uGlow, step(0.86, vSeed));
  gl_FragColor = vec4(col, alpha * (0.14 + vSeed * 0.26));
}
`;

/** Curved, glitching image/label plane used for case-study panels. */
export const PANEL_VERT = /* glsl */ `
uniform float uTime;
uniform float uHover;
uniform float uCurve;
varying vec2 vUv;
void main(){
  vUv = uv;
  vec3 pos = position;
  pos.z += sin(uv.x * 3.14159) * uCurve;
  pos.z += sin(uTime * 0.7 + uv.y * 4.0) * 0.03;
  pos.xy *= 1.0 + uHover * 0.05;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const PANEL_FRAG = /* glsl */ `
uniform float uTime;
uniform float uHover;
uniform float uHue;
uniform vec3 uDeep;
uniform vec3 uBrand;
uniform vec3 uNeon;
varying vec2 vUv;

${NOISE_GLSL}

void main(){
  vec2 uv = vUv;
  float n = snoise(vec3(uv * 3.2, uTime * 0.08 + uHue * 10.0));
  float n2 = snoise(vec3(uv * 9.0 + n, uTime * 0.05));
  float bands = smoothstep(0.35, 0.65, fract(uv.y * 9.0 + n * 0.5));

  vec3 col = mix(uDeep, uBrand, 0.35 + n * 0.4);
  col = mix(col, uNeon, bands * (0.06 + uHover * 0.3));
  col += uNeon * pow(1.0 - abs(uv.x - 0.5) * 2.0, 6.0) * (0.1 + uHover * 0.5);
  col += n2 * 0.035;

  float edge = smoothstep(0.0, 0.02, uv.x) * smoothstep(1.0, 0.98, uv.x)
             * smoothstep(0.0, 0.02, uv.y) * smoothstep(1.0, 0.98, uv.y);
  col = mix(uNeon * (0.5 + uHover), col, edge);

  gl_FragColor = vec4(col, 0.86 + uHover * 0.14);
}
`;
