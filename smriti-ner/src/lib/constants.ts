import type {
  Language,
  Instrument,
  Animal,
  LoomColor,
  Recipe,
  ScheduleItem,
  Reminder,
} from "./types";

// ── Supported Languages ───────────────────────────────────
export const LANGUAGES: Language[] = [
  { code: "as", native: "অসমীয়া", english: "Assamese", script: "bengali" },
  { code: "mni", native: "ꯃꯩꯇꯩꯂꯣꯟ", english: "Meitei", script: "meetei-mayek" },
  { code: "bn", native: "বাংলা", english: "Bengali", script: "bengali" },
  { code: "brx", native: "बड़ो", english: "Bodo", script: "devanagari" },
  { code: "kha", native: "Khasi", english: "Khasi", script: "latin" },
  { code: "lus", native: "Mizo ṭawng", english: "Mizo", script: "latin" },
  { code: "hi", native: "हिन्दी", english: "Hindi", script: "devanagari" },
  { code: "en", native: "English", english: "English", script: "latin" },
];

// ── Musical Instruments ───────────────────────────────────
export const LOCALIZED_INSTRUMENT_DATA: Record<string, Record<string, { name: string; native: string }>> = {
  as: {
    pepa: { name: "Pepa", native: "পেঁপা" },
    dhol: { name: "Dhol", native: "ঢোল" },
    pung: { name: "Pung", native: "পুং" },
    duitara: { name: "Duitara", native: "দৈতৰা" },
    gogona: { name: "Gogona", native: "গগনা" },
    tokari: { name: "Tokari", native: "টোকোৰী" },
  },
  bn: {
    pepa: { name: "Pepa (Horn)", native: "পেঁপা / বাঁশি" },
    dhol: { name: "Dhol", native: "ঢোল" },
    pung: { name: "Pung (Drum)", native: "পুং (খোল)" },
    duitara: { name: "Dotara", native: "দোতারা" },
    gogona: { name: "Gogona", native: "গগনা" },
    tokari: { name: "Tokari", native: "টোকোরী" },
  },
  hi: {
    pepa: { name: "Pepa (Horn)", native: "पेपा (सींग)" },
    dhol: { name: "Dhol", native: "ढोल" },
    pung: { name: "Pung (Drum)", native: "पुंग (ढोल)" },
    duitara: { name: "Duitara (Lute)", native: "दुइतारा" },
    gogona: { name: "Gogona", native: "गोगना" },
    tokari: { name: "Tokari", native: "तोकारी" },
  },
  mni: {
    pepa: { name: "Pena / Horn", native: "ꯄꯦꯄꯥ" },
    dhol: { name: "Dhol", native: "ꯙꯣꯜ" },
    pung: { name: "Pung", native: "ꯄꯨꯡ" },
    duitara: { name: "Duitara", native: "ꯗꯨꯏꯇꯥꯔꯥ" },
    gogona: { name: "Gogona", native: "ꯒꯣꯒꯣꯅꯥ" },
    tokari: { name: "Tokari", native: "ꯇꯣꯀꯥꯔꯤ" },
  },
  brx: {
    pepa: { name: "Sifung (Horn)", native: "सिफुं" },
    dhol: { name: "Dhamphla (Dhol)", native: "दामफ्ला" },
    pung: { name: "Pung", native: "पुंग" },
    duitara: { name: "Duitara", native: "दुइतारा" },
    gogona: { name: "Gogona", native: "गगना" },
    tokari: { name: "Tokari", native: "तोकारी" },
  },
  kha: {
    pepa: { name: "Besli (Flute)", native: "Ka Besli" },
    dhol: { name: "Ksing (Drum)", native: "Ka Ksing" },
    pung: { name: "Pung", native: "Ka Pung" },
    duitara: { name: "Duitara", native: "Ka Duitara" },
    gogona: { name: "Gogona", native: "Ka Gogona" },
    tokari: { name: "Tokari", native: "Ka Tokari" },
  },
  lus: {
    pepa: { name: "Tawtawrawt (Horn)", native: "Tawtawrawt" },
    dhol: { name: "Khuang (Drum)", native: "Khuang" },
    pung: { name: "Pung", native: "Pung" },
    duitara: { name: "Tingting (Lute)", native: "Tingting" },
    gogona: { name: "Gogona", native: "Gogona" },
    tokari: { name: "Tokari", native: "Tokari" },
  },
  en: {
    pepa: { name: "Buffalo Horn", native: "Pepa" },
    dhol: { name: "Folk Drum", native: "Dhol" },
    pung: { name: "Manipuri Drum", native: "Pung" },
    duitara: { name: "Two-String Lute", native: "Duitara" },
    gogona: { name: "Bamboo Harp", native: "Gogona" },
    tokari: { name: "Folk String Drone", native: "Tokari" },
  },
};

export const INSTRUMENTS: Instrument[] = [
  { id: "dhol", emoji: "🥁", name: "Dhol", native: "Dhol", freq: 240, waveType: "triangle" },
  { id: "pepa", emoji: "🎺", name: "Pepa", native: "Pepa", freq: 440, waveType: "sawtooth" },
  { id: "pung", emoji: "🪘", name: "Pung", native: "Pung", freq: 320, waveType: "triangle" },
  { id: "duitara", emoji: "🎸", name: "Duitara", native: "Duitara", freq: 330, waveType: "sine" },
  { id: "gogona", emoji: "🎵", name: "Gogona", native: "Gogona", freq: 520, waveType: "sawtooth" },
  { id: "tokari", emoji: "🎻", name: "Tokari", native: "Tokari", freq: 290, waveType: "sine" },
];

export function getLocalizedInstruments(language = "en"): Instrument[] {
  const dict = LOCALIZED_INSTRUMENT_DATA[language] || LOCALIZED_INSTRUMENT_DATA.en;
  return INSTRUMENTS.map((inst) => {
    const loc = dict[inst.id] || { name: inst.name, native: inst.name };
    return {
      ...inst,
      name: loc.name,
      native: loc.native,
    };
  });
}

// ── Wildlife ──────────────────────────────────────────────
export const LOCALIZED_ANIMAL_DATA: Record<string, Record<string, { name: string; native: string; trivia: string }>> = {
  as: {
    rhino: { name: "One-Horned Rhinoceros", native: "গঁড়", trivia: "এশিঙীয়া গঁড় কাজিৰঙা ৰাষ্ট্ৰীয় উদ্যানৰ অমূল্য সম্পদ!" },
    hornbill: { name: "Great Indian Hornbill", native: "ধনেশ", trivia: "ধনেশ পক্ষী অৰুণাচল প্ৰদেশৰ জাতীয় চৰাই!" },
    panda: { name: "Red Panda", native: "ৰঙা পাণ্ডা", trivia: "ৰঙা পাণ্ডা ছিকিমৰ জাতীয় প্ৰাণী!" },
    sangai: { name: "Sangai Deer", native: "চাঙাই", trivia: "চাঙাই মণিপুৰৰ কেইবুল লামজাওৰ নৃত্যৰত হৰিণা!" },
    gibbon: { name: "Hoolock Gibbon", native: "হলৌ বান্দৰ", trivia: "হলৌ বান্দৰ ভাৰতত পোৱা একমাত্ৰ বনমানুহ!" },
  },
  bn: {
    rhino: { name: "One-Horned Rhinoceros", native: "একশৃঙ্গ গণ্ডার", trivia: "কাজিরাঙ্গার একশৃঙ্গ গণ্ডার উত্তর-পূর্ব ভারতের অহংকার!" },
    hornbill: { name: "Great Indian Hornbill", native: "ধনেশ পাখি", trivia: "ধনেশ পাখি তার রাজকীয় রূপ ও ডানার জন্য বিখ্যাত!" },
    panda: { name: "Red Panda", native: "লাল পান্ডা", trivia: "লাল পান্ডা সুন্দর পূর্ব হিমালয়ের পাহাড়ে বাস করে!" },
    sangai: { name: "Sangai Deer", native: "সাংগাই হরিণ", trivia: "সাংগাই মণিপুরের বিখ্যাত বিরল নৃত্যরত হরিণ!" },
    gibbon: { name: "Hoolock Gibbon", native: "হুলক গিবন", trivia: "হুলক গিবন ভারতের একমাত্র বনমানুষ প্রজাতির প্রাণী!" },
  },
  hi: {
    rhino: { name: "One-Horned Rhinoceros", native: "एक सींग वाला गैंडा", trivia: "काजीरंगा का एक सींग वाला गैंडा पूर्वोत्तर का गौरव है!" },
    hornbill: { name: "Great Indian Hornbill", native: "धनेश पक्षी", trivia: "धनेश पक्षी अपनी भव्य सुंदर चोंच के लिए जाना जाता है!" },
    panda: { name: "Red Panda", native: "लाल पांडा", trivia: "लाल पांडा सिक्किम का सुंदर राज्य पशु है!" },
    sangai: { name: "Sangai Deer", native: "संगाई (नाचने वाला हिरण)", trivia: "संगाई हिरण केवल मणिपुर के केइबुल लामजाओ में पाया जाता है!" },
    gibbon: { name: "Hoolock Gibbon", native: "हूलॉक गिब्बन (कपि)", trivia: "हूलॉक गिब्बन भारत का एकमात्र वानर/कपि प्रजाति है!" },
  },
  mni: {
    rhino: { name: "One-Horned Rhinoceros", native: "ꯁꯃꯨ ꯃꯌꯥ", trivia: "ꯀꯥꯖꯤꯔꯉ꯭ꯒꯥꯒꯤ ꯁꯃꯨ ꯃꯌꯥ ꯌꯥꯝꯅꯥ ꯃꯃꯤꯡ ꯆꯠꯂꯤ!" },
    hornbill: { name: "Great Indian Hornbill", native: "ꯎꯆꯦꯛ ꯂꯥꯡꯃꯩꯗꯣꯡ", trivia: "ꯂꯥꯡꯃꯩꯗꯣꯡ ꯑꯁꯤ ꯐꯖꯔꯕꯥ ꯎꯆꯦꯛꯅꯤ!" },
    panda: { name: "Red Panda", native: "ꯑꯉꯥꯡꯕꯥ ꯄꯥꯟꯗꯥ", trivia: "ꯑꯉꯥꯡꯕꯥ ꯄꯥꯟꯗꯥ ꯆꯤꯡꯗꯥ ꯂꯩ!" },
    sangai: { name: "Sangai Deer", native: "ꯁꯉꯥꯏ", trivia: "ꯁꯉꯥꯏ ꯑꯁꯤ ꯃꯅꯤꯄꯨꯔꯒꯤ ꯑꯈꯟꯅꯕꯥ ꯁꯥꯅꯤ!" },
    gibbon: { name: "Hoolock Gibbon", native: "ꯌꯣꯡ ꯍꯨꯂꯣꯛ", trivia: "ꯍꯨꯂꯣꯛ ꯑꯁꯤ ꯏꯟꯗꯤꯌꯥꯒꯤ ꯑꯃꯠꯇꯥ ꯉꯥꯏꯔꯕꯥ ꯑꯦꯄꯅꯤ!" },
  },
  brx: {
    rhino: { name: "One-Horned Rhinoceros", native: "गन्डा (Rhino)", trivia: "काजिरंगानि गन्डाया जोबोर मोजां!" },
    hornbill: { name: "Great Indian Hornbill", native: "धनेश दाव", trivia: "धनेश दावया समायना दाव!" },
    panda: { name: "Red Panda", native: "गोजा पान्डा", trivia: "गोजा पान्डाया हाजोआव थायो!" },
    sangai: { name: "Sangai Deer", native: "सांगाइ मोसा", trivia: "सांगाइ मोसाया मनिपुरनि समायना मोसा!" },
    gibbon: { name: "Hoolock Gibbon", native: "हुलक माख्रे", trivia: "हुलक माख्रेया भारतनि मोनसेल' एप!" },
  },
  kha: {
    rhino: { name: "One-Horned Rhinoceros", native: "U Khla Shynreh (Rhino)", trivia: "U Rhino u long ka nam jong ka Kaziranga!" },
    hornbill: { name: "Great Indian Hornbill", native: "Ka Sim Kohkarang", trivia: "Ka Hornbill ka long ka sim ba shida bad itynnad!" },
    panda: { name: "Red Panda", native: "Ka Panda Saw", trivia: "Ka Red Panda ka sah ha ki lum khriat!" },
    sangai: { name: "Sangai Deer", native: "U Sangai", trivia: "U Sangai u long u sier ba shad jong ka Keibul Lamjao, Manipur!" },
    gibbon: { name: "Hoolock Gibbon", native: "U Shrieh Hoolock", trivia: "U Hoolock Gibbon u long u shrieh ba donkam ha India!" },
  },
  lus: {
    rhino: { name: "One-Horned Rhinoceros", native: "Samakkhaw (Rhino)", trivia: "Kaziranga Rhino hi hmingthang tak a ni!" },
    hornbill: { name: "Great Indian Hornbill", native: "Vapu (Hornbill)", trivia: "Hornbill hi savun mawi tak a ni!" },
    panda: { name: "Red Panda", native: "Panda Sen", trivia: "Red Panda hi tlang rama cheng an ni!" },
    sangai: { name: "Sangai Deer", native: "Sangai Sakhi", trivia: "Sangai hi Manipur sakhi lam thiam an ni!" },
    gibbon: { name: "Hoolock Gibbon", native: "Hauhluk", trivia: "Hauhluk hi India rama zawng chi bik an ni!" },
  },
  en: {
    rhino: { name: "One-Horned Rhinoceros", native: "Rhinoceros", trivia: "The Great Indian Rhinoceros is the pride of Kaziranga National Park!" },
    hornbill: { name: "Great Indian Hornbill", native: "Hornbill", trivia: "The Hornbill is renowned for its majestic colorful beak!" },
    panda: { name: "Red Panda", native: "Red Panda", trivia: "The adorable Red Panda lives in tranquil Eastern Himalayan forests!" },
    sangai: { name: "Sangai Deer", native: "Dancing Deer", trivia: "The Sangai is the dancing deer found only at Keibul Lamjao, Manipur!" },
    gibbon: { name: "Hoolock Gibbon", native: "Hoolock Ape", trivia: "The Hoolock Gibbon is the only ape found in India!" },
  },
};

export const ANIMALS: Animal[] = [
  { id: "rhino", emoji: "🦏", name: "One-Horned Rhinoceros", native: "Rhinoceros", trivia: "The Great Indian Rhinoceros is the pride of Kaziranga National Park!" },
  { id: "hornbill", emoji: "🦅", name: "Great Indian Hornbill", native: "Hornbill", trivia: "The Hornbill is celebrated for its majestic colorful beak!" },
  { id: "panda", emoji: "🐼", name: "Red Panda", native: "Red Panda", trivia: "The Red Panda lives in the peaceful Eastern Himalayas!" },
  { id: "sangai", emoji: "🦌", name: "Sangai Deer", native: "Dancing Deer", trivia: "The Sangai is the dancing deer found only in Manipur!" },
  { id: "gibbon", emoji: "🐒", name: "Hoolock Gibbon", native: "Hoolock Ape", trivia: "The Hoolock Gibbon is the only ape found in India!" },
];

export function getLocalizedAnimals(language = "en"): Animal[] {
  const dict = LOCALIZED_ANIMAL_DATA[language] || LOCALIZED_ANIMAL_DATA.en;
  return ANIMALS.map((animal) => {
    const loc = dict[animal.id] || { name: animal.name, native: animal.name, trivia: animal.trivia };
    return {
      ...animal,
      name: loc.name,
      native: loc.native,
      trivia: loc.trivia,
    };
  });
}

// ── Loom Colors (Calibrated North Eastern Silk Palette - WCAG AAA Contrast) ───
export const LOOM_COLORS: LoomColor[] = [
  { name: "Gold (Muga)", hex: "#D99B00" },
  { name: "Crimson (Gamosa)", hex: "#C51B24" },
  { name: "Forest (Bodo)", hex: "#166534" },
  { name: "Indigo (Puan)", hex: "#1E3A8A" },
  { name: "Ivory (Eri)", hex: "#FFF8E7" },
];

// ── Recipes ───────────────────────────────────────────────
export const RECIPES: Recipe[] = [
  {
    name: "Traditional Fish Curry",
    native: "Fish Curry",
    ingredients: ["fish", "mustard", "turmeric"],
    allItems: [
      { id: "fish", emoji: "🐟", name: "Fish" },
      { id: "mustard", emoji: "🌿", name: "Mustard" },
      { id: "turmeric", emoji: "🧡", name: "Turmeric" },
      { id: "bamboo", emoji: "🎋", name: "Bamboo Shoot" },
      { id: "rice", emoji: "🍚", name: "Rice" },
      { id: "chili", emoji: "🌶️", name: "Chili" },
    ],
  },
  {
    name: "Banana Khar",
    native: "Khar",
    ingredients: ["banana", "khar_alkali", "mustard_oil"],
    allItems: [
      { id: "banana", emoji: "🍌", name: "Raw Banana" },
      { id: "khar_alkali", emoji: "🫙", name: "Khar Alkali" },
      { id: "mustard_oil", emoji: "🫗", name: "Mustard Oil" },
      { id: "sugar", emoji: "🍬", name: "Sugar" },
      { id: "lemon", emoji: "🍋", name: "Lemon" },
      { id: "potato", emoji: "🥔", name: "Potato" },
    ],
  },
  {
    name: "Bamboo Shoot Curry",
    native: "Bamboo Shoot",
    ingredients: ["bamboo", "pork", "chili"],
    allItems: [
      { id: "bamboo", emoji: "🎋", name: "Bamboo Shoot" },
      { id: "pork", emoji: "🥩", name: "Pork" },
      { id: "chili", emoji: "🌶️", name: "Chili" },
      { id: "fish", emoji: "🐟", name: "Fish" },
      { id: "tomato", emoji: "🍅", name: "Tomato" },
      { id: "garlic", emoji: "🧄", name: "Garlic" },
    ],
  },
];

export const LOCALIZED_RECIPE_DATA: Record<string, { name: string; native: string }[]> = {
  as: [
    { name: "অসমীয়া মাছৰ জোল", native: "মাছৰ জোল" },
    { name: "পৰম্পৰাগত কল খাৰ", native: "খাৰ" },
    { name: "সোৱাদপূৰ্ণ বাঁহ গাজ", native: "বাঁহ গাজ" },
  ],
  bn: [
    { name: "আসামের মাছের ঝোল", native: "মাছের ঝোল" },
    { name: "ঐতিহ্যবাহী ক্ষার", native: "কলার ক্ষার" },
    { name: "বাঁশের কোঁড়ল ব্যঞ্জন", native: "বাঁশ কোঁড়ল" },
  ],
  hi: [
    { name: "पूर्वोत्तर स्वादिष्ट फिश करी", native: "मछली का झोल" },
    { name: "पारंपरिक केले का खार", native: "खार" },
    { name: "स्वादिष्ट बैम्बू शूट करी", native: "बांस की सब्जी" },
  ],
  mni: [
    { name: "ꯑꯁꯥꯃꯤꯁ ꯉꯥꯒꯤ ꯊꯣꯡꯕꯥ", native: "ꯉꯥꯒꯤ ꯊꯣꯡꯕꯥ" },
    { name: "ꯑꯔꯤꯕꯥ ꯈꯥꯔ", native: "ꯈꯥꯔ" },
    { name: "ꯎꯁꯣꯏ ꯊꯣꯡꯕꯥ", native: "ꯎꯁꯣꯏ" },
  ],
  brx: [
    { name: "ना संनाय (Fish Curry)", native: "ना संनाय" },
    { name: "खार संनाय", native: "खार" },
    { name: "मेवा संनाय", native: "मेवा" },
  ],
  kha: {
    ...[
      { name: "Ka Dohkha ba la Shet", native: "Dohkha" },
      { name: "Ka Khar Tynrai", native: "Khar" },
      { name: "Ka Siej ba la Shet", native: "Siej" },
    ]
  },
  lus: {
    ...[
      { name: "Sangha Hmeh", native: "Sangha Hmeh" },
      { name: "Chhungkaw Khar", native: "Khar" },
      { name: "Mau Hmeh", native: "Mau Hmeh" },
    ]
  },
  en: [
    { name: "Traditional Fish Curry", native: "Fish Curry" },
    { name: "Banana Khar Recipe", native: "Khar" },
    { name: "Tender Bamboo Shoot Stew", native: "Bamboo Shoot" },
  ],
};

export function getLocalizedRecipes(language = "en"): Recipe[] {
  const dict = LOCALIZED_RECIPE_DATA[language] || LOCALIZED_RECIPE_DATA.en;
  return RECIPES.map((recipe, idx) => {
    const loc = dict[idx] || { name: recipe.name, native: recipe.native };
    return {
      ...recipe,
      name: loc.name,
      native: loc.native,
    };
  });
}

// ── Schedule ──────────────────────────────────────────────
export const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { time: "8:00 AM", title: "Morning Medicine", description: "Blood pressure tablet", status: "done", icon: "💊" },
  { time: "10:00 AM", title: "Cognitive Games", description: "Dhol-Pepa Rhythm", status: "done", icon: "🎮" },
  { time: "12:30 PM", title: "Hydration Reminder", description: "Drink water", status: "pending", icon: "💧" },
  { time: "3:00 PM", title: "Memory Album", description: "Family photos", status: "upcoming", icon: "📸" },
  { time: "6:00 PM", title: "Evening Medicine", description: "Vitamin D supplement", status: "upcoming", icon: "💊" },
];

export const LOCALIZED_SCHEDULE_DATA: Record<string, ScheduleItem[]> = {
  as: [
    { time: "8:00 AM", title: "পুৱাৰ ঔষধ", description: "ব্লাড প্ৰেছাৰৰ টেবলেট", status: "done", icon: "💊" },
    { time: "10:00 AM", title: "জ্ঞান উদ্দীপক খেল", description: "ঢোল-পেঁপা সুৰ-মিলন", status: "done", icon: "🎮" },
    { time: "12:30 PM", title: "পানী খোৱাৰ সোঁৱৰণী", description: "এক গিলাচ পানী খাওক", status: "pending", icon: "💧" },
    { time: "3:00 PM", title: "স্মৃতিৰ এলবাম", description: "পুৰণি পৰিয়ালৰ ফটো", status: "upcoming", icon: "📸" },
    { time: "6:00 PM", title: "গধূলিৰ ঔষধ", description: "ভিটামিন ডি টেবলেট", status: "upcoming", icon: "💊" },
  ],
  bn: [
    { time: "8:00 AM", title: "সকালের ওষুধ", description: "ব্লাড প্রেশারের ট্যাবলেট", status: "done", icon: "💊" },
    { time: "10:00 AM", title: "জ্ঞানচর্চার খেলা", description: "ঐতিহ্যবাহী লোক সুর", status: "done", icon: "🎮" },
    { time: "12:30 PM", title: "জল খাওয়ার সময়", description: "এক গ্লাস পরিষ্কার জল খান", status: "pending", icon: "💧" },
    { time: "3:00 PM", title: "স্মৃতির অ্যালবাম", description: "পারিবারিক সুন্দর ছবি", status: "upcoming", icon: "📸" },
    { time: "6:00 PM", title: "সন্ধ্যার ওষুধ", description: "নিয়মিত ভিটামিন ট্যাবলেট", status: "upcoming", icon: "💊" },
  ],
  hi: [
    { time: "8:00 AM", title: "सुबह की दवा", description: "रक्तचाप की गोली (गुनगुने पानी से)", status: "done", icon: "💊" },
    { time: "10:00 AM", title: "स्मृति खेल", description: "ढोल-बांसुरी सुर-ताल", status: "done", icon: "🎮" },
    { time: "12:30 PM", title: "पानी पीने का समय", description: "ताज़ा पानी पिएं", status: "pending", icon: "💧" },
    { time: "3:00 PM", title: "पारिवारिक फोटो एल्बम", description: "पुरानी सुखद यादें", status: "upcoming", icon: "📸" },
    { time: "6:00 PM", title: "शाम की दवा", description: "विटामिन डी सप्लीमेंट", status: "upcoming", icon: "💊" },
  ],
  mni: [
    { time: "8:00 AM", title: "ꯑꯌꯨꯛꯀꯤ ꯍꯤꯗꯥꯛ", description: "ꯕ꯭ꯂꯗ ꯄ꯭ꯔꯦꯁꯔ ꯇꯦꯕ꯭ꯂꯦꯠ", status: "done", icon: "💊" },
    { time: "10:00 AM", title: "ꯋꯥꯈꯜ ꯁꯥꯟꯅꯄꯣꯠ", description: "ꯄꯨꯡ-ꯄꯦꯅꯥ ꯈꯣꯟꯊꯣꯛ", status: "done", icon: "🎮" },
    { time: "12:30 PM", title: "ꯏꯁꯤꯡ ꯊꯛꯄꯥ", description: "ꯏꯁꯤꯡ ꯊꯛꯄꯤꯌꯨ", status: "pending", icon: "💧" },
    { time: "3:00 PM", title: "ꯅꯤꯡꯁꯤꯡ ꯑꯦꂢꯕꯝ", description: "ꯏꯃꯨꯡꯒꯤ ꯐꯣꯇꯣ", status: "upcoming", icon: "📸" },
    { time: "6:00 PM", title: "ꯅꯨꯃꯤꯗꯥꯡꯒꯤ ꯍꯤꯗꯥꯛ", description: "ꯚꯤꯇꯥꯃꯤꯟ ꯗꯤ", status: "upcoming", icon: "💊" },
  ],
  brx: [
    { time: "8:00 AM", title: "फुंनि मुली", description: "ब्लड प्रेसर ट्याब्लेट", status: "done", icon: "💊" },
    { time: "10:00 AM", title: "मेमोरि गेलेनाय", description: "दामफ्ला-सिफुं", status: "done", icon: "🎮" },
    { time: "12:30 PM", title: "दै लोंनाय", description: "दै लोंदो", status: "pending", icon: "💧" },
    { time: "3:00 PM", title: "मोनसे एल्बाम", description: "नखरनि फोटो", status: "upcoming", icon: "📸" },
    { time: "6:00 PM", title: "बेलासिनि मुली", description: "भिटामिन डि", status: "upcoming", icon: "💊" },
  ],
  kha: [
    { time: "8:00 AM", title: "Dawai Step", description: "Ka dawai blood pressure", status: "done", icon: "💊" },
    { time: "10:00 AM", title: "Jingïalehkai Jingmut", description: "Sur tynrai", status: "done", icon: "🎮" },
    { time: "12:30 PM", title: "Dih Um", description: "Dih shi khuri ka um", status: "pending", icon: "💧" },
    { time: "3:00 PM", title: "Ka Kot Dur", description: "Ki dur kiba ha ïing", status: "upcoming", icon: "📸" },
    { time: "6:00 PM", title: "Dawai Janmiet", description: "Vitamin D supplement", status: "upcoming", icon: "💊" },
  ],
  lus: [
    { time: "8:00 AM", title: "Zing Damdawi", description: "Thisen sang damdawi", status: "done", icon: "💊" },
    { time: "10:00 AM", title: "Thluak Sawizawina", description: "Hla thluk zui", status: "done", icon: "🎮" },
    { time: "12:30 PM", title: "Tui In Rawh", description: "Tui thianghlim in rawh", status: "pending", icon: "💧" },
    { time: "3:00 PM", title: "Hriatrengna Album", description: "Chhungkaw thlalak", status: "upcoming", icon: "📸" },
    { time: "6:00 PM", title: "Zan Damdawi", description: "Vitamin D supplement", status: "upcoming", icon: "💊" },
  ],
  en: [
    { time: "8:00 AM", title: "Morning Medicine", description: "Blood pressure tablet with warm water", status: "done", icon: "💊" },
    { time: "10:00 AM", title: "Cognitive Games", description: "Folk rhythm recall exercise", status: "done", icon: "🎮" },
    { time: "12:30 PM", title: "Hydration Reminder", description: "Drink a fresh glass of water", status: "pending", icon: "💧" },
    { time: "3:00 PM", title: "Memory Album", description: "Cherished family photographs", status: "upcoming", icon: "📸" },
    { time: "6:00 PM", title: "Evening Medicine", description: "Vitamin D supplement after dinner", status: "upcoming", icon: "💊" },
  ],
};

export function getLocalizedSchedule(language = "en"): ScheduleItem[] {
  return LOCALIZED_SCHEDULE_DATA[language] || LOCALIZED_SCHEDULE_DATA.en;
}

// ── Reminders ─────────────────────────────────────────────
export const DEFAULT_REMINDERS: Reminder[] = [
  { id: "r1", icon: "💊", title: "Morning Medicine", description: "Blood pressure tablet with warm water", time: "8:00 AM", type: "medicine" },
  { id: "r2", icon: "💧", title: "Hydration", description: "Drink a glass of water", time: "10:30 AM", type: "hydration" },
  { id: "r3", icon: "💊", title: "Afternoon Medicine", description: "Vitamin D supplement", time: "1:00 PM", type: "medicine" },
  { id: "r4", icon: "💧", title: "Hydration", description: "Drink a glass of water", time: "3:30 PM", type: "hydration" },
  { id: "r5", icon: "💊", title: "Evening Medicine", description: "Evening tablet after dinner", time: "6:00 PM", type: "medicine" },
];

// ── Caregiver PIN ─────────────────────────────────────────
export const CAREGIVER_PIN = "1234";

