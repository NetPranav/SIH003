"use client";

import { useState } from "react";
import type { ScreenId } from "@/lib/types";
import { DEFAULT_REMINDERS } from "@/lib/constants";
import { playGentleChime, playBeep } from "@/lib/audio";

interface Props {
  navigate: (target: ScreenId) => void;
}

export default function RemindersScreen({ navigate }: Props) {
  const [reminders, setReminders] = useState(
    DEFAULT_REMINDERS.map((r, i) => ({ ...r, completed: i === 0 }))
  );
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const toggleComplete = (id: string) => {
    playGentleChime();
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const handlePlayVoice = (id: string) => {
    playBeep(587.33, 200); // D5 chime
    setPlayingVoiceId(id);
    setTimeout(() => {
      setPlayingVoiceId(null);
    }, 3200);
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
              fontSize: "1.35rem",
              fontWeight: 800,
              color: "var(--gray-900)"
            }}>
              Daily Reminders
            </h1>
            <p style={{
              fontSize: "0.8rem",
              color: "var(--gray-500)"
            }}>
              দৰব আৰু পানী সোঁৱৰণী
            </p>
          </div>
        </div>

        <span style={{
          padding: "0.35rem 0.75rem",
          background: "var(--gray-50)",
          border: "1px solid var(--gray-200)",
          borderRadius: "999px",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "var(--primary)"
        }}>
          Family Voice Sync
        </span>
      </div>

      {/* Voice Prompt Reassurance Banner */}
      <div style={{
        background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        border: "1px solid #bfdbfe",
        borderRadius: "var(--radius-lg)",
        padding: "1rem",
        marginBottom: "1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "0.85rem"
      }}>
        <div style={{ fontSize: "1.8rem" }}>🎙️</div>
        <div>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1e40af" }}>
            Familiar Family Voice Engine
          </div>
          <div style={{ fontSize: "0.78rem", color: "#2563eb", marginTop: "0.15rem" }}>
            All medicine reminders speak in your granddaughter Priya’s voice in Assamese.
          </div>
        </div>
      </div>

      {/* Reminders List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        {reminders.map((r) => {
          const isPlaying = playingVoiceId === r.id;
          return (
            <div
              key={r.id}
              style={{
                background: r.completed ? "var(--gray-50)" : "var(--white)",
                border: r.completed ? "1px solid var(--gray-200)" : "1.5px solid var(--gray-200)",
                borderRadius: "var(--radius-lg)",
                padding: "1rem",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                opacity: r.completed ? 0.7 : 1,
                transition: "all var(--transition)"
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    background: r.type === "medicine" ? "#fef3c7" : "#e0f2fe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem"
                  }}>
                    {r.icon}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: r.completed ? "var(--gray-500)" : "var(--gray-900)",
                      textDecoration: r.completed ? "line-through" : "none"
                    }}>
                      {r.title}
                    </h3>
                    <div style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>
                      {r.description}
                    </div>
                  </div>
                </div>

                <div style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                  padding: "0.2rem 0.5rem",
                  background: "var(--gray-100)",
                  borderRadius: "var(--radius-sm)"
                }}>
                  {r.time}
                </div>
              </div>

              {/* Voice Player Banner if currently playing */}
              {isPlaying && (
                <div style={{
                  background: "#1a1a2e",
                  borderRadius: "var(--radius)",
                  padding: "0.6rem 0.85rem",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.8rem"
                }}>
                  <span>🔊 "দেউতা, সময় হৈছে! আপোনাৰ দৰবখিনি লওক..."</span>
                  <span style={{ animation: "pulse 1s infinite" }}>▶ Playing</span>
                </div>
              )}

              {/* Actions */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "0.5rem",
                borderTop: "1px solid var(--gray-100)"
              }}>
                <button
                  onClick={() => handlePlayVoice(r.id)}
                  style={{
                    background: "none",
                    border: "1px solid var(--gray-300)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.35rem 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--gray-700)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem"
                  }}
                >
                  <span>🗣️ Play Voice</span>
                </button>

                <button
                  onClick={() => toggleComplete(r.id)}
                  style={{
                    background: r.completed ? "var(--gray-200)" : "var(--primary)",
                    color: r.completed ? "var(--gray-700)" : "var(--white)",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.45rem 1rem",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem"
                  }}
                >
                  <span>{r.completed ? "✓ Done" : "Mark as Taken"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
