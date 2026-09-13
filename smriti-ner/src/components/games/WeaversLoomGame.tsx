"use client";

import { useState, useRef } from "react";
import type { ScreenId } from "@/lib/types";
import { LOOM_COLORS } from "@/lib/constants";
import { playGentleChime, playSuccessJingle, playBeep } from "@/lib/audio";

interface Props {
  navigate: (target: ScreenId) => void;
  showSuccess: (time: string, accuracy: string, onNext?: () => void) => void;
}

export default function WeaversLoomGame({ navigate, showSuccess }: Props) {
  // Target pattern: 3 yarn color steps
  const [targetPattern, setTargetPattern] = useState<number[]>([0, 1, 3]); // Gold, Crimson, Indigo
  const [wovenPattern, setWovenPattern] = useState<number[]>([]);
  const [round, setRound] = useState<number>(1);
  const startTimeRef = useRef<number>(Date.now());

  const handleColorTap = (colorIdx: number) => {
    const nextStep = wovenPattern.length;
    const expectedColor = targetPattern[nextStep];

    playBeep(350 + colorIdx * 60, 120);

    if (colorIdx === expectedColor) {
      const newWoven = [...wovenPattern, colorIdx];
      setWovenPattern(newWoven);

      if (newWoven.length === targetPattern.length) {
        // Finished this weave!
        playGentleChime();

        setTimeout(() => {
          if (round >= 2) {
            playSuccessJingle();
            const elapsedSec = Math.round((Date.now() - startTimeRef.current) / 1000);
            showSuccess(`${elapsedSec}s`, "100%", () => {
              setRound(1);
              setWovenPattern([]);
              setTargetPattern([0, 1, 3]);
              startTimeRef.current = Date.now();
            });
          } else {
            setRound((r) => r + 1);
            setWovenPattern([]);
            setTargetPattern([1, 2, 0, 3]); // Slightly longer sequence
          }
        }, 1200);
      }
    } else {
      // Gentle vibration / audio hint, no penalty
      playBeep(220, 150);
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
            Weaver's Loom
          </h2>
          <span style={{ fontSize: "0.75rem", color: "#d97706", fontWeight: 600 }}>
            Pattern {round} of 2 • Muga & Gamosa Motif
          </span>
        </div>

        <div style={{ width: 40 }} />
      </div>

      {/* Loom Frame & Woven Canvas */}
      <div style={{
        background: "linear-gradient(to bottom, #fdf6e7, #faecc7)",
        border: "3px solid #d97706",
        borderRadius: "var(--radius-xl)",
        padding: "1.25rem",
        marginBottom: "1.5rem",
        boxShadow: "var(--shadow-md)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.85rem"
      }}>
        <div style={{
          fontSize: "0.8rem",
          fontWeight: 700,
          color: "#92400e",
          textTransform: "uppercase",
          letterSpacing: "0.05em"
        }}>
          Traditional Cloth on the Loom (তাঁত শাল)
        </div>

        {/* Target Pattern Row */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--gray-600)" }}>
            Target Thread Order:
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {targetPattern.map((cIdx, i) => (
              <div
                key={i}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  backgroundColor: LOOM_COLORS[cIdx].hex,
                  border: i === wovenPattern.length ? "3px solid #1a1a2e" : "1.5px solid rgba(0,0,0,0.2)",
                  boxShadow: i === wovenPattern.length ? "0 0 10px rgba(0,0,0,0.3)" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "0.85rem"
                }}
              >
                {i < wovenPattern.length ? "✓" : i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Woven Fabric Result Display */}
        <div style={{
          width: "100%",
          height: "64px",
          background: "var(--white)",
          borderRadius: "var(--radius)",
          border: "2px dashed #b45309",
          display: "flex",
          overflow: "hidden",
          padding: "4px"
        }}>
          {wovenPattern.length === 0 ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              color: "var(--gray-400)",
              fontSize: "0.85rem",
              fontStyle: "italic"
            }}>
              Tap spools below to begin weaving...
            </div>
          ) : (
            wovenPattern.map((cIdx, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: "100%",
                  backgroundColor: LOOM_COLORS[cIdx].hex,
                  transition: "all 300ms ease",
                  borderRight: i < wovenPattern.length - 1 ? "2px solid rgba(255,255,255,0.4)" : "none"
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Spools of Thread Selection */}
      <h3 style={{
        fontSize: "0.95rem",
        fontWeight: 700,
        color: "var(--gray-900)",
        marginBottom: "0.75rem",
        textAlign: "center"
      }}>
        Pick the next thread color:
      </h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.85rem",
        maxWidth: "380px",
        margin: "0 auto",
        width: "100%"
      }}>
        {LOOM_COLORS.map((c, idx) => (
          <button
            key={c.name}
            onClick={() => handleColorTap(idx)}
            style={{
              padding: "0.85rem 1rem",
              background: "var(--white)",
              border: "2px solid var(--gray-200)",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
              transition: "all var(--transition)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = c.hex;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--gray-200)";
              e.currentTarget.style.transform = "none";
            }}
          >
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: c.hex,
              boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
              flexShrink: 0
            }} />
            <span style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--gray-800)",
              textAlign: "left"
            }}>
              {c.name}
            </span>
          </button>
        ))}
      </div>

      <div style={{
        marginTop: "1.5rem",
        textAlign: "center",
        fontSize: "0.75rem",
        color: "var(--gray-400)"
      }}>
        Clinical Domain: Visuospatial Construction & Motor Sequencing (Clock Drawing / PRAXIS)
      </div>
    </div>
  );
}
