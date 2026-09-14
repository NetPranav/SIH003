# Sub-Phase 20.1 Specification: Governance Framework & Clinical Advisory Board

## 1. Executive Summary & Context
Sub-Phase 20.1 establishes the statutory, clinical, and ethical governance pillars for Smriti-NER to guarantee **long-term patient rights protection, clinical rigor, and ethical algorithmic transparency** across the North Eastern Region. As the platform transitions from rollout into permanent institutional healthcare delivery, governance is anchored by three foundational instruments:
1. **Data Governance Policy**: DPDP Act 2023 and DISHA compliant data retention, access, anonymization, and right-to-forget protocols approved by MDoNER.
2. **Clinical Advisory Board Charter**: An independent clinical governing body of 5 Neurologists and 3 Geriatric Specialists from medical colleges across all 8 NER states.
3. **Ethics Review SOP**: An annual institutional review protocol scrutinizing AI fairness, acoustic biomarker validity, differential privacy guarantees, and cultural folklore veneration.

---

## 2. Data Governance Policy (DPDP Act 2023 & DISHA Compliant)

### 2.1 Statutory Data Classification & Retention Architecture
- **Statutory Framework**: Digital Personal Data Protection (DPDP) Act 2023, Digital Information Security in Healthcare Act (DISHA), and National Digital Health Mission (NDHM) Health Data Management Policy.
- **Data Retention Tiers**:

| Tier | Data Category | Retention Period | Storage Location | Cryptographic Protection |
|:---|:---|:---|:---|:---|
| **Tier 1** | Raw Acoustic & Audio Recordings | $\le 7$ days (auto-purged post-feature extraction) | Local Edge Device / Ephemeral Ingestion Buffer | Temporary memory buffer; zero disk persistence |
| **Tier 2** | Longitudinal Biomarker Vectors (F0, Jitter, Shimmer) | 7 Years (statutory clinical longitudinal tracking) | State Data Centre (SDC) Encrypted Vault | AES-256 at rest; TLS 1.3 in transit |
| **Tier 3** | CCEI v2 Composite Indices & Diagnostic Flags | Permanent (or until patient/guardian requested erasure) | National Health Telemetry Warehouse | ABHA ID tokenized with HMAC-SHA256 |
| **Tier 4** | Anonymized Research Marts ($k \ge 50$) | Permanent (open academic research) | Academic Data Lake (MOU institutions) | Differential privacy noise injected ($\epsilon \le 0.85$) |

### 2.2 Patient Rights & "Right to Forget" Protocol
- In compliance with Section 12 of the DPDP Act 2023:
  - Elders or authorized primary caregivers can trigger complete account and data erasure via the App, PWA, or by pressing `9` on the `1800-890-SMRITI` IVR gateway.
  - Deletion verification requires an OTP sent to the registered mobile number or in-person confirmation by the designated ASHA worker.
  - Complete erasure SLA: **$\le 72$ hours** across primary databases, Redis caches, backup snapshots, and downstream research pipelines.

---

## 3. Clinical Advisory Board (Charter & Roster)

### 3.1 Board Composition & Institutional Representation
The Clinical Advisory Board consists of 8 distinguished specialists across premier Northeast medical colleges:

| Member Name | Designation | Institution | State | Specialty |
|:---|:---|:---|:---|:---|
| **Dr. Hemanta Kumar Saikia** *(Chair)* | Professor & Head of Neurology | Gauhati Medical College & Hospital (GMCH) | Assam | Cognitive Neurology |
| **Dr. Nongthombam Joychandra Singh** | Professor & Head of Neurology | Regional Institute of Medical Sciences (RIMS) | Manipur | Neurodegenerative Disorders |
| **Dr. B. T. Shenoi** | Professor of Geriatric Medicine | Sikkim Manipal Institute of Medical Sciences (SMIMS) | Sikkim | Geriatric Cognitive Health |
| **Dr. P. K. Bhattacharya** | Director & Head of Internal Medicine | NEIGRIHMS Shillong | Meghalaya | Rural Geriatric Epidemiology |
| **Dr. Rebecca Lalhmangaihi** | Senior Consultant Neurologist | Civil Hospital Aizawl | Mizoram | Clinical Neurophysiology |
| **Dr. Taba Nirmali** | Lead Geriatrician | Tomo Riba Institute of Health & Medical Sciences (TRIHMS) | Arunachal Pradesh | Indigenous Elder Care |
| **Dr. Sanjoy Debbarma** | Consultant Neurologist | Agartala Government Medical College (AGMC) | Tripura | Stroke & Cognitive Decline |
| **Dr. Khrielie Liezietsu** | Senior Medical Officer & Neurologist | Naga Hospital Authority Kohima (NHAK) | Nagaland | Clinical Neurology |

### 3.2 Charter Responsibilities
- Review cognitive game difficulty curves and psychometric calibrations bi-annually.
- Validate MMSE proxy regression models ($r \ge 0.85$ correlation target).
- Authorize CCEI clinical drop threshold alarms ($\text{CCEI} < 50$) triggering automated clinician consults.
- Adjudicate secondary referrals from frontline ASHA field evaluations.

---

## 4. Ethics Review Cycle (Standard Operating Procedure)

### 4.1 Annual Ethical Audit Pillars
An independent ethics committee convenes annually in Q4 to audit Smriti-NER across 4 core pillars:
1. **Algorithmic Fairness & Linguistic Parity**: Validate that diagnostic models and CCEI calculations maintain uniform predictive power across all 8 supported languages without dialect bias.
2. **Vulnerable Population Informed Consent**: Verify that elders with mild cognitive impairment or illiteracy gave verifiable consent through ASHA dyad facilitation or vernacular IVR voice signatures.
3. **Differential Privacy & Federated Learning**: Confirm that privacy budget consumption ($\epsilon$) across all participating districts remains strictly below statutory boundaries ($\epsilon \le 1.0$).
4. **Cultural Sacredness & Oral Heritage Protection**: Ensure that tribal folktales, sacred chants, and indigenous folklore are treated as community heritage rather than commercial assets.

---

## 5. Verification & Testing Standards
- All endpoints must return HTTP 200 with structured JSON.
- Unit tests must verify:
  1. Data governance retention tiers, encryption standards, and DPDP right-to-forget SLA.
  2. Clinical Advisory Board roster (8 clinicians: 5 neurologists, 3 geriatrics across NER medical colleges).
  3. Ethics review pillars and bi-annual audit cadence.
  4. Consolidated governance summary.
