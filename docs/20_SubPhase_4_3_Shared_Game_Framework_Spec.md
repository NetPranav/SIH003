# SMRITI-NER SUB-PHASE 4.3 SPECIFICATION: SHARED GAME FRAMEWORK & TELEMETRY ENGINE

**Document Reference**: SMRITI-P4-SP4.3-SPEC-v1.0  
**Phase**: Phase 4 — Patient PWA Shell & Cognitive Game Engine  
**Sub-Phase**: 4.3 — Shared Game Framework  
**Target Platform**: Progressive Web Application (PWA) / Hybrid Android Edge Shell  
**Mathematical Standards**: DCDA Latency Decomposition, Bayesian Knowledge Tracing (BKT), Anti-Agitation Circuit Breaker (AACB)  
**Status**: ACTIVE / PRODUCTION SPECIFICATION  

---

## 1. Executive Summary & Clinical Intent

The **Shared Game Framework** serves as the computational and clinical backbone for all cognitive gameplay in Smriti-NER. In elderly patients presenting with mild-to-moderate dementia, traditional gaming engines fail because:
1. They treat raw reaction time as purely cognitive, failing to isolate physiological tremor and motor hesitation ($\tau_{motor}$).
2. They feature abrupt, punitive difficulty spikes that cause agitation and catastrophic drop-outs.
3. They lack cultural grounding, presenting abstract shapes or western symbols rather than deeply consolidated lifelong memories (Ribot's law).
4. Their reward mechanisms use loud, high-frequency buzzers or flashing lights that can provoke sensory overload or seizure activity.

Sub-Phase 4.3 establishes a unified, high-performance TypeScript framework that abstracts session lifecycles, collects micro-telemetry with sub-5ms latency, adjusts difficulty smoothly across a 5-tier finite state machine, pre-caches cultural assets in 8 regional languages, and delivers elder-compassionate celebrations.

---

## 2. Mathematical & Architectural Specifications

### 2.1 Game Session Lifecycle Manager (`gameSessionManager.ts`)
Each cognitive gameplay round follows a strict, deterministic state machine:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   INIT SESSION  │ ───>  │  ACTIVE TRIAL   │ ───>  │    TELEMETRY    │
│  Load P(L_0),   │       │ Collect touch,  │       │  Decompose RT & │
│  Assets, Locale │       │ timestamps, err │       │  compute dev    │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                                             │
                                                             ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ PERSIST RECORD  │ <───  │ CELEBRATE / END │ <───  │   BKT & FSM     │
│ LocalStorage &  │       │ Elder-friendly  │       │ Update mastery, │
│ Delta Sync Pack │       │ praise + jingle │       │ check AACB & FSM│
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

#### Session Metadata Schema:
- `sessionId`: UUIDv4 string.
- `gameId`: `'dhol-pepa' | 'kaziranga' | 'weavers-loom' | 'daily-haat'`.
- `patientPseudoId`: SHA-256 pseudonymized identifier.
- `difficultyTier`: Integer `1` through `5`.
- `trials`: Array of individual trial telemetry records.
- `bktMastery`: Final $P(L_t)$ probability `[0.01, 0.99]`.
- `aacbTriggered`: Boolean indicating if circuit breaker activated during the session.

---

### 2.2 Telemetry Collector & Bi-Factor Latency Decomposition (`telemetryCollector.ts`)
The telemetry collector intercepts all user touch interactions on game canvases:

1. **Touch Coordinate & Deviation Vector**:
   - Touch Coordinates: $(x_{touch}, y_{touch})$
   - Target Center Coordinates: $(x_{target}, y_{target})$
   - Spatial Deviation: $\Delta_{dist} = \sqrt{(x_{touch} - x_{target})^2 + (y_{touch} - y_{target})^2}$

2. **Bi-Factor Latency Decomposition**:
   $$\tau_{motor} = \kappa \cdot \ln(\Omega_{wander}) + \delta_{baseline}$$
   $$RT_{delib} = \max(80\text{ms}, RT_{total} - \tau_{motor})$$
   - $\Omega_{wander} \ge 1.0$: Pre-tap trajectory wander index.
   - $\delta_{baseline} = 280\text{ms}$: Elder baseline neuromuscular conduction latency.
   - $\kappa = 240$: Tremor scaling parameter.

3. **Standardized 7-Element Session Telemetry Vector**:
   $$\mathbf{V}_{telemetry} = \left[ RT_{total},\, \tau_{motor},\, RT_{delib},\, \text{accuracy},\, \text{tier},\, \text{aacb\_flag},\, \text{circadian\_factor} \right]$$
   - Readily serialized into `<50KB` delta sync packets for Phase 5 on-device Federated Learning.

---

### 2.3 5-Tier Difficulty Finite State Machine (`difficultyStateMachine.ts`)

| Tier | Level Name | Visual Targets | Timeout / Rhythm | Distractor Dimming | BKT Progression Criteria |
|:---:|:---|:---:|:---:|:---:|:---|
| **1** | Introductory | 2 Large Cards | Generous (8.0s) | None (0%) | $P(L_t) \ge 0.85$ over 3 consecutive trials |
| **2** | Mild | 3 Cards | Standard (6.0s) | Gentle (10%) | $P(L_t) \ge 0.85$ over 3 trials |
| **3** | Moderate | 4 Cards (2x2) | Rhythmic (4.5s) | Moderate (20%) | $P(L_t) \ge 0.85$ over 4 trials |
| **4** | Advanced | 5 Cards | Fast (3.5s) | High (35%) | $P(L_t) \ge 0.88$ over 4 trials |
| **5** | Mastery | 6 Cards (3x2) | Rapid (2.8s) | Complex (50%) | Retained while $P(L_t) \ge 0.80$ |

#### Anti-Agitation & Sundowning Rules:
- **Maximum Transition Constraint**: Difficulty may never increase or decrease by more than $\pm 1$ tier in a single transition.
- **AACB Override**: If $AVI \ge 1.70$ or 3 consecutive errors occur, difficulty automatically decrements by 1 tier and freezes for the remainder of the session.
- **Circadian Sundowning Guard**: During late-afternoon hours (16:30 – 19:30 local time), maximum allowed tier is capped at **Tier 3**, and calming harmonic frequencies are favored.

---

### 2.4 Cultural Asset Loader (`culturalAssetLoader.ts`)
- **Supported Domains**:
  - Musical Instruments: Pepa, Dhol, Pung, Duitara, Gogona, Tokari.
  - Fauna Visuals: One-Horned Rhino, Hornbill, Red Panda, Sangai Deer, Hoolock Gibbon.
  - Textile Motifs: Muga Silk, Assamese Gamosa, Mizo Puan, Naga Shawl.
  - Market Produce: Joha Rice, Mustard greens, Local fish, Turmeric, Black tea.
- **Language Support**: Instant asset lookup and string dictionary across all 8 NER languages (`as`, `mni`, `bn`, `brx`, `kha`, `lus`, `hi`, `en`).
- **Offline Storage**: Pre-cached in browser cache and Service Worker storage.

---

### 2.5 Celebration Engine (`CelebrationOverlay.tsx`)
- **Particle Dynamics**: 36 golden and emerald sparkles floating upwards with gentle sine oscillation (speed $< 0.8\text{Hz}$, zero strobe/flash).
- **Acoustic Reward**: Harmonic C-major / Pentatonic folk fanfare synthesized directly via Web Audio API oscillators (no external MP3 asset dependency).
- **Localized Spoken Praise**: Spoken verbal reinforcement adapted to the elder's language:
  - Assamese: *"বহুত সুন্দৰ! আপুনি বৰ ভালকৈ খেলিছে।"*
  - Meitei: *"ꯌꯥꯝꯅꯥ ꯐꯔꯦ! ꯅꯍꯥꯛꯅꯥ ꯌꯥꯝꯅꯥ ꯐꯖꯅꯥ ꯁꯥꯟꯅꯔꯦ।"*
  - Bengali: *"খুব সুন্দর! আপনি খুব ভালো খেলেছেন।"*
  - Bodo: *"जोबोर मोजां! नोंथाङा मोजां गेलेबाय।"*
  - English: *"Wonderful job! You played beautifully."*
- **Elder Reassurance Metrics**: Displays friendly, non-punitive summary (accuracy ring, reaction time, comforting checkmark).

---

## 3. Verification & Compliance Checklist

- [x] Sub-5ms compute latency on 2GB RAM device simulation.
- [x] Full offline independence with zero network dependency.
- [x] Standardized 7-element telemetry vector export for FL engine.
- [x] WCAG 2.2 AAA contrast on all celebration overlays.

---

*Authored for Smriti-NER (SIH 2026 — PS ID: 26003) — Ministry of Development of North Eastern Region (MDoNER)*
