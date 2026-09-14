# Smriti-NER (স্মৃতি) — Sub-Phase 14.2 Specification
## ASHA Worker Training Program & Community Circle Facilitation

**Problem Statement**: 26003 (MDoNER & Smart India Hackathon 2026)  
**Phase**: 14 (Clinical Pilot Deployment 🏥)  
**Duration**: Weeks 41–43 (Intensive Capacity Building Sprint)  
**Trainee Target**: 20 Lead Master Trainers (2 per PHC) + Cascade Training for 100 Community ASHAs  
**Accreditation Framework**: National Health Systems Resource Centre (NHSRC) Community Health Worker Competency Standards  

---

### 1. Training Architecture & Cascade Model

To guarantee culturally sensitive and clinically rigorous deployment across 10 rural/tribal PHCs, Smriti-NER utilizes a 2-tier Train-the-Trainer (TTT) cascade model:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 ASHA CAPACITY BUILDING & HELPDESK CASCADE                   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                 ┌─────────────────────┴─────────────────────┐
                 ▼                                           ▼
       ┌───────────────────┐                       ┌───────────────────┐
       │   Master TTT      │                       │  Curriculum &     │
       │  (20 Lead ASHAs)  │                       │ Facilitation Pack │
       ├───────────────────┤                       ├───────────────────┤
       │• 2 per PHC Site   │                       │• Tablet Hardware  │
       │• 3-Day Residential│                       │• BLE Mesh Sync    │
       │• Objective OSCE   │                       │• AACB De-escalate │
       │• Certification    │                       │• Weekly Circles   │
       └─────────┬─────────┘                       └─────────┬─────────┘
                 │                                           │
                 └─────────────────────┬─────────────────────┘
                                       ▼
                 ┌───────────────────────────────────────────┐
                 │    TIERED FIELD HELPDESK & SLA MATRIX     │
                 │• Tier 1: Local Master ASHA (Instant)      │
                 │• Tier 2: NHM Field Engineer (<2h)         │
                 │• Tier 3: Clinical Neurologist (<12h)      │
                 └───────────────────────────────────────────┘
```

---

### 2. Detailed Technical Deliverables

#### 2.1 Training Curriculum Design
- **Core Modules (40-Hour Curriculum)**:
  1. *Module 101: Dementia Literacy & Stigma Reduction*: Identifying memory vs normal ageing; non-threatening culturally aligned terminology (e.g. স্মৃতিবিভ্ৰম, পাহৰণি ৰোগ).
  2. *Module 102: Hardware Operation & Offline Hygiene*: Charging protocols, solar battery upkeep, offline local-first storage, Dexie/SQLite delta sync trigger.
  3. *Module 103: Anti-Agitation Circuit Breaker (AACB) Empathy Protocol*: Recognizing elder frustration signals (rapid screen tapping, vocal agitation), activating calming Bihu/folk melodies, graceful session pause.
  4. *Module 104: Statutory Consent & Elder Verbal Assent*: Capturing dual-gate permission under DISHA 2018; recording affirmative verbal assent in native languages.
- **Deliverable**: `TrainingCurriculumManual` (Available in English, Assamese, Meitei, and Khasi).

#### 2.2 Train-the-Trainer (TTT) Certification ($N = 20$)
- **Selection**: 2 veteran ASHA workers selected per PHC based on digital literacy, maternal language fluency, and community standing.
- **Objective Structured Clinical Examination (OSCE)**:
  - Station 1: Tablet unboxing, PIN unlocking, language switching.
  - Station 2: Simulated patient wandering alert response (<60s BLE mesh detection).
  - Station 3: Handling agitated elder during puzzle gameplay.
- **Passing Standard**: $\ge 85\%$ aggregate score across all OSCE stations.
- **Deliverable**: `TTTCertificationRegister` with trainee names, PHC affiliations, scorecards, and verifiable certificate hashes.

#### 2.3 Community Circle Facilitation Training
- **Weekly Reminiscence Circles**:
  - Training ASHAs to gather 4–8 elderly community members for structured group folklore and reminiscence sessions.
  - Audio recording consent: Confirming all participants verbally agree before shared digital legacy stories are recorded.
  - Turn-taking moderation: Prompting introverted participants with regional cultural artefacts (e.g. Gamusa weaving motifs, Kangla memories, Nongpoh tea harvesting).
- **Deliverable**: `CircleFacilitationGuide` with session blueprints and moderation checklists.

#### 2.4 Multilingual Field Help Desk & SLA Matrix
- **Support Channels**:
  - Toll-free IVR Helpdesk line (BSNL zero-cost priority queue).
  - State-specific WhatsApp coordination groups (Kamrup, Majuli, Ri-Bhoi, Churachandpur).
- **Escalation SLA Matrix**:
  - *Tier 1 (Operational/App usage)*: Handled by Lead Master ASHA within 30 minutes.
  - *Tier 2 (Hardware/Sync failure)*: Handled by NHM District Field Engineer within 2 hours; replacement tablet dispatched within 24 hours.
  - *Tier 3 (Acute Elder Distress/Agitation)*: Handled by PHC Medical Officer or DMO Neurologist within 4 hours.
- **Deliverable**: `HelpdeskSopDocument` and real-time operational status endpoint.
