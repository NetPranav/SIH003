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
import { welfareSchemeService } from "@/lib/welfareSchemeService";

interface Props {
  navigate: (target: ScreenId) => void;
}

export default function CaregiverDashboard({ navigate }: Props) {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "patient_profile"
    | "medications"
    | "memory_studio"
    | "game_telemetry"
    | "wellness_tracker"
  >("overview");

  // ── Offline Mobile Clinical State ───────────────────────────────
  const [patientProfile, setPatientProfile] = useState<PatientProfile>(() =>
    offlineMobileStore.getPatientProfile()
  );
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [profileForm, setProfileForm] = useState(() => {
    const p = offlineMobileStore.getPatientProfile();
    return {
      name: p.name,
      age: p.age,
      relation: p.relation || "Grandfather (ককা / दादाजी)",
      primaryLanguage: p.primaryLanguage || "Assamese / English",
      location: p.location || "Kamalabari, Majuli, Assam",
      clinicalCondition:
        p.clinicalCondition || "Mild Cognitive Impairment & Early Memory Loss",
      clinicalStage: p.clinicalStage || "CDR 1.0 (Mild Cognitive Decline)",
      mmseBaseline: p.mmseBaseline || 22,
      fallRisk: p.fallRisk || "Low",
      sundowningRisk: p.sundowningRisk || "Moderate",
      emergencyName: p.emergencyContact?.name || "Priyanka Baruah",
      emergencyPhone: p.emergencyContact?.phone || "+91 94350 12345",
    };
  });

  const [reminders, setReminders] = useState<OfflineReminder[]>(() =>
    offlineMobileStore.getReminders()
  );
  const [isAddMedOpen, setIsAddMedOpen] = useState<boolean>(false);
  const [editingMed, setEditingMed] = useState<OfflineReminder | null>(null);
  const [medForm, setMedForm] = useState({
    title: "",
    description: "",
    dosage: "",
    time: "8:00 AM",
    icon: "💊",
    type: "medicine" as "medicine" | "hydration" | "activity" | "nutrition",
  });

  const [albumPhotos, setAlbumPhotos] = useState<OfflineAlbumPhoto[]>(() =>
    offlineMobileStore.getAlbumPhotos()
  );
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState<boolean>(false);
  const [photoForm, setPhotoForm] = useState({
    title: "",
    nativeTitle: "",
    year: new Date().getFullYear().toString(),
    relation: "Family",
    caption: "",
    image: "/photos/festival.jpg",
  });

  // Daily Wellness & Observation State
  const [wellnessMood, setWellnessMood] = useState<
    "calm" | "happy" | "restless" | "agitated"
  >("calm");
  const [wellnessSleep, setWellnessSleep] = useState<number>(7.5);
  const [wellnessHydration, setWellnessHydration] = useState<number>(6);
  const [wellnessSundowning, setWellnessSundowning] = useState<boolean>(false);
  const [wellnessSaved, setWellnessSaved] = useState<boolean>(false);

  // Caregiver Stress Check (ZBI-4)
  const [zbiAnswers, setZbiAnswers] = useState<number[]>([1, 0, 1, 0]);
  const zbiTotalScore = zbiAnswers.reduce((acc, v) => acc + v, 0);

  const [offlineStats, setOfflineStats] = useState(() => ({
    adherenceRate: offlineMobileStore.getAdherenceRate(),
    completedGames: offlineMobileStore.getTodayCompletedGamesCount(),
    totalSessions: offlineMobileStore.getGameSessions().length,
    vitalityScore: offlineMobileStore.getCognitiveVitalityScore(),
    latestWellness: offlineMobileStore.getLatestWellness(),
  }));

  // Reactive subscription to offline mobile store
  useEffect(() => {
    return offlineMobileStore.subscribe(() => {
      setPatientProfile(offlineMobileStore.getPatientProfile());
      setReminders(offlineMobileStore.getReminders());
      setAlbumPhotos(offlineMobileStore.getAlbumPhotos());
      setOfflineStats({
        adherenceRate: offlineMobileStore.getAdherenceRate(),
        completedGames: offlineMobileStore.getTodayCompletedGamesCount(),
        totalSessions: offlineMobileStore.getGameSessions().length,
        vitalityScore: offlineMobileStore.getCognitiveVitalityScore(),
        latestWellness: offlineMobileStore.getLatestWellness(),
      });
    });
  }, []);

  // ── Caretaker Action Handlers ─────────────────────────────────────
  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    offlineMobileStore.updatePatientProfile({
      name: profileForm.name,
      age: Number(profileForm.age) || 74,
      relation: profileForm.relation,
      primaryLanguage: profileForm.primaryLanguage,
      location: profileForm.location,
      clinicalCondition: profileForm.clinicalCondition,
      clinicalStage: profileForm.clinicalStage,
      mmseBaseline: Number(profileForm.mmseBaseline) || 22,
      fallRisk: profileForm.fallRisk,
      sundowningRisk: profileForm.sundowningRisk,
      emergencyContact: {
        name: profileForm.emergencyName,
        phone: profileForm.emergencyPhone,
      },
    });
    setPatientProfile(offlineMobileStore.getPatientProfile());
    setIsEditProfileOpen(false);
    triggerHaptic("success");
    playGentleChime();
  };

  const handleToggleMedication = (id: string) => {
    offlineMobileStore.toggleReminder(id);
    setReminders(offlineMobileStore.getReminders());
    triggerHaptic("tap");
    playGentleChime();
  };

  const openAddMedication = () => {
    setEditingMed(null);
    setMedForm({
      title: "",
      description: "",
      dosage: "",
      time: "8:00 AM",
      icon: "💊",
      type: "medicine",
    });
    setIsAddMedOpen(true);
  };

  const openEditMedication = (med: OfflineReminder) => {
    setEditingMed(med);
    setMedForm({
      title: med.title,
      description: med.description,
      dosage: med.dosage || "",
      time: med.time,
      icon: med.icon,
      type: med.type,
    });
    setIsAddMedOpen(true);
  };

  const handleSaveMedication = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!medForm.title.trim()) return;
    if (editingMed) {
      offlineMobileStore.updateReminder(editingMed.id, {
        title: medForm.title,
        description: medForm.description,
        dosage: medForm.dosage,
        time: medForm.time,
        icon: medForm.icon,
        type: medForm.type,
      });
    } else {
      offlineMobileStore.addReminder({
        title: medForm.title,
        description: medForm.description,
        dosage: medForm.dosage,
        time: medForm.time,
        icon: medForm.icon,
        type: medForm.type,
      });
    }
    setReminders(offlineMobileStore.getReminders());
    setIsAddMedOpen(false);
    triggerHaptic("success");
    playGentleChime();
  };

  const handleDeleteMedication = (id: string) => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Remove this medication / routine item?")
    ) {
      offlineMobileStore.deleteReminder(id);
      setReminders(offlineMobileStore.getReminders());
      triggerHaptic("warning");
    }
  };

  const openAddPhoto = () => {
    setPhotoForm({
      title: "",
      nativeTitle: "",
      year: new Date().getFullYear().toString(),
      relation: "Family",
      caption: "",
      image: "/photos/festival.jpg",
    });
    setIsAddPhotoOpen(true);
  };

  const handleSavePhoto = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!photoForm.title.trim() || !photoForm.caption.trim()) return;
    offlineMobileStore.addAlbumPhoto({
      title: photoForm.title,
      nativeTitle: photoForm.nativeTitle || photoForm.title,
      year: photoForm.year,
      relation: photoForm.relation,
      caption: photoForm.caption,
      image: photoForm.image,
    });
    setAlbumPhotos(offlineMobileStore.getAlbumPhotos());
    setIsAddPhotoOpen(false);
    triggerHaptic("success");
    playGentleChime();
  };

  const handleDeletePhoto = (id: string) => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Remove this memory photograph from the album?")
    ) {
      offlineMobileStore.deleteAlbumPhoto(id);
      setAlbumPhotos(offlineMobileStore.getAlbumPhotos());
      triggerHaptic("warning");
    }
  };

  const handleSpeakStory = (caption: string) => {
    playGentleChime();
    speakSpokenVoice(caption, "en");
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "1rem 1rem 5rem 1rem",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      {/* ── Top Header & Return to Elder Mode ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
          paddingBottom: "1rem",
          marginBottom: "1rem",
          borderBottom: "1.5px solid var(--gray-200)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🌿</span>
            <h1
              style={{
                fontSize: "1.35rem",
                fontWeight: 900,
                color: "var(--gray-900)",
                margin: 0,
              }}
            >
              Smriti Caretaker Hub
            </h1>
            <span
              style={{
                background: "#ecfdf5",
                color: "#065f46",
                fontSize: "0.7rem",
                fontWeight: 800,
                padding: "0.15rem 0.5rem",
                borderRadius: "999px",
                border: "1px solid #a7f3d0",
              }}
            >
              ● On-Device Offline Storage
            </span>
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--gray-500)",
              marginTop: "0.15rem",
            }}
          >
            পৰিচৰ্যা নিয়ন্ত্ৰণ কক্ষ • Daily care, medications, memories &amp; activity tracking
          </div>
        </div>

        <button
          onClick={() => {
            triggerHaptic("tap");
            playAudioFeedback();
            navigate("home");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.55rem 1.1rem",
            background: "var(--white)",
            border: "1.5px solid var(--gray-300)",
            borderRadius: "var(--radius-lg)",
            color: "var(--gray-800)",
            fontSize: "0.82rem",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span>←</span>
          <span>Return to Elder Mode (ঘৰলৈ)</span>
        </button>
      </div>

      {/* ── Elder Quick Identity Strip ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #eff6ff, #f8fafc)",
          border: "1.5px solid #bfdbfe",
          borderRadius: "var(--radius-xl)",
          padding: "1rem 1.25rem",
          marginBottom: "1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "#dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              border: "2px solid #93c5fd",
            }}
          >
            👴
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.05rem", fontWeight: 900, color: "var(--gray-900)" }}>
                {patientProfile.name}
              </span>
              <span
                style={{
                  background: "#e0e7ff",
                  color: "#3730a3",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  padding: "0.15rem 0.5rem",
                  borderRadius: "999px",
                }}
              >
                {patientProfile.relation || "Grandfather"}
              </span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--gray-600)", marginTop: "0.15rem" }}>
              Age: {patientProfile.age} • {patientProfile.location} • Stage: {patientProfile.clinicalStage || "CDR 1.0"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <a
            href={`tel:${(patientProfile.emergencyContact?.phone || "+919435012345").replace(/\s+/g, "")}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.45rem 0.85rem",
              background: "#ecfdf5",
              color: "#065f46",
              border: "1px solid #a7f3d0",
              borderRadius: "var(--radius)",
              fontSize: "0.78rem",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            <span>📞</span>
            <span>Fast Call ({patientProfile.emergencyContact?.name || "Caregiver"})</span>
          </a>

          <button
            onClick={() => {
              setProfileForm({
                name: patientProfile.name,
                age: patientProfile.age,
                relation: patientProfile.relation || "Grandfather",
                primaryLanguage: patientProfile.primaryLanguage || "Assamese",
                location: patientProfile.location || "Kamalabari, Majuli, Assam",
                clinicalCondition: patientProfile.clinicalCondition || "Mild Cognitive Impairment",
                clinicalStage: patientProfile.clinicalStage || "CDR 1.0 (Mild)",
                mmseBaseline: patientProfile.mmseBaseline || 22,
                fallRisk: patientProfile.fallRisk || "Low",
                sundowningRisk: patientProfile.sundowningRisk || "Moderate",
                emergencyName: patientProfile.emergencyContact?.name || "Priyanka Baruah",
                emergencyPhone: patientProfile.emergencyContact?.phone || "+91 94350 12345",
              });
              setIsEditProfileOpen(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.45rem 0.85rem",
              background: "var(--primary)",
              color: "#ffffff",
              border: "none",
              borderRadius: "var(--radius)",
              fontSize: "0.78rem",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            <span>✏️</span>
            <span>Edit Details</span>
          </button>
        </div>
      </div>

      {/* ── 6 Practical Caretaker Tabs (No Developer Boilerplate) ── */}
      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          overflowX: "auto",
          paddingBottom: "0.4rem",
          marginBottom: "1.25rem",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {[
          { id: "overview", label: "🏠 Overview" },
          { id: "patient_profile", label: "👤 Elder Profile" },
          { id: "medications", label: "💊 Daily Medications & Routine" },
          { id: "memory_studio", label: "🖼️ Family Memories" },
          { id: "game_telemetry", label: "🎮 Brain Exercises Record" },
          { id: "wellness_tracker", label: "🌿 Daily Care & Mood" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              triggerHaptic("tap");
            }}
            style={{
              flexShrink: 0,
              padding: "0.55rem 0.9rem",
              borderRadius: "var(--radius)",
              border:
                activeTab === tab.id
                  ? "2px solid var(--primary)"
                  : "1.5px solid var(--gray-200)",
              background: activeTab === tab.id ? "var(--primary)" : "var(--white)",
              color: activeTab === tab.id ? "#ffffff" : "var(--gray-700)",
              fontWeight: 800,
              fontSize: "0.82rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow:
                activeTab === tab.id
                  ? "0 2px 6px rgba(0,0,0,0.15)"
                  : "var(--shadow-sm)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB 1: OVERVIEW (Daily Summary for the Family Caretaker)
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* 4 Care Status Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.85rem",
            }}
          >
            <div
              style={{
                background: "var(--white)",
                border: "1.5px solid var(--gray-200)",
                borderRadius: "var(--radius-lg)",
                padding: "1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 700 }}>
                  TODAY'S MEDICINES
                </span>
                <span>💊</span>
              </div>
              <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#16a34a", marginTop: "0.25rem" }}>
                {offlineStats.adherenceRate}%
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--gray-600)", marginTop: "0.15rem" }}>
                {reminders.filter((r) => r.completed).length} of {reminders.length} items taken today
              </div>
            </div>

            <div
              style={{
                background: "var(--white)",
                border: "1.5px solid var(--gray-200)",
                borderRadius: "var(--radius-lg)",
                padding: "1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 700 }}>
                  BRAIN EXERCISES
                </span>
                <span>🎯</span>
              </div>
              <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--primary)", marginTop: "0.25rem" }}>
                {offlineStats.completedGames} / 4
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--gray-600)", marginTop: "0.15rem" }}>
                Cultural games played today
              </div>
            </div>

            <div
              style={{
                background: "var(--white)",
                border: "1.5px solid var(--gray-200)",
                borderRadius: "var(--radius-lg)",
                padding: "1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 700 }}>
                  COGNITIVE VITALITY
                </span>
                <span>🧠</span>
              </div>
              <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#0284c7", marginTop: "0.25rem" }}>
                {offlineStats.vitalityScore}%
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--gray-600)", marginTop: "0.15rem" }}>
                Active &amp; engaged mental baseline
              </div>
            </div>

            <div
              style={{
                background: "var(--white)",
                border: "1.5px solid var(--gray-200)",
                borderRadius: "var(--radius-lg)",
                padding: "1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 700 }}>
                  EVENING SUNDOWNING
                </span>
                <span>🌅</span>
              </div>
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 900,
                  color: patientProfile.sundowningRisk === "High" ? "#dc2626" : "#059669",
                  marginTop: "0.4rem",
                }}
              >
                {patientProfile.sundowningRisk || "Moderate"}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--gray-600)", marginTop: "0.15rem" }}>
                Twilight agitation observation
              </div>
            </div>
          </div>

          {/* Quick Routine Checklist */}
          <div
            style={{
              background: "var(--white)",
              border: "1.5px solid var(--gray-200)",
              borderRadius: "var(--radius-xl)",
              padding: "1.25rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--gray-900)", margin: 0 }}>
                  Today's Medication &amp; Daily Routine
                </h3>
                <p style={{ fontSize: "0.78rem", color: "var(--gray-500)", margin: "0.15rem 0 0 0" }}>
                  Live sync with elder's reminders screen — tap to mark taken or review timing
                </p>
              </div>
              <button
                onClick={openAddMedication}
                style={{
                  padding: "0.45rem 0.85rem",
                  background: "var(--primary)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "var(--radius)",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                ➕ Add Item
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {reminders.map((med) => (
                <div
                  key={med.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius)",
                    border: med.completed ? "1.5px solid #86efac" : "1.5px solid var(--gray-200)",
                    background: med.completed ? "#f0fdf4" : "var(--white)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "1.35rem" }}>{med.icon || "💊"}</span>
                    <div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--gray-900)" }}>
                        {med.title}
                        {med.dosage && (
                          <span style={{ fontWeight: 600, color: "var(--gray-600)", marginLeft: "0.4rem" }}>
                            ({med.dosage})
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "var(--gray-500)" }}>
                        ⏰ Scheduled: <strong>{med.time}</strong> • {med.description}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span
                      style={{
                        padding: "0.2rem 0.55rem",
                        borderRadius: "999px",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        background: med.completed ? "#dcfce7" : "#fef3c7",
                        color: med.completed ? "#166534" : "#b45309",
                      }}
                    >
                      {med.completed ? "✅ Taken" : "⏰ Due"}
                    </span>
                    <button
                      onClick={() => handleToggleMedication(med.id)}
                      style={{
                        padding: "0.35rem 0.75rem",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--gray-300)",
                        background: "var(--white)",
                        fontSize: "0.75rem",
                        fontWeight: 750,
                        cursor: "pointer",
                      }}
                    >
                      {med.completed ? "Undo" : "Mark Taken"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Compassionate Guidance Card for Caregivers */}
          <div
            style={{
              background: "#eff6ff",
              border: "1.5px solid #bfdbfe",
              borderRadius: "var(--radius-xl)",
              padding: "1.1rem 1.3rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>💡</span>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#1e3a8a", margin: 0 }}>
                Compassionate Dementia Care Tips for Today
              </h4>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.85rem", marginTop: "0.75rem" }}>
              <div style={{ fontSize: "0.8rem", color: "#1e40af", lineHeight: "1.4" }}>
                • <strong>Gentle Routine</strong>: Keep daily walking and meal timings predictable. Routine gives a sense of security when recent memory fluctuates.
              </div>
              <div style={{ fontSize: "0.8rem", color: "#1e40af", lineHeight: "1.4" }}>
                • <strong>Prevent Twilight Agitation</strong>: Turn on warm, soft lights indoors around 5:00 PM to prevent confusing shadows during sunset transitions.
              </div>
              <div style={{ fontSize: "0.8rem", color: "#1e40af", lineHeight: "1.4" }}>
                • <strong>Reminiscence Audio</strong>: When agitated, play familiar Bihu folk melodies or family photos from the Memory Studio tab.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 2: ELDER PROFILE (Bio, Staging, Emergency & Welfare Benefits)
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === "patient_profile" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div
            style={{
              background: "var(--white)",
              border: "1.5px solid var(--gray-200)",
              borderRadius: "var(--radius-xl)",
              padding: "1.3rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--gray-900)", margin: 0 }}>
                  Elder Clinical &amp; Personal Profile
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--gray-500)", margin: "0.15rem 0 0 0" }}>
                  Essential identity, dementia staging, and primary emergency contacts
                </p>
              </div>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                style={{
                  padding: "0.5rem 1rem",
                  background: "var(--primary)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "var(--radius)",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                ✏️ Edit Details
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
              <div style={{ background: "#f8fafc", padding: "0.9rem", borderRadius: "var(--radius)", border: "1px solid var(--gray-200)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--gray-500)" }}>FULL NAME &amp; NATIVE SCRIPT</div>
                <div style={{ fontSize: "1rem", fontWeight: 850, color: "var(--gray-900)", marginTop: "0.2rem" }}>
                  {patientProfile.name}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--gray-600)", marginTop: "0.15rem" }}>
                  Age: <strong>{patientProfile.age} years</strong> • Family Relation: <strong>{patientProfile.relation || "Grandfather"}</strong>
                </div>
              </div>

              <div style={{ background: "#f8fafc", padding: "0.9rem", borderRadius: "var(--radius)", border: "1px solid var(--gray-200)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--gray-500)" }}>RESIDENTIAL LOCATION &amp; LANGUAGE</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--gray-900)", marginTop: "0.2rem" }}>
                  {patientProfile.location || "Kamalabari, Majuli, Assam"}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--gray-600)", marginTop: "0.15rem" }}>
                  Primary Dialect: <strong>{patientProfile.primaryLanguage || "Assamese / English"}</strong>
                </div>
              </div>

              <div style={{ background: "#f8fafc", padding: "0.9rem", borderRadius: "var(--radius)", border: "1px solid var(--gray-200)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--gray-500)" }}>CLINICAL DIAGNOSIS &amp; STAGING</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--primary)", marginTop: "0.2rem" }}>
                  {patientProfile.clinicalCondition || "Mild Cognitive Impairment (MCI)"}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--gray-600)", marginTop: "0.15rem" }}>
                  Staging: <strong>{patientProfile.clinicalStage || "CDR 1.0"}</strong> • Baseline MMSE: <strong>{patientProfile.mmseBaseline || 22}/30</strong>
                </div>
              </div>

              <div style={{ background: "#f8fafc", padding: "0.9rem", borderRadius: "var(--radius)", border: "1px solid var(--gray-200)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--gray-500)" }}>EMERGENCY CONTACT &amp; FAST-DIAL</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 850, color: "var(--gray-900)", marginTop: "0.2rem" }}>
                  {patientProfile.emergencyContact?.name || "Priyanka Baruah"} ({patientProfile.emergencyContact?.phone || "+91 94350 12345"})
                </div>
                <a
                  href={`tel:${(patientProfile.emergencyContact?.phone || "+919435012345").replace(/\s+/g, "")}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    marginTop: "0.35rem",
                    padding: "0.3rem 0.7rem",
                    background: "#ecfdf5",
                    color: "#065f46",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    textDecoration: "none",
                    border: "1px solid #a7f3d0",
                  }}
                >
                  📞 1-Tap Emergency Fast Call
                </a>
              </div>
            </div>
          </div>

          {/* Rashtriya Vayoshri Yojana (RVY) & NPHCE Welfare Benefits Card */}
          {(() => {
            const rvy = welfareSchemeService.evaluateRvyEligibility(
              patientProfile.id,
              patientProfile.age,
              true,
              12000
            );
            return (
              <div
                style={{
                  background: "var(--white)",
                  border: "1.5px solid #bfdbfe",
                  borderRadius: "var(--radius-xl)",
                  padding: "1.3rem",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "1.2rem" }}>🏛️</span>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1e3a8a", margin: 0 }}>
                        Free Government Elder Assistive Benefits (RVY &amp; NPHCE)
                      </h4>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "999px",
                          background: "#dcfce7",
                          color: "#166534",
                        }}
                      >
                        100% Fully Subsidized
                      </span>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "var(--gray-600)", marginTop: "0.25rem" }}>
                      Assistance under Ministry of Social Justice &amp; Empowerment (ALIMCO) &amp; National Health Mission
                    </p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#16a34a" }}>
                      ₹{rvy.recommended_bundle.estimated_value_inr} Grant
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--gray-500)", fontWeight: 700 }}>
                      Cognitive Assistive Living Kit
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                  <div style={{ background: "#eff6ff", borderRadius: "var(--radius)", padding: "0.85rem", border: "1px solid #dbeafe" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#1e40af" }}>RECOMMENDED ASSISTIVE BUNDLE</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--gray-900)", marginTop: "0.2rem" }}>
                      {rvy.recommended_bundle.bundle_name}
                    </div>
                    <ul style={{ margin: "0.4rem 0 0 1.1rem", padding: 0, fontSize: "0.78rem", color: "var(--gray-700)", lineHeight: "1.4" }}>
                      {rvy.recommended_bundle.items.map((item, idx) => (
                        <li key={idx}><strong>{item}</strong></li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: "#f0fdf4", borderRadius: "var(--radius)", padding: "0.85rem", border: "1px solid #bbf7d0" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#166534" }}>LOCAL HEALTHCARE CLINICAL CONNECTIONS</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--gray-800)", marginTop: "0.25rem" }}>
                      • <strong>AB-HWC Kamalabari</strong>: Monthly home checkups &amp; free essential medicines<br />
                      • <strong>Majuli District Hospital</strong>: Dedicated Geriatric OPD &amp; memory screening<br />
                      • <strong>Tele-MANAS</strong>: 14416 (24x7 Dementia Crisis Helpline)
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#15803d", fontWeight: 700, marginTop: "0.4rem" }}>
                      ASHA Worker: <strong>Jonali Saikia</strong> (+91 98540 67890)
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 3: MEDICATIONS & ROUTINE MANAGER (Full Caretaker CRUD Suite)
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === "medications" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div
            style={{
              background: "var(--white)",
              border: "1.5px solid var(--gray-200)",
              borderRadius: "var(--radius-xl)",
              padding: "1.3rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--gray-900)", margin: 0 }}>
                  Daily Medications &amp; Care Routine
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--gray-500)", margin: "0.15rem 0 0 0" }}>
                  Schedule medicines, water intake, and daily habits. Synchronized live to the elder's app.
                </p>
              </div>

              <button
                onClick={openAddMedication}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.55rem 1.1rem",
                  background: "var(--primary)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "var(--radius)",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                <span>➕</span>
                <span>Add Medication / Routine</span>
              </button>
            </div>

            {/* List of Medications */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {reminders.map((med) => (
                <div
                  key={med.id}
                  style={{
                    background: med.completed ? "#f0fdf4" : "var(--white)",
                    border: med.completed ? "1.5px solid #86efac" : "1.5px solid var(--gray-200)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                    <span style={{ fontSize: "1.6rem" }}>{med.icon || "💊"}</span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.95rem", fontWeight: 850, color: "var(--gray-900)" }}>
                          {med.title}
                        </span>
                        {med.dosage && (
                          <span
                            style={{
                              background: "#e0f2fe",
                              color: "#0369a1",
                              fontSize: "0.72rem",
                              fontWeight: 800,
                              padding: "0.15rem 0.5rem",
                              borderRadius: "999px",
                            }}
                          >
                            {med.dosage}
                          </span>
                        )}
                        <span
                          style={{
                            padding: "0.15rem 0.5rem",
                            borderRadius: "999px",
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            background: med.completed ? "#dcfce7" : "#fef3c7",
                            color: med.completed ? "#166534" : "#b45309",
                          }}
                        >
                          {med.completed ? "✅ Taken" : "⏰ Due"}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--gray-500)", marginTop: "0.2rem" }}>
                        ⏰ Timing: <strong>{med.time}</strong> • Instructions: {med.description}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleToggleMedication(med.id)}
                      style={{
                        padding: "0.4rem 0.8rem",
                        borderRadius: "var(--radius)",
                        border: "1px solid var(--gray-300)",
                        background: med.completed ? "#ffffff" : "#ecfdf5",
                        color: med.completed ? "var(--gray-700)" : "#065f46",
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {med.completed ? "Undo Status" : "Mark Taken"}
                    </button>
                    <button
                      onClick={() => openEditMedication(med)}
                      style={{
                        padding: "0.4rem 0.8rem",
                        borderRadius: "var(--radius)",
                        border: "1px solid var(--gray-300)",
                        background: "var(--white)",
                        color: "var(--gray-700)",
                        fontSize: "0.78rem",
                        fontWeight: 750,
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMedication(med.id)}
                      style={{
                        padding: "0.4rem 0.65rem",
                        borderRadius: "var(--radius)",
                        border: "1px solid #fecaca",
                        background: "#fff1f2",
                        color: "#be123c",
                        fontSize: "0.78rem",
                        fontWeight: 750,
                        cursor: "pointer",
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 4: FAMILY MEMORIES & PHOTO STUDIO
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === "memory_studio" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div
            style={{
              background: "var(--white)",
              border: "1.5px solid var(--gray-200)",
              borderRadius: "var(--radius-xl)",
              padding: "1.3rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--gray-900)", margin: 0 }}>
                  Family Memory Studio
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--gray-500)", margin: "0.15rem 0 0 0" }}>
                  Upload cherished family moments and stories to anchor the elder's sense of identity and calm
                </p>
              </div>

              <button
                onClick={openAddPhoto}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.55rem 1.1rem",
                  background: "var(--primary)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "var(--radius)",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                <span>➕</span>
                <span>Add Family Photo &amp; Story</span>
              </button>
            </div>

            {/* Gallery of Memories */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {albumPhotos.map((photo) => (
                <div
                  key={photo.id}
                  style={{
                    background: "var(--white)",
                    border: "1.5px solid var(--gray-200)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div
                    style={{
                      height: "170px",
                      background: "#f1f5f9",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Fallback image display */}
                    <img
                      src={photo.image}
                      alt={photo.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/photos/festival.jpg";
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "rgba(0,0,0,0.75)",
                        color: "#ffffff",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        padding: "0.2rem 0.55rem",
                        borderRadius: "999px",
                      }}
                    >
                      {photo.year}
                    </span>
                  </div>

                  <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 850, color: "var(--gray-900)", margin: 0 }}>
                        {photo.title}
                      </h4>
                      <span
                        style={{
                          background: "#e0e7ff",
                          color: "#3730a3",
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          padding: "0.15rem 0.45rem",
                          borderRadius: "999px",
                        }}
                      >
                        {photo.relation}
                      </span>
                    </div>
                    {photo.nativeTitle && (
                      <div style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 700, marginTop: "0.15rem" }}>
                        {photo.nativeTitle}
                      </div>
                    )}
                    <p style={{ fontSize: "0.8rem", color: "var(--gray-600)", lineHeight: "1.4", margin: "0.5rem 0 0 0", flex: 1 }}>
                      {photo.caption}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.85rem", paddingTop: "0.65rem", borderTop: "1px solid var(--gray-100)" }}>
                      <button
                        onClick={() => handleSpeakStory(photo.caption)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          padding: "0.35rem 0.75rem",
                          background: "#eff6ff",
                          color: "#1e40af",
                          border: "1px solid #bfdbfe",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        <span>🔊</span>
                        <span>Listen to Story</span>
                      </button>

                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        style={{
                          padding: "0.35rem 0.6rem",
                          background: "#fff1f2",
                          color: "#be123c",
                          border: "1px solid #fecaca",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.75rem",
                          fontWeight: 750,
                          cursor: "pointer",
                        }}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 5: BRAIN GAMES & COGNITIVE TELEMETRY RECORD
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === "game_telemetry" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div
            style={{
              background: "var(--white)",
              border: "1.5px solid var(--gray-200)",
              borderRadius: "var(--radius-xl)",
              padding: "1.3rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--gray-900)", margin: 0 }}>
                Brain Exercises &amp; Cognitive Records
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--gray-500)", margin: "0.15rem 0 0 0" }}>
                Real-time performance across the 4 cultural cognitive games
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {/* Game 1: Dhol-Pepa Rhythm */}
              <div style={{ background: "#faf5ff", border: "1.5px solid #e9d5ff", borderRadius: "var(--radius-lg)", padding: "1.1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <span style={{ fontSize: "1.35rem" }}>🥁</span>
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 850, color: "#6b21a8", margin: 0 }}>
                        Dhol-Pepa Rhythm
                      </h4>
                      <div style={{ fontSize: "0.7rem", color: "#9333ea" }}>
                        ঢোল-পেঁপা ছন্দ • Motor Timing &amp; Rhythm
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#6b21a8" }}>92%</span>
                </div>
                <div style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "var(--gray-700)", lineHeight: "1.4" }}>
                  • Average Tap Speed: <strong>520 ms</strong> (Normal coordination)<br />
                  • Calming Pacing: <strong>Active</strong> with chime cues<br />
                  • Sessions Played Today: <strong>2 rounds</strong>
                </div>
              </div>

              {/* Game 2: Kaziranga Safari */}
              <div style={{ background: "#ecfdf5", border: "1.5px solid #a7f3d0", borderRadius: "var(--radius-lg)", padding: "1.1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <span style={{ fontSize: "1.35rem" }}>🦏</span>
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 850, color: "#065f46", margin: 0 }}>
                        Kaziranga Safari
                      </h4>
                      <div style={{ fontSize: "0.7rem", color: "#059669" }}>
                        কাজিৰঙা ভ্ৰমণ • Visual Search &amp; Attention
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#065f46" }}>92%</span>
                </div>
                <div style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "var(--gray-700)", lineHeight: "1.4" }}>
                  • Animals Identified: <strong>Rhino, Hornbill, Wild Buffalo</strong><br />
                  • Visual Search Assistance: <strong>Golden Halo Guidance</strong><br />
                  • Difficulty Level: <strong>Tier 2 (Gentle Pace)</strong>
                </div>
              </div>

              {/* Game 3: Weaver's Loom */}
              <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: "var(--radius-lg)", padding: "1.1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <span style={{ fontSize: "1.35rem" }}>🧵</span>
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 850, color: "#92400e", margin: 0 }}>
                        Weaver's Loom
                      </h4>
                      <div style={{ fontSize: "0.7rem", color: "#b45309" }}>
                        বয়নশাল • Pattern Focus &amp; Silk Colors
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#92400e" }}>88%</span>
                </div>
                <div style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "var(--gray-700)", lineHeight: "1.4" }}>
                  • Color Accuracy: <strong>5 Authentic Silk Dyes</strong> (Muga, Madder, etc.)<br />
                  • Tremor Assistance: <strong>Stabilized Spools</strong> (High contrast borders)<br />
                  • Weave Borders Completed: <strong>3 Traditional Borders</strong>
                </div>
              </div>

              {/* Game 4: Daily Haat Bazaar */}
              <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: "var(--radius-lg)", padding: "1.1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <span style={{ fontSize: "1.35rem" }}>🧺</span>
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 850, color: "#1e40af", margin: 0 }}>
                        Daily Haat Bazaar
                      </h4>
                      <div style={{ fontSize: "0.7rem", color: "#2563eb" }}>
                        দৈনন্দিন হাট • Everyday Recall &amp; Math
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#1e40af" }}>85%</span>
                </div>
                <div style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "var(--gray-700)", lineHeight: "1.4" }}>
                  • Grocery Memory Recall: <strong>Fresh Tea, Mustard, Ginger</strong><br />
                  • Simple Coin Calculation: <strong>Accurate change count</strong><br />
                  • Routine Familiarity: <strong>Village Weekly Market</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 6: DAILY CARE, MOOD & EVENING OBSERVATIONS
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === "wellness_tracker" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Elder Daily Mood, Sleep & Sundowning Check */}
          <div
            style={{
              background: "var(--white)",
              border: "1.5px solid var(--gray-200)",
              borderRadius: "var(--radius-xl)",
              padding: "1.3rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.35rem" }}>
              Elder Daily Mood &amp; Evening Twilight Log
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginBottom: "1.1rem" }}>
              Record sleep, water intake, emotional state, and evening twilight agitation
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.1rem" }}>
              {/* Mood selector */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--gray-700)", display: "block", marginBottom: "0.4rem" }}>
                  Observed Emotional Mood:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {[
                    { id: "calm", label: "Calm & Serene", icon: "😌" },
                    { id: "happy", label: "Joyful / Engaged", icon: "😊" },
                    { id: "restless", label: "Restless / Wandering", icon: "🚶‍♂️" },
                    { id: "agitated", label: "Agitated / Distressed", icon: "😟" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setWellnessMood(m.id as any)}
                      style={{
                        padding: "0.6rem 0.5rem",
                        borderRadius: "var(--radius)",
                        border: wellnessMood === m.id ? "2px solid var(--primary)" : "1.5px solid var(--gray-200)",
                        background: wellnessMood === m.id ? "#eff6ff" : "var(--white)",
                        color: wellnessMood === m.id ? "var(--primary)" : "var(--gray-700)",
                        fontWeight: 750,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <span>{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep & Hydration */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 800, color: "var(--gray-700)" }}>
                    <span>Night Sleep Duration:</span>
                    <span style={{ color: "var(--primary)" }}>{wellnessSleep} hours</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    step="0.5"
                    value={wellnessSleep}
                    onChange={(e) => setWellnessSleep(parseFloat(e.target.value))}
                    style={{ width: "100%", marginTop: "0.4rem" }}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 800, color: "var(--gray-700)" }}>
                    <span>Hydration (Glasses of Water):</span>
                    <span style={{ color: "#0284c7" }}>{wellnessHydration} glasses</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    value={wellnessHydration}
                    onChange={(e) => setWellnessHydration(parseInt(e.target.value, 10))}
                    style={{ width: "100%", marginTop: "0.4rem" }}
                  />
                </div>
              </div>
            </div>

            {/* Sundowning check */}
            <div
              style={{
                marginTop: "1rem",
                padding: "0.85rem",
                background: wellnessSundowning ? "#fef2f2" : "#f8fafc",
                borderRadius: "var(--radius)",
                border: "1px solid var(--gray-200)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: wellnessSundowning ? "#991b1b" : "var(--gray-800)" }}>
                  Evening Sundowning / Twilight Restlessness Observed Today?
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--gray-500)" }}>
                  Pacing, confusion, or agitation during the 5:00 PM – 8:00 PM sunset transition
                </div>
              </div>
              <input
                type="checkbox"
                checked={wellnessSundowning}
                onChange={(e) => setWellnessSundowning(e.target.checked)}
                style={{ width: 22, height: 22, cursor: "pointer" }}
              />
            </div>

            <div style={{ marginTop: "1.1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => {
                  offlineMobileStore.saveWellnessLog({
                    mood: wellnessMood,
                    sleepHours: wellnessSleep,
                    hydrationGlasses: wellnessHydration,
                    sundowningObserved: wellnessSundowning,
                    sundowningEpisode: wellnessSundowning,
                  });
                  setWellnessSaved(true);
                  triggerHaptic("success");
                  setTimeout(() => setWellnessSaved(false), 3000);
                }}
                style={{
                  padding: "0.65rem 1.4rem",
                  background: "var(--primary)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "var(--radius)",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                💾 Save Daily Observation
              </button>
              {wellnessSaved && (
                <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#16a34a" }}>
                  ✅ Saved securely to offline mobile storage!
                </span>
              )}
            </div>
          </div>

          {/* Caregiver Mental Resilience & Support (ZBI-4 Screener) */}
          <div
            style={{
              background: "var(--white)",
              border: zbiTotalScore >= 9 ? "2px solid #ef4444" : "1.5px solid var(--gray-200)",
              borderRadius: "var(--radius-xl)",
              padding: "1.3rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gray-900)", margin: 0 }}>
                    Caregiver Wellness &amp; Stress Screener
                  </h3>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "999px",
                      background: zbiTotalScore >= 9 ? "#fee2e2" : zbiTotalScore >= 5 ? "#fef3c7" : "#dcfce7",
                      color: zbiTotalScore >= 9 ? "#b91c1c" : zbiTotalScore >= 5 ? "#b45309" : "#15803d",
                    }}
                  >
                    {zbiTotalScore >= 9 ? "Severe Fatigue Risk" : zbiTotalScore >= 5 ? "Moderate Stress" : "Healthy Coping"}
                  </span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginTop: "0.2rem" }}>
                  Gentle 4-item self-check to safeguard your emotional health while caring for your loved one
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.3rem", fontWeight: 900, color: zbiTotalScore >= 9 ? "#ef4444" : "var(--primary)" }}>
                  {zbiTotalScore} / 16
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--gray-500)", fontWeight: 700 }}>Total Stress Score</div>
              </div>
            </div>

            {/* Questions Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginTop: "1rem" }}>
              {[
                {
                  id: 0,
                  question: "Do you feel you don't have enough time for yourself because of caregiving?",
                  native: "আপুনি অনুভৱ কৰেনে যে পৰিচৰ্যাৰ বাবে নিজৰ বাবে সময়ৰ নাটনি হৈছে?",
                },
                {
                  id: 1,
                  question: "Do you feel stressed trying to meet family, work, and caregiving duties?",
                  native: "পৰিয়ালৰ পৰিচৰ্যা আৰু আন দায়িত্বসমূহৰ মাজত আপুনি মানসিক চাপ অনুভৱ কৰেনে?",
                },
                {
                  id: 2,
                  question: "Do you feel uncertain about how to care for your loved one or where to find help?",
                  native: "চিকিৎসা বা যত্নৰ বাবে কি কৰা উচিত বা ক'ত সহায় বিচাৰিব লাগে তাক লৈ অনিশ্চিতনে?",
                },
                {
                  id: 3,
                  question: "Do you feel strained or emotionally overwhelmed while caring for your relative?",
                  native: "আপুনি পৰিচৰ্যা কৰাৰ সময়ত ভাগৰি পৰা বা অত্যাধিক মানসিক চাপ অনুভৱ কৰেনে?",
                },
              ].map((q) => (
                <div
                  key={q.id}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid var(--gray-200)",
                    borderRadius: "var(--radius)",
                    padding: "0.85rem",
                  }}
                >
                  <div style={{ fontSize: "0.85rem", fontWeight: 750, color: "var(--gray-900)" }}>
                    {q.question}
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "var(--gray-500)", fontStyle: "italic", marginTop: "0.15rem" }}>
                    {q.native}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.35rem", marginTop: "0.55rem" }}>
                    {[
                      { val: 0, label: "Never", sub: "কেতিয়াও নহয়" },
                      { val: 1, label: "Rarely", sub: "কেতিয়াবা" },
                      { val: 2, label: "Sometimes", sub: "মাজে মাজে" },
                      { val: 3, label: "Often", sub: "সঘনাই" },
                      { val: 4, label: "Always", sub: "সদায়" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => {
                          const updated = [...zbiAnswers];
                          updated[q.id] = opt.val;
                          setZbiAnswers(updated);
                          triggerHaptic("tap");
                        }}
                        style={{
                          padding: "0.45rem 0.2rem",
                          borderRadius: "var(--radius-sm)",
                          border: zbiAnswers[q.id] === opt.val ? "2px solid var(--primary)" : "1px solid var(--gray-300)",
                          background: zbiAnswers[q.id] === opt.val ? "var(--primary)" : "var(--white)",
                          color: zbiAnswers[q.id] === opt.val ? "#ffffff" : "var(--gray-700)",
                          fontSize: "0.72rem",
                          fontWeight: 750,
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                      >
                        <div>{opt.label}</div>
                        <div style={{ fontSize: "0.6rem", opacity: 0.85 }}>({opt.val})</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Helpline for Caregiver Burnout */}
            {zbiTotalScore >= 9 && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "#fef2f2",
                  border: "1.5px solid #f87171",
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 850, color: "#991b1b" }}>
                    🚨 Tele-MANAS Free Counseling Support (High Caregiver Strain)
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#7f1d1d", marginTop: "0.2rem" }}>
                    Caring for a dementia patient is hard. You are not alone. Talk free 24x7 to compassionate counselors at Tele-MANAS (Government of India).
                  </div>
                </div>
                <a
                  href="tel:14416"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.55rem 1.1rem",
                    background: "#dc2626",
                    color: "#ffffff",
                    textDecoration: "none",
                    borderRadius: "var(--radius)",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                  }}
                >
                  📞 Call Tele-MANAS (14416)
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: EDIT PATIENT DETAILS
          ══════════════════════════════════════════════════════════════ */}
      {isEditProfileOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "var(--white)",
              borderRadius: "var(--radius-xl)",
              maxWidth: "520px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "1.3rem",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--gray-900)", margin: 0 }}>
                ✏️ Edit Elder Profile Details
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  color: "var(--gray-500)",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Full Name &amp; Script:</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem" }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Age (Years):</label>
                  <input
                    type="number"
                    value={profileForm.age}
                    onChange={(e) => setProfileForm({ ...profileForm, age: Number(e.target.value) })}
                    style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Family Relation:</label>
                  <input
                    type="text"
                    value={profileForm.relation}
                    onChange={(e) => setProfileForm({ ...profileForm, relation: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem" }}
                    placeholder="e.g. Grandfather, Father"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Residential Village / District:</label>
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Clinical Condition &amp; Staging:</label>
                <input
                  type="text"
                  value={profileForm.clinicalCondition}
                  onChange={(e) => setProfileForm({ ...profileForm, clinicalCondition: e.target.value })}
                  style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Emergency Contact Name:</label>
                  <input
                    type="text"
                    value={profileForm.emergencyName}
                    onChange={(e) => setProfileForm({ ...profileForm, emergencyName: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Emergency Contact Phone:</label>
                  <input
                    type="tel"
                    value={profileForm.emergencyPhone}
                    onChange={(e) => setProfileForm({ ...profileForm, emergencyPhone: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  style={{ padding: "0.55rem 1rem", borderRadius: "var(--radius)", border: "1px solid var(--gray-300)", background: "var(--white)", fontSize: "0.82rem", fontWeight: 750, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "0.55rem 1.3rem", borderRadius: "var(--radius)", border: "none", background: "var(--primary)", color: "#ffffff", fontSize: "0.82rem", fontWeight: 800, cursor: "pointer" }}
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: ADD / EDIT MEDICATION
          ══════════════════════════════════════════════════════════════ */}
      {isAddMedOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "var(--white)",
              borderRadius: "var(--radius-xl)",
              maxWidth: "480px",
              width: "100%",
              padding: "1.3rem",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--gray-900)", margin: 0 }}>
                {editingMed ? "✏️ Edit Medication / Routine" : "➕ Add Medication / Routine"}
              </h3>
              <button
                onClick={() => setIsAddMedOpen(false)}
                style={{ background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--gray-500)" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMedication} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Item Title / Medicine Name:</label>
                <input
                  type="text"
                  value={medForm.title}
                  onChange={(e) => setMedForm({ ...medForm, title: e.target.value })}
                  placeholder="e.g. Donepezil, Morning Walk, Water"
                  style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem" }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Dosage / Quantity:</label>
                  <input
                    type="text"
                    value={medForm.dosage}
                    onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })}
                    placeholder="e.g. 5 mg, 1 Glass"
                    style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Scheduled Time:</label>
                  <input
                    type="text"
                    value={medForm.time}
                    onChange={(e) => setMedForm({ ...medForm, time: e.target.value })}
                    placeholder="e.g. 8:00 AM"
                    style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem" }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Instructions / Description:</label>
                <input
                  type="text"
                  value={medForm.description}
                  onChange={(e) => setMedForm({ ...medForm, description: e.target.value })}
                  placeholder="e.g. Take with warm water after breakfast"
                  style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Category Icon:</label>
                  <select
                    value={medForm.icon}
                    onChange={(e) => setMedForm({ ...medForm, icon: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem" }}
                  >
                    <option value="💊">💊 Pill / Medicine</option>
                    <option value="💧">💧 Water / Hydration</option>
                    <option value="🥗">🥗 Meal / Nutrition</option>
                    <option value="🚶‍♂️">🚶‍♂️ Walk / Activity</option>
                    <option value="🧘">🧘 Relaxation</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Type:</label>
                  <select
                    value={medForm.type}
                    onChange={(e) => setMedForm({ ...medForm, type: e.target.value as any })}
                    style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem" }}
                  >
                    <option value="medicine">Medicine</option>
                    <option value="hydration">Hydration</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="activity">Activity</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setIsAddMedOpen(false)}
                  style={{ padding: "0.55rem 1rem", borderRadius: "var(--radius)", border: "1px solid var(--gray-300)", background: "var(--white)", fontSize: "0.82rem", fontWeight: 750, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "0.55rem 1.3rem", borderRadius: "var(--radius)", border: "none", background: "var(--primary)", color: "#ffffff", fontSize: "0.82rem", fontWeight: 800, cursor: "pointer" }}
                >
                  {editingMed ? "Save Changes" : "Add to Routine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: ADD FAMILY PHOTO & REMINISCENCE STORY
          ══════════════════════════════════════════════════════════════ */}
      {isAddPhotoOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "var(--white)",
              borderRadius: "var(--radius-xl)",
              maxWidth: "500px",
              width: "100%",
              padding: "1.3rem",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--gray-900)", margin: 0 }}>
                🖼️ Add New Family Photo &amp; Memory
              </h3>
              <button
                onClick={() => setIsAddPhotoOpen(false)}
                style={{ background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--gray-500)" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePhoto} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Memory Title (English):</label>
                <input
                  type="text"
                  value={photoForm.title}
                  onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                  placeholder="e.g. Rongali Bihu Celebration"
                  style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Native Title (Assamese / Regional):</label>
                <input
                  type="text"
                  value={photoForm.nativeTitle}
                  onChange={(e) => setPhotoForm({ ...photoForm, nativeTitle: e.target.value })}
                  placeholder="e.g. ৰঙালী বিহুৰ সোঁৱৰণি"
                  style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Year of Memory:</label>
                  <input
                    type="text"
                    value={photoForm.year}
                    onChange={(e) => setPhotoForm({ ...photoForm, year: e.target.value })}
                    placeholder="e.g. 1982"
                    style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Family Relationship:</label>
                  <input
                    type="text"
                    value={photoForm.relation}
                    onChange={(e) => setPhotoForm({ ...photoForm, relation: e.target.value })}
                    placeholder="e.g. Granddaughter, Son"
                    style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem" }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gray-700)" }}>Heartfelt Memory Story / Caption:</label>
                <textarea
                  rows={3}
                  value={photoForm.caption}
                  onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                  placeholder="Describe this comforting moment so the elder feels loved and anchored when looking at it..."
                  style={{ width: "100%", padding: "0.55rem", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-300)", marginTop: "0.25rem", fontFamily: "inherit", fontSize: "0.82rem" }}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setIsAddPhotoOpen(false)}
                  style={{ padding: "0.55rem 1rem", borderRadius: "var(--radius)", border: "1px solid var(--gray-300)", background: "var(--white)", fontSize: "0.82rem", fontWeight: 750, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "0.55rem 1.3rem", borderRadius: "var(--radius)", border: "none", background: "var(--primary)", color: "#ffffff", fontSize: "0.82rem", fontWeight: 800, cursor: "pointer" }}
                >
                  Save to Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
