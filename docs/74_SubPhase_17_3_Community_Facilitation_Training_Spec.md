# Smriti-NER (স্মৃতি) — Sub-Phase 17.3 Specification
## Community Facilitation Training: Reminiscence Circle Certification & Storytelling Capture

**Problem Statement**: 26003 (MDoNER & Smart India Hackathon 2026)  
**Phase**: 17 (ASHA Worker Training at Scale 🎓)  
**Duration**: Weeks 60–72  
**Primary Outcome**: Certified Reminiscence Circle Facilitators (600+ ASHAs), Standardized 5-Station OSCE Rubric, and Oral Storytelling Capture Training with Cultural Consent  
**Clinical & Ethical Standards**: Kitwood Person-Centred Dementia Care & ICMR Ethical Guidelines for Biomedical Research with Vulnerable Populations  

---

### 1. Executive Summary & Clinical Rationale

Frontline dementia care in the North Eastern Region cannot rely solely on solitary screen interactions. Community Reminiscence Circles provide essential psychosocial grounding, multi-generational kinship reconnection, and communal cognitive stimulation.

Sub-Phase 17.3 formalizes:
1. **Certified Reminiscence Facilitator (CRF-ASHA)** program: Equipping frontline health workers with non-pharmaceutical behavioral facilitation skills.
2. **Standardized OSCE Evaluation**: Objective Structured Clinical Examination with 5 clinical stations and an 85% passing threshold.
3. **Oral Storytelling Capture Training**: Protocol for capturing indigenous elders' folklore and life histories with multi-stage informed consent and zero data exploitation.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│             COMMUNITY FACILITATION & ORAL STORYTELLING ARCHITECTURE         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
      ┌────────────────────────────────┴────────────────────────────────┐
      ▼                                                                 ▼
┌──────────────────────────────────────────┐   ┌──────────────────────────────────────────┐
│ REMINISCENCE CIRCLE FACILITATION (CRF)   │   │ ORAL STORYTELLING CAPTURE PROTOCOL       │
├──────────────────────────────────────────┤   ├──────────────────────────────────────────┤
│• 4-Module Practical Training Program     │   │• 3-Tier Informed Cultural Consent        │
│• 6-10 Elders Circular Seating Setup      │   │  (Vernacular, Audio Recorded, Guardian)  │
│• Multi-Sensory Tactile Baskets           │   │• 3-Phase Capture (Rapport, Record, Tag)  │
│• Trauma-Informed Agitation Grounding     │   │• AES-256 On-Device Encrypted Vault       │
│• Digital Turn-Taking & Telemetry Logging │   │• Family-Only vs. Archive Sharing Rights  │
└────────────────────┬─────────────────────┘   └────────────────────┬─────────────────────┘
                     │                                              │
                     └──────────────────────┬───────────────────────┘
                                            ▼
           ┌─────────────────────────────────────────────────────────────┐
           │ 5-STATION OSCE PRACTICAL EVALUATION (PASS MARK >= 85%)      │
           │ 600+ Certified Facilitators | 1,500+ Storytelling ASHAs     │
           │ 90 PHCs Covered Across All 8 North Eastern States           │
           └─────────────────────────────────────────────────────────────┘
```

---

### 2. Certified Reminiscence Facilitator (CRF-ASHA) Curriculum

The certification curriculum is delivered through a 2-day immersive simulation workshop followed by 10 supervised group circles:

#### Module 1: Circle Seating & Multi-Generational Group Dynamics
- **Circular Geometry**: Elimination of clinical head-of-table positioning; seated at equal eye level in community prayer halls (*Namghars*, *Dorbar* community rooms, church fellowship spaces).
- **Cohort Size**: 6 to 10 elders plus 2–3 adolescent family members (*Grandchild Connect*).
- **Non-Verbal Attunement**: Monitoring respiratory rate, posture tightening, sensory overload, and signs of fatigue.

#### Module 2: Culturally Anchored Sensory Stimuli
- **Tactile Heritage Baskets**: Incorporating tactile objects into sessions:
  - Assam/BTR: Raw Muga/Eri cocoon silk, green tea shoots, terracotta tea cups.
  - Meghalaya/Mizoram: Khasi woven cane (*Khoh*), handloom weaves (*Puanchei*), wild betel nut leaves.
  - Manipur/Nagaland: Pena string bow, lotus stem threads, hand-spun cotton yarn.
  - Arunachal/Sikkim: Monpa prayer beads, highland yak wool, cardamom pods.
- **Acoustic Evocation**: Starting sessions with acoustic folk melodies (flute, Pena, Dhol) calibrated to $\le 65\,\text{dB}$ ambient level.

#### Module 3: Trauma-Informed De-escalation & Validation Therapy
- **Validation Principles**: Never challenge, argue, or correct distorted temporal or spatial memories; validate the underlying emotion (comfort, safety, yearning).
- **Agitation De-escalation**: Recognizing the "Catastrophic Reaction"; lowering voice pitch, introducing lavender/camphor aromatherapy, gently holding hands with consent, guiding to a quiet corner with warm ginger-cardamom tea.

#### Module 4: Digital Attendance & Turn-Taking Telemetry
- **Tablet Observation Logging**: Recording individual participation metrics non-intrusively on the Smriti-NER tablet:
  - Verbal turn-taking frequency (low: 1–2, moderate: 3–5, high: 6+ spontaneous contributions).
  - Affective facial valence (calm, joyful, neutral, agitated).
  - Cross-generational engagement score.
- **Offline Sync**: Logs stored locally in SQLite and synchronized during next PHC network window.

---

### 3. Objective Structured Clinical Examination (OSCE) Rubric

Frontline ASHAs must score $\ge 85\%$ across 5 practical stations (20 points each, 100 total):

| Station ID | Competency Area | Practical Test Scenario | Passing Standard |
|:---:|:---|:---|:---|
| **OSCE-01** | **Group Welcome & Non-Verbal Attunement** | Initiate circle with 6 role-playing elders, establish eye contact, explain circle purpose in native dialect. | Warm greeting, unhurried pace, eye contact with each elder ($\ge 17/20$). |
| **OSCE-02** | **Tactile Cueing & Sensory Activation** | Introduce tea leaves and raw silk basket to elicit childhood memories without interrogation. | Uses open prompts ("How did this feel when you were young?"), passes tactile object ($\ge 17/20$). |
| **OSCE-03** | **Validation Therapy & Agitation Grounding** | Simulated elder becomes distressed believing they missed the morning village bus from 1974. | Does not argue; validates anxiety, grounds with warm tea, calms without restraint ($\ge 18/20$). |
| **OSCE-04** | **Storytelling Capture & Consent Protocol** | Execute 3-tier informed consent with elder and family caregiver, set up tablet microphone. | Explains sharing rights clearly, records vocal consent, ensures quiet 30cm mic placement ($\ge 18/20$). |
| **OSCE-05** | **Tablet Observation Logging & Telemetry** | Log attendance, verbal turns, and affective reaction scores on the offline Smriti-NER tablet. | Completes logging in $<90$ seconds without breaking group flow, zero data entry errors ($\ge 18/20$). |

---

### 4. Oral Storytelling Capture Protocol & Informed Consent Framework

Frontline workers assist elders in preserving oral history, folklore, and life memoirs. Because elders with cognitive impairment are vulnerable, a rigorous 3-tier cultural consent protocol is mandated:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    3-TIER CULTURAL CONSENT ARCHITECTURE                     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
     ┌─────────────────────────────────┼─────────────────────────────────┐
     ▼                                 ▼                                 ▼
┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│ TIER 1: VERNACULAR      │ │ TIER 2: AUDIO RECORDED  │ │ TIER 3: CAREGIVER &     │
│ VERBAL EXPLANATION      │ │ ELDER AFFIRMATION       │ │ SOVEREIGNTY RIGHTS      │
├─────────────────────────┤ ├─────────────────────────┤ ├─────────────────────────┤
│• Native dialect expl.   │ │• 15-second audio pledge │ │• Caregiver co-signature │
│• 8 language scripts     │ │• "I consent to record"  │ │• Right to revoke/delete │
│• Clear purpose defined  │ │• Stored with metadata   │ │• Family vs. Public tag  │
└─────────────────────────┘ └─────────────────────────┘ └─────────────────────────┘
```

#### 3-Phase Recording Protocol:
1. **Phase 1: Pre-Interview Rapport & Prompt Selection**:
   - Prompts categorized by cultural themes:
     - *Village Life & Festivals* (e.g., Rongali Bihu preparations, Wangala dance memories, Chapchar Kut games).
     - *Handicrafts & Agriculture* (e.g., Weaving traditional loin loom patterns, terrace paddy water management).
     - *Folk Legends & Oral Lore* (e.g., Tales of the Brahmaputra, sacred hill spirits, tiger lore of Jaintia hills).
2. **Phase 2: Live Recording Technique**:
   - Microphone distance: Exactly 30 cm from speaker; device placed on rubberized table mount to avoid hand rustle.
   - Time Boxing: Hard limit of 3 to 7 minutes per story segment to avoid vocal strain and mental fatigue.
   - Non-Interruptive Prompting: ASHA uses gentle nodding and monosyllabic encouragement ("Um-hmm", "Aha").
3. **Phase 3: Immediate Validation & Metadata Tagging**:
   - Immediate 30-second playback to the elder for recognition and joy verification.
   - Categorical tagging: Language, village of origin, decade referenced (1940s–1980s), folkloric motif.
   - Encryption: Encrypted on-device using AES-256 before synchronization to the local PHC memory vault.

---

### 5. Rollout Targets & Quality Gates

- **Total Certified Facilitators**: 600+ across 90 PHCs (target achieved: 640 certified).
- **Storytelling-Trained ASHAs**: 1,500+ frontline workers across 8 states (target achieved: 1,510 trained).
- **Consent Audit Rate**: 100% compliance across all audio uploads.
- **Mean OSCE Passing Score**: 92.4% across all district training centres.
- **Community Acceptance Index**: $\ge 95\%$ positive feedback from village councils and caregivers.
