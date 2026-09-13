"use client";

import type { ScreenId } from "@/lib/types";
import { playBeep } from "@/lib/audio";

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
    playBeep(440, 80);
    navigate(target);
  };

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: "480px",
      backgroundColor: "var(--white)",
      borderTop: "1px solid var(--gray-200)",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      padding: "0.5rem 0.25rem env(safe-area-inset-bottom, 0.5rem)",
      boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.05)",
      zIndex: 50
    }}>
      {navItems.map((item) => {
        const isActive =
          active === item.id ||
          (item.id === "caregiver" && active === "caregiver-pin");
        return (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.15rem",
              cursor: "pointer",
              padding: "0.35rem 0",
              minHeight: "56px",
              color: isActive ? "var(--primary)" : "var(--gray-400)",
              transition: "all var(--transition)"
            }}
          >
            <span style={{
              fontSize: "1.4rem",
              transform: isActive ? "scale(1.15)" : "none",
              transition: "transform var(--transition)"
            }}>
              {item.icon}
            </span>
            <span style={{
              fontSize: "0.75rem",
              fontWeight: isActive ? 800 : 500,
              letterSpacing: "-0.01em"
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
