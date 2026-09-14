# Sub-Phase 10.3 Specification: Longitudinal Adherence Analytics & Trend Engine

## 1. Executive Overview
Elderly dementia medication regimens (such as cholinesterase inhibitors—Donepezil, Galantamine, Rivastigmine—and NMDA receptor antagonists like Memantine) require strict daily regularity to sustain neurocognitive function and prevent acute decompensation.

Sub-Phase 10.3 establishes the **Adherence Analytics Engine** for Smriti-NER, delivering:
1. **Granular Adherence Event Ledger**: Records scheduled time, actual confirmation time, latency (minutes), status (`ON_TIME`, `DELAYED`, `MISSED_ESCALATED`), and channel (`PWA_CLIENT`, `IVR_PHONE`).
2. **Multi-Window Compliance Rate Calculator**: Calculates daily, weekly (7-day), and monthly (30-day) rolling adherence rates across medication, hydration, and cognitive session categories.
3. **Dashboard Data Pipeline & Trend Feeds**: Feeds synchronized metrics into Caregiver Portal ring charts, ASHA cohort triage views, and DMO clinical correlation analyses (e.g. evaluating whether sudden MMSE proxy drops correlate with unconfirmed morning medications).

---

## 2. Adherence Data Model & Metrics Formulation

### 2.1 Adherence Record Schema
| Field | Type | Description |
|:---|:---|:---|
| `log_id` | `string` | Unique log UUID (e.g., `adh_20260914_0832`) |
| `patient_id` | `string` | Pseudonymized patient ID (e.g., `p_anand_01`) |
| `reminder_id` | `string` | Reference to scheduled reminder |
| `type` | `ReminderType` | `MEDICATION`, `HYDRATION`, `COGNITIVE_SESSION`, `MEAL` |
| `title` | `string` | Name of medication or hydration task |
| `dosage` | `string` | Prescribed dose |
| `scheduled_at` | `string` | ISO 8601 scheduled timestamp |
| `confirmed_at` | `string` | ISO 8601 actual confirmation timestamp (or null if missed) |
| `delay_minutes` | `number` | $(T_{\text{confirmed}} - T_{\text{scheduled}})/60$ |
| `status` | `AdherenceStatus` | `ON_TIME` ($\le 15$ min), `DELAYED` ($16 - 45$ min), `MISSED` ($> 45$ min or unanswered) |
| `channel` | `AdherenceChannel` | `PWA_CLIENT` (app tap) or `IVR_PHONE` (dial-in DTMF "1") |
| `snooze_count` | `number` | Number of snoozes before confirmation (0 to 3) |

### 2.2 Compliance Rate Formulation
For any observation period $W \in \{1\,\text{day}, 7\,\text{days}, 30\,\text{days}\}$:
$$\text{Compliance Rate}_W = \left( \frac{\sum_{i=1}^{N_{\text{sched}}} \mathbb{I}(\text{status}_i \in \{\text{ON\_TIME}, \text{DELAYED}\})}{N_{\text{sched}}} \right) \times 100\%$$

| Compliance Tier | Threshold | Clinical Interpretation | Action Protocol |
|:---:|:---:|:---|:---|
| **Optimal** | $\ge 85\%$ | High therapeutic consistency | Positive family encouragement |
| **Moderate Risk** | $65\% - 84\%$ | Intermittent omissions | Prompt kinship voice refresh; check ASHA visit schedule |
| **High Risk** | $< 65\%$ | Severe non-compliance | Trigger automated DMO flag; queue BSNL outbound IVR safety line |

---

## 3. Trend Pipeline & Cross-Feature Correlation

### 3.1 Caregiver Dashboard Ring Chart Feed
Computes category-specific rings:
- **Medication Ring**: $C_{\text{med}}$ percentage (e.g., 94%)
- **Hydration Ring**: $C_{\text{hydro}}$ percentage (e.g., 88%)
- **Cognitive Play Ring**: $C_{\text{play}}$ percentage (e.g., 78%)

### 3.2 Clinical Correlation Feed (DMO & Secondary Teleconsultation)
Correlates daily adherence logs with:
- **Circadian Tremor & Agitation**: Detects if missed morning doses correlate with elevated AACB agitation triggers in the late afternoon.
- **Reaction Time Fluctuations**: Flags sudden motor reaction slowdowns following missed anti-hypertensive or cholinergic medication.

---

## 4. Verification & Automated Test Strategy
1. **Event Logging**: Ingests `ON_TIME` and `DELAYED` adherence events, validating latency calculations.
2. **Multi-Window Compliance Calculations**: Asserts exact daily, 7-day, and 30-day percentage calculations across mixed event histories.
3. **Category-Specific Breakdown**: Validates medication vs. hydration ring metrics.
4. **Export Pipeline**: Verifies structured JSON payload readiness for Caregiver and Clinician dashboard consumption.
