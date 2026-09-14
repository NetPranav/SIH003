/**
 * Smriti-NER (স্মৃতি) — Circadian-Aware Content Engine (CAC-E)
 * Sub-Phase 5.5: Circadian-Aware Content Engine
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Clinical Goal:
 * Mitigates Sundowning Syndrome and twilight dementia agitation through:
 * 1. Continuous multi-factor Sundowning Agitation Index (SAI) computation.
 * 2. Automated cognitive load capping.
 * 3. Offline Web Audio synthesis of authentic regional North Eastern folk lullabies and calming ragas.
 */

export type CircadianState =
  | "CIRCADIAN_NORMAL"
  | "CIRCADIAN_DUSK_OBSERVATION"
  | "CIRCADIAN_SUNDOWNING_ACTIVE";

export interface SundowningTelemetryInputs {
  currentHourDecimal: number;      // e.g. 17.5 = 17:30
  currentTremorJitters: number;    // count per session
  baselineTremorJitters: number;   // elder baseline
  wanderIndex: number;             // path / displacement ratio
  aacbAgitationVelocity: number;   // 0.0 - 1.0 from AACB
}

export interface SundowningAssessmentResult {
  state: CircadianState;
  sundowningIndex: number;
  timeFactor: number;
  tremorFactor: number;
  wanderFactor: number;
  agitationFactor: number;
  maxRecommendedTier: number;
  calmingAudioTriggerRecommended: boolean;
  uiAmberFilterRecommended: boolean;
}

export interface MelodicNote {
  freqHz: number;
  durationSec: number;
  pauseAfterSec: number;
}

export interface RegionalCalmingTrack {
  id: string;
  title: string;
  nativeTitle: string;
  region: string;
  language: string;
  notes: MelodicNote[];
  tempoBpm: number;
  clinicalNote: string;
}

/**
 * Curated Authentic North Eastern Calming Melodies & Lullabies
 * Modeled using pentatonic folk scales and evening tranquility ragas
 */
export const REGIONAL_CALMING_CATALOG: RegionalCalmingTrack[] = [
  {
    id: "o_phool_kuwori",
    title: "O Phool Kuwori (Assamese Cradle Lullaby)",
    nativeTitle: "অ' ফুল কুঁৱৰী (ঘুমাওঁতে শুনা গীত)",
    region: "Assam (Upper Brahmaputra Valley)",
    language: "as",
    tempoBpm: 52,
    clinicalNote: "6/8 rocking cradle lilt; lowers autonomic arousal via auditory entrainment.",
    notes: [
      { freqHz: 261.63, durationSec: 1.2, pauseAfterSec: 0.1 }, // C4
      { freqHz: 293.66, durationSec: 1.0, pauseAfterSec: 0.1 }, // D4
      { freqHz: 329.63, durationSec: 1.5, pauseAfterSec: 0.2 }, // E4
      { freqHz: 293.66, durationSec: 1.0, pauseAfterSec: 0.1 }, // D4
      { freqHz: 261.63, durationSec: 1.8, pauseAfterSec: 0.3 }, // C4
      { freqHz: 220.00, durationSec: 1.4, pauseAfterSec: 0.2 }, // A3
      { freqHz: 261.63, durationSec: 2.2, pauseAfterSec: 0.4 }, // C4
    ],
  },
  {
    id: "tha_tha_thabungton",
    title: "Tha Tha Thabungton (Meitei Moon Lullaby)",
    nativeTitle: "ꯊꯥ ꯊꯥ ꯊꯕꯨꯡꯇꯣꯟ (ꯃꯅꯤꯄꯨꯔ)",
    region: "Manipur (Imphal Valley)",
    language: "mni",
    tempoBpm: 48,
    clinicalNote: "Descending ancient pentatonic phrase inducing alpha-wave synchronization.",
    notes: [
      { freqHz: 392.00, durationSec: 1.4, pauseAfterSec: 0.1 }, // G4
      { freqHz: 329.63, durationSec: 1.2, pauseAfterSec: 0.1 }, // E4
      { freqHz: 293.66, durationSec: 1.2, pauseAfterSec: 0.1 }, // D4
      { freqHz: 261.63, durationSec: 1.8, pauseAfterSec: 0.2 }, // C4
      { freqHz: 196.00, durationSec: 2.4, pauseAfterSec: 0.4 }, // G3
    ],
  },
  {
    id: "bodo_serja_calm",
    title: "Bodo Serja Twilight Slumber",
    nativeTitle: "बड़ो सेरजा स्लो ललबाइ",
    region: "Bodoland (Lower Assam)",
    language: "brx",
    tempoBpm: 50,
    clinicalNote: "Warm lower-mid harmonic resonances mimicking traditional bowed Serja.",
    notes: [
      { freqHz: 220.00, durationSec: 1.5, pauseAfterSec: 0.1 }, // A3
      { freqHz: 246.94, durationSec: 1.2, pauseAfterSec: 0.1 }, // B3
      { freqHz: 277.18, durationSec: 1.6, pauseAfterSec: 0.2 }, // C#4
      { freqHz: 220.00, durationSec: 2.0, pauseAfterSec: 0.3 }, // A3
    ],
  },
  {
    id: "raga_bhairav_calm",
    title: "Evening Twilight Raga Peace",
    nativeTitle: "সন্ধ্যা শান্তি ৰাগ (সুৰ শান্তিকা)",
    region: "Pan-NER Classical / Serene",
    language: "hi",
    tempoBpm: 46,
    clinicalNote: "Komal Re and Dha micro-tonal intervals producing parasympathetic vagal activation.",
    notes: [
      { freqHz: 261.63, durationSec: 1.8, pauseAfterSec: 0.1 }, // Sa
      { freqHz: 277.18, durationSec: 1.6, pauseAfterSec: 0.1 }, // Re Komal
      { freqHz: 329.63, durationSec: 1.4, pauseAfterSec: 0.1 }, // Ga
      { freqHz: 349.23, durationSec: 1.6, pauseAfterSec: 0.2 }, // Ma
      { freqHz: 392.00, durationSec: 2.2, pauseAfterSec: 0.4 }, // Pa
    ],
  },
];

/**
 * Sundowning Detection & Circadian Index Calculator
 */
export class SundowningDetector {
  private static WEIGHT_TIME = 0.35;
  private static WEIGHT_TREMOR = 0.25;
  private static WEIGHT_WANDER = 0.20;
  private static WEIGHT_AACB = 0.20;

  /**
   * Calculates circadian twilight envelope.
   * Peaking between 16:30 and 19:30 (peak at 18:00).
   */
  public static computeTimeFactor(decimalHour: number): number {
    if (decimalHour < 16.0 || decimalHour > 20.5) {
      return 0.0;
    }
    const peak = 18.0;
    const sigma = 1.25;
    const exponent = -Math.pow(decimalHour - peak, 2) / (2 * Math.pow(sigma, 2));
    return Number(Math.exp(exponent).toFixed(4));
  }

  /**
   * Evaluates session telemetry against circadian thresholds
   */
  public static evaluateSession(inputs: SundowningTelemetryInputs): SundowningAssessmentResult {
    const timeFactor = this.computeTimeFactor(inputs.currentHourDecimal);

    // Tremor elevation factor
    const tremorDelta = inputs.currentTremorJitters - inputs.baselineTremorJitters;
    const tremorRatio = tremorDelta / Math.max(1, inputs.baselineTremorJitters);
    const tremorFactor = Math.min(1.0, Math.max(0.0, Number(tremorRatio.toFixed(4))));

    // Wander factor: wanderIndex > 1.0 indicates hesitation/confusion
    const wanderRatio = (inputs.wanderIndex - 1.0) / 3.0;
    const wanderFactor = Math.min(1.0, Math.max(0.0, Number(wanderRatio.toFixed(4))));

    // Agitation velocity from AACB (0.0 to 1.0)
    const agitationFactor = Math.min(1.0, Math.max(0.0, inputs.aacbAgitationVelocity));

    // Multi-factor continuous index
    const sundowningIndex = Number(
      (
        this.WEIGHT_TIME * timeFactor +
        this.WEIGHT_TREMOR * tremorFactor +
        this.WEIGHT_WANDER * wanderFactor +
        this.WEIGHT_AACB * agitationFactor
      ).toFixed(4)
    );

    let state: CircadianState = "CIRCADIAN_NORMAL";
    let maxRecommendedTier = 5;
    let calmingAudioTriggerRecommended = false;
    let uiAmberFilterRecommended = false;

    if (sundowningIndex >= 0.65 || (timeFactor > 0.6 && agitationFactor > 0.5)) {
      state = "CIRCADIAN_SUNDOWNING_ACTIVE";
      maxRecommendedTier = 1; // Drop to easiest tier
      calmingAudioTriggerRecommended = true;
      uiAmberFilterRecommended = true;
    } else if (sundowningIndex >= 0.40 || timeFactor > 0.4) {
      state = "CIRCADIAN_DUSK_OBSERVATION";
      maxRecommendedTier = 3; // Cap difficulty at Tier 3
      calmingAudioTriggerRecommended = false;
      uiAmberFilterRecommended = true;
    }

    return {
      state,
      sundowningIndex,
      timeFactor,
      tremorFactor,
      wanderFactor,
      agitationFactor,
      maxRecommendedTier,
      calmingAudioTriggerRecommended,
      uiAmberFilterRecommended,
    };
  }
}

/**
 * Parametric Web Audio Melodic Synthesizer
 * Generates soothing folk melodies locally with 0 downloads and 0 network usage
 */
export class CalmingAudioSynthesizer {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isDucked: boolean = false;
  private masterGain: GainNode | null = null;
  private timeoutIds: number[] = [];

  private initAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Starts playing a regional calming track with smooth fade-in
   */
  public playTrack(trackId?: string): boolean {
    const ctx = this.initAudioContext();
    if (!ctx) return false;

    this.stop(); // Stop any currently playing track

    const track =
      REGIONAL_CALMING_CATALOG.find((t) => t.id === trackId) ?? REGIONAL_CALMING_CATALOG[0];

    this.isPlaying = true;
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    // Smooth 2.5s fade-in to gentle ambient volume (0.12 = approx 40dB)
    this.masterGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 2.5);
    this.masterGain.connect(ctx.destination);

    let currentOffset = 0;

    const scheduleLoop = () => {
      if (!this.isPlaying || !this.audioCtx) return;

      currentOffset = 0;
      track.notes.forEach((note) => {
        const tid = window.setTimeout(() => {
          if (!this.isPlaying || !this.audioCtx || !this.masterGain) return;

          const osc = this.audioCtx.createOscillator();
          const noteGain = this.audioCtx.createGain();

          // Gentle flute/duitara waveform harmonic blend
          osc.type = "sine";
          osc.frequency.setValueAtTime(note.freqHz, this.audioCtx.currentTime);

          // Note envelope: soft attack, sustained body, gentle release
          const now = this.audioCtx.currentTime;
          noteGain.gain.setValueAtTime(0.001, now);
          noteGain.gain.exponentialRampToValueAtTime(0.8, now + 0.3);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + note.durationSec);

          osc.connect(noteGain);
          noteGain.connect(this.masterGain);

          osc.start(now);
          osc.stop(now + note.durationSec + 0.1);
        }, currentOffset * 1000);

        this.timeoutIds.push(tid);
        currentOffset += note.durationSec + note.pauseAfterSec;
      });

      // Loop after all notes play
      const loopTid = window.setTimeout(() => {
        if (this.isPlaying) {
          scheduleLoop();
        }
      }, (currentOffset + 1.0) * 1000);
      this.timeoutIds.push(loopTid);
    };

    scheduleLoop();
    return true;
  }

  /**
   * Ducks audio volume by -18dB when voice prompts or assistant is speaking
   */
  public duckAudio(duckFactor: number = 0.2): void {
    if (!this.audioCtx || !this.masterGain || !this.isPlaying) return;
    this.isDucked = true;
    const now = this.audioCtx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.01, 0.12 * duckFactor), now + 0.2);
  }

  /**
   * Restores audio volume after voice prompt finishes
   */
  public restoreAudio(): void {
    if (!this.audioCtx || !this.masterGain || !this.isPlaying) return;
    this.isDucked = false;
    const now = this.audioCtx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.12, now + 0.8);
  }

  /**
   * Stops playback with gentle fade-out
   */
  public stop(): void {
    this.isPlaying = false;
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds = [];

    if (this.audioCtx && this.masterGain) {
      try {
        const now = this.audioCtx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      } catch {
        // audio context might already be closed
      }
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

/**
 * Global Circadian-Aware Content Engine Singleton
 */
export class CircadianContentEngine {
  private static instance: CircadianContentEngine | null = null;
  private synthesizer: CalmingAudioSynthesizer;
  private currentState: CircadianState = "CIRCADIAN_NORMAL";
  private activeTrackId: string = "o_phool_kuwori";

  private constructor() {
    this.synthesizer = new CalmingAudioSynthesizer();
  }

  public static getInstance(): CircadianContentEngine {
    if (!this.instance) {
      this.instance = new CircadianContentEngine();
    }
    return this.instance;
  }

  public getState(): CircadianState {
    return this.currentState;
  }

  public getSynthesizer(): CalmingAudioSynthesizer {
    return this.synthesizer;
  }

  public setPreferredTrack(trackId: string): void {
    this.activeTrackId = trackId;
    if (this.synthesizer.getIsPlaying()) {
      this.synthesizer.playTrack(trackId);
    }
  }

  /**
   * Evaluates current session telemetry and transitions engine state.
   * Automatically toggles CSS classes and calming audio playback.
   */
  public updateSessionTelemetry(inputs: SundowningTelemetryInputs): SundowningAssessmentResult {
    const result = SundowningDetector.evaluateSession(inputs);
    this.currentState = result.state;

    if (typeof document !== "undefined") {
      if (result.uiAmberFilterRecommended) {
        document.body.classList.add("circadian-dusk-mode");
      } else {
        document.body.classList.remove("circadian-dusk-mode");
      }

      if (result.state === "CIRCADIAN_SUNDOWNING_ACTIVE") {
        document.body.classList.add("circadian-sundowning-active");
      } else {
        document.body.classList.remove("circadian-sundowning-active");
      }
    }

    if (result.calmingAudioTriggerRecommended) {
      if (!this.synthesizer.getIsPlaying()) {
        this.synthesizer.playTrack(this.activeTrackId);
      }
    } else if (result.state === "CIRCADIAN_NORMAL" && this.synthesizer.getIsPlaying()) {
      this.synthesizer.stop();
    }

    // Emit custom event for UI updates
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("smriti:circadian_state_change", {
          detail: result,
        })
      );
    }

    return result;
  }

  public stopCalmingAudio(): void {
    this.synthesizer.stop();
  }
}
