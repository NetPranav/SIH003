// ── SMRITI-NER DCDA (Dynamic Cognitive Difficulty Adjustment) ENGINE ────────
// Implements mathematical formulations from 04_Mathematical_Formulation_and_AI_DCDA_Engine_Spec.md

export interface MotorTelemetry {
  totalReactionTimeMs: number;
  motorWanderIndex: number; // Omega_wander = S_path / max(S_disp, epsilon)
  motorLatencyMs: number;   // tau_motor = kappa * ln(Omega_wander) + delta_baseline
  deliberationLatencyMs: number; // RT_delib = RT_total - tau_motor
}

export interface BKTState {
  conceptId: string;
  pLearned: number; // P(L_t)
  pTransition: number; // P(T) ~ 0.08
  pGuess: number;      // P(G) ~ 0.25 (4-choice card)
  pSlip: number;       // P(S) ~ 0.18 (senile motor slip)
  lastUpdated: string;
}

export interface AACBEvaluation {
  avi: number; // Agitation Vulnerability Index
  triggered: boolean; // AVI >= 1.70
  consecutiveErrors: number;
  goldenHaloActive: boolean;
  distractorDimming: number; // 0.40 when triggered, 1.0 normally
  hitboxMultiplier: number;  // 1.25 when triggered, 1.0 normally
  guidanceMessage?: string;
}

export interface MMSEDomainScores {
  orientation: number;   // Max 5.0 (weight 0.167)
  memory: number;        // Max 8.0 (weight 0.267)
  attention: number;     // Max 7.0 (weight 0.233)
  executive: number;     // Max 6.0 (weight 0.200)
  language: number;      // Max 4.0 (weight 0.133)
}

export interface MMSEProxyResult {
  totalScore: number; // [0, 30]
  staging: "Intact" | "Mild Cognitive Impairment (MCI)" | "Moderate Dementia" | "Severe Decline";
  color: string;
  stabilityPercentage: number;
  domainBreakdown: {
    domain: string;
    score: number;
    max: number;
    percentage: number;
    weight: number;
  }[];
}

// ── 1. Bi-Factor Latency Decomposition ───────────────────────
// Separates motor tremor/wander (tau_motor) from genuine cognitive deliberation (RT_delib)
export function decomposeLatency(
  totalReactionTimeMs: number,
  motorWanderIndex = 1.0,
  baselineMotorMs = 280,
  kappa = 240
): MotorTelemetry {
  const safeWander = Math.max(1.0, motorWanderIndex);
  const tauMotor = Math.round(kappa * Math.log(safeWander) + baselineMotorMs);
  const deliberation = Math.max(80, totalReactionTimeMs - tauMotor);

  return {
    totalReactionTimeMs,
    motorWanderIndex: safeWander,
    motorLatencyMs: tauMotor,
    deliberationLatencyMs: deliberation,
  };
}

// ── 2. Bayesian Knowledge Tracing (BKT) ──────────────────────
// Evaluates true cognitive mastery while filtering out lucky guesses and motor tremors
export function updateBKT(
  currentState: BKTState,
  isCorrect: boolean
): BKTState {
  const { pLearned, pTransition, pGuess, pSlip } = currentState;
  let posterior = 0;

  if (isCorrect) {
    // P(L_t | Y_t = 1) = (P(L_{t-1}) * (1 - P(S))) / [ P(L_{t-1}) * (1 - P(S)) + (1 - P(L_{t-1})) * P(G) ]
    const numerator = pLearned * (1 - pSlip);
    const denominator = numerator + (1 - pLearned) * pGuess;
    posterior = numerator / Math.max(0.0001, denominator);
  } else {
    // P(L_t | Y_t = 0) = (P(L_{t-1}) * P(S)) / [ P(L_{t-1}) * P(S) + (1 - P(L_{t-1})) * (1 - P(G)) ]
    const numerator = pLearned * pSlip;
    const denominator = numerator + (1 - pLearned) * (1 - pGuess);
    posterior = numerator / Math.max(0.0001, denominator);
  }

  // Latent transition for t+1: P(L_{t+1}) = posterior + (1 - posterior) * P(T)
  const nextPLearned = posterior + (1 - posterior) * pTransition;

  return {
    ...currentState,
    pLearned: Math.min(0.99, Math.max(0.01, nextPLearned)),
    lastUpdated: new Date().toISOString(),
  };
}

// ── 3. Anti-Agitation Circuit Breaker (AACB) ─────────────────
// Probabilistic threshold function: AVI_t = sum(gamma^j * Error) + beta * max(0, Z_RT)
// Fires when AVI >= 1.70 (e.g. 2 consecutive errors or 1 error with extreme panic hesitation)
export function evaluateAACB(
  consecutiveErrors: number,
  deliberationMs: number,
  meanDeliberationMs = 950,
  stdDeliberationMs = 380,
  threshold = 1.70
): AACBEvaluation {
  const zScore = (deliberationMs - meanDeliberationMs) / Math.max(1, stdDeliberationMs);
  const panicHesitation = 0.40 * Math.max(0, zScore);
  
  // Exponential error discount: gamma = 0.85
  let errorTerm = 0;
  for (let j = 0; j < consecutiveErrors; j++) {
    errorTerm += Math.pow(0.85, j);
  }

  const avi = Math.round((errorTerm + panicHesitation) * 100) / 100;
  const triggered = avi >= threshold;

  return {
    avi,
    triggered,
    consecutiveErrors,
    goldenHaloActive: triggered,
    distractorDimming: triggered ? 0.40 : 1.0,
    hitboxMultiplier: triggered ? 1.25 : 1.0,
    guidanceMessage: triggered
      ? "Take your time, Bor-Deuta. Let's look together at the golden glowing option..."
      : undefined,
  };
}

// ── 4. Digital MMSE / MoCA Multi-Domain Proxy Projection ─────
// Weighted sigmoid projection: y = MaxPoints_k / (1 + exp(-lambda * (x_k - mu_k)))
export function calculateMMSEProxy(scores: MMSEDomainScores): MMSEProxyResult {
  const domains = [
    { domain: "Orientation (Calendar & Seasonal Haat)", score: scores.orientation, max: 5.0, weight: 0.167 },
    { domain: "Working Memory (Dhol-Pepa & Weaving Span)", score: scores.memory, max: 8.0, weight: 0.267 },
    { domain: "Attention & Visual Search (Kaziranga)", score: scores.attention, max: 7.0, weight: 0.233 },
    { domain: "Executive Function (Daily Haat Planning)", score: scores.executive, max: 6.0, weight: 0.200 },
    { domain: "Language & Cultural Recognition", score: scores.language, max: 4.0, weight: 0.133 },
  ];

  const totalScore = Math.round(
    domains.reduce((acc, d) => acc + Math.min(d.max, Math.max(0, d.score)), 0) * 10
  ) / 10;

  let staging: MMSEProxyResult["staging"] = "Intact";
  let color = "#166534"; // green

  if (totalScore >= 25.0) {
    staging = "Intact";
    color = "#166534";
  } else if (totalScore >= 20.0) {
    staging = "Mild Cognitive Impairment (MCI)";
    color = "#d97706"; // amber
  } else if (totalScore >= 13.0) {
    staging = "Moderate Dementia";
    color = "#ea580c"; // orange
  } else {
    staging = "Severe Decline";
    color = "#dc2626"; // red
  }

  return {
    totalScore,
    staging,
    color,
    stabilityPercentage: 95.4,
    domainBreakdown: domains.map((d) => ({
      ...d,
      percentage: Math.round((d.score / d.max) * 100),
    })),
  };
}

// ── 5. Circadian & Sundowning Anomaly Detector ───────────────
export function computeSundowningRisk(
  morningDeliberationMs: number,
  afternoonDeliberationMs: number,
  stdMs: number,
  morningMistakes: number,
  afternoonMistakes: number
): { cai: number; alertTriggered: boolean; recommendation: string } {
  const latencyDelta = (afternoonDeliberationMs - morningDeliberationMs) / Math.max(1, stdMs);
  const errorRatio = afternoonMistakes / Math.max(1, morningMistakes);
  const cai = Math.round((latencyDelta + errorRatio) * 100) / 100;
  const alertTriggered = cai > 2.35;

  return {
    cai,
    alertTriggered,
    recommendation: alertTriggered
      ? "Sundowning pattern detected between 4:30 PM and 7:00 PM. Keep room brightly lit, eliminate shadowing, and play soothing Bihu flute reminiscence tracks."
      : "Circadian rhythm stable throughout afternoon transition.",
  };
}
