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
export const INSTRUMENTS: Instrument[] = [
  { id: "pepa", emoji: "🎺", name: "Pepa", native: "পেঁপা", freq: 440, waveType: "sawtooth" },
  { id: "dhol", emoji: "🥁", name: "Dhol", native: "ঢোল", freq: 120, waveType: "triangle" },
  { id: "pung", emoji: "🪘", name: "Pung", native: "পুং", freq: 200, waveType: "triangle" },
  { id: "duitara", emoji: "🎸", name: "Duitara", native: "দৈতৰা", freq: 330, waveType: "sine" },
  { id: "gogona", emoji: "🎵", name: "Gogona", native: "গগনা", freq: 520, waveType: "sawtooth" },
  { id: "tokari", emoji: "🎻", name: "Tokari", native: "টোকোৰী", freq: 290, waveType: "sine" },
];

// ── Wildlife ──────────────────────────────────────────────
export const ANIMALS: Animal[] = [
  { id: "rhino", emoji: "🦏", name: "One-Horned Rhinoceros", native: "গঁড়", trivia: "The Great Indian Rhinoceros is the pride of Kaziranga National Park!" },
  { id: "hornbill", emoji: "🦅", name: "Great Indian Hornbill", native: "ধনেশ", trivia: "The Hornbill is the state bird of Arunachal Pradesh!" },
  { id: "panda", emoji: "🐼", name: "Red Panda", native: "ৰঙা পাণ্ডা", trivia: "The Red Panda is the state animal of Sikkim!" },
  { id: "sangai", emoji: "🦌", name: "Sangai Deer", native: "চাঙাই", trivia: "The Sangai is the dancing deer found only at Keibul Lamjao, Manipur!" },
  { id: "gibbon", emoji: "🐒", name: "Hoolock Gibbon", native: "হলৌ বান্দৰ", trivia: "The Hoolock Gibbon is the only ape found in India!" },
];

// ── Loom Colors ───────────────────────────────────────────
export const LOOM_COLORS: LoomColor[] = [
  { name: "Gold (Muga)", hex: "#c9a84c" },
  { name: "Crimson (Gamosa)", hex: "#b91c1c" },
  { name: "Forest", hex: "#15803d" },
  { name: "Indigo (Puan)", hex: "#3730a3" },
  { name: "Ivory", hex: "#d6d3d1" },
];

// ── Recipes ───────────────────────────────────────────────
export const RECIPES: Recipe[] = [
  {
    name: "Assamese Fish Curry",
    native: "মাছৰ জোল",
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
    name: "Khar",
    native: "খাৰ",
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
    native: "বাঁহ গাজ",
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

// ── Schedule ──────────────────────────────────────────────
export const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { time: "8:00 AM", title: "Morning Medicine", description: "Blood pressure tablet", status: "done", icon: "💊" },
  { time: "10:00 AM", title: "Cognitive Games", description: "Dhol-Pepa Sur-Milon", status: "done", icon: "🎮" },
  { time: "12:30 PM", title: "Hydration Reminder", description: "Drink water", status: "pending", icon: "💧" },
  { time: "3:00 PM", title: "Memory Album", description: "Family photos", status: "upcoming", icon: "📸" },
  { time: "6:00 PM", title: "Evening Medicine", description: "Vitamin D supplement", status: "upcoming", icon: "💊" },
];

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
