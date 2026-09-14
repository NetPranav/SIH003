/**
 * Smriti-NER (স্মৃতি) — Multi-Sensory Reminder Scheduler & Escalation Daemon
 * Sub-Phase 10.1: Reminder Database Schema, ±30s Trigger Window Daemon, and 15-min 3-Step Snooze Escalation.
 */

export type ReminderType = 'MEDICATION' | 'HYDRATION' | 'MEAL' | 'COGNITIVE_SESSION' | 'PRAYER_WALK';
export type MealRelation = 'BEFORE_MEAL' | 'AFTER_MEAL' | 'WITH_MEAL' | 'INDEPENDENT';
export type RecurrencePattern = 'DAILY' | 'TWICE_DAILY' | 'THRICE_DAILY' | 'WEEKLY' | 'CUSTOM_DAYS';
export type ReminderStatus = 'ACTIVE' | 'PAUSED' | 'SNOOZED' | 'COMPLETED' | 'MISSED_ESCALATED';

export interface ReminderItem {
  id: string;
  patientId: string;
  type: ReminderType;
  title: string;
  dosage: string;
  mealRelation: MealRelation;
  scheduledTime: string; // HH:mm format (24hr, e.g. "08:30")
  scheduledDays: number[]; // [0..6] (0 = Sunday, 1 = Monday, etc.)
  recurrence: RecurrencePattern;
  voicePromptPath: string;
  voiceSpeakerName: string;
  voiceSpeakerRelation: string;
  culturalIcon: string;
  snoozeCount: number;
  status: ReminderStatus;
  nextTriggerTime: string; // ISO timestamp
  createdAt: string;
  updatedAt: string;
}

export interface ReminderTriggerEvent {
  reminderId: string;
  patientId: string;
  type: ReminderType;
  title: string;
  dosage: string;
  voicePromptPath: string;
  voiceSpeakerName: string;
  voiceSpeakerRelation: string;
  scheduledTime: string;
  triggeredAt: string;
  driftSeconds: number;
  snoozeCount: number;
}

export interface EscalationAlert {
  alertId: string;
  reminderId: string;
  patientId: string;
  type: ReminderType;
  scheduledTime: string;
  totalSnoozes: number;
  minutesDelayed: number;
  caregiverPhone: string;
  ashaWorkerPhone: string;
  alertMessage: string;
  ivrFallbackQueued: boolean;
  timestamp: string;
}

export const SNOOZE_INTERVAL_MINUTES = 15;
export const MAX_SNOOZE_COUNT = 3;
export const TRIGGER_WINDOW_SECONDS = 30;

export class ReminderSchedulerDaemon {
  private reminders: Map<string, ReminderItem> = new Map();
  private firedSlots: Set<string> = new Set(); // Tracks "reminderId_YYYY-MM-DD_HH:mm" to prevent duplicate triggers

  constructor() {
    this.seedDefaultReminders('p_anand_01');
  }

  /**
   * Registers a new reminder item in the scheduler store
   */
  public registerReminder(
    item: Omit<ReminderItem, 'id' | 'createdAt' | 'updatedAt' | 'snoozeCount' | 'status' | 'nextTriggerTime'>
  ): ReminderItem {
    const now = new Date();
    const id = `rem_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const nextTrigger = this.calculateInitialTriggerTime(item.scheduledTime, now);

    const reminder: ReminderItem = {
      ...item,
      id,
      snoozeCount: 0,
      status: 'ACTIVE',
      nextTriggerTime: nextTrigger.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    this.reminders.set(id, reminder);
    return reminder;
  }

  /**
   * Returns all registered reminders
   */
  public getReminders(patientId?: string): ReminderItem[] {
    const all = Array.from(this.reminders.values());
    if (patientId) {
      return all.filter((r) => r.patientId === patientId);
    }
    return all;
  }

  /**
   * Returns a specific reminder by ID
   */
  public getReminder(id: string): ReminderItem | undefined {
    return this.reminders.get(id);
  }

  /**
   * Evaluates the scheduler tick at currentTime (typically called every 15-30s)
   * Evaluates window |t_now - t_sched| <= 30 seconds
   */
  public evaluateScheduleTick(currentTime: Date = new Date()): {
    triggers: ReminderTriggerEvent[];
    escalations: EscalationAlert[];
  } {
    const triggers: ReminderTriggerEvent[] = [];
    const escalations: EscalationAlert[] = [];

    const currentDay = currentTime.getDay();
    const datePrefix = currentTime.toISOString().split('T')[0];

    for (const reminder of this.reminders.values()) {
      if (reminder.status !== 'ACTIVE' && reminder.status !== 'SNOOZED') {
        continue;
      }

      // Check if scheduled for this day of week
      if (!reminder.scheduledDays.includes(currentDay)) {
        continue;
      }

      const nextTrigger = new Date(reminder.nextTriggerTime);
      const diffMs = currentTime.getTime() - nextTrigger.getTime();
      const driftSeconds = Math.abs(Math.round(diffMs / 1000));

      // Check if within tolerance window (<= 30 seconds)
      if (driftSeconds <= TRIGGER_WINDOW_SECONDS) {
        const slotKey = `${reminder.id}_${datePrefix}_${reminder.scheduledTime}_snooze${reminder.snoozeCount}`;
        if (!this.firedSlots.has(slotKey)) {
          this.firedSlots.add(slotKey);

          triggers.push({
            reminderId: reminder.id,
            patientId: reminder.patientId,
            type: reminder.type,
            title: reminder.title,
            dosage: reminder.dosage,
            voicePromptPath: reminder.voicePromptPath,
            voiceSpeakerName: reminder.voiceSpeakerName,
            voiceSpeakerRelation: reminder.voiceSpeakerRelation,
            scheduledTime: reminder.scheduledTime,
            triggeredAt: currentTime.toISOString(),
            driftSeconds,
            snoozeCount: reminder.snoozeCount,
          });
        }
      }
    }

    return { triggers, escalations };
  }

  /**
   * Snooze a reminder for 15 minutes (up to 3 times, then escalates)
   */
  public snoozeReminder(
    id: string,
    currentTime: Date = new Date()
  ): {
    status: 'SNOOZED' | 'ESCALATED';
    reminder: ReminderItem;
    escalationAlert?: EscalationAlert;
  } {
    const reminder = this.reminders.get(id);
    if (!reminder) {
      throw new Error(`Reminder with ID ${id} not found.`);
    }

    if (reminder.snoozeCount >= MAX_SNOOZE_COUNT) {
      // 4th snooze or 45 minutes elapsed without confirmation -> ESCALATE
      reminder.status = 'MISSED_ESCALATED';
      reminder.updatedAt = currentTime.toISOString();

      const escalationAlert: EscalationAlert = {
        alertId: `esc_${Date.now()}`,
        reminderId: reminder.id,
        patientId: reminder.patientId,
        type: reminder.type,
        scheduledTime: reminder.scheduledTime,
        totalSnoozes: reminder.snoozeCount,
        minutesDelayed: reminder.snoozeCount * SNOOZE_INTERVAL_MINUTES,
        caregiverPhone: '+91-94350-12345',
        ashaWorkerPhone: '+91-94350-67890',
        alertMessage: `CRITICAL ALERT: ${reminder.title} (${reminder.dosage}) has been snoozed ${reminder.snoozeCount} times (45+ minutes overdue). Caregiver notified & outbound IVR call queued.`,
        ivrFallbackQueued: true,
        timestamp: currentTime.toISOString(),
      };

      return {
        status: 'ESCALATED',
        reminder,
        escalationAlert,
      };
    }

    // Advance snooze count and compute next trigger time (+15 mins)
    reminder.snoozeCount += 1;
    reminder.status = 'SNOOZED';
    const nextTime = new Date(currentTime.getTime() + SNOOZE_INTERVAL_MINUTES * 60 * 1000);
    reminder.nextTriggerTime = nextTime.toISOString();
    reminder.updatedAt = currentTime.toISOString();

    return {
      status: 'SNOOZED',
      reminder,
    };
  }

  /**
   * Confirm adherence (Single-tap "I have taken it")
   */
  public confirmReminder(id: string, currentTime: Date = new Date()): ReminderItem {
    const reminder = this.reminders.get(id);
    if (!reminder) {
      throw new Error(`Reminder with ID ${id} not found.`);
    }

    reminder.status = 'COMPLETED';
    reminder.snoozeCount = 0;
    reminder.updatedAt = currentTime.toISOString();

    // Advance nextTriggerTime to tomorrow's scheduled time
    const nextDay = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
    const [hours, mins] = reminder.scheduledTime.split(':').map(Number);
    nextDay.setHours(hours, mins, 0, 0);
    reminder.nextTriggerTime = nextDay.toISOString();

    return reminder;
  }

  /**
   * Reset fired slots for day testing
   */
  public resetDailyLedger(): void {
    this.firedSlots.clear();
  }

  /**
   * Calculate initial ISO trigger timestamp from HH:mm string
   */
  private calculateInitialTriggerTime(timeStr: string, baseDate: Date): Date {
    const [hours, mins] = timeStr.split(':').map(Number);
    const trigger = new Date(baseDate);
    trigger.setHours(hours, mins, 0, 0);
    return trigger;
  }

  /**
   * Pre-populates realistic clinical reminders for Northeast Indian elder
   */
  private seedDefaultReminders(patientId: string): void {
    const now = new Date();

    const seeds: Array<Omit<ReminderItem, 'id' | 'createdAt' | 'updatedAt' | 'snoozeCount' | 'status' | 'nextTriggerTime'>> = [
      {
        patientId,
        type: 'MEDICATION',
        title: 'পুৱাৰ ৰক্তচাপ আৰু স্মৃতিৰ ঔষধ (Morning BP & Donepezil)',
        dosage: '1 Tablet (Donepezil 5mg) after breakfast',
        mealRelation: 'AFTER_MEAL',
        scheduledTime: '08:30',
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
        recurrence: 'DAILY',
        voicePromptPath: '/audio/reminders/priyanka_morning_pill.mp3',
        voiceSpeakerName: 'Priyanka',
        voiceSpeakerRelation: 'নাতিনী (Granddaughter)',
        culturalIcon: 'traditional_mortar',
      },
      {
        patientId,
        type: 'HYDRATION',
        title: 'দুপৰীয়াৰ এগিলাচ বিশুদ্ধ পানী (Midday Hydration)',
        dosage: '1 Brass Lota Water (250ml)',
        mealRelation: 'INDEPENDENT',
        scheduledTime: '12:30',
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
        recurrence: 'DAILY',
        voicePromptPath: '/audio/reminders/priyanka_water_drink.mp3',
        voiceSpeakerName: 'Priyanka',
        voiceSpeakerRelation: 'নাতিনী (Granddaughter)',
        culturalIcon: 'brass_lota',
      },
      {
        patientId,
        type: 'COGNITIVE_SESSION',
        title: 'আবেলিৰ স্মৃতি খেল (Evening Dhol-Pepa Cognitive Play)',
        dosage: '10 Minutes of Rhythm Co-Play',
        mealRelation: 'INDEPENDENT',
        scheduledTime: '16:00',
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
        recurrence: 'DAILY',
        voicePromptPath: '/audio/reminders/priyanka_dhol_play.mp3',
        voiceSpeakerName: 'Priyanka',
        voiceSpeakerRelation: 'নাতিনী (Granddaughter)',
        culturalIcon: 'dhol_pepa',
      },
    ];

    for (const s of seeds) {
      const id = `rem_seed_${s.type.toLowerCase()}`;
      const nextTrigger = this.calculateInitialTriggerTime(s.scheduledTime, now);

      this.reminders.set(id, {
        ...s,
        id,
        snoozeCount: 0,
        status: 'ACTIVE',
        nextTriggerTime: nextTrigger.toISOString(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
    }
  }
}

// Global singleton instance for app-wide lifecycle
export const reminderSchedulerDaemon = new ReminderSchedulerDaemon();
