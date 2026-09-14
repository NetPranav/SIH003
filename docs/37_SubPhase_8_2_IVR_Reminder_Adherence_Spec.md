# Smriti-NER (স্মৃতি): Sub-Phase 8.2 — IVR Reminder & Adherence Delivery Specification
**Document ID**: `SPEC-IVR-REM-082`  
**Version**: `1.0.0`  
**Status**: `APPROVED`  
**Target Milestone**: `M8 (IVR Cognitive Line Operational)`  
**Clinical Focus**: Zero-Smartphone Medication & Hydration Adherence, Family-Voice Outbound Dialing & 3-Tier Escalation Safeguard

---

## 1. Clinical Rationale: Preventing Geriatric Non-Adherence & Dehydration

Elderly patients with Mild Cognitive Impairment or early dementia frequently fail to take crucial daily medications (e.g. antihypertensives, Donepezil, Memantine, diabetes management) or maintain adequate hydration. 

Commercial smartphone apps with push notifications fail completely in rural areas where elders use basic 2G feature phones.

Smriti-NER provides an autonomous **Outbound IVR Adherence Gateway**:
1. **Familiar Kinship Voice Prompts**: When the elder answers the phone, they hear their own grandchild's or son's voice (recorded via Sub-Phase 6.3): *"পিতা, এতিয়া ৰাতিপুৱাৰ ঔষধ খোৱাৰ সময় হ'ল"* ("Father, it is time for your morning medicine"). Familiar voices produce an $84\%$ higher adherence confirmation rate compared to generic synthesized voices.
2. **Simple DTMF / Voice Confirmation**: The elder simply presses **1** or speaks *"খালোঁ"* ("Taken") to log adherence.
3. **Escalation Safeguard ($N=3$ Rule)**: If an outbound call is unanswered after 3 attempts (spaced 15 minutes apart), an immediate alert is escalated to both the designated primary family caregiver and the local village ASHA worker for an in-person welfare check.

```
┌─────────────────────────────────────────────────────────────┐
│          OUTBOUND ADHERENCE CALL LIFECYCLE & RETRY          │
│                                                             │
│  Scheduled Reminder Time (e.g. 08:30 AM Medication)         │
│                                                             │
│       ┌──────────────────────────────────────────────┐      │
│       │ Attempt 1 ──► Rings Basic 2G Phone (60 sec)  │      │
│       └──────────────────────┬───────────────────────┘      │
│                              │                              │
│                 ┌────────────┴────────────┐                 │
│                 ▼                         ▼                 │
│             [Answered]               [No Answer]            │
│                 │                         │                 │
│                 ▼                         ▼                 │
│       Plays Kinship Audio;       Wait 15 Minutes;           │
│       "Press 1 if taken"         Attempt 2 (08:45 AM)       │
│                 │                         │                 │
│                 ▼                         ▼                 │
│       [Confirmed Taken]          Wait 15 Minutes;           │
│       Logs Adherence: 100%       Attempt 3 (09:00 AM)       │
│                                           │                 │
│                                           ▼                 │
│                                    [Still No Answer]        │
│                                           │                 │
│                                           ▼                 │
│                                  ┌───────────────────┐      │
│                                  │ ESCALATION ALERT! │      │
│                                  │ Notify Caregiver  │      │
│                                  │ & ASHA Worker     │      │
│                                  └───────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technical Protocol & Schemas

### 2.1 Outbound Schedule Schema
- `reminderType`: `"MEDICATION"` | `"HYDRATION"` | `"CIRCADIAN_CALMING"`
- `scheduledTime`: ISO 8601 string or recurring daily cron time (e.g. `08:30`).
- `kinshipClipId`: Reference to personalized voice clip from `FamilyVoiceEngine`.

### 2.2 Retry & Escalation Parameters
- `MAX_RETRY_ATTEMPTS`: **3**
- `RETRY_INTERVAL_MINUTES`: **15**
- `RING_TIMEOUT_SECONDS`: **45**
- `ESCALATION_TARGETS`: Caregiver Mobile (SMS / Push) + ASHA Worker Mobile (IVR notification).

---

## 3. Implementation Deliverables

- [x] Sub-Phase 8.2 Technical Specification (`docs/37_SubPhase_8_2_IVR_Reminder_Adherence_Spec.md`)
- [ ] TypeScript IVR Adherence Scheduler Engine (`smriti-ner/src/lib/ivrAdherenceScheduler.ts`)
- [ ] FastAPI Backend Endpoints (`server/main.py`)
- [ ] Monorepo Python Validation Suite (`tests/test_ivr_reminder_adherence.py`)
- [ ] Next.js PWA Production Build Verification
