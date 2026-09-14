# Smriti-NER (স্মৃতি): Sub-Phase 8.1 — IVR Cognitive Check-In Flow Specification
**Document ID**: `SPEC-IVR-CHK-081`  
**Version**: `1.0.0`  
**Status**: `APPROVED`  
**Target Milestone**: `M8 (IVR Cognitive Line Operational)`  
**Clinical Focus**: Zero-Smartphone Accessibility, Telephone Interview for Cognitive Status (TICS), Word-Recall & Orientation Assessment via Basic Feature Phones

---

## 1. Clinical Rationale: Zero-Smartphone Neurocognitive Screening

Over 68% of rural elders in North Eastern India do not own or cannot operate a touch-screen smartphone. They rely on basic 2G feature phones (Nokia 105, Lava, Itel) or landlines.

Smriti-NER provides an autonomous, toll-free Interactive Voice Response (IVR) line operating under the **Telephone Interview for Cognitive Status (TICS)** protocol (Brandt et al., 1988):
1. **Immediate Dialect Familiarity**: An inbound or scheduled outbound call greets the elder in their mother tongue with warm kinship honorifics ("নমস্কাৰ পিতা/আইতা").
2. **Delayed 3-Word Recall**: 3 culturally grounded high-frequency nouns are spoken aloud (e.g. *Gamusa, Jaapi, Kaziranga*). After an intervening orientation question (60-second cognitive delay), the elder is prompted to recall them.
3. **Orientation Questioning**: Day vs. Night or Morning vs. Evening orientation testable via DTMF keypad keypress ('1' or '2') or voice utterance.
4. **Non-Stigmatizing Composite Score**: Answers are synthesized into an objective, non-intimidating check-in score (0–100) and synced to the patient profile.

```
┌─────────────────────────────────────────────────────────────┐
│                 IVR CALL COGNITIVE FLOW                     │
│                                                             │
│  1. Inbound/Outbound Call Connects (Toll-Free 1800-XXX)     │
│                                                             │
│  2. Root Language Selection (Assamese, Meitei, Bengali...)  │
│                                                             │
│  3. Word-Recall Stage 1: Presentation                       │
│     "মন দি শুনক এই তিনিটা চিনাকি শব্দ:                      │
│      গামোচা, জাঁপী, কাজিৰঙা।"                               │
│                                                             │
│  4. Orientation Question (Intervening Delay):               │
│     "এতিয়া পুৱাৰ ভাগ হৈছেনে গধূলিৰ ভাগ?                    │
│      পুৱা হ'লে ১ টিপক, গধূলি হ'লে ২ টিপক।"                  │
│                                                             │
│  5. Word-Recall Stage 2: Delayed Retrieval                  │
│     "এতিয়া মোক সেই তিনিটা চিনাকি শব্দ আকৌ কওকচোন।"         │
│                                                             │
│  6. Composite Scoring & Caregiver Dashboard Sync            │
│     $S = (0.4 \times S_{\text{orient}} + 0.6 \times S_{\text{recall}}/3) \times 100$        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technical Protocol & Schemas

### 2.1 Cultural Word Lists per Language (8 NER Locales)
| Language | Code | Word 1 | Word 2 | Word 3 | Cultural Theme |
|:---|:---:|:---|:---|:---|:---|
| **Assamese** | `as` | গামোচা (*Gamusa*) | জাঁপী (*Jaapi*) | কাজিৰঙা (*Kaziranga*) | Traditional Handloom & Wildlife |
| **Meitei** | `mni` | ꯂꯩꯔꯨꯝ (*Leirum*) | ꯄꯨꯡ (*Pung*) | ꯂꯣꯛꯇꯥꯛ (*Loktak*) | Handloom, Drum & Sacred Lake |
| **Bengali** | `bn` | গামছা (*Gamcha*) | ঢাক (*Dhaak*) | সুন্দরবন (*Sundarban*) | Textile, Festival Drum & Forest |
| **Bodo** | `brx` | दखना (*Dokhona*) | सिफुं (*Sifung*) | मानस (*Manas*) | Bodo Attire, Bamboo Flute & Reserve |
| **Khasi** | `kha` | Jainsem | Duitara | Umiam | Khasi Dress, Folk Lute & Lake |
| **Mizo** | `lus` | Puanchei | Khuang | Reiek | Traditional Weave, Drum & Peak |
| **Hindi** | `hi` | शॉल (*Shawl*) | ढोलक (*Dholak*) | गंगा (*Ganga*) | Cultural Attire, Drum & River |
| **English** | `en` | Shawl | Flute | Mountain | General Elder Familiar Items |

### 2.2 Composite Mathematical Scoring Formula
$$S_{\text{composite}} = \Big( 0.4 \times S_{\text{orientation}} + 0.6 \times \frac{S_{\text{recall}}}{3} \Big) \times 100$$
- $S_{\text{orientation}} \in \{0, 1\}$: Binary success on temporal/spatial orientation.
- $S_{\text{recall}} \in \{0, 1, 2, 3\}$: Count of recognized or recalled items.
- Score Categories:
  - $\ge 75 \implies$ `NORMAL_STABLE`
  - $50 \le S < 75 \implies$ `MILD_FLUCTUATION`
  - $< 50 \implies$ `ATTENTION_SUGGESTED` (Flags ASHA worker for home visit)

---

## 3. Implementation Deliverables

- [x] Sub-Phase 8.1 Technical Specification (`docs/36_SubPhase_8_1_IVR_Cognitive_CheckIn_Spec.md`)
- [ ] TypeScript IVR Cognitive Check-In Engine (`smriti-ner/src/lib/ivrCognitiveCheckInEngine.ts`)
- [ ] FastAPI Backend Endpoints (`server/main.py`)
- [ ] Monorepo Python Validation Suite (`tests/test_ivr_cognitive_checkin.py`)
- [ ] Next.js PWA Production Build Verification
