"use client";

import React from "react";
import ElderModal from "./ElderModal";
import { LANGUAGES } from "@/lib/constants";
import { playBeep } from "@/lib/audio";
import { triggerHaptic, announceToScreenReader } from "@/lib/accessibilityMiddleware";

interface LanguageSelectorModalProps {
  isOpen: boolean;
  currentLanguage: string;
  onClose: () => void;
  onSelectLanguage: (code: string) => void;
}

export default function LanguageSelectorModal({
  isOpen,
  currentLanguage,
  onClose,
  onSelectLanguage,
}: LanguageSelectorModalProps) {
  const handleSelect = (code: string, nativeName: string) => {
    triggerHaptic("tap");
    playBeep(523.25, 120); // Pleasant C5 chime
    announceToScreenReader(`Language changed to ${nativeName}`, "assertive");
    onSelectLanguage(code);
    onClose();
  };

  const modalLocales: Record<string, { nativeTitle: string; cancelLabel: string; prompt: string }> = {
    as: {
      nativeTitle: "ভাষা বাছনি",
      cancelLabel: "বাতিল কৰক / Cancel",
      prompt: "আপোনাৰ সহজলভ্য ভাষা বাছক • Tap your preferred language",
    },
    bn: {
      nativeTitle: "ভাষা নির্বাচন",
      cancelLabel: "বাতিল করুন / Cancel",
      prompt: "আপনার পছন্দের ভাষা বেছে নিন • Tap your preferred language",
    },
    hi: {
      nativeTitle: "भाषा चयन",
      cancelLabel: "रद्द करें / Cancel",
      prompt: "अपनी पसंदीदा भाषा चुनें • Tap your preferred language",
    },
    mni: {
      nativeTitle: "ꯂꯣꯟ ꯈꯅꯕꯥ",
      cancelLabel: "ꯀꯦꯟꯁꯦꯜ / Cancel",
      prompt: "ꯅꯍꯥꯛꯀꯤ ꯂꯣꯟ ꯈꯅꯕꯤꯌꯨ • Tap your preferred language",
    },
    brx: {
      nativeTitle: "राव सायखनाय",
      cancelLabel: "नागार / Cancel",
      prompt: "नोंथांनि राव सायख • Tap your preferred language",
    },
    kha: {
      nativeTitle: "Jied Ktien",
      cancelLabel: "Pynsangeh / Cancel",
      prompt: "Jied ïa ka ktien ba sngewbha • Tap your preferred language",
    },
    lus: {
      nativeTitle: "Ṭawng Thlanna",
      cancelLabel: "Sutna / Cancel",
      prompt: "I duhzawng ṭawng thlang rawh • Tap your preferred language",
    },
    en: {
      nativeTitle: "Select Language",
      cancelLabel: "Cancel",
      prompt: "Tap your preferred language to continue",
    },
  };

  const modalT = modalLocales[currentLanguage] || modalLocales.en;

  return (
    <ElderModal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Language"
      nativeTitle={modalT.nativeTitle}
      cancelLabel={modalT.cancelLabel}
    >
      <div style={{ padding: "0.5rem 0" }}>
        <p style={{ fontSize: "0.95rem", color: "var(--gray-600)", marginBottom: "1.25rem", textAlign: "center" }}>
          {modalT.prompt}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.85rem",
            width: "100%",
          }}
        >
          {LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;

            return (
              <button
                key={lang.code}
                id={`lang-btn-${lang.code}`}
                data-testid={`lang-btn-${lang.code}`}
                type="button"
                onClick={() => handleSelect(lang.code, lang.native)}
                aria-pressed={isSelected}
                style={{
                  minHeight: "72px",
                  padding: "0.85rem 1rem",
                  background: isSelected ? "#ecfdf5" : "var(--white)",
                  border: isSelected ? "2.5px solid #059669" : "1.5px solid var(--gray-200)",
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.25rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: isSelected ? "0 4px 12px rgba(5, 150, 105, 0.15)" : "var(--shadow-sm)",
                  position: "relative",
                  outline: "none"
                }}
              >
                {isSelected && (
                  <span
                    style={{
                      position: "absolute",
                      top: "6px",
                      right: "8px",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      color: "#059669"
                    }}
                  >
                    ✓
                  </span>
                )}
                <span
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    color: isSelected ? "#065f46" : "var(--gray-900)",
                    lineHeight: 1.2
                  }}
                >
                  {lang.native}
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: isSelected ? "#047857" : "var(--gray-500)",
                    fontWeight: isSelected ? 700 : 500
                  }}
                >
                  {lang.english}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </ElderModal>
  );
}
