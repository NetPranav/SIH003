# Smriti-NER (স্মৃতি): Sub-Phase 6.2 — Localization Framework Specification
**Document ID**: `SPEC-UX-I18N-062`  
**Version**: `1.0.0`  
**Status**: `APPROVED`  
**Target Milestone**: `M6 (Multilingual Voice System Operational)`  
**Cultural Domain**: 8 Official North Eastern Languages & Complex Script Typographic Rendering

---

## 1. Executive Summary & Cultural Architecture

In geriatric cognitive healthcare across North East India, interfaces utilizing generic translated Hindi or English trigger acute estrangement and non-adherence. To foster an atmosphere of autonoetic security, Smriti-NER implements a comprehensive **key-based internationalization (i18n) framework** spanning all **8 official North Eastern languages**:

1. **Assamese (`as`)**: Assamese Eastern Nagari (`ৰ` / `ৱ` distinctive orthography)
2. **Meitei / Manipuri (`mni`)**: Meitei Mayek (`ꯃꯤꯇꯩ ꯃꯌꯦꯛ`, Unicode U+ABC0..U+ABFF)
3. **Bengali (`bn`)**: Eastern Nagari (Barak Valley Cachar & Tripura dialects)
4. **Bodo (`brx`)**: Devanagari (`देवनागरी` with Bodo tonal phonetic nuances)
5. **Khasi (`kha`)**: Latin script with Khasi glottal stop and aspirates
6. **Mizo (`lus`)**: Latin script with Mizo circumflex and retroflex consonants (`ṭ`, `â`, `ê`, `î`, `ô`, `û`)
7. **Hindi (`hi`)**: Devanagari lingua franca
8. **English (`en`)**: Administrative Indian English

---

## 2. Cultural Greeting & Kinship Honorific Matrix

In geriatric neuropsychology, cognitive reassurance requires addressing the elder using deeply rooted, culturally authentic kinship terms rather than clinical clinical jargon:

| Language Code | Culture / State | Maternal Grandmother | Paternal Grandmother | Grandfather (Universal) | Elder Kinship Address |
|:---:|:---|:---|:---|:---|:---|
| `as` | Assam | আইতা (*Aita*) | আইতা (*Aita*) | ককা (*Koka*) / বৰদেউতা (*Bor-Deuta*) | আইতা / ককা |
| `mni` | Manipur | ꯏꯕꯦꯟ (*Iben*) | ꯏꯕꯦꯟ (*Iben*) | ꯏꯄꯨ (*Ipu*) / ꯏꯄꯥ (*Ipa*) | ꯏꯃꯥ (*Ima*) / ꯏꯄꯥ (*Ipa*) |
| `bn` | Barak Valley / Tripura | দিদিমা (*Didima*) / দিদা (*Dida*) | ঠাকুমা (*Thakuma*) | দাদু (*Dadu*) / ঠাকুরদাদা (*Thakurdada*) | দাদু / দিদা |
| `brx` | Bodoland | आबौ (*Aabou*) | आबौ (*Aabou*) | आबौ (*Aabou*) / आफा (*Apha*) | आबौ / आइ |
| `kha` | Meghalaya (Khasi) | Ka Iawbei / Ka Mei-rad | Ka Mei-rad | U Thawlang / U Pa-rad | Ka Mei / U Kpa |
| `lus` | Mizoram | Pi (*Pi*) / Pi Pui | Pi (*Pi*) | Pu (*Pu*) / Pu Pui | Ka Pi / Ka Pu |
| `hi` | Pan-NER | नानीजी (*Naniji*) | दादीजी (*Dadiji*) | नानाजी (*Nanaji*) / दादाजी (*Dadaji*) | बाबाजी / माताजी |
| `en` | Administrative | Grandmother | Grandmother | Grandfather | Respected Elder |

---

## 3. Typographic Script Rendering Validation

### 3.1 Meitei Mayek (`Mtei`) Typographic Requirements
- **Unicode Block**: `U+ABC0` to `U+ABFF` (Meitei Mayek) and `U+AAE0` to `U+AAFF` (Extensions).
- **Core Letters**: ꯏ (I), ꯃ (M), ꯇ (T), ꯄ (P), ꯅ (N), ꯌ (Y), ꯀ (K), ꯂ (L), ꯁ (S).
- **Apurba Ligatures & Cheikhei**: Punctuation `꯫` (Cheikhei / sentence terminal) and `꯬` (Lum Iyek).
- **Font Stack**: Fallback cascade prioritizing `Noto Sans Meetei Mayek`, `Namdapha`, and system Indic fonts.

### 3.2 Assamese vs. Bengali Eastern Nagari Orthography
- Assamese requires distinctive characters:
  - `ৰ` (U+09F0, Ra with crossbar) vs. Bengali `র` (U+09B0).
  - `ৱ` (U+09F1, Va) vs. Bengali `ব` (U+09AC).
  - The i18n validator explicitly confirms zero improper cross-contamination between Assamese `ৰ`/`ৱ` and Bengali `র`/`ব`.

### 3.3 Mizo Diacritics (`Latn`)
- Requires full support for `ṭ` (U+1E6D, Latin small letter T with dot below).
- Circumflex tone markers: `â`, `ê`, `î`, `ô`, `û`.

---

## 4. Key-Based i18n Architecture

All translations are externalized in modular JSON catalogs under `smriti-ner/src/locales/{lang}.json` with identical hierarchical structures:

```
locale/
├── common.*          (Buttons, statuses, back, next, audio)
├── home.*            (Greetings, wellness card, daily challenge)
├── games.*           (Dhol-Pepa, Kaziranga, Weaver's Loom, Daily Haat)
├── aacb.*            (De-escalation banners, soothing voice prompts)
├── circadian.*       (Sundowning twilight alerts, lullaby prompts)
├── caregiver.*       (Authentication, adherence, MMSE trends)
└── honorifics.*      (Kinship matrix mappings)
```

### Dynamic Interpolation Support
The translation engine supports mustache-style parameter interpolation:
$$\text{t}(\text{"home.greeting"}, \{ \text{name}: \text{"Dipali"}, \text{kinship}: \text{"আইতা"} \}) \implies \text{"নমস্কাৰ Dipali আইতা!"}$$

---

## 5. Performance & Validation Metrics

| Metric | Target Specification |
|:---|:---|
| Runtime Language Switch | < 16 ms (Single frame UI update) |
| Locale Catalog Bundle Size | < 12 KB per language |
| Key Completeness Parity | 100% across all 8 languages (0 missing keys) |
| Script Rendering Legibility | WCAG 2.2 AAA Contrast Ratio $\ge 7:1$ |
| Kinship Honorific Fallback | Graceful fallback to language-appropriate universal elder title |

---

## 6. Implementation Deliverables

- [x] Complete 8-Language Locale JSON Catalogs (`smriti-ner/src/locales/*.json`)
- [x] Production i18n Engine & React Hooks (`smriti-ner/src/lib/i18n.ts`)
- [x] Cultural Kinship Greeting Matrix (`smriti-ner/src/lib/i18n.ts`)
- [x] Python Script & Key Parity Validation Test Suite (`tests/test_localization_framework.py`)
