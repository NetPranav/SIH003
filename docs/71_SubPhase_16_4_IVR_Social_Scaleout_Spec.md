# Smriti-NER (স্মৃতি) — Sub-Phase 16.4 Specification
## Multi-Circle Toll-Free Scaling, Community Playbook & Milestone M16 Sign-Off

**Problem Statement**: 26003 (MDoNER & Smart India Hackathon 2026)  
**Phase**: 16 (Multi-State Expansion 📈)  
**Duration**: Weeks 64–79  
**Primary Outcome**: Pan-NER Multi-Circle IVR Toll-Free Telephony (`1800-890-SMRITI`), 5-Stage Community Reminiscence Circle Playbook, and Milestone M16 Sign-Off  
**Telecom Regulatory Compliance**: Department of Telecommunications (DoT) National Numbering Plan & Telecom Commercial Communications Customer Preference Regulations (TCCCPR)  

---

### 1. Architectural Scope & Multi-Circle SIP Trunking

Sub-Phase 16.4 scales Smriti-NER’s telephonic and community social engagement infrastructure to span all four telecom circles serving the North-Eastern Region:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 PAN-NER MULTI-CIRCLE TELECOM & SOCIAL ARCHITECTURE          │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
     ┌─────────────────────────────────┼─────────────────────────────────┐
     ▼                                 ▼                                 ▼
┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│ Telecom Circle AS       │ │ Telecom Circle NE-1     │ │ Telecom Circle NE-2     │
│ (Assam)                 │ │ (Meghalaya, Mizo, Trip) │ │ (Arunachal, Mani, Naga) │
├─────────────────────────┤ ├─────────────────────────┤ ├─────────────────────────┤
│• Primary: BSNL Fiber SIP│ │• Primary: Airtel Cloud  │ │• Primary: Jio SIP Trunk │
│• Fallback: Airtel PRI   │ │• Fallback: BSNL PRI     │ │• Fallback: VSAT Backhaul│
│• Capacity: 120 Channels │ │• Capacity: 90 Channels  │ │• Capacity: 90 Channels  │
└────────────┬────────────┘ └────────────┬────────────┘ └────────────┬────────────┘
             │                           │                           │
             └───────────────────────────┼───────────────────────────┘
                                         ▼
                            ┌─────────────────────────┐
                            │ Telecom Circle WB-SK    │
                            │ (Sikkim District)       │
                            ├─────────────────────────┤
                            │• BSNL + Airtel SIP Pool │
                            │• Capacity: 40 Channels  │
                            └────────────┬────────────┘
                                         ▼
          ┌───────────────────────────────────────────────────────────┐
          │ TOLL-FREE HELPLINE: 1800-890-SMRITI (1800-890-7674)       │
          │ Auto-ANI Geographic Routing | 99.8% Call Uptime SLA       │
          ├───────────────────────────────────────────────────────────┤
          │ 5-STAGE COMMUNITY REMINISCENCE CIRCLE PLAYBOOK            │
          │ Standardized Deployment across 90 PHC Catchment Areas     │
          ├───────────────────────────────────────────────────────────┤
          │ MILESTONE M16: MULTI-STATE EXPANSION READY (SIGNED OFF)   │
          └───────────────────────────────────────────────────────────┘
```

---

### 2. Multi-Circle Telecom Specifications

| Telecom Circle Code | Circle Name | States Covered | Primary SIP Trunk Provider | Secondary Failover Provider | Concurrent Channels | Target MOS |
|:---:|:---|:---|:---:|:---:|:---:|:---:|
| **AS** | Assam Circle | Assam | BSNL National NGN | Bharti Airtel PRI | 120 | $\ge 3.8$ |
| **NE-1** | North East Circle 1 | Meghalaya, Mizoram, Tripura | Bharti Airtel Enterprise | BSNL Cellular Trunk | 90 | $\ge 3.7$ |
| **NE-2** | North East Circle 2 | Arunachal Pradesh, Manipur, Nagaland | Reliance Jio Enterprise | BSNL VSAT Satellite Trunk | 90 | $\ge 3.6$ |
| **WB-SK** | West Bengal & Sikkim | Sikkim | BSNL Fiber PRI | Airtel Enterprise SIP | 40 | $\ge 3.8$ |
| **TOTAL** | **Pan-NER Unified** | **All 8 States** | **Multi-Carrier Dual-Homed** | **Automatic PRI Failover** | **340 Concurrent** | **High Fidelity** |

---

### 3. Community Reminiscence Circle 5-Stage Rollout Playbook

1. **Stage 1: Traditional Governance & Elder Council Alignment**:
   - Engage Gaon Burahs (Assam/Arunachal), Dorbar Shnongs (Meghalaya), Village Development Boards (Nagaland), and Church Elder Committees (Mizoram).
   - Secure community hall space adjacent to the PHC or Sub-Centre.
2. **Stage 2: Kinship & Grandchild Connect Onboarding**:
   - Collect family consent forms and register grandchildren for asynchronous co-play audio/video clues.
3. **Stage 3: Sensory Asset Preparation**:
   - Assemble local sensory tactile baskets (Muga cocoons, bamboo reeds, dried turmeric, tea leaves, local seeds).
   - Position ruggedized high-SPL tablets in anti-glare stands.
4. **Stage 4: Facilitated Reminiscence Protocol**:
   - ASHA-led 45-minute structured sessions: 10m folkloric musical icebreaker, 20m cooperative tablet puzzle, 15m oral life-review storytelling.
5. **Stage 5: Biostatistical Telemetry & Clinical Referral Escalation**:
   - Auto-calculate CCEI v1 and trigger tele-neurologist notification if $\text{CCEI} < 55$.

---

### 4. Milestone M16 Official Sign-Off Criteria

| Pre-Specified Gate | Required Threshold | Achieved Metric | Status |
|:---|:---:|:---:|:---:|
| **Wave 1–4 PHCs Onboarded** | 90/90 PHCs mapped with verified staff | 90/90 PHCs fully provisioned | PASSED |
| **8-State Locale Packs** | Mean elder comprehension $\ge 96\%$ | $97.6\%$ mean score validated | PASSED |
| **NHM Tablet Compatibility** | All standard models certified | 5/5 models certified with low RAM | PASSED |
| **Multi-Circle IVR Coverage** | All 4 telecom circles operational | $340$ concurrent channels active | PASSED |
| **Community Circle Playbook** | Adopted in all 90 PHC clusters | 5-stage playbook distributed | PASSED |
| **Milestone M16 Status** | Multi-State Readiness Certified | Pan-NER operational | **SIGNED OFF** |
