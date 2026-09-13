// ── Language Types ─────────────────────────────────────────
export interface Language {
  code: string;
  native: string;
  english: string;
  script: string;
}

// ── Patient Types ─────────────────────────────────────────
export interface Patient {
  id: string;
  name: string;
  age: number;
  language: string;
  baselineMmse: number;
  currentMmse: number;
  status: "active" | "inactive";
}

// ── Game Types ────────────────────────────────────────────
export type GameId = "dhol-pepa" | "kaziranga" | "weavers-loom" | "daily-haat";

export interface Instrument {
  id: string;
  emoji: string;
  name: string;
  native: string;
  freq: number;
  waveType: OscillatorType;
}

export interface Animal {
  id: string;
  emoji: string;
  name: string;
  native: string;
  trivia: string;
}

export interface LoomColor {
  name: string;
  hex: string;
}

export interface Recipe {
  name: string;
  native: string;
  ingredients: string[];
  allItems: MarketItem[];
}

export interface MarketItem {
  id: string;
  emoji: string;
  name: string;
}

// ── Telemetry Types ───────────────────────────────────────
export interface GameSession {
  sessionId: string;
  gameType: GameId;
  difficulty: number;
  reactionTimeMs: number;
  accuracy: number;
  consecutiveErrors: number;
  aacbTriggered: boolean;
  timestamp: string;
}

// ── Reminder Types ────────────────────────────────────────
export interface Reminder {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  type: "medicine" | "hydration" | "appointment";
}

// ── Schedule Types ────────────────────────────────────────
export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  status: "done" | "pending" | "upcoming";
  icon: string;
}

// ── Screen Navigation ─────────────────────────────────────
export type ScreenId =
  | "splash"
  | "language"
  | "home"
  | "games"
  | "dhol-pepa"
  | "kaziranga"
  | "weavers-loom"
  | "daily-haat"
  | "reminders"
  | "album"
  | "connect"
  | "caregiver-pin"
  | "caregiver"
  | "asha-worker";
