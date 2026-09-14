# Smriti-NER (স্মৃতি): Sub-Phase 7.2 — Community Reminiscence Circles Specification
**Document ID**: `SPEC-SOC-CRC-072`  
**Version**: `1.0.0`  
**Status**: `APPROVED`  
**Target Milestone**: `M7 (Social Connection Operational)`  
**Clinical Focus**: Non-Competitive Group Reminiscence, ASHA-Facilitated Village Circles, and Shared-Screen Social Engagement in Rural NER

---

## 1. Clinical Rationale: Collaborative Joy vs. Competitive Stigma

In rural North Eastern India, community cohesion is historically anchored in village institutions: the Assamese *Namghar*, the Khasi *Dorbar Shnong*, the Mizo *Tlawmngaihna* community ethos, and Manipur's *Lai Haraoba* village squares.

Traditional digital cognitive tools fail in rural community settings when they import Western individualistic, competitive paradigms:
- **Individual Leaderboards Induce Stigma**: Ranking elderly peers by reaction times or accuracy causes shame, cognitive withdrawal, and refusal to participate.
- **Dementia-Inclusive Shared Screen**: By projecting cognitive games onto a shared tablet or TV at the Anganwadi / Sub-Centre / PHC, elders participate collectively as a single team.
- **ASHA as Facilitator, Not Proctor**: The Accredited Social Health Activist (ASHA) guides conversation, prompts reminiscence, and logs collective engagement rather than conducting stressful clinical examinations.

```
┌─────────────────────────────────────────────────────────────┐
│          COMMUNITY REMINISCENCE CIRCLE ARCHITECTURE         │
│                                                             │
│       Shared Anganwadi / PHC Display (Tablet / TV)          │
│                                                             │
│     👵 আইতা বৰা       👴 ককা হাজৰিকা      👵 আইতা গগৈ       │
│     (Participant 1)   (Participant 2)   (Participant 3)     │
│                                                             │
│                    👩‍⚕️ ASHA Facilitator                     │
│               (Guided Discussion & Rhythms)                 │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│          NON-COMPETITIVE ENGAGEMENT LOGGING PIPELINE        │
│                                                             │
│  • Attendance: 4–6 Elders Present                           │
│  • Verbal Participation & Laughter Index (0.0 to 1.0)       │
│  • Collective Village Stars Earned (e.g. ⭐ 500 Village Pts) │
│  • Zero Individual Scores (Eliminates Performance Anxiety)  │
│  • Localized ASHA Facilitation Scripts in 8 Languages       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technical Protocol & Structure

### 2.1 Shared-Screen Group Mode Variant
- **Display Scaling**: Font sizes scale to 28pt+ for communal viewing at 2–3 meters distance.
- **Turn-Free Consensus Play**: The group deliberates together ("Does anyone recognize this bird call?"); the ASHA taps the agreed choice on behalf of the circle.
- **Communal Celebration**: Success triggers celebratory folk fanfare (Dhol/Pepa acoustic chords) and collective star animation for the village centre.

### 2.2 ASHA 4-Stage Facilitation Guide
Every session follows a strictly timed 25-minute protocol:
1. **Stage 1 (0–5 min) — Welcome & Folk Song Humming**: Familiar pentatonic folk melody humming to align circadian focus.
2. **Stage 2 (5–15 min) — Shared Visual/Audio Reminiscence**: 5 communal trivia rounds on local agricultural landmarks, weaving patterns, or historical events.
3. **Stage 3 (15–22 min) — Autobiographical Story Circle**: Open prompt (e.g. "Tell us about the best rice harvest festival from your youth").
4. **Stage 4 (22–25 min) — Warm Herbal Tea & Collective Blessing**: Preempts twilight agitation and reinforces social belonging.

### 2.3 Group Engagement Log Schema
```json
{
  "sessionId": "circle_sess_2026_09_14_majuli_01",
  "villageId": "vil_majuli_kamalabari",
  "facilityType": "ANGANWADI_CENTRE",
  "facilitatorName": "Jonali Saikia (ASHA)",
  "sessionDate": "2026-09-14",
  "attendanceCount": 5,
  "collectiveStarsEarned": 450,
  "laughterInteractionRating": 0.92,
  "verbalParticipationRating": 0.88,
  "dominantLanguage": "as",
  "fieldNotes": "Elders enthusiastically sang traditional Tokari geet during Round 2."
}
```

---

## 3. Implementation Deliverables

- [x] Sub-Phase 7.2 Technical Specification (`docs/33_SubPhase_7_2_Community_Reminiscence_Circles_Spec.md`)
- [ ] TypeScript Community Circles Engine (`smriti-ner/src/lib/communityCirclesEngine.ts`)
- [ ] FastAPI Backend Endpoints (`server/main.py`)
- [ ] Monorepo Python Validation Suite (`tests/test_community_circles.py`)
- [ ] Next.js PWA Production Build Verification
