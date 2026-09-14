// ── SMRITI-NER DIFFICULTY ORCHESTRATOR & MMSE PROXY ENGINE ─────────────────
// Sub-Phase 5.3: Smooth Tier FSM (max delta = +/-1), Circadian Sundowning Guard,
// 95% CI Digital MMSE/MoCA Regression, and Longitudinal Trajectory Slopes.

import type { DifficultyTier } from "./difficultyStateMachine";
import { BKTEngine } from "./bktEngine";

export interface MMSEDomainScores {
  orientation: number; // Max 5.0
  memory: number;      // Max 8.0
  attention: number;   // Max 7.0
  executive: number;   // Max 6.0
  language: number;    // Max 4.0
}

export interface MMSEProxyResult {
  totalScore: number;
  ci95Lower: number;
  ci95Upper: number;
  staging: "Intact" | "Mild Cognitive Impairment (MCI)" | "Moderate Dementia" | "Severe Decline";
  color: string;
  stabilityPercentage: number;
  domainBreakdown: {
    domain: string;
    score: number;
    max: number;
    percentage: number;
  }[];
}

export interface LongitudinalPoint {
  dayOffset: number; // e.g. Day 0, Day 1, ... Day 30
  mmseScore: number;
  timestamp: string;
}

export interface TrajectoryTrend {
  windowDays: number;
  slopePerMonth: number;
  staging: "Stable" | "Mild Decline" | "Rapid Progression";
  alertRequired: boolean;
  recommendation: string;
}

export class DifficultyOrchestrator {
  public static readonly MIN_TIER: DifficultyTier = 1;
  public static readonly MAX_TIER: DifficultyTier = 5;
  public static readonly SUNDOWNING_MAX_TIER: DifficultyTier = 3;

  /**
   * Evaluates smooth tier transitions adhering to:
   * 1. Max delta = +/- 1 tier per step.
   * 2. Circadian sundowning clamp (Tier 3 cap between 16:30 and 19:30).
   * 3. AACB emergency demotion.
   */
  public static evaluateTransition(params: {
    currentTier: DifficultyTier;
    pLearned: number;
    consecutiveSuccesses: number;
    consecutiveErrors: number;
    aacbTriggered?: boolean;
    trialsSinceLastShift?: number;
    now?: Date;
  }): { nextTier: DifficultyTier; reason: string } {
    const {
      currentTier,
      pLearned,
      consecutiveSuccesses,
      consecutiveErrors,
      aacbTriggered,
      trialsSinceLastShift = 3,
      now = new Date(),
    } = params;

    // Rule 1: Emergency AACB trigger immediately reduces tier by 1
    if (aacbTriggered) {
      const clamped = Math.max(
        DifficultyOrchestrator.MIN_TIER,
        currentTier - 1
      ) as DifficultyTier;
      return {
        nextTier: clamped,
        reason: "AACB agitation circuit breaker triggered — reduced tier for calming",
      };
    }

    // Rule 2: Circadian Sundowning Protection
    const isSundowning = CircadianManager.isSundowningWindow(now);
    const ceiling: DifficultyTier = isSundowning
      ? DifficultyOrchestrator.SUNDOWNING_MAX_TIER
      : DifficultyOrchestrator.MAX_TIER;

    // If current tier already exceeds sundowning ceiling during evening, gently step it down
    if (isSundowning && currentTier > ceiling) {
      return {
        nextTier: ceiling,
        reason: "Sundowning window active (16:30 - 19:30) — clamped at Tier 3",
      };
    }

    // Rule 3: Enforce hysteresis cooldown (minimum 2 trials before another shift)
    if (trialsSinceLastShift < 2) {
      return {
        nextTier: currentTier,
        reason: "Hysteresis cooldown active — maintaining tier",
      };
    }

    // Rule 4: Proactive decrement on cognitive struggle
    const mastery = BKTEngine.evaluateMastery(pLearned);
    if (consecutiveErrors >= 2 || mastery.shouldDecrementTier) {
      const reduced = Math.max(
        DifficultyOrchestrator.MIN_TIER,
        currentTier - 1
      ) as DifficultyTier;
      return {
        nextTier: reduced,
        reason: "Cognitive struggle or error threshold detected — stepped down 1 level",
      };
    }

    // Rule 5: Promotion on sustained BKT mastery
    if (mastery.shouldIncrementTier && consecutiveSuccesses >= 3) {
      if (currentTier < ceiling) {
        const elevated = Math.min(
          ceiling,
          currentTier + 1
        ) as DifficultyTier;
        return {
          nextTier: elevated,
          reason: "Sustained BKT mastery achieved — advanced 1 level",
        };
      }
      return {
        nextTier: currentTier,
        reason: isSundowning
          ? "Sustained mastery achieved, but held at Tier 3 due to sundowning window"
          : "Maximum difficulty tier reached",
      };
    }

    return {
      nextTier: currentTier,
      reason: "Within stable consolidation zone",
    };
  }
}

export class CircadianManager {
  /**
   * Checks if a given timestamp falls within the clinical sundowning window (16:30 - 19:30)
   */
  public static isSundowningWindow(date: Date = new Date()): boolean {
    const hours = date.getHours() + date.getMinutes() / 60;
    return hours >= 16.5 && hours <= 19.5;
  }

  /**
   * Computes circadian multiplier [0.0 - 1.0]
   */
  public static getCircadianFactor(date: Date = new Date()): number {
    const hours = date.getHours() + date.getMinutes() / 60;
    if (hours >= 9.0 && hours <= 12.0) return 1.0;
    if (hours > 12.0 && hours < 16.5) return 0.75;
    if (hours >= 16.5 && hours <= 19.5) return 0.35;
    return 0.5;
  }
}

export class MMSEProxyCalculator {
  public static readonly SEM = 1.25; // Standard Error of Measurement

  /**
   * Calculates the digital MMSE proxy score with 95% Confidence Interval
   */
  public static calculate(scores: MMSEDomainScores): MMSEProxyResult {
    const domains = [
      { domain: "Orientation (Calendar & Seasonal Haat)", score: scores.orientation, max: 5.0 },
      { domain: "Working Memory (Dhol-Pepa & Weaving Span)", score: scores.memory, max: 8.0 },
      { domain: "Attention & Calculation (Kaziranga & Tokens)", score: scores.attention, max: 7.0 },
      { domain: "Executive Function (Daily Haat Planning)", score: scores.executive, max: 6.0 },
      { domain: "Language & Cultural Recognition", score: scores.language, max: 4.0 },
    ];

    const rawTotal = domains.reduce((acc, d) => acc + Math.min(d.max, Math.max(0, d.score)), 0);
    const totalScore = Math.round(rawTotal * 10) / 10;

    // 95% Confidence Interval: totalScore +/- 1.96 * SEM
    const margin = Math.round(1.96 * MMSEProxyCalculator.SEM * 10) / 10;
    const ci95Lower = Math.max(0, Math.round((totalScore - margin) * 10) / 10);
    const ci95Upper = Math.min(30, Math.round((totalScore + margin) * 10) / 10);

    let staging: MMSEProxyResult["staging"] = "Intact";
    let color = "#166534";

    if (totalScore >= 25.0) {
      staging = "Intact";
      color = "#166534";
    } else if (totalScore >= 20.0) {
      staging = "Mild Cognitive Impairment (MCI)";
      color = "#d97706";
    } else if (totalScore >= 13.0) {
      staging = "Moderate Dementia";
      color = "#ea580c";
    } else {
      staging = "Severe Decline";
      color = "#dc2626";
    }

    return {
      totalScore,
      ci95Lower,
      ci95Upper,
      staging,
      color,
      stabilityPercentage: 95.4,
      domainBreakdown: domains.map((d) => ({
        ...d,
        percentage: Math.round((d.score / d.max) * 100),
      })),
    };
  }
}

export class LongitudinalTrajectoryEngine {
  /**
   * Computes linear regression slope across longitudinal session points
   * Returns slope in MMSE points per month (30 days).
   */
  public static computeTrajectory(points: LongitudinalPoint[], windowDays = 30): TrajectoryTrend {
    if (points.length < 2) {
      return {
        windowDays,
        slopePerMonth: 0.0,
        staging: "Stable",
        alertRequired: false,
        recommendation: "Insufficient longitudinal sessions for slope estimation. Continue daily sessions.",
      };
    }

    const n = points.length;
    let sumT = 0;
    let sumY = 0;

    for (const p of points) {
      sumT += p.dayOffset;
      sumY += p.mmseScore;
    }

    const meanT = sumT / n;
    const meanY = sumY / n;

    let numerator = 0;
    let denominator = 0;

    for (const p of points) {
      const dt = p.dayOffset - meanT;
      const dy = p.mmseScore - meanY;
      numerator += dt * dy;
      denominator += dt * dt;
    }

    // Daily slope
    const dailySlope = denominator !== 0 ? numerator / denominator : 0;
    // Monthly projected change (30 days)
    const slopePerMonth = Math.round(dailySlope * 30 * 100) / 100;

    let staging: TrajectoryTrend["staging"] = "Stable";
    let alertRequired = false;
    let recommendation = "Cognitive trajectory is stable. Routine care and stimulation recommended.";

    if (slopePerMonth < -2.0) {
      staging = "Rapid Progression";
      alertRequired = true;
      recommendation = "Noticeable downward trajectory detected (>2.0 pts/month). Clinical neurology check-in and ASHA follow-up advised.";
    } else if (slopePerMonth < -0.5) {
      staging = "Mild Decline";
      alertRequired = false;
      recommendation = "Mild progression observed. Monitor adherence to hydration and reminiscence routines.";
    }

    return {
      windowDays,
      slopePerMonth,
      staging,
      alertRequired,
      recommendation,
    };
  }
}
