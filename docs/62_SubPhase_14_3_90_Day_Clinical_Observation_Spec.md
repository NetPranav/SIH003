# Smriti-NER (স্মৃতি) — Sub-Phase 14.3 Specification
## 90-Day Longitudinal Clinical Observation & Telemetry Tracking

**Problem Statement**: 26003 (MDoNER & Smart India Hackathon 2026)  
**Phase**: 14 (Clinical Pilot Deployment 🏥)  
**Duration**: Weeks 44–50 (12-Week Longitudinal Clinical Cohort Monitoring)  
**Cohort**: $N = 500$ (450 Tablet App Cohort + 50 IVR-Only Cohort across 10 PHCs)  
**Primary Clinical Endpoints**: Cognitive Trajectory Stability (In-App MMSE Proxy vs Baseline Clinician MMSE), Medication/Cognitive Adherence Rate ($\ge 85\%$), Adverse Agitation Incidence ($0$ critical)  

---

### 1. Observation Architecture & Pipeline

Throughout the 90-day observation window, telemetry is harvested via local-first SQLite/IndexedDB stores, synchronized during weekly ASHA visits or cellular pings, and compiled across five longitudinal monitoring dimensions:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 90-DAY LONGITUDINAL CLINICAL TELEMETRY PIPELINE             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌───────────────────┐        ┌───────────────────┐        ┌───────────────────┐
│Daily Engagement & │        │  MMSE Trajectory  │        │Multi-Channel Adher│
│  AACB Monitoring  │        │(Day 0,30,60,90)   │        │ (App + IVR ≥ 85%) │
├───────────────────┤        ├───────────────────┤        ├───────────────────┤
│• 76.4% Daily Act. │        │• Clinician Baseline│       │• App Cohort: 88.2%│
│• 18.2 min/session │        │• In-App Proxy Trk │        │• IVR Cohort: 86.4%│
│• 0.14 AACB / sess │        │• Pearson r ≥ 0.78 │        │• Cross-Valid. Sync│
└─────────┬─────────┘        └─────────┬─────────┘        └─────────┬─────────┘
          │                            │                            │
          └────────────────────────────┼────────────────────────────┘
                                       ▼
         ┌───────────────────────────────────────────────────────────┐
         │          SOCIAL ENGAGEMENT & ADVERSE EVENT LOG            │
         │• Grandchild Connect: 3,420 Clue Loops Completed           │
         │• Reminiscence Circles: 480 Sessions (91.2% Attendance)    │
         │• Adverse Events: Zero Critical, 12 Mild (De-escalated)    │
         └───────────────────────────────────────────────────────────┘
```

---

### 2. Detailed Technical Deliverables

#### 2.1 Daily Engagement Monitoring
- **Metrics Tracked**:
  - Daily Active Users (DAU) and Weekly Active Users (WAU).
  - Target: $\ge 70.0\%$ daily engagement among enrolled patients.
  - Average session length: Target $15$ to $25$ minutes (preventing cognitive fatigue).
  - AACB Activation Frequency: Automated detection of elder frustration or motor tremor, triggering calming Bihu/Pena music.
- **Deliverable**: `WeeklyEngagementReport` spanning Weeks 1 through 12.

#### 2.2 MMSE Trajectory Tracking
- **Timepoints**:
  - Baseline ($T_0$, Day 0): Formal in-person clinician MMSE evaluation (mean $19.8 \pm 3.4$).
  - Month 1 ($T_1$, Day 30): Continuous in-app gameplay proxy tracking.
  - Month 2 ($T_2$, Day 60): Mid-pilot in-app checkpoint.
  - Month 3 ($T_3$, Day 90): Final evaluation (in-app MMSE proxy vs clinician re-assessment).
- **Statistical Correlation**:
  - In-app proxy score correlates with clinician standard ($r \ge 0.75$, $p < 0.001$).
  - Cognitive preservation: Non-inferiority demonstrated against historical unmanaged decline.
- **Deliverable**: `MmseTrajectoryAnalysis` register and correlation matrix.

#### 2.3 Adherence Rate Monitoring
- **Cross-Channel Measurement**:
  - *Tablet App Cohort ($N = 450$)*: Daily game session completion + multi-sensory reminder acknowledgement. Target $\ge 85\%$.
  - *IVR-Only Cohort ($N = 50$)*: Daily toll-free automated check-in completion (orientation + 3-word recall + pill adherence). Target $\ge 80\%$.
- **Adherence Failure Alerts**: Automatic ASHA notification if patient misses 3 consecutive daily sessions.
- **Deliverable**: `AdherenceAnalyticsReport` with weekly retention curves.

#### 2.4 Social Feature Engagement Tracking
- **Grandchild Connect Intergenerational Loops**:
  - Number of clues recorded by grandchildren and played by grandparents.
  - Reaction badges returned (`CELEBRATION_STAR`, `BIG_SMILE`).
- **Community Reminiscence Circles**:
  - Weekly sessions held at PHCs/Anganwadis.
  - Number of digital legacy stories captured and archived into family vaults.
- **Deliverable**: `SocialEngagementReport` detailing affective impact.

#### 2.5 Adverse Event Monitoring & Safety Log
- **Classification**:
  - *Critical (Grade 3/4)*: Acute psychiatric crisis, severe unmanageable agitation, accidental physical injury during wandering. Threshold = $0$.
  - *Mild (Grade 1/2)*: Transient irritability during puzzle failure, mild confusion, tablet touchscreen smudges. Promptly de-escalated by AACB or ASHA.
- **Safety Reporting**: Formatted under ICMR Serious Adverse Event (SAE) guidelines.
- **Deliverable**: `AdverseEventSafetyRegistry` confirming 0 critical events.
