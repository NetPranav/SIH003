# Smriti-NER (স্মৃতি): Sub-Phase 9.2 — ASHA Worker Portal (Community View) Specification
**Document ID**: `SPEC-DASH-ASHA-092`  
**Version**: `1.0.0`  
**Status**: `APPROVED`  
**Target Milestone**: `M9 (All Dashboard Views Functional)`  
**Clinical Focus**: Multi-Patient Cohort Monitoring, Offline Bluetooth Peer-to-Peer Delta Sync, Village Home-Visit Checklist, and Anganwadi Community Circle Scheduler

---

## 1. Clinical Rationale: Empowering the Grassroots Health Frontier

In rural North East India, Accredited Social Health Activists (ASHAs) are the indispensable primary healthcare lifeline. An ASHA worker in Majuli or Sohra manages 20 to 45 geriatric elders across dispersed riverine islands and hill villages where cellular connectivity is frequently unavailable or erratic.

Smriti-NER provides the ASHA worker with a dedicated, lightweight Community Portal:
1. **Multi-Patient Cohort Dashboard**:
   - Color-coded triage list showing patient cognitive staging (MCI, Mild Dementia, Moderate Dementia, Age-Normative).
   - Real-time trend arrows (↑ Improving, → Stable, ↓ Declining) derived from longitudinal Bayesian Knowledge Tracing (BKT) and MMSE proxies.
   - Distinct tags for App-based elders vs 2G feature phone IVR-only elders.
2. **Offline Bluetooth Low Energy (BLE) Delta Sync**:
   - When visiting an elder's home without internet, the ASHA worker's smartphone pairs via BLE with the elder's tablet/PWA device.
   - Rapid delta synchronization transfers 14 days of encrypted cognitive telemetry and game timestamps in $< 30$ seconds with SHA-256 integrity checks.
3. **Village Visit Checklist**:
   - Standardized geriatric clinical audit: MMSE proxy check, blister pack pill count verification, Zarit Burden caregiver burnout check, home fall hazard inspection, and audio memo recording.
   - One-tap escalation flag alerting the District Medical Officer (DMO) if cognitive or physical decline is observed.
4. **Community Circle Scheduler View**:
   - Management interface for weekly Anganwadi/PHC Reminiscence Circles (Sub-Phase 7.2).
   - Tracks session dates, venue (Anganwadi Center, Namghar, Community Hall), elder attendance roster, and cultural discussion themes.

---

## 2. Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ASHA WORKER PORTAL (COMMUNITY VIEW)                  │
│                                                                        │
│                ┌──────────────────────────────────────┐                │
│                │     ASHA WORKER AUTHENTICATED        │                │
│                │   Jonali Saikia (Kamalabari PHC)     │                │
│                └──────────────────┬───────────────────┘                │
│                                   │                                    │
│       ┌───────────────────────────┼───────────────────────────┐        │
│       ▼                           ▼                           ▼        │
│ ┌───────────────┐         ┌───────────────┐           ┌──────────────┐ │
│ │ Multi-Patient │         │ Offline BLE   │           │ Village Home │ │
│ │ Cohort Triage │         │ Delta Sync    │           │ Visit Audit  │ │
│ │ • Staging     │         │ • Peer-to-peer│           │ • Pill count │ │
│ │ • Trend (↑→↓) │         │ • <30s delta  │           │ • Fall risk  │ │
│ │ • IVR + App   │         │ • SHA-256 ver │           │ • DMO flag   │ │
│ └───────────────┘         └───────────────┘           └──────────────┘ │
│                                   │                                    │
│                                   ▼                                    │
│                   ┌───────────────────────────────┐                    │
│                   │  Community Circle Scheduler   │                    │
│                   │  • Anganwadi / Namghar venue  │                    │
│                   │  • 8-elder group co-play      │                    │
│                   │  • Bhashini facilitation      │                    │
│                   └───────────────────────────────┘                    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Schemas

### 3.1 ASHA Cohort Patient
```typescript
export interface AshaCohortPatient {
  id: string;
  name: string;
  age: number;
  village: string;
  mmse: number;
  staging: string;
  trendArrow: "UP" | "FLAT" | "DOWN";
  adherenceRate: number;
  sundowningRisk: "low" | "moderate" | "high";
  channel: "APP" | "IVR" | "HYBRID";
  lastSync: string;
}
```

### 3.2 Bluetooth Delta Sync Session
```typescript
export interface BluetoothSyncSession {
  syncId: string;
  patientId: string;
  bytesTransferred: number;
  durationMs: number;
  recordsCount: number;
  checksumVerified: boolean;
  completedAt: string;
}
```

### 3.3 Village Visit Checklist Record
```typescript
export interface VillageVisitRecord {
  visitId: string;
  patientId: string;
  ashaWorkerName: string;
  visitDate: string;
  mmseChecked: boolean;
  pillCountVerified: boolean;
  caregiverBurnoutAssessed: boolean;
  fallRiskInspected: boolean;
  voiceNotesUrl?: string;
  clinicianEscalationNeeded: boolean;
  notes?: string;
}
```

### 3.4 Community Circle Schedule Item
```typescript
export interface CommunityCircleSchedule {
  circleId: string;
  circleName: string;
  villageVenue: string;
  scheduledDate: string;
  facilitatorAsha: string;
  registeredEldersCount: number;
  culturalTheme: string;
  status: "UPCOMING" | "IN_PROGRESS" | "COMPLETED";
}
```

---

## 4. Implementation Deliverables

- [x] Sub-Phase 9.2 Technical Specification (`docs/41_SubPhase_9_2_ASHA_Worker_Portal_Spec.md`)
- [x] TypeScript ASHA Portal Service (`smriti-ner/src/lib/ashaPortalService.ts`)
- [x] Enhanced ASHA Worker Screen with Circle Scheduler & Sync (`smriti-ner/src/components/screens/AshaWorkerScreen.tsx`)
- [x] FastAPI Backend Endpoints (`server/main.py`)
- [x] Monorepo Python Validation Suite (`tests/test_asha_portal.py`)
- [x] Next.js PWA Production Build Verification
