# SMRITI-NER SUB-PHASE 5.3 SPECIFICATION: DIFFICULTY ORCHESTRATOR & DIGITAL MMSE PROXY ENGINE

**Document Reference**: SMRITI-P5-SP5.3-SPEC-v1.0  
**Phase**: Phase 5 — Edge AI: DCDA & Federated Learning Engine  
**Sub-Phase**: 5.3 — Difficulty Orchestrator & MMSE Proxy  
**Target Platform**: Progressive Web Application (PWA) / Tablet & Edge Shell  
**Clinical Standards**: MoCA / MMSE Psychometric Equivalence, Sundowning Circadian Protection, 95% Confidence Interval Regression  
**Status**: ACTIVE / PRODUCTION SPECIFICATION  

---

## 1. Executive Summary & Clinical Architecture

Digital therapeutics in geriatric cognitive care require a dual-layer cognitive engine:
1. **Real-time Micro-Adaptation (Difficulty Orchestrator)**: Modulating task complexity from trial to trial so the patient remains within their optimal challenge zone (Zone of Proximal Development), shielding them from catastrophic failure while avoiding boredom.
2. **Macro-Staging & Progress Projection (Digital MMSE/MoCA Proxy)**: Continuously synthesizing multi-game behavioral telemetry into a clinically recognized 30-point MMSE cognitive score proxy, complete with 95% confidence intervals and longitudinal 7-day/30-day trajectory slopes.

---

## 2. Difficulty Level Orchestrator & Smooth Transition Rules

The game engine operates across 5 discrete tiers:
- **Tier 1 (Introductory)**: 2 large choices, 8.0s timeout, visual cues enabled.
- **Tier 2 (Mild)**: 3 choices, 6.0s timeout, visual cues enabled.
- **Tier 3 (Moderate)**: 4 choices, 4.5s timeout, standard display.
- **Tier 4 (Advanced)**: 5 choices, 3.5s timeout, reduced cues.
- **Tier 5 (Mastery)**: 6 choices, 2.8s timeout, high rhythmic tempo.

### Transition Constraints & Safeguards
1. **Maximum Step Rule**: $\Delta_{\text{tier}} \in \{-1, 0, +1\}$. Direct jumps from Tier 1 to Tier 3 or Tier 4 to Tier 2 are strictly prohibited to maintain psychological safety.
2. **Transition Hysteresis**: A minimum of 3 consecutive trials must elapse after any tier shift before another transition can occur.
3. **AACB Immediate Demotion**: When the Anti-Agitation Circuit Breaker trips, the tier is decremented by 1 immediately and progression is frozen until positive recovery.

---

## 3. Circadian Sundowning Protection Module

Clinical sundowning manifests in up to 66% of Alzheimer's patients between late afternoon and early evening ($16:30 - 19:30\,\text{IST}$), characterized by marked increases in confusion, restlessness, and motor wander.

The **Circadian Adjustment Module**:
1. Evaluates local time:
   $$H_{\text{local}} = \text{Hour} + \frac{\text{Minute}}{60}$$
2. Sets the Circadian Lucidity Multiplier:
   $$\chi(t) = \begin{cases} 
   1.00 & 09:00 \le H_{\text{local}} \le 12:00 \quad (\text{Morning Peak}) \\
   0.75 & 12:00 < H_{\text{local}} < 16:30 \quad (\text{Afternoon Steady}) \\
   0.35 & 16:30 \le H_{\text{local}} \le 19:30 \quad (\text{Sundowning Window}) \\
   0.50 & \text{Otherwise} \quad (\text{Evening/Resting})
   \end{cases}$$
3. **Sundowning Tier Cap**: During the $16:30 - 19:30$ window, maximum allowed difficulty is strictly clamped to **Tier 3**, regardless of high BKT mastery scores.

---

## 4. Digital MMSE / MoCA Multi-Domain Proxy Projection

The engine projects game telemetry vectors into the 5 core MMSE domains ($30.0\,\text{points}$ maximum scale):

$$MMSE_{\text{proxy}} = \sum_{k=1}^5 S_k$$

| Domain $k$ | Cognitive Focus | Source Game | Max Score | Weight ($w_k$) |
|:---|:---|:---|:---:|:---:|
| 1. Orientation | Seasonal haat calendar & context | Game 4 (Daily Haat) | 5.0 | 0.167 |
| 2. Working Memory | Folk rhythm reproduction span | Game 1 (Dhol-Pepa) | 8.0 | 0.267 |
| 3. Attention & Calculation | Figure-ground fauna & token payment | Game 2 & Game 4 | 7.0 | 0.233 |
| 4. Executive Function | Pattern sequencing & planning | Game 3 (Weaver's Loom) | 6.0 | 0.200 |
| 5. Language & Cultural Recall | Folk instrument & animal naming | All Games | 4.0 | 0.133 |

### 4.1 95% Confidence Interval ($CI_{95\%}$) Formulation
Given the Standard Error of Measurement ($\text{SEM} \approx 1.25\,\text{points}$):
$$CI_{95\%} = \left[ \max(0, MMSE_{\text{proxy}} - 1.96 \cdot \text{SEM}), \min(30, MMSE_{\text{proxy}} + 1.96 \cdot \text{SEM}) \right]$$

### 4.2 Clinical Staging Cut-offs
- $25.0 \le MMSE_{\text{proxy}} \le 30.0$: **Intact Cognition** (Green, `#166534`)
- $20.0 \le MMSE_{\text{proxy}} < 25.0$: **Mild Cognitive Impairment (MCI)** (Amber, `#d97706`)
- $13.0 \le MMSE_{\text{proxy}} < 20.0$: **Moderate Dementia** (Orange, `#ea580c`)
- $MMSE_{\text{proxy}} < 13.0$: **Severe Decline** (Red, `#dc2626`)

---

## 5. Longitudinal Trajectory Calculation (Rolling 7-Day & 30-Day Slopes)

To distinguish transient daily dips from genuine neurodegenerative decline, the engine computes linear regression slopes across rolling time windows:

$$\beta_{\text{trend}} = \frac{\sum_{i=1}^N (t_i - \bar{t})(y_i - \bar{y})}{\sum_{i=1}^N (t_i - \bar{t})^2}$$

Where $t_i$ is session day offset and $y_i$ is session $MMSE_{\text{proxy}}$.

- **Stable**: $\beta_{\text{trend}} \ge -0.50\,\text{points/month}$
- **Mild Decline**: $-2.00 \le \beta_{\text{trend}} < -0.50\,\text{points/month}$
- **Rapid Progression**: $\beta_{\text{trend}} < -2.00\,\text{points/month}$ (triggers proactive ASHA Worker / Clinician alert).

---

*Authored for Smriti-NER (SIH 2026 — PS ID: 26003) — Ministry of Development of North Eastern Region (MDoNER)*
