"use client";

import { useState } from "react";
import { CAREGIVER_PIN } from "@/lib/constants";
import { playBeep, playGentleChime } from "@/lib/audio";

interface Props {
  onSuccess: () => void;
  onBack: () => void;
}

export default function CaregiverPinScreen({ onSuccess, onBack }: Props) {
  const [pin, setPin] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDigit = (digit: string) => {
    playBeep(500, 70);
    setErrorMsg(null);
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === CAREGIVER_PIN) {
          playGentleChime();
          onSuccess();
        } else {
          playBeep(220, 200);
          setErrorMsg("Incorrect PIN. Please try again.");
          setTimeout(() => {
            setPin("");
          }, 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    playBeep(350, 70);
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  return (
    <div style={{
      minHeight: "100dvh",
      backgroundColor: "var(--white)",
      padding: "2rem 1.5rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "1.5rem",
          background: "var(--gray-100)",
          border: "none",
          borderRadius: "50%",
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
          cursor: "pointer"
        }}
      >
        ←
      </button>

      <div style={{
        width: 72,
        height: 72,
        borderRadius: "20px",
        background: "var(--gray-100)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2.2rem",
        marginBottom: "1.25rem"
      }}>
        🔒
      </div>

      <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.25rem" }}>
        Caregiver & Clinician Portal
      </h2>
      <p style={{ fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: "1.75rem", textAlign: "center" }}>
        Enter 4-digit security PIN to view telemetry & clinical logs
      </p>

      {/* PIN Dots Display */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              backgroundColor: idx < pin.length ? "var(--primary)" : "var(--gray-200)",
              transition: "all 150ms ease"
            }}
          />
        ))}
      </div>

      {errorMsg && (
        <div style={{
          color: "var(--red)",
          fontSize: "0.85rem",
          fontWeight: 600,
          marginBottom: "1rem"
        }}>
          {errorMsg}
        </div>
      )}

      {/* 3x4 Keypad */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "0.85rem",
        width: "100%",
        maxWidth: "280px"
      }}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((btn, i) => {
          if (btn === "") {
            return <div key={i} />;
          }
          if (btn === "⌫") {
            return (
              <button
                key={i}
                onClick={handleBackspace}
                style={{
                  height: "64px",
                  background: "var(--gray-50)",
                  border: "1px solid var(--gray-200)",
                  borderRadius: "var(--radius)",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "var(--gray-700)"
                }}
              >
                ⌫
              </button>
            );
          }
          return (
            <button
              key={i}
              onClick={() => handleDigit(btn)}
              style={{
                height: "64px",
                background: "var(--white)",
                border: "1.5px solid var(--gray-200)",
                borderRadius: "var(--radius)",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "var(--gray-900)",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              {btn}
            </button>
          );
        })}
      </div>

      <div style={{
        marginTop: "2rem",
        fontSize: "0.75rem",
        color: "var(--gray-400)",
        textAlign: "center"
      }}>
        Default test PIN: <strong>1234</strong> (ABDM / FHIR R4 compliant access)
      </div>
    </div>
  );
}
