// ── SMRITI-NER COGNITIVE PROGRESS RING ───────────────────────────────────────
// Sub-Phase 4.1: Accessible SVG Progress Indicator for Cognitive Exercises

"use client";

import React from "react";

interface CognitiveProgressRingProps {
  percentage: number; // 0 to 100
  size?: number; // px
  strokeWidth?: number; // px
  label?: string;
  nativeLabel?: string;
  color?: string;
  trackColor?: string;
}

export default function CognitiveProgressRing({
  percentage = 0,
  size = 140,
  strokeWidth = 12,
  label = "Daily Goal",
  nativeLabel = "আজিৰ অগ্ৰগতি",
  color = "#065F46", // Tea leaf emerald
  trackColor = "#E2E8F0",
}: CognitiveProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label}: ${clamped}%`}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
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

        {/* Centered Percentage Value */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "1.75rem",
              fontWeight: 900,
              color: "#0F172A",
              lineHeight: 1,
            }}
          >
            {clamped}%
          </span>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "#64748B",
              marginTop: "0.2rem",
            }}
          >
            সম্পূৰ্ণ / Done
          </span>
        </div>
      </div>

      {(label || nativeLabel) && (
        <div style={{ textAlign: "center" }}>
          {nativeLabel && (
            <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#065F46" }}>
              {nativeLabel}
            </div>
          )}
          {label && (
            <div style={{ fontSize: "0.75rem", color: "#475569", fontWeight: 600 }}>
              {label}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
