# Smriti-NER (স্মৃতি): Sub-Phase 6.1 — Bhashini (AI4Bharat) Voice Integration Specification
**Document ID**: `SPEC-AI-VOICE-061`  
**Version**: `1.0.0`  
**Status**: `APPROVED`  
**Target Milestone**: `M6 (Multilingual Voice System Operational)`  
**Statutory Standards**: Bhashini ULCA v1.5, MeitY Indic Language Technology 2025, WCAG 2.2 AAA Audio Guidelines

---

## 1. Executive Summary & Clinical Rationale

Elderly individuals suffering from Mild Cognitive Impairment (MCI) and early-to-mid stage dementia frequently develop **presbycusis** (age-related high-frequency sensorineural hearing loss) combined with decreased **central auditory processing velocity**. Text-only interfaces cause rapid cognitive fatigue, while standard fast-paced commercial text-to-speech (TTS) engines generate severe comprehension failures.

Sub-Phase 6.1 operationalizes the **Voice-First Interaction Layer** for Smriti-NER across all **8 official North Eastern languages**:
1. **Assamese (`as`)** — অসমীয়া
2. **Meitei / Manipuri (`mni`)** — ꯃꯤꯇꯩꯂꯣꯟ (Meitei Mayek & Bengali script)
3. **Bengali (`bn`)** — বাংলা (Barak Valley & Tripura dialects)
4. **Bodo (`brx`)** — बड़ो (Devanagari script)
5. **Khasi (`kha`)** — Ka Ktien Khasi (Latin script)
6. **Mizo (`lus`)** — Mizo ṭawng (Latin script)
7. **Hindi (`hi`)** — हिन्दी (Regional NER lingua franca)
8. **English (`en`)** — English (NER official/administrative)

The system integrates **Project Bhashini (AI4Bharat Indic-TTS & Indic-ASR)** with an offline-first **3-Tier Resilient Speech Architecture** that guarantees zero disruption in off-grid tribal villages.

```
┌─────────────────────────────────────────────────────────────────────────┐
│              SMRITI-NER 3-TIER VOICE ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
               ┌───────────────────┴───────────────────┐
               ▼                                       ▼
    [SPEECH SYNTHESIS (TTS)]              [KEYWORD SPOTTING (ASR)]
               │                                       │
     ┌─────────┴─────────┐                   ┌─────────┴─────────┐
     │ TIER 1:           │                   │ TIER 1:           │
     │ Cloud Bhashini    │ (Online, 4G/WiFi) │ On-Device KWS     │ (<500ms Local)
     │ Indic-TTS API     │                   │ Web Speech API    │
     └─────────┬─────────┘                   └─────────┬─────────┘
               │ (Network Drop)                        │
     ┌─────────┴─────────┐                   ┌─────────┴─────────┐
     │ TIER 2:           │                   │ TIER 2:           │
     │ On-Device Web     │ (Standard Native) │ Phonetic Distance │ (Fuzzy Levenshtein
     │ Speech API        │                   │ Soundex Matcher   │  Soundex Match)
     └─────────┬─────────┘                   └─────────┬─────────┘
               │ (No Speech Engine)                    │
     ┌─────────┴─────────┐                   ┌─────────┴─────────┐
     │ TIER 3:           │                   │ TIER 3:           │
     │ Local Parametric  │ (Offline Fallback,│ Cloud Bhashini    │ (Complex Sentence
     │ Audio Synthesizer │  Zero Network)    │ Indic-ASR API     │  Transcription)
     └───────────────────┘                   └───────────────────┘
```

---

## 2. Bhashini ULCA API Schema & Configuration

### 2.1 Credentials & Configuration Model
The service interacts with Bhashini via standard ULCA inference endpoints:
- **Inference Pipeline URL**: `https://dhruva-api.bhashini.gov.in/services/inference/pipeline`
- **Config Header**: `Authorization: Bearer <BHASHINI_API_KEY>`
- **User Header**: `userID: <BHASHINI_USER_ID>`
- **ULCA Pipeline Task Types**: `tts` (Text-to-Speech), `asr` (Automated Speech Recognition)

### 2.2 Supported 8-Language Matrix & Pipeline Mappings

| Language Code | Language Name | Script Code | Bhashini TTS Model ID | Bhashini ASR Model ID | Presbycusis Speed Factor |
|:---:|:---|:---:|:---|:---|:---:|
| `as` | Assamese (অসমীয়া) | `Beng` | `ai4bharat/indic-tts-as` | `ai4bharat/conformer-as` | `0.85x` (112 WPM) |
| `mni` | Meitei (ꯃꯤꯇꯩꯂꯣꯟ) | `Mtei` / `Beng` | `ai4bharat/indic-tts-mni` | `ai4bharat/conformer-mni` | `0.85x` (110 WPM) |
| `bn` | Bengali (বাংলা) | `Beng` | `ai4bharat/indic-tts-bn` | `ai4bharat/conformer-bn` | `0.88x` (115 WPM) |
| `brx` | Bodo (बड़ो) | `Deva` | `ai4bharat/indic-tts-brx` | `ai4bharat/conformer-brx` | `0.85x` (110 WPM) |
| `kha` | Khasi | `Latn` | `ai4bharat/indic-tts-kha` | `ai4bharat/conformer-kha` | `0.88x` (118 WPM) |
| `lus` | Mizo | `Latn` | `ai4bharat/indic-tts-lus` | `ai4bharat/conformer-lus` | `0.88x` (115 WPM) |
| `hi` | Hindi (हिन्दी) | `Deva` | `ai4bharat/indic-tts-hi` | `ai4bharat/conformer-hi` | `0.90x` (120 WPM) |
| `en` | English (Indian) | `Latn` | `ai4bharat/indic-tts-en` | `ai4bharat/conformer-en` | `0.90x` (125 WPM) |

---

## 3. On-Device Keyword Spotting (ASR) Lexicon

To provide instant, low-cognitive-burden interaction without requiring elder fine motor dexterity, the on-device keyword recognizer detects **6 essential command intents** across all 8 languages in **< 500 ms**:

```
Intents = { HELP, REPEAT, LISTEN, YES, BACK, NEXT }
```

### 3.1 8-Language Lexicon & Phonetic Clusters

| Intent | Assamese (`as`) | Meitei (`mni`) | Bengali (`bn`) | Bodo (`brx`) | Khasi (`kha`) | Mizo (`lus`) | Hindi (`hi`) | English (`en`) |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| **HELP** | সহায় (`xohay`) | ꯃꯇꯦꯡ (`mateng`) | সাহায্য (`sahajjo`) | हेफाजाब (`hefajab`) | iar / yar | puihna / tanpui | मदद (`madad`) | help |
| **REPEAT** | পুনৰ কওক (`punor`) | ꯑꯃꯨꯛ ꯍꯥꯌꯕꯤꯌꯨ | আবার বলুন (`aabar`) | फिन बुं (`fin bung`) | pynphai / biang | sawh nawn | फिर से (`phir se`) | repeat |
| **LISTEN** | শুনক (`xunok`) | ꯇꯥꯕꯤꯌꯨ (`tabiyu`) | শুনুন (`shunun`) | खोनास सं (`khonas`) | sngap | ngaithla | सुनिए (`suniye`) | listen |
| **YES** | হয় (`hoy`) | ꯍꯣꯌ (`hoy`) | হ্যাঁ (`ha`) | औ (`ou`) | hooid / em | aw / ni e | हाँ (`haan`) | yes |
| **BACK** | পিছলৈ (`picholoi`) | ꯍꯟꯖꯤꯅꯕꯥ (`hanjinba`)| পেছনে (`pechone`) | उनथिं (`unthing`) | phai dien | kir / hnung lam | पीछे (`peeche`) | back |
| **NEXT** | আগলৈ (`agoloi`) | ꯃꯈꯥ ꯇꯥꯅꯥ (`makha`) | পরবর্তী (`poroborti`)| गांहाव (`ganghao`) | sha khmat | kal leh / hma lam | आगे (`aage`) | next |

### 3.2 Low-Latency Phonetic Fuzzy Matcher
When the Web Speech API returns imperfect regional acoustic transcripts (e.g., `"xunuk"` instead of `"xunok"` or `"matengba"` instead of `"mateng"`), the engine executes normalized Levenshtein-Damerau distance:
$$\text{Sim}(s_1, s_2) = 1.0 - \frac{\text{Distance}(s_1, s_2)}{\max(|s_1|, |s_2|)}$$
Matches with $\text{Sim} \ge 0.72$ trigger the command intent instantly without prompting the elder to repeat themselves.

---

## 4. Fallback TTS Engine & Presbycusis Tuning

### 4.1 Geriatric Acoustic Tuning Profile
1. **Prosody Deceleration**: Speech rate set to $0.85\times$ to accommodate prolonged auditory temporal processing windows in MCI.
2. **Fundamental Frequency ($F_0$) Shift**: Female voice set to $210\,\text{Hz}$; male voice set to $145\,\text{Hz}$ to stay below the $3000\,\text{Hz}$ high-frequency drop-off characteristic of presbycusis.
3. **Inter-Phrase Pausing**: Injects an explicit $350\,\text{ms}$ silence between clauses to allow memory consolidation.

### 4.2 Offline Parametric Speech Synthesizer
When offline and the host device lacks regional Web Speech voices, the engine:
- Generates speech cadence envelopes via Web Audio oscillator formants.
- Emits soft melodic acoustic notification patterns (consonant-vowel formant approximations) paired with visually highlighted text so the user never experiences interface deadlocks.

---

## 5. Performance & Resource Benchmarks

| Metric | Target Specification |
|:---|:---|
| Keyword Spotting Latency | < 500 ms (Average ~180 ms on edge) |
| Bhashini Cloud TTS API Call | < 1200 ms on 4G; cached < 10 ms |
| Web Speech API Fallback Initialization | < 40 ms |
| Local Audio Cache Hit Ratio | > 85% on recurring gameplay phrases |
| Memory Footprint | < 1.2 MB |

---

## 6. Implementation Deliverables

- [x] Bhashini Configuration & Credential Schema (`smriti-ner/src/lib/bhashiniVoiceService.ts`)
- [x] 8-Language Indic-TTS Service Wrapper with 3-Tier Fallback (`smriti-ner/src/lib/bhashiniVoiceService.ts`)
- [x] On-Device Keyword Spotting Module with Phonetic Fuzzy Matching (`smriti-ner/src/lib/bhashiniVoiceService.ts`)
- [x] Backend FastAPI Proxy Endpoints (`server/main.py`)
- [x] Monorepo Python Validation Suite (`tests/test_bhashini_voice.py`)
