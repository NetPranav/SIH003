# Smriti-NER (স্মৃতি): Sub-Phase 8.4 — IVR-to-Platform Data Bridge Specification
**Document ID**: `SPEC-IVR-BRG-084`  
**Version**: `1.0.0`  
**Status**: `APPROVED`  
**Target Milestone**: `M8 (IVR Cognitive Line Operational)`  
**Clinical Focus**: Zero-Smartphone Telemetry Ingestion, Unified Patient Longitudinal Record & Caregiver Dashboard Ingestion

---

## 1. Clinical Rationale: Cross-Channel Continuum of Care

In rural North East India (e.g. Dhemaji, Karbi Anglong, Mon, Chandel), geriatric elders often interact exclusively via voice telephony over 2G feature phones without access to smartphones, while their adult children (caregivers residing in urban centres like Guwahati or Delhi) and local ASHA workers monitor them via the Smriti-NER Caregiver PWA and Web Dashboard.

A clinical divide occurs if IVR call telemetry remains isolated in PBX/telecom call logs:
1. **Adherence Gaps Go Unnoticed**: If an elder takes morning Metformin or Donepezil and confirms it via IVR DTMF "1", the caregiver dashboard must immediately reflect confirmed adherence without waiting for manual phone check-ins.
2. **Cognitive Trajectory Tracking**: 3-word cultural recall triplets (Assamese: Gamusa/Jaapi/Kaziranga; Meitei: Leirum/Pung/Loktak) and orientation questions asked during IVR check-ins provide vital MMSE/TICS proxy telemetry. These must feed directly into the patient's Bayesian Knowledge Tracing (BKT) and Longitudinal Cognitive Slope.
3. **Escalation Notification**: 3 consecutive unanswered reminder calls must instantly escalate into the Caregiver Alert Feed and ASHA Dispatch Queue with geolocation and contact metadata.

---

## 2. Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                   IVR-TO-PLATFORM DATA BRIDGE FLOW                     │
│                                                                        │
│   2G Feature Phone (Elder)                                             │
│       │                                                                │
│       ▼                                                                │
│   BSNL IVR Gateway / SIP Trunk                                         │
│       │                                                                │
│       ├───────────────────────────────┬────────────────────────────┐   │
│       ▼                               ▼                            ▼   │
│   Cognitive Check-In              Adherence Call             Escalation│
│   (Orientation + Recall)         ("Press 1" Confirmed)       (3 Misses)│
│       │                               │                            │   │
│       ▼                               ▼                            ▼   │
│   /api/v1/ivr/checkin/*           /api/v1/ivr/reminders/*     Escalation│
│       │                               │                       Trigger  │
│       └───────────────────────────────┼────────────────────────────┘   │
│                                       ▼                                │
│                       ┌───────────────────────────────┐                │
│                       │   IVR DATA BRIDGE SERVICE     │                │
│                       │   (ivrDataBridge.ts / server) │                │
│                       └───────────────┬───────────────┘                │
│                                       │                                │
│          ┌────────────────────────────┼────────────────────────────┐   │
│          ▼                            ▼                            ▼   │
│  Standardized Telemetry     Longitudinal Adherence      Caregiver Feed │
│  Event (channel: IVR_PHONE) (Rate %, Consecutive Days)  & ASHA Alerts  │
│          │                            │                            │   │
│          └────────────────────────────┼────────────────────────────┘   │
│                                       ▼                                │
│                  Caregiver Portal & Clinician Dashboard                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Schemas

### 3.1 IVR Bridge Event
```typescript
export interface IVRBridgeEvent {
  eventId: string;
  patientId: string;
  eventType: "COGNITIVE_CHECKIN" | "REMINDER_ADHERENCE" | "ESCALATION_ALERT";
  timestamp: string;
  channel: "IVR_PHONE";
  language: string;
  checkinDetails?: {
    sessionId: string;
    orientationCorrect: boolean;
    orientationInputMethod: "DTMF" | "VOICE";
    wordsRecalled: string[];
    recallScore: number;
    compositeScore: number;
    statusLabel: string;
  };
  adherenceDetails?: {
    scheduleId: string;
    reminderType: "MEDICATION" | "HYDRATION" | "CIRCADIAN_CALMING";
    confirmed: boolean;
    attemptsCount: number;
  };
  escalationDetails?: {
    escalationId: string;
    alertMessage: string;
    caregiverPhone: string;
    ashaWorkerPhone: string;
    acknowledged: boolean;
  };
}
```

### 3.2 Unified Patient Telemetry Summary
```typescript
export interface UnifiedPatientTelemetry {
  patientId: string;
  totalInteractions: number;
  appInteractions: number;
  ivrInteractions: number;
  lastInteractionAt: string;
  lastInteractionChannel: "PWA_APP" | "IVR_PHONE";
  adherenceRatePercent: number;
  consecutiveAdherenceStreak: number;
  latestCognitiveScore: number;
  cognitiveStabilityTrend: "IMPROVING" | "STABLE" | "DECLINING" | "INSUFFICIENT_DATA";
  activeEscalationAlerts: number;
  recentEvents: IVRBridgeEvent[];
}
```

---

## 4. Implementation Deliverables

- [x] Sub-Phase 8.4 Technical Specification (`docs/39_SubPhase_8_4_IVR_Data_Bridge_Spec.md`)
- [x] TypeScript IVR Data Bridge Service (`smriti-ner/src/lib/ivrDataBridge.ts`)
- [x] FastAPI Backend Endpoints (`server/main.py`)
- [x] Monorepo Python Validation Suite (`tests/test_ivr_data_bridge.py`)
- [x] Next.js PWA Production Build Verification
- [x] Milestone M8 Sign-Off in `docs/Roadmap_2.md`
