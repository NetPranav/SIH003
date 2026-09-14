# Smriti-NER (স্মৃতি): Sub-Phase 7.3 — Digital Legacy Storytelling Specification
**Document ID**: `SPEC-SOC-DLS-073`  
**Version**: `1.0.0`  
**Status**: `APPROVED`  
**Target Milestone**: `M7 (Social Connection Operational)`  
**Clinical Focus**: Butler's Life-Review Therapy, Generational Folklore Archiving & Personalized Content Flywheel

---

## 1. Clinical Rationale: Generative Life-Review Therapy

Geriatric psychiatrist Robert Butler (1963) established that the **Life-Review process** is a universal psychodynamic necessity in later life. For elders with early-to-moderate dementia:
1. **Ribot's Law Conservation**: While short-term working memory decays, autobiographical memories from age 10–30 remain resiliently encoded in distributed neocortical networks.
2. **Combating Nihilism and Apathy**: Being invited to record oral histories reaffirms the elder's identity as a wise family elder rather than a passive care recipient.
3. **Generational Asset Creation**: In North Eastern India, tribal oral traditions, harvest songs, weaving patterns, and folklore are often lost across generations. Smriti-NER captures these oral stories as living family heirlooms.

```
┌─────────────────────────────────────────────────────────────┐
│                 THE CONTENT FLYWHEEL ENGINE                 │
│                                                             │
│  1. Elder records oral narrative:                           │
│     "১৯৬৫ চনত আমাৰ গাঁৱৰ নাওখেল হৈছিল ব্ৰহ্মপুত্ৰত..."      │
│                                                             │
│  2. Bhashini ASR Pipeline:                                  │
│     Auto-transcription into Assamese text with timestamps   │
│                                                             │
│  3. Deterministic Story-to-Trivia Converter:                │
│     Extracts entities (Brahmaputra, 1965, Boat Race)        │
│     → Synthesizes personalized game questions:              │
│       Q: "১৯৬৫ চনত ককা কোনখন নদীত নাও খেলিছিল?"            │
│       [A] ব্ৰহ্মপুত্ৰ [B] বৰাক [C] দিহিং [D] সোৱণশিৰি        │
│                                                             │
│  4. Family Archive View:                                    │
│     Grandchildren and family browse, listen, and play       │
│     games populated with their own grandparent's memories!  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technical Protocol & Schema

### 2.1 Story Recording Schema
- **Maximum Length**: 3 to 5 minutes per narrative chapter.
- **Audio Encoding**: Opus 24kHz @ 32kbps mono or uncompressed WAV.
- **Categorization Tags**:
  - `CHILDHOOD_FOLKLORE`: Regional legends, fairy tales, animal fables.
  - `AGRICULTURE_HARVEST`: Bihu, paddy planting, tea garden memories.
  - `TRADITIONAL_CRAFTS`: Muga loom weaving, pottery, bamboo woodwork.
  - `FAMILY_CELEBRATION`: Weddings, births, village festivals.

### 2.2 Bhashini ASR Transcription Pipeline
The narrative audio is submitted to the localized Bhashini ASR model (`ai4bharat/conformer-*`):
- Word Error Rate (WER) target $\le 18\%$ on low-resource Indic dialects.
- Generated transcript is stored with paragraph offsets for easy family searchability.

### 2.3 Story-to-Trivia Synthesis
The engine deterministically matches entity patterns:
- Place entities $\rightarrow$ Visuospatial multiple-choice puzzle.
- Date/Year entities $\rightarrow$ Temporal recall puzzle.
- Kinship/Friend names $\rightarrow$ Associative recall puzzle.

---

## 3. Implementation Deliverables

- [x] Sub-Phase 7.3 Technical Specification (`docs/34_SubPhase_7_3_Digital_Legacy_Storytelling_Spec.md`)
- [ ] TypeScript Digital Legacy Engine (`smriti-ner/src/lib/digitalLegacyEngine.ts`)
- [ ] FastAPI Backend Endpoints (`server/main.py`)
- [ ] Monorepo Python Validation Suite (`tests/test_digital_legacy.py`)
- [ ] Next.js PWA Production Build Verification
