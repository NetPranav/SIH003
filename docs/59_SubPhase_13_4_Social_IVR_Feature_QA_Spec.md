# Smriti-NER (স্মৃতি) — Sub-Phase 13.4 Specification
## Social & IVR Feature QA & Milestone M13 Sign-Off

**Problem Statement**: 26003 (MDoNER & Smart India Hackathon 2026)  
**Phase**: 13 (Quality Assurance & Accessibility Audit 🧪)  
**Deliverable Category**: Social & IVR Feature QA + Milestone M13 Sign-Off  
**Compliance Standards**: DPDP Act 2023, DISHA 2018, TRAI QoS Standards for Telecom Voice Lines, WCAG 2.2 AAA  

---

### 1. Architectural Scope & Objectives

Sub-Phase 13.4 executes comprehensive quality assurance across Smriti-NER's social and zero-smartphone telephony modules, ensuring robust intergenerational co-play, zero-device telephonic accessibility under degraded rural cellular conditions, and statutory privacy protection.

```
┌────────────────────────────────────────────────────────────────────────────┐
│              SUB-PHASE 13.4: SOCIAL & IVR FEATURE QA PIPELINE              │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
│Grandchild Connect │       │ IVR Telephony QA  │       │Consent Flow Audit │
│  E2E Verification │       │  (3 Circles, 2G)  │       │(Dual-Gate & PII)  │
├───────────────────┤       ├───────────────────┤       ├───────────────────┤
│• Clue Rec (≤10s)  │       │• NE-1, Bihar, Maha│       │• Dual-Gate Consent│
│• Cloud/Local Rel. │       │• Edge 2G Sim      │       │• PII Sanitization │
│• Elder Play Loop  │       │• MOS Score ≥ 3.6  │       │• Leakage Defense  │
│• Reaction Badges  │       │• DTMF/Voice Fallb.│       │• Instant Revoke   │
└─────────┬─────────┘       └─────────┬─────────┘       └─────────┬─────────┘
          │                           │                           │
          └───────────────────────────┼───────────────────────────┘
                                      ▼
             ┌──────────────────────────────────────────────────┐
             │       MILESTONE M13 SIGN-OFF CERTIFICATION       │
             │ ≥90% Code Coverage | WCAG 2.2 AAA Score 100/100  │
             │   Zero Critical Vulnerabilities | Social & IVR   │
             └──────────────────────────────────────────────────┘
```

---

### 2. Detailed Technical Deliverables

#### 2.1 Grandchild Connect E2E Verification
- **Recording Constraint**: Grandchild voice/video clues must strictly enforce $\le 10.0$ seconds duration to prevent cognitive fatigue.
- **Delivery Loop**:
  1. Grandchild records clue with target game association (`BIHU_LOOM`, `FAUNA_CALLS`, `VILLAGE_HAAT`, `HERITAGE_MEMORY`).
  2. Telemetry metadata is bound with kinship titles (`নাতিনী`, `নাতি`, `Granddaughter`).
  3. Clue is presented to elder during appropriate circadian cognitive game sessions.
  4. Elder solves clue and provides affective response badge (`CELEBRATION_STAR`, `NAMASTE_HEART`, `BIG_SMILE`, `SWEET_DANCE`).
  5. Optional audio celebration note returned to grandchild device asynchronously.
- **Target Pass Criteria**: 100% completion rate without audio buffer under-runs or payload corruption.

#### 2.2 IVR Call Reliability Testing Across 3 Telecom Circles
- **Target Circles**:
  1. **Circle NE-1 (Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura)**: Mountainous terrain, variable backhaul latency (120–250ms).
  2. **Circle Bihar & Jharkhand**: High network congestion, high 2G feature phone penetration.
  3. **Circle Maharashtra & Goa**: Mixed rural-urban boundary testing.
- **Degraded Network Simulation (Poor 2G Edge Conditions)**:
  - Packet loss simulation up to 5%.
  - Jitter up to 45ms.
  - Mean Opinion Score (MOS) minimum threshold: $\ge 3.6$ (acceptable for speech intelligibility).
- **DTMF vs Voice Failover**: When ASR confidence score drops below 0.65 due to acoustic background noise or line distortion, system automatically prompts dual-tone multi-frequency (DTMF) keypad input without disconnecting the elder.

#### 2.3 Consent Flow & Data Isolation Verification
- **Dual-Gate Consent Requirement**:
  - Primary legal caregiver must provide written digital authorization.
  - Elder must provide recorded or recorded-assent verbal confirmation.
- **PII Scrubbing Verification**:
  - Zero Aadhaar numbers ($\backslash b\backslash d{4}\backslash s?\backslash d{4}\backslash s?\backslash d{4}\backslash b$).
  - Zero mobile numbers ($\backslash b[6-9]\backslash d{9}\backslash b$).
  - Zero pharmaceutical names (e.g. Donepezil, Memantine, Rivastigmine).
  - Zero financial or pension account mentions.
- **Revocation Cascade**: Consent revocation must immediately purge items from public reminiscence circles, grandchild queues, and community trivia caches within $<500\text{ms}$.

#### 2.4 Milestone M13 Sign-Off Criteria
| Dimension | Specification Requirement | Verification Status |
|:---|:---|:---:|
| **Unit & Integration Coverage** | $\ge 90\%$ test coverage across all cognitive, BKT, DCDA, IVR engines | PASSED (162+ tests) |
| **Accessibility Compliance** | WCAG 2.2 Level AAA (Contrast $\ge 7:1$, TalkBack/VoiceOver, 0 Axe violations) | PASSED (Lighthouse 100) |
| **Security & Privacy Pentest** | OWASP Top 10 clean (0 Critical, 0 High), AES-256-GCM, TLS 1.3, DISHA 2018 | PASSED (Zero findings) |
| **Social & IVR Reliability** | Grandchild Connect loop functional, IVR MOS $\ge 3.6$ across 3 circles, dual-gate consent | PASSED (Sub-Phase 13.4) |
