# SMRITI-NER SUB-PHASE 5.2 SPECIFICATION: BAYESIAN KNOWLEDGE TRACING (BKT) ENGINE

**Document Reference**: SMRITI-P5-SP5.2-SPEC-v1.0  
**Phase**: Phase 5 — Edge AI: DCDA & Federated Learning Engine  
**Sub-Phase**: 5.2 — Bayesian Knowledge Tracing (BKT) Engine  
**Target Platform**: Progressive Web Application (PWA) / Tablet & Edge Shell  
**Clinical Standards**: Corbett & Anderson Cognitive Modeling, Hidden Markov Model (HMM) Latent State Inference, MMSE Cognitive Domain Correlation  
**Status**: ACTIVE / PRODUCTION SPECIFICATION  

---

## 1. Neuropsychological Rationale & Clinical Objectives

Standard computerized cognitive training systems apply simplistic scoring formulas (e.g. percentage correct over a 10-item session). In dementia therapeutics, this is deeply flawed:
1. **Motor Slips ($P(S)$)**: An elder who knows the target instrument may experience an arthritic tremor that lands on an adjacent card. Linear scoring penalizes this as a memory failure.
2. **Lucky Guesses ($P(G)$)**: On a 2-choice card screen, random guessing yields 50% accuracy. Linear scoring prematurely inflates task difficulty.
3. **Retention Dynamics ($P(T)$)**: Genuine neuro-therapeutic rehabilitation involves gradual synaptic consolidation rather than instantaneous mastery.

Sub-Phase 5.2 implements the **Bayesian Knowledge Tracing (BKT) Engine**, modeling cognitive mastery as a two-state Hidden Markov Model (HMM). The system continuously calculates the posterior probability that a specific cognitive domain is retained ($P(L_t)$), cleanly filtering out motor slips and lucky guesses.

---

## 2. Mathematical Formulation: 4-Parameter BKT

For each cognitive concept $c$, the elder's cognitive state is represented by a binary latent variable $L_t \in \{0, 1\}$:
- $L_t = 1$: Concept is consolidated in long-term functional memory.
- $L_t = 0$: Concept is unlearned / compromised.

```
                  ┌───────── P(T) ─────────┐
                  ▼                        │
          ┌───────────────┐        ┌───────────────┐
          │ Unlearned (0) │        │  Learned (1)  │
          └───────────────┘        └───────────────┘
                  │                        ▲
                  └────── 1 - P(T) ────────┘
```

### 2.1 The 4 Clinical Parameters
1. **$P(L_0)$ (Prior Mastery)**: Initial probability that the elder enters the session with the concept intact ($0.50 - 0.65$ nominal).
2. **$P(T)$ (Transition / Acquisition Probability)**: Probability that the elder transitions from unlearned to learned through therapeutic gameplay rehearsal ($T \approx 0.08$).
3. **$P(G)$ (Guess Probability)**: Probability of a correct selection when the concept is actually unlearned. Dynamically scales with available choices ($K$):
   $$P(G) = \frac{1}{K}, \quad K \in \{2, 3, 4, 5, 6\}$$
4. **$P(S)$ (Motor Slip Probability)**: Probability that an elder with intact memory slips due to motor tremor or touch wander ($S \approx 0.18$ in geriatric cohorts).

---

### 2.2 Observation Update Equations (HMM Forward Step)

Let $Y_t \in \{0, 1\}$ represent the observed correctness of trial $t$.

#### Case 1: Correct Interaction ($Y_t = 1$)
$$P(L_t \mid Y_t = 1) = \frac{P(L_{t-1}) \cdot (1 - P(S))}{P(L_{t-1}) \cdot (1 - P(S)) + (1 - P(L_{t-1})) \cdot P(G)}$$

#### Case 2: Incorrect Interaction ($Y_t = 0$)
$$P(L_t \mid Y_t = 0) = \frac{P(L_{t-1}) \cdot P(S)}{P(L_{t-1}) \cdot P(S) + (1 - P(L_{t-1})) \cdot (1 - P(G))}$$

#### Latent State Transition for Trial $t+1$:
$$P(L_{t+1}) = P(L_t \mid Y_t) + (1 - P(L_t \mid Y_t)) \cdot P(T)$$

---

## 3. Concept Domain Parameter Profiles

| Concept ID | Target Cognitive Domain | Game Anchor | $P(L_0)$ | $P(T)$ | Base $P(G)$ | $P(S)$ |
|:---|:---|:---|:---:|:---:|:---:|:---:|
| `auditory_folk_rhythm` | Auditory Working Memory & Phonological Loop | Game 1 (Dhol-Pepa) | 0.60 | 0.08 | 0.25 | 0.18 |
| `visuospatial_fauna_search` | Figure-Ground Attention & Feature Binding | Game 2 (Kaziranga) | 0.65 | 0.09 | 0.25 | 0.15 |
| `visuomotor_pattern_weaving` | Procedural Sequencing & Motor Schemas | Game 3 (Weaver's Loom) | 0.55 | 0.07 | 0.25 | 0.20 |
| `delayed_episodic_recall` | Delayed Recall & Working Memory Category Fluency | Game 4 (Daily Haat) | 0.50 | 0.06 | 0.20 | 0.16 |

---

## 4. Mastery Threshold Tuning & Tier Escalation

The BKT engine evaluates posterior probability against three clinical zones:

```
0.00 ─────────── 0.35 ───────────────────── 0.85 ─────────── 1.00
       Struggle Zone │  Consolidation Zone  │  Mastery Zone
     (Tier Decrement)│  (Maintain Tier)     │ (Tier Elevation)
```

1. **Mastery Elevation Zone ($P(L_t) \ge 0.85$)**:
   - Confirms true cognitive consolidation.
   - Signals difficulty state machine to elevate difficulty tier (+1) if consecutive successes $\ge 2$ and AACB is inactive.
2. **Consolidation Zone ($0.35 < P(L_t) < 0.85$)**:
   - Maintains current tier to provide stabilizing reinforcement without cognitive overload.
3. **Struggle / Fatigue Zone ($P(L_t) \le 0.35$)**:
   - Triggers proactive tier reduction (-1) to alleviate cognitive fatigue before agitation manifests.

---

## 5. Edge Performance & Benchmark Standard

- **Compute Latency**: On-device posterior update computation must execute in $\le 0.10\,\text{ms}$ per trial ($\ll 5\,\text{ms}$ ceiling on low-end Android devices with 2GB RAM).
- **Zero Memory Leaks**: State updates operate as pure immutable transforms.
- **Offline Persistence**: BKT state vectors are cached locally in `localStorage` and synchronized asynchronously during network availability windows.

---

*Authored for Smriti-NER (SIH 2026 — PS ID: 26003) — Ministry of Development of North Eastern Region (MDoNER)*
