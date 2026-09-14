"use client";

import React, { useState, useEffect } from "react";
import { playGentleChime, playBeep } from "@/lib/audio";
import type { ReminderItem } from "@/lib/reminderSchedulerService";
import { speakReminderVoice, stopAllSpeech } from "@/lib/audioVoiceService";

interface Props {
  isOpen: boolean;
  reminder: ReminderItem | null;
  language?: string;
  onConfirm: (reminderId: string) => void;
  onSnooze: (reminderId: string) => void;
  onDismiss: () => void;
}

const MULTILINGUAL_LABELS: Record<string, {
  confirm: string;
  snooze: string;
  escalated: string;
  voiceQuote: string;
  confirmed: string;
}> = {
  as: {
    confirm: "✓ মই খাইছো (খোৱা হ'ল)",
    snooze: "⏰ ১৫ মিনিট পিছত সোঁৱৰাব",
    escalated: "পৰিয়াল আৰু আশা দিদীক জনোৱা হৈছে (Caregiver Alerted)",
    voiceQuote: '"দেউতা, সময় হৈছে! আপোনাৰ দৰবখিনি লওক..."',
    confirmed: "✓ খোৱা হ'ল!",
  },
  bn: {
    confirm: "✓ আমি খেয়েছি (নেওয়া হলো)",
    snooze: "⏰ ১৫ মিনিট পর মনে করিয়ে দাও",
    escalated: "পরিবার ও আশা কর্মীকে জানানো হয়েছে",
    voiceQuote: '"বাবা, সময় হয়েছে! আপনার ওষুধগুলো নিয়ে নিন..."',
    confirmed: "✓ নেওয়া হলো!",
  },
  mni: {
    confirm: "✓ ꯑꯩ ꯆꯥꯈ꯭ꯔꯦ",
    snooze: "⏰ ꯃꯤꯅꯤꯠ ꯱꯵ ꯀꯣꯟꯅꯥ ꯅꯤꯡꯁꯤꯡꯕꯤꯌꯨ",
    escalated: "ꯏꯃꯨꯡꯗꯥ ꯈꯪꯍꯜꯂꯦ",
    voiceQuote: '"ꯏꯄꯥ, ꯃꯇꯝ ꯑꯣꯏꯔꯦ! ꯍꯤꯗꯥꯛ ꯆꯥꯕꯤꯌꯨ..."',
    confirmed: "✓ ꯆꯥꯈ꯭ꯔꯦ!",
  },
  hi: {
    confirm: "✓ मैंने दवा ले ली है",
    snooze: "⏰ १५ मिनट बाद याद दिलाएं",
    escalated: "परिवार और आशा कार्यकर्ता को सूचित किया गया",
    voiceQuote: '"पिताजी, समय हो गया है! अपनी दवाइयाँ ले लीजिए..."',
    confirmed: "✓ दवा ले ली!",
  },
  brx: {
    confirm: "✓ आं मुलि जाबाय",
    snooze: "⏰ १५ मिनिट उनाव गोसोखां",
    escalated: "नखर आरो आशा मावथिया मिथिबाय",
    voiceQuote: '"आफा, सम जाबाय! नोंथांनि मुलिखौ जादो..."',
    confirmed: "✓ जाबाय!",
  },
  kha: {
    confirm: "✓ Nga la shim ïa ka dawai",
    snooze: "⏰ Kynmaw biang hadien 15 minit",
    escalated: "Kiba ha ïing bad ka ASHA la pyntip",
    voiceQuote: '"Pa, la dei ka por! Shim ïa ki dawai jong phi..."',
    confirmed: "✓ La shim!",
  },
  lus: {
    confirm: "✓ Damdawi ka ei tawh e",
    snooze: "⏰ Minit 15 hnuah min hrilh leh rawh",
    escalated: "Chhungte leh ASHA hrilh an ni tawh",
    voiceQuote: '"Ka pa, a hun ta e! I damdawi ei tawh rawh le..."',
    confirmed: "✓ Ka ei tawh e!",
  },
  en: {
    confirm: "✓ I have taken it",
    snooze: "⏰ Remind me in 15 mins",
    escalated: "Caregiver & ASHA Worker Notified",
    voiceQuote: '"Dad, it’s time! Please take your medicine..."',
    confirmed: "✓ Taken!",
  },
};

export default function FullScreenReminderCard({
  isOpen,
  reminder,
  language = "en",
  onConfirm,
  onSnooze,
  onDismiss,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (isOpen && reminder) {
      setIsPlaying(true);
      setConfirmed(false);
      speakReminderVoice(
        {
          title: reminder.title,
          dosage: reminder.dosage,
          type: reminder.type,
          time: reminder.scheduledTime,
        },
        language,
        () => {
          setIsPlaying(false);
        }
      );
      return () => {
        stopAllSpeech();
      };
    }
  }, [isOpen, reminder, language]);

  if (!isOpen || !reminder) return null;

  const labels = MULTILINGUAL_LABELS[language] || MULTILINGUAL_LABELS.en;
  const isEscalated = reminder.status === "MISSED_ESCALATED" || reminder.snoozeCount >= 3;

  const handleConfirmClick = () => {
    stopAllSpeech();
    playGentleChime();
    setConfirmed(true);
    setTimeout(() => {
      onConfirm(reminder.id);
    }, 800);
  };

  const handleSnoozeClick = () => {
    stopAllSpeech();
    playBeep(440, 150);
    onSnooze(reminder.id);
  };

  const handleReplayVoice = () => {
    if (!reminder) return;
    setIsPlaying(true);
    speakReminderVoice(
      {
        title: reminder.title,
        dosage: reminder.dosage,
        type: reminder.type,
        time: reminder.scheduledTime,
      },
      language,
      () => {
        setIsPlaying(false);
      }
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(15, 23, 42, 0.94)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "#ffffff",
          borderRadius: "28px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
          overflow: "hidden",
          border: isEscalated ? "3px solid #dc2626" : "2px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            backgroundColor: isEscalated ? "#fef2f2" : "#f0fdf4",
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem" }}>🎙️</span>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#166534" }}>
                {reminder.voiceSpeakerName} ({reminder.voiceSpeakerRelation})
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                Family Voice Reminder
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "0.25rem 0.65rem",
              backgroundColor: "#ffffff",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: 800,
              color: "#0f172a",
              border: "1px solid #cbd5e1",
            }}
          >
            ⏰ {reminder.scheduledTime}
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: "1.5rem 1.25rem", textAlign: "center" }}>
          {/* Family Avatar & Cultural Icon Badge */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: "1rem" }}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #fed7aa 0%, #fbcfe8 100%)",
                border: "4px solid #ffffff",
                boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.8rem",
                margin: "0 auto",
              }}
            >
              👩🏻
            </div>
            <div
              style={{
                position: "absolute",
                bottom: -4,
                right: -4,
                width: 38,
                height: 38,
                borderRadius: "50%",
                backgroundColor: "#dcfce7",
                border: "2px solid #ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.3rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            >
              {reminder.type === "MEDICATION" ? "💊" : reminder.type === "HYDRATION" ? "💧" : "🔔"}
            </div>
          </div>

          {/* Title & Dosage */}
          <h2
            style={{
              fontSize: "1.35rem",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.3,
              marginBottom: "0.4rem",
            }}
          >
            {reminder.title}
          </h2>
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "#0284c7",
              backgroundColor: "#f0f9ff",
              display: "inline-block",
              padding: "0.35rem 0.85rem",
              borderRadius: "12px",
              marginBottom: "1rem",
            }}
          >
            {reminder.dosage}
          </div>

          {/* Animated Waveform & Speech Transcript */}
          <div
            onClick={handleReplayVoice}
            role="button"
            tabIndex={0}
            style={{
              backgroundColor: "#1e1b4b",
              borderRadius: "18px",
              padding: "0.85rem 1rem",
              color: "#ffffff",
              marginBottom: "1.25rem",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", height: 28 }}>
              {[18, 28, 14, 26, 20, 30, 16].map((h, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    width: 4,
                    height: isPlaying ? h : 6,
                    backgroundColor: isPlaying ? "#38bdf8" : "#94a3b8",
                    borderRadius: "2px",
                    transition: "height 0.2s ease",
                  }}
                />
              ))}
            </div>
            <p style={{ fontSize: "0.85rem", color: "#e0e7ff", marginTop: "0.4rem", fontStyle: "italic", margin: "0.4rem 0 0" }}>
              {labels.voiceQuote}
            </p>
            <span style={{ fontSize: "0.7rem", color: "#93c5fd", display: "inline-block", marginTop: "0.25rem" }}>
              {isPlaying ? "🔊 Playing Voice..." : "▶ Tap to replay voice"}
            </span>
          </div>

          {/* Overdue / Escalation Alert Banner if applicable */}
          {isEscalated && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1.5px solid #fecaca",
                borderRadius: "14px",
                padding: "0.75rem",
                marginBottom: "1rem",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#991b1b" }}>
                ⚠️ {labels.escalated}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#b91c1c", marginTop: "0.2rem" }}>
                45+ minutes overdue. Automated IVR call queued for phone confirmation.
              </div>
            </div>
          )}

          {/* Primary Action Button: Single-Tap Confirmation */}
          <button
            onClick={handleConfirmClick}
            style={{
              width: "100%",
              minHeight: "64px",
              backgroundColor: confirmed ? "#15803d" : "#16a34a",
              color: "#ffffff",
              border: "none",
              borderRadius: "18px",
              fontSize: "1.15rem",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(22, 163, 74, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              transition: "transform 0.15s ease, background-color 0.2s ease",
              marginBottom: "0.75rem",
            }}
          >
            <span>{confirmed ? labels.confirmed : labels.confirm}</span>
          </button>

          {/* Secondary Action: Snooze 15 Mins */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handleSnoozeClick}
              disabled={isEscalated}
              style={{
                flex: 1,
                minHeight: "48px",
                backgroundColor: isEscalated ? "#f1f5f9" : "#f8fafc",
                color: isEscalated ? "#94a3b8" : "#475569",
                border: "1.5px solid #cbd5e1",
                borderRadius: "14px",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: isEscalated ? "not-allowed" : "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span>{labels.snooze}</span>
              <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                (সোঁৱৰণী: {reminder.snoozeCount} / 3)
              </span>
            </button>

            <button
              onClick={onDismiss}
              style={{
                padding: "0 1rem",
                backgroundColor: "#f8fafc",
                color: "#64748b",
                border: "1.5px solid #cbd5e1",
                borderRadius: "14px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
