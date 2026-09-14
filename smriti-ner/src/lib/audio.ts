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
  freq: number,
  waveType: OscillatorType = "sine",
  ms = 300
): void {
  playTone(freq, ms / 1000, waveType);
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
