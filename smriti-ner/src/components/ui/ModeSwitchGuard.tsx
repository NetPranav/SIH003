"use client";

import React, { useState } from "react";
import ElderModal from "./ElderModal";
import { playBeep } from "@/lib/audio";
import { triggerHaptic, announceToScreenReader } from "@/lib/accessibilityMiddleware";

interface ModeSwitchGuardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language?: string;
}

const CORRECT_PIN = "1234";

export default function ModeSwitchGuard({ isOpen, onClose, onSuccess, language = "en" }: ModeSwitchGuardProps) {
  const [pin, setPin] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const nativeTitle =
    language === "as"
      ? "🔒 অভিভাৱক প্ৰৱেশদ্বাৰ"
      : language === "hi"
      ? "🔒 अभिभावक पोर्टल"
      : language === "bn"
      ? "🔒 অভিভাবক প্রবেশদ্বার"
      : undefined;

  const cancelLabel =
    language === "as"
      ? "বাতিল কৰক / Cancel"
      : language === "hi"
      ? "रद्द करें / Cancel"
      : language === "bn"
      ? "বাতিল করুন / Cancel"
      : "Cancel";

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;

    triggerHaptic("tap");
    playBeep(440 + pin.length * 50, 60);

    const nextPin = pin + digit;
    setPin(nextPin);
    setErrorMsg("");

    if (nextPin.length === 4) {
      if (nextPin === CORRECT_PIN) {
        triggerHaptic("success");
        playBeep(880, 180);
        announceToScreenReader("Caregiver PIN verified. Entering Caregiver Dashboard.", "assertive");
        setTimeout(() => {
          setPin("");
          onSuccess();
        }, 150);
      } else {
        triggerHaptic("error");
        playBeep(260, 150);
        setErrorMsg("Incorrect PIN. Please re-enter or check with family caregiver.");
        announceToScreenReader("Incorrect PIN. Please try again.", "assertive");
        setTimeout(() => setPin(""), 600);
      }
    }
  };

  const handleDelete = () => {
    triggerHaptic("tap");
    playBeep(350, 60);
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg("");
  };

  const handleClear = () => {
    triggerHaptic("tap");
    playBeep(320, 60);
    setPin("");
    setErrorMsg("");
  };

  return (
    <ElderModal
      isOpen={isOpen}
      onClose={onClose}
      title="Caregiver Portal Access"
      nativeTitle={nativeTitle}
      cancelLabel={cancelLabel}
    >
      <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
        <p style={{ fontSize: "0.95rem", color: "var(--gray-600)", marginBottom: "1.25rem" }}>
          Enter 4-digit Caregiver PIN to access medical records and settings.
        </p>

        {/* PIN Dot Indicators */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.25rem",
            marginBottom: "1.25rem",
          }}
        >
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  border: isFilled ? "3px solid var(--primary)" : "3px solid var(--gray-300)",
                  backgroundColor: isFilled ? "var(--primary)" : "transparent",
                  transition: "all 0.15s ease",
                  transform: isFilled ? "scale(1.15)" : "scale(1)",
                }}
              />
            );
          })}
        </div>

        {/* Error message */}
        {errorMsg ? (
          <div
            style={{
              color: "#dc2626",
              fontSize: "0.85rem",
              fontWeight: 700,
              minHeight: "1.5rem",
              marginBottom: "0.75rem",
            }}
          >
            {errorMsg}
          </div>
        ) : (
          <div style={{ minHeight: "1.5rem", marginBottom: "0.75rem", fontSize: "0.8rem", color: "var(--gray-400)" }}>
            Demo PIN: 1234
          </div>
        )}

        {/* Accessible 64px Keypad */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.85rem",
            maxWidth: "320px",
            margin: "0 auto 1.5rem",
          }}
        >
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              style={{
                height: "64px",
                width: "64px",
                margin: "0 auto",
                borderRadius: "50%",
                background: "var(--gray-50)",
                border: "2px solid var(--gray-200)",
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--gray-900)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.1s ease",
                boxShadow: "var(--shadow-sm)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#eff6ff";
                e.currentTarget.style.borderColor = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--gray-50)";
                e.currentTarget.style.borderColor = "var(--gray-200)";
              }}
            >
              {num}
            </button>
          ))}

          {/* Bottom row: Clear, 0, Backspace */}
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear PIN"
            style={{
              height: "64px",
              width: "64px",
              margin: "0 auto",
              borderRadius: "50%",
              background: "#fee2e2",
              border: "2px solid #fca5a5",
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "#991b1b",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>

          <button
            type="button"
            onClick={() => handleDigit("0")}
            style={{
              height: "64px",
              width: "64px",
              margin: "0 auto",
              borderRadius: "50%",
              background: "var(--gray-50)",
              border: "2px solid var(--gray-200)",
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--gray-900)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            aria-label="Backspace PIN"
            style={{
              height: "64px",
              width: "64px",
              margin: "0 auto",
              borderRadius: "50%",
              background: "var(--gray-100)",
              border: "2px solid var(--gray-300)",
              fontSize: "1.35rem",
              fontWeight: 800,
              color: "var(--gray-700)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ⌫
          </button>
        </div>
      </div>
    </ElderModal>
  );
}
