# 🏥 ASHA / ANM HEALTHCARE WORKER & RURAL CAREGIVER FIELD MANUAL

**Standard Operating Procedure (SOP) & Clinical Protocol**  
**Project**: Smriti-NER (স্মৃতি / ꯁ꯭ꯃ꯭ꯔꯤꯇꯤ)  
**Target Audience**: Accredited Social Health Activists (ASHA), Auxiliary Nurse Midwives (ANM), Community Health Officers (CHOs) at Ayushman Arogya Mandirs / Sub-Centres, and Rural Family Caregivers across the 8 North Eastern States  
**Endorsed For**: Ministry of Development of North Eastern Region (MDoNER) & National Health Mission (NHM) Rollout  

---

## 1. Introduction & Operational Objective

In the hilly terrains, river valleys, and tribal villages of North East India, the **ASHA (Accredited Social Health Activist)** and **ANM (Auxiliary Nurse Midwife)** are the primary pillars of healthcare. With tertiary neurological care situated far away in state capitals, grassroot community health workers bear the responsibility of early detection, continuous monitoring, and caregiver counseling for age-related dementia and memory decline.

This manual provides a practical, field-tested Standard Operating Procedure (SOP) for:
1. Installing, configuring, and initializing Smriti-NER on budget Android tablets or household smartphones.
2. Conducting compassionate, culturally rooted cognitive sessions with elderly dementia patients.
3. Recording personalized family voice notes to guarantee medicine and hydration compliance.
4. Performing peer-to-peer **offline delta data harvesting** in habitations lacking cellular coverage.
5. Interpreting clinical alerts on the Caregiver & ASHA Telemetry Dashboard.

---

## 2. Pre-Deployment Setup & Device Preparation SOP

### 2.1 Hardware Requirements
* **Supported Devices**: Any entry-level Android tablet or smartphone running Android 7.0 (Nougat) or above.
* **RAM**: Minimum 2 GB (Optimized for Android Go Edition).
* **Storage**: Minimum 250 MB free internal storage.
* **Audio**: Functional external speaker and internal microphone.

### 2.2 First-Time Installation & Offline Asset Pre-Caching
*(To be completed by the ASHA Worker or Community Health Officer at the Primary Health Centre / Block PHC where Wi-Fi or 4G is available)*

1. **Application Download**:
   * Install the Smriti-NER APK or add the Progressive Web App (PWA) to the tablet home screen.
2. **Language Pack Download**:
   * Open **Settings ➔ Regional Language Cache**.
   * Select the primary language of the target village:
     * **Assamese (অসমীয়া)**
     * **Meitei / Manipuri (মৈতৈলোন্)**
     * **Bengali (বাংলা)**
     * **Bodo (বড়ো)**
     * **Khasi (কা ক্তিয়েন খাসি)**
     * **Mizo (Mizo ṭawng)**
     * **Hindi / English**
   * Tap **"Download Complete Regional Pack"** (Compressed size: ~18 MB).
3. **Verify Zero-Connectivity Mode**:
   * Switch the tablet into **Airplane Mode**.
   * Launch Smriti-NER and verify that all 4 games, audio synthesizers, and voice prompts function cleanly without network errors.

---

## 3. Patient Onboarding & Baseline Configuration Protocol

During the first home visit to the elder's residence, complete the following steps in the presence of the primary family caregiver (son, daughter, daughter-in-law, or spouse).

```
+-------------------------------------------------------------------------+
|                  4-STEP ONBOARDING PROTOCOL IN VILLAGE                  |
+-------------------------------------------------------------------------+
|  STEP 1: PATIENT PROFILE & ABHA REGISTRATION                            |
|          Enter Name, Village, Age, Primary Dialect, ABHA ID             |
|                                   │                                     |
|  STEP 2: 60-SECOND MOTOR TOUCH CALIBRATION                              |
|          Patient taps 3 large flower targets to calibrate tremor        |
|                                   │                                     |
|  STEP 3: RECORD 3 PERSONALIZED FAMILY VOICE PROMPTS                     |
|          Grandchild/Son records Medicine, Water, and Orientation clips  |
|                                   │                                     |
|  STEP 4: INTRODUCTORY REMINISCENCE PLAY                                 |
|          Introduce "Dhol-Pepa Sur-Milon" to build trust and smile       |
+-------------------------------------------------------------------------+
```

### 3.1 Step 1: Patient Profile & Health Identity
* Open **Caregiver Portal ➔ Add New Patient**.
* Enter Patient Name, Village/Gram Panchayat, and Age.
* If the patient possesses an **Ayushman Bharat Health Account (ABHA)** Card, scan the QR code to link the 14-digit ABHA ID.

### 3.2 Step 2: Motor Tremor Calibration
* Dementia and aging frequently introduce physical tremors or arthritic hesitation.
* Launch the **"Calibration Flower"** screen.
* Ask the elder: *"Aita, please touch the golden Marigold flower on the screen."*
* The elder touches 3 large icons. The engine automatically measures baseline tap displacement and calculates the **Motor Tremor Offset ($\delta_{baseline}$)** so that physical tremor is never penalized as cognitive failure.

### 3.3 Step 3: Recording Family Voice Prompts
* Hand the device to the patient's grandchild, son, or daughter.
* Tap **Record Voice Reminder**:
  * **Clip 1 (Medicine)**: *"Deuta, it is 8:30 in the morning. Rahul here. Please take your small green tablet with lukewarm water."*
  * **Clip 2 (Hydration)**: *"Aita, your granddaughter Prerana says drink a cup of fresh water right now!"*
  * **Clip 3 (Evening Reassurance)**: *"Ma, you are safe at home in our house. The evening prayers are starting. Relax."*
* Attach a clear photograph of the family member to each reminder.

---

## 4. Routine ASHA Home Visit Protocol (Bi-Weekly SOP)

When visiting an elderly dementia patient during routine village rounds, follow this 15-minute standard protocol:

### Step 1: Observational Greeting & Mental State Check (2 Minutes)
* Greet the elder warmly in their mother tongue.
* Observe physical state: Are they well-groomed? Are they agitated? Do they recognize the ASHA worker?

### Step 2: Guided Cognitive Reminiscence Session (8 Minutes)
* Hand the tablet to the elder in **"আইতা / ককা Mode"**.
* Select a game aligned with their life history:
  * If the elder worked in farming/music: Open **"Dhol-Pepa Sur-Milon"**.
  * If the elder was a traditional weaver: Open **"Weaver’s Loom"**.
  * If the elder loves nature and folklore: Open **"Kaziranga Safari"**.
* **Crucial Care Rule**: Allow the elder to explore at their own pace. **Do not point or touch the screen for them.** Let the Anti-Agitation Circuit Breaker provide cues if they make two mistakes.
* Praise their participation enthusiastically: *"বৰ সুন্দৰ হৈছে!"* ("Very well done!").

### Step 3: Peer-to-Peer Offline Data Sync (2 Minutes)
In habitations without mobile internet:
1. On the patient's household phone/tablet, tap **Settings ➔ ASHA Peer Sync**.
2. On your official ASHA tablet, tap **Harvest Village Telemetry**.
3. The devices establish a local Bluetooth / Wi-Fi Direct connection.
4. The encrypted delta packet (< 50 KB) transfers in **less than 4 seconds**.
5. When you return to the Block PHC or an area with mobile tower coverage, your ASHA tablet automatically syncs all collected village records to the State Health Registry.

### Step 4: Caregiver Counseling & Adherence Audit (3 Minutes)
* Open the **Caregiver Dashboard**:
  * Check the **Pill Adherence Rate**: If below 80%, investigate whether medicine supplies have run out or if the elder refused them.
  * Check the **30-Day MMSE Trajectory**: Is the line stable, or is there a sharp downward drop?
  * Check **Sundowning Alerts**: If the dashboard flags evening agitation, advise the family on environmental adjustments (bright lighting, calm music, avoiding caffeine in the afternoon).

---

## 5. Clinical Alert Interpretation Guide for ASHA Workers

| Dashboard Metric / Alert | Visual Indicator | Clinical Meaning | Recommended Action for ASHA Worker |
| :--- | :--- | :--- | :--- |
| **MMSE Proxy Drop > 3 Points** | ⚠️ Red Downward Trendline | Significant acute cognitive decline over the past 14 days. | Screen for urinary tract infections (UTIs), silent stroke, dehydration, or medication toxicity. Escalate to PHC Medical Officer for clinical review. |
| **Sundowning Anomaly Flag** | 🌙 Orange Crescent Alert | Patient exhibiting erratic interaction or repeated confusion between 4 PM and 7 PM. | Advise family to keep the living room well lit before sunset, close curtains to prevent shadows, play soothing folk melodies, and avoid loud television. |
| **Motor Latency Spikes (RT > 8s)** | ⏳ Blue Latency Marker | Physical finger movement or deliberation is severely slowed down. | Check for exacerbation of Parkinsonism, joint stiffness, or general physical fatigue. |
| **Pill Adherence < 70%** | 💊 Red Pill Badge | Repeated missed doses of essential neurological or cardiovascular medicines. | Verify medicine stock at home. Ensure the familiar voice alarm volume is loud enough and that a family member assists during pill administration. |

---

## 6. Managing Dementia Agitation: Best Practices

Dementia is a sensitive neurological condition. If an elder displays resistance, frustration, or fear:

1. **Never Argue or Contradict**: If an elder insists that their long-deceased parent is waiting for them, never argue. Redirect gently: *"Yes, tell me more about your mother's village while we look at these weaver patterns."*
2. **Never Force Device Interaction**: If the elder pushes the tablet away, immediately put it aside. Do not insist. Try again on your next visit.
3. **Use the Voice Assistant**: If the elder cannot read the screen, press the large green speaker button. The familiar regional voice will narrate instructions soothingly.
4. **Leverage the Reminiscence Photo Album**: If the elder is agitated, open the photo album and show pictures of their ancestral home or family members with recorded audio stories to restore calm.

---

## 7. Low-Connectivity & Technical Troubleshooting FAQ

### Q1: The village has had zero mobile network for 3 weeks. Will the app lose patient data?
* **Answer**: **No.** All game scores, reaction times, and medication checkmarks are stored locally in the tablet's encrypted internal database. The device can store up to **2 years of daily records completely offline** without data loss. Data will synchronize automatically whenever connectivity is restored or when harvested by the ASHA tablet.

### Q2: What if the family does not own a smartphone or tablet?
* **Answer**: The ASHA worker can bring their official NHM tablet during bi-weekly village visits, allowing the elder to complete their 10-minute cognitive session on the ASHA tablet itself. The app supports multi-patient switching with unique ABHA profiles.

### Q3: An elder has severe cataracts and cannot see small details. How to help?
* **Answer**: Enable **"Maximum Contrast & Audio-First Mode"** in Accessibility settings. This switches the background to high-contrast deep black with vibrant amber borders, enlarges icons by 40%, and automatically narrates every on-screen item aloud via Bhashini TTS.

### Q4: The elder’s native dialect is a local tribal variation. Will they understand the voice?
* **Answer**: The system allows family members to record custom audio prompts in their exact village dialect. If standard Assamese or Meitei is unfamiliar, use the Caregiver Portal to record instructions in the exact dialect spoken at home.

---

## 8. Emergency Escalation Contacts (NER Health Directory)

* **Emergency Ambulance Service**: 108
* **National Elder Helpline (Ministry of Social Justice & Empowerment)**: 14567
* **Tele-MANAS Mental Health Helpline**: 14416 / 1800-891-4416
* **ARDSI Dementia Helpline**: +91-9846198471 / +91-9846198473
