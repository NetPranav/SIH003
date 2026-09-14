// ── SMRITI-NER GAME 2: KAZIRANGA SAFARI SEARCH (কাজিৰঙা চাফাৰী সন্ধান) ─────────
// Sub-Phase 4.5: Grassland visual search with unified AACB de-escalation,
// golden halo guidance, family voice prompts, and zero failure sounds.

"use client";

import React, { useState, useEffect, useRef } from "react";
import type { ScreenId } from "@/lib/types";
import { getLocalizedAnimals } from "@/lib/constants";
import { GAMES_SCREEN_LOCALES } from "@/lib/screenLocalizations";
import { playSuccessJingle, playGentleChime, playNeutralTap } from "@/lib/audio";
import { decomposeLatency } from "@/lib/dcdaEngine";
import { sessionManager } from "@/lib/gameSessionManager";
import { type DifficultyTier, getTierConfig } from "@/lib/difficultyStateMachine";
import { aacbEngine, type AACBState } from "@/lib/aacbEngine";
import AACBBanner from "@/components/ui/AACBBanner";

interface Props {
  navigate: (target: ScreenId) => void;
  showSuccess: (time: string, accuracy: string, onNext?: () => void) => void;
  language?: string;
}

export default function KazirangaGame({ navigate, showSuccess, language = "en" }: Props) {
  const loc = GAMES_SCREEN_LOCALES[language] || GAMES_SCREEN_LOCALES.en;

  const [tier, setTier] = useState<DifficultyTier>(2);
  const tierConfig = getTierConfig(tier);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);
  const [aacbState, setAacbState] = useState<AACBState>(aacbEngine.getState());

  const startTimeRef = useRef<number>(Date.now());
  const questionStartRef = useRef<number>(Date.now());

  // Target animal rotates through 5 indigenous species with active language localization
  const allAnimals = getLocalizedAnimals(language);
  const targetAnimal = allAnimals[currentIndex % allAnimals.length];
  // Options count adapts to tier (Tier 1 = 2, Tier 2 = 3, Tier 3+ = 4)
  const optionsCount = Math.min(allAnimals.length, Math.max(2, tierConfig.choiceCount));
  const options = allAnimals.slice(0, optionsCount);

  // Subscribe to AACB engine
  useEffect(() => {
    const unsubscribe = aacbEngine.subscribe((state) => {
      setAacbState(state);
    });

    sessionManager.startSession({
      gameId: "kaziranga",
      conceptId: "visuospatial_fauna_search",
      initialTier: tier,
    });
    startTimeRef.current = Date.now();
    questionStartRef.current = Date.now();

    return () => {
      unsubscribe();
      aacbEngine.reset();
    };
  }, []);

  const handleSelect = (animalId: string, e?: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedAnimalId(animalId);
    const totalReactionTime = Date.now() - questionStartRef.current;
    const latency = decomposeLatency(totalReactionTime, 1.12);

    const isCorrect = animalId === targetAnimal.id;

    // Record interaction in Shared Game Framework
    try {
      const touchCoords = e ? { x: e.clientX, y: e.clientY } : undefined;
      const targetRect = e?.currentTarget.getBoundingClientRect();
      const targetCenter = targetRect
        ? { x: Math.round(targetRect.left + targetRect.width / 2), y: Math.round(targetRect.top + targetRect.height / 2) }
        : undefined;

      const { session } = sessionManager.recordInteraction({
        targetId: targetAnimal.id,
        selectedId: animalId,
        totalReactionTimeMs: totalReactionTime,
        touchCoordinates: touchCoords,
        targetCenter,
      });

      setTier(session.currentTier);
    } catch {
      // fallback
    }

    if (isCorrect) {
      playGentleChime();
      aacbEngine.recordSuccess();

      const praiseWord = language === "hi" ? "बहुत बढ़िया!" : language === "as" ? "সাঁচাকৈয়ে সুন্দৰ!" : language === "bn" ? "খুব সুন্দর!" : "Wonderful!";
      setFeedback({
        isCorrect: true,
        msg: `${praiseWord} ${targetAnimal.trivia}`,
      });

      setTimeout(() => {
        if (currentIndex >= 2) {
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
            setCurrentIndex(0);
            setSelectedAnimalId(null);
            setFeedback(null);
            startTimeRef.current = Date.now();
            questionStartRef.current = Date.now();
            sessionManager.startSession({
              gameId: "kaziranga",
              conceptId: "visuospatial_fauna_search",
              initialTier: tier,
            });
          });
        } else {
          setCurrentIndex((idx) => idx + 1);
          setSelectedAnimalId(null);
          setFeedback(null);
          questionStartRef.current = Date.now();
        }
      }, 1600);
    } else {
      // Error detected: Zero failure sound, record in AACB engine
      playNeutralTap();

      aacbEngine.recordError({
        gameId: "kaziranga",
        targetId: targetAnimal.id,
        deliberationMs: latency.deliberationLatencyMs,
        language: "as",
      });

      setFeedback({
        isCorrect: false,
        msg: `অকণো চিন্তা নকৰিব, লক্ষ্য কৰক: ${targetAnimal.name} (${targetAnimal.native})`,
      });
      setTimeout(() => setFeedback(null), 2500);
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
            {loc.kaziranga.native}
          </h2>
          <span style={{ fontSize: "0.82rem", color: "var(--green)", fontWeight: 700 }}>
            {loc.kaziranga.name} • {language === "hi" ? `वन्यजीव ${currentIndex + 1}/3` : language === "as" ? `প্ৰাণী ${currentIndex + 1}/৩` : language === "bn" ? `প্রাণী ${currentIndex + 1}/৩` : `Animal ${currentIndex + 1} of 3`}
          </span>
        </div>

        <div
          style={{
            background: aacbState.triggered ? "#fef3c7" : "#dcfce7",
            border: `1.5px solid ${aacbState.triggered ? "#fde68a" : "#bbf7d0"}`,
            borderRadius: "var(--radius)",
            padding: "0.35rem 0.65rem",
            fontSize: "0.82rem",
            fontWeight: 800,
            color: aacbState.triggered ? "#92400e" : "#166534",
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

      {/* ── Grassland Camouflage Mission Canvas ── */}
      <div
        style={{
          background: "linear-gradient(145deg, #ecfdf5 0%, #d1fae5 50%, #fef3c7 100%)",
          border: "2px solid #a7f3d0",
          borderRadius: "var(--radius-xl)",
          padding: "1.25rem 1rem",
          marginBottom: "1rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
        }}
      >
        {/* Camouflage foliage reeds decoration */}
        <div
          className={aacbState.triggered ? "aacb-dimmed" : undefined}
          style={{ position: "absolute", top: 10, left: 15, fontSize: "1.75rem", opacity: 0.6, pointerEvents: "none" }}
        >
          🌾
        </div>
        <div
          className={aacbState.triggered ? "aacb-dimmed" : undefined}
          style={{ position: "absolute", top: 15, right: 20, fontSize: "1.75rem", opacity: 0.6, pointerEvents: "none" }}
        >
          🌿
        </div>
        <div
          className={aacbState.triggered ? "aacb-dimmed" : undefined}
          style={{ position: "absolute", bottom: 10, left: "45%", fontSize: "1.5rem", opacity: 0.5, pointerEvents: "none" }}
        >
          🌾
        </div>

        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#065f46",
            background: "#ffffff",
            padding: "0.3rem 0.75rem",
            borderRadius: "999px",
            display: "inline-block",
            marginBottom: "0.75rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          🔍 Safari Mission (চাফাৰী লক্ষ্য)
        </span>

        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "#065f46",
            margin: "0 0 0.4rem 0",
          }}
        >
          {language === "hi" ? `पहचानें: ${targetAnimal.name}` : language === "as" ? `${targetAnimal.name} বিচাৰক` : language === "bn" ? `${targetAnimal.name} খুঁজুন` : `Spot the ${targetAnimal.name}`}
        </h3>

        <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#047857" }}>
          {language === "hi" ? "खोजने वाला वन्यजीव: " : language === "as" ? "বিচৰা প্ৰাণী: " : language === "bn" ? "খোঁজার প্রাণী: " : "Target Animal: "}{targetAnimal.native}
        </div>
      </div>

      {/* ── Feedback Message Banner ── */}
      {feedback && (
        <div
          style={{
            background: feedback.isCorrect ? "#f0fdf4" : "#fffbeb",
            border: `1.5px solid ${feedback.isCorrect ? "#86efac" : "#fde68a"}`,
            borderRadius: "var(--radius-lg)",
            padding: "0.85rem 1rem",
            marginBottom: "1rem",
            textAlign: "center",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: feedback.isCorrect ? "#166534" : "#92400e",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {feedback.msg}
        </div>
      )}

      {/* ── Fauna Option Cards with AACB Golden Halo & Dimming ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          flex: 1,
          alignContent: "center",
        }}
      >
        {options.map((animal) => {
          const isSelected = selectedAnimalId === animal.id;
          const isTarget = animal.id === targetAnimal.id;
          const isTargetInAacb = aacbState.triggered && isTarget;
          const isDimmed = aacbState.triggered && !isTarget;

          let cardClass = "";
          if (isTargetInAacb) {
            cardClass = "aacb-golden-halo aacb-expanded-hitbox";
          } else if (isDimmed) {
            cardClass = "aacb-dimmed";
          }

          return (
            <button
              key={animal.id}
              type="button"
              className={cardClass}
              onClick={(e) => handleSelect(animal.id, e)}
              aria-label={`${animal.name} (${animal.native}). Tap to select.`}
              style={{
                minHeight: "135px",
                padding: "1rem 0.75rem",
                borderRadius: "var(--radius-lg)",
                background: isSelected
                  ? isTarget
                    ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)"
                    : "#fff7ed"
                  : isTargetInAacb
                  ? "#fffbeb"
                  : "var(--white)",
                border: isTargetInAacb
                  ? "3px solid #f59e0b"
                  : isSelected && isTarget
                  ? "3px solid #16a34a"
                  : "2px solid var(--gray-200)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "var(--shadow-sm)",
                outline: "none",
              }}
            >
              <span style={{ fontSize: "2.6rem" }}>{animal.emoji}</span>
              <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gray-900)" }}>
                {animal.native}
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--gray-500)", fontWeight: 600 }}>
                {animal.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
