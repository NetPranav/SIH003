"use client";

import React, { useState, useEffect } from "react";
import { playBeep } from "@/lib/audio";
import { triggerHaptic, announceToScreenReader } from "@/lib/accessibilityMiddleware";
import type { ScreenId } from "@/lib/types";

interface VoiceAssistantButtonProps {
  language: string;
  navigate: (screen: ScreenId) => void;
}

const VOICE_LABELS: Record<string, { trigger: string; greeting: string; prompt: string }> = {
  as: {
    trigger: "কথাৰে কওক",
    greeting: "নমস্কাৰ বৰদেউতা 👋",
    prompt: "আপুনি গুৱাহাটীৰ নিজা ঘৰত সুৰক্ষিতভাৱে আছে। মই আপোনাক কিদৰে সহায় কৰিব পাৰোঁ?"
  },
  mni: {
    trigger: "ꯋꯥ ꯉꯥꯡꯕꯤꯌꯨ",
    greeting: "ꯈꯨꯔꯨꯝꯖꯔꯤ ꯏꯕꯨꯡꯉꯣ 👋",
    prompt: "ꯅꯍꯥꯛ ꯏꯝꯐꯥꯜꯗꯥ ꯂꯩꯕꯥ ꯅꯍꯥꯛꯀꯤ ꯌꯨꯃꯗꯥ ꯂꯩꯔꯤ꯫ ꯑꯩꯅꯥ ꯅꯍꯥꯛꯄꯨ ꯀꯔꯝꯅꯥ ꯃꯇꯦꯡ ꯄꯥꯡꯒꯅꯤ?"
  },
  bn: {
    trigger: "কথা বলুন",
    greeting: "নমস্কার দাদু 👋",
    prompt: "আপনি নিজের বাড়িতে নিরাপদে আছেন। আমি আপনাকে কীভাবে সাহায্য করতে পারি?"
  },
  brx: {
    trigger: "रायलायदो",
    greeting: "खुलुमबाय आबौ 👋",
    prompt: "नोंथाङा नखराव मोजाङैनो दं। आं नोंथांनो माबोरै हेफाजाब होनो हागौ?"
  },
  kha: {
    trigger: "Kren Sha Nga",
    greeting: "Khublei Kpa 👋",
    prompt: "Phi shngain ha iing ha Guwahati. Kumno nga lah ban iarap ia phi?"
  },
  lus: {
    trigger: "Ṭawng rawh",
    greeting: "Chibai Pu 👋",
    prompt: "In lamah i him e. Engtin nge ka puih theih che?"
  },
  hi: {
    trigger: "बात करें",
    greeting: "नमस्ते दादाजी 👋",
    prompt: "आप अपने घर पर पूरी तरह सुरक्षित हैं। मैं आपकी क्या मदद करूँ?"
  },
  en: {
    trigger: "Speak to Me",
    greeting: "Hello Grandfather 👋",
    prompt: "You are safe at home in Guwahati. How may I assist you today?"
  }
};

export default function VoiceAssistantButton({ language, navigate }: VoiceAssistantButtonProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const activeLocale = VOICE_LABELS[language] || VOICE_LABELS.en;

  const handleOpen = () => {
    triggerHaptic("tap");
    // Play warm melodic C5 - E5 double chime
    playBeep(523.25, 140);
    setTimeout(() => playBeep(659.25, 180), 160);

    setIsOpen(true);
    setIsSpeaking(true);

    announceToScreenReader(`${activeLocale.greeting}. ${activeLocale.prompt}`, "assertive");

    // Optional SpeechSynthesis for genuine voice audio
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(activeLocale.prompt);
        utterance.rate = 0.85; // Calming, slower pace for dementia
        utterance.pitch = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch {
        setIsSpeaking(false);
      }
    } else {
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  const handleClose = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsOpen(false);
  };

  const handleAction = (screen: ScreenId) => {
    handleClose();
    playBeep(440, 100);
    navigate(screen);
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Voice Assistant: Tap to speak and listen to reassurance"
        style={{
          position: "fixed",
          bottom: "5.5rem",
          right: "1.25rem",
          zIndex: 40,
          background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
          color: "var(--white)",
          border: "2px solid #38bdf8",
          borderRadius: "999px",
          padding: "0.75rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          cursor: "pointer",
          boxShadow: "0 10px 25px -5px rgba(2, 132, 199, 0.45), 0 8px 10px -6px rgba(2, 132, 199, 0.3)",
          minHeight: "56px",
          transition: "transform 0.15s ease, box-shadow 0.15s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <span style={{ fontSize: "1.35rem" }}>🎙️</span>
        <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "0.02em" }}>
          {activeLocale.trigger}
        </span>
      </button>

      {/* Reassuring Voice Dialogue Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="voice-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "1rem"
          }}
        >
          <div
            style={{
              background: "var(--white)",
              borderRadius: "24px 24px 16px 16px",
              padding: "1.75rem 1.5rem",
              width: "100%",
              maxWidth: "460px",
              boxShadow: "0 -10px 25px -5px rgba(0, 0, 0, 0.2)",
              textAlign: "center"
            }}
          >
            {/* Header / Dismiss */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "1.4rem" }}>🎙️</span>
                <span id="voice-title" style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gray-900)" }}>
                  Smriti Voice Assistant (স্মৃতি কণ্ঠ)
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
                  border: "1px solid var(--gray-200)",
                  background: "var(--gray-50)",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                ✕
              </button>
            </div>

            {/* Calming Sound Wave Animation */}
            <div
              style={{
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                marginBottom: "1.25rem",
                background: "#f0f9ff",
                borderRadius: "var(--radius-lg)",
                padding: "0 1rem"
              }}
            >
              {[18, 34, 48, 30, 42, 22, 38, 20].map((h, idx) => (
                <div
                  key={idx}
                  style={{
                    width: "5px",
                    height: isSpeaking ? `${h}px` : "8px",
                    backgroundColor: isSpeaking ? "#0284c7" : "#bae6fd",
                    borderRadius: "999px",
                    transition: "height 0.3s ease"
                  }}
                />
              ))}
            </div>

            {/* Spoken Text Reassurance */}
            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0369a1", marginBottom: "0.4rem" }}>
              {activeLocale.greeting}
            </h3>
            <p style={{ fontSize: "1.05rem", color: "var(--gray-800)", lineHeight: 1.5, marginBottom: "1.5rem" }}>
              {activeLocale.prompt}
            </p>

            {/* Quick Elder Action Chips */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", textAlign: "left" }}>
              <button
                type="button"
                onClick={() => handleAction("games")}
                style={{
                  padding: "0.85rem",
                  background: "#eff6ff",
                  border: "1.5px solid #93c5fd",
                  borderRadius: "var(--radius)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#1d4ed8"
                }}
              >
                <span>🎮</span>
                <span>Play Games</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction("reminders")}
                style={{
                  padding: "0.85rem",
                  background: "#fef3c7",
                  border: "1.5px solid #fde68a",
                  borderRadius: "var(--radius)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#b45309"
                }}
              >
                <span>⏰</span>
                <span>Reminders</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction("album")}
                style={{
                  padding: "0.85rem",
                  background: "#fae8ff",
                  border: "1.5px solid #f5d0fe",
                  borderRadius: "var(--radius)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#a21caf"
                }}
              >
                <span>📸</span>
                <span>Photo Album</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction("connect")}
                style={{
                  padding: "0.85rem",
                  background: "#dcfce7",
                  border: "1.5px solid #bbf7d0",
                  borderRadius: "var(--radius)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#15803d"
                }}
              >
                <span>🤝</span>
                <span>Grandchild</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
