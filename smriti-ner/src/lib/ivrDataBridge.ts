/**
 * Smriti-NER (স্মৃতি) — Sub-Phase 8.4: IVR-to-Platform Data Bridge
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Clinical Focus:
 * Zero-Smartphone Telemetry Ingestion, Unified Patient Longitudinal Record
 * and Real-Time Caregiver Dashboard Synchronization.
 */

import { SupportedVoiceLanguage } from "./bhashiniVoiceService";
import { IVRCheckInSession, CognitiveStatusLabel } from "./ivrCognitiveCheckInEngine";
import { IVRReminderType, EscalationNotice } from "./ivrAdherenceScheduler";

export type IVRBridgeEventType =
  | "COGNITIVE_CHECKIN"
  | "REMINDER_ADHERENCE"
  | "ESCALATION_ALERT";

export type CognitiveStabilityTrend =
  | "IMPROVING"
  | "STABLE"
  | "DECLINING"
  | "INSUFFICIENT_DATA";

export interface IVRBridgeEvent {
  eventId: string;
  patientId: string;
  eventType: IVRBridgeEventType;
  timestamp: string;
  channel: "IVR_PHONE";
  language: SupportedVoiceLanguage | string;
  checkinDetails?: {
    sessionId: string;
    orientationCorrect: boolean;
    orientationInputMethod: "DTMF" | "VOICE" | "NONE";
    wordsRecalled: string[];
    recallScore: number;
    compositeScore: number;
    statusLabel: CognitiveStatusLabel | string;
  };
  adherenceDetails?: {
    scheduleId: string;
    reminderType: IVRReminderType | string;
    confirmed: boolean;
    attemptsCount: number;
  };
  escalationDetails?: {
    escalationId: string;
    alertMessage: string;
    caregiverPhone: string;
    ashaWorkerPhone: string;
    acknowledged: boolean;
  };
}

export interface UnifiedPatientTelemetry {
  patientId: string;
  totalInteractions: number;
  appInteractions: number;
  ivrInteractions: number;
  lastInteractionAt: string;
  lastInteractionChannel: "PWA_APP" | "IVR_PHONE";
  adherenceRatePercent: number;
  consecutiveAdherenceStreak: number;
  latestCognitiveScore: number;
  cognitiveStabilityTrend: CognitiveStabilityTrend;
  activeEscalationAlerts: number;
  recentEvents: IVRBridgeEvent[];
}

export class IvrDataBridge {
  private static eventStore: Map<string, IVRBridgeEvent[]> = new Map();

  /**
   * Syncs an IVR Check-In session into the patient's unified telemetry record
   */
  public static syncCheckinEvent(session: IVRCheckInSession): IVRBridgeEvent {
    const event: IVRBridgeEvent = {
      eventId: `brg_chk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      patientId: session.patientId,
      eventType: "COGNITIVE_CHECKIN",
      timestamp: session.completedAt || new Date().toISOString(),
      channel: "IVR_PHONE",
      language: session.language,
      checkinDetails: {
        sessionId: session.sessionId,
        orientationCorrect: session.orientationCorrect,
        orientationInputMethod: session.orientationInputMethod,
        wordsRecalled: session.wordsRecalled,
        recallScore: session.recallScore,
        compositeScore: session.compositeScore,
        statusLabel: session.statusLabel,
      },
    };

    this.recordEvent(session.patientId, event);
    return event;
  }

  /**
   * Syncs an IVR Outbound Adherence Call attempt into the patient's record
   */
  public static syncAdherenceEvent(params: {
    patientId: string;
    scheduleId: string;
    reminderType: IVRReminderType | string;
    confirmed: boolean;
    attemptsCount: number;
    language: SupportedVoiceLanguage | string;
    timestamp?: string;
  }): IVRBridgeEvent {
    const event: IVRBridgeEvent = {
      eventId: `brg_adh_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      patientId: params.patientId,
      eventType: "REMINDER_ADHERENCE",
      timestamp: params.timestamp || new Date().toISOString(),
      channel: "IVR_PHONE",
      language: params.language,
      adherenceDetails: {
        scheduleId: params.scheduleId,
        reminderType: params.reminderType,
        confirmed: params.confirmed,
        attemptsCount: params.attemptsCount,
      },
    };

    this.recordEvent(params.patientId, event);
    return event;
  }

  /**
   * Syncs an Escalation Alert (triggered after 3 failed call attempts) into caregiver feeds
   */
  public static syncEscalationEvent(notice: EscalationNotice): IVRBridgeEvent {
    const event: IVRBridgeEvent = {
      eventId: `brg_esc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      patientId: notice.patientId,
      eventType: "ESCALATION_ALERT",
      timestamp: notice.escalatedAt,
      channel: "IVR_PHONE",
      language: "as",
      escalationDetails: {
        escalationId: notice.escalationId,
        alertMessage: notice.alertMessage,
        caregiverPhone: notice.caregiverPhone,
        ashaWorkerPhone: notice.ashaWorkerPhone,
        acknowledged: notice.acknowledged,
      },
    };

    this.recordEvent(notice.patientId, event);
    return event;
  }

  /**
   * Computes Unified Telemetry metrics combining IVR interactions and PWA telemetry
   */
  public static getUnifiedTelemetry(
    patientId: string,
    appInteractionsCount: number = 0
  ): UnifiedPatientTelemetry {
    const events = (this.eventStore.get(patientId) || []).slice();
    // Sort descending by timestamp
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const ivrCount = events.length;
    const totalCount = ivrCount + appInteractionsCount;
    const lastEvent = events[0];

    // Calculate Adherence Metrics
    const adherenceEvents = events.filter((e) => e.eventType === "REMINDER_ADHERENCE");
    let adherenceRatePercent = 100;
    let consecutiveStreak = 0;

    if (adherenceEvents.length > 0) {
      const confirmedCount = adherenceEvents.filter((e) => e.adherenceDetails?.confirmed).length;
      adherenceRatePercent = Math.round((confirmedCount / adherenceEvents.length) * 100);

      // Streak: unbroken streak of confirmed adherence from latest backwards
      for (const ev of adherenceEvents) {
        if (ev.adherenceDetails?.confirmed) {
          consecutiveStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate Cognitive Trajectory
    const checkinEvents = events.filter((e) => e.eventType === "COGNITIVE_CHECKIN");
    let latestCognitiveScore = 0;
    let stabilityTrend: CognitiveStabilityTrend = "INSUFFICIENT_DATA";

    if (checkinEvents.length > 0) {
      latestCognitiveScore = checkinEvents[0].checkinDetails?.compositeScore ?? 0;

      if (checkinEvents.length >= 2) {
        // Chronological order (oldest to newest)
        const scores = checkinEvents
          .map((e) => e.checkinDetails?.compositeScore ?? 0)
          .reverse();
        const half = Math.floor(scores.length / 2);
        const baseline = scores.slice(0, half).reduce((a, b) => a + b, 0) / half;
        const recent = scores.slice(half).reduce((a, b) => a + b, 0) / (scores.length - half);
        const diff = recent - baseline;

        if (diff >= 5) stabilityTrend = "IMPROVING";
        else if (diff <= -5) stabilityTrend = "DECLINING";
        else stabilityTrend = "STABLE";
      }
    }

    // Active Escalations
    const activeEscalations = events.filter(
      (e) => e.eventType === "ESCALATION_ALERT" && !e.escalationDetails?.acknowledged
    ).length;

    return {
      patientId,
      totalInteractions: totalCount,
      appInteractions: appInteractionsCount,
      ivrInteractions: ivrCount,
      lastInteractionAt: lastEvent ? lastEvent.timestamp : new Date().toISOString(),
      lastInteractionChannel: "IVR_PHONE",
      adherenceRatePercent,
      consecutiveAdherenceStreak: consecutiveStreak,
      latestCognitiveScore,
      cognitiveStabilityTrend: stabilityTrend,
      activeEscalationAlerts: activeEscalations,
      recentEvents: events.slice(0, 10),
    };
  }

  /**
   * Returns recent IVR feed for Caregiver Dashboard
   */
  public static getCaregiverIVRFeed(patientId: string, limit: number = 10): IVRBridgeEvent[] {
    const events = (this.eventStore.get(patientId) || []).slice();
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return events.slice(0, limit);
  }

  /**
   * Clears patient events (for testing isolation)
   */
  public static clearStore(): void {
    this.eventStore.clear();
  }

  private static recordEvent(patientId: string, event: IVRBridgeEvent): void {
    if (!this.eventStore.has(patientId)) {
      this.eventStore.set(patientId, []);
    }
    this.eventStore.get(patientId)!.push(event);
  }
}
