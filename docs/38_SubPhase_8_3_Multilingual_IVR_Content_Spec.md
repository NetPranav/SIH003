# Smriti-NER (স্মৃতি): Sub-Phase 8.3 — Multilingual IVR Content Specification
**Document ID**: `SPEC-IVR-LNG-083`  
**Version**: `1.0.0`  
**Status**: `APPROVED`  
**Target Milestone**: `M8 (IVR Cognitive Line Operational)`  
**Clinical Focus**: 8-Language Voice Content Library, DTMF Language Selection & Persistent Caller Dialect Memory

---

## 1. Clinical Rationale: Mother-Tongue Priming in Low-Literacy Elders

For geriatric elders in rural North East India, cognitive disorientation escalates rapidly if greeted in an unfamiliar lingua franca (e.g. Hindi or English when their mother tongue is Meitei or Bodo).

Smriti-NER implements an **Adaptive Multilingual IVR Architecture**:
1. **1-Press Dialect Selection**: On first call, a polyglot welcome menu allows immediate selection via single digit:
   - `1`: অসমীয়া (Assamese)
   - `2`: বাংলা (Bengali)
   - `3`: ꯃꯤꯇꯩꯂꯣꯟ (Meitei)
   - `4`: बड़ो (Bodo)
   - `5`: Ka Ktien Khasi (Khasi)
   - `6`: Mizo ṭawng (Mizo)
   - `7`: हिन्दी (Hindi)
   - `8`: English
2. **Persistent Caller Profile**: Once selected, the caller's phone number is pinned to that dialect. All subsequent inbound calls and outbound reminders immediately bypass the menu and greet the elder in their native dialect.
3. **Telecom Circle Default Fallback**: If an unprofiled caller dials in, the IVR utilizes the telecom circle (Assam, North East I, North East II) to present the regionally dominant language first.

```
┌─────────────────────────────────────────────────────────────┐
│                 IVR LANGUAGE SELECTION FLOW                 │
│                                                             │
│       Caller Dials In (e.g. +91 98640-XXXXX)                │
│                                                             │
│                 ┌───────────┴───────────┐                   │
│                 ▼                       ▼                   │
│       [Profile Exists in DB]     [New First-Time Caller]    │
│                 │                       │                   │
│                 ▼                       ▼                   │
│       Instant Dialect Greet;     Polyglot Menu:             │
│       "নমস্কাৰ পিতা!"            "অসমীয়াৰ বাবে ১ টিপক...    │
│                                   বাংলাৰ বাবে ২..."          │
│                                         │                   │
│                                         ▼                   │
│                                  Keypress Captured;         │
│                                  Caller Profile Saved;      │
│                                  Proceed to Dialect Script  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technical Protocol & Schemas

### 2.1 Complete Script Bundle Schema
Each language bundle provides 7 structured audio prompts:
1. `welcome`: Warm initial greeting with kinship honorific.
2. `circadian_reassurance`: Calming phrase for dusk/twilight disorientation.
3. `orientation_question`: Clear binary temporal/spatial question.
4. `recall_presentation`: 3-word cultural noun triplet.
5. `recall_retrieval`: Prompt to speak or select recalled items.
6. `adherence_check`: Medication and hydration confirmation.
7. `goodbye_closure`: Reassuring sign-off and emergency ASHA contact.

---

## 3. Implementation Deliverables

- [x] Sub-Phase 8.3 Technical Specification (`docs/38_SubPhase_8_3_Multilingual_IVR_Content_Spec.md`)
- [x] TypeScript Multilingual IVR Library (`smriti-ner/src/lib/ivrMultilingualLibrary.ts`)
- [x] FastAPI Backend Endpoints (`server/main.py`)
- [x] Monorepo Python Validation Suite (`tests/test_ivr_multilingual_content.py`)
- [x] Next.js PWA Production Build Verification
