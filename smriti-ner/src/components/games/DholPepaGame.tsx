// ── SMRITI-NER GAME 1: DHOL-PEPA SUR-MILON (ঢোল-পেঁপা সুৰ-মিলন) ───────────────
// Sub-Phase 4.4: 6-Instrument Web Audio synthesis, adaptive tier grid & telemetry

"use client";

import React, { useState, useEffect, useRef } from "react";
import type { ScreenId } from "@/lib/types";
import { INSTRUMENTS } from "@/lib/constants";
import { playInstrumentSound, playSuccessJingle, playGentleChime } from "@/lib/audio";
import { decomposeLatency, evaluateAACB, updateBKT, type BKTState } from "@/lib/dcdaEngine";
import { sessionManager } from "@/lib/gameSessionManager";
import { getTierConfig, type DifficultyTier } from "@/lib/difficultyStateMachine";
import ElderCard from "@/components/ui/ElderCard";

interface Props {
  navigate: (target: ScreenId) => void;
  showSuccess: (time: string, accuracy: string, onNext?: () => void) => void;
}

export default function DholPepaGame({ navigate, showSuccess }: Props) {
  // Current difficulty tier (1 through 5)
  const [tier, setTier] = useState<DifficultyTier>(2);
  const tierConfig = getTierConfig(tier);

  // Active instruments count adapts to difficulty tier (2 to 6 instruments)
  const activeInstruments = INSTRUMENTS.slice(0, Math.min(INSTRUMENTS.length, Math.max(2, tierConfig.choiceCount)));

  const [sequence, setSequence] = useState<number[]>([0, 1]);
  const [playerStep, setPlayerStep] = useState<number>(0);
  const [isPlayingSeq, setIsPlayingSeq] = useState<boolean>(false);
  const [activeHighlight, setActiveHighlight] = useState<number | null>(null);
  const [round, setRound] = useState<number>(1);
  const [statusMsg, setStatusMsg] = useState<string>("Listen to the folk rhythm...");
  const [aacbStatus, setAacbStatus] = useState<{
    triggered: boolean;
    goldenHaloActive: boolean;
    guidanceMessage?: string;
  }>({ triggered: false, goldenHaloActive: false });

  // DCDA Telemetry & BKT
  const [bkt, setBkt] = useState<BKTState>({
    conceptId: "auditory_folk_rhythm",
    pLearned: 0.65,
    pTransition: 0.08,
    pGuess: 0.25,
    pSlip: 0.18,
    lastUpdated: new Date().toISOString(),
  });

  const startTimeRef = useRef<number>(Date.now());
  const tapStartRef = useRef<number>(Date.now());
  const consecutiveErrorsRef = useRef<number>(0);

  // Initialize session on mount
  useEffect(() => {
    sessionManager.startSession({
      gameId: "dhol-pepa",
      conceptId: "auditory_folk_rhythm",
      initialTier: tier,
    });
  }, []);

  // Play sequence on load or round start
  useEffect(() => {
    playPattern(sequence);
  }, [round]);

  const playPattern = async (seq: number[]) => {
    setIsPlayingSeq(true);
    setStatusMsg("Listen closely to the instruments...");
    await new Promise((r) => setTimeout(r, 600));

    for (let i = 0; i < seq.length; i++) {
      const instIndex = seq[i];
      setActiveHighlight(instIndex);
      const inst = activeInstruments[instIndex] || activeInstruments[0];
      playInstrumentSound(inst.freq, inst.waveType, 320);
      await new Promise((r) => setTimeout(r, 480));
      setActiveHighlight(null);
      await new Promise((r) => setTimeout(r, 220));
    }

    setIsPlayingSeq(false);
    setStatusMsg("Now your turn: tap the matching instruments in rhythm!");
    setPlayerStep(0);
    tapStartRef.current = Date.now();
  };

  const handleInstrumentTap = (idx: number, e?: React.MouseEvent<HTMLButtonElement>) => {
    if (isPlayingSeq) return;

    // Bi-Factor Latency Decomposition
    const totalReactionTime = Date.now() - tapStartRef.current;
    const simulatedWander = 1.15;
    const latencyReport = decomposeLatency(totalReactionTime, simulatedWander);

    // Play tapped sound
    const inst = activeInstruments[idx];
    playInstrumentSound(inst.freq, inst.waveType, 260);

    // Visual feedback
    setActiveHighlight(idx);
    setTimeout(() => setActiveHighlight(null), 250);

    const expectedIdx = sequence[playerStep];
    const isMatch = idx === expectedIdx;

    // Record interaction in Shared Game Framework
    try {
      const touchCoords = e ? { x: e.clientX, y: e.clientY } : undefined;
      const targetRect = e?.currentTarget.getBoundingClientRect();
      const targetCenter = targetRect
        ? { x: Math.round(targetRect.left + targetRect.width / 2), y: Math.round(targetRect.top + targetRect.height / 2) }
        : undefined;

      const { session } = sessionManager.recordInteraction({
        targetId: String(expectedIdx),
        selectedId: String(idx),
        totalReactionTimeMs: totalReactionTime,
        touchCoordinates: touchCoords,
        targetCenter,
      });

      setTier(session.currentTier);
    } catch {
      // Graceful fallback
    }

    if (isMatch) {
      // Correct tap!
      consecutiveErrorsRef.current = 0;
      setBkt((prev) => updateBKT(prev, true));
      setAacbStatus({ triggered: false, goldenHaloActive: false });

      const nextStep = playerStep + 1;
      setPlayerStep(nextStep);

      if (nextStep === sequence.length) {
        // Round completed successfully!
        playGentleChime();
        const elapsedSec = Math.round((Date.now() - startTimeRef.current) / 1000);

        if (round >= 3) {
          playSuccessJingle();
          let summaryAccuracy = 100;
          let summaryDuration = elapsedSec;
          try {
            const summary = sessionManager.endSession();
            summaryAccuracy = summary.accuracy;
            summaryDuration = summary.durationSeconds;
          } catch {
            // fallback
          }

          showSuccess(`${summaryDuration}s`, `${summaryAccuracy}%`, () => {
            setRound(1);
            setSequence([0, 1]);
            startTimeRef.current = Date.now();
            sessionManager.startSession({
              gameId: "dhol-pepa",
              conceptId: "auditory_folk_rhythm",
              initialTier: tier,
            });
          });
        } else {
          setStatusMsg("Wonderful! Get ready for next sequence...");
          setTimeout(() => {
            setRound((r) => r + 1);
            const nextSeq = [...sequence, Math.floor(Math.random() * activeInstruments.length)];
            setSequence(nextSeq);
          }, 1200);
        }
      } else {
        tapStartRef.current = Date.now();
      }
    } else {
      // Error detected: Evaluate Anti-Agitation Circuit Breaker (AACB)
      consecutiveErrorsRef.current += 1;
      setBkt((prev) => updateBKT(prev, false));

      const aacbEval = evaluateAACB(
        consecutiveErrorsRef.current,
        latencyReport.deliberationLatencyMs
      );

      setAacbStatus({
        triggered: aacbEval.triggered,
        goldenHaloActive: aacbEval.goldenHaloActive,
        guidanceMessage: aacbEval.guidanceMessage,
      });

      if (aacbEval.triggered) {
        setStatusMsg("Gentle guidance active: Follow the golden glowing instrument");
      } else {
        setStatusMsg("Take your time — listen again!");
      }
    }
  };

  const repeatPattern = () => {
    if (!isPlayingSeq) {
      playPattern(sequence);
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
      {/* ── Top Bar with Back Navigation & Cognitive Tier Badge ── */}
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
            Dhol-Pepa Sur-Milon
          </h2>
          <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700 }}>
            {tierConfig.nativeName} • Round {round} of 3
          </span>
        </div>

        <button
          type="button"
          onClick={repeatPattern}
          disabled={isPlayingSeq}
          aria-label="Repeat Rhythm Sequence"
          style={{
            background: "#eff6ff",
            border: "1.5px solid #bfdbfe",
            borderRadius: "999px",
            padding: "0.4rem 0.75rem",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#1d4ed8",
            cursor: isPlayingSeq ? "not-allowed" : "pointer",
          }}
        >
          🔁 Repeat
        </button>
      </div>

      {/* ── Guidance & Reassurance Banner ── */}
      <div
        style={{
          background: aacbStatus.triggered ? "#fffbeb" : "#f8fafc",
          border: `1.5px solid ${aacbStatus.triggered ? "#fde68a" : "var(--gray-200)"}`,
          borderRadius: "var(--radius-lg)",
          padding: "0.85rem 1rem",
          marginBottom: "1.25rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.95rem",
            fontWeight: 700,
            color: aacbStatus.triggered ? "#92400e" : "var(--gray-700)",
          }}
        >
          {statusMsg}
        </p>

        {aacbStatus.triggered && (
          <span style={{ fontSize: "0.75rem", color: "#b45309", marginTop: "0.25rem", display: "inline-block" }}>
            ✨ Compassionate Guidance: We’ve highlighted the correct folk instrument for you.
          </span>
        )}
      </div>

      {/* ── 6-Instrument Responsive Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: activeInstruments.length <= 4 ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: "0.85rem",
          flex: 1,
          alignContent: "center",
        }}
      >
        {activeInstruments.map((inst, idx) => {
          const isHighlighted = activeHighlight === idx;
          const isTargetInAacb = aacbStatus.goldenHaloActive && sequence[playerStep] === idx;

          return (
            <button
              key={inst.id}
              type="button"
              onClick={(e) => handleInstrumentTap(idx, e)}
              disabled={isPlayingSeq}
              aria-label={`${inst.name} (${inst.native}). Tap to play sound.`}
              style={{
                minHeight: activeInstruments.length <= 4 ? "140px" : "110px",
                padding: "1rem 0.75rem",
                borderRadius: "var(--radius-lg)",
                background: isHighlighted
                  ? "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)"
                  : isTargetInAacb
                  ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
                  : "var(--white)",
                border: isTargetInAacb
                  ? "3px solid #f59e0b"
                  : isHighlighted
                  ? "3px solid #2563eb"
                  : "2px solid var(--gray-200)",
                boxShadow: isHighlighted || isTargetInAacb
                  ? "0 10px 20px -3px rgba(37, 99, 235, 0.25)"
                  : "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
                cursor: isPlayingSeq ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
                transform: isHighlighted ? "scale(1.05)" : "scale(1)",
                outline: "none",
              }}
            >
              <span style={{ fontSize: activeInstruments.length <= 4 ? "2.5rem" : "2rem" }}>
                {inst.emoji}
              </span>
              <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gray-900)" }}>
                {inst.native}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 600 }}>
                {inst.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Sequence Progress Dots ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.6rem",
          marginTop: "1.5rem",
        }}
      >
        {sequence.map((_, sIdx) => {
          const isDone = sIdx < playerStep;
          const isCurrent = sIdx === playerStep;

          return (
            <div
              key={sIdx}
              style={{
                width: isCurrent ? 24 : 12,
                height: 12,
                borderRadius: "999px",
                backgroundColor: isDone ? "var(--green)" : isCurrent ? "var(--primary)" : "var(--gray-300)",
                transition: "all 0.2s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
