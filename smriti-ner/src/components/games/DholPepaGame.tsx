// ── SMRITI-NER GAME 1: DHOL-PEPA SUR-MILON (ঢোল-পেঁপা সুৰ-মিলন) ───────────────
// Sub-Phase 4.5: 6-Instrument Web Audio synthesis, adaptive tier grid,
// unified AACB de-escalation, golden halo guidance, and zero failure sounds.

"use client";

import React, { useState, useEffect, useRef } from "react";
import type { ScreenId } from "@/lib/types";
import { getLocalizedInstruments } from "@/lib/constants";
import { GAMES_SCREEN_LOCALES } from "@/lib/screenLocalizations";
import { playInstrumentSound, playSuccessJingle, playGentleChime, playNeutralTap } from "@/lib/audio";
import { decomposeLatency, updateBKT, type BKTState } from "@/lib/dcdaEngine";
import { sessionManager } from "@/lib/gameSessionManager";
import { getTierConfig, type DifficultyTier } from "@/lib/difficultyStateMachine";
import { aacbEngine, type AACBState } from "@/lib/aacbEngine";
import ElderCard from "@/components/ui/ElderCard";
import AACBBanner from "@/components/ui/AACBBanner";

interface Props {
  navigate: (target: ScreenId) => void;
  showSuccess: (time: string, accuracy: string, onNext?: () => void) => void;
  language?: string;
}

export default function DholPepaGame({ navigate, showSuccess, language = "en" }: Props) {
  const loc = GAMES_SCREEN_LOCALES[language] || GAMES_SCREEN_LOCALES.en;

  // Current difficulty tier (1 through 5)
  const [tier, setTier] = useState<DifficultyTier>(2);
  const tierConfig = getTierConfig(tier);

  // Active instruments count adapts to difficulty tier (2 to 6 instruments)
  const allInstruments = getLocalizedInstruments(language);
  const activeInstruments = allInstruments.slice(0, Math.min(allInstruments.length, Math.max(2, tierConfig.choiceCount)));

  const [sequence, setSequence] = useState<number[]>([0, 1]);
  const [playerStep, setPlayerStep] = useState<number>(0);
  const [isPlayingSeq, setIsPlayingSeq] = useState<boolean>(false);
  const [activeHighlight, setActiveHighlight] = useState<number | null>(null);
  const [round, setRound] = useState<number>(1);
  const [statusMsg, setStatusMsg] = useState<string>("Listen to the folk rhythm...");
  const [aacbState, setAacbState] = useState<AACBState>(aacbEngine.getState());

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

  // Subscribe to AACB engine
  useEffect(() => {
    const unsubscribe = aacbEngine.subscribe((state) => {
      setAacbState(state);
    });

    sessionManager.startSession({
      gameId: "dhol-pepa",
      conceptId: "auditory_folk_rhythm",
      initialTier: tier,
    });

    return () => {
      unsubscribe();
      aacbEngine.reset();
    };
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
      playInstrumentSound(inst.id, inst.waveType, 350);
      await new Promise((r) => setTimeout(r, 480));
      setActiveHighlight(null);
      await new Promise((r) => setTimeout(r, 220));
    }

    setIsPlayingSeq(false);
    setStatusMsg(language === "hi" ? "अब आपकी बारी: उसी ताल में वाद्यों को छुएं!" : language === "as" ? "এতিয়া আপোনাৰ পাল: তাল অনুসৰি বাদ্যবোৰ স্পৰ্শ কৰক!" : language === "bn" ? "এবার আপনার পালা: একই ছন্দে বাদ্যযন্ত্রে ট্যাপ করুন!" : "Now your turn: tap the matching instruments in rhythm!");
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
    playInstrumentSound(inst.id, inst.waveType, 320);

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
      // Correct tap! Reset AACB
      setBkt((prev) => updateBKT(prev, true));
      aacbEngine.recordSuccess();

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
      // Miss detected: Zero failure buzzer, record in AACB engine
      playNeutralTap();
      setBkt((prev) => updateBKT(prev, false));

      const updated = aacbEngine.recordError({
        gameId: "dhol-pepa",
        targetId: String(expectedIdx),
        deliberationMs: latencyReport.deliberationLatencyMs,
        language: "as",
      });

      if (updated.triggered) {
        setStatusMsg("মৰমৰ সহায়: সোণালী ৰঙেৰে জিলিকা বাদ্যটো স্পৰ্শ কৰক");
      } else {
        setStatusMsg("ধীৰে সুস্থে কৰক — পুনৰ শুনক!");
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
            {loc.dhol.native}
          </h2>
          <span style={{ fontSize: "0.82rem", color: "#d97706", fontWeight: 700 }}>
            {loc.dhol.name} • Round {round} of 3
          </span>
        </div>

        <div
          style={{
            background: aacbState.triggered ? "#fef3c7" : "#eff6ff",
            border: `1.5px solid ${aacbState.triggered ? "#fde68a" : "#bfdbfe"}`,
            borderRadius: "var(--radius)",
            padding: "0.35rem 0.65rem",
            fontSize: "0.82rem",
            fontWeight: 800,
            color: aacbState.triggered ? "#92400e" : "#1e40af",
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

      {/* ── Instructions Card ── */}
      <div
        style={{
          background: aacbState.triggered ? "#fffbeb" : "var(--white)",
          border: `1.5px solid ${aacbState.triggered ? "#fde68a" : "var(--gray-200)"}`,
          borderRadius: "var(--radius-lg)",
          padding: "1rem",
          textAlign: "center",
          marginBottom: "1rem",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.2rem" }}>🎶</span>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--gray-500)", textTransform: "uppercase" }}>
            {isPlayingSeq ? "Listening Phase" : "Your Turn to Play"}
          </span>
        </div>

        <p
          style={{
            margin: "0.4rem 0 0",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: aacbState.triggered ? "#92400e" : "var(--gray-700)",
          }}
        >
          {statusMsg}
        </p>
      </div>

      {/* ── 6-Instrument Responsive Grid with AACB Golden Halo & Dimming ── */}
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
          const isTarget = sequence[playerStep] === idx;
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
              key={inst.id}
              type="button"
              className={btnClass}
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
                  ? "#fffbeb"
                  : "var(--white)",
                border: isTargetInAacb
                  ? "3px solid #f59e0b"
                  : isHighlighted
                  ? "3px solid #2563eb"
                  : "2px solid var(--gray-200)",
                boxShadow: isHighlighted ? "0 10px 20px -3px rgba(37, 99, 235, 0.25)" : "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
                cursor: isPlayingSeq ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
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
                borderRadius: 999,
                background: isDone
                  ? "var(--green)"
                  : isCurrent
                  ? "#f59e0b"
                  : "var(--gray-300)",
                transition: "all 0.2s ease",
              }}
            />
          );
        })}
      </div>

      {/* ── Repeat Pattern Trigger Button ── */}
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={repeatPattern}
          disabled={isPlayingSeq}
          style={{
            width: "100%",
            minHeight: "56px",
            background: "var(--white)",
            border: "1.5px solid var(--gray-300)",
            borderRadius: "var(--radius)",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "var(--gray-700)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            cursor: isPlayingSeq ? "not-allowed" : "pointer",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span>🔄</span>
          <span>পুনৰ শুনক • Hear Rhythm Again</span>
        </button>
      </div>
    </div>
  );
}
