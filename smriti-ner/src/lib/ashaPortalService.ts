/**
 * Smriti-NER (স্মৃতি) — Sub-Phase 9.2: ASHA Worker Portal Service (Community View)
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Clinical Focus:
 * Multi-Patient Cohort Monitoring, Offline Bluetooth Peer-to-Peer Delta Sync,
 * Home-Visit Clinical Checklist & Anganwadi Reminiscence Circle Scheduler.
 */

export interface AshaCohortPatient {
  id: string;
  name: string;
  age: number;
  village: string;
  mmse: number;
  staging: string;
  trendArrow: "UP" | "FLAT" | "DOWN";
  adherenceRate: number;
  sundowningRisk: "low" | "moderate" | "high";
  channel: "APP" | "IVR" | "HYBRID";
  lastSync: string;
}

export interface BluetoothSyncSession {
  syncId: string;
  patientId: string;
  bytesTransferred: number;
  durationMs: number;
  recordsCount: number;
  checksumVerified: boolean;
  completedAt: string;
}

export interface VillageVisitRecord {
  visitId: string;
  patientId: string;
  ashaWorkerName: string;
  visitDate: string;
  mmseChecked: boolean;
  pillCountVerified: boolean;
  caregiverBurnoutAssessed: boolean;
  fallRiskInspected: boolean;
  voiceNotesUrl?: string;
  clinicianEscalationNeeded: boolean;
  notes?: string;
}

export interface CommunityCircleSchedule {
  circleId: string;
  circleName: string;
  villageVenue: string;
  scheduledDate: string;
  facilitatorAsha: string;
  registeredEldersCount: number;
  culturalTheme: string;
  status: "UPCOMING" | "IN_PROGRESS" | "COMPLETED";
}

export class AshaPortalService {
  private static visitStore: Map<string, VillageVisitRecord[]> = new Map();
  private static circleSchedules: CommunityCircleSchedule[] = [
    {
      circleId: "cir_majuli_01",
      circleName: "Kamalabari Reminiscence Circle",
      villageVenue: "Kamalabari Anganwadi Center (Majuli)",
      scheduledDate: "2026-09-18T10:00:00Z",
      facilitatorAsha: "Jonali Saikia",
      registeredEldersCount: 8,
      culturalTheme: "Brahmaputra Boat Songs & Rongali Bihu Memories",
      status: "UPCOMING",
    },
    {
      circleId: "cir_sohra_02",
      circleName: "Sohra Community Memory Circle",
      villageVenue: "Nongthymmai Community Hall (Meghalaya)",
      scheduledDate: "2026-09-21T14:30:00Z",
      facilitatorAsha: "Merilda Lyngdoh",
      registeredEldersCount: 6,
      culturalTheme: "Khasi Sacred Groves & Duitara Folk Lore",
      status: "UPCOMING",
    },
  ];

  public static readonly DEFAULT_COHORT: AshaCohortPatient[] = [
    {
      id: "p1",
      name: "Birendra Nath Baruah",
      age: 74,
      village: "Kamalabari, Majuli",
      mmse: 24,
      staging: "MCI Staging",
      trendArrow: "UP",
      adherenceRate: 94,
      sundowningRisk: "low",
      channel: "APP",
      lastSync: "Today, 09:30 AM",
    },
    {
      id: "p2",
      name: "Kong Merilda Lyngdoh",
      age: 81,
      village: "Nongthymmai, Sohra",
      mmse: 19,
      staging: "Mild Dementia",
      trendArrow: "DOWN",
      adherenceRate: 78,
      sundowningRisk: "moderate",
      channel: "APP",
      lastSync: "Yesterday",
    },
    {
      id: "p3",
      name: "Radhabinod Sharma",
      age: 78,
      village: "Khurai, Imphal East",
      mmse: 25,
      staging: "MCI Staging",
      trendArrow: "UP",
      adherenceRate: 98,
      sundowningRisk: "low",
      channel: "APP",
      lastSync: "Today, 10:15 AM",
    },
    {
      id: "p4",
      name: "Purnima Devi Gogoi",
      age: 83,
      village: "Garamur, Majuli",
      mmse: 14,
      staging: "Moderate Dementia",
      trendArrow: "DOWN",
      adherenceRate: 62,
      sundowningRisk: "high",
      channel: "HYBRID",
      lastSync: "3 days ago",
    },
    {
      id: "p5",
      name: "Tenzing Norbu Lepcha",
      age: 76,
      village: "Ravangla, South Sikkim",
      mmse: 26,
      staging: "Age Normative",
      trendArrow: "FLAT",
      adherenceRate: 100,
      sundowningRisk: "low",
      channel: "APP",
      lastSync: "Today, 08:00 AM",
    },
    {
      id: "p6",
      name: "Ratneswar Saikia",
      age: 78,
      village: "Garamur, Majuli (📞 IVR-Only)",
      mmse: 21,
      staging: "Mild Cognitive Impairment",
      trendArrow: "FLAT",
      adherenceRate: 91,
      sundowningRisk: "low",
      channel: "IVR",
      lastSync: "Today, 07:45 AM via IVR",
    },
  ];

  /**
   * 1. Multi-Patient Cohort Dashboard
   */
  public static getCohort(): AshaCohortPatient[] {
    return this.DEFAULT_COHORT;
  }

  /**
   * 2. Bluetooth Peer-to-Peer Delta Sync Simulator (<30s)
   */
  public static triggerBluetoothSync(patientId: string): BluetoothSyncSession {
    const session: BluetoothSyncSession = {
      syncId: `ble_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      patientId,
      bytesTransferred: 42500, // ~42.5 KB telemetry payload
      durationMs: 1140, // 1.14 seconds (<30s requirement)
      recordsCount: 28, // 14 days of dual telemetry batches
      checksumVerified: true,
      completedAt: new Date().toISOString(),
    };
    return session;
  }

  /**
   * 3. Village Visit Checklist Audit
   */
  public static saveVillageVisit(record: VillageVisitRecord): VillageVisitRecord {
    if (!this.visitStore.has(record.patientId)) {
      this.visitStore.set(record.patientId, []);
    }
    this.visitStore.get(record.patientId)!.push(record);
    return record;
  }

  public static getVillageVisits(patientId: string): VillageVisitRecord[] {
    return this.visitStore.get(patientId) || [];
  }

  /**
   * 4. Community Circle Scheduler View
   */
  public static getCircleSchedules(): CommunityCircleSchedule[] {
    return this.circleSchedules;
  }

  public static scheduleCircleSession(session: CommunityCircleSchedule): CommunityCircleSchedule {
    this.circleSchedules.push(session);
    return session;
  }
}
