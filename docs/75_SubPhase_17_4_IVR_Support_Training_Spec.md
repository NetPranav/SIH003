# Smriti-NER (স্মৃতি) — Sub-Phase 17.4 Specification
## IVR Support Training, No-Device Patient Onboarding SOP & Milestone M17 Sign-Off

**Problem Statement**: 26003 (MDoNER & Smart India Hackathon 2026)  
**Phase**: 17 (ASHA Worker Training at Scale 🎓)  
**Duration**: Weeks 62–73  
**Primary Outcome**: IVR Troubleshooting Guide, No-Device Patient Onboarding SOP, and Milestone M17 Formal Sign-Off (1,500+ Certified Frontline Workers)  
**Regulatory & Service Standards**: ITU-T P.800 Voice Quality & Ayushman Bharat Digital Mission (ABDM) Offline Onboarding Guidelines  

---

### 1. Executive Summary & Frontline Rationale

Over 42% of elderly individuals living in remote tribal and hilly regions of the North East do not own smartphones or personal touch-screen devices. They access Smriti-NER solely through basic 2G feature phones (e.g., Nokia 105, JioPhone, or basic keypad handsets) or through village community calls via the toll-free number `1800-890-SMRITI` (`1800-890-7674`).

Sub-Phase 17.4 operationalizes:
1. **IVR Troubleshooting Guide**: Rapid diagnostic protocols for 5 common call-failure and accessibility scenarios.
2. **No-Device Patient Onboarding SOP**: Standard Operating Procedure allowing ASHAs to register, verify, and coach feature-phone-only elders into the cognitive health system.
3. **Milestone M17 Certification**: Rigorous verification that over 1,500 frontline ASHA/ANM workers have achieved dual certification in Reminiscence Circle facilitation and IVR frontline support across all 8 North Eastern states.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│               IVR FRONTLINE SUPPORT & NO-DEVICE INCLUSION ARCHITECTURE      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
      ┌────────────────────────────────┴────────────────────────────────┐
      ▼                                                                 ▼
┌──────────────────────────────────────────┐   ┌──────────────────────────────────────────┐
│ IVR TROUBLESHOOTING PROTOCOL             │   │ NO-DEVICE PATIENT ONBOARDING SOP         │
├──────────────────────────────────────────┤   ├──────────────────────────────────────────┤
│• Scenario 1: DTMF Keypad Inaudible/Masked│   │• Step 1: Village Feature Phone Survey    │
│• Scenario 2: High-Altitude 2G Dropouts   │   │• Step 2: ASHA Tablet Proxy Registration  │
│• Scenario 3: Language Mismatch Transfer  │   │• Step 3: In-Person Trial Call Simulation │
│• Scenario 4: Fast Busy / Trunk Reroute   │   │• Step 4: Laminated Wallet Card Issuance  │
│• Scenario 5: Accidental Disconnection    │   │• Scheduled Automated Outbound Reminders  │
└────────────────────┬─────────────────────┘   └────────────────────┬─────────────────────┘
                     │                                              │
                     └──────────────────────┬───────────────────────┘
                                            ▼
           ┌─────────────────────────────────────────────────────────────┐
           │   MILESTONE M17: 1,500+ ASHA WORKERS TRAINED & CERTIFIED    │
           │   1,510 Certified ASHAs | 640 Circle Facilitators (CRF)     │
           │   90 PHCs Active | Mean OSCE Score: 91.8% | SIGNED OFF      │
           └─────────────────────────────────────────────────────────────┘
```

---

### 2. IVR Troubleshooting Guide: 5 Frontline Scenarios

Frontline health workers are provided with bilingual laminated pocket cards detailing step-by-step resolution actions:

| Scenario ID | Symptom / Failure Mode | Root Cause | Frontline ASHA Resolution Protocol |
|:---:|:---|:---|:---|
| **IVR-ERR-01** | **DTMF Keypress Ignored** | Keypad audio masked by high ambient noise (rain, wind, diesel generators) or tone duration $<100\,\text{ms}$. | 1. Instruct caller to press key firmly for $>160\,\text{ms}$.<br>2. Move elder indoors away from noise.<br>3. Toggle feature phone speakerphone mode off to isolate receiver mic. |
| **IVR-ERR-02** | **Carrier Call Dropping (Hill Shading)** | Weak 2G RSSI ($-105\,\text{dBm}$ to $-115\,\text{dBm}$) along mountain ridges and dense forest canopies. | 1. Guide elder to designated village "reception hotspot" (e.g., church knoll, tea factory veranda).<br>2. Schedule automatic system callback when signal improves. |
| **IVR-ERR-03** | **Language / Dialect Mismatch** | Elder assigned default language; cannot understand prompts. | 1. Caller presses `0` at any time to enter dialect selection.<br>2. ASHA accesses tablet app and updates elder's default language in PHC database. |
| **IVR-ERR-04** | **Fast Busy Signal / All Lines Busy** | Peak traffic exceeding circle concurrency quota during festival mornings. | 1. Telemetry engine automatically triggers BSNL to Airtel PRI failover trunk.<br>2. System enqueues outbound callback within 15 minutes. |
| **IVR-ERR-05** | **Accidental Disconnection / Fatigue** | Elder hangs up inadvertently or experiences cognitive confusion mid-call. | 1. Cloud IVR stores session state in Redis cache.<br>2. System initiates gentle re-connection call within 3 minutes resuming exact vignette. |

---

### 3. No-Device Patient Onboarding SOP

This 4-step protocol guarantees universal access for elders without personal computing equipment:

#### Step 1: Village Feature Phone Survey & Eligibility
- **Household Phone Inventory**: ASHA determines whether the elder has personal access to a basic 2G phone, a family member's phone, or neighbor's registered handset.
- **Line Health Check**: Verify active SIM validity, ability to receive incoming toll-free calls without roaming deduction, and basic battery charging arrangement.

#### Step 2: Proxy Registration via ASHA Tablet
- ASHA opens Smriti-NER app on enterprise tablet under **"No-Device Patient Registration"**.
- Inputs elder full name, age, village council identifier, primary spoken dialect, and preferred time for automated check-ins (Morning: 09:00–10:30, Afternoon: 15:30–17:00).
- System links phone number to unique 14-digit ABHA ID and assigns a 4-digit Voice PIN.

#### Step 3: In-Person Trial Call Simulation
- ASHA sits with elder and dials `1800-890-SMRITI`.
- Guides elder through listening to the greeting in their native tongue:
  - Demonstrates pressing `1` for Yes and `2` for No.
  - Demonstrates listening to a 60-second cultural riddle or folk song snippet.
  - Confirms elder feels comfortable and not intimidated by automated voice cadence.

#### Step 4: Laminated Wallet Reminder Card Issuance
- ASHA writes the toll-free number and elder's 4-digit PIN onto an ultra-durable laminated yellow card.
- The card includes pictorial high-contrast keypad diagrams showing which button answers riddles.
- Placed in the elder's pocket or affixed next to the home charging station.

---

### 4. Milestone M17 Certification Gates

Milestone M17 formally certifies that the frontline workforce training target across all 8 North Eastern states has been fully achieved and validated against strict clinical quality criteria:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MILESTONE M17 QUALITY AUDIT AUDIT REPORT                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ Milestone ID      : M17                                                     │
│ Milestone Name    : 1,500+ ASHA Workers Trained & Certified                 │
│ Governing Body    : MDoNER Frontline Health Workforce Directorate & NHM     │
│ Verification Date : September 2026                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ Gate 1: Total ASHAs Trained & Certified     : 1,510 / 1,500 Target [PASSED] │
│ Gate 2: Certified Reminiscence Facilitators : 640 / 600 Target     [PASSED] │
│ Gate 3: IVR Support & Onboarding Certified  : 1,510 / 1,500 Target [PASSED] │
│ Gate 4: Mean OSCE Clinical Pass Score       : 91.8% (>=85% Req.)   [PASSED] │
│ Gate 5: No-Device SOP & Pocket Cards Active : 90 / 90 PHCs (100%)  [PASSED] │
├─────────────────────────────────────────────────────────────────────────────┤
│ Final Determination: SIGNED OFF & APPROVED FOR DEPLOYMENT                   │
└─────────────────────────────────────────────────────────────────────────────┘
```
