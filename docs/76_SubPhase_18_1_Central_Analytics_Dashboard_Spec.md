# Smriti-NER (স্মৃতি) — Sub-Phase 18.1 Specification
## Central Analytics Dashboard: Pan-NER GIS Telemetry, State Comparison & Policy Decision Support

**Problem Statement**: 26003 (MDoNER & Smart India Hackathon 2026)  
**Phase**: 18 (MDoNER Central Telemetry Hub & Impact Framework 📊)  
**Duration**: Weeks 70–78  
**Primary Outcome**: Pan-NER District-Level GIS Telemetry Dashboard (16 Focus Districts), 8-State Comparative Analytics Module, and Auto-Generated Policy Briefs for MDoNER Leadership  
**Governance Framework**: National Data Sharing and Accessibility Policy (NDSAP) & Digital Personal Data Protection (DPDP) Act 2023 Compliant Aggregate Reporting  

---

### 1. Executive Summary & Telemetry Hub Architecture

As Smriti-NER expands across all 8 North Eastern states, high-level administrative visibility is required to guide resource allocation, monitor regional cognitive health trajectories, and ensure equitable digital inclusion across remote hilly and riverine belts.

Sub-Phase 18.1 delivers:
1. **Pan-NER Geographic Information System (GIS) Dashboard**: Interactive spatial telemetry layer mapping 16 primary district clusters and 90 PHCs with real-time CCEI scores, patient density, and sync latency.
2. **State Comparison Analytics Engine**: Multi-dimensional benchmark matrix tracking adherence, MMSE proxy trends, sync cadence, and IVR vs. Tablet modality distribution across all 8 states.
3. **Automated Policy Decision Support System**: Algorithmic generation of monthly executive digests, KPI scorecards, and data-driven infrastructure recommendations for MDoNER officials.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 MDoNER CENTRAL TELEMETRY HUB & GIS ARCHITECTURE             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
      ┌────────────────────────────────┼────────────────────────────────┐
      ▼                                ▼                                ▼
┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│ PAN-NER GIS DASHBOARD   │ │ STATE COMPARATIVE ENGINE│ │ POLICY DECISION ENGINE  │
├─────────────────────────┤ ├─────────────────────────┤ ├─────────────────────────┤
│• 16 District Centroids  │ │• 8-State Matrix (AS-SK) │ │• Auto Monthly Briefs    │
│• Lat/Long Spatial Points│ │• 5,300+ Patient Cohort  │ │• Resource Allocations   │
│• CCEI Trend Heatmaps    │ │• MMSE & Adherence Rates │ │• Tablet Rebalancing     │
│• Sync Latency Indicators│ │• Voice IVR vs. Touch %  │ │• Red/Amber/Green KPIs   │
│• Monsoonal Risk Layers  │ │• Circle Attendance Pct  │ │• MDoNER Leadership PDF  │
└────────────┬────────────┘ └────────────┬────────────┘ └────────────┬────────────┘
             │                           │                           │
             └───────────────────────────┼───────────────────────────┘
                                         ▼
          ┌─────────────────────────────────────────────────────────────┐
          │  POPULATION-SCALE REGIONAL IMPACT TELEMETRY (5,300 PATIENTS)│
          │  Zero Latency Aggregation | Privacy-Preserved Differentials │
          └─────────────────────────────────────────────────────────────┘
```

---

### 2. Pan-NER GIS District Telemetry Specifications (16 District Clusters)

The GIS telemetry layer plots geolocated status centroids across 16 district headquarters covering the 8 North Eastern states:

| District ID | District Name | State | Lat / Long | Patients | ASHAs | Mean CCEI | Sync Latency | Alert Status | Dominant Dialect |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| **DIST-AS-01** | Guwahati (Kamrup Metro) | AS | 26.1445° N, 91.7362° E | 1,050 | 160 | 83.4 | 1.2 hrs | OPTIMAL | Assamese / Bengali |
| **DIST-AS-02** | Silchar (Cachar) | AS | 24.8333° N, 92.7789° E | 450 | 120 | 79.8 | 2.4 hrs | OPTIMAL | Sylheti / Bengali |
| **DIST-AS-03** | Tezpur (Sonitpur) | AS | 26.6338° N, 92.7926° E | 200 | 100 | 81.2 | 1.8 hrs | OPTIMAL | Assamese |
| **DIST-AS-04** | Kokrajhar (BTR) | AS | 26.4014° N, 90.2718° E | 100 | 90 | 78.5 | 3.1 hrs | ATTENTION_REQUIRED | Bodo |
| **DIST-ML-01** | Shillong (East Khasi Hills) | ML | 25.5788° N, 91.8933° E | 450 | 130 | 82.6 | 1.6 hrs | OPTIMAL | Khasi |
| **DIST-ML-02** | Tura (West Garo Hills) | ML | 25.5141° N, 90.2023° E | 250 | 90 | 77.4 | 4.2 hrs | ATTENTION_REQUIRED | Garo |
| **DIST-MN-01** | Imphal (Imphal West) | MN | 24.8170° N, 93.9368° E | 400 | 140 | 84.1 | 1.4 hrs | OPTIMAL | Meitei |
| **DIST-MN-02** | Churachandpur | MN | 24.3333° N, 93.6667° E | 250 | 110 | 76.9 | 5.1 hrs | ATTENTION_REQUIRED | Thadou / Paite |
| **DIST-TR-01** | Agartala (West Tripura) | TR | 23.8315° N, 91.2868° E | 400 | 110 | 82.9 | 1.5 hrs | OPTIMAL | Bengali / Kokborok |
| **DIST-TR-02** | Udaipur (Gomati) | TR | 23.5333° N, 91.4833° E | 200 | 70 | 79.1 | 2.8 hrs | OPTIMAL | Kokborok |
| **DIST-AR-01** | Itanagar (Papum Pare) | AR | 27.0844° N, 93.6053° E | 300 | 80 | 80.5 | 3.5 hrs | OPTIMAL | Nyishi / Hindi |
| **DIST-AR-02** | Tawang | AR | 27.5861° N, 91.8679° E | 150 | 60 | 75.8 | 6.8 hrs | ELEVATED_RISK | Monpa |
| **DIST-NL-01** | Kohima | NL | 25.6751° N, 94.1086° E | 250 | 70 | 81.7 | 2.1 hrs | OPTIMAL | Tenyidie (Angami) |
| **DIST-NL-02** | Dimapur | NL | 25.9090° N, 93.7265° E | 200 | 50 | 83.0 | 1.3 hrs | OPTIMAL | Nagamese |
| **DIST-MZ-01** | Aizawl | MZ | 23.7271° N, 92.7176° E | 400 | 60 | 83.7 | 2.0 hrs | OPTIMAL | Mizo |
| **DIST-SK-01** | Gangtok | SK | 27.3389° N, 88.6065° E | 250 | 50 | 84.5 | 1.5 hrs | OPTIMAL | Nepali / Bhutia |

---

### 3. State Comparison Analytics Matrix

Benchmarking across the 8 NER states provides granular insights into clinical adherence and delivery dynamics:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PAN-NER STATE COMPARISON BENCHMARK MATRIX                │
├───────────┬─────────┬──────────┬──────────┬───────────┬──────────┬──────────┤
│ State     │ Patients│ PHCs     │ Mean MMSE│ Adherence │ Touch %  │ Voice %  │
├───────────┼─────────┼──────────┼──────────┼───────────┼──────────┼──────────┤
│ Assam     │  1,800  │  30 PHCs │   22.8   │   91.4%   │   65%    │   35%    │
│ Meghalaya │    700  │  12 PHCs │   23.1   │   89.8%   │   52%    │   48%    │
│ Manipur   │    650  │  11 PHCs │   23.4   │   92.1%   │   58%    │   42%    │
│ Tripura   │    600  │  10 PHCs │   22.9   │   90.6%   │   62%    │   38%    │
│ Arunachal │    450  │   8 PHCs │   22.4   │   86.5%   │   41%    │   59%    │
│ Nagaland  │    450  │   8 PHCs │   23.0   │   88.2%   │   55%    │   45%    │
│ Mizoram   │    400  │   6 PHCs │   23.6   │   93.4%   │   70%    │   30%    │
│ Sikkim    │    250  │   5 PHCs │   23.8   │   94.2%   │   74%    │   26%    │
├───────────┼─────────┼──────────┼──────────┼───────────┼──────────┼──────────┤
│ TOTAL/AVG │  5,300  │  90 PHCs │   23.1   │   90.8%   │   59.6%  │   40.4%  │
└───────────┴─────────┴──────────┴──────────┴───────────┴──────────┴──────────┘
```

---

### 4. Policy Decision Support & Auto-Generated Monthly Briefs

The policy decision engine translates raw telemetry into strategic public health interventions:
1. **Algorithmic Resource Reallocation**:
   - High-altitude cold warning: Tawang ($6.8\,\text{h}$ sync latency) scheduled for 20 additional cold-resistant battery warming pouches and offline data caching.
   - IVR capacity scaling: Arunachal Pradesh (59% voice/IVR interaction) scheduled for +20 dedicated SIP channels on NE-2 circle.
2. **Policy KPI Scorecard**:
   - *Cognitive Screening Coverage*: Target 5,000 | Current: 5,300 (**ON_TRACK**).
   - *ASHA Frontline Deployment*: Target 1,500 | Current: 1,510 (**ON_TRACK**).
   - *Mean Offline Sync Latency*: Target $<4.0\,\text{hrs}$ | Current: $2.6\,\text{hrs}$ (**ON_TRACK**).
   - *Monsoon Device Uptime*: Target $>98.0\%$ | Current: $99.1\%$ (**ON_TRACK**).
