// ── SMRITI-NER ELDER-ACCESSIBLE TOAST NOTIFICATION ───────────────────────────
// Sub-Phase 4.1: Calming, Non-Alarming Feedback Notification

"use client";

import React, { useEffect } from "react";
import { announceToScreenReader } from "@/lib/accessibilityMiddleware";

interface ElderToastProps {
  message: string;
  nativeMessage?: string;
  type?: "info" | "success" | "reminder";
  durationMs?: number;
  onClose: () => void;
}

export default function ElderToast({
  message,
  nativeMessage,
  type = "info",
  durationMs = 4500, // Elder reading window (4.5s)
  onClose,
}: ElderToastProps) {
  useEffect(() => {
    const fullText = nativeMessage ? `${nativeMessage} - ${message}` : message;
    announceToScreenReader(fullText);

    const timer = setTimeout(() => {
      onClose();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [message, nativeMessage, durationMs, onClose]);

  const getStyle = () => {
    switch (type) {
      case "success":
        return {
          background: "#F0FDF4",
          border: "2px solid #86EFAC",
          color: "#166534",
          icon: "🌿",
        };
      case "reminder":
        return {
          background: "#FEF3C7",
          border: "2px solid #FCD34D",
          color: "#92400E",
          icon: "🔔",
        };
      default:
        return {
          background: "#F8FAFC",
          border: "2px solid #CBD5E1",
          color: "#0F172A",
          icon: "ℹ️",
        };
    }
  };

  const styleConfig = getStyle();

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: "1.25rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 2rem)",
        maxWidth: "440px",
        zIndex: 2000,
        borderRadius: "18px",
        padding: "0.85rem 1.15rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.12)",
        animation: "slideInDown 0.3s ease-out",
        ...styleConfig,
      }}
    >
      <style>{`
        @keyframes slideInDown {
          from { transform: translate(-50%, -20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
        <span style={{ fontSize: "1.4rem" }}>{styleConfig.icon}</span>
        <div>
          {nativeMessage && (
            <div style={{ fontSize: "0.82rem", fontWeight: 800 }}>{nativeMessage}</div>
          )}
          <div style={{ fontSize: "0.92rem", fontWeight: 700 }}>{message}</div>
        </div>
      </div>

      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        style={{
          background: "none",
          border: "none",
          fontSize: "1.2rem",
          fontWeight: 800,
          color: "currentColor",
          cursor: "pointer",
          padding: "0.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        &times;
      </button>
    </div>
  );
}
