"use client";

import React, { useEffect } from "react";
import CognitiveProgressRing from "./CognitiveProgressRing";
import ElderButton from "./ElderButton";
import { playSuccessJingle } from "@/lib/audio";
import { triggerHaptic, announceToScreenReader } from "@/lib/accessibilityMiddleware";

interface CelebrationOverlayProps {
  isOpen: boolean;
  accuracy: number;
  timeSpentSeconds: number;
  language?: string;
  gameTitle?: string;
  onContinue: () => void;
  onHome: () => void;
}

const LOCALIZED_PRAISE: Record<string, { title: string; body: string; nextBtn: string; homeBtn: string }> = {
  as: {
    title: "বহুত সুন্দৰ! 🎉",
    body: "আপুনি বৰ ভালকৈ খেলিছে। মন জুৰোৱা স্মৃতি!",
    nextBtn: "পিছৰ ৰাউণ্ড খেলক (Next)",
    homeBtn: "মূল পৃষ্ঠালৈ উভতি যাওক (Home)",
  },
  mni: {
    title: "ꯌꯥꯝꯅꯥ ꯐꯔꯦ! 🎉",
    body: "ꯅꯍꯥꯛꯅꯥ ꯌꯥꯝꯅꯥ ꯐꯖꯅꯥ ꯁꯥꯟꯅꯔꯦ꯫",
    nextBtn: "ꯃꯊꯪꯒꯤ ꯁꯥꯟꯅꯄꯣꯠ (Next)",
    homeBtn: "ꯌꨨꯨꯃꯗꯥ ꯍꯜꯂꯛꯄꯥ (Home)",
  },
  bn: {
    title: "খুব সুন্দর! 🎉",
    body: "আপনি খুব ভালো খেলেছেন। চমৎকার স্মৃতি!",
    nextBtn: "পরের রাউন্ড খেলুন (Next)",
    homeBtn: "মূল পাতায় ফিরে যান (Home)",
  },
  brx: {
    title: "जोबोर मोजां! 🎉",
    body: "नोंथाङा मोजां गेलेबाय। गोजोननाय मोनबाय!",
    nextBtn: "उनाव गेलेनाय (Next)",
    homeBtn: "नखराव थांफिन (Home)",
  },
  kha: {
    title: "Bha Shibun! 🎉",
    body: "Phi la leh bha bha. Kmen shibun!",
    nextBtn: "Jingialehkai Nangphrang (Next)",
    homeBtn: "Sha Iing (Home)",
  },
  lus: {
    title: "I Ti Ṭha Lutuk E! 🎉",
    body: "Hlim takin i khel e. A lawmawm lutuk!",
    nextBtn: "A Lehpek Khelh (Next)",
    homeBtn: "In Lamah Hawn (Home)",
  },
  hi: {
    title: "बहुत बढ़िया! 🎉",
    body: "आपने बहुत अच्छा खेला। मन प्रसन्न हो गया!",
    nextBtn: "अगला राउंड खेलें (Next)",
    homeBtn: "होम स्क्रीन पर जाएं (Home)",
  },
  en: {
    title: "Wonderful Job! 🎉",
    body: "You played beautifully. A soothing memory exercise!",
    nextBtn: "Play Next Round",
    homeBtn: "Return to Home Screen",
  },
};

export default function CelebrationOverlay({
  isOpen,
  accuracy,
  timeSpentSeconds,
  language = "as",
  gameTitle = "Cognitive Game",
  onContinue,
  onHome,
}: CelebrationOverlayProps) {
  const praise = LOCALIZED_PRAISE[language] || LOCALIZED_PRAISE.en;

  useEffect(() => {
    if (isOpen) {
      triggerHaptic("celebration");
      playSuccessJingle();
      announceToScreenReader(`${praise.title} ${praise.body}`, "assertive");

      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(praise.body);
          utterance.rate = 0.85;
          window.speechSynthesis.speak(utterance);
        } catch {
          // Graceful fallback if speech synthesis is blocked
        }
      }
    }
  }, [isOpen, praise]);

  if (!isOpen) return null;

  // Gentle float sparkles (calm 0.8s floating particles)
  const sparkles = [
    { top: "15%", left: "18%", delay: "0s", color: "#f59e0b" },
    { top: "25%", right: "20%", delay: "0.2s", color: "#10b981" },
    { top: "60%", left: "15%", delay: "0.4s", color: "#6366f1" },
    { top: "70%", right: "16%", delay: "0.1s", color: "#ec4899" },
    { top: "40%", left: "10%", delay: "0.3s", color: "#14b8a6" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Round Complete Celebration"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
      }}
    >
      {/* Background Sparkles */}
      {sparkles.map((sp, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            top: sp.top,
            left: sp.left,
            right: sp.right,
            fontSize: "2rem",
            color: sp.color,
            animation: "pulse 2s infinite ease-in-out",
            animationDelay: sp.delay,
            pointerEvents: "none",
          }}
        >
          ✨
        </div>
      ))}

      <div
        style={{
          background: "var(--white)",
          borderRadius: "28px",
          padding: "2rem 1.75rem",
          width: "100%",
          maxWidth: "440px",
          textAlign: "center",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Folk Mascot Cheer Icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
            border: "3px solid #86efac",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            margin: "0 auto 1.25rem",
            boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.2)",
          }}
        >
          🏆
        </div>

        {/* Title and Spoken Praise */}
        <h2
          style={{
            fontSize: "1.65rem",
            fontWeight: 800,
            color: "var(--gray-900)",
            marginBottom: "0.35rem",
          }}
        >
          {praise.title}
        </h2>
        <p
          style={{
            fontSize: "1.05rem",
            color: "#065f46",
            fontWeight: 700,
            marginBottom: "1.5rem",
            lineHeight: 1.4,
          }}
        >
          {praise.body}
        </p>

        {/* Stats Row with CognitiveProgressRing */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "1rem",
            background: "#f8fafc",
            borderRadius: "var(--radius-lg)",
            border: "1.5px solid var(--gray-200)",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <CognitiveProgressRing
              percentage={accuracy}
              size={64}
              strokeWidth={7}
              color="#10b981"
              trackColor="#e2e8f0"
              label={`${accuracy}%`}
            />
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gray-500)", marginTop: "0.35rem" }}>
              Accuracy
            </div>
          </div>

          <div style={{ height: "45px", width: "1px", background: "var(--gray-200)" }} />

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary)" }}>
              {timeSpentSeconds}s
            </div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gray-500)", marginTop: "0.35rem" }}>
              Time Played
            </div>
          </div>

          <div style={{ height: "45px", width: "1px", background: "var(--gray-200)" }} />

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#d97706" }}>
              ★ 100
            </div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gray-500)", marginTop: "0.35rem" }}>
              Cultural Pts
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <ElderButton
            variant="primary"
            fullWidth
            onPress={onContinue}
            aria-label={praise.nextBtn}
          >
            {praise.nextBtn}
          </ElderButton>

          <ElderButton
            variant="secondary"
            fullWidth
            onPress={onHome}
            aria-label={praise.homeBtn}
          >
            {praise.homeBtn}
          </ElderButton>
        </div>
      </div>
    </div>
  );
}
