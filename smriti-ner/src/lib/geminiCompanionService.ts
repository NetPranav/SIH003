/**
 * Smriti-NER Gemini AI Companion Service
 * 
 * Provides culturally-grounded, elder-centric conversational intelligence
 * for dementia patients in Northeast India across 8 regional languages.
 * Connects to Google Gemini text-to-text with speech synthesis (TTS) playback
 * and instant offline reassurance fallback.
 */

import type { ScreenId } from "./types";

export interface CompanionMessage {
  role: "user" | "assistant";
  text: string;
  englishText?: string;
  timestamp: number;
}

export interface CompanionResponse {
  replyText: string;
  englishTranslation: string;
  language: string;
  suggestedScreen?: ScreenId;
  emotionTone: "CALMING" | "VALIDATING" | "REMINISCING" | "REASSURING";
  transcript?: string;
}

// ── Curated Multilingual Elderly Reassurance Knowledge Base ─────────
const OFFLINE_REASSURANCE_MAP: Record<string, Record<string, CompanionResponse>> = {
  hi: {
    location: {
      replyText: "आप अपने परिवार के साथ घर पर पूरी तरह सुरक्षित और आराम से हैं। चिंता की कोई बात नहीं है।",
      englishTranslation: "You are resting safely and comfortably at home with your family. There is nothing to worry about.",
      language: "hi",
      emotionTone: "CALMING",
    },
    medicine: {
      replyText: "आपकी सुबह की दवा का समय पूरा हो चुका है। अब दोपहर १२:३० बजे गुनगुने पानी का समय है।",
      englishTranslation: "Your morning medicine was taken. Next is lukewarm hydration at 12:30 PM.",
      language: "hi",
      suggestedScreen: "reminders",
      emotionTone: "REASSURING",
    },
    story: {
      replyText: "काजीरंगा के हरे-भरे जंगलों और ब्रह्मपुत्र की शांत लहरों को याद कीजिए, जहाँ पक्षी मधुर गीत गाते हैं।",
      englishTranslation: "Remember the lush greenery of Kaziranga and the peaceful waves of Brahmaputra where birds sing.",
      language: "hi",
      suggestedScreen: "album",
      emotionTone: "REMINISCING",
    },
    restless: {
      replyText: "गहरी और धीमी साँस लीजिए। हम आपके साथ हैं। आइए ढोल-पेपा का एक मधुर संगीत सुनते हैं।",
      englishTranslation: "Take a deep, gentle breath. We are right here with you. Let us listen to gentle folk music.",
      language: "hi",
      suggestedScreen: "games",
      emotionTone: "VALIDATING",
    },
    default: {
      replyText: "नमस्ते दादाजी! मैं स्मृति हूँ, आपका साथी। मैं आपकी क्या सेवा करूँ?",
      englishTranslation: "Hello grandfather! I am Smriti, your caring companion. How may I help you?",
      language: "hi",
      emotionTone: "REASSURING",
    }
  },
  bn: {
    location: {
      replyText: "আপনি আপনার নিজের বাড়িতে পরিবারের সাথে নিরাপদে আছেন। কোনো চিন্তা করবেন না।",
      englishTranslation: "You are resting safely at home with your loving family. Do not worry at all.",
      language: "bn",
      emotionTone: "CALMING",
    },
    medicine: {
      replyText: "আপনার সকালের ওষুধ নেওয়া হয়েছে। পরবর্তী ওষুধ ও জল দুপুর ১২:৩০ মিনিটে।",
      englishTranslation: "Your morning medicine is completed. Next water and medicine is at 12:30 PM.",
      language: "bn",
      suggestedScreen: "reminders",
      emotionTone: "REASSURING",
    },
    story: {
      replyText: "মনে করুন নদীর পাড়ের সেই মিষ্টি হাওয়া এবং সুন্দরবনের পাখিদের গান। মন শান্ত রাখুন।",
      englishTranslation: "Think of the sweet breeze by the river and song of birds. Keep your heart calm.",
      language: "bn",
      suggestedScreen: "album",
      emotionTone: "REMINISCING",
    },
    restless: {
      replyText: "ধীরে ধীরে একটি গভীর শ্বাস নিন। আমরা আপনার পাশেই আছি। চলুন একটি সুন্দর খেলা খেলি।",
      englishTranslation: "Take a deep, slow breath. We are right beside you. Let us play a gentle game.",
      language: "bn",
      suggestedScreen: "games",
      emotionTone: "VALIDATING",
    },
    default: {
      replyText: "নমস্কার দাদু! আমি স্মৃতি। আজ আপনার মন কেমন আছে? আমি কীভাবে সাহায্য করতে পারি?",
      englishTranslation: "Namaskar grandfather! I am Smriti. How are you feeling today?",
      language: "bn",
      emotionTone: "REASSURING",
    }
  },
  as: {
    location: {
      replyText: "আপুনি নিজৰ ঘৰতেই সুৰক্ষিতভাৱে আছে বৰদেউতা। অলপো চিন্তা নকৰিব, আমি সকলো আছোঁ।",
      englishTranslation: "You are resting safely at home, grandfather. Do not worry, we are all here.",
      language: "as",
      emotionTone: "CALMING",
    },
    medicine: {
      replyText: "আজি ৰাতিপুৱাৰ ঔষধ খোৱা হ'ল। দুপৰীয়া ১২:৩০ বজাত এসাঁজ কুহুমীয়া পানী খাব লাগিব।",
      englishTranslation: "Morning medicine is completed. Next is warm water hydration at 12:30 PM.",
      language: "as",
      suggestedScreen: "reminders",
      emotionTone: "REASSURING",
    },
    story: {
      replyText: "যোৰহাটৰ ৰঙালী বিহুৰ পেঁপা আৰু ঢোলৰ মাত মনত পেলাওকচোন। মনটো প্ৰফুল্লিত কৰি ৰাখক।",
      englishTranslation: "Remember the joyful tunes of Pepa and Dhol during Rongali Bihu in Jorhat.",
      language: "as",
      suggestedScreen: "album",
      emotionTone: "REMINISCING",
    },
    restless: {
      replyText: "দীঘলকৈ উশাহ লওক বৰদেউতা। মনটো শান্ত কৰক, আমি এটি চিনাকি সুৰ বজাই দিওঁ নেকি?",
      englishTranslation: "Take a long, gentle breath grandfather. Shall we play a familiar soothing tune?",
      language: "as",
      suggestedScreen: "games",
      emotionTone: "VALIDATING",
    },
    default: {
      replyText: "নমস্কাৰ বৰদেউতা! স্মৃতি সেৱালৈ স্বাগতম। আপোনাক কিদৰে সহায় কৰিব পাৰোঁ কওক।",
      englishTranslation: "Namaskar grandfather! Welcome to Smriti. How may I assist you today?",
      language: "as",
      emotionTone: "REASSURING",
    }
  },
  mni: {
    location: {
      replyText: "ꯏꯄꯥ ꯅꯍꯥꯛ ꯃꯌꯨꯃꯗꯥ ꯏꯃꯨꯡ-ꯃꯅꯨꯡꯒꯥ ꯂꯣꯌꯅꯅꯥ ꯅꯨꯡꯉꯥꯏꯅꯥ ꯂꯩꯔꯤ꯫ ꯋꯥꯈꯜ ꯋꯥꯒꯅꯨ꯫",
      englishTranslation: "You are resting safely at home with family, grandfather. Do not be worried.",
      language: "mni",
      emotionTone: "CALMING",
    },
    medicine: {
      replyText: "ꯑꯌꯨꯛꯀꯤ ꯍꯤꯗꯥꯛ ꯆꯥꯈ꯭ꯔꯦ꯫ ꯅꯨꯃꯤꯗꯥꯡꯋꯥꯏ ꯱꯲:꯳꯰ ꯗꯥ ꯏꯁꯤꯡ ꯊꯛꯅꯕꯥ ꯊꯧꯔꯥꯡ ꯂꯩ꯫",
      englishTranslation: "Morning medication was taken. Next hydration reminder is at 12:30 PM.",
      language: "mni",
      suggestedScreen: "reminders",
      emotionTone: "REASSURING",
    },
    story: {
      replyText: "ꯂꯣꯛꯇꯥꯛ ꯄꯥꯠꯀꯤ ꯐꯨꯝꯗꯤꯁꯤꯡ ꯑꯃꯁꯨꯡ ꯁꯉꯥꯏ ꯁꯥꯒꯤ ꯅꯤꯡꯁꯤꯡ ꯋꯥꯔꯤꯁꯤꯡ ꯅꯤꯡꯁꯤꯡꯕꯤꯌꯨ꯫",
      englishTranslation: "Recall the gentle floating phumdis of Loktak lake and graceful Sangai deer.",
      language: "mni",
      suggestedScreen: "album",
      emotionTone: "REMINISCING",
    },
    restless: {
      replyText: "ꯋꯥꯈꯜ ꯇꯞꯅꯥ ꯊꯝꯃꯨ꯫ ꯏꯁꯥ ꯇꯞꯅꯥ ꯊꯥꯗꯣꯛꯎ, ꯑꯩꯈꯣꯌ ꯅꯍꯥꯛꯀꯥ ꯂꯣꯌꯅꯅꯥ ꯂꯩꯔꯤ꯫",
      englishTranslation: "Keep calm. Breathe slowly and gently. We are always right here with you.",
      language: "mni",
      suggestedScreen: "games",
      emotionTone: "VALIDATING",
    },
    default: {
      replyText: "ꯇꯔꯥꯝꯅꯥ ꯑꯣꯛꯆꯔꯤ ꯏꯄꯥ! ꯑꯩꯅꯥ ꯅꯍꯥꯛꯄꯨ ꯀꯔꯝꯅꯥ ꯃꯇꯦꯡ ꯄꯥꯡꯒꯅꯤ?",
      englishTranslation: "Warm greetings grandfather! How can I assist you today?",
      language: "mni",
      emotionTone: "REASSURING",
    }
  },
  en: {
    location: {
      replyText: "You are resting safely in your warm home with family caring for you. You are completely safe.",
      englishTranslation: "You are resting safely in your warm home with family caring for you.",
      language: "en",
      emotionTone: "CALMING",
    },
    medicine: {
      replyText: "Your morning medication is complete. The next scheduled reminder is a refreshing cup of water at 12:30 PM.",
      englishTranslation: "Your morning medication is complete. Next is water at 12:30 PM.",
      language: "en",
      suggestedScreen: "reminders",
      emotionTone: "REASSURING",
    },
    story: {
      replyText: "Picture the golden Brahmaputra river and festive Bihu melodies in the village courtyards. Everything is peaceful.",
      englishTranslation: "Picture the golden Brahmaputra river and festive melodies in village courtyards.",
      language: "en",
      suggestedScreen: "album",
      emotionTone: "REMINISCING",
    },
    restless: {
      replyText: "Take a deep, slow breath in through your nose and out through your mouth. We are right here. Let us play a gentle rhythm.",
      englishTranslation: "Take a deep, slow breath in and out. Let us play a gentle rhythm together.",
      language: "en",
      suggestedScreen: "games",
      emotionTone: "VALIDATING",
    },
    default: {
      replyText: "Hello Grandfather! I am Smriti, your AI memory companion. How can I bring you peace and comfort right now?",
      englishTranslation: "Hello Grandfather! I am Smriti, your AI memory companion.",
      language: "en",
      emotionTone: "REASSURING",
    }
  }
};

/**
 * Normalizes input text into a keyword category for instant reassurance
 */
function categorizePrompt(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("where") || p.includes("home") || p.includes("house") || p.includes("कहाँ") || p.includes("घर") || p.includes("ক'ত") || p.includes("কোথায়") || p.includes("বাড়ি") || p.includes("ꯌꯨꯝ")) {
    return "location";
  }
  if (p.includes("medicine") || p.includes("pill") || p.includes("water") || p.includes("दवा") || p.includes("पानी") || p.includes("ঔষধ") || p.includes("দৰব") || p.includes("জল") || p.includes("ꯍꯤꯗꯥꯛ")) {
    return "medicine";
  }
  if (p.includes("story") || p.includes("memory") || p.includes("photo") || p.includes("song") || p.includes("कहानी") || p.includes("गीत") || p.includes("সাধু") || p.includes("গান") || p.includes("ꯋꯥꯔꯤ")) {
    return "story";
  }
  if (p.includes("fear") || p.includes("scared") || p.includes("restless") || p.includes("worry") || p.includes("डर") || p.includes("घबराहट") || p.includes("ভয়") || p.includes("চিন্তা") || p.includes("ꯋꯥꯕꯥ")) {
    return "restless";
  }
  return "default";
}

/**
 * Queries the Gemini AI text-to-text API or invokes the offline clinical engine
 */
export async function generateGeminiCompanionReply(
  prompt: string,
  language: string = "en"
): Promise<CompanionResponse> {
  const langKey = OFFLINE_REASSURANCE_MAP[language] ? language : "en";
  const cat = categorizePrompt(prompt);

  // 1. Attempt Next.js server-side Gemini endpoint
  try {
    const res = await fetch("/api/ai/companion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, language }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.replyText) {
        return {
          replyText: data.replyText,
          englishTranslation: data.englishTranslation || data.replyText,
          language: data.language || language,
          suggestedScreen: data.suggestedScreen,
          emotionTone: data.emotionTone || "CALMING",
          transcript: data.transcript || prompt,
        };
      }
    }
  } catch {
    // Network offline or endpoint unavailable — seamlessly use offline engine
  }

  // 2. Offline Geriatric Reassurance Engine fallback
  const langDict = OFFLINE_REASSURANCE_MAP[langKey] || OFFLINE_REASSURANCE_MAP.en;
  const fallback = langDict[cat] || langDict.default;
  return { ...fallback, transcript: prompt };
}

/**
 * Sends recorded audio directly to Gemini multimodal API for transcription & reassurance
 */
export async function generateGeminiCompanionAudioReply(
  audioBase64: string,
  mimeType: string = "audio/webm",
  language: string = "en"
): Promise<CompanionResponse> {
  const langKey = OFFLINE_REASSURANCE_MAP[language] ? language : "en";

  try {
    const res = await fetch("/api/ai/companion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audioBase64, mimeType, language }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.replyText) {
        return {
          replyText: data.replyText,
          englishTranslation: data.englishTranslation || data.replyText,
          language: data.language || language,
          suggestedScreen: data.suggestedScreen,
          emotionTone: data.emotionTone || "CALMING",
          transcript: data.transcript,
        };
      }
    }
  } catch {
    // Network offline or endpoint unavailable — use fallback
  }

  const langDict = OFFLINE_REASSURANCE_MAP[langKey] || OFFLINE_REASSURANCE_MAP.en;
  return langDict.default;
}

import { speakSpokenVoice, stopAllSpeech } from "./audioVoiceService";

/**
 * Normal Browser Text-To-Speech (TTS) Speaker Function
 * Uses resilient multi-tier speech engine with geriatric calming pacing (0.82x)
 */
export function speakTextWithTTS(
  text: string,
  language: string,
  onEnd?: () => void,
  onError?: () => void
): boolean {
  return speakSpokenVoice(text, language, {
    onEnd,
    onError,
    rate: 0.82,
  });
}

/**
 * Stops any ongoing TTS playback immediately
 */
export function stopTTS(): void {
  stopAllSpeech();
}
