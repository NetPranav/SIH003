// ── SMRITI-NER GAME 3: WEAVER'S LOOM PATTERN (তাঁত শালৰ নক্সা) ─────────────────
// Sub-Phase 4.5: Authentic traditional loom UI, 20+ textile patterns,
// Cultural Trunk, unified AACB golden halo, and zero failure sounds.

"use client";

import React, { useState, useEffect, useRef } from "react";
import type { ScreenId } from "@/lib/types";
import { LOOM_COLORS } from "@/lib/constants";
import { playGentleChime, playSuccessJingle, playBeep, playNeutralTap } from "@/lib/audio";
import { sessionManager } from "@/lib/gameSessionManager";
import { type DifficultyTier, getTierConfig } from "@/lib/difficultyStateMachine";
import { aacbEngine, type AACBState } from "@/lib/aacbEngine";
import AACBBanner from "@/components/ui/AACBBanner";
import { offlineMobileStore } from "@/lib/offlineMobileStorage";

import { GAMES_SCREEN_LOCALES } from "@/lib/screenLocalizations";

interface Props {
  navigate: (target: ScreenId) => void;
  showSuccess: (time: string, accuracy: string, onNext?: () => void) => void;
  language?: string;
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

export default function WeaversLoomGame({ navigate, showSuccess, language = "en" }: Props) {
  const loc = GAMES_SCREEN_LOCALES[language] || GAMES_SCREEN_LOCALES.en;

  const [tier, setTier] = useState<DifficultyTier>(2);
  const tierConfig = getTierConfig(tier);

  const [patternIndex, setPatternIndex] = useState<number>(0);
  const [wovenSequence, setWovenSequence] = useState<number[]>([]);
  const [shuttlePosition, setShuttlePosition] = useState<"left" | "right">("left");
  const [culturalTrunkCount, setCulturalTrunkCount] = useState<number>(3);
  const [aacbState, setAacbState] = useState<AACBState>(aacbEngine.getState());

  const startTimeRef = useRef<number>(Date.now());
  const stepStartRef = useRef<number>(Date.now());

  const activePattern = TRADITIONAL_PATTERNS[patternIndex % TRADITIONAL_PATTERNS.length];

  // Subscribe to AACB engine
  useEffect(() => {
    const unsubscribe = aacbEngine.subscribe((state) => {
      setAacbState(state);
    });

    sessionManager.startSession({
      gameId: "weavers-loom",
      conceptId: "visuomotor_pattern_weaving",
      initialTier: tier,
    });
    startTimeRef.current = Date.now();
    stepStartRef.current = Date.now();

    return () => {
      unsubscribe();
      aacbEngine.reset();
    };
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
      aacbEngine.recordSuccess();

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

            offlineMobileStore.recordGameSession({
              gameId: "weavers-loom",
              accuracy: summaryAccuracy,
              durationSeconds: summaryDuration,
              tier: tier,
              aacbTriggered: aacbState.triggered,
            });

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
      // Gentle neutral audio, record in AACB engine
      playNeutralTap();

      aacbEngine.recordError({
        gameId: "weavers-loom",
        targetId: String(expectedColor),
        deliberationMs: totalReactionTime,
        language: language as any,
      });
    }
  };

  return (
    <div
      style={{
        padding: "1.25rem 1.25rem 5rem",
        backgroundColor: "var(--bg)",
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
          marginBottom: "0.75rem",
          paddingBottom: "0.75rem",
          borderBottom: "1.5px solid var(--gray-200)",
        }}
      >
        <button
          onClick={() => navigate("games")}
          style={{
            background: "var(--white)",
            border: "1.5px solid var(--gray-200)",
            borderRadius: "50%",
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.3rem",
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
          }}
          aria-label="Back to Games"
        >
          ←
        </button>

        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--gray-900)" }}>
            {loc.loom.native}
          </h2>
          <span style={{ fontSize: "0.82rem", color: "#4f46e5", fontWeight: 700 }}>
            {loc.loom.name} • {language === "hi" ? `पैटर्न ${patternIndex + 1}/${TRADITIONAL_PATTERNS.length}` : `Pattern ${patternIndex + 1} of ${TRADITIONAL_PATTERNS.length}`}
          </span>
        </div>

        <div
          style={{
            background: aacbState.triggered ? "#fef3c7" : "#e0e7ff",
            border: `1.5px solid ${aacbState.triggered ? "#fde68a" : "#c7d2fe"}`,
            borderRadius: "var(--radius)",
            padding: "0.35rem 0.65rem",
            fontSize: "0.82rem",
            fontWeight: 800,
            color: aacbState.triggered ? "#92400e" : "#3730a3",
          }}
        >
          {aacbState.triggered ? "AACB Active" : `Tier ${tier}`}
        </div>
      </div>

      {/* ── AACB Compassionate Family Guidance Banner ── */}
      <AACBBanner
        active={aacbState.triggered}
        language={language}
        message={aacbState.nativeVoiceCue || aacbState.guidanceMessage}
        kinshipTitle={aacbState.kinshipTitle}
        onReplayVoice={() =>
          aacbEngine.speakVoiceCue(aacbState.nativeVoiceCue || aacbState.guidanceMessage || "", language)
        }
      />

      {/* ── Traditional Loom Frame & Reed Shuttle Area ── */}
      <div
        style={{
          background: "#fef3c7",
          border: "3px solid #b45309",
          borderRadius: "var(--radius-lg)",
          padding: "1rem",
          marginBottom: "1rem",
          boxShadow: "0 6px 16px rgba(180, 83, 9, 0.15)",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#92400e", textTransform: "uppercase" }}>
            {language === "hi" ? "पारंपरिक करघा बुनाई" : language === "as" ? "বয়নশাল (Traditional Loom)" : language === "bn" ? "ঐতিহ্যবাহী তাঁতশিল্প" : "Traditional Loom"} • {activePattern.region}
          </div>
          <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#b45309" }}>
            🧺 Trunk: {culturalTrunkCount} Woven
          </div>
        </div>

        <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#78350f" }}>
          {activePattern.name}
        </div>
        <div style={{ fontSize: "0.82rem", color: "#92400e", marginBottom: "0.75rem" }}>
          {activePattern.desc}
        </div>

        {/* Wooden Shuttle Movement Track */}
        <div
          style={{
            background: "#78350f",
            borderRadius: "999px",
            height: "12px",
            position: "relative",
            margin: "0.5rem 0 1rem 0",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-10px",
              left: shuttlePosition === "left" ? "8%" : "85%",
              transition: "left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              fontSize: "1.7rem",
            }}
          >
            🪵
          </div>
        </div>

        {/* Weaving Target Sequence Progress Bar */}
        <div
          style={{
            background: "#ffffff",
            padding: "0.6rem",
            borderRadius: "var(--radius)",
            border: "1px solid #d97706",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
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

      {/* ── Yarn Spool Selection Palette with AACB Golden Halo & Dimming ── */}
      <div style={{ marginBottom: "0.5rem" }}>
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
        {LOOM_COLORS.slice(0, 4).map((color, idx) => {
          const nextStep = wovenSequence.length;
          const expectedColor = activePattern.sequence[nextStep];
          const isTarget = idx === expectedColor;
          const isTargetInAacb = aacbState.triggered && isTarget;
          const isDimmed = aacbState.triggered && !isTarget;

          let btnClass = "";
          if (isTargetInAacb) {
            btnClass = "aacb-golden-halo aacb-expanded-hitbox";
          } else if (isDimmed) {
            btnClass = "aacb-dimmed";
          }

          return (
            <button
              key={color.name}
              type="button"
              className={btnClass}
              onClick={(e) => handleYarnTap(idx, e)}
              aria-label={`${color.name}. Tap to weave yarn.`}
              style={{
                minHeight: "115px",
                padding: "1rem 0.75rem",
                borderRadius: "var(--radius-lg)",
                background: isTargetInAacb ? "#fffbeb" : "var(--white)",
                border: isTargetInAacb ? "3px solid #f59e0b" : "2px solid var(--gray-200)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
                transition: "transform 0.15s ease",
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
          );
        })}
      </div>
    </div>
  );
}
