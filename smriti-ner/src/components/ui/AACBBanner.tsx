// ── SMRITI-NER AACB FAMILY GUIDANCE BANNER ───────────────────────────
// Sub-Phase 4.5: Non-alarming compassionate de-escalation banner with
// regional kinship voice trigger and calming warm aesthetics.

"use client";

import React from "react";

interface AACBBannerProps {
  active: boolean;
  message?: string;
  kinshipTitle?: string;
  onReplayVoice?: () => void;
}

export default function AACBBanner({
  active,
  message,
  kinshipTitle = "দেউতা",
  onReplayVoice,
}: AACBBannerProps) {
  if (!active || !message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
        border: "2px solid #f59e0b",
        borderRadius: "var(--radius-lg)",
        padding: "0.85rem 1.15rem",
        marginBottom: "1rem",
        boxShadow: "0 4px 14px rgba(245, 158, 11, 0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.85rem",
        animation: "fadeIn 300ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#fde68a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.4rem",
            flexShrink: 0,
            boxShadow: "0 2px 6px rgba(180, 83, 9, 0.2)",
          }}
        >
          💛
        </div>

        <div>
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 800,
              color: "#92400e",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <span>পৰিয়ালৰ সহায় • Family Guidance</span>
            <span>({kinshipTitle})</span>
          </div>

          <p
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "#78350f",
              lineHeight: 1.35,
              margin: "0.15rem 0 0",
            }}
          >
            {message}
          </p>
        </div>
      </div>

      {onReplayVoice && (
        <button
          onClick={onReplayVoice}
          style={{
            background: "#f59e0b",
            color: "#ffffff",
            border: "none",
            borderRadius: "50%",
            width: 42,
            height: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            cursor: "pointer",
            flexShrink: 0,
            boxShadow: "0 2px 6px rgba(180, 83, 9, 0.3)",
            transition: "transform 0.15s ease",
          }}
          aria-label="Replay family guidance voice"
          title="Replay Voice"
        >
          🔊
        </button>
      )}
    </div>
  );
}
