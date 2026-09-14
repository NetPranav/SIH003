/**
 * Smriti-NER (স্মৃতি) — Sub-Phase 14.1: Clinical Pilot Site Selection & Setup Engine
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Manages the 10 Primary Health Centres (PHCs) across 4 NER districts,
 * Institutional Ethics Committee (IEC) clearances, 50-device MDM provisioning,
 * and 500-patient clinical stratification (including 50-patient IVR-only cohort).
 */

export type TerrainType =
  | "URBAN_PERIURBAN"
  | "RIVERINE_ISLAND"
  | "HILL_TRIBAL"
  | "BORDER_HILLS";

export type ConnectivityProfile =
  | "FIBER_AND_4G"
  | "SOLAR_AND_BLE_MESH"
  | "EDGE_2G_IVR";

export interface PilotPhcSite {
  phcId: string;
  name: string;
  district: "Kamrup Metro" | "Majuli" | "Ri-Bhoi" | "Churachandpur";
  state: "Assam" | "Meghalaya" | "Manipur";
  terrainType: TerrainType;
  ashaCount: number;
  targetEnrollment: number;
  connectivityProfile: ConnectivityProfile;
  medicalOfficerName: string;
  solarBackupAvailable: boolean;
  status: "OPERATIONAL" | "PREPARING";
}

export interface IecEthicalApproval {
  protocolNumber: string;
  clearedBy: string;
  icmrGuidelinesCompliance: boolean;
  languagesCovered: string[];
  dualConsentMandated: boolean;
  larConsentRequired: boolean;
  audioAssentRecordingEnabled: boolean;
  approvedDate: string;
  validUntil: string;
  status: "APPROVED";
}

export interface ProvisionedDevice {
  deviceId: string;
  model: string;
  assignedPhcId: string;
  kioskLockdownActive: boolean;
  offlineStorageCipher: "AES-256-GCM";
  bhashiniOfflinePacksInstalled: boolean;
  batteryHealthPct: number;
  status: "DEPLOYED" | "STANDBY";
}

export type CohortType = "TABLET_APP_COHORT" | "IVR_ONLY_COHORT";

export interface EnrolledPatient {
  pseudoId: string;
  assignedPhcId: string;
  age: number;
  gender: "M" | "F" | "OTHER";
  baselineMmse: number; // 14 to 26
  cohortType: CohortType;
  primaryLanguage: string;
  hasCaregiverAssigned: boolean;
  enrolledAt: string;
}

export interface PilotSetupSummary {
  subPhase: string;
  phcsOperational: number;
  totalEnrollmentTarget: number;
  currentlyEnrolledCount: number;
  appCohortCount: number;
  ivrOnlyCohortCount: number;
  devicesProvisioned: number;
  meanBaselineMmse: number;
  ethicalClearanceActive: boolean;
  status: "SETUP_COMPLETE_READY_FOR_TRAINING";
}

export class ClinicalPilotSiteService {
  private static readonly PHC_SITES: PilotPhcSite[] = [
    // Kamrup Metro (Assam) - 150 patients total
    {
      phcId: "PHC_01_SONAPUR",
      name: "Sonapur BPHC",
      district: "Kamrup Metro",
      state: "Assam",
      terrainType: "URBAN_PERIURBAN",
      ashaCount: 12,
      targetEnrollment: 50,
      connectivityProfile: "FIBER_AND_4G",
      medicalOfficerName: "Dr. B. K. Sarma, MBBS, MD",
      solarBackupAvailable: true,
      status: "OPERATIONAL",
    },
    {
      phcId: "PHC_02_CHANDRAPUR",
      name: "Chandrapur State Dispensary / PHC",
      district: "Kamrup Metro",
      state: "Assam",
      terrainType: "URBAN_PERIURBAN",
      ashaCount: 8,
      targetEnrollment: 50,
      connectivityProfile: "FIBER_AND_4G",
      medicalOfficerName: "Dr. P. Goswami, MBBS",
      solarBackupAvailable: true,
      status: "OPERATIONAL",
    },
    {
      phcId: "PHC_03_KHETRI",
      name: "Khetri Mini PHC",
      district: "Kamrup Metro",
      state: "Assam",
      terrainType: "URBAN_PERIURBAN",
      ashaCount: 9,
      targetEnrollment: 50,
      connectivityProfile: "FIBER_AND_4G",
      medicalOfficerName: "Dr. N. Baruah, MBBS",
      solarBackupAvailable: true,
      status: "OPERATIONAL",
    },
    // Majuli (Assam) - 150 patients total
    {
      phcId: "PHC_04_KAMALABARI",
      name: "Kamalabari BPHC",
      district: "Majuli",
      state: "Assam",
      terrainType: "RIVERINE_ISLAND",
      ashaCount: 14,
      targetEnrollment: 50,
      connectivityProfile: "SOLAR_AND_BLE_MESH",
      medicalOfficerName: "Dr. T. Saikia, MBBS, DGO",
      solarBackupAvailable: true,
      status: "OPERATIONAL",
    },
    {
      phcId: "PHC_05_JENGRAIMUKH",
      name: "Jengraimukh Tribal PHC",
      district: "Majuli",
      state: "Assam",
      terrainType: "RIVERINE_ISLAND",
      ashaCount: 10,
      targetEnrollment: 50,
      connectivityProfile: "SOLAR_AND_BLE_MESH",
      medicalOfficerName: "Dr. M. Pegu, MBBS",
      solarBackupAvailable: true,
      status: "OPERATIONAL",
    },
    {
      phcId: "PHC_06_GARMUR",
      name: "Garmur Sub-Divisional Civil Hospital PHC",
      district: "Majuli",
      state: "Assam",
      terrainType: "RIVERINE_ISLAND",
      ashaCount: 11,
      targetEnrollment: 50,
      connectivityProfile: "SOLAR_AND_BLE_MESH",
      medicalOfficerName: "Dr. R. Nath, MBBS",
      solarBackupAvailable: true,
      status: "OPERATIONAL",
    },
    // Ri-Bhoi (Meghalaya) - 100 patients total
    {
      phcId: "PHC_07_NONGPOH",
      name: "Nongpoh CHC & Model PHC",
      district: "Ri-Bhoi",
      state: "Meghalaya",
      terrainType: "HILL_TRIBAL",
      ashaCount: 12,
      targetEnrollment: 50,
      connectivityProfile: "EDGE_2G_IVR",
      medicalOfficerName: "Dr. E. Lyngdoh, MBBS",
      solarBackupAvailable: true,
      status: "OPERATIONAL",
    },
    {
      phcId: "PHC_08_UMSNING",
      name: "Umsning Community PHC",
      district: "Ri-Bhoi",
      state: "Meghalaya",
      terrainType: "HILL_TRIBAL",
      ashaCount: 9,
      targetEnrollment: 50,
      connectivityProfile: "EDGE_2G_IVR",
      medicalOfficerName: "Dr. K. Marbaniang, MBBS",
      solarBackupAvailable: true,
      status: "OPERATIONAL",
    },
    // Churachandpur (Manipur) - 100 patients total
    {
      phcId: "PHC_09_TUIBONG",
      name: "Tuibong PHC",
      district: "Churachandpur",
      state: "Manipur",
      terrainType: "BORDER_HILLS",
      ashaCount: 10,
      targetEnrollment: 50,
      connectivityProfile: "EDGE_2G_IVR",
      medicalOfficerName: "Dr. L. Haokip, MBBS",
      solarBackupAvailable: true,
      status: "OPERATIONAL",
    },
    {
      phcId: "PHC_10_SINGNGAT",
      name: "Singngat Tribal Border PHC",
      district: "Churachandpur",
      state: "Manipur",
      terrainType: "BORDER_HILLS",
      ashaCount: 8,
      targetEnrollment: 50,
      connectivityProfile: "EDGE_2G_IVR",
      medicalOfficerName: "Dr. T. Guite, MBBS",
      solarBackupAvailable: true,
      status: "OPERATIONAL",
    },
  ];

  public static getPilotPhcSites(): PilotPhcSite[] {
    return [...this.PHC_SITES];
  }

  public static getEthicalApprovalRecord(): IecEthicalApproval {
    return {
      protocolNumber: "SIH2026/MDoNER/IEC-PILOT-09",
      clearedBy: "Regional Institutional Ethics Committee - Northeast Geriatric Bioethics",
      icmrGuidelinesCompliance: true,
      languagesCovered: ["as", "mni", "bn", "brx", "kha", "lus", "hi", "en"],
      dualConsentMandated: true,
      larConsentRequired: true,
      audioAssentRecordingEnabled: true,
      approvedDate: "2026-08-15T10:00:00Z",
      validUntil: "2027-08-14T23:59:59Z",
      status: "APPROVED",
    };
  }

  public static getProvisionedDevices(): ProvisionedDevice[] {
    const devices: ProvisionedDevice[] = [];
    // 50 tablets: 5 assigned to each of the 10 PHCs
    this.PHC_SITES.forEach((phc, idx) => {
      for (let i = 1; i <= 5; i++) {
        devices.push({
          deviceId: `TAB-SM-${phc.district.substring(0, 3).toUpperCase()}-${idx + 1}-${i.toString().padStart(2, "0")}`,
          model: i % 2 === 0 ? "Samsung Galaxy Tab A9 4G" : "Lenovo Tab M8 Gen 4",
          assignedPhcId: phc.phcId,
          kioskLockdownActive: true,
          offlineStorageCipher: "AES-256-GCM",
          bhashiniOfflinePacksInstalled: true,
          batteryHealthPct: 96 + ((i * 3) % 5),
          status: "DEPLOYED",
        });
      }
    });
    return devices;
  }

  public static getEnrolledPatients(filter?: {
    phcId?: string;
    cohortType?: CohortType;
  }): EnrolledPatient[] {
    // Generate the 500 patients registry deterministically (50 per PHC, exactly 5 per PHC in IVR-only cohort = 50 total)
    const list: EnrolledPatient[] = [];
    const langsByState: Record<string, string[]> = {
      Assam: ["as", "bn", "brx", "hi"],
      Meghalaya: ["kha", "en", "hi"],
      Manipur: ["mni", "lus", "en"],
    };

    this.PHC_SITES.forEach((phc, phcIdx) => {
      const stateLangs = langsByState[phc.state] || ["as"];
      for (let p = 1; p <= 50; p++) {
        const isIvrOnly = p > 45; // Exactly 5 patients per PHC = 50 IVR-only patients across 10 PHCs
        const patientSeq = phcIdx * 50 + p;
        const baselineMmse = 14 + (patientSeq % 13); // 14 to 26

        list.push({
          pseudoId: `PID-${phc.phcId.replace("PHC_", "")}-${p.toString().padStart(3, "0")}`,
          assignedPhcId: phc.phcId,
          age: 62 + ((patientSeq * 7) % 24), // 62 to 85
          gender: p % 2 === 0 ? "F" : "M",
          baselineMmse,
          cohortType: isIvrOnly ? "IVR_ONLY_COHORT" : "TABLET_APP_COHORT",
          primaryLanguage: stateLangs[p % stateLangs.length],
          hasCaregiverAssigned: true,
          enrolledAt: "2026-09-01T08:30:00Z",
        });
      }
    });

    return list.filter((p) => {
      if (filter?.phcId && p.assignedPhcId !== filter.phcId) return false;
      if (filter?.cohortType && p.cohortType !== filter.cohortType) return false;
      return true;
    });
  }

  public static getPilotSetupSummary(): PilotSetupSummary {
    const allPatients = this.getEnrolledPatients();
    const appCohort = allPatients.filter((p) => p.cohortType === "TABLET_APP_COHORT");
    const ivrCohort = allPatients.filter((p) => p.cohortType === "IVR_ONLY_COHORT");
    const avgMmse =
      allPatients.reduce((sum, p) => sum + p.baselineMmse, 0) / allPatients.length;

    return {
      subPhase: "14.1 Pilot Site Selection & Setup",
      phcsOperational: this.PHC_SITES.length,
      totalEnrollmentTarget: 500,
      currentlyEnrolledCount: allPatients.length,
      appCohortCount: appCohort.length,
      ivrOnlyCohortCount: ivrCohort.length,
      devicesProvisioned: this.getProvisionedDevices().length,
      meanBaselineMmse: Math.round(avgMmse * 10) / 10,
      ethicalClearanceActive: true,
      status: "SETUP_COMPLETE_READY_FOR_TRAINING",
    };
  }
}
