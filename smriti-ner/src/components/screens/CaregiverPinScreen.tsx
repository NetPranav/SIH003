"use client";

import { useState } from "react";
import { CAREGIVER_PIN } from "@/lib/constants";
import { playBeep, playGentleChime } from "@/lib/audio";
import { CaregiverPortalService } from "@/lib/caregiverPortalService";

interface Props {
  onSuccess: () => void;
  onBack: () => void;
}

export default function CaregiverPinScreen({ onSuccess, onBack }: Props) {
  const [authMode, setAuthMode] = useState<"pin" | "otp">("pin");
  const [pin, setPin] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cloud OTP state
  const [phoneNumber, setPhoneNumber] = useState<string>("9864099881");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpId, setOtpId] = useState<string | null>(null);
  const [otpValue, setOtpValue] = useState<string>("");
  const [otpStatusMsg, setOtpStatusMsg] = useState<string | null>(null);

  const handleDigit = (digit: string) => {
    playBeep(500, 70);
    setErrorMsg(null);
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        if (CaregiverPortalService.verifyLocalPin(nextPin)) {
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

  const handleRequestOtp = () => {
    if (phoneNumber.trim().length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    setErrorMsg(null);
    const res = CaregiverPortalService.requestCloudOtp(phoneNumber);
    setOtpId(res.otpId);
    setOtpSent(true);
    setOtpStatusMsg(res.message);
    playGentleChime();
  };

  const handleVerifyOtp = () => {
    if (!otpId || otpValue.trim().length < 6) {
      setErrorMsg("Please enter the complete 6-digit OTP.");
      return;
    }
    const isValid = CaregiverPortalService.verifyCloudOtp(otpId, otpValue.trim());
    if (isValid) {
      playGentleChime();
      onSuccess();
    } else {
      playBeep(220, 200);
      setErrorMsg("Invalid or expired OTP. (Default test OTP is 260030).");
    }
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
        aria-label="Go back"
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
        marginBottom: "1rem"
      }}>
        🔒
      </div>

      <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.25rem", textAlign: "center" }}>
        Caregiver & Clinician Portal
      </h2>
      <p style={{ fontSize: "0.82rem", color: "var(--gray-500)", marginBottom: "1.25rem", textAlign: "center" }}>
        Dual-Tier Authentication (Local PIN or Cloud Remote OTP)
      </p>

      {/* Mode Selector Tabs */}
      <div style={{
        display: "flex",
        gap: "0.5rem",
        background: "var(--gray-100)",
        padding: "0.3rem",
        borderRadius: "var(--radius)",
        marginBottom: "1.5rem"
      }}>
        <button
          onClick={() => { setAuthMode("pin"); setErrorMsg(null); }}
          style={{
            padding: "0.45rem 1rem",
            fontSize: "0.8rem",
            fontWeight: 700,
            borderRadius: "calc(var(--radius) - 2px)",
            border: "none",
            background: authMode === "pin" ? "var(--white)" : "transparent",
            color: authMode === "pin" ? "var(--primary)" : "var(--gray-600)",
            boxShadow: authMode === "pin" ? "var(--shadow-sm)" : "none",
            cursor: "pointer",
          }}
        >
          🔑 Local PIN (In-Home)
        </button>
        <button
          onClick={() => { setAuthMode("otp"); setErrorMsg(null); }}
          style={{
            padding: "0.45rem 1rem",
            fontSize: "0.8rem",
            fontWeight: 700,
            borderRadius: "calc(var(--radius) - 2px)",
            border: "none",
            background: authMode === "otp" ? "var(--white)" : "transparent",
            color: authMode === "otp" ? "var(--primary)" : "var(--gray-600)",
            boxShadow: authMode === "otp" ? "var(--shadow-sm)" : "none",
            cursor: "pointer",
          }}
        >
          📱 Cloud SMS OTP (Remote)
        </button>
      </div>

      {errorMsg && (
        <div style={{
          color: "var(--red)",
          fontSize: "0.82rem",
          fontWeight: 600,
          marginBottom: "1rem",
          textAlign: "center",
          maxWidth: "320px",
        }}>
          {errorMsg}
        </div>
      )}

      {/* MODE 1: LOCAL PIN KEYPAD */}
      {authMode === "pin" && (
        <>
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
                    aria-label="Backspace"
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
            marginTop: "1.75rem",
            fontSize: "0.75rem",
            color: "var(--gray-400)",
            textAlign: "center"
          }}>
            Default in-home PIN: <strong>1234</strong>
          </div>
        </>
      )}

      {/* MODE 2: CLOUD SMS OTP */}
      {authMode === "otp" && (
        <div style={{
          width: "100%",
          maxWidth: "320px",
          background: "var(--gray-50)",
          border: "1px solid var(--gray-200)",
          borderRadius: "var(--radius-lg)",
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gray-700)", display: "block", marginBottom: "0.35rem" }}>
              Caregiver Registered Phone
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 9864099881"
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "var(--radius)",
                border: "1.5px solid var(--gray-300)",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "var(--gray-900)",
                outline: "none"
              }}
            />
          </div>

          <button
            onClick={handleRequestOtp}
            style={{
              padding: "0.7rem",
              borderRadius: "var(--radius)",
              background: "var(--primary)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.85rem",
              border: "none",
              cursor: "pointer"
            }}
          >
            {otpSent ? "Resend OTP Code" : "Send Cloud OTP"}
          </button>

          {otpStatusMsg && (
            <div style={{
              fontSize: "0.72rem",
              color: "var(--green-700, #047857)",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              padding: "0.5rem",
              borderRadius: "var(--radius)"
            }}>
              {otpStatusMsg}
            </div>
          )}

          {otpSent && (
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gray-700)", display: "block", marginBottom: "0.35rem" }}>
                Enter 6-Digit OTP (Test Code: 260030)
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                placeholder="260030"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "var(--radius)",
                  border: "1.5px solid var(--primary)",
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  letterSpacing: "0.25rem",
                  textAlign: "center",
                  color: "var(--gray-900)",
                  outline: "none"
                }}
              />

              <button
                onClick={handleVerifyOtp}
                style={{
                  width: "100%",
                  marginTop: "0.75rem",
                  padding: "0.75rem",
                  borderRadius: "var(--radius)",
                  background: "#10b981",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Verify & Enter Portal →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
