"use client";

import { useState, useEffect, useRef } from "react";
import type { ScreenId } from "@/lib/types";
import { INSTRUMENTS } from "@/lib/constants";
import { playInstrumentSound, playSuccessJingle, playGentleChime } from "@/lib/audio";
import { decomposeLatency, evaluateAACB, updateBKT, type BKTState } from "@/lib/dcdaEngine";

interface Props {
  navigate: (target: ScreenId) => void;
  showSuccess: (time: string, accuracy: string, onNext?: () => void) => void;
}

export default function DholPepaGame({ navigate, showSuccess }: Props) {
  // Use first 4 instruments for clean 2x2 grid
  const activeInstruments = INSTRUMENTS.slice(0, 4);

  const [sequence, setSequence] = useState<number[]>([0, 1]);
  const [playerStep, setPlayerStep] = useState<number>(0);
  const [isPlayingSeq, setIsPlayingSeq] = useState<boolean>(false);
  const [activeHighlight, setActiveHighlight] = useState<number | null>(null);
  const [round, setRound] = useState<number>(1);
  const [statusMsg, setStatusMsg] = useState<string>("Listen to the rhythm...");
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

  // Play sequence on load or round start
  useEffect(() => {
    playPattern(sequence);
  }, [round]);

  const playPattern = async (seq: number[]) => {
    setIsPlayingSeq(true);
    setStatusMsg("Listen closely...");
    await new Promise((r) => setTimeout(r, 600));

    for (let i = 0; i < seq.length; i++) {
      const instIndex = seq[i];
      setActiveHighlight(instIndex);
      const inst = activeInstruments[instIndex];
      playInstrumentSound(inst.freq, inst.waveType, 300);
      await new Promise((r) => setTimeout(r, 450));
      setActiveHighlight(null);
      await new Promise((r) => setTimeout(r, 200));
    }

    setIsPlayingSeq(false);
    setStatusMsg("Now your turn: tap the same rhythm!");
    setPlayerStep(0);
    tapStartRef.current = Date.now();
  };

  const handleInstrumentTap = (idx: number) => {
    if (isPlayingSeq) return;

    // Bi-Factor Latency Decomposition
    const totalReactionTime = Date.now() - tapStartRef.current;
    // Simulate slight physiological motor wander (1.1 - 1.4)
    const simulatedWander = 1.15;
    const latencyReport = decomposeLatency(totalReactionTime, simulatedWander);

    // Play tapped sound
    const inst = activeInstruments[idx];
    playInstrumentSound(inst.freq, inst.waveType, 250);

    // Visual feedback
    setActiveHighlight(idx);
    setTimeout(() => setActiveHighlight(null), 250);

    const expectedIdx = sequence[playerStep];

    // Check against current step in sequence
    if (idx === expectedIdx) {
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
          showSuccess(`${elapsedSec}s`, "100%", () => {
            setRound(1);
            setSequence([0, 1]);
            startTimeRef.current = Date.now();
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
        setStatusMsg("Let's hear that sequence again together...");
      }

      setTimeout(() => {
        playPattern(sequence);
      }, 1200);
    }
  };

  const currentExpectedInstrument = sequence[playerStep];

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
            Dhol-Pepa Sur-Milon
          </h2>
          <span style={{ fontSize: "0.75rem", color: aacbStatus.triggered ? "#d97706" : "var(--accent)", fontWeight: 700 }}>
            Round {round} of 3 • {aacbStatus.triggered ? "AACB Compassionate Guidance" : "Adaptive DCDA"}
          </span>
        </div>

        <button
          onClick={() => playPattern(sequence)}
          disabled={isPlayingSeq}
          style={{
            background: "var(--gray-50)",
            border: "1px solid var(--gray-200)",
            borderRadius: "999px",
            padding: "0.35rem 0.65rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          🔁 Replay
        </button>
      </div>

      {/* Dementia Comfort & AACB Guidance Prompt */}
      <div style={{
        textAlign: "center",
        padding: "0.85rem 1rem",
        background: aacbStatus.triggered ? "#fffbeb" : isPlayingSeq ? "#eff6ff" : "#f0fdf4",
        border: `1.5px solid ${aacbStatus.triggered ? "#fcd34d" : isPlayingSeq ? "#bfdbfe" : "#bbf7d0"}`,
        borderRadius: "var(--radius)",
        marginBottom: "1.25rem",
        color: aacbStatus.triggered ? "#b45309" : isPlayingSeq ? "#1e40af" : "#166534",
        fontWeight: 600,
        fontSize: "0.92rem",
        transition: "all var(--transition)"
      }}>
        {aacbStatus.guidanceMessage || statusMsg}
      </div>

      {/* 2x2 Instrument Grid (Generous Accessible Touch Hitboxes) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1.25rem",
        flex: 1,
        alignContent: "center",
        maxWidth: "380px",
        margin: "0 auto",
        width: "100%"
      }}>
        {activeInstruments.map((inst, idx) => {
          const isHighlighted = activeHighlight === idx;
          const isTargetInAacb = aacbStatus.goldenHaloActive && idx === currentExpectedInstrument;
          const isDistractorInAacb = aacbStatus.goldenHaloActive && idx !== currentExpectedInstrument;

          return (
            <button
              key={inst.id}
              disabled={isPlayingSeq}
              onClick={() => handleInstrumentTap(idx)}
              style={{
                aspectRatio: "1",
                minHeight: "130px",
                background: isHighlighted
                  ? "var(--accent-light)"
                  : isTargetInAacb
                  ? "#fef9c3"
                  : "var(--white)",
                border: isTargetInAacb
                  ? "3.5px solid #d97706"
                  : isHighlighted
                  ? "3px solid var(--accent)"
                  : "2px solid var(--gray-200)",
                borderRadius: "var(--radius-xl)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: isPlayingSeq ? "default" : "pointer",
                boxShadow: isTargetInAacb
                  ? "0 0 25px rgba(217, 119, 6, 0.45)"
                  : isHighlighted
                  ? "0 8px 24px rgba(201, 168, 76, 0.3)"
                  : "var(--shadow)",
                opacity: isDistractorInAacb ? 0.45 : 1,
                transform: isTargetInAacb ? "scale(1.04)" : isHighlighted ? "scale(1.05)" : "none",
                transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              <span style={{ fontSize: "3rem" }}>{inst.emoji}</span>
              <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gray-900)" }}>
                {inst.name}
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--gray-500)", fontWeight: 600 }}>
                {inst.native}
              </span>
            </button>
          );
        })}
      </div>

      {/* Clinical Telemetry Bar */}
      <div style={{
        marginTop: "1.25rem",
        padding: "0.6rem 0.85rem",
        background: "var(--gray-50)",
        borderRadius: "var(--radius)",
        border: "1px solid var(--gray-200)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "0.72rem",
        color: "var(--gray-600)"
      }}>
        <span>BKT Concept Mastery: <strong>{Math.round(bkt.pLearned * 100)}%</strong></span>
        <span>•</span>
        <span>Tremor Separation: <strong>Active</strong></span>
        <span>•</span>
        <span style={{ color: aacbStatus.triggered ? "#d97706" : "var(--green)", fontWeight: 700 }}>
          {aacbStatus.triggered ? "AACB Attenuated" : "Normal Baseline"}
        </span>
      </div>
    </div>
  );
}
