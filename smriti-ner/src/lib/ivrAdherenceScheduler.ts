/**
 * Smriti-NER (স্মৃতি) — Sub-Phase 8.2: IVR Reminder & Adherence Delivery Engine
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Clinical Focus:
 * Zero-Smartphone Medication & Hydration Adherence Delivery via 2G Feature Phones,
 * Personalized Family Voice Dialing & 3-Tier Escalation Safeguard ($N=3$ Rule).
 */

import { SupportedVoiceLanguage } from "./bhashiniVoiceService";

export type IVRReminderType =
  | "MEDICATION"
  | "HYDRATION"
  | "CIRCADIAN_CALMING"
  | "GENERAL_CHECKIN";

export type CallAttemptOutcome =
  | "ANSWERED_CONFIRMED"
  | "ANSWERED_DENIED"
  | "NO_ANSWER"
  | "BUSY"
  | "FAILED";

export interface OutboundCallSchedule {
  scheduleId: string;
  patientId: string;
  patientName: string;
  phoneNumber: string;
  caregiverPhone: string;
  ashaWorkerPhone: string;
  reminderType: IVRReminderType;
  scheduledTime: string;
  kinshipVoiceClipId?: string;
  customPromptText: string;
  language: SupportedVoiceLanguage;
  currentAttempt: number;
  maxAttempts: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "ESCALATED";
  confirmedAdherence: boolean;
  createdAt: string;
  lastAttemptAt?: string;
}

export interface EscalationNotice {
  escalationId: string;
  scheduleId: string;
  patientId: string;
  patientName: string;
  caregiverPhone: string;
  ashaWorkerPhone: string;
  reminderType: IVRReminderType;
  totalAttemptsMade: number;
  alertMessage: string;
  escalatedAt: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
}

export class IvrAdherenceScheduler {
  public static readonly DEFAULT_MAX_ATTEMPTS = 3;
  private static schedules: Map<string, OutboundCallSchedule> = new Map();
  private static escalations: Map<string, EscalationNotice> = new Map();

  /**
   * Schedules a new outbound adherence reminder call for an elder
   */
  public static createSchedule(params: {
    patientId: string;
    patientName: string;
    phoneNumber: string;
    caregiverPhone: string;
    ashaWorkerPhone: string;
    reminderType: IVRReminderType;
    scheduledTime: string;
    kinshipVoiceClipId?: string;
    customPromptText?: string;
    language?: SupportedVoiceLanguage;
    maxAttempts?: number;
  }): OutboundCallSchedule {
    const lang = params.language || "as";
    const scheduleId = `sched_ivr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const defaultPrompts: Record<IVRReminderType, Record<SupportedVoiceLanguage, string>> = {
      MEDICATION: {
        as: "পিতা, এতিয়া ৰাতিপুৱাৰ ঔষধ খোৱাৰ সময় হ'ল। ঔষধ খালে ১ টিপক।",
        mni: "ꯏꯄꯥ, ꯍꯤꯗꯥꯛ ꯆꯥꯕꯒꯤ ꯃꯇꯝ ꯑꯣꯏꯔꯦ꯫ ꯆꯥꯔꯕꯗꯤ ꯱ ꯅꯝꯕꯤꯌꯨ꯫",
        bn: "দাদু, এখন সকালের ওষুধ খাবার সময় হয়েছে। ওষুধ খেলে ১ টিপুন।",
        brx: "आबु, मुलि लोंनायनि सम जाबाय। १ खौ थुदो।",
        kha: "Meiieid, ka por ban dih dawai ka la poi. Pynkhein ia u 1.",
        lus: "Pu pu, damdawi ei a hun ta e. 1 hmet rawh.",
        hi: "दादाजी, सुबह की दवा लेने का समय हो गया है। दवा ले ली हो तो १ दबाएं।",
        en: "Grandpa, it is time for your morning medication. Press 1 to confirm.",
      },
      HYDRATION: {
        as: "পিতা, এগিলাচ কুহুমীয়া পানী খাই লওক। পানী খালে ১ টিপক।",
        mni: "ꯏꯄꯥ, ꯏꯁꯤꯡ ꯒ꯭ꯂꯥꯁ ꯑꯃꯥ ꯊꯛꯄꯤꯌꯨ꯫",
        bn: "দাদু, এক গ্লাস হালকা গরম জল খেয়ে নিন।",
        brx: "आबु, दै लोंदो।",
        kha: "Meiieid, dih um khyndiat.",
        lus: "Pu pu, tui in rawh le.",
        hi: "दादाजी, एक गिलास गुनगुना पानी पी लीजिए।",
        en: "Grandpa, please drink a fresh glass of warm water.",
      },
      CIRCADIAN_CALMING: {
        as: "পিতা, সন্ধিয়া নামিছে। চিন্তা নকৰিব, আপুনি ঘৰতেই সুৰক্ষিত হৈ আছে।",
        mni: "ꯏꯄꯥ, ꯅꯨꯃꯤꯗꯥꯡ ꯑꯣꯏꯔꯦ, ꯅꯨꯡꯉꯥꯏꯅꯥ ꯂꯩꯕꯤꯌꯨ꯫",
        bn: "দাদু, সন্ধ্যা নেমেছে। শান্ত হয়ে বিশ্রাম নিন।",
        brx: "आबु, बेलासे जाबाय, गोजোনै थादो।",
        kha: "Meiieid, ka la janmiet, shong suk.",
        lus: "Pu pu, khua a tlai ta, hahdam rawh le.",
        hi: "दादाजी, शाम ढल रही है। आप घर पर सुरक्षित हैं, शांत रहिए।",
        en: "Grandpa, twilight is setting in. Rest calmly, you are safe at home.",
      },
      GENERAL_CHECKIN: {
        as: "নমস্কাৰ পিতা! স্মৃতি সেৱাৰ পৰা আপোনাৰ দিনটো কেনে গৈছে জনাবনে?",
        mni: "ꯇꯔꯥꯝꯅꯥ ꯑꯣꯛꯆꯔꯤ, ꯉꯁꯤ ꯀꯔꯝꯅꯥ ꯂꯩꯕꯤ?",
        bn: "নমস্কার! আজকের দিনটি কেমন কাটছে?",
        brx: "मोजां दंना दिनै?",
        kha: "Kumno ka sngi mynta?",
        lus: "Vawiin i tha em?",
        hi: "नमस्ते दादाजी! आज आपका स्वास्थ्य कैसा है?",
        en: "Hello Grandpa! How is your day going?",
      },
    };

    const promptText =
      params.customPromptText ||
      defaultPrompts[params.reminderType][lang] ||
      defaultPrompts[params.reminderType].en;

    const schedule: OutboundCallSchedule = {
      scheduleId,
      patientId: params.patientId,
      patientName: params.patientName,
      phoneNumber: params.phoneNumber,
      caregiverPhone: params.caregiverPhone,
      ashaWorkerPhone: params.ashaWorkerPhone,
      reminderType: params.reminderType,
      scheduledTime: params.scheduledTime,
      kinshipVoiceClipId: params.kinshipVoiceClipId,
      customPromptText: promptText,
      language: lang,
      currentAttempt: 0,
      maxAttempts: params.maxAttempts || this.DEFAULT_MAX_ATTEMPTS,
      status: "PENDING",
      confirmedAdherence: false,
      createdAt: new Date().toISOString(),
    };

    this.schedules.set(scheduleId, schedule);
    return schedule;
  }

  /**
   * Logs an outbound call attempt and evaluates adherence confirmation or escalation
   */
  public static logCallAttempt(
    scheduleId: string,
    outcome: CallAttemptOutcome
  ): { schedule: OutboundCallSchedule; escalationNotice?: EscalationNotice } {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) {
      throw new Error(`Schedule '${scheduleId}' not found.`);
    }

    schedule.currentAttempt += 1;
    schedule.lastAttemptAt = new Date().toISOString();

    if (outcome === "ANSWERED_CONFIRMED") {
      schedule.status = "COMPLETED";
      schedule.confirmedAdherence = true;
      this.schedules.set(scheduleId, schedule);
      return { schedule };
    }

    if (outcome === "ANSWERED_DENIED") {
      schedule.status = "COMPLETED";
      schedule.confirmedAdherence = false;
      this.schedules.set(scheduleId, schedule);
      return { schedule };
    }

    // Call was missed, busy, or unanswered
    if (schedule.currentAttempt >= schedule.maxAttempts) {
      schedule.status = "ESCALATED";
      const notice = this.triggerEscalation(schedule);
      this.schedules.set(scheduleId, schedule);
      return { schedule, escalationNotice: notice };
    }

    schedule.status = "IN_PROGRESS";
    this.schedules.set(scheduleId, schedule);
    return { schedule };
  }

  /**
   * Triggers emergency escalation to Caregiver and ASHA worker after 3 missed calls
   */
  private static triggerEscalation(schedule: OutboundCallSchedule): EscalationNotice {
    const escalationId = `esc_ivr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const alertMessage = `CRITICAL ALERT: ${schedule.patientName} did not answer ${schedule.maxAttempts} scheduled IVR ${schedule.reminderType} calls on ${schedule.phoneNumber}. Immediate welfare check requested for ASHA (${schedule.ashaWorkerPhone}) and Caregiver (${schedule.caregiverPhone}).`;

    const notice: EscalationNotice = {
      escalationId,
      scheduleId: schedule.scheduleId,
      patientId: schedule.patientId,
      patientName: schedule.patientName,
      caregiverPhone: schedule.caregiverPhone,
      ashaWorkerPhone: schedule.ashaWorkerPhone,
      reminderType: schedule.reminderType,
      totalAttemptsMade: schedule.currentAttempt,
      alertMessage,
      escalatedAt: new Date().toISOString(),
      acknowledged: false,
    };

    this.escalations.set(escalationId, notice);
    return notice;
  }

  /**
   * Retrieves pending schedules
   */
  public static getPendingSchedules(): OutboundCallSchedule[] {
    const list: OutboundCallSchedule[] = [];
    this.schedules.forEach((s) => {
      if (s.status === "PENDING" || s.status === "IN_PROGRESS") {
        list.push(s);
      }
    });
    return list;
  }

  /**
   * Retrieves escalation alerts
   */
  public static getEscalationNotices(): EscalationNotice[] {
    return Array.from(this.escalations.values());
  }

  /**
   * Acknowledges an escalation alert by ASHA or caregiver
   */
  public static acknowledgeEscalation(
    escalationId: string,
    acknowledgedBy: string
  ): EscalationNotice {
    const notice = this.escalations.get(escalationId);
    if (!notice) {
      throw new Error(`Escalation '${escalationId}' not found.`);
    }
    notice.acknowledged = true;
    notice.acknowledgedBy = acknowledgedBy;
    this.escalations.set(escalationId, notice);
    return notice;
  }
}
