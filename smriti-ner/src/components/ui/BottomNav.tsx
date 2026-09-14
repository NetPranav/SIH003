"use client";

import type { ScreenId } from "@/lib/types";
import { playBeep } from "@/lib/audio";
import { triggerHaptic } from "@/lib/accessibilityMiddleware";

interface Props {
  active: ScreenId;
  navigate: (target: ScreenId) => void;
  language?: string;
}

const NAV_LOCALES: Record<
  string,
  { home: string; games: string; reminders: string; caregiver: string }
> = {
  as: { home: "ঘৰ", games: "খেল", reminders: "সোঁৱৰণী", caregiver: "তত্ত্বাৱধায়ক" },
  bn: { home: "বাড়ি", games: "খেলা", reminders: "ওষুধ", caregiver: "তত্ত্বাবধায়ক" },
  hi: { home: "घर", games: "खेल", reminders: "दवा-याद", caregiver: "देखभाल" },
  mni: { home: "ꯌꯨꯝ", games: "ꯁꯥꯟꯅꯄꯣꯠ", reminders: "ꯅꯤꯡꯁꯤꯡꯕꯥ", caregiver: "ꯌꯦꯡꯁꯤꯅꯕꯥ" },
  brx: { home: "नखर", games: "गेलेनाय", reminders: "गोसोखां", caregiver: "हेफाजाब" },
  kha: { home: "Ïing", games: "Jingïalehkai", reminders: "Dawai", caregiver: "Nongsumar" },
  lus: { home: "In", games: "Game", reminders: "Hriattirna", caregiver: "Enkawltu" },
  en: { home: "Home", games: "Games", reminders: "Reminders", caregiver: "Caregiver" },
};

export default function BottomNav({ active, navigate, language = "en" }: Props) {
  const t = NAV_LOCALES[language] || NAV_LOCALES.en;
  const isEnglish = language === "en";

  const navItems = [
    {
      id: "home" as ScreenId,
      primary: t.home,
      secondary: isEnglish ? "" : "Home",
      icon: "🏠",
    },
    {
      id: "games" as ScreenId,
      primary: t.games,
      secondary: isEnglish ? "" : "Games",
      icon: "🎮",
    },
    {
      id: "reminders" as ScreenId,
      primary: t.reminders,
      secondary: isEnglish ? "" : "Remind",
      icon: "⏰",
    },
    {
      id: "caregiver" as ScreenId,
      primary: t.caregiver,
      secondary: isEnglish ? "" : "Caregiver",
      icon: "🔒",
    },
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
        maxWidth: "500px",
        backgroundColor: "var(--white)",
        borderTop: "2px solid var(--gray-200)",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        padding: "0.25rem 0.25rem max(env(safe-area-inset-bottom, 0px), 0.65rem)",
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
            id={`nav-btn-${item.id}`}
            data-testid={`nav-btn-${item.id}`}
            onClick={() => handleNav(item.id)}
            aria-label={`${item.primary} ${item.secondary}`}
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                lineHeight: 1.15,
              }}
            >
              <span
                style={{
                  fontSize: "0.82rem",
                  fontWeight: isActive ? 800 : 700,
                  letterSpacing: "-0.01em",
                  color: isActive ? "var(--primary)" : "var(--gray-800)",
                }}
              >
                {item.primary}
              </span>
              {item.secondary && (
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    color: isActive ? "var(--primary-dark)" : "var(--gray-400)",
                  }}
                >
                  {item.secondary}
                </span>
              )}
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
