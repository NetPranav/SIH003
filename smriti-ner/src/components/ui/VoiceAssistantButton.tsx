"use client";

import React, { useState, useEffect, useRef } from "react";
import { playBeep, playGentleChime } from "@/lib/audio";
import { triggerHaptic, announceToScreenReader } from "@/lib/accessibilityMiddleware";
import type { ScreenId } from "@/lib/types";
import { offlineMobileStore } from "@/lib/offlineMobileStorage";
import {
  generateGeminiCompanionReply,
  generateGeminiCompanionAudioReply,
  speakTextWithTTS,
  stopTTS,
  testGeminiApiKey,
  type CompanionResponse,
} from "@/lib/geminiCompanionService";

interface VoiceAssistantButtonProps {
  language: string;
  navigate: (screen: ScreenId) => void;
}

interface LocalizedAssistantLabels {
  trigger: string;
  modalTitle: string;
  greeting: string;
  defaultPrompt: string;
  englishPrompt: string;
  chips: { label: string; query: string }[];
  chipsHeader: string;
  inputPlaceholder: string;
  sendBtn: string;
  thinking: string;
  replayBtn: string;
  stopBtn: string;
  tapToSpeak: string;
  listening: string;
  youAreSpeaking: string;
  doneSpeaking: string;
  cancelSpeaking: string;
  micPermissionNeeded: string;
  speakNaturally: string;
  youAsked: string;
}

const ASSISTANT_LOCALES: Record<string, LocalizedAssistantLabels> = {
  hi: {
    trigger: "स्मृति वॉइस",
    modalTitle: "स्मृति वॉइस साथी",
    greeting: "नमस्ते दादाजी",
    defaultPrompt: "आप अपने परिवार के साथ घर पर सुरक्षित हैं। मुझसे कुछ भी पूछिए।",
    englishPrompt: "You are safe at home with your family. Ask me anything.",
    chipsHeader: "तुरंत पूछें",
    chips: [
      { label: "मैं कहाँ हूँ?", query: "मैं अभी कहाँ हूँ?" },
      { label: "दवा का समय?", query: "मेरी अगली दवा का समय क्या है?" },
      { label: "मेरा परिवार", query: "मेरे परिवार के लोग कहाँ हैं?" },
      { label: "चाय का समय", query: "क्या चाय का समय हो गया है?" },
      { label: "शांत लोककथा", query: "मुझे कोई शांत लोककथा सुनाइए।" },
      { label: "मन शांत करें", query: "मुझे थोड़ा घबराहट महसूस हो रही है।" },
    ],
    inputPlaceholder: "यहाँ अपनी बात लिखें या पूछें...",
    sendBtn: "पूछें",
    thinking: "सोचा जा रहा है...",
    replayBtn: "पुनः सुनें",
    stopBtn: "रोकें",
    tapToSpeak: "बोलने के लिए दबाएं",
    listening: "सुन रहा हूँ... अब बोलिए",
    youAreSpeaking: "आप बोल रहे हैं:",
    doneSpeaking: "हो गया • पूछें",
    cancelSpeaking: "रद्द करें",
    micPermissionNeeded: "माइक्रोफ़ोन की अनुमति चाहिए। कृपया Allow करें।",
    speakNaturally: "साफ़ और आराम से बोलिए",
    youAsked: "आपने पूछा:",
  },
  bn: {
    trigger: "স্মৃতি ভয়েস",
    modalTitle: "স্মৃতি ভয়েস সঙ্গী",
    greeting: "নমস্কার দাদু",
    defaultPrompt: "আপনি নিজের বাড়িতে পরিবারের সাথে নিরাপদে আছেন। কিছু জানতে চান?",
    englishPrompt: "You are safe at home with your family. What would you like to know?",
    chipsHeader: "সহজে জিজ্ঞাসা করুন",
    chips: [
      { label: "আমি কোথায় আছি?", query: "আমি এখন কোথায় আছি?" },
      { label: "ওষুধের সময়?", query: "আমার পরের ওষুধের সময় কখন?" },
      { label: "আমার পরিবার", query: "আমার পরিবারের সবাই কোথায়?" },
      { label: "এক কাপ চা", query: "একটু চা খাওয়া যাবে কি?" },
      { label: "সুন্দর গল্প", query: "আমাকে একটি সুন্দর গল্প বলুন।" },
      { label: "মন শান্ত করুন", query: "আমার একটু চিন্তা হচ্ছে।" },
    ],
    inputPlaceholder: "এখানে আপনার কথা লিখুন...",
    sendBtn: "জিজ্ঞেস করুন",
    thinking: "ভাবছি...",
    replayBtn: "আবার শুনুন",
    stopBtn: "থামুন",
    tapToSpeak: "কথা বলতে চাপুন",
    listening: "শুনছি... এবার বলুন",
    youAreSpeaking: "আপনি বলছেন:",
    doneSpeaking: "হয়ে গেছে • পাঠান",
    cancelSpeaking: "বাতিল",
    micPermissionNeeded: "মাইক্রোফোনের অনুমতি দিন (Allow করুন)",
    speakNaturally: "ধীরে ধীরে স্পষ্ট করে বলুন",
    youAsked: "আপনি জিজ্ঞেস করেছেন:",
  },
  as: {
    trigger: "স্মৃতি কণ্ঠ",
    modalTitle: "স্মৃতি কণ্ঠ সংগী",
    greeting: "নমস্কাৰ বৰদেউতা",
    defaultPrompt: "আপুনি নিজৰ ঘৰতেই সুৰক্ষিতভাৱে আছে। মই আপোনাক কিদৰে সহায় কৰিব পাৰোঁ?",
    englishPrompt: "You are safe at home. How may I help you today?",
    chipsHeader: "সহজে সোধক",
    chips: [
      { label: "মই ক'ত আছোঁ?", query: "মই এতিয়া ক'ত আছোঁ?" },
      { label: "ঔষধৰ সময়?", query: "মোৰ পিছৰ ঔষধ খোৱাৰ সময় কেতিয়া?" },
      { label: "মোৰ পৰিয়াল", query: "মোৰ পৰিয়ালৰ মানুহবোৰ ক'ত?" },
      { label: "চাহ খোৱাৰ সময়", query: "এতিয়া চাহ খোৱাৰ সময় হ'ল নেকি?" },
      { label: "এটি সাধু কওক", query: "মোক এটি ধুনীয়া সাধু কওক।" },
      { label: "মন শান্ত কৰক", query: "মোৰ মনটো অলপ অস্থিৰ লাগিছে।" },
    ],
    inputPlaceholder: "ইয়াত কিবা সোধক বা লিখক...",
    sendBtn: "পঠিয়াওক",
    thinking: "ভাবি থকা হৈছে...",
    replayBtn: "পুনৰ শুনক",
    stopBtn: "বন্ধ কৰক",
    tapToSpeak: "কথা ক'বলৈ টিপক",
    listening: "শুনি আছোঁ... এতিয়া কওক",
    youAreSpeaking: "আপুনি কৈছে:",
    doneSpeaking: "হৈ গ'ল • সোধক",
    cancelSpeaking: "বাতিল কৰক",
    micPermissionNeeded: "মাইক্ৰ'ফ'নৰ অনুমতি দিয়ক (Allow কৰক)",
    speakNaturally: "ধীৰে ধীৰে স্পষ্টকৈ কওক",
    youAsked: "আপুনি সুধিছে:",
  },
  mni: {
    trigger: "ꯁ꯭ꯃ꯭ꯔꯤꯇꯤ ꯈꯣꯟꯊꯣꯛ",
    modalTitle: "ꯁ꯭ꯃ꯭ꯔꯤꯇꯤ ꯈꯣꯟꯊꯣꯛ",
    greeting: "ꯈꯨꯔꯨꯝꯖꯔꯤ ꯏꯄꯥ",
    defaultPrompt: "ꯅꯍꯥꯛ ꯃꯌꯨꯃꯗꯥ ꯅꯨꯡꯉꯥꯏꯅꯥ ꯂꯩꯔꯤ꯫ ꯑꯩꯅꯥ ꯀꯔꯤ ꯃꯇꯦꯡ ꯄꯥꯡꯒꯗꯒꯦ?",
    englishPrompt: "You are resting safely at home. How can I help you?",
    chipsHeader: "ꯌꯥꯝꯅꯥ ꯊꯨꯅꯥ ꯍꯪꯕꯤꯌꯨ",
    chips: [
      { label: "ꯑꯩ ꯀꯗꯥꯌꯗꯥ ꯂꯩꯔꯤ?", query: "ꯑꯩ ꯍꯧꯖꯤꯛ ꯀꯗꯥꯌꯗꯥ ꯂꯩꯔꯤ?" },
      { label: "ꯍꯤꯗꯥꯛ ꯃꯇꝝ?", query: "ꯍꯤꯗꯥꯛ ꯆꯥꯕꯒꯤ ꯃꯇꯝ ꯀꯗꯥꯏꯗꯅꯣ?" },
      { label: "ꯑꯩꯒꯤ ꯏꯃꯨꯡ", query: "ꯑꯩꯒꯤ ꯏꯃꯨꯡ ꯃꯅꯨꯡ ꯀꯗꯥꯏꯗꯥ ꯂꯩꯔꯤ?" },
      { label: "ꯆꯥ ꯊꯛꯅꯕꯥ", query: "ꯆꯥ ꯊꯛꯅꯕꯥ ꯃꯇꯝ ꯑꯣꯏꯔꯕ꯭ꯔꯥ?" },
      { label: "ꯋꯥꯔꯤ ꯑꯃꯥ", query: "ꯅꯨꯡꯉꯥꯏꯔꯕꯥ ꯋꯥꯔꯤ ꯑꯃꯥ ꯍꯥꯌꯕꯤꯌꯨ꯫" },
      { label: "ꯋꯥꯈꯜ ꯅꯨꯡꯉꯥꯏꯍꯅꯕꯥ", query: "ꯋꯥꯈꯜ ꯅꯨꯡꯉꯥꯏꯇꯕꯥ ꯐꯥꯎꯋꯤ꯫" },
    ],
    inputPlaceholder: "ꯋꯥꯍꯪ ꯃꯐꯝ ꯑꯁꯤꯗꯥ ꯏꯕꯤꯌꯨ...",
    sendBtn: "ꯍꯪꯕꯤꯌꯨ",
    thinking: "ꯈꯟꯊꯔꯤ...",
    replayBtn: "ꯑꯃꯨꯛ ꯇꯥꯕꯤꯌꯨ",
    stopBtn: "ꯂꯦꯞꯄꯤꯌꯨ",
    tapToSpeak: "ꯋꯥ ꯉꯥꯡꯅꯕꯥ ꯅꯝꯕꯤꯌꯨ",
    listening: "ꯇꯥꯔꯤ... ꯍꯧꯖꯤꯛ ꯉꯥꯡꯕꯤꯌꯨ",
    youAreSpeaking: "ꯅꯍꯥꯛ ꯉꯥꯡꯂꯤ:",
    doneSpeaking: "ꯂꯣꯏꯔꯦ • ꯊꯥꯕꯤꯌꯨ",
    cancelSpeaking: "ꯂꯦꯞꯄꯤꯌꯨ",
    micPermissionNeeded: "ꯃꯥꯏꯛ ꯑꯌꯥꯕꯥ ꯄꯤꯕꯤꯌꯨ (Allow তৌꯕꯤꯌꯨ)",
    speakNaturally: "ꯇꯞꯅꯥ ꯉꯥꯡꯕꯤꯌꯨ",
    youAsked: "ꯅꯍꯥꯛꯅꯥ ꯍꯪꯈꯤꯕꯥ:",
  },
  brx: {
    trigger: "स्मृति गारां",
    modalTitle: "स्मृति गारां लोगो",
    greeting: "खुलुमबाय आबौ",
    defaultPrompt: "नोंथाङा नखराव मोजाङैनो दं। आंखौ जेबो सोंनो हागोन।",
    englishPrompt: "You are safe at home with your family. Ask me anything.",
    chipsHeader: "गोख्रै सों",
    chips: [
      { label: "आं बबेयाव दं?", query: "आं दा बबेयाव दं?" },
      { label: "मुलिनि सम?", query: "मुलि जानायनि सम जाबाय नामा?" },
      { label: "आंनि नखर", query: "आंनि नखरनि मानसिफोरा बबेयाव?" },
      { label: "साहा लोंनाय", query: "साहा लोंनायनि सम जाबाय नामा?" },
      { label: "सल' खोनासं", query: "आंखौ मोनसे मोजां सल' खोनथा।" },
      { label: "गोसो शान्ति", query: "आंनि गोसोआ खायफा खायफा मोनदों।" },
    ],
    inputPlaceholder: "बेयाव सों...",
    sendBtn: "सों",
    thinking: "सानगासिनो दं...",
    replayBtn: "खोनासं",
    stopBtn: "थानो हो",
    tapToSpeak: "रायहोनो थु",
    listening: "खोनादों... दा बुं",
    youAreSpeaking: "नों बुंदों:",
    doneSpeaking: "जाबाय • हर",
    cancelSpeaking: "थानो हो",
    micPermissionNeeded: "माइकनि गनायथि हो (Allow खालाम)",
    speakNaturally: "मोजाङै बुं",
    youAsked: "नों सोंदों:",
  },
  kha: {
    trigger: "Smriti Sur",
    modalTitle: "Smriti Voice Companion",
    greeting: "Khublei Kpa",
    defaultPrompt: "Phi shngain ha iing bad kiba ha iing. Kiei kiba ngan lah ban ïarap?",
    englishPrompt: "You are safe at home with your family. Ask me anything.",
    chipsHeader: "Kylli kloi",
    chips: [
      { label: "Nga don haei?", query: "Nga don haei mynta?" },
      { label: "Ka por dawai?", query: "Kano ka por dawai kaba bud?" },
      { label: "Ka ïing ka sem", query: "Haei kiba ha ïing jong nga?" },
      { label: "Ka por dih sha", query: "La dei ka por ban dih sha?" },
      { label: "Ka puriskam", query: "Iathuh ïa kawei ka puriskam." },
      { label: "Pynjem jingmut", query: "Nga sngew diaw jingmut." },
    ],
    inputPlaceholder: "Kylli hangne...",
    sendBtn: "Kylli",
    thinking: "Dang pyrkhat...",
    replayBtn: "Sngap pat",
    stopBtn: "Sangeh",
    tapToSpeak: "Kren hangne",
    listening: "Dang sngap... kren mynta",
    youAreSpeaking: "Phi dang kren:",
    doneSpeaking: "Lah dep • Phah",
    cancelSpeaking: "Sangeh",
    micPermissionNeeded: "Ai bor ïa u mic ha ka browser",
    speakNaturally: "Kren suki bad shai",
    youAsked: "Phi la kylli:",
  },
  lus: {
    trigger: "Smriti Aw",
    modalTitle: "Smriti Ṭhian",
    greeting: "Chibai Ka Pu",
    defaultPrompt: "In lamah i him e. Engtin nge ka puih theih che?",
    englishPrompt: "You are safe at home with your family. Ask me anything.",
    chipsHeader: "Zawt zung zung rawh",
    chips: [
      { label: "Khawiah nge ka awm?", query: "Khawiah nge ka awm mek?" },
      { label: "Damdawi ei hun?", query: "Engtikah nge damdawi ei leh hun?" },
      { label: "Ka chhungte", query: "Khawiah nge ka chhungte an awm?" },
      { label: "Thingpui in hun", query: "Thingpui in a hun tawh em?" },
      { label: "Thawnthu min hrilh", query: "Thawnthu ngaihnawm tak min hrilh rawh." },
      { label: "Rilru hahdamna", query: "Ka rilru a hah deuh riau mai." },
    ],
    inputPlaceholder: "Zawt rawh le...",
    sendBtn: "Zawt",
    thinking: "Ngaihtuah mek...",
    replayBtn: "Ngaithla leh rawh",
    stopBtn: "Tawp rawh",
    tapToSpeak: "Tawng turin hmet rawh",
    listening: "Ka ngaithla mek... sawi rawh le",
    youAreSpeaking: "I sawi mek:",
    doneSpeaking: "Ka zo e • Thawn rawh",
    cancelSpeaking: "Tawp rawh",
    micPermissionNeeded: "Khawngaihin mic phalna pe rawh",
    speakNaturally: "Muangchangin sawi rawh",
    youAsked: "I zawh mek chu:",
  },
  en: {
    trigger: "Smriti Voice",
    modalTitle: "Smriti Voice Companion",
    greeting: "Hello Grandfather",
    defaultPrompt: "You are safe and warm at home with family. How may I help you today?",
    englishPrompt: "You are safe and warm at home with family.",
    chipsHeader: "Quick Prompts",
    chips: [
      { label: "Where am I?", query: "Where am I right now?" },
      { label: "Next medicine?", query: "When is my next medicine?" },
      { label: "My family", query: "Where is my family right now?" },
      { label: "Tea time?", query: "Is it time for a cup of tea?" },
      { label: "Tell a folk story", query: "Tell me a soothing folk story." },
      { label: "Help me relax", query: "I am feeling a little restless." },
    ],
    inputPlaceholder: "Ask anything or select a prompt...",
    sendBtn: "Ask",
    thinking: "Thinking peacefully...",
    replayBtn: "Listen Again",
    stopBtn: "Stop Voice",
    tapToSpeak: "Tap to Speak",
    listening: "Listening... speak now",
    youAreSpeaking: "You are saying:",
    doneSpeaking: "Done • Send",
    cancelSpeaking: "Cancel",
    micPermissionNeeded: "Microphone permission is needed. Please allow it.",
    speakNaturally: "Speak clearly and calmly at your own pace",
    youAsked: "You asked:",
  },
};

/**
 * Deduplicates repeated tokens and repeated phrases caused by Android WebSpeech interim accumulation
 */
function cleanDuplicateSpeechWords(raw: string): string {
  if (!raw) return "";
  const words = raw.replace(/\s+/g, " ").trim().split(" ");
  const out: string[] = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const prev = out[out.length - 1];
    if (!prev || w.toLowerCase() !== prev.toLowerCase()) {
      out.push(w);
    }
  }
  let result = out.join(" ");

  // Clean repeated phrase chunks (e.g. "I am feeling I am feeling ok")
  for (let len = 2; len <= 4; len++) {
    const tokens = result.split(" ");
    if (tokens.length >= len * 2) {
      const cleaned: string[] = [];
      let j = 0;
      while (j < tokens.length) {
        if (j + len * 2 <= tokens.length) {
          const p1 = tokens.slice(j, j + len).join(" ").toLowerCase();
          const p2 = tokens.slice(j + len, j + len * 2).join(" ").toLowerCase();
          if (p1 === p2) {
            cleaned.push(...tokens.slice(j, j + len));
            j += len * 2;
            continue;
          }
        }
        cleaned.push(tokens[j]);
        j++;
      }
      result = cleaned.join(" ");
    }
  }
  return result.trim();
}

export default function VoiceAssistantButton({
  language = "en",
  navigate,
}: VoiceAssistantButtonProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const [currentReply, setCurrentReply] = useState<CompanionResponse | null>(null);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [micPermissionDenied, setMicPermissionDenied] = useState<boolean>(false);
  const [userSpokenQuery, setUserSpokenQuery] = useState<string>("");

  // Caregiver AI & Natural Voice settings state
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>("");
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [keySavedMessage, setKeySavedMessage] = useState<string>("");
  const [isTestingVoice, setIsTestingVoice] = useState<boolean>(false);
  const [isTestingKey, setIsTestingKey] = useState<boolean>(false);
  const [keyTestFeedback, setKeyTestFeedback] = useState<{ success: boolean; text: string } | null>(null);

  const loc = ASSISTANT_LOCALES[language] || ASSISTANT_LOCALES.en;

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const animIntervalRef = useRef<number | null>(null);
  const transcriptRef = useRef<string>("");
  const maxTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync stored Gemini API Key on open / mount
  useEffect(() => {
    const existingKey = offlineMobileStore.getGeminiApiKey();
    setApiKeyInput(existingKey);
    setHasApiKey(Boolean(existingKey && existingKey.trim().length > 0));
  }, [isOpen]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopTTS();
      cancelListening();
    };
  }, []);

  const handleTestApiKey = async () => {
    if (!apiKeyInput.trim()) {
      setKeyTestFeedback({ success: false, text: "Please enter an API key to test." });
      return;
    }
    setIsTestingKey(true);
    setKeyTestFeedback(null);
    try {
      const res = await testGeminiApiKey(apiKeyInput.trim());
      setIsTestingKey(false);
      setKeyTestFeedback({ success: res.success, text: res.message });
      if (res.success) {
        offlineMobileStore.setGeminiApiKey(apiKeyInput.trim());
        setHasApiKey(true);
        setKeySavedMessage("✓ Key verified and active for all users!");
        setTimeout(() => setKeySavedMessage(""), 4000);
      }
    } catch {
      setIsTestingKey(false);
      setKeyTestFeedback({ success: false, text: "Connection test failed. Check internet." });
    }
  };

  const handleSaveApiKey = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    offlineMobileStore.setGeminiApiKey(apiKeyInput);
    const hasKey = Boolean(apiKeyInput && apiKeyInput.trim().length > 0);
    setHasApiKey(hasKey);
    setKeySavedMessage(hasKey ? "✓ Gemini API Key saved. Cloud AI active." : "✓ Offline clinical engine active.");
    setTimeout(() => setKeySavedMessage(""), 3500);
  };

  const handleClearApiKey = () => {
    setApiKeyInput("");
    offlineMobileStore.setGeminiApiKey("");
    setHasApiKey(false);
    setKeyTestFeedback(null);
    setKeySavedMessage("✓ Reverted to 100% Offline Clinical Engine.");
    setTimeout(() => setKeySavedMessage(""), 3500);
  };

  const handleTestNaturalVoice = () => {
    setIsSpeaking(true);
    setIsTestingVoice(true);
    const testPhrases: Record<string, string> = {
      hi: "नमस्ते दादाजी, मैं आपकी देखभाल साथी स्मृति हूँ। सब कुछ सुरक्षित और शांत है।",
      bn: "নমস্কার দাদু, আমি স্মৃতি। আপনার সেবায় আমি সর্বদা পাশে আছি।",
      as: "নমস্কাৰ বৰদেউতা, মই স্মৃতি। আপুনি নিজৰ ঘৰতেই সুৰক্ষিতভাৱে আছে।",
      mni: "ꯈꯨꯔꯨꯝꯖꯔꯤ ꯏꯄꯥ, ꯑꯩ ꯁ꯭ꯃ꯭ꯔꯤꯇꯤꯅꯤ꯫ ꯅꯍꯥꯛ ꯃꯌꯨꯃꯗꯥ ꯅꯨꯡꯉꯥꯏꯅꯥ ꯂꯩꯔꯤ꯫",
      brx: "खुलुमबाय आबौ, आं स्मृति। नोंथाङा नखराव मोजाङैनो दं।",
      kha: "Khublei Kpa, nga dei ka Smriti. Phi shngain ha iing bad kiba ha iing.",
      lus: "Chibai Ka Pu, Smriti ka ni e. In lamah i him e.",
      en: "Hello Grandfather, I am Smriti. You are safe at home with your family.",
    };
    const phrase = testPhrases[language] || testPhrases.en;
    speakTextWithTTS(
      phrase,
      language,
      () => {
        setIsSpeaking(false);
        setIsTestingVoice(false);
      },
      () => {
        setIsSpeaking(false);
        setIsTestingVoice(false);
      }
    );
  };

  const getWebSpeechLang = (lang: string): string => {
    switch (lang) {
      case "hi":
        return "hi-IN";
      case "bn":
        return "bn-IN";
      case "as":
        return "as-IN";
      case "mni":
      case "brx":
        return "hi-IN";
      case "kha":
      case "lus":
      case "en":
      default:
        return "en-IN";
    }
  };

  const handleOpen = () => {
    triggerHaptic("tap");
    playGentleChime();
    setIsOpen(true);
    setLiveTranscript("");
    setUserSpokenQuery("");
    setMicPermissionDenied(false);

    const initialText = loc.defaultPrompt;
    setCurrentReply({
      replyText: initialText,
      englishTranslation: loc.englishPrompt,
      language,
      emotionTone: "CALMING",
    });

    // Speak initial greeting safely
    setIsSpeaking(true);
    speakTextWithTTS(
      initialText,
      language,
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
    announceToScreenReader(`${loc.greeting}. ${initialText}`, "assertive");
  };

  const handleClose = () => {
    stopTTS();
    cancelListening();
    setIsSpeaking(false);
    setIsOpen(false);
    setShowSettings(false);
    setUserSpokenQuery("");
  };

  /**
   * Safe, non-blocking microphone activator
   * Prevents audio hardware conflict on Android WebView
   */
  const startListening = () => {
    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
        recognitionRef.current = null;
      }

      stopTTS();
      setIsSpeaking(false);
      setLiveTranscript("");
      transcriptRef.current = "";
      audioChunksRef.current = [];
      setMicPermissionDenied(false);
      setIsListeningMic(true);
      triggerHaptic("tap");

      // Simulated soundwave pulsation (zero hardware conflict)
      if (animIntervalRef.current) {
        clearInterval(animIntervalRef.current);
      }
      let step = 0;
      animIntervalRef.current = window.setInterval(() => {
        step = (step + 1) % 10;
        const level = 35 + Math.sin(step) * 25 + Math.random() * 20;
        setAudioLevel(Math.round(level));
      }, 100) as unknown as number;

      // Primary Speech Engine: Web Speech API
      const SpeechRecognition =
        typeof window !== "undefined"
          ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
          : null;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false; // Single query utterance to prevent duplicate phrase accumulation
          recognition.interimResults = true;
          recognition.lang = getWebSpeechLang(language);

          recognition.onresult = (event: any) => {
            let currentStr = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              currentStr += event.results[i][0].transcript;
            }
            const cleaned = cleanDuplicateSpeechWords(currentStr);
            if (cleaned) {
              setLiveTranscript(cleaned);
              transcriptRef.current = cleaned;
            }
          };

          recognition.onerror = (err: any) => {
            console.debug("Web Speech notice:", err?.error);
            if (err?.error === "not-allowed" || err?.error === "service-not-allowed") {
              setMicPermissionDenied(true);
            }
          };

          recognition.onend = () => {
            // If user finished speaking their sentence, auto-submit
            if (transcriptRef.current && transcriptRef.current.trim().length > 1) {
              stopListeningAndSubmit();
            } else {
              setIsListeningMic(false);
            }
          };

          recognition.start();
          recognitionRef.current = recognition;
        } catch (speechErr) {
          console.debug("SpeechRecognition notice:", speechErr);
        }
      } else if (
        typeof window !== "undefined" &&
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia
      ) {
        // Fallback to MediaRecorder ONLY if Web Speech is unavailable
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            streamRef.current = stream;
            try {
              const mimeType =
                typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/webm")
                  ? "audio/webm"
                  : typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/mp4")
                  ? "audio/mp4"
                  : "";
              const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
              mediaRecorderRef.current = recorder;
              recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                  audioChunksRef.current.push(e.data);
                }
              };
              recorder.start(250);
            } catch (recErr) {
              console.warn("MediaRecorder start notice:", recErr);
            }
          })
          .catch((permErr) => {
            console.warn("Microphone access notice:", permErr);
            setMicPermissionDenied(true);
            setIsListeningMic(false);
          });
      }

      // 18s safety timeout
      if (maxTimerRef.current) clearTimeout(maxTimerRef.current);
      maxTimerRef.current = setTimeout(() => {
        stopListeningAndSubmit();
      }, 18000);
    } catch (err) {
      console.warn("startListening error safely intercepted:", err);
      setIsListeningMic(false);
      setMicPermissionDenied(true);
    }
  };

  const stopListeningAndSubmit = async () => {
    try {
      if (maxTimerRef.current) {
        clearTimeout(maxTimerRef.current);
        maxTimerRef.current = null;
      }
      if (animIntervalRef.current) {
        clearInterval(animIntervalRef.current);
        animIntervalRef.current = null;
      }
      setAudioLevel(0);
      setIsListeningMic(false);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
      mediaRecorderRef.current = null;

      if (streamRef.current) {
        try {
          streamRef.current.getTracks().forEach((t) => t.stop());
        } catch {}
        streamRef.current = null;
      }

      const rawText = (transcriptRef.current || liveTranscript).trim();
      const recognizedText = cleanDuplicateSpeechWords(rawText);
      if (recognizedText) {
        setUserSpokenQuery(recognizedText);
        setLiveTranscript("");
        transcriptRef.current = "";
        handleSendQuery(recognizedText);
        return;
      }

      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (audioBlob.size > 1500) {
          handleSendAudioBlob(audioBlob);
          return;
        }
      }
      setLiveTranscript("");
    } catch (submitErr) {
      console.warn("Submit voice query error:", submitErr);
      setIsListeningMic(false);
    }
  };

  const cancelListening = () => {
    try {
      if (maxTimerRef.current) {
        clearTimeout(maxTimerRef.current);
        maxTimerRef.current = null;
      }
      if (animIntervalRef.current) {
        clearInterval(animIntervalRef.current);
        animIntervalRef.current = null;
      }
      setAudioLevel(0);
      setIsListeningMic(false);
      setLiveTranscript("");
      transcriptRef.current = "";
      audioChunksRef.current = [];

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
      mediaRecorderRef.current = null;

      if (streamRef.current) {
        try {
          streamRef.current.getTracks().forEach((t) => t.stop());
        } catch {}
        streamRef.current = null;
      }
    } catch {}
  };

  const handleSendAudioBlob = async (blob: Blob) => {
    setIsLoading(true);
    stopTTS();
    setIsSpeaking(false);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const resultStr = reader.result as string;
      const base64Data = resultStr ? resultStr.split(",")[1] : "";
      if (!base64Data) {
        setIsLoading(false);
        return;
      }
      try {
        const resp = await generateGeminiCompanionAudioReply(base64Data, blob.type || "audio/webm", language);
        setCurrentReply(resp);
        if (resp.transcript) {
          setUserSpokenQuery(resp.transcript);
        }
        setIsLoading(false);
        setIsSpeaking(true);
        speakTextWithTTS(
          resp.replyText,
          language,
          () => setIsSpeaking(false),
          () => setIsSpeaking(false)
        );
        announceToScreenReader(resp.replyText, "assertive");
      } catch {
        setIsLoading(false);
        setIsSpeaking(false);
      }
    };
    reader.readAsDataURL(blob);
  };

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setUserSpokenQuery(queryText.trim());
    setInputText("");
    setIsLoading(true);
    setIsSpeaking(false);

    try {
      const resp = await generateGeminiCompanionReply(queryText, language);
      setCurrentReply(resp);
      setIsLoading(false);

      setIsSpeaking(true);
      speakTextWithTTS(
        resp.replyText,
        language,
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
      announceToScreenReader(resp.replyText, "assertive");
    } catch {
      setIsLoading(false);
      setIsSpeaking(false);
    }
  };

  const handleReplay = () => {
    if (!currentReply) return;
    setIsSpeaking(true);
    speakTextWithTTS(
      currentReply.replyText,
      language,
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const handleStopSpeech = () => {
    stopTTS();
    setIsSpeaking(false);
  };

  const handleScreenAction = (screen: ScreenId) => {
    handleClose();
    playBeep(440, 100);
    navigate(screen);
  };

  return (
    <>
      {/* ── Floating Action Trigger Button ── */}
      <button
        id="voice-assistant-fab-btn"
        data-testid="voice-assistant-fab-btn"
        type="button"
        onClick={handleOpen}
        aria-label="Smriti Voice Assistant"
        style={{
          position: "fixed",
          bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))",
          right: "max(env(safe-area-inset-right, 0px), 1.25rem)",
          zIndex: 40,
          background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
          color: "#ffffff",
          border: "2px solid #38bdf8",
          borderRadius: "999px",
          padding: "0.75rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          cursor: "pointer",
          boxShadow: "0 10px 25px -5px rgba(2, 132, 199, 0.45)",
          minHeight: "56px",
          transition: "transform 0.15s ease",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
        <span style={{ fontSize: "0.95rem", fontWeight: 800, letterSpacing: "0.02em" }}>
          {loc.trigger}
        </span>
      </button>

      {/* ── Voice Dialogue Modal ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="voice-modal-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "0.75rem",
          }}
        >
          <div
            id="voice-assistant-modal-content"
            style={{
              background: "#ffffff",
              borderRadius: "24px 24px 16px 16px",
              padding: "1.25rem 1.25rem env(safe-area-inset-bottom, 1rem)",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "0 -10px 30px -5px rgba(0, 0, 0, 0.25)",
              maxHeight: "92dvh",
              overflowY: "auto",
              color: "#0f172a",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {/* Header & Controls */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.85rem",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "0.6rem",
              }}
            >
              <div>
                <span
                  id="voice-modal-title"
                  style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}
                >
                  {loc.modalTitle}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "2px" }}>
                  <button
                    type="button"
                    onClick={() => setShowSettings(!showSettings)}
                    id="ai-engine-status-pill"
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "0.15rem 0.55rem",
                      borderRadius: "999px",
                      background: hasApiKey ? "#ecfdf5" : "#f1f5f9",
                      color: hasApiKey ? "#065f46" : "#475569",
                      border: hasApiKey ? "1px solid #a7f3d0" : "1px solid #cbd5e1",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: hasApiKey ? "#10b981" : "#0284c7" }} />
                    <span>{hasApiKey ? "Live Gemini AI (Active)" : "Clinical AI (On-Device)"}</span>
                    <span style={{ fontSize: "0.65rem", opacity: 0.8 }}>• Setup</span>
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <button
                  type="button"
                  id="voice-settings-gear-btn"
                  onClick={() => setShowSettings(!showSettings)}
                  aria-label="Caregiver Voice Settings"
                  style={{
                    padding: "0.4rem 0.65rem",
                    borderRadius: "8px",
                    border: showSettings ? "2px solid #0284c7" : "1px solid #cbd5e1",
                    background: showSettings ? "#e0f2fe" : "#f8fafc",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  Settings
                </button>
                <button
                  type="button"
                  id="voice-assistant-close-btn"
                  onClick={handleClose}
                  aria-label="Close"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "1px solid #cbd5e1",
                    background: "#f1f5f9",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#475569",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Caregiver Settings Card */}
            {showSettings && (
              <div
                id="caregiver-voice-settings-card"
                style={{
                  background: "#f8fafc",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "14px",
                  padding: "0.85rem",
                  marginBottom: "1rem",
                  textAlign: "left",
                }}
              >
                <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "#0f172a", marginBottom: "0.4rem" }}>
                  Caregiver AI & Voice Setup
                </div>

                <div style={{ marginBottom: "0.65rem" }}>
                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#334155", marginBottom: "0.2rem" }}>
                    Google Gemini API Key (Optional):
                  </label>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="Paste Gemini API Key (AIza...)"
                      style={{
                        flex: 1,
                        padding: "0.45rem 0.6rem",
                        borderRadius: "8px",
                        border: "1px solid #94a3b8",
                        fontSize: "0.8rem",
                      }}
                    />
                    <button
                      type="button"
                      disabled={isTestingKey}
                      onClick={handleTestApiKey}
                      style={{
                        padding: "0.45rem 0.65rem",
                        background: "#059669",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: isTestingKey ? "wait" : "pointer",
                      }}
                    >
                      {isTestingKey ? "Testing..." : "Test Key"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveApiKey()}
                      style={{
                        padding: "0.45rem 0.65rem",
                        background: "#0284c7",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                    {hasApiKey && (
                      <button
                        type="button"
                        onClick={handleClearApiKey}
                        style={{
                          padding: "0.45rem 0.55rem",
                          background: "#fee2e2",
                          color: "#b91c1c",
                          border: "1px solid #fca5a5",
                          borderRadius: "8px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {keyTestFeedback && (
                    <div style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      marginTop: "0.35rem",
                      padding: "0.35rem 0.6rem",
                      borderRadius: "6px",
                      background: keyTestFeedback.success ? "#d1fae5" : "#fee2e2",
                      color: keyTestFeedback.success ? "#065f46" : "#991b1b",
                      border: keyTestFeedback.success ? "1px solid #6ee7b7" : "1px solid #fca5a5",
                    }}>
                      {keyTestFeedback.success ? "✓ " : "✕ "}{keyTestFeedback.text}
                    </div>
                  )}

                  {keySavedMessage && (
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#059669", marginTop: "0.25rem" }}>
                      {keySavedMessage}
                    </div>
                  )}

                  <div style={{ fontSize: "0.68rem", color: "#64748b", marginTop: "0.35rem" }}>
                    Works 100% offline or with your custom Gemini API key. Each caregiver or user can enter their personal key here.
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: "1px solid #e2e8f0" }}>
                  <div>
                    <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "#1e293b" }}>
                      Neural Voice Synthesizer
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>
                      Calibrated 0.88x speed with comforting prosody
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestNaturalVoice}
                    disabled={isTestingVoice}
                    style={{
                      padding: "0.35rem 0.7rem",
                      background: isTestingVoice ? "#e2e8f0" : "#dbeafe",
                      color: isTestingVoice ? "#64748b" : "#1d4ed8",
                      border: "1px solid #93c5fd",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: isTestingVoice ? "default" : "pointer",
                    }}
                  >
                    {isTestingVoice ? "Speaking..." : "Test Voice"}
                  </button>
                </div>
              </div>
            )}

            {/* Microphone Station */}
            <div
              id="voice-center-mic-card"
              style={{
                background: isListeningMic ? "#fef2f2" : "#f0f9ff",
                border: isListeningMic ? "2px solid #ef4444" : "1.5px solid #bae6fd",
                borderRadius: "18px",
                padding: "1.1rem 1rem",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {!isListeningMic ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <button
                    id="main-mic-listen-btn"
                    data-testid="main-mic-listen-btn"
                    type="button"
                    onClick={startListening}
                    aria-label={loc.tapToSpeak}
                    style={{
                      width: "76px",
                      height: "76px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                      color: "#ffffff",
                      border: "3px solid #38bdf8",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.6rem",
                      boxShadow: "0 4px 12px rgba(2, 132, 199, 0.35)",
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" x2="12" y1="19" y2="22" />
                    </svg>
                  </button>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0369a1", marginBottom: "0.15rem" }}>
                    {loc.tapToSpeak}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>
                    {loc.speakNaturally}
                  </div>

                  {micPermissionDenied && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.55rem 0.75rem",
                        background: "#fffbeb",
                        border: "1.5px solid #fcd34d",
                        borderRadius: "10px",
                        color: "#92400e",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        textAlign: "left",
                      }}
                    >
                      <div>Notice: {loc.micPermissionNeeded}</div>
                      <button
                        type="button"
                        onClick={startListening}
                        style={{
                          marginTop: "0.35rem",
                          padding: "0.3rem 0.6rem",
                          background: "#f59e0b",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Retry Permission
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <button
                    id="main-mic-listen-btn"
                    data-testid="main-mic-listen-btn"
                    type="button"
                    onClick={stopListeningAndSubmit}
                    aria-label="Stop and send"
                    style={{
                      width: "76px",
                      height: "76px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
                      color: "#ffffff",
                      border: "3px solid #fca5a5",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.5rem",
                      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.35)",
                    }}
                  >
                    <div style={{ width: "24px", height: "24px", background: "#ffffff", borderRadius: "4px" }} />
                  </button>

                  <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#b91c1c", marginBottom: "0.4rem" }}>
                    {loc.listening}
                  </div>

                  {/* Dynamic Soundwave */}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", height: "26px", marginBottom: "0.75rem" }}>
                    {[16, 26, 38, 22, 32, 18, 28, 16, 24, 14].map((baseH, idx) => {
                      const dynamicH = Math.max(6, Math.round((baseH * (audioLevel + 30)) / 100));
                      return (
                        <div
                          key={idx}
                          style={{
                            width: "5px",
                            height: `${dynamicH}px`,
                            backgroundColor: "#ef4444",
                            borderRadius: "999px",
                            transition: "height 0.1s ease",
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Spoken Transcript Box */}
                  <div
                    style={{
                      width: "100%",
                      background: "#ffffff",
                      border: "1.5px solid #fca5a5",
                      borderRadius: "10px",
                      padding: "0.65rem 0.8rem",
                      textAlign: "left",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#991b1b", textTransform: "uppercase", marginBottom: "2px" }}>
                      {loc.youAreSpeaking}
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: liveTranscript ? "#0f172a" : "#94a3b8" }}>
                      {liveTranscript || "Speak comfortably into device..."}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                    <button
                      id="mic-done-speaking-btn"
                      type="button"
                      onClick={stopListeningAndSubmit}
                      style={{
                        flex: 1,
                        padding: "0.6rem 1rem",
                        background: "#16a34a",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "0.9rem",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {loc.doneSpeaking}
                    </button>
                    <button
                      type="button"
                      onClick={cancelListening}
                      style={{
                        padding: "0.6rem 0.9rem",
                        background: "#f1f5f9",
                        color: "#475569",
                        border: "1px solid #cbd5e1",
                        borderRadius: "10px",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {loc.cancelSpeaking}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Spoken Query Prompt */}
            {userSpokenQuery && !isListeningMic && (
              <div
                style={{
                  background: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  borderRadius: "10px",
                  padding: "0.45rem 0.75rem",
                  marginBottom: "0.75rem",
                  fontSize: "0.82rem",
                  color: "#0369a1",
                }}
              >
                <span style={{ fontWeight: 800 }}>{loc.youAsked} </span>
                <span>&ldquo;{userSpokenQuery}&rdquo;</span>
              </div>
            )}

            {/* AI Response Display */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "14px",
                border: "1.5px solid #e2e8f0",
                padding: "0.9rem",
                marginBottom: "1rem",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: isSpeaking ? "#15803d" : isLoading ? "#b45309" : "#0369a1",
                    textTransform: "uppercase",
                  }}
                >
                  {isSpeaking ? "Speaking Voice..." : isLoading ? "Thinking..." : "Companion Response"}
                </span>
                {currentReply?.source && (
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: currentReply.source === "gemini_online" ? "#065f46" : "#475569",
                      background: currentReply.source === "gemini_online" ? "#ecfdf5" : "#f1f5f9",
                      padding: "0.1rem 0.4rem",
                      borderRadius: "6px",
                      border: currentReply.source === "gemini_online" ? "1px solid #a7f3d0" : "1px solid #cbd5e1",
                    }}
                  >
                    {currentReply.source === "gemini_online" ? "Gemini Live" : "Offline Clinical"}
                  </span>
                )}
              </div>

              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", lineHeight: 1.4, marginBottom: "0.3rem" }}>
                {isLoading ? loc.thinking : currentReply?.replyText || loc.defaultPrompt}
              </div>

              {language !== "en" && currentReply?.englishTranslation && (
                <div style={{ fontSize: "0.78rem", color: "#64748b", fontStyle: "italic", borderTop: "1px dashed #e2e8f0", paddingTop: "0.3rem" }}>
                  Translation: {currentReply.englishTranslation}
                </div>
              )}

              {/* Audio Controls */}
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.65rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleReplay}
                  style={{
                    padding: "0.35rem 0.75rem",
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#1d4ed8",
                    cursor: "pointer",
                  }}
                >
                  {loc.replayBtn}
                </button>
                {isSpeaking && (
                  <button
                    type="button"
                    onClick={handleStopSpeech}
                    style={{
                      padding: "0.35rem 0.75rem",
                      background: "#fee2e2",
                      border: "1px solid #fca5a5",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#b91c1c",
                      cursor: "pointer",
                    }}
                  >
                    {loc.stopBtn}
                  </button>
                )}
                {currentReply?.suggestedScreen && (
                  <button
                    type="button"
                    onClick={() => handleScreenAction(currentReply.suggestedScreen!)}
                    style={{
                      padding: "0.35rem 0.75rem",
                      background: "#ecfdf5",
                      border: "1px solid #a7f3d0",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#065f46",
                      cursor: "pointer",
                      marginLeft: "auto",
                    }}
                  >
                    Open View →
                  </button>
                )}
              </div>
            </div>

            {/* Quick 1-Tap Prompts */}
            <div style={{ marginBottom: "0.85rem", textAlign: "left" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#64748b", marginBottom: "0.35rem", textTransform: "uppercase" }}>
                {loc.chipsHeader}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
                {loc.chips.map((c, idx) => (
                  <button
                    key={idx}
                    id={`prompt-chip-${idx}`}
                    type="button"
                    onClick={() => handleSendQuery(c.query)}
                    style={{
                      padding: "0.55rem 0.6rem",
                      background: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "#1e293b",
                      textAlign: "left",
                      lineHeight: 1.25,
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input Fallback */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery(inputText);
              }}
              style={{ display: "flex", gap: "0.4rem" }}
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={loc.inputPlaceholder}
                style={{
                  flex: 1,
                  padding: "0.65rem 0.75rem",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "0.85rem",
                  color: "#0f172a",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                id="voice-text-send-btn"
                disabled={!inputText.trim()}
                style={{
                  padding: "0.65rem 1rem",
                  background: inputText.trim() ? "#0284c7" : "#e2e8f0",
                  color: inputText.trim() ? "#ffffff" : "#94a3b8",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 800,
                  fontSize: "0.82rem",
                  cursor: inputText.trim() ? "pointer" : "default",
                }}
              >
                {loc.sendBtn}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
