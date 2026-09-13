"use client";

import { useState, useRef } from "react";
import type { ScreenId } from "@/lib/types";
import { ANIMALS } from "@/lib/constants";
import { playSuccessJingle, playGentleChime, playBeep } from "@/lib/audio";
import { evaluateAACB, decomposeLatency } from "@/lib/dcdaEngine";

interface Props {
  navigate: (target: ScreenId) => void;
  showSuccess: (time: string, accuracy: string, onNext?: () => void) => void;
}

export default function KazirangaGame({ navigate, showSuccess }: Props) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);
  const [aacbActive, setAacbActive] = useState<boolean>(false);

  const startTimeRef = useRef<number>(Date.now());
  const questionStartRef = useRef<number>(Date.now());
  const consecutiveErrorsRef = useRef<number>(0);

  const targetAnimal = ANIMALS[currentIndex % ANIMALS.length];
  const options = ANIMALS.slice(0, 4);

  const handleSelect = (animalId: string) => {
    setSelectedAnimalId(animalId);
    const totalReactionTime = Date.now() - questionStartRef.current;
    const latency = decomposeLatency(totalReactionTime, 1.12);

    if (animalId === targetAnimal.id) {
      playGentleChime();
      consecutiveErrorsRef.current = 0;
      setAacbActive(false);

      setFeedback({
        isCorrect: true,
        msg: `Excellent! ${targetAnimal.trivia}`
      });

      setTimeout(() => {
        if (currentIndex >= 2) {
          playSuccessJingle();
          const elapsedSec = Math.round((Date.now() - startTimeRef.current) / 1000);
          showSuccess(`${elapsedSec}s`, "100%", () => {
            setCurrentIndex(0);
            setSelectedAnimalId(null);
            setFeedback(null);
            startTimeRef.current = Date.now();
            questionStartRef.current = Date.now();
          });
        } else {
          setCurrentIndex((idx) => idx + 1);
          setSelectedAnimalId(null);
          setFeedback(null);
          questionStartRef.current = Date.now();
        }
      }, 1800);
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
          ? `Compassionate Hint: Look for the golden highlighted ${targetAnimal.name} (${targetAnimal.native})`
          : `Take your time! Spot the ${targetAnimal.name} (${targetAnimal.native}).`
      });
      setTimeout(() => setFeedback(null), 2400);
    }
  };

  return (
    <div style={{
      padding: "1.25rem 1.25rem 5rem",
      backgroundColor: "var(--white)",
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Top Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1rem",
        paddingBottom: "0.75rem",
        borderBottom: "1px solid var(--gray-200)"
      }}>
        <button
          onClick={() => navigate("games")}
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

        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--gray-900)" }}>
            Kaziranga Safari
          </h2>
          <span style={{ fontSize: "0.75rem", color: aacbActive ? "#d97706" : "var(--green)", fontWeight: 700 }}>
            Question {currentIndex + 1} of 3 • {aacbActive ? "AACB Clutter Reduction" : "Visual Search"}
          </span>
        </div>

        <div style={{ width: 40 }} />
      </div>

      {/* Target Clue Box */}
      <div style={{
        background: aacbActive ? "#fefce8" : "#f0fdf4",
        border: `1.5px solid ${aacbActive ? "#fef08a" : "#bbf7d0"}`,
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem",
        textAlign: "center",
        marginBottom: "1.25rem",
        boxShadow: "var(--shadow-sm)",
        transition: "all var(--transition)"
      }}>
        <span style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: aacbActive ? "#854d0e" : "#166534",
          textTransform: "uppercase",
          letterSpacing: "0.06em"
        }}>
          Which animal is this?
        </span>
        <div style={{
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "var(--gray-900)",
          marginTop: "0.25rem"
        }}>
          {targetAnimal.name}
        </div>
        <div style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--accent)",
          marginTop: "0.15rem"
        }}>
          {targetAnimal.native}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div style={{
          padding: "0.85rem 1rem",
          borderRadius: "var(--radius)",
          background: feedback.isCorrect ? "#ecfdf5" : "#fefce8",
          border: `1px solid ${feedback.isCorrect ? "#6ee7b7" : "#fef08a"}`,
          color: feedback.isCorrect ? "#065f46" : "#854d0e",
          fontSize: "0.88rem",
          fontWeight: 600,
          textAlign: "center",
          marginBottom: "1.25rem"
        }}>
          {feedback.msg}
        </div>
      )}

      {/* 2x2 Animal Choice Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        flex: 1,
        alignContent: "center",
        maxWidth: "380px",
        margin: "0 auto",
        width: "100%"
      }}>
        {options.map((animal) => {
          const isSelected = selectedAnimalId === animal.id;
          const isTarget = animal.id === targetAnimal.id;
          const isDistractorInAacb = aacbActive && !isTarget;
          const isTargetInAacb = aacbActive && isTarget;

          return (
            <button
              key={animal.id}
              onClick={() => handleSelect(animal.id)}
              style={{
                aspectRatio: "1",
                minHeight: "130px",
                background: isTargetInAacb
                  ? "#fef9c3"
                  : isSelected && isTarget
                  ? "#dcfce7"
                  : "var(--white)",
                border: isTargetInAacb
                  ? "3.5px solid #d97706"
                  : isSelected && isTarget
                  ? "3px solid var(--green)"
                  : "2px solid var(--gray-200)",
                borderRadius: "var(--radius-xl)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: "pointer",
                boxShadow: isTargetInAacb
                  ? "0 0 24px rgba(217, 119, 6, 0.45)"
                  : isSelected
                  ? "var(--shadow-md)"
                  : "var(--shadow-sm)",
                opacity: isDistractorInAacb ? 0.40 : 1,
                transform: isTargetInAacb ? "scale(1.04)" : "none",
                transition: "all var(--transition)"
              }}
            >
              <span style={{ fontSize: "3.2rem" }}>{animal.emoji}</span>
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--gray-800)" }}>
                {animal.name}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{
        marginTop: "1.5rem",
        textAlign: "center",
        fontSize: "0.75rem",
        color: "var(--gray-400)"
      }}>
        Clinical Domain: Category Naming & Visual Attention (MoCA / LASI Proxy)
      </div>
    </div>
  );
}
