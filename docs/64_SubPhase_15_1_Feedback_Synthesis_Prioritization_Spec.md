# Smriti-NER (স্মৃতি) — Sub-Phase 15.1 Specification
## Post-Pilot Feedback Synthesis & Prioritization

**Problem Statement**: 26003 (MDoNER & Smart India Hackathon 2026)  
**Phase**: 15 (Feedback Integration & Iteration 🔁)  
**Duration**: Week 52 (Field Feedback Triaging & Engineering Prioritization)  
**Feedback Ingestion Pool**: 312 Field Feedback Submissions across 10 PHCs (ASHA workers, Clinicians, Family Caregivers)  
**Compliance Standard**: ISO 9241-210 (Human-Centred Design for Interactive Systems)  

---

### 1. Architectural Scope & Triage Pipeline

Sub-Phase 15.1 systematically processes, clusters, and root-causes qualitative and quantitative telemetry feedback gathered across the 90-day clinical pilot, establishing an actionable engineering backlog for Release v2.0:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 FEEDBACK SYNTHESIS & RCA TRIAGE PIPELINE                    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌───────────────────┐        ┌───────────────────┐        ┌───────────────────┐
│Feedback Ingestion │        │Root Cause Analysis│        │Cultural Adjust.   │
│ (312 Submissions) │        │ (RCA Deep-Dives)  │        │(Linguistic Audit) │
├───────────────────┤        ├───────────────────┤        ├───────────────────┤
│• 48 Bugs (P0–P3)  │        │• Tremor vs Tapping│        │• Tea Garden Nuance│
│• 112 UX / Ergo    │        │• Monsoon Harvesting│       │• Bhashini Phonemes│
│• 84 Feature Reqs  │        │  Circadian Shift  │        │• Kinship Politeness│
│• 68 Cultural/Lang │        │• 2G DTMF Guardband│        │• Botanical Flora  │
└─────────┬─────────┘        └─────────┬─────────┘        └─────────┬─────────┘
          │                            │                            │
          └────────────────────────────┼────────────────────────────┘
                                       ▼
         ┌───────────────────────────────────────────────────────────┐
         │             PRIORITIZED RELEASE v2.0 BACKLOG              │
         │  MoSCoW Matrix: 8 Must-Haves, 12 Should-Haves, 15 Could   │
         │   Clearance Gate for Iterative Improvement Sprint 15.2    │
         └───────────────────────────────────────────────────────────┘
```

---

### 2. Detailed Technical Deliverables

#### 2.1 Multi-Stakeholder Feedback Categorization
- **Total Submissions ($N = 312$)**:
  - *ASHA Health Workers ($n = 148$)*: Practical usability, charging logistics, patient hesitation.
  - *Family Caregivers ($n = 114$)*: Notification preferences, elder mood improvements, home routine fit.
  - *Medical Officers & Neurologists ($n = 50$)*: Diagnostic proxy utility, telemetry report formatting.
- **Categorization Matrix**:
  - **Category A (Bugs / Technical Glitches, 15.4%)**: Bluetooth mesh reconnect backoff on river ferries; audio buffer hiccups on ultra-budget tablets.
  - **Category B (UX / Ergonomic Adjustments, 35.9%)**: Cataract high-contrast outlines; larger touch targets (minimum $64\text{px} \times 64\text{px}$); simplified PIN recovery.
  - **Category C (Feature Requests, 26.9%)**: Automated weekly WhatsApp reports to family caregivers; offline audio bedtime story mode.
  - **Category D (Cultural / Dialect Nuances, 21.8%)**: Regional vocabulary variations between Upper and Lower Assam; Meitei script display toggle.
- **Deliverable**: `PrioritizedFeedbackBacklog` with MoSCoW prioritization rankings.

#### 2.2 Root Cause Analysis (RCA) on Key Friction Points
- **RCA Incident 1: Tremor vs. Frustration False Positives in AACB**:
  - *Symptom*: AACB prematurely triggered during peaceful gameplay in 8 patients with Parkinsonian / essential tremors.
  - *Root Cause*: High-frequency low-amplitude screen taps mimicked rapid frustrated tapping.
  - *Remediation*: Introduce a 5Hz spatial-frequency low-pass smoothing filter into the `touchStreamLogger` to isolate physiological tremor from genuine frustration.
- **RCA Incident 2: Majuli Riverine Island Circadian Shift**:
  - *Symptom*: In Kamalabari and Jengraimukh, 14 patients repeatedly missed morning 9:00 AM check-ins during June/July.
  - *Root Cause*: Agricultural rice transplantation season shifted morning wake-up hours to 5:00 AM, with elders resting by 8:30 AM.
  - *Remediation*: Implement circadian seasonal schedule presets that allow ASHAs to toggle between "Monsoon Agricultural" and "Winter Standard" schedules.
- **RCA Incident 3: 2G DTMF Guardband Dropouts in Ri-Bhoi**:
  - *Symptom*: Toll-free IVR calls in border hill cells missed dual-tone keypresses.
  - *Root Cause*: GSM 2G handoff jitter compressed audio packets, truncating DTMF frequencies below standard 100ms detection window.
  - *Remediation*: Extend DTMF detection guardband to 160ms with automated speech fallback prompt.
- **Deliverable**: `RootCauseAnalysisDocument` detailing causal chains and engineering fixes.

#### 2.3 Cultural & Linguistic Sensitivity Review
- **Linguistic Adjustments**:
  - Refined Bhashini voice prompts to utilize softer, respectful elder honorifics (e.g. "দেউতা" / "আইতা" in Assamese; "ইবেম্মা" in Meitei; "Mei-ieid" in Khasi).
  - Clarified folklore puzzles to prevent region-specific ambiguity (e.g., distinguishing Kaziranga rhino calls from Manas elephant herd calls).
- **Deliverable**: `CulturalAdjustmentLog` signed off by regional community advisors.
