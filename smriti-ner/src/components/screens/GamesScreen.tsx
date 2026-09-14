"use client";

import type { ScreenId } from "@/lib/types";
import { playBeep } from "@/lib/audio";
import { GAMES_SCREEN_LOCALES } from "@/lib/screenLocalizations";

interface Props {
  navigate: (target: ScreenId) => void;
  language?: string;
}

export default function GamesScreen({ navigate, language = "en" }: Props) {
  const loc = GAMES_SCREEN_LOCALES[language] || GAMES_SCREEN_LOCALES.en;

  const games = [
    {
      id: "dhol-pepa" as ScreenId,
      emoji: "🥁",
      name: loc.dhol.name,
      native: loc.dhol.native,
      domain: "Auditory Memory & Rhythm",
      clinical: "Ribot's Law Auditory Priming",
      badge: "Sound & Memory",
      color: "#2563eb",
      bgColor: "#eff6ff",
      desc: loc.dhol.desc,
    },
    {
      id: "kaziranga" as ScreenId,
      emoji: "🦏",
      name: loc.kaziranga.name,
      native: loc.kaziranga.native,
      domain: "Visual Attention & Category",
      clinical: "Semantic Association (MoCA)",
      badge: "Visual Search",
      color: "#059669",
      bgColor: "#f0fdf4",
      desc: loc.kaziranga.desc,
    },
    {
      id: "weavers-loom" as ScreenId,
      emoji: "🧵",
      name: loc.loom.name,
      native: loc.loom.native,
      domain: "Visuospatial Sequencing",
      clinical: "Procedural Memory Recall",
      badge: "Sequencing",
      color: "#d97706",
      bgColor: "#fef3c7",
      desc: loc.loom.desc,
    },
    {
      id: "daily-haat" as ScreenId,
      emoji: "🧺",
      name: loc.haat.name,
      native: loc.haat.native,
      domain: "Executive Function & Working Memory",
      clinical: "Delayed Recall & Planning",
      badge: "Daily Routine",
      color: "#9333ea",
      bgColor: "#faf5ff",
      desc: loc.haat.desc,
    },
  ];

  const handleSelectGame = (id: ScreenId) => {
    playBeep(440, 100);
    navigate(id);
  };

  return (
    <div style={{
      padding: "1.25rem 1.25rem 6rem",
      backgroundColor: "var(--white)",
      minHeight: "100dvh"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.25rem",
        paddingBottom: "0.85rem",
        borderBottom: "1px solid var(--gray-200)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={() => navigate("home")}
            style={{
              background: "var(--gray-100)",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              cursor: "pointer"
            }}
          >
            ←
          </button>
          <div>
            <h1 style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "var(--gray-900)"
            }}>
              {loc.headerTitle}
            </h1>
            <p style={{
              fontSize: "0.8rem",
              color: "var(--gray-500)"
            }}>
              {loc.headerSubtitle}
            </p>
          </div>
        </div>

        <div style={{
          padding: "0.35rem 0.75rem",
          background: "var(--gray-50)",
          borderRadius: "999px",
          border: "1px solid var(--gray-200)",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "var(--green)"
        }}>
          Adaptive AACB Active
        </div>
      </div>

      <p style={{
        fontSize: "0.88rem",
        color: "var(--gray-600)",
        marginBottom: "1.25rem",
        lineHeight: 1.45
      }}>
        Culturally grounded exercises calibrated for comfort, gentle pacing, and zero negative reinforcement.
      </p>

      {/* Game Cards List */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        {games.map((g) => (
          <div
            key={g.id}
            onClick={() => handleSelectGame(g.id)}
            style={{
              background: "var(--white)",
              border: "1.5px solid var(--gray-200)",
              borderRadius: "var(--radius-lg)",
              padding: "1.15rem",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
              transition: "all var(--transition)",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = g.color;
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--gray-200)";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              e.currentTarget.style.transform = "none";
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: "14px",
                  background: g.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.75rem"
                }}>
                  {g.emoji}
                </div>
                <div>
                  <h3 style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "var(--gray-900)"
                  }}>
                    {g.name}
                  </h3>
                  <div style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--accent)"
                  }}>
                    {g.native}
                  </div>
                </div>
              </div>

              <span style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: g.color,
                background: g.bgColor,
                padding: "0.25rem 0.6rem",
                borderRadius: "999px",
                textTransform: "uppercase"
              }}>
                {g.badge}
              </span>
            </div>

            <p style={{
              fontSize: "0.85rem",
              color: "var(--gray-600)",
              lineHeight: 1.4
            }}>
              {g.desc}
            </p>

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "0.6rem",
              borderTop: "1px solid var(--gray-100)",
              fontSize: "0.75rem"
            }}>
              <span style={{ color: "var(--gray-500)" }}>
                Target: <strong style={{ color: "var(--gray-700)" }}>{g.domain}</strong>
              </span>
              <span style={{
                color: "var(--primary)",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "0.25rem"
              }}>
                Play Now →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
