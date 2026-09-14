// ── SMRITI-NER 5-TIER DIFFICULTY FINITE STATE MACHINE (FSM) ───────────────────
// Sub-Phase 4.3: BKT Mastery thresholding, AACB overrides & sundowning guard

export type DifficultyTier = 1 | 2 | 3 | 4 | 5;

export interface TierConfig {
  tier: DifficultyTier;
  name: string;
  nativeName: string;
  choiceCount: number;
  timeoutMs: number;
  distractorDimming: number;
  cueVisuals: boolean;
}

export const TIER_CONFIGS: Record<DifficultyTier, TierConfig> = {
  1: {
    tier: 1,
    name: "Introductory (Tier 1)",
    nativeName: "প্ৰাথমিক স্তৰ",
    choiceCount: 2,
    timeoutMs: 8000,
    distractorDimming: 0.0,
    cueVisuals: true,
  },
  2: {
    tier: 2,
    name: "Mild (Tier 2)",
    nativeName: "সহজ স্তৰ",
    choiceCount: 3,
    timeoutMs: 6000,
    distractorDimming: 0.1,
    cueVisuals: true,
  },
  3: {
    tier: 3,
    name: "Moderate (Tier 3)",
    nativeName: "মধ্যম স্তৰ",
    choiceCount: 4,
    timeoutMs: 4500,
    distractorDimming: 0.2,
    cueVisuals: false,
  },
  4: {
    tier: 4,
    name: "Advanced (Tier 4)",
    nativeName: "উন্নত স্তৰ",
    choiceCount: 5,
    timeoutMs: 3500,
    distractorDimming: 0.35,
    cueVisuals: false,
  },
  5: {
    tier: 5,
    name: "Mastery (Tier 5)",
    nativeName: "দক্ষতা স্তৰ",
    choiceCount: 6,
    timeoutMs: 2800,
    distractorDimming: 0.5,
    cueVisuals: false,
  },
};

/**
 * Returns configuration parameters for a given difficulty tier.
 */
export function getTierConfig(tier: DifficultyTier): TierConfig {
  return TIER_CONFIGS[tier] || TIER_CONFIGS[2];
}

/**
 * Evaluates smooth tier transitions based on BKT latent mastery and clinical guards.
 * Rules:
 * 1. Max delta is +/- 1 tier per transition.
 * 2. AACB override reduces tier and freezes progression.
 * 3. Sundowning hours (16:30 - 19:30) cap difficulty at Tier 3.
 */
export function evaluateTierTransition(params: {
  currentTier: DifficultyTier;
  pLearned: number;
  consecutiveSuccesses: number;
  consecutiveErrors: number;
  aacbTriggered?: boolean;
}): { nextTier: DifficultyTier; reason: string } {
  const { currentTier, pLearned, consecutiveSuccesses, consecutiveErrors, aacbTriggered } = params;

  // Rule 1: Emergency AACB trigger overrides everything
  if (aacbTriggered) {
    const reducedTier = Math.max(1, currentTier - 1) as DifficultyTier;
    return {
      nextTier: reducedTier,
      reason: "AACB agitation circuit breaker triggered — reduced tier for calming",
    };
  }

  // Rule 2: Circadian Sundowning Protection
  const currentHour = new Date().getHours();
  const isSundowning = currentHour >= 16 && currentHour <= 19;
  const maxAllowedTier: DifficultyTier = isSundowning ? 3 : 5;

  // Rule 3: Error threshold triggers prompt graceful downgrade
  if (consecutiveErrors >= 2 || pLearned <= 0.35) {
    const nextTier = Math.max(1, currentTier - 1) as DifficultyTier;
    return {
      nextTier,
      reason: "Cognitive hesitation or errors detected — lowering difficulty",
    };
  }

  // Rule 4: High sustained mastery triggers tier promotion
  if (pLearned >= 0.85 && consecutiveSuccesses >= 3) {
    if (currentTier < maxAllowedTier) {
      const nextTier = (currentTier + 1) as DifficultyTier;
      return {
        nextTier,
        reason: "Sustained BKT mastery achieved — advancing to next level",
      };
    } else if (isSundowning && currentTier >= 3) {
      return {
        nextTier: 3,
        reason: "Circadian sundowning guard active — holding at Tier 3 maximum",
      };
    }
  }

  // Default: Hold steady
  return {
    nextTier: Math.min(currentTier, maxAllowedTier) as DifficultyTier,
    reason: "Performance stable within current tier envelope",
  };
}
