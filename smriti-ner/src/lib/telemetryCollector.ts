// ── SMRITI-NER TELEMETRY COLLECTOR & MOTOR DECOMPOSITION ENGINE ──────────────
// Sub-Phase 5.1: Precision touch deviation, bi-factor latency decomposition,
// micro-tremor filtering, and 7-element Session Telemetry Vector schema.

import { touchStreamLogger, type TrajectoryMetrics } from "./touchStreamLogger";

export interface TrialTelemetry {
  trialIndex: number;
  timestamp: number;
  targetId: string;
  selectedId: string;
  isCorrect: boolean;
  totalReactionTimeMs: number;
  motorLatencyMs: number;
  deliberationLatencyMs: number;
  deliberationZScore?: number;
  touchCoordinates?: { x: number; y: number };
  targetCenter?: { x: number; y: number };
  spatialDeviationPx?: number;
  wanderIndex: number;
  tremorFrequencyHz?: number;
  isTremorDetected: boolean;
  difficultyTier: number;
  aacbTriggered: boolean;
}

/**
 * Standardized 7-element telemetry vector for on-device Federated Learning
 * and longitudinal clinical neuropsychological monitoring:
 * [RT_total_avg, tau_motor_avg, RT_delib_avg, accuracy, difficulty_tier, aacb_flag, circadian_factor]
 */
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
 * Computes z-score of cognitive deliberation latency relative to baseline
 */
export function calculateDeliberationZScore(
  deliberationMs: number,
  meanDeliberationMs = 950,
  stdDeliberationMs = 380
): number {
  const std = Math.max(1, stdDeliberationMs);
  return Math.round(((deliberationMs - meanDeliberationMs) / std) * 100) / 100;
}

/**
 * Computes spatial deviation between touch point and target button centroid
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
 * Constructs a comprehensive TrialTelemetry record with bi-factor latency isolation
 */
export function createTrialTelemetry(params: {
  trialIndex: number;
  targetId: string;
  selectedId: string;
  isCorrect: boolean;
  totalReactionTimeMs: number;
  touchCoordinates?: { x: number; y: number };
  targetCenter?: { x: number; y: number };
  trajectoryMetrics?: TrajectoryMetrics;
  difficultyTier: number;
  aacbTriggered?: boolean;
}): TrialTelemetry {
  const wanderIndex = params.trajectoryMetrics?.wanderIndex ?? 1.15;
  const { motorLatencyMs, deliberationLatencyMs } = decomposeReactionTime(
    params.totalReactionTimeMs,
    wanderIndex
  );

  const deliberationZScore = calculateDeliberationZScore(deliberationLatencyMs);

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
    deliberationZScore,
    touchCoordinates: params.touchCoordinates,
    targetCenter: params.targetCenter,
    spatialDeviationPx,
    wanderIndex,
    tremorFrequencyHz: params.trajectoryMetrics?.tremorFrequencyHz,
    isTremorDetected: Boolean(params.trajectoryMetrics?.isTremorDetected),
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
 * Validates whether a given vector strictly adheres to the 7-element schema
 */
export function validateSessionTelemetryVector(v: unknown): v is SessionTelemetryVector {
  if (!Array.isArray(v) || v.length !== 7) return false;
  const [rt, tau, delib, acc, tier, aacb, circ] = v;
  return (
    typeof rt === "number" && rt >= 0 &&
    typeof tau === "number" && tau >= 0 &&
    typeof delib === "number" && delib >= 0 &&
    typeof acc === "number" && acc >= 0 && acc <= 1 &&
    typeof tier === "number" && tier >= 1 && tier <= 5 &&
    (aacb === 0 || aacb === 1) &&
    typeof circ === "number" && circ >= 0 && circ <= 1
  );
}

/**
 * Computes a circadian multiplier based on local time-of-day.
 * Peak lucidity window (09:00 - 11:30): ~1.0
 * Sundowning window (16:30 - 19:30): ~0.20 - 0.45
 */
export function getCircadianFactor(date: Date = new Date()): number {
  const hours = date.getHours() + date.getMinutes() / 60;

  // Morning lucidity peak: 9am - 12pm
  if (hours >= 9 && hours <= 12) {
    return 1.0;
  }
  // Early afternoon steady state: 12pm - 4:30pm
  if (hours > 12 && hours < 16.5) {
    return 0.75;
  }
  // Sundowning vulnerability window: 4:30pm - 7:30pm
  if (hours >= 16.5 && hours <= 19.5) {
    return 0.35;
  }
  // Night / resting: 7:30pm - 9am
  return 0.5;
}
