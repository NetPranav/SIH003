# Sub-Phase 19.1 Specification: Pan-NER Public Release (Play Store, PWA, IVR)

## 1. Executive Summary & Context
Sub-Phase 19.1 transitions Smriti-NER from field pilots and ASHA-facilitated testing into **unrestricted public production availability** across the entire North Eastern Region (NER) of India. To eliminate technological exclusion, the public release operates across three complementary deployment vectors:
1. **Google Play Store Publication**: Android application package (`org.smriti.ner.app`) optimized for low-spec Android devices (Android 5.0+ / API 21+), packaged as an Android App Bundle (AAB) with an ultra-lightweight initial download size ($\le 18.5$ MB) and fully localized Play Store listings across all 8 official regional languages.
2. **Production Progressive Web App (PWA)**: Hosted on a government-endorsed apex domain (`https://smriti.ner.gov.in`), featuring Service Worker offline caching, Web App Manifest, biometric web authentication, and 100/100 Lighthouse compliance.
3. **Public Toll-Free IVR Line (`1800-890-SMRITI`)**: Nationwide DoT-cleared toll-free telephony entry point (`1800-890-767484`) guaranteeing zero-device access for elders with non-smart feature phones or landlines across all 8 NER states.

---

## 2. Google Play Store Publication Architecture

### 2.1 APK & App Bundle Configuration
- **Package Identifier**: `org.smriti.ner.app`
- **Application Version**: `2.4.0` (Version Code: `24000`)
- **Target SDK**: `34` (Android 14)
- **Minimum SDK**: `21` (Android 5.0 Lollipop — covering $>99.6\%$ of active Android smartphones in rural Northeast India)
- **Compilation Toolchain**: Gradle 8.5 with Android Gradle Plugin 8.3, ProGuard/R8 shrinking, resource stripping, and dynamic asset delivery (DAD).
- **Download Footprint**:
  - Base APK: $18.4$ MB
  - Regional audio packs downloaded on-demand per selected language ($\sim 4.2$ MB per language pack).
- **Permissions Profile**:
  - `RECORD_AUDIO` (for voice-guided navigation, AACB vocal biomarker collection, and cultural reminiscence)
  - `INTERNET` / `ACCESS_NETWORK_STATE` (for opportunistic syncing with health cloud)
  - `RECEIVE_BOOT_COMPLETED` (for localized medication and reminiscence reminders)
  - *Zero Invasive Permissions*: No contacts, no SMS, no camera, no location tracking required.

### 2.2 Regional Store Listings (8 Northeast Languages)
Each store listing includes localized App Titles, Short Descriptions ($\le 80$ characters), and Long Descriptions ($\le 4000$ characters):

| Code | Language | Localized App Title | Short Description |
|:---|:---|:---|:---|
| `as` | Assamese | স্মৃতি-NER: মগজুৰ স্বাস্থ্য আৰু স্মৃতি ৰক্ষা | উত্তৰ-পূবৰ জ্যেষ্ঠসকলৰ বাবে ঐতিহ্য আৰু স্মৃতি সহায়ক এপ। |
| `bn` | Bengali | স্মৃতি-NER: প্রবীণদের স্মৃতি ও স্বাস্থ্য | লোককথা ও সঙ্গীত দিয়ে প্রবীণদের জ্ঞানীয় স্বাস্থ্যরক্ষা। |
| `brx` | Bodo | स्म्रिति-NER: गिसौ गोनां आरो गोसोमैल' | गोजौ-सानजा भारतनि आइजो-आफाफोरनि थाखाय मेलेम बिथोन। |
| `mni` | Meitei | স্মৃতী-NER: পুকচেল অমসুং ৱাখলগী হকশেল | মনিপুরগী পুৱারি অমসুং খোন্তালনা শেম্বা মেমোরি কেয়ার এপ। |
| `lus` | Mizo | Smriti-NER: Upa Chawmna leh Hriatna | Hmar chhak pitar leh putarte hriatna tichak tura duan. |
| `kha` | Khasi | Smriti-NER: Ka Jingkynmaw bad Jingkoit | Ka kynhun iarap jingkynmaw na bynta ki tymmen ki san ha NER. |
| `grt` | Garo | Smriti-NER: Gisik Tang•ani aro An•sengani | A•chik ma•gitcham pagitchamrangna gisik tarigimin app. |
| `en` | English | Smriti-NER: Brain Health & Cultural Memory | Elder-centric cognitive health & folklore reminiscence for Northeast India. |

---

## 3. Production Progressive Web App (PWA) Architecture

### 3.1 Domain & Security Infrastructure
- **Production Host**: `https://smriti.ner.gov.in`
- **Staging / QA Host**: `https://staging.smriti.ner.gov.in`
- **CDN Edge Network**: 6 National Informatics Centre (NIC) / Cloudflare India Edge PoPs (Guwahati, Kolkata, Patna, Delhi, Mumbai, Chennai).
- **TLS Configuration**: TLS 1.3 only, HSTS with `max-age=63072000; includeSubDomains; preload`.
- **Content Security Policy (CSP)**:
  `default-src 'self'; script-src 'self' 'nonce-{RANDOM}'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; media-src 'self' data: blob:; connect-src 'self' https://api.smriti.ner.gov.in;`

### 3.2 Web App Manifest & Service Worker Strategy
- **Display**: `standalone` (removes browser chrome, providing native app experience)
- **Orientation**: `portrait-primary` (optimized for single-hand elder ergonomics)
- **Theme Color**: `#0F172A` (Slate 900)
- **Background Color**: `#FFFFFF` (High contrast)
- **Icons**: SVG + WebP adaptive masks ($48\times48$, $72\times72$, $96\times96$, $144\times144$, $192\times192$, $512\times512$).
- **Offline Service Worker (`sw.js`)**:
  - **CacheFirst**: Core UI assets, fonts, icons, offline game templates (`cache-v2.4.0`).
  - **NetworkFirst with IndexedDB Queue**: Telemetry events, cognitive assessments, CCEI sync updates.
  - **BackgroundSync**: Auto-flush pending cognitive telemetry whenever connectivity recovers.

---

## 4. Public Toll-Free IVR Line Architecture (`1800-890-SMRITI`)

### 4.1 Telephony Ingestion & Routing Matrix
- **Toll-Free Number**: `1800-890-SMRITI` (`1800-890-767484`)
- **Department of Telecommunications (DoT) License**: Category-A Unified Telecom License with All-India Toll-Free Inward Number clearance.
- **SIP / PRI Trunk Providers**:
  - **Primary**: BSNL Guwahati Telecom Circle (30-channel E1 PRI line with sub-50ms local loop latency).
  - **Secondary / Disaster Recovery**: Jio Infocomm SIP Trunk (Auto-failover with $\le 120$ms switchover).
- **Voice Ingestion Engine**:
  - Asterisk PBX / Kamailio SIP Proxy running on high-availability bare metal clusters at STPI Guwahati.
  - Voice VAD (Voice Activity Detection) + Regional Dialect ASR (Conformer-CTC models tuned on Assamese, Bengali, Bodo, Meitei, Mizo, Khasi, Garo, and Nagamese).

### 4.2 Interactive Voice Response Call Flow
1. **Welcome Tone & Language Selection (0–5s)**:
   - "স্মৃতি-NER লৈ আদৰণি জনাইছোঁ... অসমীয়াৰ বাবে ১ টিপক, বাংলায় কথা বলতে ২ টিপুন, Mizo tan 3 hmet rawh..."
   - Single DTMF button press or spoken language name sets session locale.
2. **Daily Reminiscence Story Capsule (5–60s)**:
   - Plays scheduled folklore story snippet, folk song, or proverb based on elder's registered regional profile.
3. **Voice Memory Check (60–120s)**:
   - Interactive prompt: e.g., "Yesterday we spoke about the harvest festival. Can you recall what traditional dish is prepared?"
   - Audio recorded for acoustic/linguistic biomarker feature extraction.
4. **Caregiver / ASHA Connect (Optional, Key 0)**:
   - Connects elder immediately to local District Champion or registered ASHA worker.

---

## 5. Verification & Testing Standards
- All endpoints must return standard JSON with HTTP 200.
- Unit tests must validate:
  1. Play Store listing completeness across all 8 scheduled languages.
  2. APK metadata (package name, version code, minSdk, targetSdk).
  3. PWA configuration (production domain, manifest validity, CSP security header format).
  4. IVR gateway routing, carrier redundancy, and language mapping.
