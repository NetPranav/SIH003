/**
 * Smriti-NER (স্মৃতি) — Intelligent Gemini AI & Clinical Companion Service
 *
 * Provides culturally-grounded, elder-centric conversational intelligence
 * for dementia patients in Northeast India across 8 regional languages.
 *
 * Features:
 * 1. Direct Client-Side Google Gemini REST API support (multimodal audio & text)
 * 2. 100% Offline Clinical Geriatric NLU Brain with 12 intent domains across 8 languages
 * 3. High-definition natural voice synthesis (calibrated 0.88x speed, warm 1.04 pitch)
 */

import type { ScreenId } from "./types";
import { offlineMobileStore } from "./offlineMobileStorage";
import { speakSpokenVoice, stopAllSpeech } from "./audioVoiceService";

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
  source?: "gemini_online" | "offline_clinical_brain";
}

const GEMINI_SYSTEM_INSTRUCTION = `
You are Smriti, a deeply compassionate, respectful, and soothing AI companion for an elderly grandparent in Northeast India who may have Mild Cognitive Impairment (MCI) or early-stage dementia.
Rules:
1. Speak with deep cultural warmth and reverence (e.g. addressing the elder as "Dadu", "Bordeuta", "Pu", "Kpa", "Ipa", or "Grandfather").
2. Keep responses brief, calming, and reassuring (maximum 2-3 simple, comforting sentences).
3. Never challenge, correct sharply, or cause confusion. If they feel disoriented or ask where they are, reassure them that they are resting safely at home with their loving family.
4. Respond in the EXACT language requested:
   - If language is 'hi', respond in clear, simple Hindi (Devanagari).
   - If language is 'bn', respond in gentle Bengali.
   - If language is 'as', respond in gentle Assamese.
   - If language is 'mni', respond in Meitei (Manipuri).
   - If language is 'brx', respond in Bodo.
   - If language is 'kha', respond in Khasi.
   - If language is 'lus', respond in Mizo.
   - If language is 'en', respond in warm Indian English.
5. Return a valid JSON object with:
   - "replyText": string (the soothing message in the target language)
   - "englishTranslation": string (accurate English translation for caregiver display)
   - "emotionTone": "CALMING" | "VALIDATING" | "REMINISCING" | "REASSURING"
   - "suggestedScreen": "home" | "games" | "reminders" | "album" (optional)
   - "transcript": string (the transcribed question or prompt)
`;

// ── 12-Domain Multilingual Geriatric Knowledge Base ──────────────────
const OFFLINE_CLINICAL_BRAIN: Record<string, Record<string, CompanionResponse>> = {
  hi: {
    identity: {
      replyText: "नमस्ते दादाजी! मैं स्मृति हूँ, आपकी अपनी देखभाल साथी। मैं हमेशा आपके साथ हूँ, आपकी सेवा और आराम के लिए।",
      englishTranslation: "Hello grandfather! I am Smriti, your caring companion. I am always here for your comfort.",
      language: "hi",
      emotionTone: "REASSURING",
    },
    location: {
      replyText: "आप अपने परिवार के साथ घर पर पूरी तरह सुरक्षित और आराम से हैं। चिंता की कोई बात नहीं है, हम सब आपके पास हैं।",
      englishTranslation: "You are resting safely and comfortably at home with your family. There is nothing to worry about.",
      language: "hi",
      emotionTone: "CALMING",
    },
    family: {
      replyText: "आपकी पोती प्रियंका और पूरा परिवार आपसे बहुत प्यार करता है। वे यहीं घर पर हैं और आपकी पूरी देखभाल कर रहे हैं।",
      englishTranslation: "Your granddaughter Priyanka and family love you dearly. They are right here taking care of you.",
      language: "hi",
      emotionTone: "VALIDATING",
    },
    time_schedule: {
      replyText: "दिन का समय बहुत सुहावना है। आप आराम से बैठिए और गहरी साँस लीजिए। सब कुछ बिल्कुल सही चल रहा है।",
      englishTranslation: "The day is pleasant and peaceful. Sit comfortably and breathe gently. Everything is well.",
      language: "hi",
      emotionTone: "CALMING",
    },
    medicine: {
      replyText: "आपकी दवा का नियम बहुत अच्छे से चल रहा है। कृपया गुनगुने पानी का एक घूँट पीजिए। आपका स्वास्थ्य बहुत अच्छा रहेगा।",
      englishTranslation: "Your medicine routine is going very well. Please take a sip of warm water. Your health is well cared for.",
      language: "hi",
      suggestedScreen: "reminders",
      emotionTone: "REASSURING",
    },
    fear_comfort: {
      replyText: "घबराने की कोई बात नहीं है दादाजी। एक लंबी, गहरी साँस लीजिए। आप पूरी तरह सुरक्षित हैं, मेरा हाथ आपके साथ है।",
      englishTranslation: "There is nothing to fear grandfather. Take a long, deep breath. You are safe and we are right here.",
      language: "hi",
      emotionTone: "CALMING",
    },
    story_folklore: {
      replyText: "काजीरंगा के हरे-भरे जंगलों और ब्रह्मपुत्र की शांत लहरों को याद कीजिए, जहाँ पक्षी मधुर गीत गाते हैं और शामें शांत होती हैं।",
      englishTranslation: "Remember the lush greenery of Kaziranga and the peaceful waves of Brahmaputra where birds sing sweet songs.",
      language: "hi",
      suggestedScreen: "album",
      emotionTone: "REMINISCING",
    },
    games_activity: {
      replyText: "आइए मन को तरोताज़ा करने के लिए ढोल-पेपा या काजीरंगा का एक हल्का खेल खेलें। आपको बहुत आनंद आएगा।",
      englishTranslation: "Let us play a gentle game of Dhol-Pepa or Kaziranga Safari to refresh your mind. You will enjoy it.",
      language: "hi",
      suggestedScreen: "games",
      emotionTone: "VALIDATING",
    },
    tea_food: {
      replyText: "असम की खुशबूदार गरम चाय का एक प्याला आपके लिए तैयार हो रहा है। आराम से बैठिए, अभी चाय का आनंद लेते हैं।",
      englishTranslation: "A warm cup of aromatic Assam tea is being prepared for you. Sit comfortably, tea will be ready shortly.",
      language: "hi",
      emotionTone: "REASSURING",
    },
    farewell_sleep: {
      replyText: "शुभ रात्रि दादाजी! शांत और मीठी नींद सोइए। आपका परिवार आपके पास है और सब कुछ सुरक्षित है।",
      englishTranslation: "Good night grandfather! Sleep peacefully and sweetly. Your family is near and all is safe.",
      language: "hi",
      emotionTone: "CALMING",
    },
    greetings: {
      replyText: "सादर प्रणाम दादाजी! आज आप कैसा महसूस कर रहे हैं? मैं आपकी क्या सेवा करूँ?",
      englishTranslation: "Warm greetings grandfather! How are you feeling today? How may I help you?",
      language: "hi",
      emotionTone: "REASSURING",
    },
    wellbeing_positive: {
      replyText: "यह सुनकर मन बहुत प्रसन्न हुआ दादाजी! यह जानकर बहुत सुकून मिला कि आप अच्छा और सहज महसूस कर रहे हैं। हम सब आपके साथ हैं, आराम से बैठिए।",
      englishTranslation: "That brings such warmth to hear, grandfather! It is a relief to know you feel good and at ease today. We are always by your side.",
      language: "hi",
      emotionTone: "VALIDATING",
    },
    default: {
      replyText: "हाँ दादाजी, मैं आपकी बात सुन रही हूँ। आप बहुत अच्छे हैं और हम सब आपके साथ हैं। चिंता बिल्कुल मत कीजिए।",
      englishTranslation: "Yes grandfather, I am listening to you. You are doing wonderfully and we are right beside you.",
      language: "hi",
      emotionTone: "REASSURING",
    },
  },
  as: {
    identity: {
      replyText: "নমস্কাৰ বৰদেউতা! মই স্মৃতি, আপোনাৰ মৰমৰ সংগী। আপোনাৰ মনটো শান্ত আৰু সুৰক্ষিত কৰি ৰাখিবলৈ মই সদায় আপোনাৰ লগত আছোঁ।",
      englishTranslation: "Namaskar grandfather! I am Smriti, your loving companion. I am always here to keep your heart calm and safe.",
      language: "as",
      emotionTone: "REASSURING",
    },
    location: {
      replyText: "আপুনি নিজৰ ঘৰতেই সুৰক্ষিতভাৱে আছে বৰদেউতা। অলপো চিন্তা নকৰিব, আপোনাৰ পৰিয়ালৰ সকলো আপোনাৰ কাষতেই আছে।",
      englishTranslation: "You are resting safely at home, grandfather. Do not worry at all, your loving family is right beside you.",
      language: "as",
      emotionTone: "CALMING",
    },
    family: {
      replyText: "আপোনাৰ নাতিনী প্ৰিয়ংকা আৰু পৰিয়ালে আপোনাক বৰ মৰম কৰে। তেওঁলোক ঘৰতেই আপোনাৰ কাষত আছে।",
      englishTranslation: "Your granddaughter Priyanka and family love you dearly. They are right at home taking care of you.",
      language: "as",
      emotionTone: "VALIDATING",
    },
    time_schedule: {
      replyText: "আজিৰ দিনটো বৰ সুন্দৰ আৰু শান্ত। আপুনি আৰামত জিৰণি লওক বৰদেউতা, সকলো নিয়মমতে চলি আছে।",
      englishTranslation: "Today is a beautiful and serene day. Rest comfortably grandfather, everything is on schedule.",
      language: "as",
      emotionTone: "CALMING",
    },
    medicine: {
      replyText: "আপোনাৰ স্বাস্থ্যৰ যত্ন লোৱা হৈছে। এসাঁজ কুহুমীয়া পানী খাই লওক বৰদেউতা, গাটো বৰ পাতল আৰু সুস্থ লাগিব।",
      englishTranslation: "Your health is being taken care of. Please take a sip of warm water grandfather, you will feel light and well.",
      language: "as",
      suggestedScreen: "reminders",
      emotionTone: "REASSURING",
    },
    fear_comfort: {
      replyText: "ভয় নাখাব বৰদেউতা। দীঘলকৈ এটি উশাহ লওক। আপুনি সম্পূৰ্ণ সুৰক্ষিত, আমি সকলো আপোনাৰ লগতেই আছোঁ।",
      englishTranslation: "Do not be afraid grandfather. Take a long, deep breath. You are completely safe and we are with you.",
      language: "as",
      emotionTone: "CALMING",
    },
    story_folklore: {
      replyText: "মাজুলীৰ ব্ৰহ্মপুত্ৰৰ শান্ত বতাহ আৰু যোৰহাটৰ বিহুৰ পেঁপাৰ সুৰ মনত পেলাওকচোন। মনটো বৰ আনন্দ লাগিব।",
      englishTranslation: "Remember the serene breeze of Brahmaputra in Majuli and the sweet Pepa tunes of Bihu. Your heart will feel joy.",
      language: "as",
      suggestedScreen: "album",
      emotionTone: "REMINISCING",
    },
    games_activity: {
      replyText: "আহকচোন বৰদেউতা, আমি ঢোল-পেঁপা বা কাজিৰঙা ভ্ৰমণৰ এটি সহজ খেল খেলোঁ। মনটো বৰ ভাল লাগিব।",
      englishTranslation: "Come grandfather, let us play a gentle game of Dhol-Pepa or Kaziranga Safari. It will refresh your spirit.",
      language: "as",
      suggestedScreen: "games",
      emotionTone: "VALIDATING",
    },
    tea_food: {
      replyText: "আমাৰ অসমৰ সুগন্ধি ৰঙা চাহৰ কথা ভাবকচোন। আপোনাৰ বাবে একাপ গৰম চাহৰ ব্যৱস্থা কৰা হৈছে।",
      englishTranslation: "Think of our aromatic Assam tea. A warm cup of comforting tea is being prepared for you.",
      language: "as",
      emotionTone: "REASSURING",
    },
    farewell_sleep: {
      replyText: "শুভ ৰাত্ৰি বৰদেউতা! শান্তভাৱে শোওক। ভগৱানে আপোনাক কুশলে ৰাখক, সকলো সুৰক্ষিত আছে।",
      englishTranslation: "Good night grandfather! Sleep peacefully. God bless you with good health, everything is safe.",
      language: "as",
      emotionTone: "CALMING",
    },
    greetings: {
      replyText: "নমস্কাৰ বৰদেউতা! আজি আপোনাৰ গা-মন কেনে আছে? মই আপোনাক কিদৰে সহায় কৰিব পাৰোঁ কওক।",
      englishTranslation: "Namaskar grandfather! How is your health and mood today? How may I assist you?",
      language: "as",
      emotionTone: "REASSURING",
    },
    wellbeing_positive: {
      replyText: "শুনি বৰ আনন্দ লাগিল বৰদেউতা! আজি আপোনাৰ গা-মন ভালে আছে আৰু মনটো শান্ত হৈ আছে বুলি জানি বৰ সকাহ পালোঁ। চিন্তাৰ কোনো কাৰণ নাই, আমি আছোঁ।",
      englishTranslation: "That brings great joy to hear, grandfather! So comforting to know you are feeling well and peaceful today.",
      language: "as",
      emotionTone: "VALIDATING",
    },
    default: {
      replyText: "হয় বৰদেউতা, মই আপোনাৰ কথা শুনি আছোঁ। আপুনি বৰ মৰমৰ মানুহ। অলপো চিন্তা নকৰিব, আমি আছোঁ।",
      englishTranslation: "Yes grandfather, I am listening to you. You are deeply cherished. Do not worry at all, we are here.",
      language: "as",
      emotionTone: "REASSURING",
    },
  },
  bn: {
    identity: {
      replyText: "নমস্কার দাদু! আমি স্মৃতি, আপনার স্নেহের ডিজিটাল সঙ্গী। আপনার মন শান্ত রাখতে আমি সবসময় সাথে আছি।",
      englishTranslation: "Namaskar grandfather! I am Smriti, your loving companion. I am always here to comfort you.",
      language: "bn",
      emotionTone: "REASSURING",
    },
    location: {
      replyText: "আপনি আপনার নিজের বাড়িতে পরিবারের সাথে নিরাপদে আছেন দাদু। কোনো চিন্তা করবেন না, আমরা সবাই পাশে আছি।",
      englishTranslation: "You are resting safely at home with your loving family, grandfather. Do not worry, we are right beside you.",
      language: "bn",
      emotionTone: "CALMING",
    },
    family: {
      replyText: "আপনার নাতনি প্রিয়াঙ্কা এবং পরিবারের সবাই আপনাকে অনেক ভালোবাসে। তারা বাড়িতেই আপনার যত্ন নিচ্ছে।",
      englishTranslation: "Your granddaughter Priyanka and family love you dearly. They are right at home caring for you.",
      language: "bn",
      emotionTone: "VALIDATING",
    },
    time_schedule: {
      replyText: "আজকের দিনটি খুব সুন্দর ও শান্ত। আপনি আরাম করে বসুন দাদু, সব কাজ নিয়মমতো চলছে।",
      englishTranslation: "Today is a beautiful and quiet day. Sit comfortably grandfather, everything is on schedule.",
      language: "bn",
      emotionTone: "CALMING",
    },
    medicine: {
      replyText: "আপনার ওষুধ ও স্বাস্থ্যবিধি খুব সুন্দরভাবে চলছে। এক ঢোক হালকা গরম জল খেয়ে নিন, শরীর ভালো থাকবে।",
      englishTranslation: "Your medicine routine is going very well. Please take a sip of lukewarm water, you will feel fine.",
      language: "bn",
      suggestedScreen: "reminders",
      emotionTone: "REASSURING",
    },
    fear_comfort: {
      replyText: "ভয়ের কোনো কারণ নেই দাদু। ধীরে ধীরে একটা গভীর শ্বাস নিন। আপনি সম্পূর্ণ নিরাপদে আছেন।",
      englishTranslation: "There is nothing to fear grandfather. Take a slow, deep breath. You are completely safe.",
      language: "bn",
      emotionTone: "CALMING",
    },
    story_folklore: {
      replyText: "মনে করুন নদীর পাড়ের সেই মিষ্টি হাওয়া এবং সুন্দরবনের পাখিদের মধুর গান। মনটা শান্ত রাখুন।",
      englishTranslation: "Remember the sweet breeze by the river and song of birds. Keep your heart calm and joyful.",
      language: "bn",
      suggestedScreen: "album",
      emotionTone: "REMINISCING",
    },
    games_activity: {
      replyText: "চলুন দাদু, মন ভালো করতে ঢোল-পেঁপা বা কাজিরাঙার একটি সুন্দর খেলা খেলি। খুব আনন্দ হবে।",
      englishTranslation: "Come grandfather, let us play a gentle game of Dhol-Pepa or Kaziranga Safari. It will bring you joy.",
      language: "bn",
      suggestedScreen: "games",
      emotionTone: "VALIDATING",
    },
    tea_food: {
      replyText: "আপনার জন্য এক কাপ গরম ও সুগন্ধি চা তৈরি হচ্ছে। একটু বসুন, এখনি চা পরিবেশন করা হবে।",
      englishTranslation: "A warm cup of soothing tea is being prepared for you. Relax a bit, it will be served shortly.",
      language: "bn",
      emotionTone: "REASSURING",
    },
    farewell_sleep: {
      replyText: "শুভ রাত্রি দাদু! মিষ্টি ও শান্ত ঘুম দিন। আপনার পরিবার আপনার পাশেই আছে।",
      englishTranslation: "Good night grandfather! Have a sweet and peaceful sleep. Your family is right beside you.",
      language: "bn",
      emotionTone: "CALMING",
    },
    greetings: {
      replyText: "নমস্কার দাদু! আজ আপনার মন কেমন আছে? আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
      englishTranslation: "Namaskar grandfather! How are you feeling today? How may I help you?",
      language: "bn",
      emotionTone: "REASSURING",
    },
    wellbeing_positive: {
      replyText: "শুনে মনটা খুব শান্ত হলো দাদু! আপনি আজ ভালো বোধ করছেন এবং আরাম পাচ্ছেন জেনে খুব খুশি হলাম। আমরা সবসময় আপনার পাশে আছি।",
      englishTranslation: "Hearing that brings great peace, grandfather! Truly glad you are feeling well and comfortable today.",
      language: "bn",
      emotionTone: "VALIDATING",
    },
    default: {
      replyText: "হ্যাঁ দাদু, আমি আপনার কথা শুনছি। আপনি নিশ্চিন্ত থাকুন, আমরা সবাই আপনার সাথে আছি।",
      englishTranslation: "Yes grandfather, I am listening to you. Rest assured, we are all here with you.",
      language: "bn",
      emotionTone: "REASSURING",
    },
  },
  en: {
    identity: {
      replyText: "Hello Grandfather! I am Smriti, your caring AI companion. I am always right here to bring you peace, comfort, and safety.",
      englishTranslation: "Hello Grandfather! I am Smriti, your caring AI companion.",
      language: "en",
      emotionTone: "REASSURING",
    },
    location: {
      replyText: "You are resting safely and comfortably in your own home with your family. There is nothing to worry about.",
      englishTranslation: "You are resting safely and comfortably in your own home with your family.",
      language: "en",
      emotionTone: "CALMING",
    },
    family: {
      replyText: "Your granddaughter Priyanka and your family love you deeply. They are right here in the house taking wonderful care of you.",
      englishTranslation: "Your granddaughter Priyanka and your family love you deeply.",
      language: "en",
      emotionTone: "VALIDATING",
    },
    time_schedule: {
      replyText: "The day is calm and peaceful. Sit back comfortably and breathe gently. Everything is well on schedule.",
      englishTranslation: "The day is calm and peaceful. Sit back comfortably and breathe gently.",
      language: "en",
      emotionTone: "CALMING",
    },
    medicine: {
      replyText: "Your daily care routine is in order. Please take a gentle sip of warm water. Your health is being watched over.",
      englishTranslation: "Your daily care routine is in order. Please take a gentle sip of warm water.",
      language: "en",
      suggestedScreen: "reminders",
      emotionTone: "REASSURING",
    },
    fear_comfort: {
      replyText: "There is nothing to be afraid of, grandfather. Take a slow, deep breath. You are completely safe and loved.",
      englishTranslation: "There is nothing to be afraid of, grandfather. Take a slow, deep breath. You are completely safe and loved.",
      language: "en",
      emotionTone: "CALMING",
    },
    story_folklore: {
      replyText: "Think of the gentle waves of the Brahmaputra and the green hills of Northeast India where birds sing sweet songs.",
      englishTranslation: "Think of the gentle waves of the Brahmaputra and the green hills of Northeast India where birds sing sweet songs.",
      language: "en",
      suggestedScreen: "album",
      emotionTone: "REMINISCING",
    },
    games_activity: {
      replyText: "Would you like to play a gentle cultural game like Dhol-Pepa Rhythm or Kaziranga Safari? It will bring you joy.",
      englishTranslation: "Would you like to play a gentle cultural game like Dhol-Pepa Rhythm or Kaziranga Safari?",
      language: "en",
      suggestedScreen: "games",
      emotionTone: "VALIDATING",
    },
    tea_food: {
      replyText: "A warm cup of fresh Assam tea is being prepared for you. Sit comfortably, it will be ready in just a moment.",
      englishTranslation: "A warm cup of fresh Assam tea is being prepared for you. Sit comfortably, it will be ready in just a moment.",
      language: "en",
      emotionTone: "REASSURING",
    },
    farewell_sleep: {
      replyText: "Good night grandfather! Have a peaceful and restful sleep. Your family is near and everything is safe.",
      englishTranslation: "Good night grandfather! Have a peaceful and restful sleep.",
      language: "en",
      emotionTone: "CALMING",
    },
    greetings: {
      replyText: "Warm greetings grandfather! How are you feeling today? I am here to assist and comfort you.",
      englishTranslation: "Warm greetings grandfather! How are you feeling today?",
      language: "en",
      emotionTone: "REASSURING",
    },
    wellbeing_positive: {
      replyText: "That is truly wonderful to hear, grandfather! I am so glad your heart and mind feel peaceful and comfortable today. You are safe, cherished, and we are right here with you.",
      englishTranslation: "That is truly wonderful to hear, grandfather! I am so glad your heart and mind feel peaceful and comfortable today.",
      language: "en",
      emotionTone: "VALIDATING",
    },
    default: {
      replyText: "Yes grandfather, I am listening to you. You are doing wonderfully and we are right here beside you.",
      englishTranslation: "Yes grandfather, I am listening to you. You are doing wonderfully and we are right here beside you.",
      language: "en",
      emotionTone: "REASSURING",
    },
  },
};

// Fill in other regional dialects (mni, brx, kha, lus) with comforting fallback
["mni", "brx", "kha", "lus"].forEach((lang) => {
  if (!OFFLINE_CLINICAL_BRAIN[lang]) {
    OFFLINE_CLINICAL_BRAIN[lang] = OFFLINE_CLINICAL_BRAIN.en;
  }
});

/**
 * Intelligent Semantic Intent Classifier for Geriatric Dementia Dialogues
 */
export function classifyElderIntent(prompt: string): string {
  const p = prompt.toLowerCase();

  // 1. Identity & Who are you
  if (
    p.includes("who are you") ||
    p.includes("your name") ||
    p.includes("what is smriti") ||
    p.includes("कौैन हो") ||
    p.includes("तुम कौन") ||
    p.includes("তুমি কে") ||
    p.includes("আপুনি কোন") ||
    p.includes("নহাক কনানো")
  ) {
    return "identity";
  }

  // 2. Spatial Orientation & Where am I
  if (
    p.includes("where") ||
    p.includes("home") ||
    p.includes("house") ||
    p.includes("place") ||
    p.includes("कहाँ") ||
    p.includes("घर") ||
    p.includes("ক'ত") ||
    p.includes("কোথায়") ||
    p.includes("বাড়ি") ||
    p.includes("মফম") ||
    p.includes("ꯌুম")
  ) {
    return "location";
  }

  // 3. Family & Kinship
  if (
    p.includes("family") ||
    p.includes("daughter") ||
    p.includes("son") ||
    p.includes("granddaughter") ||
    p.includes("priyanka") ||
    p.includes("children") ||
    p.includes("wife") ||
    p.includes("परिवार") ||
    p.includes("बेटी") ||
    p.includes("पोती") ||
    p.includes("নাতিনী") ||
    p.includes("পৰিয়াল") ||
    p.includes("ইমুং")
  ) {
    return "family";
  }

  // 4. Time & Schedule
  if (
    p.includes("time") ||
    p.includes("clock") ||
    p.includes("day") ||
    p.includes("today") ||
    p.includes("morning") ||
    p.includes("evening") ||
    p.includes("night") ||
    p.includes("समय") ||
    p.includes("बजे") ||
    p.includes("বজা") ||
    p.includes("সময়") ||
    p.includes("সময়") ||
    p.includes("পুং")
  ) {
    return "time_schedule";
  }

  // 5. Medication & Health
  if (
    p.includes("medicine") ||
    p.includes("pill") ||
    p.includes("water") ||
    p.includes("doctor") ||
    p.includes("pain") ||
    p.includes("headache") ||
    p.includes("sick") ||
    p.includes("दवा") ||
    p.includes("पानी") ||
    p.includes("दर्द") ||
    p.includes("ঔষধ") ||
    p.includes("দৰব") ||
    p.includes("জল") ||
    p.includes("পানী") ||
    p.includes("হিদাক")
  ) {
    return "medicine";
  }

  // 6. Fear, Loneliness & Agitation
  if (
    p.includes("fear") ||
    p.includes("scared") ||
    p.includes("worry") ||
    p.includes("alone") ||
    p.includes("lonely") ||
    p.includes("afraid") ||
    p.includes("help") ||
    p.includes("डर") ||
    p.includes("घबराहट") ||
    p.includes("अकेला") ||
    p.includes("ভয়") ||
    p.includes("অস্থিৰ") ||
    p.includes("একাকী") ||
    p.includes("ৱাবাকাপ্পা")
  ) {
    return "fear_comfort";
  }

  // 7. Story, Memories & Folklore
  if (
    p.includes("story") ||
    p.includes("song") ||
    p.includes("sing") ||
    p.includes("bihu") ||
    p.includes("kaziranga") ||
    p.includes("brahmaputra") ||
    p.includes("memory") ||
    p.includes("photo") ||
    p.includes("कहानी") ||
    p.includes("गीत") ||
    p.includes("সাধু") ||
    p.includes("গান") ||
    p.includes("ৱারী")
  ) {
    return "story_folklore";
  }

  // 8. Games & Activities
  if (
    p.includes("game") ||
    p.includes("play") ||
    p.includes("bored") ||
    p.includes("exercise") ||
    p.includes("activity") ||
    p.includes("खेल") ||
    p.includes("খেলা") ||
    p.includes("খেল") ||
    p.includes("সান্নবা")
  ) {
    return "games_activity";
  }

  // 9. Tea, Food & Meals
  if (
    p.includes("tea") ||
    p.includes("chai") ||
    p.includes("food") ||
    p.includes("eat") ||
    p.includes("lunch") ||
    p.includes("dinner") ||
    p.includes("hungry") ||
    p.includes("breakfast") ||
    p.includes("चाय") ||
    p.includes("खाना") ||
    p.includes("চা") ||
    p.includes("ভাত") ||
    p.includes("চা-জলপান") ||
    p.includes("চাক")
  ) {
    return "tea_food";
  }

  // 10. Farewell & Sleep
  if (
    p.includes("sleep") ||
    p.includes("good night") ||
    p.includes("bye") ||
    p.includes("tired") ||
    p.includes("rest") ||
    p.includes("सोना") ||
    p.includes("शुभ रात्रि") ||
    p.includes("ঘুম") ||
    p.includes("শুবলৈ") ||
    p.includes("তুম্বা")
  ) {
    return "farewell_sleep";
  }

  // 11. Greetings
  if (
    p.includes("hello") ||
    p.includes("hi") ||
    p.includes("namaste") ||
    p.includes("how are you") ||
    p.includes("good morning") ||
    p.includes("नमस्ते") ||
    p.includes("নমস্কাৰ") ||
    p.includes("নমস্কার") ||
    p.includes("খুরুমজরি")
  ) {
    return "greetings";
  }

  // 12. Well-being, Mood & Emotional State
  if (
    p.includes("feeling ok") ||
    p.includes("feeling good") ||
    p.includes("feeling well") ||
    p.includes("feeling fine") ||
    p.includes("feeling better") ||
    p.includes("i am ok") ||
    p.includes("i am fine") ||
    p.includes("i am feeling ok") ||
    p.includes("i am feeling good") ||
    p.includes("i'm ok") ||
    p.includes("i'm fine") ||
    p.includes("i'm feeling ok") ||
    p.includes("doing ok") ||
    p.includes("doing fine") ||
    p.includes("doing well") ||
    p.includes("all right") ||
    p.includes("alright") ||
    p.includes("अच्छा लग रहा") ||
    p.includes("मैं ठीक हूँ") ||
    p.includes("सब ठीक है") ||
    p.includes("ভাল লাগিছে") ||
    p.includes("ভালে আছোঁ") ||
    p.includes("ভালো আছি") ||
    p.includes("ভালো লাগছে") ||
    p.includes("নুংঙাইরে")
  ) {
    return "wellbeing_positive";
  }

  return "default";
}

// ── DYNAMIC GEMINI MODEL RESOLUTION & AUTO-DISCOVERY ─────────────────────────
export let activeGeminiModelName: string = "gemini-3.6-flash";

export const CANDIDATE_GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

/**
 * Discovers which Gemini model is active and accessible for the user's specific API key.
 * Queries Google's /models endpoint and picks the best available flash model.
 */
export async function resolveAvailableGeminiModel(apiKey: string): Promise<string> {
  const cleanKey = apiKey.trim();
  if (!cleanKey || typeof window === "undefined" || !navigator.onLine) {
    return activeGeminiModelName;
  }

  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`;
    const res = await fetch(listUrl, {
      headers: { "x-goog-api-key": cleanKey },
    });
    if (res.ok) {
      const data = await res.json();
      const models = data?.models as Array<{ name: string; supportedGenerationMethods?: string[] }> | undefined;
      if (models && models.length > 0) {
        const genModels = models.filter((m) =>
          m.supportedGenerationMethods?.includes("generateContent")
        );
        const flashCandidate =
          genModels.find((m) => m.name.includes("3.6-flash")) ||
          genModels.find((m) => m.name.includes("3.8-flash")) ||
          genModels.find((m) => m.name.includes("3.5-flash")) ||
          genModels.find((m) => m.name.includes("flash")) ||
          genModels.find((m) => m.name.includes("gemini")) ||
          genModels[0];

        if (flashCandidate) {
          const modelId = flashCandidate.name.replace(/^models\//, "");
          activeGeminiModelName = modelId;
          return modelId;
        }
      }
    }
  } catch (e) {
    console.warn("Could not list Google models, candidate cascade will be used:", e);
  }

  return activeGeminiModelName;
}

/**
 * Robust JSON parser for Gemini responses.
 * Handles markdown code fences (```json ... ```), raw bracketed objects,
 * and gracefully falls back to using Gemini's live text without crashing.
 */
function parseCompanionJson(
  rawText: string,
  fallbackPrompt: string,
  language: string
): {
  replyText: string;
  englishTranslation: string;
  emotionTone: "CALMING" | "VALIDATING" | "REMINISCING" | "REASSURING";
  suggestedScreen?: ScreenId;
  transcript?: string;
} {
  if (!rawText || !rawText.trim()) {
    return {
      replyText: "আমি আপনার সাথে আছি।",
      englishTranslation: "I am here with you.",
      emotionTone: "CALMING",
    };
  }

  const cleaned = rawText.trim();

  // 1. Direct JSON parse
  try {
    const direct = JSON.parse(cleaned);
    if (direct && typeof direct === "object" && (direct.replyText || direct.reply)) {
      return {
        replyText: direct.replyText || direct.reply || cleaned,
        englishTranslation: direct.englishTranslation || direct.translation || direct.replyText || cleaned,
        emotionTone: direct.emotionTone || "CALMING",
        suggestedScreen: direct.suggestedScreen || undefined,
        transcript: direct.transcript || fallbackPrompt,
      };
    }
  } catch {}

  // 2. Strip markdown fences: ```json ... ``` or ``` ... ```
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      if (parsed && typeof parsed === "object" && (parsed.replyText || parsed.reply)) {
        return {
          replyText: parsed.replyText || parsed.reply || cleaned,
          englishTranslation: parsed.englishTranslation || parsed.translation || parsed.replyText || cleaned,
          emotionTone: parsed.emotionTone || "CALMING",
          suggestedScreen: parsed.suggestedScreen || undefined,
          transcript: parsed.transcript || fallbackPrompt,
        };
      }
    } catch {}
  }

  // 3. Extract bracketed {...} substring
  const startIdx = cleaned.indexOf("{");
  const endIdx = cleaned.lastIndexOf("}");
  if (startIdx !== -1 && endIdx > startIdx) {
    try {
      const sub = cleaned.substring(startIdx, endIdx + 1);
      const parsed = JSON.parse(sub);
      if (parsed && typeof parsed === "object" && (parsed.replyText || parsed.reply)) {
        return {
          replyText: parsed.replyText || parsed.reply || cleaned,
          englishTranslation: parsed.englishTranslation || parsed.translation || parsed.replyText || cleaned,
          emotionTone: parsed.emotionTone || "CALMING",
          suggestedScreen: parsed.suggestedScreen || undefined,
          transcript: parsed.transcript || fallbackPrompt,
        };
      }
    } catch {}
  }

  // 4. If Gemini returned plain conversational text instead of JSON:
  // Never discard a live AI response! Show and speak Gemini's actual response!
  const sanitized = cleaned.replace(/^```json|^```|```$/gi, "").trim();
  return {
    replyText: sanitized,
    englishTranslation: sanitized,
    emotionTone: "CALMING",
    transcript: fallbackPrompt,
  };
}

/**
 * Queries Gemini AI directly from the client (if API key present)
 * with gemini-3.6-flash as default, falling back cleanly to the On-Device Clinical Brain.
 */
export async function generateGeminiCompanionReply(
  prompt: string,
  language: string = "en"
): Promise<CompanionResponse> {
  const apiKey = offlineMobileStore.getGeminiApiKey();

  // 1. Direct Client-Side Gemini REST API (if key is configured)
  if (apiKey && typeof window !== "undefined") {
    const modelsToTry = Array.from(
      new Set(["gemini-3.6-flash", activeGeminiModelName, ...CANDIDATE_GEMINI_MODELS])
    );
    for (const rawModel of modelsToTry) {
      const model = rawModel.replace(/^models\//, "");
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const response = await fetch(geminiUrl, {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: GEMINI_SYSTEM_INSTRUCTION }],
            },
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `${GEMINI_SYSTEM_INSTRUCTION}\n\nElder spoken/typed input: "${prompt}".\nTarget Language: ${language}.\nProvide a compassionate, brief reassuring response in valid JSON format with keys "replyText", "englishTranslation", "emotionTone".`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.35,
              maxOutputTokens: 800,
            },
          }),
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          activeGeminiModelName = model;
          const result = await response.json();
          const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = parseCompanionJson(rawText, prompt, language);
            return {
              replyText: parsed.replyText || rawText,
              englishTranslation: parsed.englishTranslation || parsed.replyText || rawText,
              language,
              emotionTone: parsed.emotionTone || "CALMING",
              suggestedScreen: parsed.suggestedScreen || undefined,
              transcript: parsed.transcript || prompt,
              source: "gemini_online",
            };
          }
        } else {
          const errText = await response.text().catch(() => "");
          console.warn(`Gemini text call to ${model} failed HTTP ${response.status}:`, errText);
        }
      } catch (apiErr) {
        console.warn(`Gemini call to ${model} failed, trying next candidate:`, apiErr);
      }
    }
  }

  // 2. High-Fidelity On-Device Clinical NLU Engine (100% Offline, Zero Latency)
  const langKey = OFFLINE_CLINICAL_BRAIN[language] ? language : "en";
  const intent = classifyElderIntent(prompt);
  const langDict = OFFLINE_CLINICAL_BRAIN[langKey] || OFFLINE_CLINICAL_BRAIN.en;
  const fallback = langDict[intent] || langDict.default;

  return {
    ...fallback,
    transcript: prompt,
    source: "offline_clinical_brain",
  };
}

/**
 * Sends recorded audio directly to Gemini multimodal API or classifies with clinical engine
 */
export async function generateGeminiCompanionAudioReply(
  audioBase64: string,
  mimeType: string = "audio/webm",
  language: string = "en"
): Promise<CompanionResponse> {
  const apiKey = offlineMobileStore.getGeminiApiKey();

  // 1. Direct Multimodal Gemini API Call
  if (apiKey && typeof window !== "undefined") {
    const modelsToTry = Array.from(
      new Set(["gemini-3.6-flash", activeGeminiModelName, ...CANDIDATE_GEMINI_MODELS])
    );
    const cleanMime = (mimeType || "audio/webm").split(";")[0].trim();

    for (const rawModel of modelsToTry) {
      const model = rawModel.replace(/^models\//, "");
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(geminiUrl, {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: GEMINI_SYSTEM_INSTRUCTION }],
            },
            contents: [
              {
                role: "user",
                parts: [
                  {
                    inlineData: {
                      mimeType: cleanMime,
                      data: audioBase64,
                    },
                  },
                  {
                    text: `${GEMINI_SYSTEM_INSTRUCTION}\n\nTarget Language: ${language}. The elder spoke into the microphone. Transcribe their words accurately in "transcript" and provide your soothing response in JSON format with "replyText", "englishTranslation", "emotionTone", "transcript".`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.35,
              maxOutputTokens: 800,
            },
          }),
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          activeGeminiModelName = model;
          const result = await response.json();
          const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = parseCompanionJson(rawText, "Elder's Spoken Voice", language);
            return {
              replyText: parsed.replyText || rawText,
              englishTranslation: parsed.englishTranslation || parsed.replyText || rawText,
              language,
              emotionTone: parsed.emotionTone || "CALMING",
              suggestedScreen: parsed.suggestedScreen || undefined,
              transcript: parsed.transcript || "Elder's Spoken Voice",
              source: "gemini_online",
            };
          }
        } else {
          const errText = await response.text().catch(() => "");
          console.warn(`Gemini audio call to ${model} failed HTTP ${response.status}:`, errText);
        }
      } catch (apiErr) {
        console.warn(`Multimodal call to ${model} failed, trying next candidate:`, apiErr);
      }
    }
  }

  // 2. Offline audio fallback
  const langKey = OFFLINE_CLINICAL_BRAIN[language] ? language : "en";
  const langDict = OFFLINE_CLINICAL_BRAIN[langKey] || OFFLINE_CLINICAL_BRAIN.en;
  return {
    ...langDict.default,
    transcript: "Spoken Audio Question",
    source: "offline_clinical_brain",
  };
}

/**
 * Normal Browser Text-To-Speech (TTS) Speaker Function
 * Uses natural human-ranked voice engine with geriatric prosody (0.88x speed, 1.04 warm pitch)
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
    rate: 0.88,
    pitch: 1.04,
  });
}

/**
 * Stops any ongoing TTS playback immediately
 */
export function stopTTS(): void {
  stopAllSpeech();
}

/**
 * Tests if a Gemini API key is valid and responsive, prioritizing gemini-3.6-flash.
 */
export async function testGeminiApiKey(
  apiKey: string
): Promise<{ success: boolean; message: string; model?: string }> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    return { success: false, message: "Please enter an API key to test." };
  }

  if (typeof window !== "undefined" && !navigator.onLine) {
    return {
      success: false,
      message: "Device is currently offline. Key saved for when connectivity returns.",
    };
  }

  try {
    // 1. Discover available models or prioritize gemini-3.6-flash
    const modelsToTry = Array.from(
      new Set(["gemini-3.6-flash", activeGeminiModelName, ...CANDIDATE_GEMINI_MODELS])
    );

    let primaryError = "";
    let lastError = "";

    for (const rawModel of modelsToTry) {
      const model = rawModel.replace(/^models\//, "");
      try {
        const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
        const res = await fetch(testUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": cleanKey,
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: "Hello" }],
              },
            ],
            generationConfig: { maxOutputTokens: 5 },
          }),
        });

        if (res.ok) {
          activeGeminiModelName = model;
          return {
            success: true,
            message: `Connected successfully to Google ${model}!`,
            model,
          };
        }

        const errJson = await res.json().catch(() => null);
        const errMsg = errJson?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
        lastError = errMsg;
        if (model === "gemini-3.6-flash" || !primaryError) {
          primaryError = errMsg;
        }

        // Stop immediately if key itself is invalid
        if (res.status === 400 && errMsg.toLowerCase().includes("api_key_invalid")) {
          return {
            success: false,
            message: "Google Gemini API Key is invalid. Please check your key from Google AI Studio.",
          };
        }
      } catch (err: any) {
        lastError = err?.message || "Network request failed";
        if (!primaryError) primaryError = lastError;
      }
    }

    return {
      success: false,
      message: `Gemini 3.6 Flash error: ${primaryError || lastError}`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Network request error: ${err?.message || "Check connection"}`,
    };
  }
}


