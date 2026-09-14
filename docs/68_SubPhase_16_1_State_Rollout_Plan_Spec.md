# Smriti-NER (স্মৃতি) — Sub-Phase 16.1 Specification
## Multi-State Rollout Plan (Waves 1–4 across 8 North-Eastern States)

**Problem Statement**: 26003 (MDoNER & Smart India Hackathon 2026)  
**Phase**: 16 (Multi-State Expansion 📈)  
**Duration**: Weeks 56–79 (4 Months Staged Scale-Out)  
**Primary Outcome**: Pan-NER Phased Expansion Blueprint, 90 PHCs Onboarded, 5,300 Geriatric Patients Enrolled  
**Governance Framework**: National Health Mission (NHM) State Executive Committees & MDoNER Monitoring Cell  

---

### 1. Architectural Scope & Phased Wave Design

Smriti-NER transitions from a controlled 10-PHC, 500-patient pilot into a pan-regional public health intervention covering all eight North-Eastern Region (NER) states. To mitigate logistical risks associated with difficult topography, monsoonal landslides, and varied administrative structures, expansion proceeds in four staggered, overlapping waves:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 PAN-NER MULTI-STATE EXPANSION ARCHITECTURE (WAVES 1–4)      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌───────────────────┐        ┌───────────────────┐        ┌───────────────────┐
│     WAVE 1        │        │     WAVE 2        │        │     WAVE 3        │
│ Weeks 56–63       │        │ Weeks 62–69       │        │ Weeks 67–74       │
├───────────────────┤        ├───────────────────┤        ├───────────────────┤
│• Assam (20 PHCs)  │        │• Manipur (15 PHCs)│        │• Arunachal (12 PHC│
│• Meghalaya (10)   │        │• Tripura (10 PHCs)│        │• Nagaland (8 PHCs)│
│• 2,000 Patients   │        │• 1,500 Patients   │        │• 1,000 Patients   │
│• Valley/Hills Mix │        │• Border/Wetlands  │        │• High Altitude/VSAT│
└─────────┬─────────┘        └─────────┬─────────┘        └─────────┬─────────┘
          │                            │                            │
          └────────────────────────────┼────────────────────────────┘
                                       ▼
                             ┌───────────────────┐
                             │     WAVE 4        │
                             │ Weeks 72–79       │
                             ├───────────────────┤
                             │• Mizoram (8 PHCs) │
                             │• Sikkim (7 PHCs)  │
                             │• 800 Patients     │
                             │• Organic/Hill Agro│
                             └─────────┬─────────┘
                                       ▼
          ┌───────────────────────────────────────────────────────────┐
          │  TOTAL: 8 States | 90 PHCs | 900 MDM Tablets | 5,300 Elders│
          │  Zero Downtime Offline-First Sync via BLE Mesh + VSAT Hub │
          └───────────────────────────────────────────────────────────┘
```

---

### 2. Wave Allocation, Target Cohorts, and Infrastructure

| Wave | States Included | Target PHCs | Target Patients | MDM Tablets | Primary Telecom Profile | Key Connectivity Solution |
|:---:|:---|:---:|:---:|:---:|:---|:---|
| **Wave 1** | Assam (remaining), Meghalaya | 30 | 2,000 | 300 | 4G / 2G GSM hybrid | Cellular + BLE Island Ferries |
| **Wave 2** | Manipur, Tripura | 25 | 1,500 | 250 | 4G urban / 2G border | Fiber backhaul + Asterisk IVR |
| **Wave 3** | Arunachal Pradesh, Nagaland | 20 | 1,000 | 200 | Intermittent 2G / Satellite | BharatNet VSAT + Solar micro-banks |
| **Wave 4** | Mizoram, Sikkim | 15 | 800 | 150 | 4G ridge / shadow valleys | Ridge-top repeater nodes + Offline DB |
| **TOTAL** | **All 8 NER States** | **90** | **5,300** | **900** | **Multi-Carrier Heterogeneous** | **Triple-Failover (Cellular/BLE/VSAT)** |

---

### 3. State-by-State Deployment Profiles

1. **Assam (`AS`)**:
   - Expansion Districts: Barpeta, Dhubri, Dibrugarh, Sonitpur, Cachar.
   - PHCs: 20 | Patients: 1,300 | Languages: Assamese, Bengali, Bodo.
   - Logistics: Inland riverine boat clinics equipped with ruggedized MDM solar charging docks.

2. **Meghalaya (`ML`)**:
   - Expansion Districts: East Khasi Hills, West Garo Hills, Jaintia Hills.
   - PHCs: 10 | Patients: 700 | Languages: Khasi, Garo, English.
   - Logistics: High-precipitation weatherproofing kits for tablets (IP68 sleeves).

3. **Manipur (`MN`)**:
   - Expansion Districts: Imphal West, Thoubal, Bishnupur, Ukhrul.
   - PHCs: 15 | Patients: 900 | Languages: Meitei (Manipuri), Tangkhul.
   - Logistics: Community hall charging centers powered by micro-hydro and solar mini-grids.

4. **Tripura (`TR`)**:
   - Expansion Districts: West Tripura, South Tripura, Dhalai.
   - PHCs: 10 | Patients: 600 | Languages: Bengali, Kokborok.
   - Logistics: Co-located with tea garden labor welfare health dispensaries.

5. **Arunachal Pradesh (`AR`)**:
   - Expansion Districts: Papum Pare, Tawang, West Kameng, Lower Subansiri.
   - PHCs: 12 | Patients: 600 | Languages: Nyishi, Monpa, Adi, Hindi.
   - Logistics: BharatNet satellite VSAT fallback terminals at remote mountain outposts.

6. **Nagaland (`NL`)**:
   - Expansion Districts: Kohima, Mokokchung, Dimapur, Mon.
   - PHCs: 8 | Patients: 400 | Languages: Nagamese, Ao, Angami, English.
   - Logistics: Village Council (VDB) remanence centers for weekly elderly circles.

7. **Mizoram (`MZ`)**:
   - Expansion Districts: Aizawl, Lunglei, Champhai.
   - PHCs: 8 | Patients: 450 | Languages: Mizo (Lushai), English.
   - Logistics: Church elders association partnership for reminiscence story sessions.

8. **Sikkim (`SK`)**:
   - Expansion Districts: Gangtok, Namchi, Gyalshing.
   - PHCs: 7 | Patients: 350 | Languages: Nepali, Bhutia, Lepcha.
   - Logistics: Integrated with Ayushman Arogya Mandir wellness centers.

---

### 4. Technical Governance & Risk Mitigation

- **MDoNER Multi-State Nodal Officers**: 8 state health mission coordinators with weekly synchronization telemetry.
- **Hardware Protection**: Ruggedized silicone bumper cases, 10,000mAh external battery banks, and IP67 dust/water protection.
- **Offline Data Sovereignty**: All PHC edge nodes encrypt clinical records locally using AES-256-GCM until opportunistic sync over secure TLS 1.3 tunnels.
