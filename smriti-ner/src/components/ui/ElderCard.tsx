// ── SMRITI-NER ELDER-ACCESSIBLE CARD COMPONENT ─────────────────────────────
// Sub-Phase 4.1: High-Contrast, WCAG 2.2 AAA Surface Container

"use client";

import React from "react";

interface ElderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "accent" | "cultural";
  accentColor?: string;
  padding?: string;
  interactive?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

export default function ElderCard({
  variant = "default",
  accentColor = "var(--primary)",
  padding = "1.25rem",
  interactive = false,
  onPress,
  children,
  style,
  ...rest
}: ElderCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const getBorderAndBackground = () => {
    switch (variant) {
      case "elevated":
        return {
          background: "#FFFFFF",
          border: "2px solid #CBD5E1",
          boxShadow: isHovered
            ? "0 10px 15px -3px rgba(0, 0, 0, 0.08)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        };
      case "accent":
        return {
          background: "#FFFFFF",
          border: `2px solid ${accentColor}`,
          borderLeft: `6px solid ${accentColor}`,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.04)",
        };
      case "cultural":
        return {
          background: "#FAF9F6", // Warm Muga ivory
          border: "2px solid #D1D5DB",
          borderTop: `4px solid ${accentColor}`,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        };
      default:
        return {
          background: "#FFFFFF",
          border: "2px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        };
    }
  };

  const currentStyle = getBorderAndBackground();

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive && onPress ? onPress : undefined}
      onKeyDown={
        interactive && onPress
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPress();
              }
            }
          : undefined
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: "20px",
        padding,
        cursor: interactive ? "pointer" : "default",
        transition: "all 0.2s ease",
        transform: interactive && isHovered ? "translateY(-2px)" : "none",
        outline: "none",
        ...currentStyle,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
