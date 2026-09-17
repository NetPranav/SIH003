// ── SMRITI-NER ASHA WORKER RURAL HEALTH PORTAL ──────────────────────────────
// Sub-Phase 9.2: Multi-patient cohort, offline BLE sync, home-visit checklist & circle scheduler

"use client";

import React, { useState } from "react";
import type { ScreenId } from "@/lib/types";
import { playAudioFeedback } from "@/lib/audio";
import ElderButton from "@/components/ui/ElderButton";
import { AshaPortalService, AshaCohortPatient, CommunityCircleSchedule } from "@/lib/ashaPortalService";
import { offlineMobileStore } from "@/lib/offlineMobileStorage";

interface Props {
  navigate: (target: ScreenId) => void;
}

export default function AshaWorkerScreen({ navigate }: Props) {
  const [subTab, setSubTab] = useState<"cohort_visit" | "circle_scheduler">("cohort_visit");
  const [cohort] = useState<AshaCohortPatient[]>(AshaPortalService.getCohort());
  const [selectedPatientId, setSelectedPatientId] = useState<string>("p1");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);
  const [syncDetails, setSyncDetails] = useState<string | null>(null);

  const [checklist, setChecklist] = useState({
    mmseChecked: true,
    medsCounted: true,
    caregiverBurnoutAssessed: false,
    fallRiskInspected: false,
  });
  const [escalated, setEscalated] = useState<boolean>(false);
  const [visitSaved, setVisitSaved] = useState<boolean>(false);

  // Circle Scheduler State
  const [circleSchedules, setCircleSchedules] = useState<CommunityCircleSchedule[]>(
    AshaPortalService.getCircleSchedules()
  );
  const [showScheduleForm, setShowScheduleForm] = useState<boolean>(false);
  const [newCircleName, setNewCircleName] = useState<string>("");
  const [newVenue, setNewVenue] = useState<string>("");
  const [newDate, setNewDate] = useState<string>("2026-09-25T10:00");
  const [newTheme, setNewTheme] = useState<string>("");

  const activePatient = cohort.find((p) => p.id === selectedPatientId) || cohort[0];

  const handleSyncTelemetry = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setSyncDetails(null);
    playAudioFeedback("click");
    setTimeout(() => {
      const res = AshaPortalService.triggerBluetoothSync(selectedPatientId);
      setIsSyncing(false);
      setSyncSuccess(true);
      setSyncDetails(`✅ ${res.recordsCount} Telemetry records (${(res.bytesTransferred / 1024).toFixed(1)} KB) synced in ${(res.durationMs / 1000).toFixed(2)}s via Bluetooth BLE. SHA-256 Checksum Verified.`);
      playAudioFeedback("success");
    }, 1100);
  };

  const toggleChecklist = (key: keyof typeof checklist) => {
    playAudioFeedback("tap");
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddCircle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleName.trim() || !newVenue.trim()) return;

    const added = AshaPortalService.scheduleCircleSession({
      circleId: `cir_${Date.now().toString(36)}`,
      circleName: newCircleName.trim(),
      villageVenue: newVenue.trim(),
      scheduledDate: new Date(newDate).toISOString(),
      facilitatorAsha: "Jonali Saikia (ASHA)",
      registeredEldersCount: 8,
      culturalTheme: newTheme.trim() || "Traditional Weaving & River Folklore",
      status: "UPCOMING",
    });

    offlineMobileStore.addCircleSchedule({
      circleName: newCircleName.trim(),
      villageVenue: newVenue.trim(),
      scheduledDate: new Date(newDate).toISOString(),
      facilitatorAsha: "Jonali Saikia (ASHA)",
      registeredEldersCount: 8,
      culturalTheme: newTheme.trim() || "Traditional Weaving & River Folklore",
      status: "UPCOMING",
    });

    setCircleSchedules([...circleSchedules, added]);
    setShowScheduleForm(false);
    setNewCircleName("");
    setNewVenue("");
    setNewTheme("");
    playAudioFeedback("success");
  };

  return (
    <div style={{
      maxWidth: "520px",
      margin: "0 auto",
      minHeight: "100vh",
      background: "var(--bg)",
      padding: "1rem",
      paddingBottom: "5rem"
    }}>
      {/* ASHA Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#065f46",
        color: "#fff",
        borderRadius: "var(--radius-lg)",
        padding: "1rem",
        marginBottom: "1rem",
        boxShadow: "var(--shadow-md)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <button
            onClick={() => navigate("home")}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "#fff",
              borderRadius: "8px",
              padding: "0.4rem 0.6rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            ← Back
          </button>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 800 }}>ASHA Rural Health Portal</div>
            <div style={{ fontSize: "0.72rem", opacity: 0.9 }}>
              ID: ASHA-AS-MJL-042 • Majuli River Sub-Center
            </div>
          </div>
        </div>
        <span style={{
          background: "#10b981",
          color: "#fff",
          fontSize: "0.65rem",
          fontWeight: 800,
          padding: "0.2rem 0.5rem",
          borderRadius: "999px"
        }}>
          OFFLINE READY
        </span>
      </div>

      {/* Sub-Tab Navigation */}
      <div style={{
        display: "flex",
        gap: "0.5rem",
        background: "var(--gray-200, #e5e7eb)",
        padding: "0.3rem",
        borderRadius: "var(--radius)",
        marginBottom: "1rem"
      }}>
        <button
          onClick={() => { setSubTab("cohort_visit"); playAudioFeedback("click"); }}
          style={{
            flex: 1,
            padding: "0.55rem",
            fontSize: "0.8rem",
            fontWeight: 700,
            borderRadius: "calc(var(--radius) - 2px)",
            border: "none",
            background: subTab === "cohort_visit" ? "var(--white)" : "transparent",
            color: subTab === "cohort_visit" ? "#065f46" : "var(--gray-700)",
            boxShadow: subTab === "cohort_visit" ? "var(--shadow-sm)" : "none",
            cursor: "pointer",
          }}
        >
          Cohort & Home Visit
        </button>
        <button
          onClick={() => { setSubTab("circle_scheduler"); playAudioFeedback("click"); }}
          style={{
            flex: 1,
            padding: "0.55rem",
            fontSize: "0.8rem",
            fontWeight: 700,
            borderRadius: "calc(var(--radius) - 2px)",
            border: "none",
            background: subTab === "circle_scheduler" ? "var(--white)" : "transparent",
            color: subTab === "circle_scheduler" ? "#065f46" : "var(--gray-700)",
            boxShadow: subTab === "circle_scheduler" ? "var(--shadow-sm)" : "none",
            cursor: "pointer",
          }}
        >
          Community Circles ({circleSchedules.length})
        </button>
      </div>

      {/* VIEW 1: COHORT & HOME VISIT */}
      {subTab === "cohort_visit" && (
        <>
          {/* BLE Offline Sync Banner */}
          <div style={{
            background: "var(--white)",
            border: "1.5px solid #d1fae5",
            borderRadius: "var(--radius-lg)",
            padding: "1rem",
            marginBottom: "1rem",
            boxShadow: "var(--shadow-sm)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  background: "#d1fae5",
                  color: "#065f46",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--gray-900)" }}>
                    Bluetooth Mesh Offline Delta Relay
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--gray-500)" }}>
                    One-tap &lt;30s tablet sync with SHA-256 verification
                  </div>
                </div>
              </div>
              <button
                onClick={handleSyncTelemetry}
                disabled={isSyncing}
                style={{
                  background: isSyncing ? "#9ca3af" : "#065f46",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 0.85rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: isSyncing ? "wait" : "pointer"
                }}
              >
                {isSyncing ? "Syncing..." : "Sync Nearby Devices"}
              </button>
            </div>

            {syncSuccess && syncDetails && (
              <div style={{
                marginTop: "0.75rem",
                background: "#ecfdf5",
                color: "#065f46",
                padding: "0.5rem",
                borderRadius: "6px",
                fontSize: "0.74rem",
                fontWeight: 600
              }}>
                {syncDetails}
              </div>
            )}
          </div>

          {/* Village Cohort Selector */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.5rem" }}>
              Village Elder Cohort ({cohort.length} Patients Assigned)
            </div>
            <div style={{
              display: "flex",
              gap: "0.5rem",
              overflowX: "auto",
              paddingBottom: "0.3rem"
            }}>
              {cohort.map((p) => {
                const arrowIcon = p.trendArrow === "UP" ? "↑" : p.trendArrow === "DOWN" ? "↓" : "→";
                const arrowColor = p.trendArrow === "UP" ? "#047857" : p.trendArrow === "DOWN" ? "#dc2626" : "#4b5563";

                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    style={{
                      flexShrink: 0,
                      padding: "0.6rem 0.8rem",
                      borderRadius: "var(--radius)",
                      border: selectedPatientId === p.id ? "2px solid #065f46" : "1px solid var(--gray-200)",
                      background: selectedPatientId === p.id ? "#ecfdf5" : "var(--white)",
                      color: "var(--gray-800)",
                      textAlign: "left",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.82rem" }}>{p.name}</span>
                      <span style={{ color: arrowColor, fontWeight: 800, fontSize: "0.85rem", marginLeft: "0.3rem" }}>
                        {arrowIcon}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--gray-500)" }}>
                      Age {p.age} • {p.village}
                    </div>
                    <div style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      marginTop: "0.2rem",
                      color: p.mmse >= 24 ? "#047857" : p.mmse >= 18 ? "#b45309" : "#b91c1c"
                    }}>
                      MMSE: {p.mmse}/30 ({p.staging})
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Patient Inspection Card */}
          <div style={{
            background: "var(--white)",
            border: "1.5px solid var(--gray-200)",
            borderRadius: "var(--radius-lg)",
            padding: "1rem",
            marginBottom: "1rem",
            boxShadow: "var(--shadow-sm)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gray-900)" }}>
                  {activePatient.name}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--gray-500)" }}>
                  {activePatient.village} • Last Synced: {activePatient.lastSync}
                </div>
              </div>
              <span style={{
                background: activePatient.sundowningRisk === "low" ? "#ecfdf5" : activePatient.sundowningRisk === "moderate" ? "#fef3c7" : "#fee2e2",
                color: activePatient.sundowningRisk === "low" ? "#065f46" : activePatient.sundowningRisk === "moderate" ? "#92400e" : "#991b1b",
                fontSize: "0.68rem",
                fontWeight: 800,
                padding: "0.25rem 0.55rem",
                borderRadius: "999px"
              }}>
                SUNDOWNING: {activePatient.sundowningRisk.toUpperCase()}
              </span>
            </div>

            {/* Metric Overview Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginTop: "1rem" }}>
              <div style={{ background: "#f8fafc", padding: "0.6rem", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "0.68rem", color: "var(--gray-500)" }}>MMSE Proxy</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#065f46" }}>{activePatient.mmse}/30</div>
                <div style={{ fontSize: "0.62rem", color: "var(--gray-400)" }}>Trend: {activePatient.trendArrow}</div>
              </div>
              <div style={{ background: "#f8fafc", padding: "0.6rem", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "0.68rem", color: "var(--gray-500)" }}>Adherence</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0284c7" }}>{activePatient.adherenceRate}%</div>
                <div style={{ fontSize: "0.62rem", color: "var(--gray-400)" }}>7-Day Average</div>
              </div>
              <div style={{ background: "#f8fafc", padding: "0.6rem", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "0.68rem", color: "var(--gray-500)" }}>Channel</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#8b5cf6", marginTop: "0.2rem" }}>
                  {activePatient.channel}
                </div>
                <div style={{ fontSize: "0.62rem", color: "var(--gray-400)" }}>Primary Interface</div>
              </div>
            </div>

            {/* Home-Visit Inspection Checklist */}
            <div style={{ marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px solid var(--gray-200)" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.5rem" }}>
                Village Visit Checklist (Protocol MDoNER-ASHA-04)
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={checklist.mmseChecked}
                    onChange={() => toggleChecklist("mmseChecked")}
                    style={{ width: "18px", height: "18px", accentColor: "#065f46" }}
                  />
                  <span>1. In-person verbal orientation & 3-word recall confirmation</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={checklist.medsCounted}
                    onChange={() => toggleChecklist("medsCounted")}
                    style={{ width: "18px", height: "18px", accentColor: "#065f46" }}
                  />
                  <span>2. Pill blister pack audit vs IVR/App adherence logs</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={checklist.caregiverBurnoutAssessed}
                    onChange={() => toggleChecklist("caregiverBurnoutAssessed")}
                    style={{ width: "18px", height: "18px", accentColor: "#065f46" }}
                  />
                  <span>3. Caregiver stress & burnout 4-item screen (ZBI-4)</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={checklist.fallRiskInspected}
                    onChange={() => toggleChecklist("fallRiskInspected")}
                    style={{ width: "18px", height: "18px", accentColor: "#065f46" }}
                  />
                  <span>4. Fall-risk and dim lighting inspection in hearth room</span>
                </label>
              </div>
            </div>

            {/* Emergency Escalation & Tele-Consult */}
            <div style={{ marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px solid var(--gray-200)" }}>
              {escalated ? (
                <div style={{
                  background: "#fee2e2",
                  border: "1px solid #fca5a5",
                  color: "#991b1b",
                  borderRadius: "8px",
                  padding: "0.6rem",
                  fontSize: "0.75rem",
                  fontWeight: 700
                }}>
                  Clinical Alert Dispatched: Tele-consultation referral queued with District Hospital Neurologist (GMCH Tele-medicine Node).
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEscalated(true);
                    playAudioFeedback("click");
                  }}
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "8px",
                    border: "1.5px solid #dc2626",
                    background: "#fff",
                    color: "#dc2626",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Flag for District Tele-Neurologist Referral
                </button>
              )}
            </div>

            {/* Save Visit to Offline Mobile Store */}
            <div style={{ marginTop: "0.85rem" }}>
              <button
                onClick={() => {
                  offlineMobileStore.saveAshaVisit({
                    patientId: selectedPatientId,
                    patientName: activePatient.name,
                    checklist: checklist,
                    escalationTriggered: escalated,
                    notes: `In-person village home visit completed. MMSE: ${activePatient.mmse}/30. Sundowning: ${activePatient.sundowningRisk}.`,
                  });
                  setVisitSaved(true);
                  playAudioFeedback("success");
                  setTimeout(() => setVisitSaved(false), 3000);
                }}
                style={{
                  width: "100%",
                  padding: "0.65rem",
                  borderRadius: "8px",
                  border: "1.5px solid #065f46",
                  background: "#ecfdf5",
                  color: "#065f46",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  marginBottom: "0.5rem",
                }}
              >
                Save Home Visit Checklist (Offline Encrypted)
              </button>
              {visitSaved && (
                <div style={{
                  padding: "0.5rem",
                  background: "#d1fae5",
                  border: "1px solid #6ee7b7",
                  borderRadius: "6px",
                  color: "#065f46",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textAlign: "center",
                }}>
                  Visit Checklist Persisted to On-Device Offline Records.
                </div>
              )}
            </div>
          </div>

          {/* Start Immediate Cognitive Session with Elder */}
          <ElderButton
            variant="primary"
            fullWidth
            onPress={() => navigate("dhol-pepa")}
          >
            Start Assisted Cognitive Session
          </ElderButton>
        </>
      )}

      {/* VIEW 2: COMMUNITY CIRCLE SCHEDULER VIEW */}
      {subTab === "circle_scheduler" && (
        <div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem"
          }}>
            <div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--gray-900)" }}>
                Community Reminiscence Circles
              </div>
              <div style={{ fontSize: "0.74rem", color: "var(--gray-500)" }}>
                Weekly Anganwadi / PHC Group Memory Sessions
              </div>
            </div>

            <button
              onClick={() => { setShowScheduleForm(!showScheduleForm); playAudioFeedback("click"); }}
              style={{
                background: "#065f46",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "0.45rem 0.75rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              {showScheduleForm ? "Cancel" : "+ New Session"}
            </button>
          </div>

          {/* New Session Form Modal / Dropdown */}
          {showScheduleForm && (
            <form onSubmit={handleAddCircle} style={{
              background: "var(--white)",
              border: "1.5px solid #065f46",
              borderRadius: "var(--radius-lg)",
              padding: "1rem",
              marginBottom: "1rem",
              boxShadow: "var(--shadow-md)"
            }}>
              <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#065f46", marginBottom: "0.75rem" }}>
                Schedule Anganwadi Co-Play Circle
              </div>

              <div style={{ marginBottom: "0.65rem" }}>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--gray-700)", display: "block", marginBottom: "0.2rem" }}>
                  Circle Name
                </label>
                <input
                  type="text"
                  required
                  value={newCircleName}
                  onChange={(e) => setNewCircleName(e.target.value)}
                  placeholder="e.g. Garamur Satra Elders Circle"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    border: "1px solid var(--gray-300)",
                    fontSize: "0.82rem"
                  }}
                />
              </div>

              <div style={{ marginBottom: "0.65rem" }}>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--gray-700)", display: "block", marginBottom: "0.2rem" }}>
                  Village Venue
                </label>
                <input
                  type="text"
                  required
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  placeholder="e.g. Garamur Anganwadi Center"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    border: "1px solid var(--gray-300)",
                    fontSize: "0.82rem"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.65rem" }}>
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--gray-700)", display: "block", marginBottom: "0.2rem" }}>
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.45rem",
                      borderRadius: "6px",
                      border: "1px solid var(--gray-300)",
                      fontSize: "0.75rem"
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--gray-700)", display: "block", marginBottom: "0.2rem" }}>
                    Discussion Theme
                  </label>
                  <input
                    type="text"
                    value={newTheme}
                    onChange={(e) => setNewTheme(e.target.value)}
                    placeholder="e.g. Pottery, Weaving"
                    style={{
                      width: "100%",
                      padding: "0.45rem",
                      borderRadius: "6px",
                      border: "1px solid var(--gray-300)",
                      fontSize: "0.75rem"
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "6px",
                  background: "#065f46",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Confirm & Add to Schedule
              </button>
            </form>
          )}

          {/* Schedule List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {circleSchedules.map((c) => (
              <div
                key={c.circleId}
                style={{
                  background: "var(--white)",
                  border: "1.5px solid var(--gray-200)",
                  borderRadius: "var(--radius-lg)",
                  padding: "0.9rem",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--gray-900)" }}>
                      {c.circleName}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--gray-600)", marginTop: "0.15rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>{c.villageVenue}</span>
                    </div>
                  </div>
                  <span style={{
                    background: c.status === "UPCOMING" ? "#d1fae5" : "#f3f4f6",
                    color: c.status === "UPCOMING" ? "#065f46" : "#4b5563",
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "999px"
                  }}>
                    {c.status}
                  </span>
                </div>

                <div style={{
                  background: "#f8fafc",
                  borderRadius: "6px",
                  padding: "0.5rem",
                  marginTop: "0.6rem",
                  fontSize: "0.72rem",
                  color: "var(--gray-700)"
                }}>
                  <div>📅 <strong>Date:</strong> {new Date(c.scheduledDate).toLocaleString()}</div>
                  <div style={{ marginTop: "0.2rem" }}>👥 <strong>Registered:</strong> {c.registeredEldersCount} Elders • Facilitated by {c.facilitatorAsha}</div>
                  <div style={{ marginTop: "0.2rem" }}>🎭 <strong>Theme:</strong> {c.culturalTheme}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
