"use client";

import type { ScreenId } from "@/lib/types";
import { playBeep } from "@/lib/audio";
import { triggerHaptic } from "@/lib/accessibilityMiddleware";

interface Props {
  active: ScreenId;
  navigate: (target: ScreenId) => void;
}

export default function BottomNav({ active, navigate }: Props) {
  const navItems = [
    { id: "home" as ScreenId, label: "Home", native: "ঘৰ", icon: "🏠" },
    { id: "games" as ScreenId, label: "Games", native: "খেল", icon: "🎮" },
    { id: "reminders" as ScreenId, label: "Remind", native: "সোঁৱৰণী", icon: "⏰" },
    { id: "caregiver" as ScreenId, label: "Caregiver", native: "তত্ত্বাৱধায়ক", icon: "🔒" },
  ];

  const handleNav = (target: ScreenId) => {
    triggerHaptic("tap");
    playBeep(440, 80);
    navigate(target);
  };

  return (
    <nav
      aria-label="Main Navigation"
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "480px",
        backgroundColor: "var(--white)",
        borderTop: "2px solid var(--gray-200)",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        padding: "0.25rem 0.25rem env(safe-area-inset-bottom, 0.5rem)",
        boxShadow: "0 -4px 16px rgba(0, 0, 0, 0.06)",
        zIndex: 50,
      }}
    >
      {navItems.map((item) => {
        const isActive =
          active === item.id ||
          (item.id === "caregiver" && active === "caregiver-pin");
        return (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            aria-label={`${item.label} (${item.native})`}
            aria-current={isActive ? "page" : undefined}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.2rem",
              cursor: "pointer",
              padding: "0.4rem 0",
              minHeight: "64px", // WCAG 2.2 AAA 64x64dp elder touch target standard
              color: isActive ? "var(--primary)" : "var(--gray-500)",
              transition: "all var(--transition)",
              outline: "none",
              userSelect: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span
              style={{
                fontSize: "1.45rem",
                transform: isActive ? "scale(1.15)" : "none",
                transition: "transform var(--transition)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.1 }}>
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: isActive ? 800 : 600,
                  letterSpacing: "-0.01em",
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--primary-dark)" : "var(--gray-400)",
                }}
              >
                {item.native}
              </span>
            </div>
            {isActive && (
              <span
                style={{
                  width: "16px",
                  height: "3px",
                  borderRadius: "999px",
                  background: "var(--primary)",
                  marginTop: "0.1rem",
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

