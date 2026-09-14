# SMRITI-NER SUB-PHASE 4.4 SPECIFICATION: GAMES 1–4 CORE IMPLEMENTATION & CLINICAL MECHANISMS

**Document Reference**: SMRITI-P4-SP4.4-SPEC-v1.0  
**Phase**: Phase 4 — Patient PWA Shell & Cognitive Game Engine  
**Sub-Phase**: 4.4 — Games 1–4 Core Implementation  
**Target Platform**: Progressive Web Application (PWA) / Tablet & Smartphone Edge Shell  
**Clinical Standards**: Ribot's Law Reminiscence Therapy, MoCA/MMSE Cognitive Domain Mapping, WCAG 2.2 AAA  
**Status**: ACTIVE / PRODUCTION SPECIFICATION  

---

## 1. Executive Summary & Clinical Domain Mapping

Cognitive decline in dementia manifests heterogeneously across functional neuro-anatomical domains. Interventions that target only a single cognitive modality (e.g. simple flashcards) accelerate disengagement and fail to stimulate spared neural pathways.

In accordance with **Ribot's Law of Retrograde Amnesia**, earliest-acquired sensory and cultural experiences—folk music melodies, native wildlife recognition, traditional handloom weaving patterns, and local weekly market routines—remain deeply consolidated in long-term episodic and procedural memory circuits, even when hippocampal short-term formation is impaired.

Sub-Phase 4.4 delivers the complete core implementation of four specialized, culturally anchored cognitive therapy games:

| Game ID | Cultural Anchor | Neuropsychological Domain Target | MMSE / MoCA Correlation | Clinical Mechanism |
|:---|:---|:---|:---|:---|
| **Game 1: Dhol-Pepa Sur-Milon** | Assamese & NER Folk Musical Instruments | Auditory Working Memory & Phonological Loop | Attention & Calculation (Serial 7s Proxy) | Multi-tone rhythm reproduction stimulating primary auditory cortex (A1) and premotor sequencing circuits. |
| **Game 2: Kaziranga Safari Search** | Endemic Wildlife of North East India | Selective Visuospatial Attention & Feature Binding | Visual Attention & Object Naming | Figure-ground discrimination in naturalistic grassland camouflage; reinforces semantic retrieval. |
| **Game 3: Weaver's Loom Pattern** | Muga Silk, Gamosa, Mizo Puan & Naga Shawl Motifs | Visuomotor Coordination & Procedural Sequencing | Visuospatial & Executive Function (Clock Drawing Proxy) | Color/motif pattern matching on a traditional loom shuttle; exercises procedural motor schemas. |
| **Game 4: Daily Haat Recall** | Rural Weekly Haat (Bazaar) Stalls & Traditional Recipes | Delayed Episodic Memory & Category Fluency | Orientation & Delayed Recall (3-Word Recall Proxy) | Multi-item recipe shopping list memorization, distractor market navigation, and token exchange. |

---

## 2. Detailed Game Architecture & Mechanics

### 2.1 Game 1: Dhol-Pepa Sur-Milon (ঢোল-পেঁপা সুৰ-মিলন)
- **Folk Instrument Synthesis (6 Core Instruments)**:
  1. *Pepa (পেঁপা)*: 440 Hz (A4) sawtooth wave with high harmonic overtone simulating buffalo-horn resonance.
  2. *Dhol (ঢোল)*: 120 Hz (B1) low-frequency triangle wave with rapid pitch decay simulating goat-skin drum impact.
  3. *Pung (পুং)*: 200 Hz (G2) triangle wave with dual-chamber resonance (Manipuri classical drum).
  4. *Duitara (দৈতৰা)*: 330 Hz (E4) sine wave plucked acoustic string timbre (Khasi traditional lute).
  5. *Gogona (গগনা)*: 520 Hz (C5) vibrato sawtooth wave with oral resonance (Assamese bamboo reed).
  6. *Tokari (টোকোৰী)*: 290 Hz (D4) rounded sine wave with warm wood body decay.
- **Dynamic Tier-Adaptive Layout**:
  - Tier 1: 2 instruments (Pepa, Dhol) — large 140px buttons, generous 8s window.
  - Tier 2: 3 instruments (+ Pung).
  - Tier 3: 4 instruments (2×2 grid, + Duitara).
  - Tier 4: 5 instruments (+ Gogona).
  - Tier 5: 6 instruments (3×2 grid, + Tokari) — rhythmic 2.8s tempo.
- **Telemetry Collected**: Reaction time ($RT_{total}$), motor hesitation ($\tau_{motor}$), audio pitch recognition accuracy, and BKT rhythm mastery.

---

### 2.2 Game 2: Kaziranga Safari Search (কাজিৰঙা চাফাৰী সন্ধান)
- **Visual Camouflage Engine**:
  - Background: Kaziranga Elephant Grass canvas with layered green and gold foliage reeds.
  - Distractor foliage elements randomly overlaid to challenge figure-ground separation.
  - When AACB triggers: distractor opacity dims to 40%, and the target animal glows with a warm golden halo pulse.
- **Endemic Fauna Catalog**:
  1. *One-Horned Rhinoceros (গঁড়)*: Pride of Kaziranga National Park, Assam.
  2. *Great Indian Hornbill (ধনেশ)*: Sacred forest bird of Arunachal Pradesh & Nagaland.
  3. *Red Panda (ৰঙা পাণ্ডা)*: Endemic arboreal mammal of Sikkim high-altitude oak forests.
  4. *Sangai Deer (চাঙাই হৰিণা)*: Floating phumdi brow-antlered deer of Keibul Lamjao, Manipur.
  5. *Hoolock Gibbon (হলৌ বান্দৰ)*: India’s only native ape species, canopy dweller of Upper Assam.
- **Multilingual Trivia Narration**: Upon correct discovery, cultural facts and regional names are voiced and displayed in the elder's selected language.

---

### 2.3 Game 3: Weaver's Loom Pattern (তাঁত শালৰ নক্সা)
- **Traditional Loom Interface**:
  - Interactive wooden reed, flying shuttle, and warp/weft yarn rack.
  - Authentic color dyes: Muga Golden Silk (`#c9a84c`), Gamosa Red (`#b91c1c`), Forest Green (`#15803d`), Mizo Puan Indigo (`#3730a3`), and Ivory (`#f5f5f4`).
- **20+ Traditional Motif Library**:
  - Assamese *Kingkhap* (royal crown) and *Kalka* floral borders.
  - Mizo *Puanchei* geometric checkerboard stripes.
  - Naga *Tsungkotepsu* warrior shawl bands.
  - Bodo *Aronai* and *Dokhona* border triangles.
- **Cultural Trunk Collection Unlocks**:
  - Completed patterns are saved into the elder’s personal "Cultural Trunk" gallery, viewable by family members on the Caregiver Portal.

---

### 2.4 Game 4: Daily Haat Recall (দৈনিক হাটৰ স্মৃতি)
- **Market Stall Architecture**:
  - 4 specialized rural stalls: Vegetable Stall, Fresh Fish Stall, Traditional Spice Rack, and Assam Tea Corner.
  - Authentic local produce: Joha Scented Rice, Bhut Jolokia (Ghost Pepper), Fresh Rohu Fish, Mustard Greens, Black CTC Tea, Turmeric Root, Ginger, and Banana Flower.
- **Delayed Recall Protocol**:
  1. *Memorization Phase*: Elder is shown a 3-item recipe shopping card (e.g. *Assamese Fish Curry / মাছৰ জোল*).
  2. *Distractor Phase*: 5-second market ambient sound / browsing interval.
  3. *Retrieval Phase*: Elder navigates stalls to pick the correct ingredients from memory into their cane basket.
  4. *Currency Exchange*: Elder confirms purchase with wooden rupee tokens, exercising executive calculation.

---

## 3. Telemetry Integration & Verification Standard

Every game trial strictly pipes touch timestamps and coordinates through `sessionManager.recordInteraction()`.
On round completion, sessions are persisted to `localStorage` and delta sync packets.
Celebration overlay activates with localized praise and non-jarring acoustic feedback.

---

*Authored for Smriti-NER (SIH 2026 — PS ID: 26003) — Ministry of Development of North Eastern Region (MDoNER)*
