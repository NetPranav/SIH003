// ── SMRITI-NER INDIGENOUS FAUNA REFERENCE PACK ──────────────────────────────
// Sub-Phase 1.3 Deliverable: Multi-language naming, folklore & visual reminiscence cues

export interface FaunaItem {
  id: string;
  name: string;
  scientificName: string;
  state: string;
  emoji: string;
  namesByLanguage: {
    as: string;  // Assamese
    mni: string; // Meitei
    bn: string;  // Bengali
    brx: string; // Bodo
    kha: string; // Khasi
    lus: string; // Mizo
    hi: string;  // Hindi
    en: string;  // English
  };
  culturalFolklore: string;
  reminiscencePrompt: string;
  habitat: string;
}

export const NER_FAUNA_COLLECTION: FaunaItem[] = [
  {
    id: "rhino",
    name: "Great Indian One-Horned Rhinoceros",
    scientificName: "Rhinoceros unicornis",
    state: "Assam (State Animal)",
    emoji: "🦏",
    namesByLanguage: {
      as: "এশিঙীয়া গঁড়",
      mni: "ꯒꯟꯗꯥ (Ganda)",
      bn: "একশৃঙ্গ গণ্ডার",
      brx: "गोन्दाइ (Gondai)",
      kha: "U Kynphad",
      lus: "Rhinoceros",
      hi: "एक सींग वाला गैंडा",
      en: "One-Horned Rhinoceros",
    },
    culturalFolklore: "Symbol of resilience and supreme majesty across Assam; revered guardian of the Brahmaputra alluvial flood plains in Kaziranga and Pobitora.",
    reminiscencePrompt: "Do you remember visiting Kaziranga National Park or seeing the majestic Rhino grazing in the elephant grass?",
    habitat: "Kaziranga, Manas & Orang National Parks, Assam",
  },
  {
    id: "hornbill",
    name: "Great Indian Hornbill",
    scientificName: "Buceros bicornis",
    state: "Arunachal Pradesh & Kerala (State Bird)",
    emoji: "🦅",
    namesByLanguage: {
      as: "ধনেশ পক্ষী (Dhanesh)",
      mni: "ꯎꯆꯦꯛ ꯂꯥꯡꯗꯧ (Uchek Langmeidong)",
      bn: "রাজ ধনেশ",
      brx: "दाव दनेश",
      kha: "Ka Koh-Karang",
      lus: "Vaphai",
      hi: "ग्रेट हॉर्नबिल",
      en: "Great Indian Hornbill",
    },
    culturalFolklore: "Sacred bird celebrated in the legendary Hornbill Festival of Nagaland and Nyishi tribal folklore of Arunachal; represents marital fidelity and vigilance.",
    reminiscencePrompt: "Look at the magnificent yellow casque of the Hornbill. Can you picture it soaring over the misty canopy of the Eastern Himalayas?",
    habitat: "Namdapha & Pakke Tiger Reserve, Arunachal Pradesh",
  },
  {
    id: "red_panda",
    name: "Red Panda (Habre)",
    scientificName: "Ailurus fulgens",
    state: "Sikkim (State Animal)",
    emoji: "🐼",
    namesByLanguage: {
      as: "ৰঙা পাণ্ডা",
      mni: "ꯑꯉꯥꯡꯕꯥ ꯄꯥꯟꯗꯥ",
      bn: "লাল পান্ডা",
      brx: "गाजा पाण्डा",
      kha: "U Panda Saw",
      lus: "Panda Sen",
      hi: "लाल पांडा",
      en: "Red Panda",
    },
    culturalFolklore: "Revered in Sikkimese Buddhist folklore as a gentle forest dweller living in high bamboo rhododendron glades; symbol of peace and conservation.",
    reminiscencePrompt: "Its bushy striped tail keeps it warm in high mountain snow. How peaceful it looks sleeping in the pine branches!",
    habitat: "Khangchendzonga Biosphere Reserve, Sikkim",
  },
  {
    id: "sangai",
    name: "Sangai (The Dancing Brow-Antlered Deer)",
    scientificName: "Rucervus eldii eldii",
    state: "Manipur (State Animal)",
    emoji: "🦌",
    namesByLanguage: {
      as: "চাঙাই হৰিণ",
      mni: "ꯁꯪꯒꯥꯏ (Sangai)",
      bn: "সাঙ্গাই হরিণ",
      brx: "सांगाइ मोसौ",
      kha: "U Sier Sangai",
      lus: "Sangai Sakhi",
      hi: "संगाई हिरण",
      en: "Sangai Dancing Deer",
    },
    culturalFolklore: "Found exclusively on the floating phumdi biomass of Loktak Lake at Keibul Lamjao; celebrated in Meitei folklore as a reincarnated prince and symbol of elegance.",
    reminiscencePrompt: "The dancing steps of the Sangai deer on the floating meadows of Loktak Lake. Have you seen the shimmering water of Loktak?",
    habitat: "Keibul Lamjao National Park, Loktak Lake, Manipur",
  },
  {
    id: "gibbon",
    name: "Western Hoolock Gibbon",
    scientificName: "Hoolock hoolock",
    state: "Assam & Meghalaya",
    emoji: "🐒",
    namesByLanguage: {
      as: "হলৌ বান্দৰ (Hollou)",
      mni: "ꯌꯣꯡ ꯍꯧꯂꯣꯛ (Yong Hoolock)",
      bn: "হুলোক গিবন",
      brx: "होलौ माख्रा",
      kha: "U Huleng",
      lus: "Hauhuk",
      hi: "हूलोक गिब्बन",
      en: "Hoolock Gibbon",
    },
    culturalFolklore: "India's only ape species; famed across the lush rainforests of Gibbon Wildlife Sanctuary for its melodious morning duets echoing across the valley.",
    reminiscencePrompt: "Hear the morning calls of the Hollou swinging through the tall Hollong trees of upper Assam.",
    habitat: "Hoollongapar Gibbon Sanctuary, Jorhat, Assam",
  },
  {
    id: "tragopan",
    name: "Blyth's Tragopan",
    scientificName: "Tragopan blythii",
    state: "Nagaland (State Bird)",
    emoji: "🦚",
    namesByLanguage: {
      as: "ট্ৰেগোপান পক্ষী",
      mni: "ꯇ꯭ꯔꯥꯒꯣꯄꯥꯟ",
      bn: "ব্লিথ ট্র্যাগোপান",
      brx: "ट्रागोपान",
      kha: "Ka Tragopan",
      lus: "Vangai",
      hi: "ब्लाइथ ट्रैगोपैन",
      en: "Blyth's Tragopan",
    },
    culturalFolklore: "The vibrant horned pheasant of the Dzüko Valley and Mount Saramati; a symbol of forest quietude and high-altitude purity in Naga folklore.",
    reminiscencePrompt: "Look at the spotted crimson plumage against the green rhododendron hills of Nagaland.",
    habitat: "Dzüko Valley & Kohima ridge, Nagaland",
  },
  {
    id: "leaf_monkey",
    name: "Phayre's Leaf Monkey (Spectacled Langur)",
    scientificName: "Trachypithecus phayrei",
    state: "Tripura (State Animal)",
    emoji: "🐵",
    namesByLanguage: {
      as: "চশমা বান্দৰ",
      mni: "ꯆꯁꯃꯥ ꯌꯣꯡ",
      bn: "চশমাপরা হনুমান",
      brx: "चासमा माख्रा",
      kha: "U Shrieh Spectacle",
      lus: "Chhim-chawm",
      hi: "चश्माधारी लंगूर",
      en: "Spectacled Leaf Monkey",
    },
    culturalFolklore: "Famous for its striking white eye-rings resembling round spectacles; venerated in Tripura folk stories as the wise, contemplative elder of the bamboo groves.",
    reminiscencePrompt: "Notice the wise, gentle white rings around its eyes, resting calmly in the Sepahijala sanctuary bamboo.",
    habitat: "Sepahijala & Rowa Wildlife Sanctuaries, Tripura",
  },
  {
    id: "serow",
    name: "Himalayan Serow (Saza)",
    scientificName: "Capricornis sumatraensis thar",
    state: "Mizoram (State Animal)",
    emoji: "🐐",
    namesByLanguage: {
      as: "দেও ছাগলী (Deo Sagoli)",
      mni: "ꯁꯕꯦꯡ (Sabeng)",
      bn: "বনছাগল",
      brx: "हाग्रा बोमा",
      kha: "U Blang Khlaw",
      lus: "Saza",
      hi: "हिमालयन सीरो",
      en: "Himalayan Serow",
    },
    culturalFolklore: "Known in Mizo culture as 'Saza', a sure-footed mountain goat-antelope capable of leaping across precipitous blue cliffs in the Mizo Hills.",
    reminiscencePrompt: "A symbol of sure-footed balance navigating steep cliffs of Phawngpui, the Blue Mountain of Mizoram.",
    habitat: "Phawngpui National Park & Dampa Tiger Reserve, Mizoram",
  },
];
