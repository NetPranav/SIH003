// ── SMRITI-NER TOUCH STREAM LOGGER & MICRO-TRAJECTORY ANALYZER ────────────
// Sub-Phase 5.1: High-frequency multi-touch event capture, Euclidean wander calculation,
// and micro-tremor frequency band estimation for geriatric psychometrics.

export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
  pressure: number;
}

export interface TrajectoryMetrics {
  pathLengthPx: number;
  directDisplacementPx: number;
  wanderIndex: number;
  pointCount: number;
  durationMs: number;
  tremorFrequencyHz?: number;
  isTremorDetected: boolean;
}

export class TouchStreamLogger {
  private buffer: TouchPoint[] = [];
  private isRecording = false;
  private trialStartTime = 0;
  private targetCentroid?: { x: number; y: number };

  /**
   * Start recording pointer/touch trajectory for a trial
   */
  public startTrial(targetCenter?: { x: number; y: number }): void {
    this.buffer = [];
    this.isRecording = true;
    this.trialStartTime = Date.now();
    this.targetCentroid = targetCenter;
  }

  /**
   * Record a single touch/pointer point
   */
  public recordPoint(x: number, y: number, pressure = 0.5): void {
    if (!this.isRecording) {
      this.startTrial();
    }

    const point: TouchPoint = {
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      timestamp: Date.now(),
      pressure: Math.max(0, Math.min(1.0, pressure)),
    };

    // Throttle duplicate points within 5ms to maintain high performance
    const last = this.buffer[this.buffer.length - 1];
    if (last && point.timestamp - last.timestamp < 5) {
      return;
    }

    this.buffer.push(point);
  }

  /**
   * End trial recording and compute final trajectory metrics
   */
  public endTrial(finalPoint?: { x: number; y: number }): TrajectoryMetrics {
    if (finalPoint) {
      this.recordPoint(finalPoint.x, finalPoint.y);
    }
    this.isRecording = false;

    const metrics = TouchStreamLogger.computeTrajectoryMetrics(this.buffer);
    this.buffer = [];
    return metrics;
  }

  /**
   * Pure mathematical analysis of touch trajectory point sequence
   */
  public static computeTrajectoryMetrics(points: TouchPoint[]): TrajectoryMetrics {
    if (points.length < 2) {
      return {
        pathLengthPx: 0,
        directDisplacementPx: 0,
        wanderIndex: 1.0,
        pointCount: points.length,
        durationMs: 0,
        tremorFrequencyHz: 0,
        isTremorDetected: false,
      };
    }

    let pathLength = 0;
    let directionChanges = 0;
    let lastDx = 0;
    let lastDy = 0;

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const segment = Math.sqrt(dx * dx + dy * dy);
      pathLength += segment;

      // Track micro-directional reversals for tremor frequency estimation
      if (i > 0) {
        if ((dx > 0 && lastDx < 0) || (dx < 0 && lastDx > 0)) directionChanges++;
        if ((dy > 0 && lastDy < 0) || (dy < 0 && lastDy > 0)) directionChanges++;
      }
      lastDx = dx;
      lastDy = dy;
    }

    const first = points[0];
    const last = points[points.length - 1];
    const totalDx = last.x - first.x;
    const totalDy = last.y - first.y;
    const directDisplacement = Math.sqrt(totalDx * totalDx + totalDy * totalDy);

    // Epsilon = 1.0px prevents division by zero on static taps
    const safeDisp = Math.max(1.0, directDisplacement);
    const wanderIndex = Math.max(1.0, Math.round((pathLength / safeDisp) * 100) / 100);

    const durationMs = Math.max(1, last.timestamp - first.timestamp);
    const durationSec = durationMs / 1000;

    // Estimate dominant tremor frequency (cycles per second)
    const cycles = directionChanges / 4; // 4 directional flips ≈ 1 oscillation cycle
    const tremorFrequencyHz = durationSec > 0.15
      ? Math.round((cycles / durationSec) * 10) / 10
      : 0;

    // Geriatric essential, postural, and Parkinsonian tremor band: 3.0Hz to 11.5Hz
    const isTremorDetected = wanderIndex > 1.35 && tremorFrequencyHz >= 3.0 && tremorFrequencyHz <= 11.5;

    return {
      pathLengthPx: Math.round(pathLength * 10) / 10,
      directDisplacementPx: Math.round(directDisplacement * 10) / 10,
      wanderIndex,
      pointCount: points.length,
      durationMs,
      tremorFrequencyHz,
      isTremorDetected,
    };
  }
}

export const touchStreamLogger = new TouchStreamLogger();
