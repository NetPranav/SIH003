# Smriti-NER (স্মৃতি) — Sub-Phase 17.1 Specification
## Scalable ASHA Worker Training Program (1,500+ ASHAs across 8 States)

**Problem Statement**: 26003 (MDoNER & Smart India Hackathon 2026)  
**Phase**: 17 (ASHA Worker Training at Scale 🎓)  
**Duration**: Weeks 56–69 (Parallel Track with Multi-State Rollout)  
**Primary Outcome**: Pan-NER Scalable Training Infrastructure, 8 Localized Video Modules, 15 District Workshops, and 1,500+ Certified ASHAs  
**Accreditation Framework**: National Health Systems Resource Centre (NHSRC) & State Institute of Health & Family Welfare (SIHFW)  

---

### 1. Architectural Scope & Training Framework

Scaling Smriti-NER to 90 PHCs and 5,300 elderly patients requires an empowered, clinically competent, and culturally grounded frontline cadre. Sub-Phase 17.1 establishes a blended learning model training 1,565 ASHA/ANM workers:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 PAN-NER SCALABLE ASHA TRAINING ARCHITECTURE                 │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
     ┌───────────────────┬─────────────┴─────┬───────────────────┐
     ▼                   ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ 8 Localized     │ │ 15 District     │ │ In-App Digital  │ │ Monthly         │
│ Training Videos │ │ HQ Workshops    │ │ OSCE Module     │ │ Refresher       │
│ (10 min each)   │ │ (2-day hands-on)│ │ (Quiz & Cert)   │ │ Webinars (30m)  │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│• Assamese, Bodo │ │• 15 District HQs│ │• Offline SQLite │ │• Regional Master│
│• Khasi, Garo    │ │• Simulation Lab │ │• 10 OSCE Tests  │ │  Geriatricians  │
│• Meitei, Mizo   │ │• Peer Mentoring │ │• ≥85% Pass Mark │ │• Q&A Clinical   │
│• Bengali, Nepali│ │• Tablet Sandbox │ │• Verified Badge │ │  Case Reviews   │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │                   │
         └───────────────────┼───────────────────┼───────────────────┘
                             ▼
        ┌─────────────────────────────────────────────────────────────┐
        │  TARGET: 1,565 ASHAs Enrolled | 1,510 Certified (96.5%)     │
        │  Zero Clinical Attrition | Formal State NHM Accreditation   │
        └─────────────────────────────────────────────────────────────┘
```

---

### 2. Multi-Lingual Training Video Catalog (10 Minutes Each)

| Video ID | Language & Dialect | Focus Clinical / Practical Areas | Practical Demonstrations |
|:---|:---|:---|:---|
| `VID-TRN-AS` | Assamese (`as`) | Tablet hygiene, BKT progression, kinship clue playback | Majuli riverine clinic simulation |
| `VID-TRN-BRX` | Bodo (`brx`) | Bwisagu folk game facilitation, Dokhona tile pairing | Kokrajhar community hall circle |
| `VID-TRN-KHA` | Khasi (`kha`) | Slow cadence speech, Duitara music calming protocol | Ri-Bhoi elder home visit |
| `VID-TRN-GRX` | Garo (`grx`) | Wangala drum rhythm timing, cataract high-contrast mode | Tura sub-centre circle |
| `VID-TRN-MNI` | Meitei (`mni`) | Pena instrument resonance, AACB agitation de-escalation | Loktak floating village check-in |
| `VID-TRN-LUS` | Mizo (`lus`) | Chapchar Kut story prompts, tonal diacritic voice logging | Aizawl church elder group |
| `VID-TRN-BN` | Bengali (`bn`) | Tea worker elderly check-ins, DTMF fallback keypad | Cachar & South Tripura tea garden |
| `VID-TRN-NE` | Nepali (`ne`) | High-altitude battery care, Damphu rhythm tap coordination | Gangtok Ayushman Arogya Mandir |

---

### 3. Regional Training Workshops (15 District HQs)

15 two-day intensive simulation workshops across all 8 states:
- **Assam**: Guwahati (Kamrup Metro), Silchar (Cachar), Tezpur (Sonitpur), Kokrajhar (BTR).
- **Meghalaya**: Shillong (East Khasi Hills), Tura (West Garo Hills).
- **Manipur**: Imphal (Imphal West), Churachandpur.
- **Tripura**: Agartala (West Tripura), Udaipur (Gomati).
- **Arunachal Pradesh**: Itanagar (Papum Pare), Tawang.
- **Nagaland**: Kohima, Dimapur.
- **Mizoram**: Aizawl.
- **Sikkim**: Gangtok.

---

### 4. Digital Certification & Quality Assurance

- **In-App Digital Module**:
  - Embedded within the existing Smriti ASHA portal.
  - Fully functional offline; telemetry synchronizes during periodic PHC check-ins.
  - Automated certificate generation upon scoring $\ge 85\%$ across 10 randomized OSCE scenarios.
- **Monthly Clinical Webinars**:
  - Hosted on the 1st Saturday of each month via low-bandwidth audio-first conference.
  - Lead faculty: Specialists from Gauhati Medical College (GMCH), NEIGRIHMS Shillong, and RIMS Imphal.
