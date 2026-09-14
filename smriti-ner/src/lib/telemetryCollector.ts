// ── SMRITI-NER TELEMETRY COLLECTOR & MOTOR DECOMPOSITION ENGINE ──────────────
// Sub-Phase 4.3: Precision touch deviation, bi-factor latency & vector packaging

export interface TrialTelemetry {
  trialIndex: number;
  timestamp: number;
  targetId: string;
  selectedId: string;
  isCorrect: boolean;
  totalReactionTimeMs: number;
  motorLatencyMs: number;
  deliberationLatencyMs: number;
  touchCoordinates?: { x: number; y: number };
  targetCenter?: { x: number; y: number };
  spatialDeviationPx?: number;
  difficultyTier: number;
  aacbTriggered: boolean;
}

export type SessionTelemetryVector = [
  number, // 0: RT_total_avg (ms)
  number, // 1: tau_motor_avg (ms)
  number, // 2: RT_delib_avg (ms)
  number, // 3: accuracy [0.0, 1.0]
  number, // 4: difficulty_tier [1, 5]
  number, // 5: aacb_flag [0 or 1]
  number  // 6: circadian_factor [0.0, 1.0]
];

/**
 * Decomposes raw reaction time into physiological motor wander vs genuine cognitive deliberation.
 * tau_motor = kappa * ln(Omega_wander) + delta_baseline
 * RT_delib = max(80ms, RT_total - tau_motor)
 */
export function decomposeReactionTime(
  totalReactionTimeMs: number,
  wanderIndex = 1.15,
  baselineMotorMs = 280,
  kappa = 240
): { motorLatencyMs: number; deliberationLatencyMs: number } {
  const safeWander = Math.max(1.0, wanderIndex);
  const tauMotor = Math.round(kappa * Math.log(safeWander) + baselineMotorMs);
  const deliberation = Math.max(80, totalReactionTimeMs - tauMotor);

  return {
    motorLatencyMs: tauMotor,
    deliberationLatencyMs: deliberation,
  };
}

/**
 * Computes spatial deviation between touch point and target button center.
 */
export function computeSpatialDeviation(
  touch?: { x: number; y: number },
  target?: { x: number; y: number }
): number | undefined {
  if (!touch || !target) return undefined;
  const dx = touch.x - target.x;
  const dy = touch.y - target.y;
  return Math.round(Math.sqrt(dx * dx + dy * dy));
}

/**
 * Constructs a comprehensive TrialTelemetry object with calculated motor latencies.
 */
export function createTrialTelemetry(params: {
  trialIndex: number;
  targetId: string;
  selectedId: string;
  isCorrect: boolean;
  totalReactionTimeMs: number;
  touchCoordinates?: { x: number; y: number };
  targetCenter?: { x: number; y: number };
  difficultyTier: number;
  aacbTriggered?: boolean;
}): TrialTelemetry {
  const { motorLatencyMs, deliberationLatencyMs } = decomposeReactionTime(
    params.totalReactionTimeMs
  );

  const spatialDeviationPx = computeSpatialDeviation(
    params.touchCoordinates,
    params.targetCenter
  );

  return {
    trialIndex: params.trialIndex,
    timestamp: Date.now(),
    targetId: params.targetId,
    selectedId: params.selectedId,
    isCorrect: params.isCorrect,
    totalReactionTimeMs: params.totalReactionTimeMs,
    motorLatencyMs,
    deliberationLatencyMs,
    touchCoordinates: params.touchCoordinates,
    targetCenter: params.targetCenter,
    spatialDeviationPx,
    difficultyTier: params.difficultyTier,
    aacbTriggered: Boolean(params.aacbTriggered),
  };
}

/**
 * Computes the standardized 7-element telemetry vector for the session.
 * Used for on-device Federated Learning and longitudinal caregiver analytics.
 */
export function computeSessionTelemetryVector(
  trials: TrialTelemetry[],
  currentTier: number,
  aacbTriggered: boolean
): SessionTelemetryVector {
  if (trials.length === 0) {
    return [0, 280, 80, 0, currentTier, aacbTriggered ? 1 : 0, getCircadianFactor()];
  }

  let sumRt = 0;
  let sumTau = 0;
  let sumDelib = 0;
  let correctCount = 0;

  for (const t of trials) {
    sumRt += t.totalReactionTimeMs;
    sumTau += t.motorLatencyMs;
    sumDelib += t.deliberationLatencyMs;
    if (t.isCorrect) correctCount++;
  }

  const n = trials.length;
  const avgRt = Math.round(sumRt / n);
  const avgTau = Math.round(sumTau / n);
  const avgDelib = Math.round(sumDelib / n);
  const accuracy = Math.round((correctCount / n) * 100) / 100;
  const aacbFlag = aacbTriggered ? 1 : 0;
  const circadianFactor = getCircadianFactor();

  return [avgRt, avgTau, avgDelib, accuracy, currentTier, aacbFlag, circadianFactor];
}

/**
 * Circadian Sundowning Factor [0.0 = bright morning, 1.0 = peak sundowning evening 17:00-19:00]
 */
export function getCircadianFactor(): number {
  const hour = new Date().getHours();
  // Peak sundowning is roughly 16:30 - 19:30
  if (hour >= 16 && hour <= 19) {
    return 0.85;
  } else if (hour >= 20 || hour <= 6) {
    return 0.60; // Late night / early dawn
  } else {
    return 0.15; // Optimal daytime window
  }
}
