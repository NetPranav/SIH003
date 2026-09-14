// ── SMRITI-NER COGNITIVE PROGRESS RING ───────────────────────────────────────
// Sub-Phase 4.1: Accessible SVG Progress Indicator for Cognitive Exercises
// Calibrated for elder-friendly touch ergonomics and pixel-perfect card containment

"use client";

import React from "react";

interface CognitiveProgressRingProps {
  percentage: number; // 0 to 100
  size?: number; // px
  strokeWidth?: number; // px
  label?: string;
  nativeLabel?: string;
  language?: string;
  color?: string;
  trackColor?: string;
}

export default function CognitiveProgressRing({
  percentage = 0,
  size = 56,
  strokeWidth = 6,
  label,
  nativeLabel,
  language = "en",
  color = "#16a34a", // Emerald green
  trackColor = "#bbf7d0",
}: CognitiveProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const isCompact = size < 80;

  // Localized Done string
  const doneLabels: Record<string, string> = {
    as: "সম্পূৰ্ণ",
    bn: "সম্পন্ন",
    hi: "पूर्ण",
    mni: "ꯂꯣꯏꯔꯦ",
    brx: "जोबबाय",
    kha: "La Dep",
    lus: "Zo Ta",
    en: "Done",
  };
  const doneWord = doneLabels[language] || "Done";

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label || "Progress"}: ${clamped}%`}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: isCompact ? "0.2rem" : "0.5rem",
        flexShrink: 0,
      }}
    >
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)", display: "block" }}
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.8s ease-in-out",
            }}
          />
        </svg>

        {/* Centered Percentage Value - Proportionally sized to fit INSIDE the ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontSize: isCompact ? `${Math.round(size * 0.28)}px` : "1.75rem",
              fontWeight: 900,
              color: "#0F172A",
              lineHeight: 1,
            }}
          >
            {clamped}%
          </span>
          {!isCompact && (
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "#64748B",
                marginTop: "0.2rem",
              }}
            >
              {doneWord}
            </span>
          )}
        </div>
      </div>

      {/* Optional sublabel, cleanly contained */}
      {(label || nativeLabel) && (
        <div style={{ textAlign: "center", maxWidth: `${size + 24}px`, lineHeight: 1.15 }}>
          {nativeLabel && (
            <div style={{ fontSize: isCompact ? "0.68rem" : "0.82rem", fontWeight: 800, color: "#065F46" }}>
              {nativeLabel}
            </div>
          )}
          {label && (
            <div style={{ fontSize: isCompact ? "0.65rem" : "0.75rem", color: "#475569", fontWeight: 700 }}>
              {label}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
