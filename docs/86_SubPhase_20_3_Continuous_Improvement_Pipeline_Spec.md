# Sub-Phase 20.3 Specification: Continuous Improvement Pipeline

## 1. Executive Summary & Context
Sub-Phase 20.3 formalizes the **lifecycle engineering, content expansion, and algorithmic retraining pipeline** for Smriti-NER. To maintain high elder engagement over multi-year horizons and prevent habituation or cultural stagnation, the platform executes a continuous delivery and retraining cadence anchored by four core systems:
1. **Monthly Release Calendar**: Structured 12-month release engineering cycle (`v2.5.0` to `v3.4.0`) delivering regular bug fixes, security patches, and localized UI enhancements.
2. **New Game & Feature Development Roadmap**: Annual introduction of 3 culturally authentic cognitive stimulation modules co-designed with community elders.
3. **Quarterly Model Retraining SOP**: Rigorous quarterly schedule updating Bayesian Knowledge Tracing (BKT), MMSE proxy regression models, and population FedProx weights against drift.
4. **Moderated Community Content Crowdsourcing Platform**: Community ingestion portal enabling families, folk artists, and village elders to submit authentic regional stories, songs, and recipes.

---

## 2. Monthly Release Engineering Cycle

### 2.1 Release Cadence & Protocol
- **Cadence**: Monthly release deployed every 3rd Tuesday at 02:00 IST (minimal platform traffic window).
- **Versioning Strategy**: Semantic Versioning (`MAJOR.MINOR.PATCH`).
- **Release Verification Gates**:
  - Automated Unit & Integration Tests: $100\%$ pass mark across all test suites.
  - End-to-End Ergonomic Regression: Zero accessibility defects on WCAG 2.1 AAA high-contrast tests.
  - Pilot PHC Canary: 72-hour staging soak test across 5 sentinel Primary Health Centres before full OTA rollout.

### 2.2 Twelve-Month Release Schedule

| Month | Target Version | Primary Focus Area | Target Deployment Date |
|:---|:---|:---|:---|
| **Oct 2026** | `v2.5.0` | Post-Rollout Hotfixes, Play Store Optimizations | 2026-10-20 |
| **Nov 2026** | `v2.6.0` | Winter Folklore Content Packs, Bodo Dialect Audio Patch | 2026-11-17 |
| **Dec 2026** | `v2.7.0` | Q4 Model Retraining Release (BKT & FedProx Update) | 2026-12-15 |
| **Jan 2027** | `v2.8.0` | Magh Bihu / Pous Sankranti Festive Reminiscence Update | 2027-01-19 |
| **Feb 2027** | `v2.9.0` | Caregiver Telemetry Export v2, Battery Optimization | 2027-02-16 |
| **Mar 2027** | `v3.0.0` | Major Milestone: Launch of *Majuli River Crossing* Game | 2027-03-16 |
| **Apr 2027** | `v3.1.0` | Rongali Bihu & Regional New Year Content Packs | 2027-04-20 |
| **May 2027** | `v3.2.0` | High-Altitude Offline BLE Safety Mesh Enhancements | 2027-05-18 |
| **Jun 2027** | `v3.3.0` | Launch of *Cheraw Bamboo Rhythm Tap* Motor Game | 2027-06-15 |
| **Jul 2027** | `v3.4.0` | Q2 Model Retraining Release, Monsoonal UI Theme | 2027-07-20 |
| **Aug 2027** | `v3.5.0` | Multigenerational *Family Tree Story Builder* Launch | 2027-08-17 |
| **Sep 2027** | `v4.0.0` | Annual Major Architecture Release (Annual Platform Audit) | 2027-09-21 |

---

## 3. New Game & Feature Development Roadmap

### 3.1 New Cognitive Stimulation Games
To provide novel neuropsychological stimulation, three major games are scheduled for progressive rollout:
1. **Majuli River Crossing (Spatial Navigation & Executive Function)**:
   - *Theme*: Navigating a traditional Brahmaputra ferry (*Bhura*) between shifting river sandbars (*Chars*).
   - *Cognitive Domain*: Visuospatial planning, sequential decision-making, mental rotation.
2. **Cheraw Bamboo Rhythm Tap (Auditory-Motor Synchronization & Reaction Time)**:
   - *Theme*: Synchronizing dual-hand taps with traditional Mizo Cheraw bamboo clashes.
   - *Cognitive Domain*: Bimanual motor coordination, auditory reaction time, rhythmic entrainment.
3. **Family Tree Story Builder (Episodic Memory & Social Bonding)**:
   - *Theme*: Interactive genealogical reminiscence album linking village family histories.
   - *Cognitive Domain*: Long-term episodic retrieval, verbal fluency, intergenerational social connection.

---

## 4. Quarterly Model Retraining SOP

### 4.1 Retraining Pipeline & Drift Governance
- **Schedule**: Quarterly (March, June, September, December).
- **Core Models Retrained**:
  - **Bayesian Knowledge Tracing (BKT)**: Prior slip/guess/transition probability adjustment across 14,850+ enrolled elders to ensure individual difficulty matches longitudinal progression.
  - **MMSE Proxy Random Forest Regressor**: Recalibration using newly ingested clinical pilot ground-truth pairs ($N \ge 1,200$), maintaining validation correlation $R^2 \ge 0.76$.
  - **Population FedProx Federated Aggregator**: Global model convergence with updated district client sample weightings ($\mu = 0.01$).
- **Drift Threshold Gate**:
  - Population Stability Index (PSI) monitored per district and language.
  - If $\text{PSI} \ge 0.10$, automated drift alert triggers clinical advisory review and hyperparameter recalibration before model deployment.

---

## 5. Community Content Crowdsourcing Platform

### 5.1 Architecture & Moderation Workflow
- **Crowdsourcing Portal Host**: `https://crowd.smriti.ner.gov.in`
- **Supported Media Formats**: Audio recordings (MP3/WAV/AAC), historical photographs (WebP/JPEG), transcribed folklore text, and heirloom culinary recipes.
- **Three-Tier Moderation Gate**:
  1. *Tier 1 (Automated AI Guardrail)*: Content safety, copyright screening, and automated language identification.
  2. *Tier 2 (ASHA & Community Facilitator Circle Review)*: Cultural authenticity and dialect validation by local village champions.
  3. *Tier 3 (Clinical Advisory Approval)*: Senior clinicians ensure content is free from distressing trauma or stigmatizing triggers for dementia patients.

---

## 6. Verification & Testing Standards
- All endpoints must return HTTP 200 with structured JSON.
- Automated tests must verify:
  1. Release calendar schedule (12 monthly releases, dates, semantic versioning).
  2. Development roadmap (3 games/features, cognitive sub-domains, delivery milestones).
  3. Model retraining SOP (quarterly cycle, BKT/MMSE/FedProx parameters, PSI threshold $< 0.10$).
  4. Crowdsourcing platform configuration (moderation tiers, supported asset types).
  5. Consolidated improvement pipeline summary.
