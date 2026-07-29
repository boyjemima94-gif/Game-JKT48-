// Synthesized SFX via Web Audio API — no external audio files needed.
// Provides: paper rustle, stamp slam, lamp flicker buzz, drawer open, ink blot.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

// Ensure audio context is unlocked on first user gesture.
export function unlockAudio() {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume().catch(() => {});
}

// White noise buffer generator.
function noiseBuffer(c: AudioContext, duration: number): AudioBuffer {
  const len = Math.floor(c.sampleRate * duration);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buf;
}

/**
 * Paper rustle / page turn — filtered noise bursts with quick envelopes.
 * duration in seconds, intensity 0..1
 */
export function playPaperRustle(duration = 0.85, intensity = 0.7) {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;

  const master = c.createGain();
  master.gain.value = 0;
  master.connect(c.destination);

  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2400;
  filter.Q.value = 0.7;
  filter.connect(master);

  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, duration);
  src.connect(filter);

  // Multiple short rustle bursts to feel like crumpling pages.
  const bursts = 4 + Math.floor(intensity * 4);
  for (let i = 0; i < bursts; i++) {
    const t = now + (i / bursts) * duration * 0.9 + Math.random() * 0.04;
    const peak = 0.12 + Math.random() * 0.1 * intensity;
    master.gain.setValueAtTime(0.0001, t);
    master.gain.exponentialRampToValueAtTime(peak, t + 0.02);
    master.gain.exponentialRampToValueAtTime(0.0001, t + 0.12 + Math.random() * 0.08);

    // shift filter frequency per burst for texture
    filter.frequency.setValueAtTime(1800 + Math.random() * 2600, t);
  }

  src.start(now);
  src.stop(now + duration + 0.05);
}

/**
 * Heavy stamp slam — low thud + paper impact noise.
 */
export function playStampSlam() {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;

  // Low thud (sine sweep down)
  const osc = c.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);
  const oscGain = c.createGain();
  oscGain.gain.setValueAtTime(0.0001, now);
  oscGain.gain.exponentialRampToValueAtTime(0.6, now + 0.01);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
  osc.connect(oscGain);
  oscGain.connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.4);

  // Impact noise burst
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 3500;
  const noise = c.createBufferSource();
  noise.buffer = noiseBuffer(c, 0.25);
  const noiseGain = c.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.4, now + 0.005);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(c.destination);
  noise.start(now);
  noise.stop(now + 0.25);

  // Squeak / ink spread (very short high tone)
  const sq = c.createOscillator();
  sq.type = "triangle";
  sq.frequency.setValueAtTime(900, now + 0.04);
  sq.frequency.exponentialRampToValueAtTime(300, now + 0.18);
  const sqGain = c.createGain();
  sqGain.gain.setValueAtTime(0.0001, now + 0.04);
  sqGain.gain.exponentialRampToValueAtTime(0.08, now + 0.06);
  sqGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  sq.connect(sqGain);
  sqGain.connect(c.destination);
  sq.start(now + 0.04);
  sq.stop(now + 0.25);
}

/**
 * Lamp buzz — short electrical buzz when lamp flickers.
 */
export function playLampBuzz() {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = 120;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 600;
  filter.Q.value = 8;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.05, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}

/**
 * Drawer / folder open — wooden slide.
 */
export function playDrawer() {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(500, now);
  filter.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
  filter.Q.value = 2;
  const noise = c.createBufferSource();
  noise.buffer = noiseBuffer(c, 0.3);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  noise.start(now);
  noise.stop(now + 0.32);
}

/**
 * Soft click — for buttons / pins.
 */
export function playClick() {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.1, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.08);
}

/**
 * Ambient room tone — very low rumble loop. Returns stop function.
 */
export function startRoomTone(): () => void {
  const c = getCtx();
  if (!c) return () => {};
  const now = c.currentTime;

  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 200;
  const gain = c.createGain();
  gain.gain.value = 0.04;
  filter.connect(gain);
  gain.connect(c.destination);

  const noise = c.createBufferSource();
  noise.buffer = noiseBuffer(c, 4);
  noise.loop = true;
  noise.connect(filter);
  noise.start(now);

  // Slow LFO on gain
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.15;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 0.02;
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  lfo.start(now);

  return () => {
    try {
      noise.stop();
      lfo.stop();
    } catch {
      /* noop */
    }
  };
}
