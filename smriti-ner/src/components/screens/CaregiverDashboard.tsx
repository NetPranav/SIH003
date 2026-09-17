"use client";

import { useState, useEffect } from "react";
import type { ScreenId } from "@/lib/types";
import { playAudioFeedback, playGentleChime } from "@/lib/audio";
import { triggerHaptic } from "@/lib/accessibilityMiddleware";
import {
  offlineMobileStore,
  type OfflineReminder,
  type OfflineAlbumPhoto,
  type PatientProfile,
} from "@/lib/offlineMobileStorage";
import { speakSpokenVoice } from "@/lib/audioVoiceService";
import { testGeminiApiKey } from "@/lib/geminiCompanionService";

interface Props {
  navigate: (target: ScreenId) => void;
}

export default function CaregiverDashboard({ navigate }: Props) {
  // Offline State
  const [profile, setProfile] = useState<PatientProfile>(() =>
    offlineMobileStore.getPatientProfile()
  );
  const [reminders, setReminders] = useState<OfflineReminder[]>(() =>
    offlineMobileStore.getReminders()
  );
  const [photos, setPhotos] = useState<OfflineAlbumPhoto[]>(() =>
    offlineMobileStore.getAlbumPhotos()
  );
  const [adherenceRate, setAdherenceRate] = useState<number>(() =>
    offlineMobileStore.getAdherenceRate()
  );

  // Daily Observation / Mood State
  const [selectedMood, setSelectedMood] = useState<"calm" | "restless" | "confused">("calm");
  const [moodNote, setMoodNote] = useState<string>("");
  const [moodSavedToast, setMoodSavedToast] = useState<boolean>(false);

  // Modals
  const [isAddMedOpen, setIsAddMedOpen] = useState<boolean>(false);
  const [medTitle, setMedTitle] = useState<string>("");
  const [medDosage, setMedDosage] = useState<string>("");
  const [medTime, setMedTime] = useState<string>("08:00 AM");

  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState<boolean>(false);
  const [photoTitle, setPhotoTitle] = useState<string>("");
  const [photoRelation, setPhotoRelation] = useState<string>("Family");
  const [photoCaption, setPhotoCaption] = useState<string>("");

  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(profile.name);
  const [editAge, setEditAge] = useState<number>(profile.age);
  const [editLocation, setEditLocation] = useState<string>(profile.location || "");
  const [editEmergencyName, setEditEmergencyName] = useState<string>(
    profile.emergencyContact?.name || "Priyanka Baruah"
  );
  const [editEmergencyPhone, setEditEmergencyPhone] = useState<string>(
    profile.emergencyContact?.phone || "+91 94350 12345"
  );

  // Gemini API Key & Companion Intelligence Config
  const [geminiKey, setGeminiKey] = useState<string>(() =>
    offlineMobileStore.getGeminiApiKey()
  );
  const [isKeyVerified, setIsKeyVerified] = useState<boolean>(false);
  const [verifiedModel, setVerifiedModel] = useState<string>("");
  const [isTestingKey, setIsTestingKey] = useState<boolean>(false);
  const [keyFeedback, setKeyFeedback] = useState<{ success: boolean; text: string } | null>(null);
  const [keySavedMessage, setKeySavedMessage] = useState<string>("");
  const [showKeyMask, setShowKeyMask] = useState<boolean>(false);

  // Subscribe to offline mobile storage updates
  useEffect(() => {
    return offlineMobileStore.subscribe(() => {
      setProfile(offlineMobileStore.getPatientProfile());
      setReminders(offlineMobileStore.getReminders());
      setPhotos(offlineMobileStore.getAlbumPhotos());
      setAdherenceRate(offlineMobileStore.getAdherenceRate());
      setGeminiKey(offlineMobileStore.getGeminiApiKey());
    });
  }, []);

  // Handlers
  const handleTestApiKey = async () => {
    if (!geminiKey.trim()) {
      setKeyFeedback({ success: false, text: "Please enter an API key to test." });
      setIsKeyVerified(false);
      return;
    }
    setIsTestingKey(true);
    setKeyFeedback(null);
    try {
      const res = await testGeminiApiKey(geminiKey.trim());
      setIsTestingKey(false);
      setKeyFeedback({ success: res.success, text: res.message });
      if (res.success) {
        offlineMobileStore.setGeminiApiKey(geminiKey.trim());
        setIsKeyVerified(true);
        setVerifiedModel(res.model || "Gemini");
        setKeySavedMessage(`✓ Key verified! Google ${res.model || "Gemini"} active across all features.`);
        setTimeout(() => setKeySavedMessage(""), 4500);
      } else {
        setIsKeyVerified(false);
      }
    } catch {
      setIsTestingKey(false);
      setIsKeyVerified(false);
      setKeyFeedback({ success: false, text: "Connection test failed. Check internet." });
    }
  };

  const handleSaveApiKey = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    offlineMobileStore.setGeminiApiKey(geminiKey);
    const hasKey = Boolean(geminiKey && geminiKey.trim().length > 0);
    if (!hasKey) {
      setIsKeyVerified(false);
      setKeyFeedback(null);
      setKeySavedMessage("✓ Reset to 100% On-Device Clinical Rule Engine.");
    } else {
      setKeySavedMessage("✓ Key saved. Click 'Test Key' to verify Google Cloud connection.");
    }
    setTimeout(() => setKeySavedMessage(""), 3500);
  };

  const handleClearApiKey = () => {
    setGeminiKey("");
    offlineMobileStore.setGeminiApiKey("");
    setIsKeyVerified(false);
    setVerifiedModel("");
    setKeyFeedback(null);
    setKeySavedMessage("✓ Reverted to 100% On-Device Clinical Rule Engine.");
    setTimeout(() => setKeySavedMessage(""), 3500);
  };

  const handleToggleMed = (id: string) => {
    triggerHaptic("tap");
    playGentleChime();
    offlineMobileStore.toggleReminder(id);
  };

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medTitle.trim()) return;
    offlineMobileStore.addReminder({
      title: medTitle.trim(),
      description: medDosage.trim(),
      dosage: medDosage.trim(),
      time: medTime,
      type: "medicine",
      icon: "Pill",
    });
    setMedTitle("");
    setMedDosage("");
    setIsAddMedOpen(false);
    triggerHaptic("success");
    playGentleChime();
  };

  const handleDeleteMed = (id: string) => {
    triggerHaptic("tap");
    offlineMobileStore.deleteReminder(id);
  };

  const handleSaveMood = () => {
    triggerHaptic("tap");
    playGentleChime();
    offlineMobileStore.saveWellnessLog({
      mood: selectedMood === "calm" ? "calm" : selectedMood === "restless" ? "restless" : "agitated",
      sundowningObserved: selectedMood === "restless",
      sleepHours: 7.5,
      hydrationGlasses: 6,
      notes: moodNote.trim() || `Status logged: ${selectedMood}`,
    });
    setMoodSavedToast(true);
    setTimeout(() => setMoodSavedToast(false), 3000);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) return;
    offlineMobileStore.addAlbumPhoto({
      title: photoTitle.trim(),
      relation: photoRelation.trim() || "Family",
      caption: photoCaption.trim(),
      year: new Date().getFullYear().toString(),
      image: "/photos/festival.jpg",
    });
    setPhotoTitle("");
    setPhotoCaption("");
    setIsAddPhotoOpen(false);
    triggerHaptic("success");
    playGentleChime();
  };

  const handleDeletePhoto = (id: string) => {
    triggerHaptic("tap");
    offlineMobileStore.deleteAlbumPhoto(id);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    offlineMobileStore.updatePatientProfile({
      name: editName.trim(),
      age: Number(editAge) || 74,
      location: editLocation.trim(),
      emergencyContact: {
        name: editEmergencyName.trim(),
        phone: editEmergencyPhone.trim(),
      },
    });
    setIsEditProfileOpen(false);
    triggerHaptic("success");
    playGentleChime();
  };

  const handleReadSchedule = () => {
    triggerHaptic("tap");
    playAudioFeedback();
    const pending = reminders.filter((r) => !r.completed);
    if (pending.length === 0) {
      speakSpokenVoice(
        "All medications and care routines for today are completed. Grandfather is resting comfortably.",
        "en"
      );
    } else {
      const summary = pending
        .map((r) => `${r.title} scheduled at ${r.time}`)
        .join(", ");
      speakSpokenVoice(`Upcoming routines today: ${summary}.`, "en");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "640px",
        margin: "0 auto",
        padding: "1rem 1rem 6rem",
        boxSizing: "border-box",
        color: "#0f172a",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ── Top Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid #e2e8f0",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
              Caregiver Operations Hub
            </h1>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                padding: "0.15rem 0.5rem",
                borderRadius: "999px",
                background: "#ecfdf5",
                color: "#065f46",
                border: "1px solid #a7f3d0",
              }}
            >
              Offline Ready
            </span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
            Essential care manager for dementia support
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic("tap");
            playAudioFeedback();
            navigate("home");
          }}
          style={{
            padding: "0.5rem 0.85rem",
            background: "#ffffff",
            border: "1.5px solid #cbd5e1",
            borderRadius: "10px",
            fontSize: "0.78rem",
            fontWeight: 700,
            color: "#334155",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <span>←</span>
          <span>Elder View</span>
        </button>
      </div>

      {/* ── Card 1: Elder At-A-Glance Status & Fast Emergency ── */}
      <div
        style={{
          background: "#f8fafc",
          border: "1.5px solid #e2e8f0",
          borderRadius: "16px",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}>
                {profile.name}
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  padding: "0.1rem 0.45rem",
                  borderRadius: "999px",
                  background: "#e0e7ff",
                  color: "#3730a3",
                }}
              >
                Age {profile.age} • {profile.relation || "Grandfather"}
              </span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "4px" }}>
              Location: {profile.location || "Guwahati, Assam"} • Stage: {profile.clinicalStage || "CDR 1.0 (Mild)"}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditProfileOpen(true)}
            style={{
              padding: "0.35rem 0.65rem",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#475569",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Edit Info
          </button>
        </div>

        {/* Emergency Fast Contacts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
            marginTop: "0.85rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <a
            href={`tel:${(profile.emergencyContact?.phone || "+919435012345").replace(/\s+/g, "")}`}
            style={{
              padding: "0.55rem 0.75rem",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: "10px",
              color: "#065f46",
              textDecoration: "none",
              fontSize: "0.78rem",
              fontWeight: 700,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Primary Family</span>
            <span style={{ fontWeight: 800 }}>{profile.emergencyContact?.name || "Call Contact"}</span>
          </a>

          <a
            href="tel:14416"
            style={{
              padding: "0.55rem 0.75rem",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "10px",
              color: "#1e40af",
              textDecoration: "none",
              fontSize: "0.78rem",
              fontWeight: 700,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Northeast Dementia</span>
            <span style={{ fontWeight: 800 }}>Tele-MANAS 14416</span>
          </a>
        </div>
      </div>

      {/* ── Card 2: Today's Medication & Routine Checklist (Primary Daily Action) ── */}
      <div
        style={{
          background: "#ffffff",
          border: "1.5px solid #cbd5e1",
          borderRadius: "16px",
          padding: "1rem",
          marginBottom: "1rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>
              Today's Care & Medication Routine
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
              Adherence: {adherenceRate}% • {reminders.filter((r) => r.completed).length} of {reminders.length} items completed
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.35rem" }}>
            <button
              type="button"
              onClick={handleReadSchedule}
              title="Speak routine aloud"
              style={{
                padding: "0.4rem 0.65rem",
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#334155",
                cursor: "pointer",
              }}
            >
              Read Out
            </button>
            <button
              type="button"
              onClick={() => setIsAddMedOpen(true)}
              style={{
                padding: "0.4rem 0.75rem",
                background: "#0284c7",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              + Add Item
            </button>
          </div>
        </div>

        {/* Progress Line */}
        <div
          style={{
            height: "6px",
            background: "#e2e8f0",
            borderRadius: "999px",
            overflow: "hidden",
            marginBottom: "0.85rem",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${adherenceRate}%`,
              background: adherenceRate >= 100 ? "#16a34a" : "#0284c7",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {/* Items List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {reminders.map((r) => (
            <div
              key={r.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.65rem 0.8rem",
                borderRadius: "12px",
                background: r.completed ? "#f0fdf4" : "#f8fafc",
                border: r.completed ? "1px solid #bbf7d0" : "1px solid #e2e8f0",
                gap: "0.6rem",
              }}
            >
              <button
                type="button"
                onClick={() => handleToggleMed(r.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  textAlign: "left",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "6px",
                    border: r.completed ? "2px solid #16a34a" : "2px solid #94a3b8",
                    background: r.completed ? "#16a34a" : "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  {r.completed ? "✓" : ""}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      color: r.completed ? "#166534" : "#0f172a",
                      textDecoration: r.completed ? "line-through" : "none",
                    }}
                  >
                    {r.title}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    {r.time} {r.dosage ? `• ${r.dosage}` : ""}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteMed(r.id)}
                aria-label={`Delete ${r.title}`}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  padding: "0.2rem 0.4rem",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Card 3: 1-Tap Daily Well-Being & Mood Observation ── */}
      <div
        style={{
          background: "#ffffff",
          border: "1.5px solid #cbd5e1",
          borderRadius: "16px",
          padding: "1rem",
          marginBottom: "1rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.3rem" }}>
          Daily Elder Observation & Mood
        </div>
        <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.75rem" }}>
          1-tap log to track behavioral changes and sundowning patterns
        </div>

        {/* 3 Clean Status Pills */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem", marginBottom: "0.75rem" }}>
          {(
            [
              { key: "calm", label: "Calm & Content" },
              { key: "restless", label: "Restless / Agitated" },
              { key: "confused", label: "Disoriented" },
            ] as const
          ).map((m) => {
            const isSelected = selectedMood === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setSelectedMood(m.key)}
                style={{
                  padding: "0.55rem 0.35rem",
                  borderRadius: "10px",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  textAlign: "center",
                  border: isSelected
                    ? m.key === "calm"
                      ? "2px solid #16a34a"
                      : m.key === "restless"
                      ? "2px solid #d97706"
                      : "2px solid #7c3aed"
                    : "1px solid #cbd5e1",
                  background: isSelected
                    ? m.key === "calm"
                      ? "#f0fdf4"
                      : m.key === "restless"
                      ? "#fffbeb"
                      : "#f5f3ff"
                    : "#f8fafc",
                  color: isSelected
                    ? m.key === "calm"
                      ? "#15803d"
                      : m.key === "restless"
                      ? "#b45309"
                      : "#6d28d9"
                    : "#475569",
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "0.4rem" }}>
          <input
            type="text"
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            placeholder="Optional note: e.g. Slept well, enjoyed lunch..."
            style={{
              flex: 1,
              padding: "0.55rem 0.75rem",
              borderRadius: "10px",
              border: "1.5px solid #cbd5e1",
              fontSize: "0.82rem",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={handleSaveMood}
            style={{
              padding: "0.55rem 1rem",
              background: "#0f172a",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontSize: "0.8rem",
              fontWeight: 800,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Save Log
          </button>
        </div>

        {moodSavedToast && (
          <div style={{ marginTop: "0.45rem", fontSize: "0.75rem", fontWeight: 700, color: "#16a34a" }}>
            Observation recorded in secure on-device store.
          </div>
        )}
      </div>

      {/* ── Card 4: Family Reminiscence Memories Studio ── */}
      <div
        style={{
          background: "#ffffff",
          border: "1.5px solid #cbd5e1",
          borderRadius: "16px",
          padding: "1rem",
          marginBottom: "1rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>
              Family Memory Studio
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
              {photos.length} photos loaded for elder reminiscing & cognitive orientation
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAddPhotoOpen(true)}
            style={{
              padding: "0.4rem 0.75rem",
              background: "#0284c7",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            + Add Photo
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: "0.6rem",
          }}
        >
          {photos.map((p) => (
            <div
              key={p.id}
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  height: "80px",
                  background: "linear-gradient(135deg, #e2e8f0, #cbd5e1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  color: "#64748b",
                  fontWeight: 700,
                }}
              >
                Photo
              </div>
              <div style={{ padding: "0.5rem" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
                  {p.title}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "2px" }}>
                  {p.relation || "Family"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeletePhoto(p.id)}
                aria-label={`Remove ${p.title}`}
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  background: "rgba(15, 23, 42, 0.7)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Card 5: AI Companion & Gemini API Configuration ── */}
      <div
        style={{
          background: "#ffffff",
          border: "1.5px solid #e2e8f0",
          borderRadius: "16px",
          padding: "1.25rem",
          marginBottom: "1.25rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "0.75rem",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                margin: 0,
                color: "#0f172a",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span>AI Companion & Gemini Intelligence</span>
            </h2>
            <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
              Multi-user Gemini API Key or 100% on-device Clinical AI
            </div>
          </div>

          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              padding: "0.2rem 0.6rem",
              borderRadius: "999px",
              background:
                keyFeedback && !keyFeedback.success
                  ? "#fef2f2"
                  : geminiKey.trim() && isKeyVerified
                  ? "#ecfdf5"
                  : geminiKey.trim()
                  ? "#fffbeb"
                  : "#eff6ff",
              color:
                keyFeedback && !keyFeedback.success
                  ? "#b91c1c"
                  : geminiKey.trim() && isKeyVerified
                  ? "#065f46"
                  : geminiKey.trim()
                  ? "#b45309"
                  : "#1e40af",
              border: `1px solid ${
                keyFeedback && !keyFeedback.success
                  ? "#fecaca"
                  : geminiKey.trim() && isKeyVerified
                  ? "#a7f3d0"
                  : geminiKey.trim()
                  ? "#fde68a"
                  : "#bfdbfe"
              }`,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background:
                  keyFeedback && !keyFeedback.success
                    ? "#ef4444"
                    : geminiKey.trim() && isKeyVerified
                    ? "#10b981"
                    : geminiKey.trim()
                    ? "#f59e0b"
                    : "#3b82f6",
              }}
            />
            {keyFeedback && !keyFeedback.success
              ? "Key Error • Clinical AI Active"
              : geminiKey.trim() && isKeyVerified
              ? `Live ${verifiedModel || "Gemini"} Active`
              : geminiKey.trim()
              ? "Gemini Key Saved (Test to Verify)"
              : "Clinical AI (100% On-Device)"}
          </span>
        </div>

        <p style={{ fontSize: "0.8rem", color: "#475569", lineHeight: 1.45, margin: "0 0 0.85rem" }}>
          Evaluators and caregivers can use their own Google Gemini API key. The key is securely saved on-device and will power real-time conversational intelligence for all users. If left blank or offline, Smriti-NER automatically utilizes its internal clinical brain across all 8 Northeast Indian languages.
        </p>

        <form onSubmit={handleSaveApiKey} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ position: "relative" }}>
            <label
              htmlFor="gemini-key-input"
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#334155",
                marginBottom: "0.3rem",
              }}
            >
              Gemini API Key
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                id="gemini-key-input"
                type={showKeyMask ? "text" : "password"}
                value={geminiKey}
                onChange={(e) => {
                  setGeminiKey(e.target.value);
                  setKeyFeedback(null);
                }}
                placeholder="AIzaSy... (Paste Gemini API Key)"
                autoComplete="off"
                spellCheck={false}
                style={{
                  flex: 1,
                  padding: "0.6rem 0.85rem",
                  fontSize: "0.82rem",
                  fontFamily: "monospace",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "10px",
                  background: "#f8fafc",
                  color: "#0f172a",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowKeyMask((prev) => !prev)}
                style={{
                  padding: "0.6rem 0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "10px",
                  background: "#ffffff",
                  color: "#475569",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {showKeyMask ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Test & Save & Clear Action Buttons */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
            <button
              type="button"
              disabled={isTestingKey || !geminiKey.trim()}
              onClick={handleTestApiKey}
              style={{
                flex: "1 1 auto",
                padding: "0.6rem 0.9rem",
                fontSize: "0.78rem",
                fontWeight: 700,
                border: "1.5px solid #3b82f6",
                borderRadius: "10px",
                background: "#eff6ff",
                color: "#1d4ed8",
                cursor: isTestingKey || !geminiKey.trim() ? "not-allowed" : "pointer",
                opacity: isTestingKey || !geminiKey.trim() ? 0.6 : 1,
              }}
            >
              {isTestingKey ? "Testing Connection..." : "⚡ Test Key"}
            </button>

            <button
              type="submit"
              style={{
                flex: "1 1 auto",
                padding: "0.6rem 1rem",
                fontSize: "0.78rem",
                fontWeight: 700,
                border: "none",
                borderRadius: "10px",
                background: "#0f172a",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              Save Configuration
            </button>

            {geminiKey.trim() && (
              <button
                type="button"
                onClick={handleClearApiKey}
                style={{
                  padding: "0.6rem 0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "10px",
                  background: "#ffffff",
                  color: "#ef4444",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Key Test Feedback */}
          {keyFeedback && (
            <div
              style={{
                padding: "0.55rem 0.75rem",
                borderRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: 600,
                marginTop: "0.3rem",
                background: keyFeedback.success ? "#ecfdf5" : "#fef2f2",
                color: keyFeedback.success ? "#065f46" : "#b91c1c",
                border: `1px solid ${keyFeedback.success ? "#a7f3d0" : "#fecaca"}`,
              }}
            >
              {keyFeedback.text}
            </div>
          )}

          {/* Key Saved Message */}
          {keySavedMessage && (
            <div
              style={{
                padding: "0.55rem 0.75rem",
                borderRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: 600,
                marginTop: "0.3rem",
                background: "#f0fdf4",
                color: "#15803d",
                border: "1px solid #bbf7d0",
              }}
            >
              {keySavedMessage}
            </div>
          )}
        </form>
      </div>

      {/* ── MODAL: Add Medication / Care Item ── */}
      {isAddMedOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <form
            onSubmit={handleAddMed}
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "1.25rem",
              width: "100%",
              maxWidth: "400px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.85rem" }}>
              Add Medication or Routine Item
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem" }}>
                Title:
              </label>
              <input
                type="text"
                required
                value={medTitle}
                onChange={(e) => setMedTitle(e.target.value)}
                placeholder="e.g. Donepezil or Evening Walk"
                style={{
                  width: "100%",
                  padding: "0.55rem",
                  borderRadius: "8px",
                  border: "1.5px solid #cbd5e1",
                  boxSizing: "border-box",
                  fontSize: "0.85rem",
                }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem" }}>
                  Dosage / Note:
                </label>
                <input
                  type="text"
                  value={medDosage}
                  onChange={(e) => setMedDosage(e.target.value)}
                  placeholder="e.g. 5mg"
                  style={{
                    width: "100%",
                    padding: "0.55rem",
                    borderRadius: "8px",
                    border: "1.5px solid #cbd5e1",
                    boxSizing: "border-box",
                    fontSize: "0.85rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem" }}>
                  Scheduled Time:
                </label>
                <input
                  type="text"
                  value={medTime}
                  onChange={(e) => setMedTime(e.target.value)}
                  placeholder="e.g. 08:00 AM"
                  style={{
                    width: "100%",
                    padding: "0.55rem",
                    borderRadius: "8px",
                    border: "1.5px solid #cbd5e1",
                    boxSizing: "border-box",
                    fontSize: "0.85rem",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setIsAddMedOpen(false)}
                style={{
                  padding: "0.55rem 0.9rem",
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "0.55rem 1rem",
                  background: "#0284c7",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                Add Routine
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── MODAL: Add Family Photo ── */}
      {isAddPhotoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <form
            onSubmit={handleAddPhoto}
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "1.25rem",
              width: "100%",
              maxWidth: "400px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.85rem" }}>
              Add Family Memory Photo
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem" }}>
                Person or Memory Name:
              </label>
              <input
                type="text"
                required
                value={photoTitle}
                onChange={(e) => setPhotoTitle(e.target.value)}
                placeholder="e.g. Granddaughter Priyanka"
                style={{
                  width: "100%",
                  padding: "0.55rem",
                  borderRadius: "8px",
                  border: "1.5px solid #cbd5e1",
                  boxSizing: "border-box",
                  fontSize: "0.85rem",
                }}
              />
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem" }}>
                Kinship Relation:
              </label>
              <input
                type="text"
                value={photoRelation}
                onChange={(e) => setPhotoRelation(e.target.value)}
                placeholder="e.g. Granddaughter / Daughter / Home"
                style={{
                  width: "100%",
                  padding: "0.55rem",
                  borderRadius: "8px",
                  border: "1.5px solid #cbd5e1",
                  boxSizing: "border-box",
                  fontSize: "0.85rem",
                }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem" }}>
                Short Reassuring Story:
              </label>
              <input
                type="text"
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                placeholder="e.g. Taken during Guwahati college visit"
                style={{
                  width: "100%",
                  padding: "0.55rem",
                  borderRadius: "8px",
                  border: "1.5px solid #cbd5e1",
                  boxSizing: "border-box",
                  fontSize: "0.85rem",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setIsAddPhotoOpen(false)}
                style={{
                  padding: "0.55rem 0.9rem",
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "0.55rem 1rem",
                  background: "#0284c7",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                Save Photo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── MODAL: Edit Profile & Emergency Contacts ── */}
      {isEditProfileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <form
            onSubmit={handleSaveProfile}
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "1.25rem",
              width: "100%",
              maxWidth: "420px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.85rem" }}>
              Edit Elder Profile & Emergency Contacts
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem" }}>
                  Elder Name:
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.55rem",
                    borderRadius: "8px",
                    border: "1.5px solid #cbd5e1",
                    boxSizing: "border-box",
                    fontSize: "0.85rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem" }}>
                  Age:
                </label>
                <input
                  type="number"
                  value={editAge}
                  onChange={(e) => setEditAge(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "0.55rem",
                    borderRadius: "8px",
                    border: "1.5px solid #cbd5e1",
                    boxSizing: "border-box",
                    fontSize: "0.85rem",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem" }}>
                Home Location / Landmark:
              </label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.55rem",
                  borderRadius: "8px",
                  border: "1.5px solid #cbd5e1",
                  boxSizing: "border-box",
                  fontSize: "0.85rem",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem" }}>
                  Contact Name:
                </label>
                <input
                  type="text"
                  value={editEmergencyName}
                  onChange={(e) => setEditEmergencyName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.55rem",
                    borderRadius: "8px",
                    border: "1.5px solid #cbd5e1",
                    boxSizing: "border-box",
                    fontSize: "0.85rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem" }}>
                  Contact Phone:
                </label>
                <input
                  type="text"
                  value={editEmergencyPhone}
                  onChange={(e) => setEditEmergencyPhone(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.55rem",
                    borderRadius: "8px",
                    border: "1.5px solid #cbd5e1",
                    boxSizing: "border-box",
                    fontSize: "0.85rem",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                style={{
                  padding: "0.55rem 0.9rem",
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "0.55rem 1rem",
                  background: "#0284c7",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                Save Details
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
