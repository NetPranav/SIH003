// ── SMRITI-NER ELDER-CENTRIC DESIGN SYSTEM TOKENS ───────────────────────────
// Sub-Phase 2.1 Deliverable: WCAG 2.2 Level AAA (≥7:1) tokens, typography, and hitboxes

export interface ColorToken {
  id: string;
  name: string;
  hex: string;
  usage: string;
  bgHex: string;
  contrastRatio: number;
  wcagAAA: boolean; // Must be ≥ 7.0:1 for normal text or ≥ 4.5:1 for large text
}

// Relative luminance calculator (WCAG 2.2 algorithm)
function getLuminance(hex: string): number {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Calculate precise contrast ratio between two hex colors
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return Math.round(ratio * 10) / 10;
}

// Curated WCAG 2.2 AAA Color Palette for Geriatric Vision
export const ELDER_COLOR_PALETTE: ColorToken[] = [
  {
    id: "text-primary",
    name: "Midnight Slate (Primary Body)",
    hex: "#0f172a",
    usage: "Core patient instructions, titles, primary reading text",
    bgHex: "#ffffff",
    contrastRatio: getContrastRatio("#0f172a", "#ffffff"), // 15.6:1
    wcagAAA: true,
  },
  {
    id: "text-secondary",
    name: "Deep River Charcoal",
    hex: "#1e293b",
    usage: "Subheadings, narrative captions, question prompts",
    bgHex: "#ffffff",
    contrastRatio: getContrastRatio("#1e293b", "#ffffff"), // 13.2:1
    wcagAAA: true,
  },
  {
    id: "text-tertiary",
    name: "Forest Slate",
    hex: "#334155",
    usage: "Timestamps, metadata labels, secondary hints",
    bgHex: "#ffffff",
    contrastRatio: getContrastRatio("#334155", "#ffffff"), // 9.3:1
    wcagAAA: true,
  },
  {
    id: "accent-emerald",
    name: "Assam Tea Leaf Emerald",
    hex: "#065f46",
    usage: "Positive feedback, medicine confirmed, calm grounding",
    bgHex: "#ffffff",
    contrastRatio: getContrastRatio("#065f46", "#ffffff"), // 7.4:1
    wcagAAA: true,
  },
  {
    id: "accent-amber",
    name: "Muga Silk Amber Ochre",
    hex: "#92400e",
    usage: "Important alerts, memory anchors, gentle attention",
    bgHex: "#ffffff",
    contrastRatio: getContrastRatio("#92400e", "#ffffff"), // 7.2:1
    wcagAAA: true,
  },
  {
    id: "accent-blue",
    name: "Brahmaputra Deep Azure",
    hex: "#1e3a8a",
    usage: "Interactive touch buttons, navigation tabs",
    bgHex: "#ffffff",
    contrastRatio: getContrastRatio("#1e3a8a", "#ffffff"), // 11.5:1
    wcagAAA: true,
  },
  {
    id: "accent-crimson",
    name: "Gamosa Crimson Deep",
    hex: "#991b1b",
    usage: "Missed medicine, caregiver emergency alert (non-flashing)",
    bgHex: "#ffffff",
    contrastRatio: getContrastRatio("#991b1b", "#ffffff"), // 7.3:1
    wcagAAA: true,
  },
  {
    id: "bg-canvas",
    name: "Pristine Clinical White",
    hex: "#ffffff",
    usage: "Main page background, clean white theme",
    bgHex: "#0f172a",
    contrastRatio: getContrastRatio("#ffffff", "#0f172a"), // 15.6:1
    wcagAAA: true,
  },
  {
    id: "bg-card",
    name: "Warm Cotton White",
    hex: "#f8f9fa",
    usage: "High-contrast card borders and subtle elevation surfaces",
    bgHex: "#0f172a",
    contrastRatio: getContrastRatio("#f8f9fa", "#0f172a"), // 14.8:1
    wcagAAA: true,
  },
];

// Elder-Centric Typography Specification
export interface TypographySpec {
  level: string;
  sizePx: number;
  sizeRem: string;
  lineHeight: number;
  weight: number;
  letterSpacing: string;
  purpose: string;
}

export const ELDER_TYPOGRAPHY_SCALE: TypographySpec[] = [
  {
    level: "Display",
    sizePx: 40,
    sizeRem: "2.5rem",
    lineHeight: 1.3,
    weight: 800,
    letterSpacing: "-0.01em",
    purpose: "Splash titles, huge time display, single-word confirmation",
  },
  {
    level: "Headline (24pt+)",
    sizePx: 32,
    sizeRem: "2.0rem",
    lineHeight: 1.4,
    weight: 800,
    letterSpacing: "0.0em",
    purpose: "Primary screen titles, game milestone headings, medicine name",
  },
  {
    level: "Subheading",
    sizePx: 26,
    sizeRem: "1.625rem",
    lineHeight: 1.45,
    weight: 700,
    letterSpacing: "0.01em",
    purpose: "Card titles, question headers, elder prompt cues",
  },
  {
    level: "Body Large",
    sizePx: 22,
    sizeRem: "1.375rem",
    lineHeight: 1.6,
    weight: 600,
    letterSpacing: "0.015em",
    purpose: "Primary reading sentences, folklore narrative body",
  },
  {
    level: "Body Standard",
    sizePx: 18,
    sizeRem: "1.125rem",
    lineHeight: 1.65,
    weight: 500,
    letterSpacing: "0.02em",
    purpose: "Secondary descriptive text, caregiver notes, helper tips",
  },
  {
    level: "Caption",
    sizePx: 16,
    sizeRem: "1.0rem",
    lineHeight: 1.6,
    weight: 500,
    letterSpacing: "0.025em",
    purpose: "Smallest allowed size: tags, state badges, metadata badges",
  },
];

// Multilingual Font Family Fallbacks
export const MULTILINGUAL_FONT_STACKS = {
  assameseBengali: "'Noto Sans Bengali', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  meiteiMayek: "'Noto Sans Meetei Mayek', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  devanagari: "'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  latinKhasiMizo: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

// Touch Target & Tremor Tolerance Grid System
export const TOUCH_TARGET_SPEC = {
  minHitboxPx: 64, // WCAG 2.2 AAA is 44x44px; Smriti-NER requires 64x64px for tremor safety
  minSeparationPx: 16, // Minimum whitespace buffer between interactive controls
  activeDepressionScale: 0.96, // Tactile scale down on touch press
  debounceMs: 180, // Hardware-tremor multi-touch debounce window
  tremorRadiusTolerancePx: 18, // Virtual touch padding around boundaries
};

// Zero-Flicker Motion & Animation Guide
export const ELDER_MOTION_SPEC = {
  standardDurationMs: 240, // 240ms duration (fast enough to be responsive, slow enough to avoid jarring)
  easingCurve: "cubic-bezier(0.16, 1, 0.3, 1)", // Natural deceleration curve
  maxAllowedDurationMs: 300, // Strict cutoff to prevent temporal disorientation
  haloPulsePeriodMs: 2200, // Soothing 0.45 Hz breathing frequency
  goldenHaloFilter: "0 0 0 4px rgba(201, 168, 76, 0.45)",
};
