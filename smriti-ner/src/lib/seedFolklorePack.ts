// ── SMRITI-NER SEED FOLKLORE & ORAL HISTORY ARCHIVE ─────────────────────────
// Sub-Phase 1.4 Deliverable: 8-State authentic folklore corpus for Reminiscence Therapy

export interface FolkStory {
  id: string;
  title: string;
  nativeTitle: string;
  state: string;
  language: string;
  emoji: string;
  themes: string[];
  summary: string;
  fullNarrative: string;
  reminiscenceCue: string;
  durationMinutes: number;
}

export const SEED_FOLKLORE_COLLECTION: FolkStory[] = [
  {
    id: "tejimola",
    title: "Tejimola (The Lotus Blossom Girl)",
    nativeTitle: "টেজীমলা",
    state: "Assam",
    language: "Assamese (অসমীয়া)",
    emoji: "🪷",
    themes: ["Innocence", "Rebirth", "Nature", "Enduring Love"],
    summary: "Lakshminath Bezbaroa's classic tale from Burhi Aair Xadhu of a pure-hearted girl whose spirit transforms into a gourd plant, a pomelo tree, and ultimately a blooming lotus, reunited with her loving father.",
    fullNarrative: "A long time ago in an Assamese river village, there lived a kind girl named Tejimola. Despite being mistreated by her stepmother while her merchant father was trading across the Brahmaputra, Tejimola's gentle soul could not be extinguished. She sprouted as a leafy pumpkin climber by the cottage garden, then as a fragrant lemon tree, and finally as a radiant red lotus swaying gently in the river shallows. When her father's boat sailed home, the lotus spoke to him in Tejimola's sweet voice: 'Father, it is I, your beloved Tejimola.' With tears of joy, he lifted the flower, and she returned to her true human form.",
    reminiscenceCue: "Do you remember your grandmother telling you the story of Tejimola by the fireside on winter evenings?",
    durationMinutes: 4,
  },
  {
    id: "khamba_thoibi",
    title: "Khamba Thoibi (The Legend of Moirang)",
    nativeTitle: "ꯈꯝꯕ ꯊꯣꯏꯕꯤ",
    state: "Manipur",
    language: "Meitei (ꯃꯩꯇꯩꯂꯣꯟ)",
    emoji: "🐅",
    themes: ["Heroism", "Devotion", "Loktak Lake", "Sacred Dance"],
    summary: "The epic romance of brave orphan prince Khamba and princess Thoibi of Moirang; their sacred dance before Lord Thangjing at Loktak Lake forms the eternal foundation of Manipuri culture.",
    fullNarrative: "In the ancient kingdom of Moirang beside the shimmering expanse of Loktak Lake, young Khamba captured the wild bull and subdued the ferocious man-eating tiger of Torbung with his unyielding courage. Princess Thoibi, the jewel of the royal house, gave her heart to him. Dressed in the finest handwoven Phanek and Enaphi silks, they performed the divine duet before Lord Thangjing, their graceful steps mirroring the ripples of the lake. Their loyalty proved that true devotion overcomes all royal rivalry.",
    reminiscenceCue: "Can you recall the rhythm of the Pena instrument when minstrels sing the ballad of Khamba Thoibi at Lai Haraoba?",
    durationMinutes: 5,
  },
  {
    id: "lapalang",
    title: "U Sier Lapalang (The Stag of Shillong Peak)",
    nativeTitle: "U Sier Lapalang",
    state: "Meghalaya",
    language: "Khasi (Ka Ktien Khasi)",
    emoji: "🦌",
    themes: ["Maternal Love", "Highland Beauty", "Sacred Hills"],
    summary: "A poignant Khasi allegory of a young stag who wandered from the plains into the cool misty hills of Shillong, and his mother's heartbroken lament that echoes forever in Khasi funeral laments.",
    fullNarrative: "In the warm river plains of Sylhet, a mother deer cautioned her son Lapalang never to climb the forbidden cloud-capped ridges of the Khasi highlands. But enticed by the sweet smell of mountain grass and sparkling springs, Lapalang leaped up the cliffs to Shillong Peak. Bewitched by the green pines and waterfalls, he stayed until hunters discovered him. When his mother searched the hills and found him, her weeping lament (Ka Jingsngewlem) was so full of tender love that even the hunters wept, giving birth to the ancient Khasi tradition of mourning songs.",
    reminiscenceCue: "Think of the cool misty pine hills of Shillong and the deep, unconditional love mothers carry for their children.",
    durationMinutes: 4,
  },
  {
    id: "chhura",
    title: "Chhura leh Nahaia (The Clever Mizo Folk Hero)",
    nativeTitle: "Chhura leh Nahaia",
    state: "Mizoram",
    language: "Mizo (Mizo ṭawng)",
    emoji: "🏹",
    themes: ["Wit", "Laughter", "Simplicity", "Good Nature"],
    summary: "Humorous folklore of Chhura, the tall, innocent, and wonderfully good-natured folk hero whose comic misadventures and clever triumphs brought laughter to every Mizo village.",
    fullNarrative: "In the ancestral hill settlements of Mizoram, every child grew up on tales of Chhura. Though his companion Nahaia always tried to outsmart him—offering Chhura the root of the sugarcane while keeping the sweet top, or claiming the top half of the cow while Chhura got the bottom—Chhura's sheer innocence and big-hearted humor always turned the tables. When Chhura flattened the mountain ridge with his mighty stone so the village children could watch the sunrise, the whole valley cheered his boundless goodwill.",
    reminiscenceCue: "Do you remember the village elders chuckling over Chhura's funny antics around the evening hearth?",
    durationMinutes: 3,
  },
  {
    id: "sopfunuo",
    title: "Sopfunuo (The Angami Legend of Devotion)",
    nativeTitle: "Sopfunuo",
    state: "Nagaland",
    language: "Angami / Nagamese",
    emoji: "⛰️",
    themes: ["Endurance", "Motherhood", "Sacred Mountains"],
    summary: "A treasured Angami Naga folktale of Sopfunuo and her young child, whose eternal journey back to her childhood village of Rüguzuma turned them into guardian standing stones on Mount Japfü.",
    fullNarrative: "Long ago, a devoted mother named Sopfunuo chose to return across the rugged Naga ridges to her home village of Rüguzuma with her infant child tucked safely into her woven shawl. Through storm and darkness across Mount Japfü, she carried her child with boundless motherly strength. Overcome by the night, their spirits were preserved in the sacred stone monoliths standing watch over the valley, revered by generations as the timeless symbol of motherly devotion.",
    reminiscenceCue: "Picture the grand terraced rice fields of Kohima and the steadfast strength of Naga mothers.",
    durationMinutes: 4,
  },
  {
    id: "abotani",
    title: "Abotani and the Sun & Moon",
    nativeTitle: "Abotani",
    state: "Arunachal Pradesh",
    language: "Tani / Nyishi / Galo",
    emoji: "☀️",
    themes: ["Creation", "Harmony with Nature", "Wisdom"],
    summary: "The primal oral legend of Abotani, the revered first ancestor of the Tani tribes, who mediated between spirits, beasts, and celestial lights to bring agriculture and warmth to mankind.",
    fullNarrative: "In the dawn of time among the great snow valleys of the Siang and Subansiri, Abotani was the first teacher. When two blistering suns scorched the earth, Abotani gently persuaded the second sun to cool into the gentle, silver moon so crops could rest and humans could dream. He learned the secrets of cultivating mountain paddy from the sparrow and the wisdom of forest medicine from the hornbill, bequeathing peace to all hillside clans.",
    reminiscenceCue: "Think of the golden warmth of the morning sun breaking over the snowy ridges of the Eastern Himalayas.",
    durationMinutes: 4,
  },
  {
    id: "chethuang",
    title: "Chethuang & the Magic Hill Bamboo",
    nativeTitle: "Chethuang",
    state: "Tripura",
    language: "Kokborok / Bengali",
    emoji: "🎋",
    themes: ["Respect for Forests", "Abundance", "Bamboo Heritage"],
    summary: "Tripuri fable celebrating Chethuang, the sacred hill bamboo that provided water, shelter, instruments, and food to the indigenous clans of the Jampui hills.",
    fullNarrative: "In the green valleys of Tripura, the wise grandmother tree Chethuang taught the hill villagers that every culm of bamboo carried a soul. When severe drought struck, the hollow bamboo stalks released fresh, sweet mountain spring water to sustain the elders and children. The villagers vowed never to cut bamboo during the nesting season of birds, creating a bond of gratitude that endures in every handwoven Rignai skirt and bamboo flute.",
    reminiscenceCue: "Do you remember the cool rustle of bamboo groves in the evening breeze near your ancestral home?",
    durationMinutes: 3,
  },
  {
    id: "demojong",
    title: "Bayul Demojong (The Sacred Valley of Peace)",
    nativeTitle: "Bayul Demojong",
    state: "Sikkim",
    language: "Bhutia / Lepcha / Nepali",
    emoji: "🏔️",
    themes: ["Sanctuary", "Spiritual Peace", "Sacred Waters"],
    summary: "The ancient Buddhist and Lepcha legend of Guru Padmasambhava blessing the hidden valleys around Mount Khangchendzonga as a timeless sanctuary for peaceful minds and pure spirits.",
    fullNarrative: "Centuries ago, the great master blessed the emerald valleys surrounding Khangchendzonga, proclaiming them 'Bayul Demojong'—the valley of hidden treasures where weary hearts find absolute tranquility. He hid sacred seeds and healing herbs by the high mountain lakes of Khecheopalri and Tsomgo. The Lepcha elders revere it as Mayel Lyang, the earthly paradise where age brings wisdom, no one suffers in loneliness, and prayer flags flutter healing blessings over all living beings.",
    reminiscenceCue: "Visualize the snow-white peak of Khangchendzonga glowing in morning pink light, bringing serenity to your heart.",
    durationMinutes: 4,
  },
];
