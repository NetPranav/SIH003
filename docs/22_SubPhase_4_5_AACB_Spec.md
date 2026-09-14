# SMRITI-NER SUB-PHASE 4.5 SPECIFICATION: ANTI-AGITATION CIRCUIT BREAKER (AACB) & COMPASSIONATE INTERACTION DESIGN

**Document Reference**: SMRITI-P4-SP4.5-SPEC-v1.0  
**Phase**: Phase 4 — Patient PWA Shell & Cognitive Game Engine  
**Sub-Phase**: 4.5 — Anti-Agitation Circuit Breaker (AACB) — Cross-Game  
**Target Platform**: Progressive Web Application (PWA) / Tablet & Edge Shell  
**Clinical Standards**: Compassionate Interaction Design (CID), Goldstein Catastrophic Reaction Prevention, WCAG 2.2 AAA  
**Status**: ACTIVE / PRODUCTION SPECIFICATION  

---

## 1. Neuropsychological Rationale & Clinical Objectives

In elderly individuals living with Mild Cognitive Impairment (MCI), Alzheimer's disease, and vascular dementias, standard interactive computing models that utilize negative visual or auditory feedback (red error crosses, buzzer buzzes, failed timers) induce severe emotional distress.

Kurt Goldstein (1952) first categorized this neuro-behavioral response as the **Catastrophic Reaction**: when an organic brain impairment prevents an individual from fulfilling a perceived expectation, acute anxiety, catastrophic agitation, motor tremors, and total cognitive withdrawal immediately ensue.

The **Anti-Agitation Circuit Breaker (AACB)** operates as a non-invasive, continuous guardian layer embedded across all cognitive activities in Smriti-NER. Its purpose is to:
1. **Detect cognitive fatigue or impending distress** before behavioral agitation escalates.
2. **Smoothly transition the task environment into a supportive state** where errors are rendered invisible and non-punitive.
3. **Provide immediate sensory scaffolding** through subtle figure-ground dimming, golden halo guidance, tactile tremor mitigation, and soothing regional kinship voice prompts.

---

## 2. Mathematical Formulation: Agitation Vulnerability Index ($AVI_t$)

The AACB does not rely on simple static error counts; it computes the real-time **Agitation Vulnerability Index ($AVI_t$)**, combining an exponential error decay term with a z-score normalized motor panic deliberation metric:

$$AVI_t = \sum_{j=0}^{k-1} \gamma^j \cdot \text{Error}_j + \beta \cdot \max(0, Z_{RT})$$

Where:
- $k$: Current count of consecutive incorrect selections ($k \in \mathbb{N}_0$).
- $\gamma$: Memory discount factor ($\gamma = 0.85$), ensuring recent slips carry greater predictive weight than distant trials.
- $\text{Error}_j$: Binary indicator ($1$ for miss/slip, $0$ for correct).
- $\beta$: Hesitation sensitivity weighting coefficient ($\beta = 0.40$).
- $Z_{RT}$: Deliberation latency z-score normalized against the patient's rolling session baseline:
  $$Z_{RT} = \frac{RT_{\text{delib}} - \mu_{\text{delib}}}{\sigma_{\text{delib}}}$$
  (with default baseline parameters $\mu_{\text{delib}} = 950\,\text{ms}$, $\sigma_{\text{delib}} = 380\,\text{ms}$).

### Trigger Threshold & Circuit State Transitions
- When $AVI_t \ge 1.70$, the AACB trips immediately into the **ACTIVE** state.
- **Example scenarios triggering AACB**:
  1. Two consecutive incorrect taps ($k=2$): Error term $= 1.0 + 0.85 = 1.85 \ge 1.70$.
  2. Single incorrect tap ($k=1$) with severe hesitation panic ($Z_{RT} \ge 1.75$): $AVI_t = 1.0 + 0.40 \times 1.75 = 1.70$.
- **Reset Condition**: Any successful interaction immediately resets $k \to 0$, $AVI_t \to 0$, deactivates golden halos, and restores default visual opacity over a gentle 300ms transition.

---

## 3. The 5 Pillars of Compassionate Intervention

| Pillar | Mechanism | Technical Implementation | Clinical Goal |
|:---|:---|:---|:---|
| **1. Error Tracking** | Consecutive error & hesitation tracking with instant reset | `aacbEngine.recordError()`, `aacbEngine.recordSuccess()` | Prevents compounding failure cycles and emotional escalation. |
| **2. Visual Dimming** | Non-target distractors smoothly fade to 40% opacity | `.aacb-dimmed` CSS class, `transition: opacity 280ms ease` | Reduces visual clutter and cognitive load during visual search. |
| **3. Golden Halo Pulse** | Breathing amber-gold illumination on the expected target | `.aacb-golden-halo` with `@keyframes aacbGoldenPulse` | Draws gentle saccadic visual attention without alarm or shame. |
| **4. Hitbox Expansion** | Target clickable/tappable area expands by +25% | `.aacb-expanded-hitbox`, `scale(1.15)` + touch padding | Accommodates physiological motor tremors and touch wander. |
| **5. Zero Failure Sound** | Global prohibition on all negative buzzers and dissonance | `AudioSuppressionGuard` in `audio.ts` | Eliminates startle responses and emotional panic. |

---

## 4. Regional Kinship Voice Cue System

When the AACB activates, elders respond best to familiar, affectionate familial voices rather than robotic system announcements. The voice engine supports regional kinship titles based on the elder's profile:

| Language | Kinship Title | Native Script Voice Cue Prompt | English Translation |
|:---|:---|:---|:---|
| **Assamese (`as`)** | Bor-Deuta (বৰদেউতা) / Koka (ককা) | "একো চিন্তা নকৰিব দেউতা, সোণালী ৰঙৰ বস্তুটো চাওকচোন, আমি একেলগে কৰিম।" | "Don't worry at all father, look at the golden glowing item, we will do it together." |
| **Bengali (`bn`)** | Dadu (দাদু) / Baba (বাবা) | "কোনো চিন্তা নেই দাদু, সোনালী রঙের দিকে দেখুন, আমরা একসঙ্গে করছি।" | "No worries grandfather, look towards the golden color, we are doing it together." |
| **Meitei (`mni`)** | Ipa (ꯏꯄꯥ) / Pabung (ꯄꯥꯕꯨꯡ) | "ꯋꯥꯈꯜ ꯋꯥꯕꯤꯒꯅꯨ ꯏꯄꯥ, ꯁꯅꯥꯃꯆꯨꯒꯤ ꯃꯉꯥꯜ ꯑꯣꯏꯔꯤꯕ ꯑꯗꯨ ꯌꯦꯡꯕꯤꯌꯨ।" | "Do not worry father, look at the one glowing with golden light." |
| **Bodo (`brx`)** | Aabou (आबौ) | "गिखांनो नाङा आबौ, सोनानि गाब जोंनायखौ नायदो, जों लोगोसे खालामनो।" | "Do not fear grandfather, look at the golden shine, we do it together." |
| **Khasi (`kha`)** | Paieid / Kpa | "Wat pynsalia me Paieid, peit ia ka dur ba phyrnai ksiar, ngin leh lang." | "Do not worry father, look at the golden shining picture, let us do it together." |
| **Mizo (`lus`)** | Pu / Ka Pu | "Mangang suh pu, rangkachak eng mawi tak kha en rawh le, kan ti dun dawn nia." | "Do not be anxious grandfather, look at that beautiful golden light, we will do it together." |
| **Hindi (`hi`)** | Dadaji (दादाजी) / Nanaji (नानाजी) | "कोई बात नहीं दादाजी, सुनहरे चमकते हुए विकल्प को देखिए, हम साथ में करेंगे।" | "No problem grandfather, look at the golden glowing option, we will do it together." |
| **English (`en`)** | Grandfather / Dear | "Take your time, let's look together at the golden glowing option." | "Take your time, let's look together at the golden glowing option." |

---

## 5. Architectural Integration Across Games 1–4

1. **Game 1 (Dhol-Pepa Sur-Milon)**:
   - When AACB triggers: Inactive instruments dim to 40% opacity; the matching instrument pulses with `.aacb-golden-halo` and its sound plays at a comforting, slow tempo.
2. **Game 2 (Kaziranga Safari Search)**:
   - Grass foliage distractors dim to 40% opacity; target fauna (e.g. One-Horned Rhino) illuminates with golden halo aura; touch target expands by +25%.
3. **Game 3 (Weaver's Loom Pattern)**:
   - Incorrect yarn bobbins dim to 40%; correct colored shuttle yarn pulses with golden halo; wooden reed guidance arrow activates.
4. **Game 4 (Daily Haat Recall)**:
   - Distractor produce cards dim to 40%; the required recipe ingredient stall illuminates; AACBBanner displays calm market vendor advice.

---

## 6. Verification & Milestone M4 Acceptance Criteria

- **Zero Negative Audio**: 100% of negative audio events intercepted; 0Hz buzzer output.
- **Latency & Fluidity**: Visual dimming and golden halo transitions execute in $\le 280\,\text{ms}$ with zero dropped frames.
- **Accessibility & Compliance**: WCAG 2.2 AAA color contrast maintained throughout AACB state ($\ge 7:1$ contrast on text).
- **Lighthouse PWA Score**: $\ge 95$ across performance, accessibility, and best practices.

---

*Authored for Smriti-NER (SIH 2026 — PS ID: 26003) — Ministry of Development of North Eastern Region (MDoNER)*
