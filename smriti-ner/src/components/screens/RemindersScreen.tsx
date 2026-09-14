"use client";

import { useState } from "react";
import type { ScreenId } from "@/lib/types";
import { DEFAULT_REMINDERS } from "@/lib/constants";
import { playGentleChime, playBeep } from "@/lib/audio";
import FullScreenReminderCard from "@/components/ui/FullScreenReminderCard";
import { reminderSchedulerDaemon, type ReminderItem } from "@/lib/reminderSchedulerService";
import { REMINDERS_SCREEN_LOCALES } from "@/lib/screenLocalizations";

interface Props {
  navigate: (target: ScreenId) => void;
  language?: string;
}

export default function RemindersScreen({ navigate, language = "as" }: Props) {
  const loc = REMINDERS_SCREEN_LOCALES[language] || REMINDERS_SCREEN_LOCALES.en;

  const [reminders, setReminders] = useState(
    DEFAULT_REMINDERS.map((r, i) => ({ ...r, completed: i === 0 }))
  );
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [fullScreenReminder, setFullScreenReminder] = useState<ReminderItem | null>(null);

  const toggleComplete = (id: string) => {
    playGentleChime();
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
    try {
      reminderSchedulerDaemon.confirmReminder(id);
    } catch {
      // Ignored for UI mock items
    }
  };

  const handlePlayVoice = (id: string) => {
    playBeep(587.33, 200); // D5 chime
    setPlayingVoiceId(id);
    setTimeout(() => {
      setPlayingVoiceId(null);
    }, 3200);
  };

  const openFullScreenFor = (id: string) => {
    const daemonRem = reminderSchedulerDaemon.getReminder(id);
    if (daemonRem) {
      setFullScreenReminder({ ...daemonRem });
    } else {
      // Fallback synthetic ReminderItem for DEFAULT_REMINDERS
      const item = reminders.find((r) => r.id === id);
      setFullScreenReminder({
        id,
        patientId: "p_anand_01",
        type: id.includes("water") ? "HYDRATION" : "MEDICATION",
        title: item?.title || loc.morningMedTitle,
        dosage: item?.description || "1 Tablet (Donepezil 5mg)",
        mealRelation: "AFTER_MEAL",
        scheduledTime: item?.time || "08:30 AM",
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
        recurrence: "DAILY",
        voicePromptPath: "/audio/reminders/priyanka_morning_pill.mp3",
        voiceSpeakerName: "Priyanka",
        voiceSpeakerRelation: "Family Granddaughter",
        culturalIcon: id.includes("water") ? "brass_lota" : "traditional_mortar",
        snoozeCount: 0,
        status: "ACTIVE",
        nextTriggerTime: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleConfirmFullScreen = (id: string) => {
    toggleComplete(id);
    setFullScreenReminder(null);
  };

  const handleSnoozeFullScreen = (id: string) => {
    try {
      const res = reminderSchedulerDaemon.snoozeReminder(id);
      setFullScreenReminder({ ...res.reminder });
    } catch {
      if (fullScreenReminder) {
        const nextCount = fullScreenReminder.snoozeCount + 1;
        setFullScreenReminder({
          ...fullScreenReminder,
          snoozeCount: nextCount,
          status: nextCount >= 3 ? "MISSED_ESCALATED" : "SNOOZED",
        });
      }
    }
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
              {loc.headerTitle}
            </h1>
            <p style={{
              fontSize: "0.8rem",
              color: "var(--gray-500)"
            }}>
              {loc.headerSubtitle}
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
          {loc.familyVoiceBadge}
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
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1e40af" }}>
            {loc.voiceEngineTitle}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#2563eb", marginTop: "0.15rem" }}>
            {loc.voiceEngineDesc}
          </div>
        </div>
        <button
          onClick={() => openFullScreenFor("rem_med_1")}
          style={{
            padding: "0.45rem 0.85rem",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            fontSize: "0.75rem",
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0
          }}
        >
          {loc.testAlertBtn}
        </button>
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
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button
                    onClick={() => openFullScreenFor(r.id)}
                    style={{
                      background: "#f0fdf4",
                      border: "1px solid #86efac",
                      borderRadius: "var(--radius-sm)",
                      padding: "0.35rem 0.65rem",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#166534",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}
                  >
                    <span>📱 Full Card</span>
                  </button>

                  <button
                    onClick={() => handlePlayVoice(r.id)}
                    style={{
                      background: "none",
                      border: "1px solid var(--gray-300)",
                      borderRadius: "var(--radius-sm)",
                      padding: "0.35rem 0.65rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--gray-700)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}
                  >
                    <span>🗣️ Voice</span>
                  </button>
                </div>

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

      {/* Full-Screen Reminder Modal Overlay */}
      <FullScreenReminderCard
        isOpen={!!fullScreenReminder}
        reminder={fullScreenReminder}
        language="as"
        onConfirm={handleConfirmFullScreen}
        onSnooze={handleSnoozeFullScreen}
        onDismiss={() => setFullScreenReminder(null)}
      />
    </div>
  );
}
