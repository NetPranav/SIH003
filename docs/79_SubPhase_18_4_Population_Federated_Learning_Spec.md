# Smriti-NER (স্মৃতি) — Sub-Phase 18.4 Specification
## Population-Scale Federated Learning, Model Drift Monitoring & Milestone M18 Sign-Off

**Problem Statement**: 26003 (MDoNER & Smart India Hackathon 2026)  
**Phase**: 18 (MDoNER Central Telemetry Hub & Impact Framework 📊)  
**Duration**: Weeks 76–84  
**Primary Outcome**: Cross-District Secure FedProx Aggregation (16 Districts, 5,300 Patients), Population Stability Index (PSI) Drift Monitoring, and Formal Milestone M18 Sign-Off  
**AI Governance Standards**: ISO/IEC 42001 Artificial Intelligence Management System & DISHA Section 34 Telemetry Privacy Directives  

---

### 1. Executive Summary & Population-Scale FL Architecture

Frontline cognitive assessment models cannot centralized sensitive elder memory reactions into a single monolithic server. Sub-Phase 18.4 scales decentralized machine learning to population level:

1. **Cross-District Secure Aggregation**: Coordinated federated learning across 16 district headquarters using **FedProx** to handle statistical heterogeneity ($\mu = 0.01$) and intermittent connectivity.
2. **Model Drift & Population Stability Monitoring**: Continuous computation of Population Stability Index (PSI) and Wasserstein divergence across 8 linguistic distributions to detect cultural drift.
3. **Milestone M18 Formal Sign-Off**: Verification that the MDoNER Central Telemetry Hub and CCEI v2 framework are operational across all 8 states with 5,300+ patients and 1,510 certified ASHAs.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│          POPULATION-SCALE FEDERATED AGGREGATION & DRIFT ARCHITECTURE         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
     ┌─────────────────────────────────┼─────────────────────────────────┐
     ▼                                 ▼                                 ▼
┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│ CROSS-DISTRICT FEDPROX  │ │ MODEL DRIFT MONITORING  │ │ MILESTONE M18 SIGN-OFF  │
├─────────────────────────┤ ├─────────────────────────┤ ├─────────────────────────┤
│• 16 District Partitions │ │• Population Stability   │ │• 8 NER States Active    │
│• 5,300 Local Tablets    │ │  Index (PSI < 0.10)     │ │• 5,300 Enrolled Elders  │
│• Weighted Sample Sizing │ │• 8 Regional Languages   │ │• 1,510 Certified ASHAs  │
│• Epsilon <= 1.0 Diff-Prv│ │• Retraining Triggers    │ │• CCEI v2 Multi-Dashboard│
│• Trimmed-Mean Byzantine │ │• BKT Slip/Guess Drift   │ │• SIGNED OFF AUDIT       │
└────────────┬────────────┘ └────────────┬────────────┘ └────────────┬────────────┘
             │                           │                           │
             └───────────────────────────┼───────────────────────────┘
                                         ▼
          ┌─────────────────────────────────────────────────────────────┐
          │  ZERO TELEMETRY EXFILTRATION | ZERO CLOUD PRIVACY RISK      │
          │  Continuous Adaptation to Indigenous Neurocognitive Norms   │
          └─────────────────────────────────────────────────────────────┘
```

---

### 2. Cross-District FedProx Aggregation Specifications

To account for variable client sample sizes and heterogeneous network dropouts across the 8 NER states, the central hub utilizes FedProx:

$$\min_{w} \frac{1}{K} \sum_{k=1}^{K} f_k(w) + \frac{\mu}{2} \|w - w^t\|^2$$

- **Proximal Term ($\mu = 0.01$)**: Constrains local district updates from diverging wildly in low-sample mountain districts (e.g., Tawang with 150 patients vs. Kamrup with 1,050 patients).
- **Differential Privacy**: Gaussian noise injection calibrates privacy consumption:
  $$\epsilon = 0.85, \quad \delta = 10^{-5}, \quad \text{Clipping Norm } C = 1.0$$
- **Byzantine Fault Tolerance**: Trimmed-mean coordinate selection ($10\%$ exclusion) rejects compromised or corrupted weight updates.

---

### 3. Cross-Linguistic Model Drift Monitoring

Model weights and prediction distributions are tracked continuously across the 8 localized cultural engines:

$$\text{PSI} = \sum_{i=1}^{B} (P_i - Q_i) \times \ln\left(\frac{P_i}{Q_i}\right)$$

| Language Domain | State Focus | Primary Dialect | Baseline BKT AUC | Current 30-Day PSI | Drift Alert Level | Corrective Action |
|:---:|:---:|:---|:---:|:---:|:---:|:---|
| `as` | Assam | Assamese | 0.938 | 0.032 | STABLE | Normal operational cadence |
| `brx` | Assam (BTR) | Bodo | 0.912 | 0.054 | STABLE | Routine weekly sync |
| `kha` | Meghalaya | Khasi | 0.924 | 0.041 | STABLE | Normal operational cadence |
| `grx` | Meghalaya | Garo | 0.908 | 0.068 | STABLE | Normal operational cadence |
| `mni` | Manipur | Meitei | 0.931 | 0.038 | STABLE | Normal operational cadence |
| `lus` | Mizoram | Mizo | 0.935 | 0.029 | STABLE | Normal operational cadence |
| `bn` | Tripura/Cachar | Bengali / Sylheti | 0.929 | 0.045 | STABLE | Normal operational cadence |
| `ne` | Sikkim/Arunachal | Nepali / Bhutia | 0.921 | 0.058 | STABLE | Normal operational cadence |

*Drift Thresholds*: $\text{PSI} < 0.10$ indicates **STABLE**; $0.10 \le \text{PSI} < 0.25$ indicates **MODERATE DRIFT**; $\text{PSI} \ge 0.25$ triggers **CRITICAL RETRAINING**. All 8 languages currently maintain $\text{PSI} \le 0.068$.

---

### 4. Milestone M18 Sign-Off Verification

Milestone M18 formally validates that the Central Telemetry Hub, GIS Mapping, CCEI v2 Index, and Population Federated Learning Layer are fully functional across the entire North Eastern Region:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MILESTONE M18 AUDIT CERTIFICATE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ Milestone ID      : M18                                                     │
│ Milestone Name    : Central Hub & CCEI Operational                          │
│ Phase             : Phase 18: MDoNER Central Telemetry Hub & Impact         │
│ Verification Body : MDoNER Central Telemetry Directorate & Clinical Council │
│ Certified Date    : September 2026                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ Gate 1: Pan-NER State Coverage              : 8 / 8 States Active  [PASSED] │
│ Gate 2: Enrolled Elder Population Cohort    : 5,300 Active Elders  [PASSED] │
│ Gate 3: Frontline Workforce Trained         : 1,510 ASHAs Active   [PASSED] │
│ Gate 4: CCEI v2 Implemented on Dashboards   : 4 / 4 Tiers Active   [PASSED] │
│ Gate 5: Cross-District FedProx Aggregation  : 16 Districts Synced  [PASSED] │
├─────────────────────────────────────────────────────────────────────────────┤
│ Final Determination: SIGNED OFF & OPERATIONAL                               │
└─────────────────────────────────────────────────────────────────────────────┘
```
