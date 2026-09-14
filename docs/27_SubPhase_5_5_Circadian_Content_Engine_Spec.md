# Smriti-NER (স্মৃতি): Sub-Phase 5.5 — Circadian-Aware Content Engine Specification
**Document ID**: `SPEC-AI-CIRCADIAN-055`  
**Version**: `1.0.0`  
**Status**: `APPROVED`  
**Target Milestone**: `M5 (DCDA + Federated Learning Operational)`  
**Clinical Focus**: Sundowning Syndrome, Twilight Agitation Dampening & Auditory Reminiscence Therapy

---

## 1. Neuropsychological Rationale & Clinical Formulation

### 1.1 The Sundowning Phenomenon in Geriatric Dementia
Sundowning (late-day confusion, neuropsychiatric agitation, and pacing) manifests in **20% to 66%** of individuals diagnosed with Alzheimer's Disease and Vascular Dementia. 
Pathophysiologically, it is driven by:
1. **Suprachiasmatic Nucleus (SCN) Degeneration**: Impaired circadian pacemaking in the anterior hypothalamus, disrupting the endogenous core body temperature and diurnal melatonin rhythms.
2. **Sensory Deprivation at Dusk (Twilight Transition)**: In North East India, dusk sets early (16:15–17:30 depending on latitude and season). Decreasing ambient photons diminish visual contrast, triggering visual illusions, disorientation, and acute fear responses.
3. **Cognitive Fatigue Accumulation**: Executive reserve depletes over daytime hours, leaving the elder vulnerable to catastrophic agitation when encountering complex interfaces.

```
       [Twilight Transition / Dusk (16:30 - 19:30)]
                           │
                           ▼
          SCN Dysregulation + Diminished Contrast
                           │
                           ▼
     Early Agitation Signals (Tremor ↑, Wander Index ↑, Latency ↑)
                           │
                           ▼
    ┌─────────────────────────────────────────────────────────────┐
    │     SMRITI-NER CIRCADIAN-AWARE CONTENT ENGINE (CAC-E)       │
    │                                                             │
    │  1. Multi-Factor Sundowning Agitation Index (SAI) Detection │
    │  2. Auto-Reduction of Cognitive Load (Difficulty Tier Cap)  │
    │  3. Gentle Auditory Reminiscence Trigger (Folk Lullabies)    │
    │  4. UI Luminescence Adaptation (Warm Amber Glow)            │
    └─────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
      Parasympathetic Activation (Vagal Tone ↑, Amygdala Calm)
```

---

## 2. Mathematical Formulation of Sundowning Agitation Index ($SAI$)

To avoid false triggers during peaceful evening use while rapidly detecting genuine twilight distress, Smriti-NER calculates the continuous **Sundowning Agitation Index ($SAI_t \in [0.0, 1.0]$)**:

$$SAI_t = w_{\text{time}} \cdot C_{\text{time}}(t) + w_{\text{tremor}} \cdot J_{\text{elev}} + w_{\text{wander}} \cdot \Omega_{\text{norm}} + w_{\text{aacb}} \cdot AVI_t$$

Where:
- **Circadian Time Factor ($C_{\text{time}}(t)$)**:
  Gaussian envelope centered at dusk twilight peak ($t_0 = 18:00$):
  $$C_{\text{time}}(t) = \exp\left( -\frac{(t - 18.0)^2}{2 \cdot (1.25)^2} \right) \quad \text{for } t \in [16:30, 20:00], \text{ else } 0$$
- **Tremor Elevation Factor ($J_{\text{elev}}$)**:
  Ratio of current tremor jitter count to patient's morning baseline:
  $$J_{\text{elev}} = \min\left(1.0,\, \max\left(0.0,\, \frac{J_{\text{current}} - J_{\text{baseline}}}{J_{\text{baseline}} + \epsilon}\right)\right)$$
- **Motor Wander Index ($\Omega_{\text{norm}}$)**:
  Normalized path displacement ratio:
  $$\Omega_{\text{norm}} = \min\left(1.0,\, \frac{\Omega_{\text{wander}} - 1.0}{3.0}\right)$$
- **Agitation Velocity Index ($AVI_t$)**:
  Exponentially decayed consecutive error burst from the Anti-Agitation Circuit Breaker (AACB):
  $$AVI_t = \sum_{k=0}^{M} \gamma^k \cdot e_{t-k}, \quad \gamma = 0.65$$

### Calibrated Weight Vectors:
- $w_{\text{time}} = 0.35$
- $w_{\text{tremor}} = 0.25$
- $w_{\text{wander}} = 0.20$
- $w_{\text{aacb}} = 0.20$

### State Transitions:
- $SAI_t < 0.40$: `CIRCADIAN_NORMAL` (Standard DCDA difficulty adaptation).
- $0.40 \le SAI_t < 0.65$: `CIRCADIAN_DUSK_OBSERVATION` (Cap difficulty at Tier 3, warm UI amber tint).
- $SAI_t \ge 0.65$: `CIRCADIAN_SUNDOWNING_ACTIVE` (Engage Calming Content Engine, reduce difficulty to Tier 1, auto-play regional soothing folk melodies).

---

## 3. Calming Audio Reminiscence Architecture

### 3.1 Preservation of Musical Memory in Late Dementia
Neuroimaging (Jacobsen et al., 2015) confirms that the **medial prefrontal cortex and anterior cingulate**—the primary neural substrates for musical memory—remain largely spared from neurofibrillary tau tangles and amyloid plaques until the terminal stages of AD.
Childhood lullabies and authentic regional folk melodies evoke involuntary autonoetic consciousness, reducing agitation without pharmacological sedation (haloperidol/risperidone), which carries high black-box mortality risks in elderly cohorts.

### 3.2 Curated North Eastern Folk Melodic Library
Smriti-NER embeds a lightweight, zero-download, synthesizable **Regional Calming Library**:

| Region / Language | Cultural Melody | Clinical Musical Properties |
|:---|:---|:---|
| **Assam (অসম)** | *O Phool Kuwori (অ' ফুল কুঁৱৰী)* & *Nao Bowa Slow Flute* | Pentatonic minor scale, gentle lilt, repetitive 6/8 meter mimicking rocking cradles. |
| **Manipur (মণিপুর)** | *Tha Tha Thabungton (ꯊꯥ ꯊꯥ ꯊꯕꯨꯡꯇꯣꯟ)* | Ancient Meitei moon lullaby, descending pentatonic phrase, 48–56 BPM resting heart rate synchrony. |
| **Bodo (बड़ो)** | *Bodo Serja Slow Slumber Tune* | Resonant open-string harmonics, warm lower-mid fundamental (220–330 Hz). |
| **Mizoram** | *Zawlbuk Twilight Acoustic Lullaby* | Gentle acoustic plucking, steady lull, unhurried cadences. |
| **Meghalaya (Khasi)** | *Ka Mei Twilight Duitara Melodic Echo* | Soothing 4-note harp scale, ambient acoustic decay. |
| **Pan-NER Classical** | *Raga Bhairav / Raga Yaman Calm* | Evening calm micro-tonal intervals (Komal Re, Dha) producing parasympathetic vagal activation. |

### 3.3 Audio Synthesizer Engine (Offline-First, Zero-Download)
To guarantee 100% offline functionality in off-grid villages without requiring multi-megabyte MP3 downloads, `circadianContentEngine.ts` implements an onboard Web Audio API parametric sound generator:
- Pure sine/triangle wave harmonics modeled after bamboo flutes (*Pepa/Xutuli*) and harp plucked strings (*Duitara*).
- 2.5-second logarithmic fade-in and 3.0-second fade-out to prevent auditory startle.
- Perceived sound pressure locked to gentle **38–44 dBA** (conversational ambient murmur).
- Controlled by `AudioSuppressionGuard`: automatically ducks by -18dB whenever a voice assistant or caregiver speech prompt triggers.

---

## 4. UI Luminescence & Twilight Visual Adaptation

When $SAI_t \ge 0.40$, the visual engine activates twilight protective styling:
1. **Blue-Light Cutoff**: Replaces harsh cool daylight tones (6500K) with warm amber (2200K) via CSS filter tokens:
   ```css
   .circadian-sundowning-active {
     filter: sepia(0.28) hue-rotate(-15deg) contrast(0.92) brightness(0.88);
     transition: filter 3000ms ease-in-out;
   }
   ```
2. **Contrast Enhancement for Presbyopia**: Hitbox borders expand from 2px to 4px with warm golden halos (`#D4AF37`) to offset decreased rod/cone sensitivity at dusk.
3. **Pacing & Animation Deceleration**: Reduces CSS animation velocities by 40% to reduce visual motion sickness.

---

## 5. Performance & Verification Metrics

| Metric | Target Specification |
|:---|:---|
| Sundowning Index Compute Latency | < 1.0 ms |
| Web Audio Synthesis Initialization | < 12 ms |
| Audio Ducking Response Time | < 50 ms upon voice interrupt |
| Memory Footprint | < 350 KB |
| Zero External Network Requests | 100% local Web Audio generation |

---

## 6. Implementation Deliverables

- [x] Sundowning Detection Logic (`smriti-ner/src/lib/circadianContentEngine.ts`)
- [x] Regional Calming Audio Synthesizer (`smriti-ner/src/lib/circadianContentEngine.ts`)
- [x] Content-Clinical Mapping Specification (`docs/27_SubPhase_5_5_Circadian_Content_Engine_Spec.md`)
- [x] Python Validation Suite (`tests/test_circadian_content_engine.py`)
- [x] Integration with `difficultyOrchestrator.ts` and `Roadmap_2.md` Milestone M5 Sign-Off
