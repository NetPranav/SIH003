# Sub-Phase 10.2 Specification: Multi-Sensory Reminder UI & Interaction Layer

## 1. Executive Overview
Traditional smartphone pop-up notifications and intrusive system dialogs confuse and agitate geriatric dementia patients. Elders frequently swipe them away without comprehending their meaning or dismiss alarms while forgetting to take their medication.

Sub-Phase 10.2 delivers a dedicated, elder-first **Multi-Sensory Reminder UI** designed around four foundational principles:
1. **Full-Screen Dedicated Reminder Card**: A full-viewport, distraction-free card rendering high-contrast iconography (pill/mortar for medicine, brass lota for hydration), clear dosage text, and a familiar photo of the family member who recorded the reminder.
2. **Kinship Voice Auto-Playback with Waveform Animation**: Automatically plays the recorded voice of the grandchild or family caregiver upon display, accompanied by pulsating acoustic waveform visualizer bars that reassure the elder.
3. **Single-Tap Giant Confirmation ("মই খাইছো" / "I have taken it")**: A prominent, minimum 64px high-contrast touch target with tactile audio chime feedback that logs completion directly to the adherence ledger.
4. **Elder-Calibrated Snooze & Missed Safeguard**: A gentle "১৫ মিনিট পিছত" (15 Minutes Later) button with a visible 3-step progress badge. When the 3-snooze threshold is exceeded, the card gracefully transitions into an emergency reassuring display while simultaneously firing alerts to the caregiver portal and queueing an outbound IVR call.

---

## 2. Interaction Design & Component Specifications

### 2.1 Full-Screen Reminder Card Layout
```
+--------------------------------------------------------+
| [🎙️ Priyanka's Voice]                [⏰ 08:30 AM]    |
|                                                        |
|                 +------------------+                   |
|                 |   FAMILY PHOTO   |                   |
|                 |  (Granddaughter) |                   |
|                 +------------------+                   |
|                      Priyanka                          |
|                                                        |
|                 💊  [ CULTURAL ICON ]                   |
|                                                        |
|          পুৱাৰ ৰক্তচাপ আৰু স্মৃতিৰ ঔষধ                |
|      (Morning Blood Pressure & Donepezil)              |
|                                                        |
|     Dosage: ১টা বড়ি (Donepezil 5mg) আহাৰৰ পিছত        |
|                                                        |
|      [ |||||||||||||||||||||||||||||||||||||| ]        |
|       "দেউতা, সময় হৈছে! আপোনাৰ দৰবখিনি লওক..."        |
|                                                        |
|   +------------------------------------------------+   |
|   |         ✓ মই খাইছো (I Have Taken It)            |   |
|   +------------------------------------------------+   |
|                                                        |
|   +------------------------------------------------+   |
|   |    ⏰ ১৫ মিনিট পিছত সোঁৱৰাব (Snooze 15 Mins)     |   |
|   |                (সোঁৱৰণী: ১ / ৩)                 |   |
|   +------------------------------------------------+   |
+--------------------------------------------------------+
```

### 2.2 Multilingual Action Labels Across NER Languages
| Language | Single-Tap Confirmation | Snooze (15 Mins) | Escalation Notice |
|:---|:---|:---|:---|
| **Assamese (`as`)** | মই খাইছো / খোৱা হ'ল | ১৫ মিনিট পিছত সোঁৱৰাব | পৰিয়ালক জনোৱা হৈছে |
| **Bengali (`bn`)** | আমি খেয়েছি / নেওয়া হলো | ১৫ মিনিট পর মনে করিয়ে দাও | পরিবারকে জানানো হয়েছে |
| **Meitei (`mni`)** | ꯑꯩ ꯆꯥꯈ꯭ꯔꯦ | ꯃꯤꯅꯤꯠ ꯱꯵ ꯀꯣꯟꯅꯥ ꯅꯤꯡꯁꯤꯡꯕꯤꯌꯨ | ꯏꯃꯨꯡꯗꯥ ꯈꯪꯍꯜꯂꯦ |
| **Bodo (`brx`)** | आं जाबाय / लानाय जाबाय | १५ मिनिट उनाव गोसोखां हो | नख'रनो मिथिसारबाय |
| **Khasi (`kha`)** | Nga la bam / Nga la dih | Kynmaw biang hadien 15 minit | La pyntip sha ka iing |
| **Mizo (`lus`)** | Ka ei tawh e | Minute 15 hnuah min hrilh leh rawh | Chhungte hriattir an ni |
| **Hindi (`hi`)** | मैंने ले ली है | १५ मिनट बाद याद दिलाएं | परिवार को सूचित किया गया |
| **English (`en`)** | I have taken it | Remind me in 15 mins | Caregiver notified |

---

## 3. Audio & Waveform Visualization Specs
- **Synthesized / Family Audio Auto-Trigger**: Triggered via HTML5 Web Audio API using `playGentleChime()` preamble followed by speech audio streaming.
- **Waveform Animation**: 7 vertical bars pulsating with CSS keyframes dynamically reacting to audio playback state.
- **Safety Interlock**: If the elder does not interact within 90 seconds of audio completion, the system automatically registers the first 15-minute snooze.

---

## 4. Missed Reminder & Escalation Handling
1. **Snooze Counts 1 to 3**: The card dismisses, scheduling the next pop-up for $T + 15$, $T + 30$, and $T + 45$ minutes.
2. **Snooze Count 4 (Overdue)**:
   - Card displays reassuring notice: *"Don't worry, we've let Priyanka know to check in on you."*
   - Pushes priority payload to `/api/v1/reminders/snooze/{id}` triggering `MISSED_ESCALATED`.
   - Fires outbound IVR fallback queue to verify elder safety via phone.
