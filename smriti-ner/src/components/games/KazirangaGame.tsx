// ── SMRITI-NER GAME 2: KAZIRANGA SAFARI SEARCH (কাজিৰঙা চাফাৰী সন্ধান) ─────────
// Sub-Phase 4.4: Grassland camouflage visual search, 5 indigenous fauna & telemetry

"use client";

import React, { useState, useEffect, useRef } from "react";
import type { ScreenId } from "@/lib/types";
import { ANIMALS } from "@/lib/constants";
import { playSuccessJingle, playGentleChime, playBeep } from "@/lib/audio";
import { evaluateAACB, decomposeLatency } from "@/lib/dcdaEngine";
import { sessionManager } from "@/lib/gameSessionManager";
import { type DifficultyTier, getTierConfig } from "@/lib/difficultyStateMachine";

interface Props {
  navigate: (target: ScreenId) => void;
  showSuccess: (time: string, accuracy: string, onNext?: () => void) => void;
}

export default function KazirangaGame({ navigate, showSuccess }: Props) {
  const [tier, setTier] = useState<DifficultyTier>(2);
  const tierConfig = getTierConfig(tier);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);
  const [aacbActive, setAacbActive] = useState<boolean>(false);

  const startTimeRef = useRef<number>(Date.now());
  const questionStartRef = useRef<number>(Date.now());
  const consecutiveErrorsRef = useRef<number>(0);

  // Target animal rotates through 5 indigenous species
  const targetAnimal = ANIMALS[currentIndex % ANIMALS.length];
  // Options count adapts to tier (Tier 1 = 2, Tier 2 = 3, Tier 3+ = 4)
  const optionsCount = Math.min(ANIMALS.length, Math.max(2, tierConfig.choiceCount));
  const options = ANIMALS.slice(0, optionsCount);

  // Initialize session on mount
  useEffect(() => {
    sessionManager.startSession({
      gameId: "kaziranga",
      conceptId: "visuospatial_fauna_search",
      initialTier: tier,
    });
    startTimeRef.current = Date.now();
    questionStartRef.current = Date.now();
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
      consecutiveErrorsRef.current = 0;
      setAacbActive(false);

      setFeedback({
        isCorrect: true,
        msg: `Excellent! ${targetAnimal.trivia}`,
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
      // Error detected
      playBeep(260, 150);
      consecutiveErrorsRef.current += 1;

      const aacb = evaluateAACB(consecutiveErrorsRef.current, latency.deliberationLatencyMs);
      if (aacb.triggered) {
        setAacbActive(true);
      }

      setFeedback({
        isCorrect: false,
        msg: aacb.triggered
          ? `Compassionate Hint: Look for the golden glowing ${targetAnimal.name} (${targetAnimal.native})`
          : `Take your time! Look for the ${targetAnimal.name} (${targetAnimal.native}).`,
      });
      setTimeout(() => setFeedback(null), 2400);
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
            Kaziranga Safari Search
          </h2>
          <span style={{ fontSize: "0.75rem", color: "#15803d", fontWeight: 700 }}>
            {tierConfig.nativeName} • Animal {(currentIndex % 3) + 1} of 3
          </span>
        </div>

        <div style={{ width: 44 }} />
      </div>

      {/* ── Grassland Camouflage Canvas ── */}
      <div
        style={{
          background: "linear-gradient(180deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)",
          border: "2px solid #6ee7b7",
          borderRadius: "var(--radius-xl)",
          padding: "1.5rem 1.25rem",
          marginBottom: "1.25rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
        }}
      >
        {/* Camouflage foliage reeds decoration */}
        <div style={{ position: "absolute", top: 10, left: 15, fontSize: "1.75rem", opacity: 0.6, pointerEvents: "none" }}>
          🌾
        </div>
        <div style={{ position: "absolute", top: 15, right: 20, fontSize: "1.75rem", opacity: 0.6, pointerEvents: "none" }}>
          🌿
        </div>
        <div style={{ position: "absolute", bottom: 10, left: "45%", fontSize: "1.5rem", opacity: 0.5, pointerEvents: "none" }}>
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
            fontSize: "1.45rem",
            fontWeight: 800,
            color: "#064e3b",
            margin: "0 0 0.4rem 0",
          }}
        >
          Spot the {targetAnimal.name}
        </h3>

        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#047857" }}>
          বিচৰা প্ৰাণী: {targetAnimal.native}
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
            marginBottom: "1.25rem",
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

      {/* ── Fauna Option Cards ── */}
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
          const isTargetInAacb = aacbActive && animal.id === targetAnimal.id;
          const isDimmed = aacbActive && animal.id !== targetAnimal.id;

          return (
            <button
              key={animal.id}
              type="button"
              onClick={(e) => handleSelect(animal.id, e)}
              aria-label={`${animal.name} (${animal.native}). Tap to select.`}
              style={{
                minHeight: "135px",
                padding: "1rem 0.75rem",
                borderRadius: "var(--radius-lg)",
                background: isSelected
                  ? isCorrectSelection(animal.id, targetAnimal.id)
                    ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)"
                    : "#fee2e2"
                  : isTargetInAacb
                  ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
                  : "var(--white)",
                border: isTargetInAacb
                  ? "3px solid #f59e0b"
                  : isSelected
                  ? isCorrectSelection(animal.id, targetAnimal.id)
                    ? "3px solid #16a34a"
                    : "3px solid #dc2626"
                  : "2px solid var(--gray-200)",
                opacity: isDimmed ? 0.45 : 1.0,
                boxShadow: isTargetInAacb
                  ? "0 0 20px rgba(245, 158, 11, 0.45)"
                  : "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
                transform: isSelected || isTargetInAacb ? "scale(1.04)" : "scale(1)",
                outline: "none",
              }}
            >
              <span style={{ fontSize: "2.5rem" }}>{animal.emoji}</span>
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

function isCorrectSelection(selectedId: string, targetId: string): boolean {
  return selectedId === targetId;
}
