# Smriti-NER (স্মৃতি) — Sub-Phase 17.2 Specification
## Field Support Network, District Champions & Device Maintenance SOPs

**Problem Statement**: 26003 (MDoNER & Smart India Hackathon 2026)  
**Phase**: 17 (ASHA Worker Training at Scale 🎓)  
**Duration**: Weeks 58–71  
**Primary Outcome**: Frontline Decentralized Support Network (30 District Champions), 3-Tier Escalation Protocol, and Monsoonal Device Maintenance Guide  
**Quality Framework**: ITIL v4 Service Management for Decentralized Public Health  

---

### 1. Architectural Scope & Support Ecosystem

Rural frontline field workers operating across remote mountainous and riverine terrains require instantaneous peer-led technical assistance. Sub-Phase 17.2 operationalizes an agile 3-tier field support model:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 PAN-NER 3-TIER FRONTLINE SUPPORT ARCHITECTURE               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
     ┌─────────────────────────────────┼─────────────────────────────────┐
     ▼                                 ▼                                 ▼
┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│ TIER 1: PEER & LOCAL    │ │ TIER 2: DISTRICT TECH   │ │ TIER 3: CENTRAL HELP    │
│ Sub-Centre / WhatsApp   │ │ 2 Champions / District  │ │ Engineering Desk GHY    │
├─────────────────────────┤ ├─────────────────────────┤ ├─────────────────────────┤
│• Response: <15 Minutes  │ │• Response: <2 Hours     │ │• Resolution: <6 Hours   │
│• Local Language Chat    │ │• Spare Tablet Swaps     │ │• Hardware Replacement   │
│• Minor Glitch Recovery  │ │• BLE Mesh Re-pairing    │ │• Kernel / OTA Patches   │
└────────────┬────────────┘ └────────────┬────────────┘ └────────────┬────────────┘
             │                           │                           │
             └───────────────────────────┼───────────────────────────┘
                                         ▼
          ┌───────────────────────────────────────────────────────────┐
          │  30 CERTIFIED DISTRICT TECHNICAL CHAMPIONS (15 DISTRICTS)  │
          │  Zero Device Downtime Guarantee (<1.8h Mean Resolution)   │
          ├───────────────────────────────────────────────────────────┤
          │  MONSOONAL & HIGH-ALTITUDE HARDWARE MAINTENANCE SOPs      │
          │  Silica Gel Pouches | Kiosk Recovery PINs | Cold Banking  │
          └───────────────────────────────────────────────────────────┘
```

---

### 2. District-Level Technical Champions Roster (15 Districts, 30 Champions)

Each district HQ pairs two tech-savvy senior ASHAs certified in hardware triage, battery preservation, and telephonic diagnostics:
- **Kamrup Metro (AS)**: Pranita Das & Anjana Saikia
- **Cachar (AS)**: Rupa Paul & Manju Singha
- **Sonitpur (AS)**: Rekha Borah & Mina Chetri
- **Kokrajhar (AS)**: Bimala Brahma & Joymati Basumatary
- **East Khasi Hills (ML)**: Iada Nongrum & Phidalia Kharbhih
- **West Garo Hills (ML)**: Silme Sangma & Tening Marak
- **Imphal West (MN)**: Thourani Devi & Memcha Leima
- **Churachandpur (MN)**: Grace Chinghoih & Niangthiankim
- **West Tripura (TR)**: Anita Debbarma & Swapna Roy
- **Gomati (TR)**: Jayanti Tripura & Bina Bhowmik
- **Papum Pare (AR)**: Yaba Nabam & Koj Rinya
- **Tawang (AR)**: Lhamo Monpa & Tenzin Chodon
- **Kohima (NL)**: Viphretuonuo Angami & Kevisenuo Kire
- **Dimapur (NL)**: Arenla Ao & Sentila Jamir
- **Aizawl & Gangtok (MZ/SK)**: Lalmuanpuii & Dawa Lhamu Lepcha

---

### 3. Tri-Tier Incident Escalation Protocol

1. **Level 1 (Sub-Centre / Village)**:
   - Channel: Regional ASHA WhatsApp Community.
   - Target Response: $< 15\text{ minutes}$.
   - Scope: PIN re-entry, volume booster check, icon re-focusing, screen cleaning.
2. **Level 2 (District HQ)**:
   - Channel: Direct calling to designated District Technical Champion.
   - Target Resolution: $< 2\text{ hours}$.
   - Scope: Bluetooth mesh pairing, SQLite offline database corruption repair, temporary spare tablet deployment.
3. **Level 3 (Central MDoNER Engineering Hub)**:
   - Channel: Toll-free escalation ticket via `1800-890-SMRITI`.
   - Target Replacement: $< 6\text{ hours}$ (motorcycle / boat courier spare dispatch).
   - Scope: Physical motherboard fault, cracked digitizer, kernel-level OTA patch.

---

### 4. Monsoonal & Alpine Device Maintenance SOP

- **Waterproofing**: Dual-layer silicone shock sleeves + IP68 dry ziplock bags with reusable color-indicating silica gel packs.
- **Cold-Temperature Battery Management**: In high-altitude zones ($> 2,000\text{m}$ such as Tawang, Sikkim), tablets must be warmed inside insulated thermal pouches before booting to prevent voltage drops.
- **Solar Micro-Charging Protocols**: Mandatory daily topping to $80\%$ during afternoon solar hours; deep discharge below $15\%$ strictly avoided to prolong lithium-polymer battery life.
