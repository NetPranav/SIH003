// ── SMRITI-NER AUDIO & RESILIENT GERIATRIC SPEECH ENGINE ────────────────────
// Sub-Phase 21.1, 21.2, 21.3: WebAudio context unlocking, dual-engine voice
// synthesis, geriatric calming cadence (0.82x), and kinship reminder prompts.

"use client";

import { playGentleChime, playTone } from "./audio";

// ── 1. User-Gesture Audio Context & WebSpeech Unlocker ───────────────
let isAudioUnlocked = false;
let unlockedAudioContext: AudioContext | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

/**
 * Initializes global user-gesture listeners to unlock WebAudio & WebSpeech
 * on mobile browsers, Android Capacitor WebViews, and iOS WebViews.
 */
export function initAudioContextUnlocker(): void {
  if (typeof window === "undefined" || isAudioUnlocked) return;

  const unlock = () => {
    if (isAudioUnlocked) return;
    isAudioUnlocked = true;

    // 1. Resume WebAudio Context
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        if (!unlockedAudioContext) {
          unlockedAudioContext = new AudioContextClass();
        }
        if (unlockedAudioContext.state === "suspended") {
          unlockedAudioContext.resume();
        }
      }
    } catch {
      // ignore
    }

    // 2. Unlock WebSpeech Synthesis with a silent warm-up utterance
    try {
      if ("speechSynthesis" in window && window.speechSynthesis) {
        window.speechSynthesis.resume();
        const silentUtterance = new SpeechSynthesisUtterance(" ");
        silentUtterance.volume = 0.01;
        silentUtterance.rate = 1.0;
        window.speechSynthesis.speak(silentUtterance);
        cachedVoices = window.speechSynthesis.getVoices() || [];
      }
    } catch {
      // ignore
    }

    // Clean up one-time listeners
    window.removeEventListener("touchstart", unlock);
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("click", unlock);
    window.removeEventListener("keydown", unlock);
  };

  window.addEventListener("touchstart", unlock, { passive: true });
  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("click", unlock, { passive: true });
  window.addEventListener("keydown", unlock, { passive: true });

  // Pre-load voices when voiceschanged fires
  if (typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    };
  }
}

// Auto-initialize on load if in browser
if (typeof window !== "undefined") {
  initAudioContextUnlocker();
}

// ── 2. Regional Kinship Spoken Reminder Dictionary (8 Languages) ─────
export const REGIONAL_REMINDER_SPEECH: Record<string, (title: string, dosage?: string) => string> = {
  hi: (title, dosage) =>
    `नमस्ते दादाजी। आपकी ${title}${dosage ? ` यानी ${dosage}` : ""} लेने का समय हो गया है। कृपया आराम से पानी के साथ इसे ले लीजिए।`,
  as: (title, dosage) =>
    `নমস্কাৰ বৰদেউতা। আপোনাৰ ${title}${dosage ? ` অৰ্থাৎ ${dosage}` : ""} খোৱাৰ সময় হৈছে। অনুগ্ৰহ কৰি পানীৰ সৈতে ঔষধখিনি লওক।`,
  bn: (title, dosage) =>
    `নমস্কার দাদু। আপনার ${title}${dosage ? ` অর্থাৎ ${dosage}` : ""} নেওয়ার সময় হয়েছে। দয়া করে জলের সাথে ওষুধটি খেয়ে নিন।`,
  mni: (title, dosage) =>
    `ꯏꯄꯥ, ꯅꯍꯥꯛꯀꯤ ${title}${dosage ? ` (${dosage})` : ""} ꯍꯤꯗꯥꯛ ꯆꯥꯕꯒꯤ ꯃꯇꯝ ꯑꯣꯏꯔꯦ। ꯏꯁꯤꯡꯒꯥ ꯂꯣꯌꯅꯅꯥ ꯊꯛꯄꯤꯌꯨ।`,
  brx: (title, dosage) =>
    `आफा, नोंथांनि ${title}${dosage ? ` (${dosage})` : ""} मुलिखौ जानो सम जाबाय। अननानै दैजों लोगोसे मुलिखौ जादो।`,
  kha: (title, dosage) =>
    `Kpa, la dei ka por ban shim ïa ka dawai ${title}${dosage ? ` (${dosage})` : ""}. Sngewbha shim lem bad ka um.`,
  lus: (title, dosage) =>
    `Ka pa, i damdawi ${title}${dosage ? ` (${dosage})` : ""} ei a hun ta e. Tui nen tlem te in la, ei rawh le.`,
  en: (title, dosage) =>
    `Hello grandfather. It is time for your ${title}${dosage ? `, which is ${dosage}` : ""}. Please take it gently with a glass of water.`,
};

// ── 3. Resilient Multi-Tier Speech Synthesizer ───────────────────────
export interface SpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
  rate?: number;
  pitch?: number;
  gender?: "female" | "male";
}

/**
 * Selects the highest quality, most natural, human-sounding voice available on the device.
 * Actively demotes and penalizes mechanical, robotic system voices (like eSpeak or default monotone synthesizers).
 */
export function selectBestNaturalVoice(
  voices: SpeechSynthesisVoice[],
  targetLang: string
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const targetClean = targetLang.toLowerCase().replace("_", "-");
  const targetPrefix = targetClean.split("-")[0];

  let bestVoice: SpeechSynthesisVoice | null = null;
  let bestScore = -9999;

  for (const v of voices) {
    let score = 0;
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase().replace("_", "-");

    // 1. Language Match Quality
    if (lang === targetClean) {
      score += 200; // Exact dialect (e.g. hi-IN, bn-IN, as-IN, en-IN)
    } else if (lang.startsWith(targetPrefix)) {
      score += 120; // Same language root
    } else if (lang.includes("in") || name.includes("india")) {
      score += 60; // Familiar Indian accent & cadence for NER elders
    } else if (lang.startsWith("en")) {
      score += 30; // English fallback
    }

    // 2. High-Definition & Natural Speech Engine Bonuses (avoids system voice)
    if (name.includes("natural")) score += 100;
    if (name.includes("neural")) score += 100;
    if (name.includes("google")) score += 80; // Google Cloud/Wavenet voices on Android & Chrome sound remarkably human
    if (name.includes("premium")) score += 70;
    if (name.includes("enhanced")) score += 70;
    if (name.includes("siri")) score += 60;
    if (name.includes("online")) score += 50;

    // 3. Warm, Soothing, Motherly Timbre (psychiatrically proven to soothe dementia restlessness)
    if (
      name.includes("swara") ||
      name.includes("neerja") ||
      name.includes("priya") ||
      name.includes("zira") ||
      name.includes("samantha") ||
      name.includes("veena") ||
      name.includes("kavya") ||
      name.includes("ananya") ||
      name.includes("female")
    ) {
      score += 45;
    }

    // 4. Heavy Penalty for Mechanical / Robotic / Flat System Voices
    if (
      name.includes("espeak") ||
      name.includes("desktop") ||
      name.includes("compact") ||
      name.includes("robotic") ||
      name.includes("sampler") ||
      name.includes("system")
    ) {
      score -= 120;
    }

    // Remote voices on Chrome/Android often have higher acoustic fidelity
    if (v.localService === false) {
      score += 30;
    }

    if (score > bestScore) {
      bestScore = score;
      bestVoice = v;
    }
  }

  return bestVoice || voices[0] || null;
}

/**
 * Strips markdown, emojis, and formats text for natural, prosodic human speech.
 * Inserts breath pauses at punctuation so the synthesizer sounds like a compassionate person.
 */
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/[#*_~`>]/g, "") // markdown symbols
    .replace(/\(.*?\)/g, "") // parenthetical clinical notes
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "") // emojis
    .replace(/([।!?\.])\s*/g, "$1 ... ") // add natural breath pause after sentences
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Speaks text using the device speech synthesis engine with elderly calibration.
 * Features natural voice selection, warm pitch (1.04), and conversational pacing (0.88x).
 */
export function speakSpokenVoice(
  text: string,
  language: string = "en",
  options: SpeakOptions = {}
): boolean {
  if (typeof window === "undefined") {
    options.onError?.();
    return false;
  }

  const cleanText = cleanTextForSpeech(text);
  if (!cleanText) {
    options.onEnd?.();
    return false;
  }

  // Pre-speech calming chime for auditory attention
  playGentleChime();

  if (!("speechSynthesis" in window) || !window.speechSynthesis) {
    console.debug("WebSpeech not supported, playing parametric harmonic chime");
    playParametricFormantCadence(cleanText.length);
    setTimeout(() => options.onEnd?.(), 1500);
    return true;
  }

  try {
    // Cancel any stuck utterances and resume audio pipe
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Map language to BCP-47 tag
    const langMap: Record<string, string> = {
      as: "as-IN",
      bn: "bn-IN",
      hi: "hi-IN",
      mni: "mni-IN",
      brx: "hi-IN",
      kha: "en-IN",
      lus: "en-IN",
      en: "en-IN",
    };
    const targetLang = (langMap[language] || "en-IN").toLowerCase();
    utterance.lang = targetLang;

    // Geriatric prosody: 0.88x speed and 1.04 warm pitch for compassionate tone
    utterance.rate = options.rate ?? 0.88;
    utterance.pitch = options.pitch ?? 1.04;
    utterance.volume = 1.0;

    // Get fresh voices if cached is empty
    let voices = cachedVoices;
    if (!voices || voices.length === 0) {
      voices = window.speechSynthesis.getVoices() || [];
      cachedVoices = voices;
    }

    if (voices && voices.length > 0) {
      const bestVoice = selectBestNaturalVoice(voices, targetLang);
      if (bestVoice) {
        utterance.voice = bestVoice;
        if (!bestVoice.lang.toLowerCase().startsWith(targetLang.split("-")[0])) {
          utterance.lang = bestVoice.lang;
        }
      }
    }

    let hasEnded = false;
    const safeComplete = () => {
      if (!hasEnded) {
        hasEnded = true;
        options.onEnd?.();
      }
    };

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = () => {
      safeComplete();
    };

    utterance.onerror = (e) => {
      console.debug("Speech synthesis error event:", e);
      // If native TTS fails (e.g. language-unavailable), provide audio cadence fallback
      playParametricFormantCadence(cleanText.length);
      safeComplete();
    };

    // Safety timeout: prevent UI being permanently stuck in "speaking" state if browser hangs
    const expectedDurationMs = Math.max(2500, (cleanText.length / 10) * 1000);
    setTimeout(() => {
      if (!hasEnded && window.speechSynthesis.speaking) {
        window.speechSynthesis.resume(); // nudge Chrome if stalled
      }
      setTimeout(safeComplete, 2000);
    }, expectedDurationMs);

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.debug("Speech execution error, falling back to harmonic chime:", err);
    playParametricFormantCadence(cleanText.length);
    options.onEnd?.();
    return false;
  }
}

/**
 * Speaks an actionable, reassuring voice reminder for medication, hydration, or daily routine.
 */
export function speakReminderVoice(
  reminder: { title: string; dosage?: string; type?: string; time?: string },
  language: string = "en",
  onEnd?: () => void
): boolean {
  const speechFn = REGIONAL_REMINDER_SPEECH[language] || REGIONAL_REMINDER_SPEECH.en;
  const prompt = speechFn(reminder.title, reminder.dosage);
  return speakSpokenVoice(prompt, language, { onEnd, rate: 0.82 });
}

/**
 * Stops any currently active speech synthesis immediately.
 */
export function stopAllSpeech(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Parametric audio cadence for environments where SpeechSynthesis is unavailable or muted.
 * Plays a gentle, calming 3-tone musical phrase matching conversational rhythm.
 */
function playParametricFormantCadence(charLength: number): void {
  const notes = [392.0, 440.0, 523.25, 659.25]; // G4, A4, C5, E5
  const count = Math.min(6, Math.max(3, Math.floor(charLength / 25)));
  for (let i = 0; i < count; i++) {
    const note = notes[i % notes.length];
    setTimeout(() => {
      playTone(note, 0.22, "sine");
    }, i * 180);
  }
}
