# 🧠 Smriti-NER (স্মৃতি / ꯁ꯭ꯃ꯭ꯔꯤꯇꯤ)
> **AI-Powered Culturally-Rooted Cognitive Digital Therapeutic (DTx) & Reminiscence Platform for Elderly Dementia Care across North East India.**

**Problem Statement ID**: 26003 (Smart India Hackathon 2026)  
**Sponsoring Ministry**: Ministry of Development of North Eastern Region (MDoNER), Government of India  
**Target Beneficiaries**: Elderly Dementia & MCI Patients, Family Caregivers, and ASHA/ANM Healthcare Workers across the 8 North Eastern States (Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura).

---

## 📂 Repository & Documentation Suite Directory

This repository contains the complete evaluator-grade submission package and interactive prototype for SIH 2026:

| Document / Asset | Description & Purpose |
| :--- | :--- |
| 📊 **[01. Official Pitch Deck (Slide-by-Slide)](docs/01_SIH_2026_Official_Pitch_Deck_Slide_by_Slide.md)** | Official AICTE 8-slide presentation with layout, bullet points, evaluator defense, and verbatim speaker pitch scripts. |
| 📑 **[02. Comprehensive Project Proposal (DPR)](docs/02_Smriti_NER_Comprehensive_Project_Proposal.md)** | Detailed Project Report & Technical Synopsis covering regional epidemiology, clinical grounding in Ribot's Law, architecture, and budget. |
| 📐 **[03. System Architecture & SRS](docs/03_System_Architecture_and_Software_Requirements_Specification_SRS.md)** | IEEE 830 / ISO 29148 compliant Software Requirements Specification (FR-01 to FR-25, NFRs, Mermaid sequence & state machine diagrams, SQLite schema). |
| 🧮 **[04. Mathematical Formulation & AI Engine](docs/04_Mathematical_Formulation_and_AI_DCDA_Engine_Spec.md)** | Mathematical specification of the DCDA Engine, Bayesian Knowledge Tracing (BKT), touch wander latency decomposition ($\tau_{motor}$), and Anti-Agitation Circuit Breakers. |
| 🏥 **[05. ASHA & Caregiver Field Manual](docs/05_ASHA_Worker_and_Rural_Caregiver_Field_Manual.md)** | Standard Operating Procedure (SOP) for grassroots community health workers and rural families conducting home visits and offline delta harvesting. |
| 💻 **[Interactive Web Prototype (index.html)](index.html)** | Runnable, dual-persona (Patient vs Caregiver) responsive application with Web Audio folk sound synthesis, Bhashini speech assistant, and live SVG charts. |

---

## 🌟 Key Innovations of Smriti-NER

1. **Culturally Grounded Reminiscence Therapy (RT)**:
   - Replaces unfamiliar Western geometric puzzles with authentic North Eastern folk heritage:
     - 🎺 **Dhol-Pepa Sur-Milon**: Auditory memory recall using synthesized Assamese Pepa, Bihu Dhol, Manipuri Pung, and Khasi Duitara.
     - 🦏 **Kaziranga Safari Search**: Visual attention and spatial orientation spotting native fauna (One-horned Rhino, Hornbill, Red Panda, Sangai Deer).
     - 🧵 **Weaver's Loom (তাঁত শাল)**: Working memory and sequencing using traditional handloom colors (Muga Golden Silk, Gamosa Red, Tea Green, Brahmaputra Blue).
     - 🛒 **Daily Haat (দৈনিক বজাৰ)**: Executive function and ADL recall assembling regional culinary ingredients (Khar, Bamboo shoots, Local fish).
2. **AI Dynamic Cognitive Difficulty Adjustment (DCDA) with Anti-Agitation Circuit Breaker (AACB)**:
   - Differentiates physical motor tremor from cognitive hesitation using coordinate wander vector analysis.
   - If an elder makes 2 consecutive mistakes, the AACB automatically activates: suppresses all error buzzers, dims distractors, enlarges hitboxes, and plays a warm family voice prompt.
3. **Personalized Family Voice Prompts**:
   - Replaces sterile electronic alarm beeps with authentic voice recordings of children and grandchildren to prevent paranoia and achieve near-100% adherence.
4. **100% Local-First Edge Operation & ASHA Bluetooth Mesh**:
   - Operates completely offline without internet connectivity. Audio is synthesized locally via Web Audio API. Telemetry synchronizes via compressed delta packets (< 50 KB) or peer-to-peer Bluetooth transfer to visiting ASHA worker tablets.
5. **Caregiver & Clinician Telemetry Dashboard**:
   - Computes continuous 30-day longitudinal Mini-Mental State Examination (MMSE) proxy trajectories and early warning alerts for evening sundowning agitation.

---

## 🚀 How to Run the Interactive Working Prototype

The prototype is built with standard web technologies (HTML5, Vanilla CSS3, Vanilla ES6 JavaScript) and requires **zero build steps or external dependencies**.

### Option 1: Direct Browser Launch
Simply open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari):
```bash
open index.html
```

### Option 2: Local HTTP Server (Recommended)
You can launch a lightweight local HTTP server:
```bash
# Using Python
python3 -m http.server 8080

# Or using Node.js
npx serve .
```
Then navigate to: `http://localhost:8080`

---

## ♿ Accessibility & Neuro-Ergonomic Compliance
- **WCAG 2.2 AAA Compliant**: High-contrast text ratio ($\ge 7:1$), large touch targets ($\ge 64\text{px}$), oversized 24pt+ typography.
- **Cognitive Load Minimization**: Maximum 3 primary navigation options per viewport; zero nested sub-menus.
- **Multilingual Support**: Instant toggling between Assamese (অসমীয়া), Meitei / Manipuri (মৈতৈলোন্), Bengali (বাংলা), Hindi (हिन्दी), and English.
- **Mobile & Tablet Frame Preview**: Click **"ম’বাইল ফ্ৰেম (Mobile Frame)"** in the top navigation bar to test how the app looks and feels on mobile tablets.

---

## 🏛️ Sponsoring Ministry Alignment
Developed in alignment with the **Ministry of Development of North Eastern Region (MDoNER)** priorities for strengthening healthcare accessibility, preserving indigenous tribal culture, and supporting the National Health Mission (NHM) and Ayushman Bharat Digital Mission (ABDM).
