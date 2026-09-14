# Sub-Phase 9.4 Specification: Caregiver Wellness & Peer Support Ecosystem

## 1. Executive Overview & Clinical Rationale
Family dementia caregivers in Northeast India (NER) experience intense, prolonged physical, emotional, and financial strain. In rural and peri-urban tea-garden tracts, hill districts, and riverine char areas, caregivers face severe geographic isolation, stigma surrounding cognitive decline, and scarce specialized neuropsychiatric services.

Sub-Phase 9.4 introduces a dedicated, dignified Caregiver Wellness and Peer Support layer inside the Smriti-NER platform. Grounded in psychiatric screening standards and culturally attuned resilience practices, this subsystem safeguards the mental health of caregivers through:
1. **Periodic Caregiver Wellness Check-In**: A 4-item rapid screening tool based on the clinically validated Zarit Burden Interview (ZBI-4), adapted for NER linguistic and joint-family realities.
2. **Peer-Support Matching Engine**: A privacy-preserving cohort matcher pairing caregivers with compatible peer buddies within their district and language community (e.g., Kamrup Metro Assamese, East Khasi Hills Khasi, Imphal West Meitei).
3. **Burnout Flagging & Indigenous Resource Desks**: Automated detection of severe caregiver burden triggering immediate pointers to India's national Tele-MANAS helpline (14416 / LGBRIMH Tezpur nodal center) and indigenous grounding/respite soundscapes.
4. **Milestone M9 Tri-Tier Dashboard Suite Sign-Off**: Verification of all three core ecosystem dashboard personas (Caregiver Family View, ASHA Community View, Clinician/DMO Surveillance View) operating simultaneously with sub-30s offline telemetry synchronization.

---

## 2. Clinical Assessment: Zarit Burden Interview 4-Item (ZBI-4)

### 2.1 Screening Tool Architecture
The ZBI-4 assessment presents 4 non-stigmatizing questions scored on a Likert scale (0 to 4):
- `0`: Never (*কেতিয়াও নহয়* / *কখনও না* / *Honnei*)
- `1`: Rarely (*কেতিয়াবা কেতিয়াবা* / *কদাচিৎ* / *Tawite*)
- `2`: Sometimes (*মাজে মাজে* / *মাঝে মাঝে* / *Tengteng*)
- `3`: Frequently (*সঘনাই* / *ঘন ঘন* / *Hao tak*)
- `4`: Nearly Always (*প্ৰায় সদায়* / *প্রায় সব সময়* / *Pangna*)

| Item Code | Prompt Domain | Clinical Question Text |
|:---|:---|:---|
| `ZBI_01` | Role Strain | Do you feel that because of the time you spend with your relative that you don't have enough time for yourself or other responsibilities? |
| `ZBI_02` | Emotional Stress | Do you feel stressed between caring for your relative and trying to meet other responsibilities for your family or work? |
| `ZBI_03` | Uncertainty & Coping | Do you feel uncertain about what to do about your relative or where to find help? |
| `ZBI_04` | Overwhelmedness | Do you feel strained or overwhelmed when you are around your relative? |

### 2.2 Scoring Matrix & Severity Tiers
$$\text{Burden Score} = \sum_{i=1}^{4} \text{Score}(\text{Item}_i) \quad (0 \le \text{Score} \le 16)$$

| Score Range | Severity Tier | Clinical Interpretation | Action Protocol |
|:---:|:---|:---|:---|
| **0 – 4** | `MINIMAL_MILD` | Good coping balance; normal caregiver stress | Routine positive reinforcement; 14-day check-in cadence |
| **5 – 8** | `MODERATE` | Emerging fatigue; elevated responsibility load | Introduce peer-support matching; offer respite audio modules |
| **9 – 16** | `SEVERE_BURNOUT` | High burnout risk; psychological exhaustion | **Trigger Burnout Alert**: Display Tele-MANAS (14416) emergency one-tap call, alert ASHA worker on next visit, surface local clinical counseling desks |

---

## 3. Peer-Support Matching Engine

### 3.1 Matching Algorithm
Caregivers can opt in to peer-to-peer mentoring. Matching is calculated using a multi-factor weighted compatibility formula:
$$S_{\text{match}}(C_A, C_B) = w_{\text{dist}} \cdot \mathbb{I}(\text{dist}_A = \text{dist}_B) + w_{\text{lang}} \cdot \mathbb{I}(\text{lang}_A \cap \text{lang}_B \ne \emptyset) + w_{\text{stage}} \cdot (1 - \frac{|\text{stage}_A - \text{stage}_B|}{3}) + w_{\text{readiness}} \cdot R_B$$

Where:
- $w_{\text{dist}} = 0.40$ (District proximity enables potential local respite cooperation)
- $w_{\text{lang}} = 0.30$ (Shared mother tongue essential for emotional resonance)
- $w_{\text{stage}} = 0.20$ (Care recipients at similar cognitive staging: 0=Mild, 1=Moderate, 2=Severe)
- $w_{\text{readiness}} = 0.10$ (Buddy willingness score to mentor newly diagnosed families)

### 3.2 Privacy & DISHA Guardrails
- **Pseudonymization**: Caregivers are identified exclusively by regional pseudonyms (e.g., `Caregiver-KMR-402`, `Peer-EKH-108`).
- **No Direct Phone Exposure**: Communication is channeled through mediated in-app peer circles or community reminiscence sessions moderated by certified ASHAs.
- **Revocable Consent**: Caregivers may pause or withdraw from peer pools with zero telemetry impact.

---

## 4. Resource Desks & Indigenous Grounding

### 4.1 Crisis & Clinical Escalation Desks
- **National Tele-MANAS (Toll-Free 14416 / 1800-891-4416)**: Direct 24/7 mental health counseling in 20+ languages, routed to the LGBRIMH (Lokopriya Gopinath Bordoloi Regional Institute of Mental Health) Tezpur hub for Assam and neighboring states.
- **District Mental Health Program (DMHP) Clinics**: District Civil Hospital nodal centers across all 8 NER states.
- **ASHA Respite Support Protocol**: Flagged in ASHA portal as "Caregiver Support Needed" so the worker can provide 30 minutes of supervised patient interaction during home visits to afford the caregiver respite.

### 4.2 Culturally Attuned Indigenous Grounding Soundscapes
1. **Majuli Riverine Solitude**: Gentle Brahmaputra river ripples with traditional *Bhortal* bell chimes (Assam).
2. **Khasi Pine Mist Relaxation**: Soothing mountain breeze through Shillong pine groves with soft *Duitara* strings (Meghalaya).
3. **Loktak Floating Serenity**: Peaceful water lap on *phumdis* with traditional *Pena* bow resonances (Manipur).
4. **Champhai Valley Gentle Breeze**: Distant bamboo chime harmonies with warm ambient acoustic melodies (Mizoram).

---

## 5. Milestone M9 Verification Framework

Milestone M9 formally certifies that the tri-tier dashboard ecosystem is fully functional:
1. **Caregiver View (Family)**: MMSE 30-day trajectory rendering correctly with synthetic anomalies (day 14 dip); adherence ring charts; sundowning alert notifications.
2. **ASHA Worker View (Community)**: Multi-patient cohort dashboard with offline BLE delta sync benchmarking under 30 seconds (<1.5s achieved for 14-day telemetry payload); visit checklists and reminiscence circle schedulers operational.
3. **Clinician / DMO View (Surveillance)**: Anonymized district surveillance, DISHA consent-gated drilldowns, automated >3-point drop detection, and e-Sanjeevani doctor consult handoff bridge.
4. **Caregiver Wellness View (Support)**: ZBI-4 check-in execution, scoring classification, peer-support matching, and crisis resource routing.
