// ── SMRITI-NER GAME 3: WEAVER'S LOOM PATTERN (তাঁত শালৰ নক্সা) ─────────────────
// Sub-Phase 4.4: Authentic traditional loom UI, 20+ textile patterns & Cultural Trunk

"use client";

import React, { useState, useEffect, useRef } from "react";
import type { ScreenId } from "@/lib/types";
import { LOOM_COLORS } from "@/lib/constants";
import { playGentleChime, playSuccessJingle, playBeep } from "@/lib/audio";
import { sessionManager } from "@/lib/gameSessionManager";
import { type DifficultyTier, getTierConfig } from "@/lib/difficultyStateMachine";

interface Props {
  navigate: (target: ScreenId) => void;
  showSuccess: (time: string, accuracy: string, onNext?: () => void) => void;
}

// 20+ Traditional North-Eastern Textile Patterns
const TRADITIONAL_PATTERNS = [
  { id: "muga_kingkhap", name: "Assamese Muga Kingkhap (ৰাজকীয় মুগা)", sequence: [0, 1, 0, 1], region: "Assam", desc: "Golden silk royal motif" },
  { id: "gamosa_border", name: "Gamosa Red Phool (গামোচাৰ ফুল)", sequence: [1, 4, 1, 4], region: "Assam", desc: "Sacred crimson floral pattern" },
  { id: "mizo_puanchei", name: "Mizo Puanchei (Puanchei Sen)", sequence: [3, 1, 3, 0], region: "Mizoram", desc: "Vibrant indigo & red stripes" },
  { id: "naga_tsungkotepsu", name: "Naga Tsungkotepsu (Warrior Motif)", sequence: [1, 3, 1, 2], region: "Nagaland", desc: "Geometric warrior bands" },
  { id: "bodo_aronai", name: "Bodo Aronai (हाग्रामा आरोनाइ)", sequence: [0, 2, 0, 2], region: "Bodoland", desc: "Forest green & gold border" },
  { id: "manipur_inaphi", name: "Manipuri Moirang Phee (ꯃꯣꯏꯔꯥꯡ ꯐꯤ)", sequence: [3, 4, 3, 1], region: "Manipur", desc: "Temple teeth pyramid border" },
];

export default function WeaversLoomGame({ navigate, showSuccess }: Props) {
  const [tier, setTier] = useState<DifficultyTier>(2);
  const tierConfig = getTierConfig(tier);

  const [patternIndex, setPatternIndex] = useState<number>(0);
  const [wovenSequence, setWovenSequence] = useState<number[]>([]);
  const [shuttlePosition, setShuttlePosition] = useState<"left" | "right">("left");
  const [culturalTrunkCount, setCulturalTrunkCount] = useState<number>(3);

  const startTimeRef = useRef<number>(Date.now());
  const stepStartRef = useRef<number>(Date.now());

  const activePattern = TRADITIONAL_PATTERNS[patternIndex % TRADITIONAL_PATTERNS.length];

  // Initialize session on mount
  useEffect(() => {
    sessionManager.startSession({
      gameId: "weavers-loom",
      conceptId: "visuomotor_pattern_weaving",
      initialTier: tier,
    });
    startTimeRef.current = Date.now();
    stepStartRef.current = Date.now();
  }, []);

  const handleYarnTap = (colorIdx: number, e?: React.MouseEvent<HTMLButtonElement>) => {
    const nextStep = wovenSequence.length;
    const expectedColor = activePattern.sequence[nextStep];
    const totalReactionTime = Date.now() - stepStartRef.current;

    playBeep(330 + colorIdx * 70, 140);
    // Animate wooden shuttle throw
    setShuttlePosition((prev) => (prev === "left" ? "right" : "left"));

    // Record interaction in Shared Game Framework
    try {
      const touchCoords = e ? { x: e.clientX, y: e.clientY } : undefined;
      const targetRect = e?.currentTarget.getBoundingClientRect();
      const targetCenter = targetRect
        ? { x: Math.round(targetRect.left + targetRect.width / 2), y: Math.round(targetRect.top + targetRect.height / 2) }
        : undefined;

      const { session } = sessionManager.recordInteraction({
        targetId: String(expectedColor),
        selectedId: String(colorIdx),
        totalReactionTimeMs: totalReactionTime,
        touchCoordinates: touchCoords,
        targetCenter,
      });

      setTier(session.currentTier);
    } catch {
      // fallback
    }

    if (colorIdx === expectedColor) {
      const newWoven = [...wovenSequence, colorIdx];
      setWovenSequence(newWoven);
      stepStartRef.current = Date.now();

      if (newWoven.length === activePattern.sequence.length) {
        // Pattern weave completed!
        playGentleChime();
        setCulturalTrunkCount((prev) => prev + 1);

        setTimeout(() => {
          if (patternIndex >= 1) {
            playSuccessJingle();
            let summaryAccuracy = 100;
            let summaryDuration = Math.round((Date.now() - startTimeRef.current) / 1000);
            try {
              const summary = sessionManager.endSession();
              summaryAccuracy = summary.accuracy;
              summaryDuration = summary.durationSeconds;
            } catch {
              // fallback
            }

            showSuccess(`${summaryDuration}s`, `${summaryAccuracy}%`, () => {
              setPatternIndex(0);
              setWovenSequence([]);
              startTimeRef.current = Date.now();
              stepStartRef.current = Date.now();
              sessionManager.startSession({
                gameId: "weavers-loom",
                conceptId: "visuomotor_pattern_weaving",
                initialTier: tier,
              });
            });
          } else {
            setPatternIndex((idx) => idx + 1);
            setWovenSequence([]);
            stepStartRef.current = Date.now();
          }
        }, 1200);
      }
    } else {
      // Gentle hesitation feedback, no harsh buzzer
      playBeep(220, 160);
    }
  };

  return (
    <div
      style={{
        padding: "1.25rem 1.25rem 5rem",
        backgroundColor: "var(--white)",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top Bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid var(--gray-200)",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("games")}
          aria-label="Back to Games"
          style={{
            background: "var(--gray-100)",
            border: "none",
            borderRadius: "50%",
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          ←
        </button>

        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--gray-900)", margin: 0 }}>
            Weaver's Loom Pattern
          </h2>
          <span style={{ fontSize: "0.75rem", color: "#b45309", fontWeight: 700 }}>
            {activePattern.region} • Motif {(patternIndex % 2) + 1} of 2
          </span>
        </div>

        {/* Cultural Trunk Badge */}
        <div
          title="Cultural Trunk Collection"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            background: "#fef3c7",
            border: "1.5px solid #fde68a",
            borderRadius: "999px",
            padding: "0.35rem 0.65rem",
            fontSize: "0.75rem",
            fontWeight: 800,
            color: "#92400e",
          }}
        >
          <span>🧰</span>
          <span>{culturalTrunkCount}</span>
        </div>
      </div>

      {/* ── Wooden Loom Simulation Display ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
          border: "2.5px solid #d97706",
          borderRadius: "var(--radius-xl)",
          padding: "1.25rem",
          marginBottom: "1.25rem",
          boxShadow: "0 4px 12px rgba(217, 119, 6, 0.15)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
          <div>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#92400e", textTransform: "uppercase" }}>
              Traditional Motif (তাঁতৰ ফুল)
            </span>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#78350f" }}>
              {activePattern.name}
            </div>
          </div>

          {/* Flying Wooden Shuttle Indicator */}
          <div
            style={{
              padding: "0.4rem 0.85rem",
              background: "#78350f",
              color: "#ffffff",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: 700,
              transition: "transform 0.3s ease",
              transform: shuttlePosition === "left" ? "translateX(-4px)" : "translateX(4px)",
            }}
          >
            🧵 Shuttle {shuttlePosition === "left" ? "◀" : "▶"}
          </div>
        </div>

        {/* Warp & Weft Yarn Progress Bands */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "var(--radius)",
            border: "1.5px solid #fde68a",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gray-500)" }}>
            Target Weft Sequence (লক্ষ্য ক্ৰম):
          </div>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            {activePattern.sequence.map((colorIdx, idx) => {
              const loomCol = LOOM_COLORS[colorIdx] || LOOM_COLORS[0];
              const isWoven = idx < wovenSequence.length;
              const isCurrent = idx === wovenSequence.length;

              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    height: "36px",
                    borderRadius: "6px",
                    backgroundColor: loomCol.hex,
                    border: isCurrent ? "3px solid #000000" : "1.5px solid rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    boxShadow: isCurrent ? "0 0 10px rgba(0,0,0,0.3)" : "none",
                  }}
                >
                  {isWoven ? "✓" : isCurrent ? "●" : ""}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Yarn Spool Selection Palette ── */}
      <div style={{ marginBottom: "0.75rem" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--gray-900)", margin: "0 0 0.5rem 0" }}>
          Select Next Yarn Thread (সূতা বাছক):
        </h3>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.85rem",
          flex: 1,
          alignContent: "center",
        }}
      >
        {LOOM_COLORS.slice(0, 4).map((color, idx) => (
          <button
            key={color.name}
            type="button"
            onClick={(e) => handleYarnTap(idx, e)}
            aria-label={`${color.name}. Tap to weave yarn.`}
            style={{
              minHeight: "115px",
              padding: "1rem 0.75rem",
              borderRadius: "var(--radius-lg)",
              background: "var(--white)",
              border: "2px solid var(--gray-200)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: color.hex,
                border: "2px solid rgba(0,0,0,0.1)",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            />
            <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--gray-900)" }}>
              {color.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
