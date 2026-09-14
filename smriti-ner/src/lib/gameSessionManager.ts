// ── SMRITI-NER GAME SESSION MANAGER ──────────────────────────────────────────
// Sub-Phase 4.3: Session lifecycle, BKT updates, AACB guards & local persistence

import {
  type TrialTelemetry,
  type SessionTelemetryVector,
  createTrialTelemetry,
  computeSessionTelemetryVector,
} from "./telemetryCollector";
import {
  type DifficultyTier,
  evaluateTierTransition,
  getTierConfig,
} from "./difficultyStateMachine";
import {
  updateBKT,
  evaluateAACB,
  type BKTState,
  type AACBEvaluation,
} from "./dcdaEngine";

export interface GameSessionState {
  sessionId: string;
  gameId: string;
  conceptId: string;
  patientPseudoId: string;
  startedAt: number;
  currentTier: DifficultyTier;
  bktState: BKTState;
  trials: TrialTelemetry[];
  consecutiveSuccesses: number;
  consecutiveErrors: number;
  aacbStatus: AACBEvaluation;
  isComplete: boolean;
}

export interface GameSessionSummary {
  sessionId: string;
  gameId: string;
  durationSeconds: number;
  totalTrials: number;
  accuracy: number;
  averageReactionTimeMs: number;
  averageMotorHesitationMs: number;
  finalMasteryProbability: number;
  aacbTriggered: boolean;
  telemetryVector: SessionTelemetryVector;
  timestamp: string;
}

const STORAGE_KEY = "smriti_game_sessions";

class GameSessionManager {
  private activeSession: GameSessionState | null = null;

  /**
   * Initializes and starts a new cognitive gaming session.
   */
  startSession(params: {
    gameId: string;
    conceptId: string;
    initialTier?: DifficultyTier;
    patientPseudoId?: string;
  }): GameSessionState {
    const sessionId = `ses_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const tier = params.initialTier || 2;

    const initialBkt: BKTState = {
      conceptId: params.conceptId,
      pLearned: 0.65,
      pTransition: 0.08,
      pGuess: 0.25,
      pSlip: 0.18,
      lastUpdated: new Date().toISOString(),
    };

    const initialAacb: AACBEvaluation = {
      avi: 0.5,
      triggered: false,
      consecutiveErrors: 0,
      goldenHaloActive: false,
      distractorDimming: 1.0,
      hitboxMultiplier: 1.0,
    };

    this.activeSession = {
      sessionId,
      gameId: params.gameId,
      conceptId: params.conceptId,
      patientPseudoId: params.patientPseudoId || "elder_guwahati_01",
      startedAt: Date.now(),
      currentTier: tier,
      bktState: initialBkt,
      trials: [],
      consecutiveSuccesses: 0,
      consecutiveErrors: 0,
      aacbStatus: initialAacb,
      isComplete: false,
    };

    return { ...this.activeSession };
  }

  /**
   * Records an individual trial interaction, updates BKT, evaluates AACB and difficulty tier.
   */
  recordInteraction(params: {
    targetId: string;
    selectedId: string;
    totalReactionTimeMs: number;
    touchCoordinates?: { x: number; y: number };
    targetCenter?: { x: number; y: number };
    trajectoryMetrics?: import("./touchStreamLogger").TrajectoryMetrics;
  }): { session: GameSessionState; aacb: AACBEvaluation } {
    if (!this.activeSession) {
      throw new Error("No active game session found. Call startSession first.");
    }

    const isCorrect = params.targetId === params.selectedId;

    // 1. Update streak counts
    const consecutiveErrors = isCorrect ? 0 : this.activeSession.consecutiveErrors + 1;
    const consecutiveSuccesses = isCorrect ? this.activeSession.consecutiveSuccesses + 1 : 0;

    // 2. Evaluate AACB (Anti-Agitation Circuit Breaker)
    const wander = params.trajectoryMetrics?.wanderIndex ?? (isCorrect ? 1.15 : 1.45);
    const aacb = evaluateAACB(consecutiveErrors, wander);

    // 3. Create Trial Telemetry record
    const trial = createTrialTelemetry({
      trialIndex: this.activeSession.trials.length + 1,
      targetId: params.targetId,
      selectedId: params.selectedId,
      isCorrect,
      totalReactionTimeMs: params.totalReactionTimeMs,
      touchCoordinates: params.touchCoordinates,
      targetCenter: params.targetCenter,
      trajectoryMetrics: params.trajectoryMetrics,
      difficultyTier: this.activeSession.currentTier,
      aacbTriggered: aacb.triggered,
    });

    // 4. Update BKT mastery
    const updatedBkt = updateBKT(this.activeSession.bktState, isCorrect);

    // 5. Evaluate Difficulty Tier transition
    const { nextTier } = evaluateTierTransition({
      currentTier: this.activeSession.currentTier,
      pLearned: updatedBkt.pLearned,
      consecutiveSuccesses,
      consecutiveErrors,
      aacbTriggered: aacb.triggered,
    });

    // 6. Mutate active session
    this.activeSession.trials.push(trial);
    this.activeSession.bktState = updatedBkt;
    this.activeSession.currentTier = nextTier;
    this.activeSession.consecutiveSuccesses = consecutiveSuccesses;
    this.activeSession.consecutiveErrors = consecutiveErrors;
    this.activeSession.aacbStatus = aacb;

    return { session: { ...this.activeSession }, aacb };
  }

  /**
   * Finalizes the current session, constructs telemetry vectors, and persists to storage.
   */
  endSession(): GameSessionSummary {
    if (!this.activeSession) {
      throw new Error("No active game session found to end.");
    }

    const { trials, startedAt, sessionId, gameId, currentTier, bktState, aacbStatus } = this.activeSession;
    const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    const totalTrials = trials.length;

    let correctCount = 0;
    let sumRt = 0;
    let sumTau = 0;

    for (const t of trials) {
      if (t.isCorrect) correctCount++;
      sumRt += t.totalReactionTimeMs;
      sumTau += t.motorLatencyMs;
    }

    const accuracy = totalTrials > 0 ? Math.round((correctCount / totalTrials) * 100) : 100;
    const averageReactionTimeMs = totalTrials > 0 ? Math.round(sumRt / totalTrials) : 600;
    const averageMotorHesitationMs = totalTrials > 0 ? Math.round(sumTau / totalTrials) : 280;

    const telemetryVector = computeSessionTelemetryVector(
      trials,
      currentTier,
      aacbStatus.triggered
    );

    const summary: GameSessionSummary = {
      sessionId,
      gameId,
      durationSeconds,
      totalTrials,
      accuracy,
      averageReactionTimeMs,
      averageMotorHesitationMs,
      finalMasteryProbability: Math.round(bktState.pLearned * 100) / 100,
      aacbTriggered: aacbStatus.triggered,
      telemetryVector,
      timestamp: new Date().toISOString(),
    };

    this.activeSession.isComplete = true;

    // Persist to localStorage
    if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        existing.unshift(summary);
        // Keep last 50 sessions locally
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
      } catch (err) {
        console.warn("Failed to persist session to localStorage:", err);
      }
    }

    this.activeSession = null;
    return summary;
  }

  /**
   * Returns current active session if running.
   */
  getActiveSession(): GameSessionState | null {
    return this.activeSession ? { ...this.activeSession } : null;
  }

  /**
   * Reads all stored historical sessions from localStorage.
   */
  getPastSessions(): GameSessionSummary[] {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      } catch {
        return [];
      }
    }
    return [];
  }
}

export const sessionManager = new GameSessionManager();
