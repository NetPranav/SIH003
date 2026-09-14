"use client";

import React, { useState, useEffect, useRef } from "react";
import { playBeep, playGentleChime } from "@/lib/audio";
import { triggerHaptic, announceToScreenReader } from "@/lib/accessibilityMiddleware";
import type { ScreenId } from "@/lib/types";
import {
  generateGeminiCompanionReply,
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

  const loc = ASSISTANT_LOCALES[language] || ASSISTANT_LOCALES.en;
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang =
          language === "hi"
            ? "hi-IN"
            : language === "bn"
            ? "bn-IN"
            : language === "as"
            ? "as-IN"
            : "en-IN";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            handleSendQuery(transcript);
          }
          setIsListeningMic(false);
        };
        recognition.onerror = () => setIsListeningMic(false);
        recognition.onend = () => setIsListeningMic(false);
        recognitionRef.current = recognition;
      }
    }
    return () => {
      stopTTS();
    };
  }, [language]);

  const handleOpen = () => {
    triggerHaptic("tap");
    playGentleChime();
    setIsOpen(true);

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
    if (recognitionRef.current && isListeningMic) {
      recognitionRef.current.stop();
    }
    setIsSpeaking(false);
    setIsListeningMic(false);
    setIsOpen(false);
  };

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setInputText("");
    setIsLoading(true);
    stopTTS();
    setIsSpeaking(false);
    playBeep(480, 80);

    try {
      const resp = await generateGeminiCompanionReply(queryText, language);
      setCurrentReply(resp);
      setIsLoading(false);

      // Speak response aloud with browser TTS
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

  const handleToggleMic = () => {
    if (!recognitionRef.current) {
      // Fallback: prompt typing
      return;
    }
    if (isListeningMic) {
      recognitionRef.current.stop();
      setIsListeningMic(false);
    } else {
      stopTTS();
      setIsSpeaking(false);
      try {
        recognitionRef.current.start();
        setIsListeningMic(true);
        playBeep(600, 100);
      } catch {
        setIsListeningMic(false);
      }
    }
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
          bottom: "5.5rem",
          right: "1.25rem",
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
            style={{
              background: "#ffffff",
              borderRadius: "24px 24px 16px 16px",
              padding: "1.5rem 1.25rem env(safe-area-inset-bottom, 1rem)",
              width: "100%",
              maxWidth: "460px",
              boxShadow: "0 -10px 30px -5px rgba(0, 0, 0, 0.25)",
              maxHeight: "90dvh",
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "1.35rem" }}>🤖</span>
                <span
                  id="voice-modal-title"
                  style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--gray-900)" }}
                >
                  {loc.modalTitle}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close voice assistant"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1px solid var(--gray-300)",
                  background: "var(--gray-100)",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--gray-700)",
                }}
              >
                ✕
              </button>
            </div>

            {/* Calming Sound Wave Animation */}
            <div
              style={{
                height: "54px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                marginBottom: "1rem",
                background: isSpeaking ? "#f0fdf4" : "#f0f9ff",
                borderRadius: "var(--radius-lg)",
                padding: "0 1rem",
                border: isSpeaking ? "1.5px solid #86efac" : "1px solid #bae6fd",
                transition: "all 0.3s ease",
              }}
            >
              {[14, 28, 44, 26, 38, 20, 32, 16].map((h, idx) => (
                <div
                  key={idx}
                  style={{
                    width: "5px",
                    height: isSpeaking ? `${h}px` : "6px",
                    backgroundColor: isSpeaking ? "#16a34a" : "#0284c7",
                    borderRadius: "999px",
                    transition: "height 0.25s ease",
                  }}
                />
              ))}
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: isSpeaking ? "#15803d" : "#0369a1",
                  marginLeft: "0.5rem",
                }}
              >
                {isSpeaking ? "Speaking (TTS) 🔊" : isListeningMic ? "Listening 🎙️" : "Ready"}
              </span>
            </div>

            {/* Spoken Text Reassurance Display */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "var(--radius)",
                border: "1px solid var(--gray-200)",
                padding: "1rem",
                marginBottom: "1rem",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  color: "#0369a1",
                  marginBottom: "0.35rem",
                  lineHeight: 1.4,
                }}
              >
                {isLoading ? loc.thinking : currentReply?.replyText || loc.defaultPrompt}
              </div>

              {/* Side Language (English translation when regional language is active) */}
              {language !== "en" && currentReply?.englishTranslation && (
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "var(--gray-500)",
                    fontStyle: "italic",
                    marginTop: "0.3rem",
                    borderTop: "1px dashed var(--gray-200)",
                    paddingTop: "0.3rem",
                  }}
                >
                  Sub: {currentReply.englishTranslation}
                </div>
              )}

              {/* Audio Controls */}
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
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
                    ⏹️ {loc.stopBtn}
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

            {/* Quick 1-Tap Question Chips in Elder's Selected Language */}
            <div style={{ marginBottom: "1rem", textAlign: "left" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
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

            {/* Interactive Query Input Bar (Speech Mic + Text Box) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery(inputText);
              }}
              style={{ display: "flex", gap: "0.4rem" }}
            >
              {/* Mic Speech Recognition Trigger */}
              <button
                type="button"
                onClick={handleToggleMic}
                aria-label={isListeningMic ? "Stop recording" : "Speak to assistant"}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  border: isListeningMic ? "2px solid #ef4444" : "1.5px solid var(--gray-300)",
                  background: isListeningMic ? "#fee2e2" : "var(--gray-100)",
                  color: isListeningMic ? "#dc2626" : "var(--gray-700)",
                  fontSize: "1.3rem",
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
