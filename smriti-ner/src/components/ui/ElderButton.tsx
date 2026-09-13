// ── SMRITI-NER ELDER-SAFE INTERACTIVE BUTTON ───────────────────────────────
// Sub-Phase 2.1 Deliverable: 64x64dp tremor-tolerant, debounced, WCAG AAA button

"use client";

import React, { useState, useRef } from "react";
import { TOUCH_TARGET_SPEC, ELDER_MOTION_SPEC } from "@/lib/designSystemTokens";
import { playAudioFeedback } from "@/lib/audio";

interface ElderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "ghost";
  fullWidth?: boolean;
  minHeight?: number;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onPress?: () => void;
}

export default function ElderButton({
  variant = "primary",
  fullWidth = false,
  minHeight = TOUCH_TARGET_SPEC.minHitboxPx,
  icon,
  children,
  onPress,
  disabled = false,
  style,
  ...rest
}: ElderButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const lastPressRef = useRef<number>(0);

  const handlePointerDown = () => {
    if (disabled) return;
    setIsPressed(true);
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const now = Date.now();
    // Hardware tremor debounce check
    if (now - lastPressRef.current < TOUCH_TARGET_SPEC.debounceMs) {
      e.preventDefault();
      return;
    }
    lastPressRef.current = now;

    // Trigger gentle dementia-safe acoustic click confirmation
    playAudioFeedback("click");

    if (onPress) {
      onPress();
    }
  };

  // Variant color mapping adhering strictly to WCAG 2.2 AAA
  const variantStyles = {
    primary: {
      background: "#0f172a", // Midnight Slate
      color: "#ffffff",
      border: "2px solid #0f172a",
      boxShadow: "0 2px 4px rgba(15, 23, 42, 0.12)",
    },
    secondary: {
      background: "#ffffff",
      color: "#0f172a",
      border: "2.5px solid #0f172a",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
    },
    success: {
      background: "#065f46", // Tea Leaf Emerald (7.4:1 contrast)
      color: "#ffffff",
      border: "2px solid #065f46",
      boxShadow: "0 2px 6px rgba(6, 95, 70, 0.2)",
    },
    warning: {
      background: "#92400e", // Muga Amber Ochre (7.2:1 contrast)
      color: "#ffffff",
      border: "2px solid #92400e",
      boxShadow: "0 2px 6px rgba(146, 64, 14, 0.2)",
    },
    ghost: {
      background: "#f8f9fa",
      color: "#1e293b",
      border: "2px solid #e2e8f0",
      boxShadow: "none",
    },
  };

  const selected = variantStyles[variant];

  return (
    <button
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        minHeight: `${minHeight}px`,
        minWidth: `${TOUCH_TARGET_SPEC.minHitboxPx}px`,
        width: fullWidth ? "100%" : "auto",
        padding: "0.85rem 1.5rem",
        borderRadius: "16px",
        fontSize: "1.125rem", // 18px body standard
        fontWeight: 700,
        lineHeight: 1.4,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transform: isPressed ? `scale(${TOUCH_TARGET_SPEC.activeDepressionScale})` : "scale(1)",
        transition: `all ${ELDER_MOTION_SPEC.standardDurationMs}ms ${ELDER_MOTION_SPEC.easingCurve}`,
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        ...selected,
        ...style,
      }}
      {...rest}
    >
      {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
