# Smriti-NER (স্মৃতি): Sub-Phase 7.4 — Consent & Content Moderation Specification
**Document ID**: `SPEC-SOC-CON-074`  
**Version**: `1.0.0`  
**Status**: `APPROVED`  
**Target Milestone**: `M7 (Social Connection Operational)`  
**Clinical Focus**: DISHA 2018 Statutory Consent, Ethical PII Sanitization & ASHA Community Moderation Queue

---

## 1. Clinical & Ethical Rationale: Dignified Geriatric Consent

In digital neurocognitive platforms capturing voice messages, family clues, and personal reminiscences, privacy and consent present unique ethical challenges:
1. **Dynamic Cognitive Impairment & Proxy Assent**: In Mild-to-Moderate Dementia, an elder may experience fluctuating lucidity. Smriti-NER implements a **Dual-Gate Consent Model**:
   - **Legal Caregiver Consent**: Formal proxy authorization under DISHA 2018 Section 28 for data processing.
   - **Elder Ongoing Assent**: Gentle, localized verbal check-in prior to recording or sharing ("আইতা, আপুনি এইটো সাধু পৰিয়ালৰ লগত ভাগ কৰিব বিচাৰেনে?"). If the elder expresses reluctance, the recording is immediately aborted without pressure.
2. **Right to Immediate Revocation**: Caregivers or elders can revoke consent at any time, which cryptographically purges audio files and associated game trivia from local and cloud storage.
3. **PII and Sensitive Vulnerability Prevention**: Oral narratives may accidentally mention sensitive medical details ("Dr. Barua gave me Donepezil"), banking/pension disputes, or family conflicts. A lightweight moderation queue enables ASHA workers and community admins to review stories before they are ingested into the communal game trivia flywheel.

```
┌─────────────────────────────────────────────────────────────┐
│                 DUAL-GATE CONSENT PIPELINE                  │
│                                                             │
│  [Gate 1: Caregiver Proxy] ──► Explicit Scope Selection     │
│                                (Family / Circle / Flywheel) │
│                                                             │
│  [Gate 2: Elder Assent]    ──► Localized Audio Affirmation  │
│                                "হয়, মই ক'ব বিচাৰোঁ" (Yes)   │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│          AUTOMATED PII SCANNER & MODERATION QUEUE           │
│                                                             │
│  • Automated Regex/NER Scan: Aadhaar, Phone, Bank, Drugs    │
│  • ASHA / Admin Queue: Approve / Flag PII / Reject          │
│  • Approved Content ──► Ingested into Game Trivia Flywheel  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technical Protocol & Schemas

### 2.1 Consent Scopes & Schema
- `FAMILY_ONLY`: Clues and stories visible only to immediate verified family devices.
- `COMMUNITY_CIRCLE`: Shared during village Anganwadi/PHC reminiscence circles.
- `GAME_TRIVIA_FLYWHEEL`: Content converted into interactive cognitive puzzle rounds.

### 2.2 Automated PII Sanitation Rules
1. **Phone Numbers**: 10-digit Indian telecom sequences (`[6-9]\d{9}`).
2. **Aadhaar Numbers**: 12-digit Indian national identity numbers (`\d{4}\s?\d{4}\s?\d{4}`).
3. **Financial Figures**: Rupee amounts, pensions, property boundaries.
4. **Pharmaceutical Terms**: Donepezil, Memantine, Galantamine, Rivastigmine, Levodopa.

---

## 3. Implementation Deliverables

- [x] Sub-Phase 7.4 Technical Specification (`docs/35_SubPhase_7_4_Consent_And_Moderation_Spec.md`)
- [ ] TypeScript Social Consent & Moderation Engine (`smriti-ner/src/lib/socialConsentEngine.ts`)
- [ ] FastAPI Backend Endpoints (`server/main.py`)
- [ ] Monorepo Python Validation Suite (`tests/test_social_consent_and_moderation.py`)
- [ ] Phase 7 & Milestone M7 Master Roadmap Sign-Off
