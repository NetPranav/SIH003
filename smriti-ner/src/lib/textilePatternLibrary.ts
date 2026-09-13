// ── SMRITI-NER TRADITIONAL TEXTILE PATTERN & MOTIF LIBRARY ─────────────────
// Sub-Phase 1.3 Deliverable: Procedural motifs, color tokens, and cultural weaving heritage

export interface TextileMotif {
  id: string;
  name: string;
  nativeName: string;
  state: string;
  community: string;
  palette: {
    name: string;
    hex: string;
  }[];
  motifSymbol: string; // Symbolic description (e.g. Peacock, Diamond, Phulam)
  culturalStory: string;
  proceduralSvgCode: string;
}

export const NER_TEXTILE_LIBRARY: TextileMotif[] = [
  {
    id: "muga",
    name: "Golden Muga Silk (Kingkhob & Mirizim)",
    nativeName: "সোণালী মুগা ৰেচম (কিংখাপ)",
    state: "Assam",
    community: "Assamese / Sualkuchi Weavers",
    palette: [
      { name: "Muga Natural Gold", hex: "#c9a84c" },
      { name: "Royal Maroon", hex: "#7f1d1d" },
      { name: "Deep Charcoal", hex: "#1f2937" },
    ],
    motifSymbol: "Kingkhob (Ahom Royal Lion & Facing Peacocks)",
    culturalStory: "Naturally golden, wild silkworm (Antheraea assamensis) thread endemic exclusively to the Brahmaputra valley; worn during Ahom royalty coronation and Rongali Bihu.",
    proceduralSvgCode: `<path d="M12 2 L22 12 L12 22 L2 12 Z M7 12 L12 7 L17 12 L12 17 Z" fill="#c9a84c" stroke="#7f1d1d" stroke-width="1.5" />`,
  },
  {
    id: "gamosa",
    name: "Phulam Gamosa (Woven Towel of Respect)",
    nativeName: "ফুলম গামোচা",
    state: "Assam",
    community: "Assamese Cultural Heritage",
    palette: [
      { name: "Pristine Cotton White", hex: "#ffffff" },
      { name: "Gamosa Crimson Red", hex: "#dc2626" },
      { name: "Border Scarlet", hex: "#b91c1c" },
    ],
    motifSymbol: "Phulam Floral Vines & Geometric Crosses",
    culturalStory: "The supreme symbol of reverence and hospitality in Assam; presented to elders as 'Bihuwan' to touch their feet in blessings of longevity.",
    proceduralSvgCode: `<rect x="0" y="0" width="24" height="24" fill="#ffffff" /><path d="M4 12 Q12 4 20 12 Q12 20 4 12 Z M8 12 Q12 8 16 12 Q12 16 8 12 Z" fill="#dc2626" />`,
  },
  {
    id: "puan",
    name: "Mizo Puan (Puanchei & Ngotekherh)",
    nativeName: "Puan (Puanchei & Ngotekherh)",
    state: "Mizoram",
    community: "Mizo Weavers",
    palette: [
      { name: "Bold Pitch Black", hex: "#18181b" },
      { name: "Puanchei Bright Crimson", hex: "#e11d48" },
      { name: "Pure Ivory White", hex: "#f8fafc" },
      { name: "Forest Green Accent", hex: "#15803d" },
    ],
    motifSymbol: "Horizontal Bar Weaves & Checkerboard Geometry",
    culturalStory: "Woven on traditional loin looms; Puanchei is the ceremonial wedding puan celebrated in Cheraw bamboo dances, signifying festive joy.",
    proceduralSvgCode: `<rect x="0" y="0" width="24" height="6" fill="#18181b" /><rect x="0" y="6" width="24" height="12" fill="#e11d48" /><rect x="0" y="18" width="24" height="6" fill="#f8fafc" />`,
  },
  {
    id: "naga_shawl",
    name: "Ao Tsüngkotepsu Warrior Shawl",
    nativeName: "Tsüngkotepsu",
    state: "Nagaland",
    community: "Ao Naga Tribe",
    palette: [
      { name: "Naga Obsidian Black", hex: "#09090b" },
      { name: "Warrior Vermilion", hex: "#b91c1c" },
      { name: "Natural Ecru Band", hex: "#e2e8f0" },
    ],
    motifSymbol: "Mithun Heads, Tigers, and Speared Shields",
    culturalStory: "A warrior's emblem woven by Ao women; the central ecru band depicts symbolic silhouettes of the Mithun (wild bison), tigers, and human figures celebrating courage.",
    proceduralSvgCode: `<rect x="0" y="0" width="24" height="8" fill="#b91c1c" /><rect x="0" y="8" width="24" height="8" fill="#e2e8f0" /><circle cx="12" cy="12" r="3" fill="#09090b" /><rect x="0" y="16" width="24" height="8" fill="#b91c1c" />`,
  },
  {
    id: "phanek",
    name: "Manipuri Phanek Mayek Naibi & Enaphi",
    nativeName: "ꯐꯅꯦꯛ ꯃꯌꯦꯛ ꯅꯥꯏꯕꯤ (Phanek)",
    state: "Manipur",
    community: "Meitei Women Weavers",
    palette: [
      { name: "Indigo Night Blue", hex: "#1e1b4b" },
      { name: "Lotus Pink", hex: "#f43f5e" },
      { name: "Temple Saffron", hex: "#f59e0b" },
    ],
    motifSymbol: "Khoi (Hook Motif) & Lotus Water Lilies",
    culturalStory: "Lower sarong-like garment handwoven on traditional throw-shuttle looms; bordered with delicate Khoi needlework symbolizing the tranquil ripples of Loktak Lake.",
    proceduralSvgCode: `<rect x="0" y="0" width="24" height="24" fill="#1e1b4b" /><path d="M2 18 Q6 10 10 18 Q14 10 18 18 Q22 10 26 18" stroke="#f43f5e" stroke-width="2" fill="none" />`,
  },
  {
    id: "jainsem",
    name: "Khasi Jainsem & Dhara (Muga Silk Tunic)",
    nativeName: "Ka Jainsem",
    state: "Meghalaya",
    community: "Khasi & Jaintia Tribes",
    palette: [
      { name: "Highland Terracotta", hex: "#c2410c" },
      { name: "Pine Green", hex: "#166534" },
      { name: "Loom Mustard", hex: "#d97706" },
    ],
    motifSymbol: "Fine Double-Wrap Folds & Diamond Borders",
    culturalStory: "Graceful two-piece attire draped elegantly over shoulders, woven from Eri and Mulberry silks; worn by matriarchs during Shad Suk Mynsiem thanksgiving dances.",
    proceduralSvgCode: `<rect x="0" y="0" width="24" height="24" fill="#c2410c" /><path d="M0 0 L24 24 M24 0 L0 24" stroke="#d97706" stroke-width="1.5" />`,
  },
  {
    id: "rignai",
    name: "Tripuri Rignai (Chamthwi Weave)",
    nativeName: "Rignai",
    state: "Tripura",
    community: "Tripuri / Kokborok Weavers",
    palette: [
      { name: "Deep Royal Plum", hex: "#581c87" },
      { name: "Marigold Yellow", hex: "#eab308" },
      { name: "Teal Green", hex: "#0f766e" },
    ],
    motifSymbol: "Chamthwi Floral Diamonds & Bamboo Strips",
    culturalStory: "Wraparound skirt with over 200 ancestral patterns passed through oral tradition; represents the natural flora of the Jampui hills and Tripura bamboo grooves.",
    proceduralSvgCode: `<rect x="0" y="0" width="24" height="24" fill="#581c87" /><polygon points="12,2 22,12 12,22 2,12" fill="#eab308" />`,
  },
  {
    id: "galo_gale",
    name: "Arunachal Galo Gale (Geometric Diamond Stripe)",
    nativeName: "Gale",
    state: "Arunachal Pradesh",
    community: "Galo & Apatani Tribes",
    palette: [
      { name: "Basar Charcoal", hex: "#27272a" },
      { name: "Sunset Orange", hex: "#ea580c" },
      { name: "Bamboo Shoot Pale Gold", hex: "#fde047" },
    ],
    motifSymbol: "Zigzag Mountain Contours & River Ribbons",
    culturalStory: "Handwoven by Galo women on body-tension loin looms; geometric diamond patterns mirror the layered mountain ridges of the Siang and Subansiri river basins.",
    proceduralSvgCode: `<rect x="0" y="0" width="24" height="24" fill="#27272a" /><polyline points="0,6 6,12 12,6 18,12 24,6" stroke="#ea580c" stroke-width="2" fill="none" /><polyline points="0,18 6,12 12,18 18,12 24,18" stroke="#fde047" stroke-width="2" fill="none" />`,
  },
];
