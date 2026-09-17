// ── SMRITI-NER AUDIO & RESILIENT GERIATRIC SPEECH ENGINE ────────────────────
// Fixed: Android V8 garbage collection prevention, cancel-before-speak race condition,
// removal of queue-blocking silent space utterance, and intelligent Indic dialect resolution.

"use client";

import { playTone } from "./audio";

// ── 1. Global User-Gesture Audio Context & WebSpeech Unlocker ─────────
let isAudioUnlocked = false;
let unlockedAudioContext: AudioContext | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];
let activeUtterance: SpeechSynthesisUtterance | null = null;
let keepAliveTimer: number | null = null;
let pendingSpeechTimeout: number | null = null;

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

    // 2. Unpause WebSpeech Synthesis safely
    // (Note: Do NOT speak an empty space " ", which stalls Android TTS queues indefinitely)
    try {
      if ("speechSynthesis" in window && window.speechSynthesis) {
        window.speechSynthesis.resume();
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
 * Intelligent voice & dialect resolver.
 * Ensures an active voice is always paired with a valid, supported BCP-47 locale tag,
 * avoiding silent failure on Android when regional voice packs are absent.
 */
export function selectBestNaturalVoice(
  voices: SpeechSynthesisVoice[],
  targetLang: string
): { voice: SpeechSynthesisVoice | null; actualLang: string } {
  if (!voices || voices.length === 0) {
    return { voice: null, actualLang: "en-IN" };
  }

  const targetPrefix = targetLang.toLowerCase().split("-")[0];

  // Language fallback hierarchy for Northeast regional scripts
  const searchPrefixes: string[] = [];
  if (targetPrefix === "as") {
    searchPrefixes.push("as", "bn", "hi", "en");
  } else if (targetPrefix === "bn") {
    searchPrefixes.push("bn", "as", "hi", "en");
  } else if (targetPrefix === "hi" || targetPrefix === "brx") {
    searchPrefixes.push("hi", "en");
  } else if (targetPrefix === "mni") {
    searchPrefixes.push("mni", "bn", "hi", "en");
  } else if (targetPrefix === "kha" || targetPrefix === "lus") {
    searchPrefixes.push("en", "hi");
  } else {
    searchPrefixes.push("en", "hi");
  }

  for (const prefix of searchPrefixes) {
    let bestCandidate: SpeechSynthesisVoice | null = null;
    let bestScore = -9999;

    for (const v of voices) {
      const vLang = v.lang.toLowerCase().replace("_", "-");
      const vPrefix = vLang.split("-")[0];
      const name = v.name.toLowerCase();

      if (vPrefix !== prefix) continue;

      let score = 0;
      if (vLang.includes("in") || name.includes("india")) score += 80;
      if (name.includes("natural")) score += 100;
      if (name.includes("neural")) score += 100;
      if (name.includes("google")) score += 80;
      if (name.includes("female") || name.includes("neerja") || name.includes("swara") || name.includes("priya")) score += 40;

      // Penalize robotic voices
      if (name.includes("espeak") || name.includes("sampler") || name.includes("compact")) score -= 100;

      if (score > bestScore) {
        bestScore = score;
        bestCandidate = v;
      }
    }

    if (bestCandidate) {
      return {
        voice: bestCandidate,
        actualLang: bestCandidate.lang || (prefix === "en" ? "en-IN" : `${prefix}-IN`),
      };
    }
  }

  // Final fallback: use the first available voice on the device
  const defaultVoice = voices.find((v) => v.default) || voices[0];
  return {
    voice: defaultVoice,
    actualLang: defaultVoice?.lang || "en-US",
  };
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
 * Features natural voice selection, warm pitch (1.0), conversational pacing (0.88x),
 * and persistent memory protection against Android V8 garbage collection.
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

  // 0. HARDWARE AUDIO PRIORITY: Android Native Hardware TextToSpeech Bridge
  // Bypasses Android WebView limitation where window.speechSynthesis has no audio pipeline
  if (typeof window !== "undefined" && (window as any).SmritiNativeTTS) {
    try {
      (window as any).SmritiNativeTTS.speak(cleanText, language);
      const wordCount = cleanText.split(/\s+/).length;
      const durationMs = Math.max(1200, (wordCount / 2.3) * 1000);
      if (options.onEnd) {
        setTimeout(options.onEnd, durationMs);
      }
      return true;
    } catch (nativeErr) {
      console.warn("SmritiNativeTTS bridge error, falling back to Web Speech:", nativeErr);
    }
  }

  if (!("speechSynthesis" in window) || !window.speechSynthesis) {
    playParametricFormantCadence(cleanText.length);
    setTimeout(() => options.onEnd?.(), 1200);
    return true;
  }

  try {
    // 1. Cancel previous pending speech and cancel any stuck speech
    if (pendingSpeechTimeout) {
      clearTimeout(pendingSpeechTimeout);
      pendingSpeechTimeout = null;
    }
    if (keepAliveTimer) {
      clearInterval(keepAliveTimer);
      keepAliveTimer = null;
    }

    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    if (window.speechSynthesis.paused) {
      try {
        window.speechSynthesis.resume();
      } catch {}
    }

    // 2. Wait 70ms before speaking to let Android native TextToSpeech binder reset
    pendingSpeechTimeout = window.setTimeout(() => {
      executeSpeechSynthesis(cleanText, language, options);
    }, 70);

    return true;
  } catch (err) {
    console.warn("speakSpokenVoice error:", err);
    playParametricFormantCadence(cleanText.length);
    options.onError?.();
    return false;
  }
}

/**
 * Internal execution with persistent utterance reference
 */
function executeSpeechSynthesis(
  cleanText: string,
  language: string,
  options: SpeakOptions
): void {
  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Retrieve fresh voices
    let voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) {
      voices = cachedVoices || [];
    }

    const { voice, actualLang } = selectBestNaturalVoice(voices, language);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || actualLang;
    } else {
      utterance.lang = actualLang;
    }

    // Geriatric prosody: 0.88x speed and 1.0 pitch for compassionate, clear tone
    utterance.rate = options.rate ?? 0.88;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = 1.0;

    let hasEnded = false;
    const safeComplete = () => {
      if (!hasEnded) {
        hasEnded = true;
        if (keepAliveTimer) {
          clearInterval(keepAliveTimer);
          keepAliveTimer = null;
        }
        activeUtterance = null;
        if (typeof window !== "undefined") {
          (window as unknown as { __smritiSpeechActiveUtterance: unknown }).__smritiSpeechActiveUtterance = null;
        }
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
      console.debug("Speech synthesis notice:", e?.error);
      if (e?.error !== "canceled" && e?.error !== "interrupted") {
        playParametricFormantCadence(cleanText.length);
      }
      safeComplete();
    };

    // Store in module variable AND window global to completely prevent V8 GC collection
    activeUtterance = utterance;
    if (typeof window !== "undefined") {
      (window as unknown as { __smritiSpeechActiveUtterance: unknown }).__smritiSpeechActiveUtterance = utterance;
    }

    // Keep-alive ping for Android Chrome WebView (prevents pausing on long utterances)
    keepAliveTimer = window.setInterval(() => {
      if (typeof window !== "undefined" && window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.resume();
      }
    }, 2500);

    // Safety timeout: prevent UI being permanently stuck in "speaking" state
    const expectedDurationMs = Math.max(3000, (cleanText.length / 8) * 1000);
    setTimeout(() => {
      if (!hasEnded && window.speechSynthesis && !window.speechSynthesis.speaking) {
        safeComplete();
      }
    }, expectedDurationMs + 2000);

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("executeSpeechSynthesis failure, playing chime fallback:", err);
    playParametricFormantCadence(cleanText.length);
    options.onError?.();
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
  if (pendingSpeechTimeout) {
    clearTimeout(pendingSpeechTimeout);
    pendingSpeechTimeout = null;
  }
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
  if (typeof window !== "undefined" && (window as any).SmritiNativeTTS) {
    try {
      (window as any).SmritiNativeTTS.stop();
    } catch {}
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
  activeUtterance = null;
  if (typeof window !== "undefined") {
    (window as unknown as { __smritiSpeechActiveUtterance: unknown }).__smritiSpeechActiveUtterance = null;
  }
}

/**
 * Parametric audio cadence for environments where SpeechSynthesis is unavailable or muted.
 * Plays a gentle, calming 3-tone musical phrase matching conversational rhythm.
 */
function playParametricFormantCadence(charLength: number): void {
  const notes = [392.0, 440.0, 523.25, 659.25]; // G4, A4, C5, E5
  const count = Math.min(5, Math.max(2, Math.floor(charLength / 30)));
  for (let i = 0; i < count; i++) {
    const note = notes[i % notes.length];
    setTimeout(() => {
      playTone(note, 0.22, "sine");
    }, i * 180);
  }
}
