// ── Web Audio Synthesis & Audio Suppression Guard ──────────────
// On-device sound generation — zero streaming required (offline-first).
// Anti-Agitation Circuit Breaker (AACB) compliant: 0 failure sounds.

import { aacbEngine } from "./aacbEngine";

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Audio Suppression Guard
 * Strictly filters out dissonant error sounds, low-frequency buzzers,
 * or aggressive square/sawtooth alarm tones.
 */
export const AudioSuppressionGuard = {
  isPermitted(freq: number, type: OscillatorType): boolean {
    return aacbEngine.isAudioPermitted(freq, type);
  },
  sanitize(freq: number, type: OscillatorType): { freq: number; type: OscillatorType } {
    if (!this.isPermitted(freq, type)) {
      // Substitute harsh buzzer with gentle sine wood tap
      return { freq: 320, type: "sine" };
    }
    return { freq, type };
  },
};

export function playTone(
  freq: number,
  duration = 0.4,
  type: OscillatorType = "sine"
): void {
  try {
    // Pass through Audio Suppression Guard
    const safeTone = AudioSuppressionGuard.sanitize(freq, type);

    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = safeTone.type;
    osc.frequency.setValueAtTime(safeTone.freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.debug("Audio play error:", err);
  }
}

export function playBeep(freq = 440, ms = 120): void {
  playTone(freq, ms / 1000, "sine");
}

export function playGentleChime(): void {
  [523.25, 659.25].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, "sine"), i * 120);
  });
}

export function playSuccessChime(): void {
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, "sine"), i * 120);
  });
}

export function playSuccessJingle(): void {
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.35, "sine"), i * 140);
  });
}

export function playInstrumentSound(
  idOrFreq: string | number,
  waveType: OscillatorType = "sine",
  ms = 350
): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const duration = ms / 1000;

    if (typeof idOrFreq === "string") {
      const id = idOrFreq.toLowerCase();

      if (id.includes("dhol")) {
        // ── DHOL SYNTHESIS: Resonant Indian Folk Barrel Drum ──
        // 1. Transient membrane slap click (cutting through phone speakers)
        try {
          const bufferSize = Math.floor(ctx.sampleRate * 0.025);
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(1400, now);
          filter.Q.setValueAtTime(2.0, now);
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.45, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(ctx.destination);
          noise.start(now);
        } catch {
          // Graceful fallback if buffer creation fails
        }

        // 2. Main drum body resonance: rapid punch pitch drop 360Hz -> 155Hz
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "triangle";
        osc1.frequency.setValueAtTime(360, now);
        osc1.frequency.exponentialRampToValueAtTime(155, now + 0.08);
        osc1.frequency.exponentialRampToValueAtTime(95, now + 0.35);

        gain1.gain.setValueAtTime(0.85, now);
        gain1.gain.exponentialRampToValueAtTime(0.4, now + 0.1);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.45);

        // 3. Harmonic skin overtone (for clear mobile speaker resonance)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(520, now);
        osc2.frequency.exponentialRampToValueAtTime(260, now + 0.15);
        gain2.gain.setValueAtTime(0.4, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now);
        osc2.stop(now + 0.25);
        return;
      }

      if (id.includes("pepa")) {
        // ── PEPA SYNTHESIS: Rich buffalo horn reed timbre ──
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(440, now);

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(880, now);
        filter.Q.setValueAtTime(3.5, now);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.65, now + 0.04);
        gain.gain.setValueAtTime(0.55, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
        return;
      }

      if (id.includes("pung")) {
        // ── PUNG SYNTHESIS: Manipuri Mridanga crisp slap ──
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(210, now + 0.09);
        gain.gain.setValueAtTime(0.75, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.32);
        return;
      }

      if (id.includes("duitara")) {
        // ── DUITARA SYNTHESIS: Plucked folk string ──
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = "triangle";
        osc1.frequency.setValueAtTime(330, now);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(660, now);

        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.45);
        osc2.stop(now + 0.45);
        return;
      }

      if (id.includes("gogona")) {
        // ── GOGONA SYNTHESIS: Bamboo jaw harp twang ──
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(520, now);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.exponentialRampToValueAtTime(480, now + 0.28);
        filter.Q.setValueAtTime(6.0, now);

        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
        return;
      }

      if (id.includes("tokari")) {
        // ── TOKARI SYNTHESIS: Resonant folk drone ──
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(290, now);
        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
        return;
      }
    }

    // Fallback if numeric frequency passed
    const freq = typeof idOrFreq === "number" ? idOrFreq : 330;
    if (freq < 200) {
      // For low frequencies, boost audible harmonics for mobile phone speakers
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq * 1.8, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.08);
      gain.gain.setValueAtTime(0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } else {
      playTone(freq, duration, waveType);
    }
  } catch (err) {
    console.debug("Audio play error:", err);
  }
}

export function playNeutralTap(): void {
  playTone(320, 0.1, "sine");
}

export function playAudioFeedback(type: "click" | "tap" | "success" | "chime" = "click"): void {
  if (type === "click") {
    playTone(420, 0.08, "sine");
  } else if (type === "tap") {
    playTone(320, 0.1, "sine");
  } else if (type === "success") {
    playSuccessChime();
  } else if (type === "chime") {
    playGentleChime();
  }
}
