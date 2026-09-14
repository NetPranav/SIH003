// ── SMRITI-NER CULTURAL ASSET LOADER & MULTILINGUAL REGISTRY ─────────────────
// Sub-Phase 4.3: Ribot's law asset resolution, offline caching & language binding

import { INSTRUMENTS, ANIMALS, LOOM_COLORS, RECIPES } from "./constants";
import type { Instrument, Animal, LoomColor, Recipe } from "./types";

export interface CulturalPackage {
  language: string;
  instruments: Instrument[];
  animals: Animal[];
  loomColors: LoomColor[];
  recipes: Recipe[];
}

// Multilingual naming overrides for 8 NER languages
const CULTURAL_TRANSLATIONS: Record<string, Record<string, string>> = {
  // Instruments
  pepa: { as: "পেঁপা", mni: "ꯄꯦꯄꯥ", bn: "পেঁপা", brx: "पेपा", kha: "Pepa", lus: "Pepa", hi: "पेपा", en: "Pepa" },
  dhol: { as: "ঢোল", mni: "ꯙꯣꯜ", bn: "ঢোল", brx: "धोल", kha: "Dhol", lus: "Dhol", hi: "ढोल", en: "Dhol" },
  pung: { as: "পুং", mni: "ꯄꯨꯡ", bn: "পুং", brx: "पुं", kha: "Pung", lus: "Pung", hi: "पुंग", en: "Pung" },
  duitara: { as: "দৈতৰা", mni: "ꯗꯨꯏꯇꯥꯔꯥ", bn: "দোতারা", brx: "दुइतारा", kha: "Duitara", lus: "Duitara", hi: "दोतारा", en: "Duitara" },
  gogona: { as: "গগনা", mni: "ꯒꯣꯒꯣꯅꯥ", bn: "গগনা", brx: "गगना", kha: "Gogona", lus: "Gogona", hi: "गगना", en: "Gogona" },
  tokari: { as: "টোকোৰী", mni: "ꯇꯣꯀꯥꯔꯤ", bn: "টোকোরী", brx: "तोकारि", kha: "Tokari", lus: "Tokari", hi: "टोकारी", en: "Tokari" },

  // Fauna
  rhino: { as: "গঁড়", mni: "ꯁꯃꯨ ꯃꯆꯥ", bn: "গণ্ডার", brx: "गन्दो", kha: "Kylliang", lus: "Rhinoceros", hi: "गैंडा", en: "One-Horned Rhinoceros" },
  hornbill: { as: "ধনেশ", mni: "ꯎꯆꯦꯛ", bn: "ধনেশ", brx: "दाव", kha: "Hornbill", lus: "Vaphai", hi: "धनेश", en: "Great Indian Hornbill" },
  panda: { as: "ৰঙা পাণ্ডা", mni: "ꯑꯉꯥꯡꯕꯥ ꯄꯥꯟꯗꯥ", bn: "লাল পান্ডা", brx: "गाजा पाण्डा", kha: "Panda Basaw", lus: "Panda Sen", hi: "लाल पांडा", en: "Red Panda" },
  sangai: { as: "চাঙাই হৰিণা", mni: "ꯁꯪꯒꯥꯏ", bn: "সাঙ্গাই হরিণ", brx: "सांगाइ मैदे", kha: "Skei Sangai", lus: "Sangai Deer", hi: "संगाई हिरण", en: "Sangai Deer" },
  gibbon: { as: "হলৌ বান্দৰ", mni: "ꯌꯣꯡ", bn: "উলুক বানর", brx: "हलौ मखा", kha: "Hoolock", lus: "Hoolock Gibbon", hi: "हूलॉक गिब्बन", en: "Hoolock Gibbon" },
};

// In-memory memory cache for instant <1ms resolution
const assetPackageCache = new Map<string, CulturalPackage>();

/**
 * Loads and translates full cultural asset package for a given language.
 */
export function loadCulturalAssetPackage(language = "as"): CulturalPackage {
  if (assetPackageCache.has(language)) {
    return assetPackageCache.get(language)!;
  }

  const localizedInstruments = INSTRUMENTS.map((inst) => ({
    ...inst,
    native: CULTURAL_TRANSLATIONS[inst.id]?.[language] || inst.native,
  }));

  const localizedAnimals = ANIMALS.map((animal) => ({
    ...animal,
    native: CULTURAL_TRANSLATIONS[animal.id]?.[language] || animal.native,
  }));

  const pkg: CulturalPackage = {
    language,
    instruments: localizedInstruments,
    animals: localizedAnimals,
    loomColors: LOOM_COLORS,
    recipes: RECIPES,
  };

  assetPackageCache.set(language, pkg);
  return pkg;
}

/**
 * Direct lookup for an individual instrument by id and language.
 */
export function getLocalizedInstrument(id: string, language = "as"): Instrument | undefined {
  const pkg = loadCulturalAssetPackage(language);
  return pkg.instruments.find((i) => i.id === id);
}

/**
 * Direct lookup for an animal by id and language.
 */
export function getLocalizedAnimal(id: string, language = "as"): Animal | undefined {
  const pkg = loadCulturalAssetPackage(language);
  return pkg.animals.find((a) => a.id === id);
}
