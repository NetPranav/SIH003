# Smriti-NER (স্মৃতি): Sub-Phase 9.3 — District Medical Officer / Clinician View Specification
**Document ID**: `SPEC-DASH-DMO-093`  
**Version**: `1.0.0`  
**Status**: `APPROVED`  
**Target Milestone**: `M9 (All Dashboard Views Functional)`  
**Clinical Focus**: Population-Scale Cognitive Surveillance, DISHA-Compliant Clinical Drill-Down, Automated >3-Point MMSE Drop Flagging, and e-Sanjeevani Teleconsultation Handoff

---

## 1. Clinical Rationale: Bridging the Tertiary-Rural Neurology Gap

The 8 North Eastern states face an acute scarcity of geriatric neurologists and psychiatrists, with less than 0.05 specialists per 100,000 population in non-capital districts. Most clinical oversight falls on District Medical Officers (DMOs) and Community Health Center (CHC) medical officers who lack specialized neurocognitive diagnostic toolkits.

Sub-Phase 9.3 establishes a **Public Health Cognitive Intelligence Cockpit**:
1. **District-Wide Cohort Stratification**:
   - Aggregates behavioral gameplay telemetry and 2G IVR check-in scores across entire districts (e.g. Majuli, Dhemaji, Churachandpur).
   - De-identifies patient records under DISHA 2018 statutory guidelines, presenting population prevalence heatmaps and cognitive vulnerability clusters.
2. **DISHA-Gated Clinical Drill-Down**:
   - Allows treating clinicians to decrypt individual patient longitudinal cognitive slopes only when statutory dual-gate consent is verified.
   - Displays 4-domain cognitive breakdown: Memory, Attention, Executive Function, and Language.
3. **Automated Intervention Flagging**:
   - Clinically validated threshold: Any elder exhibiting a $> 3$-point drop in MMSE proxy over 30 days is automatically flagged as `URGENT_INTERVENTION`.
   - Surfaces root-cause hypotheses: medication non-adherence, recent bereavement, seasonal sundowning, or suspected stroke/vascular event.
4. **e-Sanjeevani Teleconsultation One-Click Handoff**:
   - Seamless integration with India's national teleconsultation platform (e-Sanjeevani / ABDM).
   - Compiles an HL7/FHIR R4 DiagnosticReport bundle with ABHA ID, 30-day cognitive slope, and pill adherence logs, routing the elder directly to the GMCH/NEIGRIHMS tele-neurology clinic.

---

## 2. Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│             DISTRICT MEDICAL OFFICER / CLINICIAN VIEW FLOW             │
│                                                                        │
│               ┌───────────────────────────────────────┐                │
│               │     DMO / CLINICIAN AUTHENTICATION    │                │
│               │   Dr. Sanjib Kakoti (DMO, Majuli)     │                │
│               └───────────────────┬───────────────────┘                │
│                                   │                                    │
│       ┌───────────────────────────┼───────────────────────────┐        │
│       ▼                           ▼                           ▼        │
│ ┌───────────────┐         ┌───────────────┐           ┌──────────────┐ │
│ │ District Pop. │         │ Patient Drill-│           │ Automated    │ │
│ │ Surveillance  │         │ Down (Consent)│           │ Flagging     │ │
│ │ • Prevalences │         │ • 4 Domains   │           │ • >3pt drop  │ │
│ │ • Heatmap     │         │ • IVR + App   │           │ • URGENT     │ │
│ └───────────────┘         └───────┬───────┘           └───────┬──────┘ │
│                                   │                           │        │
│                                   ▼                           ▼        │
│                   ┌───────────────────────────────┐                    │
│                   │ e-Sanjeevani Teleconsultation │                    │
│                   │ • One-Click Doctor Referral   │                    │
│                   │ • ABDM FHIR R4 Diagnostic Rep.│                    │
│                   │ • NEIGRIHMS / GMCH Routing    │                    │
│                   └───────────────────────────────┘                    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Schemas

### 3.1 District Cognitive Overview
```typescript
export interface DistrictCognitiveCohortMetric {
  districtId: string;
  districtName: string;
  state: string;
  totalMonitoredElders: number;
  prevalencePercentage: number;
  averageMmseScore: number;
  activeInterventionFlagsCount: number;
  cohortBreakdown: {
    normalCount: number;
    mciCount: number;
    dementiaCount: number;
  };
  channelBreakdown: {
    appUsers: number;
    ivrUsers: number;
    hybridUsers: number;
  };
}
```

### 3.2 Intervention Flag
```typescript
export interface InterventionFlag {
  flagId: string;
  patientId: string;
  patientName: string;
  age: number;
  village: string;
  baselineMmse: number;
  currentMmse: number;
  scoreDropPoints: number;
  severity: "URGENT_INTERVENTION" | "CLINICAL_MONITORING" | "ROUTINE_FOLLOWUP";
  flaggedAt: string;
  triggerReason: string;
  adherenceRate: number;
  caregiverPhone: string;
  ashaWorkerName: string;
  status: "PENDING_REVIEW" | "ESANJEEVANI_QUEUED" | "RESOLVED";
}
```

### 3.3 e-Sanjeevani Teleconsultation Packet
```typescript
export interface ESanjeevaniReferralPacket {
  referralId: string;
  patientId: string;
  abhaId: string;
  provisionalDiagnosis: string;
  mmseProxyScore: number;
  scoreDrop30Days: number;
  clinicalSummary: string;
  telemedicineNode: string;
  referralPriority: "EMERGENCY" | "HIGH" | "ROUTINE";
  queuedAt: string;
  fhirReportBundleId: string;
}
```

---

## 4. Implementation Deliverables

- [x] Sub-Phase 9.3 Technical Specification (`docs/42_SubPhase_9_3_Clinician_DMO_View_Spec.md`)
- [x] TypeScript Clinician DMO Service (`smriti-ner/src/lib/clinicianDmoService.ts`)
- [x] FastAPI Backend Endpoints (`server/main.py`)
- [x] Monorepo Python Validation Suite (`tests/test_clinician_dmo_portal.py`)
- [x] Next.js PWA Production Build Verification
