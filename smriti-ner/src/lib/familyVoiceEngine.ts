/**
 * Smriti-NER (স্মৃতি) — Personalized Family Voice Engine
 * Sub-Phase 6.3: Personalized Family Voice System
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Clinical Focus:
 * Anchors disoriented elders using authentic familiar kinship recordings
 * to increase medication/hydration adherence and rapidly de-escalate agitation.
 */

import { SupportedVoiceLanguage } from "./bhashiniVoiceService";

export type FamilyVoiceCategory =
  | "MEDICATION"
  | "HYDRATION"
  | "MORNING_GREETING"
  | "EVENING_CALM"
  | "CUSTOM_REASSURANCE";

export type FamilyRelation =
  | "granddaughter"
  | "grandson"
  | "daughter"
  | "son"
  | "spouse";

export interface FamilyVoiceClip {
  id: string;
  category: FamilyVoiceCategory;
  recordedBy: string;
  relation: FamilyRelation;
  language: SupportedVoiceLanguage;
  transcriptText: string;
  audioDataUri: string;
  durationSec: number;
  qualityRating: "POOR" | "FAIR" | "OPTIMAL";
  sha256Hash: string;
  avatarUrl?: string;
  createdAt: string;
  lastPlayedAt?: string;
  playCount: number;
}

export interface GuidedVoiceScript {
  category: FamilyVoiceCategory;
  title: string;
  recommendedDurationSec: number;
  scripts: Record<SupportedVoiceLanguage, string>;
}

export const GUIDED_VOICE_SCRIPTS: GuidedVoiceScript[] = [
  {
    category: "MEDICATION",
    title: "Medication Adherence Prompt",
    recommendedDurationSec: 15,
    scripts: {
      as: "আইতা, মই মুনমী। এয়া আপোনাৰ ঔষধ খোৱাৰ সময় হ'ল। কুহুমীয়া পানীৰে টেবলেটটো খাই লওকচোন।",
      mni: "ꯏꯃꯥ, ꯑꯩꯉꯣꯟꯗ ꯏꯕꯦꯝꯃꯅꯤ꯫ ꯍꯤꯗꯥꯛ ꯆꯥꯕꯒꯤ ꯃꯇꯝ ꯑꯣꯏꯔꯦ꯫ ꯏꯁꯤꯡ ꯊꯛꯂꯒꯥ ꯆꯥꯕꯤꯌꯨ꯫",
      bn: "দাদু, আমি মিষ্টি। ওষুধ খাওয়ার সময় হয়েছে। ঈষদুষ্ণ জল দিয়ে খেয়ে নিন।",
      brx: "आबौ, आं मनि। मुलि लोंनायनि सम जाबाय। अननानै मुलि लोंदो।",
      kha: "Ka Mei, dei ka por ban dih dawai. Dih da ka um kaba thik pait.",
      lus: "Ka Pi, damdawi ei a hun tawh e. Tui lum nen ei rawh le.",
      hi: "दादीजी, मैं रिया। आपकी दवाई का समय हो गया है। गुनगुने पानी के साथ ले लीजिए।",
      en: "Grandmother, it is time to take your evening medicine with warm water.",
    },
  },
  {
    category: "HYDRATION",
    title: "Hydration Encouragement Prompt",
    recommendedDurationSec: 10,
    scripts: {
      as: "ককা, অলপ পানী খাই লওকচোন, গাটো শীতল লাগিব।",
      mni: "ꯏꯄꯥ, ꯏꯁꯤꯡ ꯈꯔꯥ ꯊꯛꯄꯤꯌꯨ, ꯍꯀꯆꯥꯡ ꯅꯨꯡꯉꯥꯏꯒꯅꯤ꯫",
      bn: "দিদা, একটু জল খেয়ে নিন, শরীর ভালো থাকবে।",
      brx: "आबौ, इसे दै लोंना लादो, देहाया मोजां थागोन।",
      kha: "U Kpa, dih khyndiat ka um ba koit ba khiah.",
      lus: "Ka Pu, tui in leh la i harh hawk ang.",
      hi: "दादाजी, थोड़ा पानी पी लीजिए, ताजगी महसूस होगी।",
      en: "Grandfather, please take a sip of fresh water to stay hydrated.",
    },
  },
  {
    category: "EVENING_CALM",
    title: "Twilight De-Escalation & Reassurance",
    recommendedDurationSec: 20,
    scripts: {
      as: "আইতা, একো চিন্তা নকৰিব। আপুনি নিজৰ ঘৰতেই সপৰিয়ালে শান্তিত আছে। এতিয়া জিৰণি লওক।",
      mni: "ꯏꯃꯥ, ꯋꯥꯈꯜ ꯇꯥꯅꯕꯥ ꯇꯧꯕꯤꯒꯅꯨ꯫ ꯑꯗꯣꯝ ꯌꯨꯃꯗꯥ ꯏꯃꯨꯡꯒꯥ ꯂꯣꯌꯅꯅꯥ ꯂꯩꯔꯤ꯫",
      bn: "দাদু, কোনো ভয় নেই। আপনি নিজের ঘরেই সবার সাথে নিরাপদে আছেন। এখন বিশ্রাম নিন।",
      brx: "आबौ, दा गि। नोंथाङा न'आवनो रैखाथि जानानै दं। दा जिरायदो।",
      kha: "Ka Mei, wat sngewtriem. Phi don ha la iing ryngkat bad ka kur. Shongthait mynta.",
      lus: "Ka Pi, hlau suh aw. In inah him takin in awm e. Chawl hahdam rawh le.",
      hi: "दादीजी, कोई चिंता की बात नहीं है। आप अपने घर पर सुरक्षित हैं। अब आराम कीजिए।",
      en: "Grandmother, you are safe and warm at home with family. Please rest comfortably now.",
    },
  },
];

/**
 * On-Device Audio Signal Processing Utilities
 */
export class AudioSignalProcessor {
  /**
   * Normalizes audio samples to target peak amplitude (-3.0 dB FS ≈ 0.7079)
   */
  public static normalize(samples: Float32Array, targetPeak: number = 0.7079): Float32Array {
    let maxAbs = 0;
    for (let i = 0; i < samples.length; i++) {
      const absVal = Math.abs(samples[i]);
      if (absVal > maxAbs) maxAbs = absVal;
    }

    if (maxAbs === 0) return new Float32Array(samples);

    const scale = targetPeak / maxAbs;
    const normalized = new Float32Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      normalized[i] = Math.max(-1.0, Math.min(1.0, samples[i] * scale));
    }
    return normalized;
  }

  /**
   * Trims leading and trailing silence (< threshold amplitude)
   */
  public static trimSilence(samples: Float32Array, threshold: number = 0.02): Float32Array {
    let start = 0;
    while (start < samples.length && Math.abs(samples[start]) < threshold) {
      start++;
    }

    let end = samples.length - 1;
    while (end > start && Math.abs(samples[end]) < threshold) {
      end--;
    }

    if (start >= end) return new Float32Array(0);
    return samples.slice(start, end + 1);
  }

  /**
   * Computes quality rating based on peak volume and signal presence
   */
  public static rateQuality(peak: number): "POOR" | "FAIR" | "OPTIMAL" {
    if (peak < 0.15 || peak > 0.98) return "POOR";
    if (peak < 0.35 || peak > 0.85) return "FAIR";
    return "OPTIMAL";
  }

  /**
   * Computes deterministic pseudo SHA-256 hash for integrity tracking
   */
  public static computeHash(text: string, durationSec: number): string {
    const raw = `${text}:${durationSec}:smriti_family_voice_2026`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    return `sha256-${Math.abs(hash).toString(16).padStart(16, "0")}`;
  }
}

/**
 * Family Voice Clip Storage Manager (IndexedDB / LocalStorage)
 * Maximum quota: 10 clips per patient profile
 */
export class FamilyVoiceManager {
  private static STORAGE_KEY = "smriti_family_voice_clips_v1";
  private static MAX_CLIPS = 10;

  public static getAllClips(): FamilyVoiceClip[] {
    if (typeof window === "undefined" || !window.localStorage) {
      return this.getDemonstrationClips();
    }
    try {
      const raw = window.localStorage.getItem(this.STORAGE_KEY);
      if (!raw) {
        const demos = this.getDemonstrationClips();
        this.saveAllClips(demos);
        return demos;
      }
      return JSON.parse(raw);
    } catch {
      return this.getDemonstrationClips();
    }
  }

  public static getClipByCategory(category: FamilyVoiceCategory): FamilyVoiceClip | null {
    const clips = this.getAllClips();
    const matching = clips.filter((c) => c.category === category);
    if (matching.length === 0) return null;
    // Return most recently recorded or lowest play count
    return matching.sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  }

  public static saveClip(
    clipData: Omit<FamilyVoiceClip, "id" | "createdAt" | "playCount">
  ): FamilyVoiceClip {
    const clips = this.getAllClips();

    if (clips.length >= this.MAX_CLIPS) {
      throw new Error(
        `Family voice quota exceeded. Maximum ${this.MAX_CLIPS} clips allowed. Please delete an older recording first.`
      );
    }

    const newClip: FamilyVoiceClip = {
      ...clipData,
      id: `clip-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      playCount: 0,
    };

    clips.push(newClip);
    this.saveAllClips(clips);
    return newClip;
  }

  public static deleteClip(id: string): boolean {
    const clips = this.getAllClips();
    const filtered = clips.filter((c) => c.id !== id);
    if (filtered.length !== clips.length) {
      this.saveAllClips(filtered);
      return true;
    }
    return false;
  }

  public static recordPlayback(id: string): void {
    const clips = this.getAllClips();
    const clip = clips.find((c) => c.id === id);
    if (clip) {
      clip.playCount++;
      clip.lastPlayedAt = new Date().toISOString();
      this.saveAllClips(clips);
    }
  }

  private static saveAllClips(clips: FamilyVoiceClip[]): void {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(clips));
    }
  }

  /**
   * Factory demonstration clips for initial offline out-of-the-box readiness
   */
  public static getDemonstrationClips(): FamilyVoiceClip[] {
    return [
      {
        id: "demo_medication_munmi",
        category: "MEDICATION",
        recordedBy: "মুনমী (নাতিনী)",
        relation: "granddaughter",
        language: "as",
        transcriptText: "আইতা, মই মুনমী। এয়া আপোনাৰ ঔষধ খোৱাৰ সময় হ'ল। কুহুমীয়া পানীৰে টেবলেটটো খাই লওকচোন।",
        audioDataUri: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
        durationSec: 14.5,
        qualityRating: "OPTIMAL",
        sha256Hash: AudioSignalProcessor.computeHash("medication_as", 14.5),
        createdAt: "2026-09-14T08:00:00Z",
        playCount: 4,
      },
      {
        id: "demo_hydration_mizoram",
        category: "HYDRATION",
        recordedBy: "Zoram (Grandson)",
        relation: "grandson",
        language: "lus",
        transcriptText: "Ka Pu, tui lum in a hun tawh e. In leh la i harh hawk ang.",
        audioDataUri: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
        durationSec: 9.8,
        qualityRating: "OPTIMAL",
        sha256Hash: AudioSignalProcessor.computeHash("hydration_lus", 9.8),
        createdAt: "2026-09-14T08:30:00Z",
        playCount: 2,
      },
      {
        id: "demo_evening_calm_manipur",
        category: "EVENING_CALM",
        recordedBy: "Ibemma (Daughter)",
        relation: "daughter",
        language: "mni",
        transcriptText: "ꯏꯃꯥ, ꯋꯥꯈꯜ ꯇꯥꯅꯕꯥ ꯇꯧꯕꯤꯒꯅꯨ꯫ ꯑꯗꯣꯝ ꯌꯨꯃꯗꯥ ꯏꯃꯨꯡꯒꯥ ꯂꯣꯌꯅꯅꯥ ꯂꯩꯔꯤ꯫ ꯍꯧꯖꯤꯛ ꯅꯨꯡꯉꯥꯏꯅꯥ ꯄꯣꯊꯥꯕꯤꯌꯨ꯫",
        audioDataUri: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
        durationSec: 18.2,
        qualityRating: "OPTIMAL",
        sha256Hash: AudioSignalProcessor.computeHash("evening_mni", 18.2),
        createdAt: "2026-09-14T09:00:00Z",
        playCount: 6,
      },
    ];
  }
}
