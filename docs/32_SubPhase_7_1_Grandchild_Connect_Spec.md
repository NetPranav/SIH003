# Smriti-NER (স্মৃতি): Sub-Phase 7.1 — Grandchild Connect (Async Co-Play) Specification
**Document ID**: `SPEC-SOC-GCC-071`  
**Version**: `1.0.0`  
**Status**: `APPROVED`  
**Target Milestone**: `M7 (Social Connection Operational)`  
**Clinical Focus**: Intergenerational Affective Grounding, Async Family Co-Play & Social Isolation Mitigation in Geriatric Dementia

---

## 1. Clinical Rationale: Intergenerational Co-Play vs. Isolation

In geriatric neurodegenerative conditions (Mild Cognitive Impairment, Alzheimer's disease, and Vascular Dementia), cognitive exercises often feel clinical, punitive, or repetitive when undertaken in isolation. Elders frequently suffer from apathy and social disengagement.

Clinical studies in Reminiscence Therapy (Cochrane Dementia Group, Woods et al., 2018) demonstrate that:
1. **Affective Auditory Grounding**: Hearing a direct personal greeting and hint from a grandchild or son/daughter ("ককা, চাওঁ এই ফুলটো চিনি পোৱা নেকি?" / "Grandpa, let's see if you remember this flower!") activates anterior cingulate and limbic dopamine pathways, significantly reducing pre-task agitation.
2. **Intergenerational Scaffolding**: Rather than asking elders to solve abstract tests, grandchildren act as playful guides.
3. **Closing the Emotional Loop**: When the elder finishes the puzzle round, sending a response (an audio cheer, family star, or gratitude clip) back to the grandchild creates a rewarding social reciprocity cycle, incentivizing both generations to keep playing daily.

```
┌─────────────────────────────────────────────────────────────┐
│          GRANDCHILD / FAMILY MEMBER RECORDING FLOW          │
│                                                             │
│  1. Select Game Round (e.g. Memory Pairs / Market Haat)     │
│  2. Record 10-Second Voice/Video Clue                       │
│     - Audio: Opus 24kHz @ 32kbps                            │
│     - Video: WebM/H.264 480p @ 30fps (Optional)             │
│  3. Attach Target Clue Item & Kinship Tag ("নাতিনী", etc.)  │
│  4. Encrypted Local Dispatch & Cloud Sync                   │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 ELDER CLUE-LINKED GAME ROUND                │
│                                                             │
│  1. Elder launches game round on tablet/PWA                 │
│  2. Grandchild's face & audio clip auto-plays with warm     │
│     border: "ককা, বিহুৰ সময়ত আমি কি নাচোঁ?"                  │
│  3. Elder plays with active affective confidence boost       │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 ELDER-TO-FAMILY RESPONSE LOOP               │
│                                                             │
│  1. Round completed successfully                            │
│  2. Auto-generated or elder-recorded response clip:         │
│     - "নাতিনীয়ে দিয়া ক্লুৰে ককা জিকিল! 🌟"                 │
│  3. Caregiver/Family view receives completion celebration   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technical Constraints & Specification

### 2.1 Clue Recording Ceiling & Format
- **Strict Duration Ceiling**: Maximum **10.0 seconds** to avoid cognitive overload and ensure crisp, actionable hints.
- **Audio Specification**: WebM/Opus or AAC, 24kHz, mono, normalized to -3 dBFS.
- **Video Specification (Optional)**: WebM/VP8 or MP4/H.264, 480x480 (1:1 square elder-friendly portrait), max 1.5 MB per clip.
- **Fallback Transcript**: Every recorded clue stores a text transcript in one of the 8 NER languages (`as`, `mni`, `bn`, `brx`, `kha`, `lus`, `hi`, `en`) for elders with hearing impairment.

### 2.2 Clue-Game Binding Engine
Clues bind to specific cognitive puzzle domains:
- **Game 1 (Bihu Loom Pattern Sequencing)**: Hint guides color/textile choice ("Grandma, pick the Muga silk gold thread!").
- **Game 2 (NER Animal & Bird Acoustic Identification)**: Hint imitates or describes regional fauna ("Grandpa, it's the Great Hornbill we saw in Kaziranga!").
- **Game 3 (Village Haat Vegetable & Spice Sorting)**: Hint specifies target market basket item ("Grandpa, buy the Bhut Jolokia chillies!").
- **Game 4 (Cultural Heritage Memory Match)**: Hint guides historical monument recall ("Grandmother, remember our trip to Rang Ghar?").

### 2.3 Elder Response Loop Payloads
Upon round completion, an `ElderResponseLoopPayload` is formed:
```json
{
  "clueId": "clue_gcc_98214",
  "patientId": "pt_elder_001",
  "grandchildName": "Ananya",
  "gameRoundId": "game_loom_03",
  "status": "COMPLETED",
  "score": 100,
  "timeSpentMs": 7200,
  "elderReactionBadge": "CELEBRATION_STAR",
  "autoAudioPraise": "ককা জিকিল! ধন্যবাদ তোমাক!",
  "completedAt": "2026-09-14T12:45:00Z"
}
```

---

## 3. Implementation Deliverables

- [x] Sub-Phase 7.1 Technical Specification (`docs/32_SubPhase_7_1_Grandchild_Connect_Spec.md`)
- [ ] TypeScript Grandchild Connect Engine (`smriti-ner/src/lib/grandchildConnectEngine.ts`)
- [ ] FastAPI Backend Endpoints (`server/main.py`)
- [ ] Monorepo Test Suite (`tests/test_grandchild_connect.py`)
- [ ] Next.js PWA Production Build Verification
