// ── SMRITI-NER PORTRAIT ORIENTATION GUARD ─────────────────────────────────────
// Sub-Phase 4.1: Visuospatial Screen Coordinate Protection
// Ensures elder cognitive games are played in portrait orientation on mobile devices

"use client";

import React, { useState, useEffect } from "react";

export default function OrientationGuard() {
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Trigger only if width > height AND width is under standard tablet landscape (1024px)
      const isLandscape =
        typeof window !== "undefined" &&
        window.innerWidth > window.innerHeight &&
        window.innerWidth < 1024;
      setIsLandscapeMobile(isLandscape);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!isLandscapeMobile || dismissed) {
    return null;
  }

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="orientation-title"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.85)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          border: "2px solid #E2E8F0",
          maxWidth: "460px",
          width: "100%",
          padding: "1.75rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div
          style={{
            fontSize: "2.8rem",
            animation: "rotateDevice 2.5s ease-in-out infinite",
          }}
        >
          📱
        </div>

        <style>{`
          @keyframes rotateDevice {
            0% { transform: rotate(90deg); }
            50% { transform: rotate(0deg); }
            100% { transform: rotate(90deg); }
          }
        `}</style>

        <h3
          id="orientation-title"
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "#0F172A",
            lineHeight: 1.3,
          }}
        >
          অনুগ্ৰহ কৰি ফোনটো পোনে পোনে ৰাখক
        </h3>

        <p style={{ fontSize: "0.95rem", color: "#475569", lineHeight: 1.4 }}>
          Please hold your device upright in <strong>portrait mode</strong> for the best and most comfortable cognitive exercise experience.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", width: "100%", marginTop: "0.5rem" }}>
          <button
            onClick={() => setDismissed(true)}
            style={{
              flex: 1,
              minHeight: "52px",
              background: "#F1F5F9",
              border: "1.5px solid #CBD5E1",
              borderRadius: "14px",
              color: "#334155",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
            }}
          >
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
