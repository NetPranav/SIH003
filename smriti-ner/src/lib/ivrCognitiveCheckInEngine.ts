/**
 * Smriti-NER (স্মৃতি) — Sub-Phase 8.1: IVR Cognitive Check-In Engine
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Clinical Focus:
 * Zero-Smartphone Accessibility via TICS (Telephone Interview for Cognitive Status),
 * Delayed 3-Word Recall & Orientation Assessment for 2G Feature Phones.
 */

import { SupportedVoiceLanguage } from "./bhashiniVoiceService";

export type IVRSessionStatus =
  | "INITIALIZED"
  | "WORD_PRESENTATION"
  | "ORIENTATION_QUESTION"
  | "DELAYED_RECALL"
  | "COMPLETED"
  | "DROPPED";

export type CognitiveStatusLabel =
  | "NORMAL_STABLE"
  | "MILD_FLUCTUATION"
  | "ATTENTION_SUGGESTED";

export interface IVRWordTriplet {
  words: [string, string, string];
  phonetics: [string, string, string];
  theme: string;
}

export interface IVRCheckInSession {
  sessionId: string;
  patientId: string;
  patientName: string;
  phoneNumber: string;
  language: SupportedVoiceLanguage;
  status: IVRSessionStatus;
  wordsPresented: string[];
  orientationAnswered: boolean;
  orientationCorrect: boolean;
  orientationInputMethod: "DTMF" | "VOICE" | "NONE";
  wordsRecalled: string[];
  recallScore: number; // 0 to 3
  compositeScore: number; // 0 to 100
  statusLabel: CognitiveStatusLabel;
  startedAt: string;
  completedAt?: string;
}

export const CULTURAL_WORD_TRIPLETS: Record<SupportedVoiceLanguage, IVRWordTriplet> = {
  as: {
    words: ["গামোচা", "জাঁপী", "কাজিৰঙা"],
    phonetics: ["Gamusa", "Jaapi", "Kaziranga"],
    theme: "Handloom, Conical Hat & Sanctuary",
  },
  mni: {
    words: ["ꯂꯩꯔꯨꯝ", "ꯄꯨꯡ", "ꯂꯣꯛꯇꯥꯛ"],
    phonetics: ["Leirum", "Pung", "Loktak"],
    theme: "Sacred Cloth, Drum & Freshwater Lake",
  },
  bn: {
    words: ["গামছা", "ঢাক", "সুন্দরবন"],
    phonetics: ["Gamcha", "Dhaak", "Sundarban"],
    theme: "Textile, Festive Drum & Mangrove Forest",
  },
  brx: {
    words: ["दखना", "सिफुं", "मानस"],
    phonetics: ["Dokhona", "Sifung", "Manas"],
    theme: "Traditional Attire, Flute & National Park",
  },
  kha: {
    words: ["Jainsem", "Duitara", "Umiam"],
    phonetics: ["Jainsem", "Duitara", "Umiam"],
    theme: "Khasi Attire, 2-String Lute & Lake",
  },
  lus: {
    words: ["Puanchei", "Khuang", "Reiek"],
    phonetics: ["Puanchei", "Khuang", "Reiek"],
    theme: "Heritage Weave, Drum & Mountain Peak",
  },
  hi: {
    words: ["शॉल", "ढोलक", "गंगा"],
    phonetics: ["Shawl", "Dholak", "Ganga"],
    theme: "Attire, Drum & River",
  },
  en: {
    words: ["Shawl", "Flute", "Mountain"],
    phonetics: ["Shawl", "Flute", "Mountain"],
    theme: "Elder Familiar General Items",
  },
};

export class IvrCognitiveCheckInEngine {
  private static sessions: Map<string, IVRCheckInSession> = new Map();

  /**
   * Starts a new IVR cognitive check-in session and presents the 3-word triplet
   */
  public static startSession(params: {
    patientId: string;
    patientName: string;
    phoneNumber: string;
    language?: SupportedVoiceLanguage;
  }): IVRCheckInSession {
    const lang = params.language || "as";
    const sessionId = `ivr_sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const triplet = CULTURAL_WORD_TRIPLETS[lang] || CULTURAL_WORD_TRIPLETS.en;

    const session: IVRCheckInSession = {
      sessionId,
      patientId: params.patientId,
      patientName: params.patientName,
      phoneNumber: params.phoneNumber,
      language: lang,
      status: "WORD_PRESENTATION",
      wordsPresented: [...triplet.words],
      orientationAnswered: false,
      orientationCorrect: false,
      orientationInputMethod: "NONE",
      wordsRecalled: [],
      recallScore: 0,
      compositeScore: 0,
      statusLabel: "NORMAL_STABLE",
      startedAt: new Date().toISOString(),
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Processes orientation answer via DTMF (1=Morning, 2=Evening) or Voice
   */
  public static submitOrientation(
    sessionId: string,
    params: {
      inputMethod: "DTMF" | "VOICE";
      dtmfDigit?: string;
      spokenText?: string;
      currentHour?: number; // Optional 0-23 for automated ground truth
    }
  ): IVRCheckInSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`IVR Session '${sessionId}' not found.`);
    }

    const hour = params.currentHour !== undefined ? params.currentHour : new Date().getHours();
    const isActuallyMorning = hour >= 4 && hour < 16;

    let isCorrect = false;
    if (params.inputMethod === "DTMF") {
      // '1' denotes Morning, '2' denotes Evening
      if (params.dtmfDigit === "1" && isActuallyMorning) isCorrect = true;
      if (params.dtmfDigit === "2" && !isActuallyMorning) isCorrect = true;
    } else {
      const txt = (params.spokenText || "").toLowerCase();
      const morningTokens = ["পুৱা", "ৰাতিপুৱা", "morning", "puwa", "সকাল", "ꯑꯌꯨꯛ", "फुं", "step", "zing", "सुबह"];
      const eveningTokens = ["গধূলি", "সন্ধিয়া", "evening", "godhuli", "সন্ধ্যা", "ꯅꯨꯃꯤꯗꯥꯡ", "बेलासे", "janmiet", "tlai", "शाम"];

      const matchedMorning = morningTokens.some((t) => txt.includes(t));
      const matchedEvening = eveningTokens.some((t) => txt.includes(t));

      if (matchedMorning && isActuallyMorning) isCorrect = true;
      if (matchedEvening && !isActuallyMorning) isCorrect = true;
    }

    session.orientationAnswered = true;
    session.orientationCorrect = isCorrect;
    session.orientationInputMethod = params.inputMethod;
    session.status = "DELAYED_RECALL";

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Evaluates recalled words from the elder after the orientation delay
   */
  public static submitDelayedRecall(
    sessionId: string,
    recalledWords: string[]
  ): IVRCheckInSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`IVR Session '${sessionId}' not found.`);
    }

    const targetWords = session.wordsPresented.map((w) => w.toLowerCase().trim());
    const matchedWords: string[] = [];

    recalledWords.forEach((word) => {
      const clean = word.toLowerCase().trim();
      const matchedTarget = targetWords.find((t) => t.includes(clean) || clean.includes(t));
      if (matchedTarget && !matchedWords.includes(matchedTarget)) {
        matchedWords.push(matchedTarget);
      }
    });

    session.wordsRecalled = matchedWords;
    session.recallScore = Math.min(3, matchedWords.length);
    session.status = "COMPLETED";
    session.completedAt = new Date().toISOString();

    // Composite Score calculation: (0.4 * orient + 0.6 * (recall / 3)) * 100
    const orientVal = session.orientationCorrect ? 1.0 : 0.0;
    const recallVal = session.recallScore / 3.0;
    const composite = Math.round((0.4 * orientVal + 0.6 * recallVal) * 100);

    session.compositeScore = composite;
    if (composite >= 75) {
      session.statusLabel = "NORMAL_STABLE";
    } else if (composite >= 50) {
      session.statusLabel = "MILD_FLUCTUATION";
    } else {
      session.statusLabel = "ATTENTION_SUGGESTED";
    }

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Retrieves an IVR session state
   */
  public static getSession(sessionId: string): IVRCheckInSession | undefined {
    return this.sessions.get(sessionId);
  }
}
