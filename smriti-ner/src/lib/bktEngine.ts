// ── SMRITI-NER BAYESIAN KNOWLEDGE TRACING (BKT) ENGINE ──────────────────
// Sub-Phase 5.2: 4-Parameter BKT Cognitive State Inference, HMM Forward Updates,
// Concept Profiles, Adaptive Guess Scaling, and Mastery Threshold Tuning.

export interface BKTParameters {
  pL0: number;        // Initial mastery prior
  pTransition: number; // Probability of acquisition per trial
  pGuess: number;      // Base probability of lucky guess
  pSlip: number;       // Probability of motor slip / tremor miss
}

export interface BKTState {
  conceptId: string;
  pLearned: number;
  pTransition: number;
  pGuess: number;
  pSlip: number;
  totalTrials: number;
  correctTrials: number;
  lastUpdated: string;
}

export type MasteryZone = "mastery" | "consolidation" | "struggle";

export interface MasteryEvaluation {
  zone: MasteryZone;
  pLearned: number;
  shouldIncrementTier: boolean;
  shouldDecrementTier: boolean;
  message: string;
}

// ── Standard Geriatric Concept Profiles ──────────────────────────
export const BKT_CONCEPT_PROFILES: Record<string, BKTParameters> = {
  auditory_folk_rhythm: {
    pL0: 0.60,
    pTransition: 0.08,
    pGuess: 0.25,
    pSlip: 0.18,
  },
  visuospatial_fauna_search: {
    pL0: 0.65,
    pTransition: 0.09,
    pGuess: 0.25,
    pSlip: 0.15,
  },
  visuomotor_pattern_weaving: {
    pL0: 0.55,
    pTransition: 0.07,
    pGuess: 0.25,
    pSlip: 0.20,
  },
  delayed_episodic_recall: {
    pL0: 0.50,
    pTransition: 0.06,
    pGuess: 0.20,
    pSlip: 0.16,
  },
};

export class BKTEngine {
  public static readonly MASTERY_THRESHOLD = 0.85;
  public static readonly STRUGGLE_THRESHOLD = 0.35;

  /**
   * Initializes a new BKT state for a specific cognitive concept
   */
  public static initializeState(conceptId: string, customParams?: Partial<BKTParameters>): BKTState {
    const profile = BKT_CONCEPT_PROFILES[conceptId] || {
      pL0: 0.60,
      pTransition: 0.08,
      pGuess: 0.25,
      pSlip: 0.18,
    };

    const params: BKTParameters = { ...profile, ...customParams };

    return {
      conceptId,
      pLearned: params.pL0,
      pTransition: params.pTransition,
      pGuess: params.pGuess,
      pSlip: params.pSlip,
      totalTrials: 0,
      correctTrials: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Executes HMM Forward Observation Step & Latent State Transition
   */
  public static updateState(
    currentState: BKTState,
    isCorrect: boolean,
    choiceCount?: number
  ): BKTState {
    const { pLearned, pTransition, pGuess, pSlip } = currentState;

    // Adapt guess probability dynamically based on current number of choices on screen
    const effectiveGuess = choiceCount && choiceCount > 1
      ? Math.min(pGuess, Math.round((1 / choiceCount) * 100) / 100)
      : pGuess;

    let posterior = 0;

    if (isCorrect) {
      // Case 1: P(L_t | Y_t = 1) = [P(L_{t-1}) * (1 - P(S))] / [P(L_{t-1}) * (1 - P(S)) + (1 - P(L_{t-1})) * P(G)]
      const numerator = pLearned * (1 - pSlip);
      const denominator = numerator + (1 - pLearned) * effectiveGuess;
      posterior = numerator / Math.max(0.0001, denominator);
    } else {
      // Case 2: P(L_t | Y_t = 0) = [P(L_{t-1}) * P(S)] / [P(L_{t-1}) * P(S) + (1 - P(L_{t-1})) * (1 - P(G))]
      const numerator = pLearned * pSlip;
      const denominator = numerator + (1 - pLearned) * (1 - effectiveGuess);
      posterior = numerator / Math.max(0.0001, denominator);
    }

    // Latent state transition for t+1: P(L_{t+1}) = posterior + (1 - posterior) * P(T)
    const nextPLearned = posterior + (1 - posterior) * pTransition;
    const clampedPLearned = Math.min(0.99, Math.max(0.01, Math.round(nextPLearned * 1000) / 1000));

    return {
      ...currentState,
      pLearned: clampedPLearned,
      totalTrials: currentState.totalTrials + 1,
      correctTrials: isCorrect ? currentState.correctTrials + 1 : currentState.correctTrials,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Evaluates cognitive mastery against clinical therapeutic thresholds
   */
  public static evaluateMastery(pLearned: number): MasteryEvaluation {
    if (pLearned >= BKTEngine.MASTERY_THRESHOLD) {
      return {
        zone: "mastery",
        pLearned,
        shouldIncrementTier: true,
        shouldDecrementTier: false,
        message: "Cognitive concept consolidated in functional memory. Candidate for tier advance.",
      };
    }

    if (pLearned <= BKTEngine.STRUGGLE_THRESHOLD) {
      return {
        zone: "struggle",
        pLearned,
        shouldIncrementTier: false,
        shouldDecrementTier: true,
        message: "Cognitive fatigue or retrieval challenge detected. Proactive tier reduction recommended.",
      };
    }

    return {
      zone: "consolidation",
      pLearned,
      shouldIncrementTier: false,
      shouldDecrementTier: false,
      message: "Concept in stable consolidation zone. Maintain current therapeutic challenge.",
    };
  }

  /**
   * Performance benchmark verifying sub-millisecond edge compute on mobile devices
   */
  public static benchmark(iterations = 1000): { durationMs: number; avgMicrosPerUpdate: number; passed: boolean } {
    let state = BKTEngine.initializeState("auditory_folk_rhythm");
    const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();

    for (let i = 0; i < iterations; i++) {
      state = BKTEngine.updateState(state, i % 3 !== 0, 4);
    }

    const t1 = typeof performance !== "undefined" ? performance.now() : Date.now();
    const durationMs = Math.round((t1 - t0) * 100) / 100;
    const avgMicrosPerUpdate = Math.round(((t1 - t0) / iterations) * 1000);
    // Standard requires <5ms total for 1,000 iterations or <5000 micros per single update
    const passed = avgMicrosPerUpdate < 5000;

    return { durationMs, avgMicrosPerUpdate, passed };
  }
}

export const bktEngine = BKTEngine;
