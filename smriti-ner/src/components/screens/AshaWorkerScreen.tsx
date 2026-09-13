// ── SMRITI-NER ASHA WORKER RURAL HEALTH PORTAL ──────────────────────────────
// Sub-Phase 2.2 Deliverable: Multi-patient cohort, offline BLE sync, and home-visit checklist

"use client";

import React, { useState } from "react";
import type { ScreenId } from "@/lib/types";
import { playAudioFeedback } from "@/lib/audio";
import ElderButton from "@/components/ui/ElderButton";

interface Props {
  navigate: (target: ScreenId) => void;
}

interface CohortPatient {
  id: string;
  name: string;
  age: number;
  village: string;
  mmse: number;
  staging: string;
  adherenceRate: number;
  sundowningRisk: "low" | "moderate" | "high";
  lastSync: string;
}

export default function AshaWorkerScreen({ navigate }: Props) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("p1");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);
  const [checklist, setChecklist] = useState({
    mmseChecked: true,
    medsCounted: true,
    caregiverBurnoutAssessed: false,
    fallRiskInspected: false,
  });
  const [escalated, setEscalated] = useState<boolean>(false);

  const cohort: CohortPatient[] = [
    {
      id: "p1",
      name: "Birendra Nath Baruah",
      age: 74,
      village: "Kamalabari, Majuli",
      mmse: 24,
      staging: "MCI Staging",
      adherenceRate: 94,
      sundowningRisk: "low",
      lastSync: "Today, 09:30 AM",
    },
    {
      id: "p2",
      name: "Kong Merilda Lyngdoh",
      age: 81,
      village: "Nongthymmai, Sohra",
      mmse: 19,
      staging: "Mild Dementia",
      adherenceRate: 78,
      sundowningRisk: "moderate",
      lastSync: "Yesterday",
    },
    {
      id: "p3",
      name: "Radhabinod Sharma",
      age: 78,
      village: "Khurai, Imphal East",
      mmse: 25,
      staging: "MCI Staging",
      adherenceRate: 98,
      sundowningRisk: "low",
      lastSync: "Today, 10:15 AM",
    },
    {
      id: "p4",
      name: "Purnima Devi Gogoi",
      age: 83,
      village: "Garamur, Majuli",
      mmse: 14,
      staging: "Moderate Dementia",
      adherenceRate: 62,
      sundowningRisk: "high",
      lastSync: "3 days ago",
    },
    {
      id: "p5",
      name: "Tenzing Norbu Lepcha",
      age: 76,
      village: "Ravangla, South Sikkim",
      mmse: 26,
      staging: "Age Normative",
      adherenceRate: 100,
      sundowningRisk: "low",
      lastSync: "Today, 08:00 AM",
    },
    {
      id: "p6",
      name: "Ratneswar Saikia",
      age: 78,
      village: "Garamur, Majuli (📞 IVR-Only)",
      mmse: 21,
      staging: "Mild Dementia",
      adherenceRate: 88,
      sundowningRisk: "low",
      lastSync: "Today, 07:15 AM (IVR Line)",
    },
  ];

  const activePatient = cohort.find((p) => p.id === selectedPatientId) || cohort[0];

  const handleSyncTelemetry = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    playAudioFeedback("click");
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      playAudioFeedback("success");
    }, 1200);
  };

  const toggleChecklist = (key: keyof typeof checklist) => {
    playAudioFeedback("tap");
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
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
            <span style={{ fontSize: "1.4rem" }}>⚡</span>
            <div>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--gray-900)" }}>
                Bluetooth Mesh Offline Relay
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--gray-500)" }}>
                Direct peer-to-peer tablet sync without cell tower reception
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

        {syncSuccess && (
          <div style={{
            marginTop: "0.75rem",
            background: "#ecfdf5",
            color: "#065f46",
            padding: "0.5rem",
            borderRadius: "6px",
            fontSize: "0.74rem",
            fontWeight: 600
          }}>
            ✅ 5 Patient Records Synced via Bluetooth Mesh. Local database updated.
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
          {cohort.map((p) => (
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
              <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>{p.name}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--gray-500)" }}>Age {p.age} • {p.village}</div>
              <div style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                marginTop: "0.2rem",
                color: p.mmse >= 24 ? "#047857" : p.mmse >= 18 ? "#b45309" : "#b91c1c"
              }}>
                MMSE: {p.mmse}/30 ({p.staging})
              </div>
            </button>
          ))}
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
            borderRadius: "6px"
          }}>
            {activePatient.sundowningRisk.toUpperCase()} SUNDOWNING RISK
          </span>
        </div>

        {/* Vital Stats Matrix */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem",
          marginTop: "0.85rem"
        }}>
          <div style={{ background: "#f8f9fa", padding: "0.6rem", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--gray-500)" }}>MMSE Cognitive Proxy</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--gray-900)" }}>
              {activePatient.mmse} / 30
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--primary)", fontWeight: 600 }}>{activePatient.staging}</div>
          </div>
          <div style={{ background: "#f8f9fa", padding: "0.6rem", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--gray-500)" }}>7-Day RX Adherence</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: activePatient.adherenceRate >= 90 ? "#047857" : "#b45309" }}>
              {activePatient.adherenceRate}%
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--gray-500)" }}>Pill confirmations logged</div>
          </div>
        </div>

        {activePatient.id === "p6" && (
          <div style={{
            marginTop: "0.85rem",
            background: "#eff6ff",
            border: "1.5px solid #bfdbfe",
            borderRadius: "8px",
            padding: "0.75rem",
            fontSize: "0.76rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
              <span style={{ fontWeight: 800, color: "#1e40af" }}>📞 Zero-Device IVR Telephony Linked</span>
              <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "0.15rem 0.45rem", borderRadius: "999px", fontWeight: 700, fontSize: "0.65rem" }}>
                BSNL SIP TOLL-FREE
              </span>
            </div>
            <div style={{ color: "#1e3a8a", lineHeight: 1.4 }}>
              Elder completed missed-call check-in today at 07:15 AM via 2G basic phone (+91 94350-XXXXX). Spoke in Assamese: Recalled 3/3 words (Gamusa, Jaapi, Kaziranga). Confirmed morning meds.
            </div>
          </div>
        )}

        {/* Home Visit Clinical Checklist */}
        <div style={{ marginTop: "1rem" }}>
          <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.5rem" }}>
            Home Visit Clinical Checklist
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={checklist.mmseChecked}
                onChange={() => toggleChecklist("mmseChecked")}
                style={{ width: "18px", height: "18px", accentColor: "#065f46" }}
              />
              <span>1. Administer rapid MMSE 5-domain cognitive verification</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={checklist.medsCounted}
                onChange={() => toggleChecklist("medsCounted")}
                style={{ width: "18px", height: "18px", accentColor: "#065f46" }}
              />
              <span>2. Physical count of weekly pill strip blister packs</span>
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
              🚨 Clinical Alert Dispatched: Tele-consultation referral queued with District Hospital Neurologist (GMCH Tele-medicine Node).
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
              ⚠️ Flag for District Tele-Neurologist Referral
            </button>
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
    </div>
  );
}
