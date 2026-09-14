# Smriti-NER (স্মৃতি) — Sub-Phase 14.1 Specification
## Clinical Pilot Site Selection & Setup

**Problem Statement**: 26003 (MDoNER & Smart India Hackathon 2026)  
**Phase**: 14 (Clinical Pilot Deployment 🏥)  
**Duration**: Weeks 39–51 (3-Month Longitudinal Field Pilot)  
**Target Sample**: $N = 500$ Geriatric Patients with Mild-to-Moderate Cognitive Impairment across 10 PHCs  
**Ethical & Regulatory Standard**: ICMR National Ethical Guidelines for Biomedical Research (2017), DISHA 2018, ABDM Sandboxed Sandbox Guidelines  

---

### 1. Architectural Scope & Site Topology

The 10 pilot Primary Health Centres (PHCs) are distributed across four distinct geographic, topographic, and sociocultural regions in the North Eastern Region (NER) to stress-test clinical efficacy, offline resilience, and linguistic adaptiveness:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SMRITI-NER 10-PHC CLINICAL PILOT MATRIX                   │
├───────────────────┬───────────────────┬──────────────────┬──────────────────┤
│ Kamrup Metro (AS) │    Majuli (AS)    │   Ri-Bhoi (ML)   │ Churachandpur(MN)│
│  Urban / Semi     │  Riverine Island  │ Hilly / Tribal   │ Border Hills     │
├───────────────────┼───────────────────┼──────────────────┼──────────────────┤
│ 1. Sonapur PHC    │ 4. Kamalabari PHC │ 7. Nongpoh PHC   │ 9. Tuibong PHC   │
│ 2. Chandrapur PHC │ 5. Jengraimukh PHC│ 8. Umsning PHC   │ 10. Singngat PHC │
│ 3. Khetri PHC     │ 6. Garmur SDH/PHC │                  │                  │
├───────────────────┼───────────────────┼──────────────────┼──────────────────┤
│ N = 150 patients  │ N = 150 patients  │ N = 100 patients │ N = 100 patients │
│ Fiber + 4G cellular│ Solar + BLE Mesh  │ 2G/Edge + IVR    │ 2G/Edge + IVR    │
└───────────────────┴───────────────────┴──────────────────┴──────────────────┘
```

---

### 2. Sub-Phase Deliverables & Rigorous Criteria

#### 2.1 PHC Selection & Infrastructure Audit
- **Site Qualification Criteria**:
  - Attached to National Health Mission (NHM) and Ayushman Arogya Mandir (AAM / HWC).
  - Minimum 5 registered ASHA workers per PHC with assigned geriatric caseloads.
  - Active electricity or solar backup with minimum 4-hour daily tablet charging capability.
  - Periodic medical officer presence for clinical baseline MMSE/MoCA validation.
- **Deliverable**: `PHCSelectionReport` detailing geo-coordinates, cold-chain/power reliability, telecom carrier signals, and medical officer contacts.

#### 2.2 Ethical Approval & Multilingual Informed Consent (IEC)
- **Institutional Ethics Committee (IEC)**:
  - Protocol Registration: `SIH2026/MDoNER/IEC-PILOT-09`.
  - Double clearance under ICMR 2017 Geriatric Vulnerable Population guidelines.
- **Multilingual Informed Consent Form (ICF)**:
  - Legally authorized representative (LAR) / Primary Family Caregiver written digital consent.
  - Elder verbal assent with audio-recorded affirmative affirmation in maternal dialect (Assamese, Meitei, Bengali, Bodo, Khasi, Mizo, Hindi).
  - Explicit option to participate in tablet-app arm or zero-device IVR-only arm.
- **Deliverable**: `EthicalApprovalRecord` and validated multilingual consent template pack.

#### 2.3 Device Procurement & Hardware MDM Provisioning
- **Hardware Fleet**: 50 ruggedized budget Android tablets (Lenovo Tab M8 Gen 4 / Samsung Galaxy Tab A9 4G).
- **Mobile Device Management (MDM) Kiosk Configuration**:
  - Single-app lock to `smriti-ner.apk` / PWA TWA wrapper.
  - Pre-cached offline language packs (Bhashini local ASR/TTS models).
  - Automated SQLite/IndexedDB delta encryption (AES-256-GCM).
  - Remote telemetry ping every 24 hours when Wi-Fi/cellular connection is active.
- **Deliverable**: `DeviceInventoryRecord` containing IMEI numbers, MAC addresses, assigned PHC, and provisioning logs.

#### 2.4 Patient Recruitment & Stratification ($N = 500$)
- **Clinical Inclusion Criteria**:
  - Age $\ge 60$ years.
  - Baseline Clinical Dementia Rating (CDR) $0.5$ (Very Mild) or $1.0$ (Mild), or MMSE score between $14$ and $26$ inclusive.
  - Living with an identifiable family caregiver or under weekly ASHA visitation.
- **Exclusion Criteria**:
  - Severe terminal illness, advanced sensory deficits (complete bilateral blindness/deafness without aids), or acute delirium.
- **Deliverable**: `PatientEnrollmentRegister` with irreversible pseudo-IDs (`PID-PHC01-001` through `PID-PHC10-050`), age, gender, baseline MMSE, assigned cohort, and primary language.

#### 2.5 IVR-Only Sub-Cohort Selection ($N = 50$)
- **Sub-Cohort Demographics**:
  - 50 patients without access to smartphone/tablet at home.
  - Deployed exclusively via BSNL/Airtel toll-free IVR cognitive line (Sub-Phase 8.1 / 8.2).
  - Receives daily scheduled telephonic check-in (orientation questions, 3-word delayed recall, medication adherence reminder).
- **Comparison Objective**: Establishes statistical baseline to measure app-driven gamified reminiscence vs telephonic audio-only reminiscence.
- **Deliverable**: `IvrCohortRegister` with telephone numbers, scheduled call windows, and baseline MMSE.
