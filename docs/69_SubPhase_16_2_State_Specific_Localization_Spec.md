# Smriti-NER (স্মৃতি) — Sub-Phase 16.2 Specification
## State-Specific Localization & Deep Cultural Content Packs (8 States)

**Problem Statement**: 26003 (MDoNER & Smart India Hackathon 2026)  
**Phase**: 16 (Multi-State Expansion 📈)  
**Duration**: Weeks 58–74  
**Primary Outcome**: Deep Linguistic & Cultural Localization for all 8 NER States (Khasi, Mizo, Bodo, Meitei, Assamese, Bengali, Nepali, Nagamese)  
**Quality Standard**: ISO 17100:2015 Translation Services & Regional Cultural Advisory Board Sign-Off  

---

### 1. Architectural Scope & Multilingual Matrix

Smriti-NER provides immersive, native-tongue cognitive stimulation by anchoring clinical assessments in authentic regional traditions, folklore, and sensory assets. Sub-Phase 16.2 formalizes deep localization across all eight North-Eastern states:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 PAN-NER MULTI-STATE LOCALIZATION ENGINE (8 STATES)          │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
     ┌──────────────┬──────────────┬───┴──────────┬──────────────┬─────────────┐
     ▼              ▼              ▼              ▼              ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  ASSAM   │  │MEGHALAYA │  │ MANIPUR  │   │ TRIPURA  │   │ARUNACHAL │   │ NAGALAND │
│  (as/bn) │  │(kha/grx) │  │  (mni)   │   │(bn/trp)  │   │ (ny/mon) │   │ (nag/ao) │
├──────────┤  ├──────────┤  ├──────────┤   ├──────────┤   ├──────────┤   ├──────────┤
│• Bihu    │  │• Suk Myn │  │• Lai Har │   │• Garia   │   │• Losar   │   │• Hornbill│
│• Dhol    │  │• Duitara │  │• Pena    │   │• Sumui   │   │• Drakgyen│   │• Log Drum│
│• Rhino   │  │• Root Br │  │• Sangai  │   │• Monkey  │   │• Red Pan │   │• Tragopan│
└──────────┘  └──────────┘  └──────────┘   └──────────┘   └──────────┘   └──────────┘
                    │                                            │
                    ▼                                            ▼
              ┌──────────┐                                 ┌──────────┐
              │ MIZORAM  │                                 │  SIKKIM  │
              │  (lus)   │                                 │ (ne/sip) │
              ├──────────┤                                 ├──────────┤
              │• Chapchar│                                 │• Pang Lha│
              │• Cheraw  │                                 │• Damphu  │
              │• Serow   │                                 │• Kanchenj│
              └──────────┘                                 └──────────┘
```

---

### 2. Deep Localization Highlights: Khasi, Mizo & Bodo

#### A. Khasi Deep Localization (`kha`)
- **Phonetic Cadence**: Speech synthesis tuned to 0.82x with prolonged diphthong transitions to match rural Ri-Bhoi speech patterns.
- **Cultural Assets**:
  - *Festivals*: Shad Suk Mynsiem, Ka Nongkrem.
  - *Musical Instruments*: Duitara (two-string lute), Maryngod, Ksing Shynrang.
  - *Textiles*: Jainsem silk draped wraps, Ryndia eri silk borders.
  - *Proverbs*: *"Uba sngewrit un kiew sha jrong"* (The humble shall be lifted).

#### B. Mizo Deep Localization (`lus`)
- **Orthography**: Extended Latin character set with circumflex tone marks (`â`, `ê`, `î`, `ô`, `û`, `ṭ`).
- **Cultural Assets**:
  - *Festivals*: Chapchar Kut, Mim Kut, Pawl Kut.
  - *Traditional Arts*: Cheraw (bamboo stepping dance rhythm games), Khuallam.
  - *Musical Instruments*: Khuang (ceremonial drum), Rawchhem (bamboo pipe).
  - *Textiles*: Puanchei, Ngotekherh, Hmaram geometrical patterns.

#### C. Bodo Optimization (`brx`)
- **Linguistic Engine**: Devanagari script rendering with Bodo language matrix phonetic tuning.
- **Cultural Assets**:
  - *Festivals*: Bwisagu, Kherai ritual dancing.
  - *Musical Instruments*: Serja (fiddle), Sifung (long bamboo flute), Tharkha.
  - *Textiles*: Dokhona colorful wrap, Aronai celebratory scarf.
  - *Fauna*: Golden Langur (*Trachypithecus geei*), Black-necked Stork.

---

### 3. Pan-NER 8-State Content Pack Matrix

| State | Primary Codes | Script & Typography | Benchmark Instrument | Benchmark Fauna | Elder Comprehension |
|:---:|:---:|:---|:---|:---|:---:|
| **Assam** | `as`, `bn`, `brx` | Eastern Nagari / Devanagari | Gogona, Tokari, Pepa | One-horned Rhino, Gangetic Dolphin | 98.4% |
| **Meghalaya** | `kha`, `grx`, `en` | Latin Extended | Duitara, Maryngod | Clouded Leopard, Hoolock Gibbon | 97.8% |
| **Manipur** | `mni`, `tkh` | Meitei Mayek & Eastern Nagari | Pena, Flute, Pung | Sangai Brow-antlered Deer | 98.1% |
| **Tripura** | `bn`, `trp` | Eastern Nagari / Latin | Sumui (Bamboo Flute), Dugi | Phayre’s Leaf Monkey | 97.2% |
| **Arunachal** | `nyi`, `mon`, `hi` | Tibetan & Devanagari & Latin | Drakgyen, Wooden Clapper | Red Panda, Great Hornbill | 96.5% |
| **Nagaland** | `nag`, `ao`, `ang` | Latin Extended | Log Drum, Bamboo Flute | Blyth’s Tragopan, Mithun | 96.9% |
| **Mizoram** | `lus`, `en` | Latin Extended (Tone marks) | Khuang, Rawchhem | Mainland Serow, Mrs. Hume's Pheasant | 98.2% |
| **Sikkim** | `ne`, `sip`, `lep` | Devanagari & Lepcha Script | Damphu, Tungna | Red Panda, Snow Leopard | 97.6% |

---

### 4. Technical Integration Standard

- **Offline Bundle Size**: Each state content pack is packaged into a compressed `< 25MB` asset vault containing high-resolution raster textures, OGG audio clips, and vector SVGs.
- **Dynamic Locale Switcher**: Single-tap language switching with zero reload delay using pre-warmed memory caches in Next.js Turbopack.
