// ── SMRITI-NER ANTI-AGITATION CIRCUIT BREAKER (AACB) ENGINE ──────────────
// Sub-Phase 4.5: Continuous Agitation Vulnerability Index (AVI), Visual Scaffolding,
// Kinship Voice Cues in 8 Regional Languages, and Zero-Failure Audio Guard.

import { evaluateAACB, type AACBEvaluation } from "./dcdaEngine";

export interface AACBState extends AACBEvaluation {
  targetId?: string;
  activeGameId?: string;
  kinshipTitle?: string;
  nativeVoiceCue?: string;
  lastTriggeredAt?: string;
}

export type AACBListener = (state: AACBState) => void;

// ── Regional Kinship Voice Prompts (8 Languages) ─────────────────
export interface RegionalKinshipVoice {
  code: string;
  title: string;
  nativeTitle: string;
  cueText: string;
  nativeCueText: string;
}

export const KINSHIP_VOICE_PROMPTS: Record<string, RegionalKinshipVoice> = {
  as: {
    code: "as",
    title: "Bor-Deuta",
    nativeTitle: "বৰদেউতা",
    cueText: "Don't worry at all father, look at the golden glowing item, we will do it together.",
    nativeCueText: "একো চিন্তা নকৰিব দেউতা, সোণালী ৰঙৰ বস্তুটো চাওকচোন, আমি একেলগে কৰিম।",
  },
  bn: {
    code: "bn",
    title: "Dadu",
    nativeTitle: "দাদু",
    cueText: "No worries grandfather, look towards the golden color, we are doing it together.",
    nativeCueText: "কোনো চিন্তা নেই দাদু, সোনালী রঙের দিকে দেখুন, আমরা একসঙ্গে করছি।",
  },
  mni: {
    code: "mni",
    title: "Ipa",
    nativeTitle: "ꯏꯄꯥ",
    cueText: "Do not worry father, look at the one glowing with golden light.",
    nativeCueText: "ꯋꯥꯈꯜ ꯋꯥꯕꯤꯒꯅꯨ ꯏꯄꯥ, ꯁꯅꯥꯃꯆꯨꯒꯤ ꯃꯉꯥꯜ ꯑꯣꯏꯔꯤꯕ ꯑꯗꯨ ꯌꯦꯡꯕꯤꯌꯨ।",
  },
  brx: {
    code: "brx",
    title: "Aabou",
    nativeTitle: "आबौ",
    cueText: "Do not fear grandfather, look at the golden shine, we do it together.",
    nativeCueText: "गिखांनो नाङा आबौ, सोनानि गाब जोंनायखौ नायदो, जों लोगोसे खालामनो।",
  },
  kha: {
    code: "kha",
    title: "Paieid",
    nativeTitle: "Paieid",
    cueText: "Do not worry father, look at the golden shining picture, let us do it together.",
    nativeCueText: "Wat pynsalia me Paieid, peit ia ka dur ba phyrnai ksiar, ngin leh lang.",
  },
  lus: {
    code: "lus",
    title: "Ka Pu",
    nativeTitle: "Ka Pu",
    cueText: "Do not be anxious grandfather, look at that beautiful golden light, we will do it together.",
    nativeCueText: "Mangang suh pu, rangkachak eng mawi tak kha en rawh le, kan ti dun dawn nia.",
  },
  hi: {
    code: "hi",
    title: "Dadaji",
    nativeTitle: "दादाजी",
    cueText: "No problem grandfather, look at the golden glowing option, we will do it together.",
    nativeCueText: "कोई बात नहीं दादाजी, सुनहरे चमकते हुए विकल्प को देखिए, हम साथ में करेंगे।",
  },
  en: {
    code: "en",
    title: "Grandfather",
    nativeTitle: "Grandfather",
    cueText: "Take your time, let's look together at the golden glowing option.",
    nativeCueText: "Take your time, let's look together at the golden glowing option.",
  },
};

class AACBEngine {
  private state: AACBState = {
    avi: 0,
    triggered: false,
    consecutiveErrors: 0,
    goldenHaloActive: false,
    distractorDimming: 1.0,
    hitboxMultiplier: 1.0,
  };

  private listeners: Set<AACBListener> = new Set();
  private speechUtterance: SpeechSynthesisUtterance | null = null;

  /**
   * Subscribe to real-time AACB state changes
   */
  public subscribe(listener: AACBListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get current state snapshot
   */
  public getState(): AACBState {
    return { ...this.state };
  }

  /**
   * Record a user miss/error and recalculate AVI
   */
  public recordError(params: {
    gameId?: string;
    targetId?: string;
    deliberationMs?: number;
    language?: string;
  }): AACBState {
    const consecutive = this.state.consecutiveErrors + 1;
    const deliberationMs = params.deliberationMs ?? 950;
    const evalResult = evaluateAACB(consecutive, deliberationMs);

    const lang = params.language || "as";
    const kinship = KINSHIP_VOICE_PROMPTS[lang] || KINSHIP_VOICE_PROMPTS.as;

    this.state = {
      ...evalResult,
      targetId: params.targetId,
      activeGameId: params.gameId,
      kinshipTitle: kinship.nativeTitle,
      nativeVoiceCue: evalResult.triggered ? kinship.nativeCueText : undefined,
      lastTriggeredAt: evalResult.triggered ? new Date().toISOString() : this.state.lastTriggeredAt,
    };

    if (evalResult.triggered) {
      this.speakVoiceCue(kinship.nativeCueText, lang);
    }

    this.notifyListeners();
    return this.getState();
  }

  /**
   * Record a user success — immediately deactivates circuit breaker
   */
  public recordSuccess(): AACBState {
    this.stopVoiceCue();

    this.state = {
      avi: 0,
      triggered: false,
      consecutiveErrors: 0,
      goldenHaloActive: false,
      distractorDimming: 1.0,
      hitboxMultiplier: 1.0,
      targetId: undefined,
      nativeVoiceCue: undefined,
      guidanceMessage: undefined,
    };

    this.notifyListeners();
    return this.getState();
  }

  /**
   * Reset engine state manually
   */
  public reset(): void {
    this.recordSuccess();
  }

  /**
   * Speak soothing voice prompt via Web Speech API
   */
  public speakVoiceCue(text: string, lang = "as"): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.82; // Gentle slow pace for elders
      utterance.pitch = 1.05; // Warm, comforting pitch
      utterance.volume = 0.9;

      // Language code fallback mapping
      if (lang === "as" || lang === "bn") {
        utterance.lang = "bn-IN";
      } else if (lang === "hi" || lang === "brx") {
        utterance.lang = "hi-IN";
      } else {
        utterance.lang = "en-IN";
      }

      this.speechUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Graceful fallback
    }
  }

  public stopVoiceCue(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Audio Suppression Guard: Checks if a sound frequency / wave is safe
   * Strictly disallows harsh dissonance or alarm buzzers (e.g. 100-240Hz square/sawtooth buzzers)
   */
  public isAudioPermitted(freq: number, type: OscillatorType): boolean {
    // Prohibit harsh buzzer frequencies on square/sawtooth
    if ((type === "square" || type === "sawtooth") && freq < 260) {
      return false; // Suppressed: Harsh error buzzer signature
    }
    return true;
  }

  private notifyListeners(): void {
    const snapshot = this.getState();
    this.listeners.forEach((listener) => listener(snapshot));
  }
}

export const aacbEngine = new AACBEngine();
