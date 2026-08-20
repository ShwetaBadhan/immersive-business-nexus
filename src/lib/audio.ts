/**
 * Ambient audio engine built entirely with the Web Audio API — no asset files.
 * A slow drone bed plus short interaction blips. Off by default.
 */

type Engine = {
  ctx: AudioContext;
  master: GainNode;
  voices: OscillatorNode[];
  noise: AudioBufferSourceNode | null;
};

let engine: Engine | null = null;
let enabled = false;

function makeNoiseBuffer(ctx: AudioContext) {
  const len = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buf;
}

function build(): Engine | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  const ctx = new Ctor();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const bed = ctx.createGain();
  bed.gain.value = 0.5;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 620;
  filter.Q.value = 0.8;
  bed.connect(filter);
  filter.connect(master);

  // Drone voices tuned around 2 : 3 : 9 ratios of a low root.
  const root = 55;
  const voices = [root * 1, root * 1.5, root * 2, root * 2.25, root * 4.5].map((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = i % 2 === 0 ? "sine" : "triangle";
    osc.frequency.value = f;
    osc.detune.value = (i - 2) * 6;
    const g = ctx.createGain();
    g.gain.value = 0.16 / (i * 0.6 + 1);
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.03 + i * 0.017;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = g.gain.value * 0.8;
    lfo.connect(lfoGain);
    lfoGain.connect(g.gain);
    lfo.start();
    osc.connect(g);
    g.connect(bed);
    osc.start();
    return osc;
  });

  const noise = ctx.createBufferSource();
  noise.buffer = makeNoiseBuffer(ctx);
  noise.loop = true;
  const nGain = ctx.createGain();
  nGain.gain.value = 0.045;
  const nFilter = ctx.createBiquadFilter();
  nFilter.type = "bandpass";
  nFilter.frequency.value = 900;
  noise.connect(nFilter);
  nFilter.connect(nGain);
  nGain.connect(master);
  noise.start();

  return { ctx, master, voices, noise };
}

export function setAudioEnabled(next: boolean) {
  enabled = next;
  if (next) {
    engine = engine ?? build();
    if (!engine) return;
    void engine.ctx.resume();
    engine.master.gain.cancelScheduledValues(engine.ctx.currentTime);
    engine.master.gain.linearRampToValueAtTime(0.22, engine.ctx.currentTime + 2.2);
  } else if (engine) {
    engine.master.gain.cancelScheduledValues(engine.ctx.currentTime);
    engine.master.gain.linearRampToValueAtTime(0, engine.ctx.currentTime + 0.7);
  }
}

export function isAudioEnabled() {
  return enabled;
}

type Cue = "hover" | "click" | "transition" | "open";

const CUES: Record<Cue, { freq: number; dur: number; type: OscillatorType; gain: number }> = {
  hover: { freq: 1180, dur: 0.09, type: "sine", gain: 0.05 },
  click: { freq: 660, dur: 0.16, type: "triangle", gain: 0.09 },
  open: { freq: 392, dur: 0.42, type: "sine", gain: 0.1 },
  transition: { freq: 196, dur: 0.9, type: "sine", gain: 0.12 },
};

export function playCue(cue: Cue) {
  if (!enabled || !engine) return;
  const { ctx, master } = engine;
  const spec = CUES[cue];
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = spec.type;
  osc.frequency.setValueAtTime(spec.freq, t);
  osc.frequency.exponentialRampToValueAtTime(spec.freq * 0.62, t + spec.dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(spec.gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + spec.dur);
  osc.connect(g);
  g.connect(master);
  osc.start(t);
  osc.stop(t + spec.dur + 0.05);
}
