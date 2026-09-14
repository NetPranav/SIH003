# SMRITI-NER SUB-PHASE 5.1 SPECIFICATION: TELEMETRY EXTRACTION PIPELINE & BI-FACTOR LATENCY DECOMPOSITION

**Document Reference**: SMRITI-P5-SP5.1-SPEC-v1.0  
**Phase**: Phase 5 — Edge AI: DCDA & Federated Learning Engine  
**Sub-Phase**: 5.1 — Telemetry Extraction Pipeline  
**Target Platform**: Progressive Web Application (PWA) / Tablet & Smartphone Edge Shell  
**Clinical Standards**: Bi-Factor Motor Latency Decomposition, Movement Disorder Tremor Analysis, Goldstein Agitation Mitigation  
**Status**: ACTIVE / PRODUCTION SPECIFICATION  

---

## 1. Neuropsychological Rationale & Clinical Objectives

Digital cognitive screening applications frequently produce false-positive indications of cognitive decline in elderly populations. When a patient takes $2.5\,\text{seconds}$ to select an option on screen, conventional software treats this as a sign of impaired working memory or executive hesitation.

However, in geriatric cohorts with Parkinsonian symptoms, essential tremor, cervical spondylosis, or osteoarthritic stiffness, the delay is predominantly **biomechanical and neuromuscular** rather than neuro-cognitive. 

Sub-Phase 5.1 operationalizes the **Telemetry Extraction Pipeline**, a low-latency, edge-computed feature extraction system designed to:
1. **Continuously track raw multi-touch micro-trajectories** at $\ge 60\,\text{Hz}$ without blocking the main browser thread.
2. **Quantify the pre-tap wander index ($\Omega_{\text{wander}}$)** and tremor frequency band ($4-8\,\text{Hz}$).
3. **Isolate true cognitive deliberation latency ($RT_{\text{delib}}$)** from motor delay ($\tau_{\text{motor}}$).
4. **Package the standardized 7-element Session Telemetry Vector ($\mathbf{V}_{\text{telemetry}}$)** for on-device Federated Learning and longitudinal clinical staging.

---

## 2. Mathematical Formulations

```
             TOTAL MEASURED REACTION TIME (RT_total)
|◄─────────────────────────────────────────────────────────────►|
┌─────────────────────────────────┬─────────────────────────────┐
│   Cognitive Deliberation Time   │    Motor Navigation Time    │
│           (RT_delib)            │         (tau_motor)         │
│   • Visual search & binding     │   • Biomechanical movement  │
│   • Semantic memory retrieval   │   • Micro-tremor wander     │
│   • Decision confidence         │   • Pre-tap hesitation      │
└─────────────────────────────────┴─────────────────────────────┘
```

### 2.1 Micro-Trajectory Coordinate Sequence
During any interaction window (from stimulus presentation or pointer contact initiation to target release), the pointer subsystem logs a discrete trajectory:
$$\mathcal{P} = \left\{ (x_k, y_k, t_k, p_k) \right\}_{k=1}^M$$
Where $x_k, y_k$ are viewport pixel coordinates, $t_k$ is the millisecond timestamp, and $p_k \in [0.0, 1.0]$ is contact pressure.

The cumulative path length $S_{\text{path}}$ and direct displacement $S_{\text{disp}}$ are calculated as:
$$S_{\text{path}} = \sum_{k=1}^{M-1} \sqrt{(x_{k+1} - x_k)^2 + (y_{k+1} - y_k)^2}$$
$$S_{\text{disp}} = \sqrt{(x_M - x_1)^2 + (y_M - y_1)^2}$$

### 2.2 Motor Tremor / Wander Index ($\Omega_{\text{wander}}$)
$$\Omega_{\text{wander}} = \frac{S_{\text{path}}}{\max(S_{\text{disp}}, \epsilon)}, \quad \epsilon = 1.0\,\text{px}$$

- Confident, direct touch: $\Omega_{\text{wander}} \in [1.00, 1.25]$
- Mild hesitation or mild tremor: $\Omega_{\text{wander}} \in [1.25, 1.80]$
- Severe essential tremor or Parkinsonian wander: $\Omega_{\text{wander}} > 1.80$

### 2.3 Bi-Factor Latency Isolation Equation
$$\tau_{\text{motor}} = \kappa \cdot \ln(\Omega_{\text{wander}}) + \delta_{\text{baseline}}$$
$$RT_{\text{delib}} = \max(80\,\text{ms}, RT_{\text{total}} - \tau_{\text{motor}})$$

Where:
- $\delta_{\text{baseline}}$: Calibrated resting motor delay ($280\,\text{ms}$ nominal).
- $\kappa$: Biomechanical sensitivity coefficient ($\kappa = 240\,\text{ms}$).
- $80\,\text{ms}$: Physiological lower bound of retinal-cortical processing time.

---

## 3. Standardized 7-Element Session Telemetry Vector

The output of each cognitive gameplay session is distilled into a compact 7-element numeric vector $\mathbf{V}_{\text{telemetry}} \in \mathbb{R}^7$:

$$\mathbf{V}_{\text{telemetry}} = [v_0, v_1, v_2, v_3, v_4, v_5, v_6]$$

| Element | Parameter | Range | Clinical Relevance |
|:---:|:---|:---:|:---|
| **$v_0$** | $RT_{\text{total\_avg}}$ | $[200, 15000]\,\text{ms}$ | Gross processing speed (unfiltered). |
| **$v_1$** | $\tau_{\text{motor\_avg}}$ | $[100, 4000]\,\text{ms}$ | Biomechanical motor hesitation / tremor index. |
| **$v_2$** | $RT_{\text{delib\_avg}}$ | $[80, 12000]\,\text{ms}$ | True cognitive search and memory retrieval speed. |
| **$v_3$** | $\text{Accuracy}$ | $[0.00, 1.00]$ | Task correctness proportion across session trials. |
| **$v_4$** | $\text{Difficulty Tier}$ | $\{1, 2, 3, 4, 5\}$ | Active challenge level managed by difficulty FSM. |
| **$v_5$** | $\text{AACB Flag}$ | $\{0, 1\}$ | Binary indicator of whether circuit breaker was tripped. |
| **$v_6$** | $\text{Circadian Factor}$ | $[0.00, 1.00]$ | Time-of-day weighting (1.0 = peak lucidity, 0.2 = sundowning window). |

---

## 4. Architectural Pipeline Integration

```
[Screen Touch Events (PointerDown/Move/Up)]
                  │
                  ▼
      [touchStreamLogger.ts]
      • (x, y, t, p) buffer capture
      • S_path & S_disp calculation
      • Wander index (Omega_wander)
                  │
                  ▼
     [telemetryCollector.ts]
      • Bi-Factor decomposition: tau_motor & RT_delib
      • Spatial touch deviation calculation
      • TrialTelemetry construction
                  │
                  ▼
    [gameSessionManager.ts]
      • Rolling session trial aggregation
      • computeSessionTelemetryVector()
                  │
                  ▼
     [Local Delta Sync Queue & FL Client]
```

---

## 5. Deliverables & Verification Criteria

- **Zero Frame Drops**: Continuous coordinate capture overhead $\le 1.2\,\text{ms}$ per event on low-end hardware.
- **Accuracy**: $RT_{\text{delib}} + \tau_{\text{motor}} \approx RT_{\text{total}}$ within rounding precision ($\pm 1\,\text{ms}$).
- **Tremor Independence**: Patients with severe motor wander ($\Omega_{\text{wander}} = 3.0$) are not penalized in cognitive deliberation calculations.
- **Telemetry Schema Validation**: 100% of exported vectors pass schema range and type verification.

---

*Authored for Smriti-NER (SIH 2026 — PS ID: 26003) — Ministry of Development of North Eastern Region (MDoNER)*
