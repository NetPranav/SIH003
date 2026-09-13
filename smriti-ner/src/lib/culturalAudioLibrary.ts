// ── SMRITI-NER FOLK INSTRUMENT AUDIO ASSET LIBRARY ──────────────────────────
// Sub-Phase 1.3 Deliverable: Acoustic specifications, overtone modeling & on-device Web Audio synthesis

import { playTone } from "./audio";

export interface FolkInstrument {
  id: string;
  name: string;
  nativeName: string;
  state: string;
  emoji: string;
  fundamentalFreq: number; // Hz
  waveType: OscillatorType;
  harmonicRatios: number[]; // Overtones for timbre
  culturalSignificance: string;
  clinicalDomain: string;
}

export const NER_FOLK_INSTRUMENTS: FolkInstrument[] = [
  {
    id: "pepa",
    name: "Pepa (Buffalo Hornpipe)",
    nativeName: "পেঁপা",
    state: "Assam",
    emoji: "🎺",
    fundamentalFreq: 440, // A4
    waveType: "sawtooth",
    harmonicRatios: [1.0, 2.0, 3.01, 4.0],
    culturalSignificance: "Carved from wild water-buffalo horn and bamboo; central lead instrument of Rongali Bihu representing vitality and springtime renewal.",
    clinicalDomain: "Auditory Cortical Priming & Rhythmic Entrainment",
  },
  {
    id: "dhol",
    name: "Assamese Dhol (Two-headed Drum)",
    nativeName: "ঢোল",
    state: "Assam",
    emoji: "🥁",
    fundamentalFreq: 120, // Low punch
    waveType: "triangle",
    harmonicRatios: [1.0, 1.48, 2.15],
    culturalSignificance: "Made of Holong wood and animal hide; rhythmic backbone of Bihu dance, known to evoke deep autobiographical motor memory.",
    clinicalDomain: "Motor Cortex Synchronization & Ribot's Law",
  },
  {
    id: "pung",
    name: "Manipuri Pung (Mridanga)",
    nativeName: "পুং (ꯁ꯭ꯃ꯭ꯔꯤꯇꯤ পুং)",
    state: "Manipur",
    emoji: "🪘",
    fundamentalFreq: 190,
    waveType: "triangle",
    harmonicRatios: [1.0, 2.0, 2.85],
    culturalSignificance: "Classical barrel drum of Manipur, used in Pung Cholom dancing and Sankirtana sacred rituals; brings spiritual tranquility.",
    clinicalDomain: "Anxiety Reduction & Meditative Focus",
  },
  {
    id: "duitara",
    name: "Khasi Duitara",
    nativeName: "Duitara (Ka Duitara)",
    state: "Meghalaya",
    emoji: "🎸",
    fundamentalFreq: 330, // E4
    waveType: "sine",
    harmonicRatios: [1.0, 2.0, 3.0],
    culturalSignificance: "Two-stringed lute crafted from wood and silk or steel strings; played by Khasi minstrels to narrate ancient ballads and folklore.",
    clinicalDomain: "Episodic Narrative Recall & Lyrical Memory",
  },
  {
    id: "gogona",
    name: "Gogona (Bamboo Jaw Harp)",
    nativeName: "গগনা",
    state: "Assam",
    emoji: "🎵",
    fundamentalFreq: 520, // C5
    waveType: "sawtooth",
    harmonicRatios: [1.0, 2.05, 3.12, 4.1],
    culturalSignificance: "Slender bamboo vibrating reed held between teeth; produces rich, twanging overtone harmonies characteristic of feminine Bihu.",
    clinicalDomain: "High-Frequency Harmonic Discrimination",
  },
  {
    id: "tokari",
    name: "Tokari (Plucked String Lute)",
    nativeName: "টোকোৰী",
    state: "Assam",
    emoji: "🎻",
    fundamentalFreq: 290,
    waveType: "sine",
    harmonicRatios: [1.0, 1.98, 3.02],
    culturalSignificance: "Ancient plucked chordophone used in Tokari Geet and spiritual Vaishnavite discourses; mellow and soothing tone.",
    clinicalDomain: "Parasympathetic Activation & Serenity",
  },
  {
    id: "khol",
    name: "Sattriya Khol (Terracotta Drum)",
    nativeName: "খোল",
    state: "Assam / Manipur",
    emoji: "🪘",
    fundamentalFreq: 165,
    waveType: "triangle",
    harmonicRatios: [1.0, 2.02, 3.05],
    culturalSignificance: "Baked clay body with leather straps pioneered by Srimanta Sankardev in Majuli monasteries (Satras); sacred meditative sound.",
    clinicalDomain: "Spiritual Reassurance & Identity Anchoring",
  },
  {
    id: "baanhi",
    name: "Baanhi (Bamboo Flute)",
    nativeName: "বাঁহী",
    state: "Pan-NER",
    emoji: "🪈",
    fundamentalFreq: 660, // E5
    waveType: "sine",
    harmonicRatios: [1.0, 2.0, 3.0],
    culturalSignificance: "Crafted from fine hillside bamboo; ubiquitous across pastoral North East hills, used in love songs and lullabies.",
    clinicalDomain: "Pre-Sundowning Calming & Melodic Comfort",
  },
];

// Play on-device synthetic overtone representation
export function playInstrumentPreview(instrument: FolkInstrument): void {
  const baseFreq = instrument.fundamentalFreq;
  const duration = 0.5;

  instrument.harmonicRatios.forEach((ratio, idx) => {
    const gainFactor = 1 / (idx + 1);
    setTimeout(() => {
      playTone(baseFreq * ratio, duration, instrument.waveType);
    }, idx * 40);
  });
}
