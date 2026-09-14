# SMRITI-NER SUB-PHASE 4.2 SPECIFICATION: PATIENT HOME & NAVIGATION ARCHITECTURE

**Document Reference**: SMRITI-P4-SP4.2-SPEC-v1.0  
**Phase**: Phase 4 — Patient PWA Shell & Cognitive Game Engine  
**Sub-Phase**: 4.2 — Patient Home & Navigation Architecture  
**Target Platform**: Progressive Web Application (PWA) / Android Tablet & Budget Smartphone Shell  
**Clinical Standards**: Ribot's Law Reminiscence Therapy, Anti-Agitation Compassionate Design, WCAG 2.2 AAA  
**Status**: ACTIVE / PRODUCTION SPECIFICATION  

---

## 1. Executive Summary & Clinical Intent

Sub-Phase 4.2 delivers the core daily interaction surface for elderly individuals experiencing mild-to-moderate cognitive decline (dementia / Alzheimer's disease) in the North Eastern Region (NER) of India.

In patients experiencing hippocampal degradation and short-term memory fragmentation, conventional operating system home screens, nested hierarchical menus, and small text create acute spatial disorientation and frustration. Under **Ribot's Law of Retrograde Amnesia**, earliest-acquired memories and cultural touchstones persist while recent episodic memory degrades. 

To mitigate disorientation and catastrophic agitation, the Patient Home and Navigation architecture enforces five foundational pillars:
1. **Unambiguous Daily Activity Cards**: Exactly 4 large, high-contrast, tremor-tolerant touch targets (`≥64×64dp`) representing the core daily pillars: Cognitive Games, Reminders, Memory Album, and Grandchild/Community Connect.
2. **1-Tap Multilingual Selector**: Rapid, zero-barrier toggle across all 8 recognized NER languages (Assamese, Meitei, Bengali, Bodo, Khasi, Mizo, Hindi, and English) with native script rendering.
3. **Floating Spoken Voice Assistant**: A persistent, accessible *"কথাৰে কওক" (Speak to Me)* button providing warm synthetic or recorded voice guidance, reassuring the elder of their identity, physical location, and daily activities.
4. **PIN-Guarded Patient ↔ Caregiver Mode Switch**: Seamless mode transition allowing family caregivers or visiting ASHA health workers to access clinical dashboards while preventing elders from accidental navigation into complex configuration panels.
5. **Non-Alarming Connectivity Status Indicator**: A peaceful, calming status dot (green when online; gentle warm amber when offline) that explicitly reassures the elder that all cognitive games, speech prompts, and medicine schedules continue functioning with zero internet.

---

## 2. Component Specifications

### 2.1 Daily Activity Cards Suite
The primary home canvas presents four primary cards arranged in an elder-friendly 2-column or 1-column responsive grid:

| Card ID | Title (Assamese / English) | Primary Icon & Color | Visual Cue & Cognitive Ring | Route Target |
|:---|:---|:---|:---|:---|
| `act_games` | জ্ঞান ব্যায়াম / Cognitive Games | 🎮 `#2563eb` (Blue) | Daily Cognitive Target: `2 / 4 Games Completed` (`50%`) | `games` |
| `act_reminders` | দৰব আৰু পানী সোঁৱৰণী / Reminders | ⏰ `#d97706` (Amber) | Next Reminder: `12:30 PM • জলপান আৰু ঔষধ` | `reminders` |
| `act_album` | পুৰণি স্মৃতিৰ ফটো / Memory Album | 📸 `#c026d3` (Purple) | Family Voice Album: `8 Photos • 3 Voice Notes` | `album` |
| `act_connect` | নাতি-নাতিনীৰ সৈতে / Connect | 🤝 `#15803d` (Green) | Social Circle: `1 New Voice Clue from Ananya` | `connect` |

#### Accessibility & Motor Constraints:
- Built strictly upon `ElderCard` primitives (`WCAG 2.2 AAA`).
- Minimum touch bounding box: `140px` height, `100%` column width, `≥64px` tap target area.
- Minimum 60ms tremor dampening to filter unintended motor oscillations and multiple phantom taps.
- Tactile haptic feedback (`triggerHaptic(25)`) and pleasant harmonic chime (`playBeep(440, 100)`) upon touch release.

---

### 2.2 1-Tap 8-Language Selector (`LanguageSelectorModal`)
Enables instantaneous locale switching directly from the top navigation bar without navigating away from the home screen:

```
┌─────────────────────────────────────────────────────────────┐
│ 🗣️ আপোনাৰ ভাষা বাছনি কৰক • Choose Language           [ ✕ ] │
├─────────────────────────────────────────────────────────────┤
│  [✓] অসমীয়া (Assamese)        │      বাংলা (Bengali)        │
│      ꯃꯩꯇꯩꯂꯣꯟ (Meitei)          │      बड़ो (Bodo)            │
│      Khasi                    │      Mizo ṭawng (Mizo)      │
│      हिन्दी (Hindi)            │      English                │
└─────────────────────────────────────────────────────────────┘
```

- Each language card rendered in its native font family (Bengali/Assamese, Meetei Mayek, Devanagari, Latin).
- Selected language marked with an emerald checkmark badge and gentle high-contrast border.
- Audio announcement synthesized via Web Audio / Bhashini upon selection.

---

### 2.3 Spoken Voice Assistant Button (`VoiceAssistantButton`)
- **Position**: Floating bottom-right action trigger (`bottom: 5.5rem`, `right: 1.25rem`), clear of the bottom navigation bar.
- **Label**: Dynamic localized prompt:
  - Assamese: *"কথাৰে কওক"*
  - Meitei: *"ꯋꯥ ꯉꯥꯡꯕꯤꯌꯨ"*
  - Bengali: *"কথা বলুন"*
  - Bodo: *"रायलायदो"*
  - Hindi: *"बात करें"*
  - English: *"Speak to Me"*
- **Interaction Flow**:
  1. Single tap triggers a warm 523Hz melodic chime.
  2. Expands into an accessible voice banner overlay displaying an animated calming waveform (0.7Hz sine oscillation).
  3. Displays spoken reassurance: *"বৰদেউতা, আপুনি গুৱাহাটীৰ নিজা ঘৰত সুৰক্ষিতভাৱে আছে। আজিৰ জ্ঞান ব্যায়াম আৰম্ভ কৰিব নেকি?"* (Reassuring physical safety and suggesting today's game).

---

### 2.4 Patient ↔ Caregiver Mode Switch (`ModeSwitchGuard`)
- **Visual Trigger**: Distinctive header lock pill with clear dual-persona indicator.
- **Security Guard**: Elder-friendly PIN-pad modal preventing accidental clicks while avoiding complex password entry.
- **Keypad Design**:
  - `4×3` grid with 64px circular touch buttons.
  - Large 28px bold digits.
  - Default caregiver PIN: `1234` (configurable in cloud/local storage).
  - On 3 incorrect attempts: 15-second gentle timeout with calming message (zero harsh sirens or red flashing screens).

---

### 2.5 Non-Alarming Connectivity Status Indicator (`ConnectivityIndicator`)
- **Clinical Rationale**: In dementia, red warning lights or "No Internet Connection" alert banners trigger anxiety and agitation.
- **Design Solution**:
  - **Online**: Solid calm emerald dot (`#10b981`) with label *"Online"*.
  - **Offline**: Soft warm amber dot (`#f59e0b`) with label *"Offline (All Games & Reminders Ready)"*.
- Non-modal, non-blocking, screen-reader announced via `aria-live="polite"`.

---

## 3. Architecture & File Structure

```
smriti-ner/
├── src/
│   ├── app/
│   │   ├── page.tsx                           # Master screen & global language/connectivity state
│   ├── components/
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx                 # Enhanced Patient Home with ElderCard suite
│   │   ├── ui/
│   │   │   ├── ConnectivityIndicator.tsx      # Non-alarming online/offline monitor
│   │   │   ├── LanguageSelectorModal.tsx      # 1-tap 8-language modal selector
│   │   │   ├── VoiceAssistantButton.tsx       # Floating "কথাৰে কওক" audio reassurance
│   │   │   ├── ModeSwitchGuard.tsx            # PIN-protected patient ↔ caregiver modal
```

---

## 4. Verification & Validation Metrics

| Criteria | Target Metric | Verification Method |
|:---|:---|:---|
| **Touch Target Size** | All interactive items ≥64×64dp | Chrome DevTools Element Inspection |
| **Contrast Ratio** | Text and icons ≥7.0:1 (WCAG AAA) | axe-core automated audit |
| **Language Switch Latency** | <50ms UI update across 8 languages | React state profiler |
| **Offline Resilience** | 100% features operational offline | Chrome DevTools Network Offline simulation |
| **Tremor Dampening** | Multi-tap <60ms filtered into single event | Automated unit/DOM event test |
| **Build & Lint Integrity** | 0 TypeScript errors, clean production bundle | `npm run build` |

---

*Authored for Smriti-NER (SIH 2026 — PS ID: 26003) — Ministry of Development of North Eastern Region (MDoNER)*
