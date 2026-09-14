"use client";

import React, { useState, useEffect, useRef } from "react";
import { playBeep, playGentleChime } from "@/lib/audio";
import { triggerHaptic, announceToScreenReader } from "@/lib/accessibilityMiddleware";
import type { ScreenId } from "@/lib/types";
import {
  generateGeminiCompanionReply,
  generateGeminiCompanionAudioReply,
  speakTextWithTTS,
  stopTTS,
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
    trigger: "स्मृति AI आवाज",
    modalTitle: "स्मृति AI साथी • Smriti Voice",
    greeting: "नमस्ते दादाजी 👋",
    defaultPrompt: "आप अपने परिवार के साथ घर पर सुरक्षित हैं। मुझसे कुछ भी पूछिए।",
    englishPrompt: "You are safe at home with your family. Ask me anything.",
    chipsHeader: "Quick Prompts • तुरंत पूछें",
    chips: [
      { label: "📍 मैं कहाँ हूँ?", query: "मैं अभी कहाँ हूँ?" },
      { label: "💊 दवा का समय?", query: "मेरी अगली दवा का समय क्या है?" },
      { label: "📖 शांत लोककथा", query: "मुझे कोई शांत लोककथा सुनाइए।" },
      { label: "🌸 मन शांत करें", query: "मुझे थोड़ा घबराहट महसूस हो रही है।" },
    ],
    inputPlaceholder: "यहाँ अपनी बात लिखें या पूछें...",
    sendBtn: "पूछें",
    thinking: "सोचा जा रहा है...",
    replayBtn: "पुनः सुनें",
    stopBtn: "रोकें",
    tapToSpeak: "बोलने के लिए दबाएं",
    listening: "🎙️ सुन रहा हूँ... अब बोलिए",
    youAreSpeaking: "आप बोल रहे हैं:",
    doneSpeaking: "✓ हो गया • पूछें",
    cancelSpeaking: "रद्द करें",
    micPermissionNeeded: "माइक्रोफ़ोन की अनुमति चाहिए। कृपया ब्राउज़र में Allow करें।",
    speakNaturally: "साफ़ और आराम से बोलिए",
    youAsked: "आपने पूछा:",
  },
  bn: {
    trigger: "স্মৃতি AI ভয়েস",
    modalTitle: "স্মৃতি AI সঙ্গী • Smriti Voice",
    greeting: "নমস্কার দাদু 👋",
    defaultPrompt: "আপনি নিজের বাড়িতে পরিবারের সাথে নিরাপদে আছেন। কিছু জানতে চান?",
    englishPrompt: "You are safe at home with your family. What would you like to know?",
    chipsHeader: "Quick Prompts • সহজে জিজ্ঞাসা করুন",
    chips: [
      { label: "📍 আমি কোথায় আছি?", query: "আমি এখন কোথায় আছি?" },
      { label: "💊 ওষুধের সময়?", query: "আমার পরের ওষুধের সময় কখন?" },
      { label: "📖 সুন্দর গল্প", query: "আমাকে একটি সুন্দর গল্প বলুন।" },
      { label: "🌸 মন শান্ত করুন", query: "আমার একটু চিন্তা হচ্ছে।" },
    ],
    inputPlaceholder: "এখানে আপনার কথা লিখুন...",
    sendBtn: "জিজ্ঞেস করুন",
    thinking: "ভাবছি...",
    replayBtn: "আবার শুনুন",
    stopBtn: "থামুন",
    tapToSpeak: "কথা বলতে চাপুন",
    listening: "🎙️ শুনছি... এবার বলুন",
    youAreSpeaking: "আপনি বলছেন:",
    doneSpeaking: "✓ হয়ে গেছে • পাঠান",
    cancelSpeaking: "বাতিল",
    micPermissionNeeded: "মাইক্রোফোনের অনুমতি দিন (ব্রাউজারে Allow করুন)",
    speakNaturally: "ধীরে ধীরে স্পষ্ট করে বলুন",
    youAsked: "আপনি জিজ্ঞেস করেছেন:",
  },
  as: {
    trigger: "স্মৃতি AI কণ্ঠ",
    modalTitle: "স্মৃতি AI কণ্ঠ সংগী • Smriti Voice",
    greeting: "নমস্কাৰ বৰদেউতা 👋",
    defaultPrompt: "আপুনি নিজৰ ঘৰতেই সুৰক্ষিতভাৱে আছে। মই আপোনাক কিদৰে সহায় কৰিব পাৰোঁ?",
    englishPrompt: "You are safe at home. How may I help you today?",
    chipsHeader: "Quick Prompts • সহজে সোধক",
    chips: [
      { label: "📍 মই ক'ত আছোঁ?", query: "মই এতিয়া ক'ত আছোঁ?" },
      { label: "💊 ঔষধৰ সময়?", query: "মোৰ পিছৰ ঔষধ খোৱাৰ সময় কেতিয়া?" },
      { label: "📖 এটি সাধু কওক", query: "মোক এটি ধুনীয়া সাধু কওক।" },
      { label: "🌸 মন শান্ত কৰক", query: "মোৰ মনটো অলপ অস্থিৰ লাগিছে।" },
    ],
    inputPlaceholder: "ইয়াত কিবা সোধক বা লিখক...",
    sendBtn: "পঠিয়াওক",
    thinking: "ভাবি থকা হৈছে...",
    replayBtn: "পুনৰ শুনক",
    stopBtn: "বন্ধ কৰক",
    tapToSpeak: "কথা ক'বলৈ টিপক",
    listening: "🎙️ শুনি আছোঁ... এতিয়া কওক",
    youAreSpeaking: "আপুনি কৈছে:",
    doneSpeaking: "✓ হৈ গ'ল • সোধক",
    cancelSpeaking: "বাতিল কৰক",
    micPermissionNeeded: "মাইক্ৰ'ফ'নৰ অনুমতি দিয়ক (Allow কৰক)",
    speakNaturally: "ধীৰে ধীৰে স্পষ্টকৈ কওক",
    youAsked: "আপুনি সুধিছে:",
  },
  mni: {
    trigger: "ꯁ꯭ꯃ꯭ꯔꯤꯇꯤ AI ꯈꯣꯟꯊꯣꯛ",
    modalTitle: "ꯁ꯭ꯃ꯭ꯔꯤꯇꯤ AI ꯈꯣꯟꯊꯣꯛ • Smriti Voice",
    greeting: "ꯈꯨꯔꯨꯝꯖꯔꯤ ꯏꯄꯥ 👋",
    defaultPrompt: "ꯅꯍꯥꯛ ꯃꯌꯨꯃꯗꯥ ꯅꯨꯡꯉꯥꯏꯅꯥ ꯂꯩꯔꯤ꯫ ꯑꯩꯅꯥ ꯀꯔꯤ ꯃꯇꯦꯡ ꯄꯥꯡꯒꯗꯒꯦ?",
    englishPrompt: "You are resting safely at home. How can I help you?",
    chipsHeader: "Quick Prompts • ꯌꯥꯝꯅꯥ ꯊꯨꯅꯥ ꯍꯪꯕꯤꯌꯨ",
    chips: [
      { label: "📍 ꯑꯩ ꯀꯗꯥꯌꯗꯥ ꯂꯩꯔꯤ?", query: "ꯑꯩ ꯍꯧꯖꯤꯛ ꯀꯗꯥꯌꯗꯥ ꯂꯩꯔꯤ?" },
      { label: "💊 ꯍꯤꯗꯥꯛ ꯃꯇꝝ?", query: "ꯍꯤꯗꯥꯛ ꯆꯥꯕꯒꯤ ꯃꯇꯝ ꯀꯗꯥꯏꯗꯅꯣ?" },
      { label: "📖 ꯋꯥꯔꯤ ꯑꯃꯥ", query: "ꯅꯨꯡꯉꯥꯏꯔꯕꯥ ꯋꯥꯔꯤ ꯑꯃꯥ ꯍꯥꯌꯕꯤꯌꯨ꯫" },
      { label: "🌸 ꯋꯥꯈꯜ ꯅꯨꯡꯉꯥꯏꯍꯅꯕꯥ", query: "ꯋꯥꯈꯜ ꯅꯨꯡꯉꯥꯏꯇꯕꯥ ꯐꯥꯎꯋꯤ꯫" },
    ],
    inputPlaceholder: "ꯋꯥꯍꯪ ꯃꯐꯝ ꯑꯁꯤꯗꯥ ꯏꯕꯤꯌꯨ...",
    sendBtn: "ꯍꯪꯕꯤꯌꯨ",
    thinking: "ꯈꯟꯊꯔꯤ...",
    replayBtn: "ꯑꯃꯨꯛ ꯇꯥꯕꯤꯌꯨ",
    stopBtn: "ꯂꯦꯞꯄꯤꯌꯨ",
    tapToSpeak: "ꯋꯥ ꯉꯥꯡꯅꯕꯥ ꯅꯝꯕꯤꯌꯨ",
    listening: "🎙️ ꯇꯥꯔꯤ... ꯍꯧꯖꯤꯛ ꯉꯥꯡꯕꯤꯌꯨ",
    youAreSpeaking: "ꯅꯍꯥꯛ ꯉꯥꯡꯂꯤ:",
    doneSpeaking: "✓ ꯂꯣꯏꯔꯦ • ꯊꯥꯕꯤꯌꯨ",
    cancelSpeaking: "ꯂꯦꯞꯄꯤꯌꯨ",
    micPermissionNeeded: "ꯃꯥꯏꯛ ꯑꯌꯥꯕꯥ ꯄꯤꯕꯤꯌꯨ (Allow তৌꯕꯤꯌꯨ)",
    speakNaturally: "ꯇꯞꯅꯥ ꯉꯥꯡꯕꯤꯌꯨ",
    youAsked: "ꯅꯍꯥꯛꯅꯥ ꯍꯪꯈꯤꯕꯥ:",
  },
  brx: {
    trigger: "स्मृति AI गारां",
    modalTitle: "स्मृति AI लोगो • Smriti Voice",
    greeting: "खुलुमबाय आबौ 👋",
    defaultPrompt: "नोंथाङा नखराव मोजाङैनो दं। आंखौ जेबो सोंनो हागोन।",
    englishPrompt: "You are safe at home with your family. Ask me anything.",
    chipsHeader: "Quick Prompts • गोख्रै सों",
    chips: [
      { label: "📍 आं बबेयाव दं?", query: "आं दा बबेयाव दं?" },
      { label: "💊 मुलिनि सम?", query: "मुलि जानायनि सम जाबाय नामा?" },
      { label: "📖 सल' खोनासं", query: "आंखौ मोनसे मोजां सल' खोनथा।" },
      { label: "🌸 गोसो शान्ति", query: "आंनि गोसोआ खायफा खायफा मोनदों।" },
    ],
    inputPlaceholder: "बेयाव सों...",
    sendBtn: "सों",
    thinking: "सानगासिनो दं...",
    replayBtn: "खोनासं",
    stopBtn: "थानो हो",
    tapToSpeak: "रायहोनो थु",
    listening: "🎙️ खोनादों... दा बुं",
    youAreSpeaking: "नों बुंदों:",
    doneSpeaking: "✓ जाबाय • हर",
    cancelSpeaking: "थानो हो",
    micPermissionNeeded: "माइकनि गनायथि हो (Allow खालाम)",
    speakNaturally: "मोजाङै बुं",
    youAsked: "नों सोंदों:",
  },
  kha: {
    trigger: "Smriti AI Sur",
    modalTitle: "Smriti AI Companion",
    greeting: "Khublei Kpa 👋",
    defaultPrompt: "Phi shngain ha iing bad kiba ha iing. Kiei kiba ngan lah ban ïarap?",
    englishPrompt: "You are safe at home with your family. Ask me anything.",
    chipsHeader: "Quick Prompts • Kylli kloi",
    chips: [
      { label: "📍 Nga don haei?", query: "Nga don haei mynta?" },
      { label: "💊 Ka por dawai?", query: "Kano ka por dawai kaba bud?" },
      { label: "📖 Ka puriskam", query: "Iathuh ïa kawei ka puriskam." },
      { label: "🌸 Pynjem jingmut", query: "Nga sngew diaw jingmut." },
    ],
    inputPlaceholder: "Kylli hangne...",
    sendBtn: "Kylli",
    thinking: "Dang pyrkhat...",
    replayBtn: "Sngap pat",
    stopBtn: "Sangeh",
    tapToSpeak: "Kren hangne",
    listening: "🎙️ Dang sngap... kren mynta",
    youAreSpeaking: "Phi dang kren:",
    doneSpeaking: "✓ Lah dep • Phah",
    cancelSpeaking: "Sangeh",
    micPermissionNeeded: "Ai bor ïa u mic ha ka browser",
    speakNaturally: "Kren suki bad shai",
    youAsked: "Phi la kylli:",
  },
  lus: {
    trigger: "Smriti AI Aw",
    modalTitle: "Smriti AI Ṭhian",
    greeting: "Chibai Ka Pu 👋",
    defaultPrompt: "In lamah i him e. Engtin nge ka puih theih che?",
    englishPrompt: "You are safe at home with your family. Ask me anything.",
    chipsHeader: "Quick Prompts • Zawt zung zung rawh",
    chips: [
      { label: "📍 Khawiah nge ka awm?", query: "Khawiah nge ka awm mek?" },
      { label: "💊 Damdawi ei hun?", query: "Engtikah nge damdawi ei leh hun?" },
      { label: "📖 Thawnthu min hrilh", query: "Thawnthu ngaihnawm tak min hrilh rawh." },
      { label: "🌸 Rilru hahdamna", query: "Ka rilru a hah deuh riau mai." },
    ],
    inputPlaceholder: "Zawt rawh le...",
    sendBtn: "Zawt",
    thinking: "Ngaihtuah mek...",
    replayBtn: "Ngaithla leh rawh",
    stopBtn: "Tawp rawh",
    tapToSpeak: "Tawng turin hmet rawh",
    listening: "🎙️ Ka ngaithla mek... sawi rawh le",
    youAreSpeaking: "I sawi mek:",
    doneSpeaking: "✓ Ka zo e • Thawn rawh",
    cancelSpeaking: "Tawp rawh",
    micPermissionNeeded: "Khawngaihin browser-ah mic phalna pe rawh",
    speakNaturally: "Muangchangin sawi rawh",
    youAsked: "I zawh mek chu:",
  },
  en: {
    trigger: "Smriti AI Voice",
    modalTitle: "Smriti AI Voice Companion",
    greeting: "Hello Grandfather 👋",
    defaultPrompt: "You are safe and warm at home with family. How may I help you today?",
    englishPrompt: "You are safe and warm at home with family.",
    chipsHeader: "Quick Prompts • Tap to Ask",
    chips: [
      { label: "📍 Where am I?", query: "Where am I right now?" },
      { label: "💊 Next medicine?", query: "When is my next medicine?" },
      { label: "📖 Tell a folk story", query: "Tell me a soothing folk story." },
      { label: "🌸 Help me relax", query: "I am feeling a little restless." },
    ],
    inputPlaceholder: "Ask me anything or tap a prompt above...",
    sendBtn: "Ask",
    thinking: "Thinking peacefully...",
    replayBtn: "Listen Again",
    stopBtn: "Stop Voice",
    tapToSpeak: "Tap to Speak",
    listening: "🎙️ Listening... speak now",
    youAreSpeaking: "You are saying:",
    doneSpeaking: "✓ Done • Send",
    cancelSpeaking: "Cancel",
    micPermissionNeeded: "Microphone access is needed. Please allow it in your browser.",
    speakNaturally: "Speak clearly and calmly at your own pace",
    youAsked: "You asked:",
  },
};

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

  const loc = ASSISTANT_LOCALES[language] || ASSISTANT_LOCALES.en;

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const transcriptRef = useRef<string>("");
  const maxTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopTTS();
      cancelListening();
    };
  }, []);

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

    // Speak initial greeting with normal TTS
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
    setUserSpokenQuery("");
  };

  /**
   * Start listening to the microphone
   * Immediately activates listening UI and launches dual speech engines:
   * 1. In-browser SpeechRecognition with real-time interim results
   * 2. getUserMedia + MediaRecorder fallback for Gemini Multimodal Audio
   */
  const startListening = () => {
    // 1. Cancel TTS playback & clear previous state
    stopTTS();
    setIsSpeaking(false);
    setLiveTranscript("");
    transcriptRef.current = "";
    audioChunksRef.current = [];
    setMicPermissionDenied(false);

    // 2. Immediately activate listening state for instant visual feedback
    setIsListeningMic(true);
    playBeep(600, 100);
    triggerHaptic("tap");

    // 3. Start Web Speech Recognition immediately
    const SpeechRecognition =
      typeof window !== "undefined"
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = getWebSpeechLang(language);

        recognition.onresult = (event: any) => {
          let interim = "";
          let final = "";
          for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript + " ";
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          const currentCombined = (final + interim).trim();
          if (currentCombined) {
            setLiveTranscript(currentCombined);
            transcriptRef.current = currentCombined;
          }
        };

        recognition.onerror = (err: any) => {
          console.debug("Web Speech API note:", err?.error);
          if (err?.error === "not-allowed" || err?.error === "service-not-allowed") {
            setMicPermissionDenied(true);
          }
        };

        recognition.onend = () => {
          // Keep listening active until user stops
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (speechErr) {
        console.debug("SpeechRecognition initialization note:", speechErr);
      }
    }

    // 4. Concurrently request getUserMedia for live volume visualizer & MediaRecorder fallback
    if (typeof window !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          streamRef.current = stream;

          // Set up live volume visualizer (AudioContext + AnalyserNode)
          try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
              const ctx = new AudioCtx();
              audioContextRef.current = ctx;
              const analyser = ctx.createAnalyser();
              analyser.fftSize = 64;
              const source = ctx.createMediaStreamSource(stream);
              source.connect(analyser);

              const dataArr = new Uint8Array(analyser.frequencyBinCount);
              const checkVolume = () => {
                if (!analyser) return;
                analyser.getByteFrequencyData(dataArr);
                let sum = 0;
                for (let i = 0; i < dataArr.length; i++) {
                  sum += dataArr[i];
                }
                const avg = sum / dataArr.length;
                setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
                animFrameRef.current = requestAnimationFrame(checkVolume);
              };
              checkVolume();
            }
          } catch (err) {
            console.debug("Audio visualizer note:", err);
          }

          // Set up MediaRecorder fallback
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
            console.warn("MediaRecorder start note:", recErr);
          }
        })
        .catch((permErr) => {
          console.warn("Microphone access note:", permErr);
          if (!recognitionRef.current) {
            setMicPermissionDenied(true);
            setIsListeningMic(false);
          }
        });
    }

    // 5. Automatic safety timeout after 18 seconds
    maxTimerRef.current = setTimeout(() => {
      stopListeningAndSubmit();
    }, 18000);
  };

  /**
   * Stop listening and submit either recognized text or recorded audio
   */
  const stopListeningAndSubmit = async () => {
    if (maxTimerRef.current) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }

    setAudioLevel(0);
    setIsListeningMic(false);

    // Stop Speech Recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    // Stop MediaRecorder
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {}
    }
    mediaRecorderRef.current = null;

    // Release microphone hardware
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    const recognizedText = (transcriptRef.current || liveTranscript).trim();

    // Primary: If Web Speech recognition captured speech
    if (recognizedText) {
      setUserSpokenQuery(recognizedText);
      setLiveTranscript("");
      handleSendQuery(recognizedText);
      return;
    }

    // Secondary fallback: If Web Speech was silent/unsupported, send recorded audio blob to Gemini multimodal
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      if (audioBlob.size > 1500) {
        handleSendAudioBlob(audioBlob);
        return;
      }
    }

    // No speech detected
    setLiveTranscript("");
  };

  /**
   * Abort listening without submitting
   */
  const cancelListening = () => {
    if (maxTimerRef.current) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
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
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleSendAudioBlob = async (blob: Blob) => {
    setIsLoading(true);
    stopTTS();
    setIsSpeaking(false);
    playBeep(480, 80);

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

        // Speak response aloud with browser TTS at calming 0.85x speed
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
    stopTTS();
    setIsSpeaking(false);
    playBeep(480, 80);

    try {
      const resp = await generateGeminiCompanionReply(queryText, language);
      setCurrentReply(resp);
      setIsLoading(false);

      // Speak response aloud with browser TTS at calming 0.85x speed
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
    stopTTS();
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
        aria-label="Smriti Voice Assistant: Tap to speak and listen"
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
          boxShadow:
            "0 10px 25px -5px rgba(2, 132, 199, 0.45), 0 8px 10px -6px rgba(2, 132, 199, 0.3)",
          minHeight: "56px",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <span style={{ fontSize: "1.35rem" }}>🎙️</span>
        <span style={{ fontSize: "0.95rem", fontWeight: 800, letterSpacing: "0.02em" }}>
          {loc.trigger}
        </span>
      </button>

      {/* ── Reassuring Voice Dialogue Modal ── */}
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
            }}
          >
            {/* Header / Dismiss */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.85rem",
                borderBottom: "1px solid var(--gray-200)",
                paddingBottom: "0.6rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <span style={{ fontSize: "1.4rem" }}>🤖</span>
                <span
                  id="voice-modal-title"
                  style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gray-900)" }}
                >
                  {loc.modalTitle}
                </span>
              </div>
              <button
                type="button"
                id="voice-assistant-close-btn"
                onClick={handleClose}
                aria-label="Close voice assistant"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "1px solid var(--gray-300)",
                  background: "var(--gray-100)",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--gray-700)",
                }}
              >
                ✕
              </button>
            </div>

            {/* ── Prominent Elder Microphone Station ── */}
            <div
              id="voice-center-mic-card"
              style={{
                background: isListeningMic ? "#fef2f2" : "#f0f9ff",
                border: isListeningMic ? "2px solid #ef4444" : "1.5px solid #bae6fd",
                borderRadius: "20px",
                padding: "1.1rem 1rem",
                marginBottom: "1rem",
                textAlign: "center",
                transition: "all 0.25s ease",
              }}
            >
              {!isListeningMic ? (
                /* IDLE STATE: Large, accessible Tap-to-Speak button */
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <button
                    id="main-mic-listen-btn"
                    data-testid="main-mic-listen-btn"
                    type="button"
                    onClick={startListening}
                    aria-label={loc.tapToSpeak}
                    className="mic-idle-pulse"
                    style={{
                      width: "82px",
                      height: "82px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                      color: "#ffffff",
                      border: "3px solid #38bdf8",
                      fontSize: "2.4rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.6rem",
                      touchAction: "manipulation",
                    }}
                  >
                    🎙️
                  </button>

                  <div
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 800,
                      color: "#0369a1",
                      letterSpacing: "0.01em",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {loc.tapToSpeak}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--gray-500)", fontWeight: 600 }}>
                    {loc.speakNaturally}
                  </div>

                  {/* Microphone Permission Alert if denied */}
                  {micPermissionDenied && (
                    <div
                      style={{
                        marginTop: "0.8rem",
                        padding: "0.6rem 0.8rem",
                        background: "#fffbeb",
                        border: "1.5px solid #fcd34d",
                        borderRadius: "12px",
                        color: "#92400e",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        textAlign: "left",
                        lineHeight: 1.35,
                      }}
                    >
                      <div>⚠️ {loc.micPermissionNeeded}</div>
                      <button
                        type="button"
                        onClick={startListening}
                        style={{
                          marginTop: "0.4rem",
                          padding: "0.3rem 0.6rem",
                          background: "#f59e0b",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "0.78rem",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        अनुमति दें • Retry Permission
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* ACTIVE LISTENING STATE: Soundwave Animation & Live Transcript */
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <button
                    id="main-mic-listen-btn"
                    data-testid="main-mic-listen-btn"
                    type="button"
                    onClick={stopListeningAndSubmit}
                    aria-label="Stop speaking and submit"
                    className="mic-listening-pulse"
                    style={{
                      width: "82px",
                      height: "82px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
                      color: "#ffffff",
                      border: "3px solid #fca5a5",
                      fontSize: "2.4rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.5rem",
                      transform: `scale(${1 + audioLevel / 500})`,
                      transition: "transform 0.1s ease",
                    }}
                  >
                    🔴
                  </button>

                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      color: "#b91c1c",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {loc.listening}
                  </div>

                  {/* Real-time Dynamic Voice Sound Bars */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      height: "30px",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {[16, 28, 42, 24, 36, 20, 32, 18, 26, 14].map((baseH, idx) => {
                      const dynamicH = Math.max(6, Math.round((baseH * (audioLevel + 30)) / 100));
                      return (
                        <div
                          key={idx}
                          style={{
                            width: "5px",
                            height: `${dynamicH}px`,
                            backgroundColor: "#ef4444",
                            borderRadius: "999px",
                            transition: "height 0.12s ease",
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Live On-Screen Spoken Transcript Box */}
                  <div
                    style={{
                      width: "100%",
                      background: "#ffffff",
                      border: "1.5px solid #fca5a5",
                      borderRadius: "12px",
                      padding: "0.75rem 0.9rem",
                      textAlign: "left",
                      marginBottom: "0.85rem",
                      boxShadow: "0 2px 6px rgba(239, 68, 68, 0.08)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "#991b1b",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {loc.youAreSpeaking}
                    </div>
                    <div
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: liveTranscript ? "#0f172a" : "#94a3b8",
                        fontStyle: liveTranscript ? "normal" : "italic",
                        minHeight: "1.5rem",
                        lineHeight: 1.35,
                      }}
                    >
                      {liveTranscript || "बोलते रहिए... (Keep speaking, words appear here)"}
                    </div>
                  </div>

                  {/* Control Action Buttons */}
                  <div style={{ display: "flex", gap: "0.6rem", width: "100%" }}>
                    <button
                      id="mic-done-speaking-btn"
                      data-testid="mic-done-speaking-btn"
                      type="button"
                      onClick={stopListeningAndSubmit}
                      style={{
                        flex: 1,
                        padding: "0.65rem 1rem",
                        background: "#16a34a",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "0.95rem",
                        fontWeight: 800,
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(22, 163, 74, 0.3)",
                      }}
                    >
                      {loc.doneSpeaking}
                    </button>
                    <button
                      type="button"
                      onClick={cancelListening}
                      style={{
                        padding: "0.65rem 1rem",
                        background: "#f1f5f9",
                        color: "#475569",
                        border: "1px solid var(--gray-300)",
                        borderRadius: "12px",
                        fontSize: "0.85rem",
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

            {/* User Spoken Query Badge (if available) */}
            {userSpokenQuery && !isListeningMic && (
              <div
                style={{
                  background: "#e0f2fe",
                  border: "1px solid #bae6fd",
                  borderRadius: "12px",
                  padding: "0.45rem 0.8rem",
                  marginBottom: "0.75rem",
                  fontSize: "0.85rem",
                  color: "#0369a1",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span style={{ fontWeight: 800 }}>{loc.youAsked}</span>
                <span style={{ fontStyle: "italic" }}>&ldquo;{userSpokenQuery}&rdquo;</span>
              </div>
            )}

            {/* AI Companion Voice Response Display */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "var(--radius)",
                border: "1.5px solid var(--gray-200)",
                padding: "1rem",
                marginBottom: "1rem",
                textAlign: "left",
              }}
            >
              {/* Animated Speaking / Ready Status Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  marginBottom: "0.45rem",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: isSpeaking ? "#16a34a" : isLoading ? "#f59e0b" : "#0284c7",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: isSpeaking ? "#15803d" : isLoading ? "#b45309" : "#0369a1",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                  }}
                >
                  {isSpeaking ? "Speaking 🔊" : isLoading ? "Thinking..." : "AI Companion Reply"}
                </span>
              </div>

              {/* Main Response Message in Elder's Selected Language */}
              <div
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: "0.35rem",
                  lineHeight: 1.45,
                }}
              >
                {isLoading ? loc.thinking : currentReply?.replyText || loc.defaultPrompt}
              </div>

              {/* Side Language (Caregiver English translation strictly isolated when regional language active) */}
              {language !== "en" && currentReply?.englishTranslation && (
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "var(--gray-500)",
                    fontStyle: "italic",
                    marginTop: "0.35rem",
                    borderTop: "1px dashed var(--gray-200)",
                    paddingTop: "0.35rem",
                  }}
                >
                  Sub: {currentReply.englishTranslation}
                </div>
              )}

              {/* Audio Controls (Replay / Stop / Navigation) */}
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleReplay}
                  style={{
                    padding: "0.4rem 0.8rem",
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "999px",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    color: "#1d4ed8",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <span>🔊</span>
                  <span>{loc.replayBtn}</span>
                </button>

                {isSpeaking && (
                  <button
                    type="button"
                    onClick={handleStopSpeech}
                    style={{
                      padding: "0.4rem 0.8rem",
                      background: "#fee2e2",
                      border: "1px solid #fca5a5",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      color: "#b91c1c",
                      cursor: "pointer",
                    }}
                  >
                    ⏹️ {loc.stopBtn}
                  </button>
                )}

                {currentReply?.suggestedScreen && (
                  <button
                    type="button"
                    onClick={() => handleScreenAction(currentReply.suggestedScreen!)}
                    style={{
                      padding: "0.4rem 0.8rem",
                      background: "#ecfdf5",
                      border: "1px solid #a7f3d0",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                      fontWeight: 800,
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

            {/* Quick 1-Tap Question Chips in Elder's Selected Language */}
            <div style={{ marginBottom: "1rem", textAlign: "left" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "var(--gray-500)",
                  marginBottom: "0.4rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {loc.chipsHeader || "Quick Prompts"}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.45rem" }}>
                {loc.chips.map((c, idx) => (
                  <button
                    key={idx}
                    id={`prompt-chip-${idx}`}
                    data-testid={`prompt-chip-${idx}`}
                    type="button"
                    onClick={() => handleSendQuery(c.query)}
                    style={{
                      padding: "0.6rem 0.5rem",
                      background: "#f1f5f9",
                      border: "1px solid var(--gray-300)",
                      borderRadius: "var(--radius)",
                      cursor: "pointer",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "var(--gray-800)",
                      textAlign: "left",
                      lineHeight: 1.25,
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Keyboard / Text Input Bar with Quick Mic Trigger */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery(inputText);
              }}
              style={{ display: "flex", gap: "0.4rem" }}
            >
              <button
                type="button"
                id="voice-mini-mic-btn"
                onClick={isListeningMic ? stopListeningAndSubmit : startListening}
                aria-label={isListeningMic ? "Stop recording" : "Speak to assistant"}
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "12px",
                  border: isListeningMic ? "2px solid #ef4444" : "1.5px solid var(--gray-300)",
                  background: isListeningMic ? "#fee2e2" : "var(--gray-100)",
                  color: isListeningMic ? "#dc2626" : "var(--gray-700)",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isListeningMic ? "🔴" : "🎙️"}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={loc.inputPlaceholder}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "12px",
                  border: "1.5px solid var(--gray-300)",
                  fontSize: "0.9rem",
                  color: "var(--gray-900)",
                  outline: "none",
                }}
              />

              <button
                type="submit"
                id="voice-text-send-btn"
                disabled={!inputText.trim()}
                style={{
                  padding: "0.75rem 1rem",
                  background: inputText.trim() ? "var(--primary)" : "var(--gray-200)",
                  color: inputText.trim() ? "#ffffff" : "var(--gray-400)",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  cursor: inputText.trim() ? "pointer" : "default",
                  flexShrink: 0,
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
