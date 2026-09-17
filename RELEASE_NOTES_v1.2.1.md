## Smriti (স্মৃতি) v1.2.1 — Natural Neural Voice & Direct Gemini AI

### 🌟 What's New in v1.2.1

#### 1. 🎙️ Natural Human/Neural Voice Synthesis Engine
- **Intelligent Voice Selection Engine**: Replaced generic system fallback voice with an intelligent multi-tier ranking engine that prioritizes **Google Neural/Wavenet**, **Microsoft Natural/Online**, and **Apple Enhanced/Siri** voices with gentle, motherly timbres.
- **Calibrated Geriatric Prosody**: Tuned playback speed to a soothing **0.88x** and pitch to a warm **1.04** for maximum acoustic comfort and comprehension for dementia patients.
- **Prosodic Breath Pauses**: Speech text pre-processor strips robotic symbols/emojis and automatically introduces gentle breath pauses at commas, full stops, and ellipsis.
- **Dedicated Voice Testing**: Caregivers can test the natural voice directly in the app at any time with a single tap.

#### 2. ⚡ Direct Client-Side Google Gemini 1.5 Flash Integration
- Direct HTTPS REST endpoint calls (`generativelanguage.googleapis.com`) directly from the client/Capacitor app.
- Resolves the issue where Next.js static export in Android APKs could not reach server-side API routes without a Node server.
- Supports multimodal audio streaming and conversational prompt completions.

#### 3. 🧠 12-Domain Multilingual Offline Clinical Brain
- Works 100% offline without any internet connection or API key.
- Covers 12 clinical geriatric domains across all 8 Northeast Indian languages (**Assamese, Bengali, Bodo, Hindi, Khasi, Manipuri/Meitei, Mizo, Indian English**):
  - Identity & Reassurance
  - Orientation & Home Location
  - Family & Loved Ones
  - Routine & Time Schedule
  - Medicine & Hydration
  - Fear & Agitation Comfort
  - Calming Northeast Folklore & Stories
  - Games & Cognitive Exercises
  - Tea & Nourishment
  - Bedtime & Rest
  - Warm Greetings & Elder Reverence
  - Multilingual Geriatric Validation

#### 4. ⚙️ Caregiver AI & Voice Settings Modal
- Accessible via the ⚙️ gear button in the Voice Assistant header.
- Status indicator displays active mode: `⚡ Gemini 1.5 Flash (Live AI)` vs `🟢 Smriti Clinical AI (100% Offline)`.
- Allows caregivers to securely save or clear a custom Google Gemini API Key on-device.

---

### 📦 Included Artifacts
- **Android APK**: `smriti-ner-v1.2.1.apk` (Compiled with Capacitor & Gradle Debug)
