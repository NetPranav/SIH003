# Smriti-NER (স্মৃতি): Sub-Phase 9.1 — Caregiver Portal (Family View) Specification
**Document ID**: `SPEC-DASH-CG-091`  
**Version**: `1.0.0`  
**Status**: `APPROVED`  
**Target Milestone**: `M9 (All Dashboard Views Functional)`  
**Clinical Focus**: Zero-Friction Dual Authentication, Longitudinal 30-Day MMSE Trajectory, Multi-Sensory Adherence Rings, Circadian Sundowning Anomaly Panel & Reminiscence Story Album

---

## 1. Clinical Rationale: Empowering Distant & In-Home Family Caregivers

In the North Eastern Region, many family caregivers face the "Distance Dilemma": adult children frequently work in urban centers (Guwahati, Shillong, Delhi, Bengaluru) while elderly parents with mild-to-moderate cognitive impairment (MCI/AD) remain in ancestral villages (e.g. Sivasagar, Majuli, Churachandpur, Lunglei).

The Caregiver Portal provides a clinical telemetry window:
1. **Dual-Tier Authentication**:
   - **Local 4-Digit PIN (`1234`)**: Instant zero-network offline access when the caregiver is physically with the elder at home.
   - **Cloud SMS/OTP Gateway**: Secure remote access for distant caregivers over cellular network with 6-digit cryptographic token validation.
2. **30-Day Longitudinal MMSE Trajectory**:
   - Tracks day-by-day cognitive fluctuations calculated from combined PWA game telemetry and 2G IVR check-in TICS scores.
   - Categorizes cognitive stability into clinical thresholds:
     - **Normal / Stable** ($\ge 24$)
     - **Mild Cognitive Impairment (MCI)** ($18 - 23$)
     - **Severe Cognitive Dip** ($< 18$)
   - Surfaces anomalous rapid cognitive drops ($\ge 3$ points within 7 days) to prompt clinical review.
3. **Adherence Dashboard Rings**:
   - Visual concentric ring completion for Medication, Hydration, and Daily Cognitive Games.
   - Blends IVR DTMF "Press 1" confirmations with in-app touch confirmations.
4. **Sundowning Alert Panel**:
   - Detects late-afternoon/twilight agitation, missed evening medications, and erratic nocturnal interactions.
   - Provides immediate, non-pharmacological calming protocols rooted in indigenous cultural assets (e.g., Borgeet soothing audio, betel-leaf warm compress, family voice clip playback).
5. **Reminiscence & Story Album**:
   - Curated gallery of family photos, life-review audio recordings (from Sub-Phase 7.3), and grandchild co-play audio clips (from Sub-Phase 7.1).

---

## 2. Technical Architecture & Component Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CAREGIVER PORTAL (FAMILY VIEW) FLOW                  │
│                                                                        │
│                ┌──────────────────────────────────────┐                │
│                │        CAREGIVER AUTHENTICATION       │                │
│                │   Local PIN (1234)  |  Cloud SMS OTP │                │
│                └──────────────────┬───────────────────┘                │
│                                   │ Token Verified                     │
│                                   ▼                                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    CAREGIVER DASHBOARD SUITE                     │  │
│  │                                                                  │  │
│  │  ┌─────────────────────────┐      ┌───────────────────────────┐  │  │
│  │  │ 30-Day MMSE Trajectory  │      │  Multi-Sensory Adherence  │  │  │
│  │  │ • 30 daily points       │      │  • Medication Ring (%)    │  │  │
│  │  │ • PWA + IVR blended     │      │  • Hydration Ring (%)     │  │  │
│  │  │ • Clinical thresholds   │      │  • Cognitive Game Ring (%)│  │  │
│  │  └─────────────────────────┘      └───────────────────────────┘  │  │
│  │                                                                  │  │
│  │  ┌─────────────────────────┐      ┌───────────────────────────┐  │  │
│  │  │  Sundowning Alert Panel │      │ Reminiscence Story Album  │  │  │
│  │  │ • Twilight agitation    │      │ • Heritage photos         │  │  │
│  │  │ • Missed dose warnings  │      │ • Life-Review audio clips │  │  │
│  │  │ • De-escalation guide   │      │ • Grandchild voice notes  │  │  │
│  │  └─────────────────────────┘      └───────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Schemas

### 3.1 30-Day MMSE Trajectory Point
```typescript
export interface MMSETrajectoryPoint {
  day: number; // 1 to 30
  date: string;
  score: number; // 0 to 30
  channel: "APP" | "IVR" | "BLENDED";
  classification: "NORMAL" | "MCI" | "SEVERE";
  anomaly: boolean;
  notes?: string;
}
```

### 3.2 Adherence Metric Ring
```typescript
export interface AdherenceMetricRing {
  category: "MEDICATION" | "HYDRATION" | "COGNITIVE_GAMES";
  completedCount: number;
  targetCount: number;
  percentage: number;
  color: string;
  statusLabel: string;
}
```

### 3.3 Sundowning Alert Item
```typescript
export interface SundowningAlertItem {
  alertId: string;
  severity: "CRITICAL" | "MODERATE" | "INFORMATIONAL";
  timestamp: string;
  triggerReason: string;
  deescalationProtocol: string;
  resolved: boolean;
  resolvedAt?: string;
}
```

### 3.4 Reminiscence Story Media
```typescript
export interface ReminiscenceStoryMedia {
  mediaId: string;
  title: string;
  era: string;
  mediaType: "PHOTO" | "AUDIO_NARRATIVE" | "VOICE_ANNOTATION";
  audioUrl?: string;
  kinshipTag: string;
  recordedBy: string;
}
```

---

## 4. Implementation Deliverables

- [x] Sub-Phase 9.1 Technical Specification (`docs/40_SubPhase_9_1_Caregiver_Portal_Family_View_Spec.md`)
- [x] TypeScript Caregiver Portal Service (`smriti-ner/src/lib/caregiverPortalService.ts`)
- [x] Enhanced Caregiver Authentication Screen with Cloud OTP Option (`smriti-ner/src/components/screens/CaregiverPinScreen.tsx`)
- [x] FastAPI Backend Endpoints (`server/main.py`)
- [x] Monorepo Python Validation Suite (`tests/test_caregiver_portal.py`)
- [x] Next.js PWA Production Build Verification
