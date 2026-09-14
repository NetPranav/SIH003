/**
 * Smriti-NER (স্মৃতি) — Sub-Phase 9.1: Caregiver Portal Service (Family View)
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Clinical Focus:
 * Dual-Tier Caregiver Auth (Local PIN + Cloud OTP), 30-Day MMSE Trajectory Tracking,
 * Adherence Ring Analytics, Circadian Sundowning Alerts, and Reminiscence Story Album.
 */

import { CAREGIVER_PIN } from "./constants";

export interface MMSETrajectoryPoint {
  day: number;
  date: string;
  score: number; // 0 to 30
  channel: "APP" | "IVR" | "BLENDED";
  classification: "NORMAL" | "MCI" | "SEVERE";
  anomaly: boolean;
  notes?: string;
}

export interface AdherenceMetricRing {
  category: "MEDICATION" | "HYDRATION" | "COGNITIVE_GAMES";
  completedCount: number;
  targetCount: number;
  percentage: number;
  color: string;
  statusLabel: string;
}

export interface SundowningAlertItem {
  alertId: string;
  severity: "CRITICAL" | "MODERATE" | "INFORMATIONAL";
  timestamp: string;
  triggerReason: string;
  deescalationProtocol: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface ReminiscenceStoryMedia {
  mediaId: string;
  title: string;
  era: string;
  mediaType: "PHOTO" | "AUDIO_NARRATIVE" | "VOICE_ANNOTATION";
  audioUrl?: string;
  kinshipTag: string;
  recordedBy: string;
}

export interface CloudOtpSession {
  otpId: string;
  phoneNumber: string;
  otpCode: string;
  expiresAt: number;
}

export class CaregiverPortalService {
  private static otpSessions: Map<string, CloudOtpSession> = new Map();
  private static alertStore: Map<string, SundowningAlertItem[]> = new Map();

  /**
   * 1. Authentication System
   */
  public static verifyLocalPin(enteredPin: string): boolean {
    return enteredPin === CAREGIVER_PIN;
  }

  public static requestCloudOtp(phoneNumber: string): { otpId: string; expiresAt: string; message: string } {
    const otpId = `otp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    // Deterministic test token 26003 (Problem statement ID) or random 6-digit
    const otpCode = phoneNumber.endsWith("0000") ? "260030" : Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAtMs = Date.now() + 5 * 60 * 1000; // 5 minutes valid

    this.otpSessions.set(otpId, {
      otpId,
      phoneNumber,
      otpCode,
      expiresAt: expiresAtMs,
    });

    return {
      otpId,
      expiresAt: new Date(expiresAtMs).toISOString(),
      message: `Security OTP sent to registered caregiver mobile ${phoneNumber.slice(0, 3)}****${phoneNumber.slice(-3)}. Valid for 5 minutes.`,
    };
  }

  public static verifyCloudOtp(otpId: string, enteredOtp: string): boolean {
    const session = this.otpSessions.get(otpId);
    if (!session) return false;
    if (Date.now() > session.expiresAt) {
      this.otpSessions.delete(otpId);
      return false;
    }
    // Universal SIH test bypass "260030" or exact match
    const isValid = enteredOtp === session.otpCode || enteredOtp === "260030";
    if (isValid) {
      this.otpSessions.delete(otpId);
    }
    return isValid;
  }

  /**
   * 2. 30-Day MMSE Longitudinal Trajectory
   */
  public static get30DayMMSETrajectory(patientId: string = "pt_elder_01"): MMSETrajectoryPoint[] {
    const points: MMSETrajectoryPoint[] = [];
    const baseScore = 22.5;

    for (let day = 1; day <= 30; day++) {
      // Deterministic realistic variation
      const cycleNoise = Math.sin(day / 2.5) * 1.5;
      const weeklyBoost = day % 7 === 2 ? 1.5 : 0; // Tuesday Haat market boost
      const coldDip = day === 14 ? -3.5 : 0; // Simulated rapid dip
      const rawScore = Math.round((baseScore + cycleNoise + weeklyBoost + coldDip) * 10) / 10;
      const score = Math.max(10, Math.min(30, rawScore));

      const isAnomaly = coldDip < -3;
      const classification = score >= 24 ? "NORMAL" : score >= 18 ? "MCI" : "SEVERE";
      const channel: "APP" | "IVR" | "BLENDED" = day % 3 === 0 ? "IVR" : day % 3 === 1 ? "APP" : "BLENDED";

      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() - (30 - day));
      const dateStr = dateObj.toISOString().split("T")[0];

      points.push({
        day,
        date: dateStr,
        score,
        channel,
        classification,
        anomaly: isAnomaly,
        notes: isAnomaly ? "Rapid cognitive dip observed following weather cold front." : undefined,
      });
    }

    return points;
  }

  /**
   * 3. Adherence Dashboard Rings
   */
  public static getAdherenceRings(patientId: string = "pt_elder_01"): AdherenceMetricRing[] {
    return [
      {
        category: "MEDICATION",
        completedCount: 3,
        targetCount: 3,
        percentage: 100,
        color: "#10b981", // Emerald Green
        statusLabel: "All 3 Daily Prescriptions Taken",
      },
      {
        category: "HYDRATION",
        completedCount: 7,
        targetCount: 8,
        percentage: 88,
        color: "#0284c7", // Sky Blue
        statusLabel: "7 of 8 Glasses Consumed",
      },
      {
        category: "COGNITIVE_GAMES",
        completedCount: 3,
        targetCount: 4,
        percentage: 75,
        color: "#8b5cf6", // Purple
        statusLabel: "3 of 4 Cognitive Exercises Done",
      },
    ];
  }

  /**
   * 4. Sundowning Alert Panel
   */
  public static getSundowningAlerts(patientId: string = "pt_elder_01"): SundowningAlertItem[] {
    if (!this.alertStore.has(patientId)) {
      this.alertStore.set(patientId, [
        {
          alertId: `sun_alt_${patientId}_01`,
          severity: "CRITICAL",
          timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
          triggerReason: "Twilight dusk agitation spike detected (17:45 IST) with repeated AACB game exits.",
          deescalationProtocol: "Play calming Borgeet / Duitara folk track; guide elder to west window with warm herbal tea.",
          resolved: false,
        },
        {
          alertId: `sun_alt_${patientId}_02`,
          severity: "MODERATE",
          timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
          triggerReason: "Delayed afternoon hydration — elder missed 14:00 scheduled water prompt.",
          deescalationProtocol: "Send family voice note via Grandchild Connect reminding elder to drink warm water.",
          resolved: true,
          resolvedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        },
      ]);
    }

    return this.alertStore.get(patientId)!;
  }

  public static resolveSundowningAlert(alertId: string, patientId: string = "pt_elder_01"): boolean {
    const alerts = this.getSundowningAlerts(patientId);
    const alert = alerts.find((a) => a.alertId === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  /**
   * 5. Reminiscence & Story Album
   */
  public static getReminiscenceStoryAlbum(patientId: string = "pt_elder_01"): ReminiscenceStoryMedia[] {
    return [
      {
        mediaId: "album_01",
        title: "Brahmaputra Ferry Crossing with Grandfather",
        era: "1968 (Majuli)",
        mediaType: "PHOTO",
        kinshipTag: "Grandfather & Son",
        recordedBy: "Archived Family Album",
      },
      {
        mediaId: "album_02",
        title: "Life-Review: Planting Paddy in Sivasagar",
        era: "1974 (Sivasagar Fields)",
        mediaType: "AUDIO_NARRATIVE",
        audioUrl: "/audio/life_review_paddy_1974.mp3",
        kinshipTag: "Self (Butler Interview)",
        recordedBy: "ASHA Worker (Jonali Saikia)",
      },
      {
        mediaId: "album_03",
        title: "Granddaughter Ananya's Bihu Flute Tune",
        era: "2026 (Grandchild Connect)",
        mediaType: "VOICE_ANNOTATION",
        audioUrl: "/audio/grandchild_flute_ananya.mp3",
        kinshipTag: "Grandchild (Ananya)",
        recordedBy: "Grandchild Connect Co-Play",
      },
    ];
  }
}
