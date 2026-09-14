/**
 * Smriti-NER (স্মৃতি) — Sub-Phase 16.1: Multi-State Rollout Engine
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Coordinates the 4-wave pan-NER scale-out across all 8 North-Eastern states:
 * 90 Primary Health Centres, 900 MDM-managed tablets, and 5,300 geriatric patients.
 */

export type RolloutWave = "WAVE_1" | "WAVE_2" | "WAVE_3" | "WAVE_4";

export interface RolloutWaveConfig {
  wave: RolloutWave;
  waveName: string;
  statesCovered: string[];
  targetPhcs: number;
  targetPatients: number;
  mdmTabletsAllocated: number;
  timelineWeeks: string;
  primaryTelecomProfile: string;
  keyConnectivitySolution: string;
  status: "ACTIVE" | "SCHEDULED" | "PREPARING";
}

export interface StateRolloutProfile {
  stateCode: string;
  stateName: string;
  wave: RolloutWave;
  phcCount: number;
  patientTarget: number;
  expansionDistricts: string[];
  dominantLanguages: string[];
  vSatFallbackRequired: boolean;
  stateMouStatus: "EXECUTED" | "IN_REVIEW";
  leadNodalAgency: string;
}

export interface MultiStateRolloutSummary {
  subPhase: string;
  totalStatesCovered: number;
  totalPhcsTarget: number;
  totalPatientsTarget: number;
  totalMdmTabletsDeployed: number;
  wavesCount: number;
  activeNodalOfficers: number;
  telecomTripleFailoverActive: boolean;
  panNerDeploymentStatus: "ROLLOUT_ACTIVE_ON_SCHEDULE";
}

export class MultiStateRolloutService {
  /**
   * Returns configurations for all 4 rollout waves.
   */
  public static getRolloutWaves(): RolloutWaveConfig[] {
    return [
      {
        wave: "WAVE_1",
        waveName: "Wave 1: Assam Core & Meghalaya Uplands",
        statesCovered: ["Assam", "Meghalaya"],
        targetPhcs: 30,
        targetPatients: 2000,
        mdmTabletsAllocated: 300,
        timelineWeeks: "Weeks 56–63",
        primaryTelecomProfile: "4G / 2G GSM Hybrid",
        keyConnectivitySolution: "Cellular + BLE Island Ferries & Solar Boat Clinics",
        status: "ACTIVE",
      },
      {
        wave: "WAVE_2",
        waveName: "Wave 2: Manipur Wetlands & Tripura Foothills",
        statesCovered: ["Manipur", "Tripura"],
        targetPhcs: 25,
        targetPatients: 1500,
        mdmTabletsAllocated: 250,
        timelineWeeks: "Weeks 62–69",
        primaryTelecomProfile: "4G Urban / 2G Border Cells",
        keyConnectivitySolution: "Fiber Backhaul + Asterisk Toll-Free IVR Nodes",
        status: "SCHEDULED",
      },
      {
        wave: "WAVE_3",
        waveName: "Wave 3: Arunachal Alpine & Nagaland Hills",
        statesCovered: ["Arunachal Pradesh", "Nagaland"],
        targetPhcs: 20,
        targetPatients: 1000,
        mdmTabletsAllocated: 200,
        timelineWeeks: "Weeks 67–74",
        primaryTelecomProfile: "Intermittent 2G / Satellite",
        keyConnectivitySolution: "BharatNet VSAT Terminals + Solar Micro-Banks",
        status: "PREPARING",
      },
      {
        wave: "WAVE_4",
        waveName: "Wave 4: Mizoram Ridges & Sikkim Organic Hills",
        statesCovered: ["Mizoram", "Sikkim"],
        targetPhcs: 15,
        targetPatients: 800,
        mdmTabletsAllocated: 150,
        timelineWeeks: "Weeks 72–79",
        primaryTelecomProfile: "4G Ridge / Shadow Valleys",
        keyConnectivitySolution: "Ridge-Top Repeater Nodes + Offline Encrypted SQLite",
        status: "PREPARING",
      },
    ];
  }

  /**
   * Returns detailed profiles for all 8 NER states.
   */
  public static getStateProfiles(): StateRolloutProfile[] {
    return [
      {
        stateCode: "AS",
        stateName: "Assam",
        wave: "WAVE_1",
        phcCount: 20,
        patientTarget: 1300,
        expansionDistricts: ["Barpeta", "Dhubri", "Dibrugarh", "Sonitpur", "Cachar"],
        dominantLanguages: ["Assamese", "Bengali", "Bodo"],
        vSatFallbackRequired: false,
        stateMouStatus: "EXECUTED",
        leadNodalAgency: "National Health Mission, Assam",
      },
      {
        stateCode: "ML",
        stateName: "Meghalaya",
        wave: "WAVE_1",
        phcCount: 10,
        patientTarget: 700,
        expansionDistricts: ["East Khasi Hills", "West Garo Hills", "Jaintia Hills"],
        dominantLanguages: ["Khasi", "Garo", "English"],
        vSatFallbackRequired: false,
        stateMouStatus: "EXECUTED",
        leadNodalAgency: "Meghalaya Health Systems Development Society",
      },
      {
        stateCode: "MN",
        stateName: "Manipur",
        wave: "WAVE_2",
        phcCount: 15,
        patientTarget: 900,
        expansionDistricts: ["Imphal West", "Thoubal", "Bishnupur", "Ukhrul"],
        dominantLanguages: ["Meitei (Manipuri)", "Tangkhul"],
        vSatFallbackRequired: false,
        stateMouStatus: "EXECUTED",
        leadNodalAgency: "State Health Society, Manipur",
      },
      {
        stateCode: "TR",
        stateName: "Tripura",
        wave: "WAVE_2",
        phcCount: 10,
        patientTarget: 600,
        expansionDistricts: ["West Tripura", "South Tripura", "Dhalai"],
        dominantLanguages: ["Bengali", "Kokborok"],
        vSatFallbackRequired: false,
        stateMouStatus: "EXECUTED",
        leadNodalAgency: "National Health Mission, Tripura",
      },
      {
        stateCode: "AR",
        stateName: "Arunachal Pradesh",
        wave: "WAVE_3",
        phcCount: 12,
        patientTarget: 600,
        expansionDistricts: ["Papum Pare", "Tawang", "West Kameng", "Lower Subansiri"],
        dominantLanguages: ["Nyishi", "Monpa", "Adi", "Hindi"],
        vSatFallbackRequired: true,
        stateMouStatus: "EXECUTED",
        leadNodalAgency: "Arunachal Health Mission Directorate",
      },
      {
        stateCode: "NL",
        stateName: "Nagaland",
        wave: "WAVE_3",
        phcCount: 8,
        patientTarget: 400,
        expansionDistricts: ["Kohima", "Mokokchung", "Dimapur", "Mon"],
        dominantLanguages: ["Nagamese", "Ao", "Angami", "English"],
        vSatFallbackRequired: true,
        stateMouStatus: "EXECUTED",
        leadNodalAgency: "Department of Health & Family Welfare, Nagaland",
      },
      {
        stateCode: "MZ",
        stateName: "Mizoram",
        wave: "WAVE_4",
        phcCount: 8,
        patientTarget: 450,
        expansionDistricts: ["Aizawl", "Lunglei", "Champhai"],
        dominantLanguages: ["Mizo (Lushai)", "English"],
        vSatFallbackRequired: true,
        stateMouStatus: "EXECUTED",
        leadNodalAgency: "Mizoram State e-Health Mission",
      },
      {
        stateCode: "SK",
        stateName: "Sikkim",
        wave: "WAVE_4",
        phcCount: 7,
        patientTarget: 350,
        expansionDistricts: ["Gangtok", "Namchi", "Gyalshing"],
        dominantLanguages: ["Nepali", "Bhutia", "Lepcha"],
        vSatFallbackRequired: false,
        stateMouStatus: "EXECUTED",
        leadNodalAgency: "Health & Family Welfare Department, Sikkim",
      },
    ];
  }

  /**
   * Returns consolidated multi-state rollout summary.
   */
  public static getMultiStateRolloutSummary(): MultiStateRolloutSummary {
    return {
      subPhase: "16.1 State-by-State Rollout Plan",
      totalStatesCovered: 8,
      totalPhcsTarget: 90,
      totalPatientsTarget: 5300,
      totalMdmTabletsDeployed: 900,
      wavesCount: 4,
      activeNodalOfficers: 24,
      telecomTripleFailoverActive: true,
      panNerDeploymentStatus: "ROLLOUT_ACTIVE_ON_SCHEDULE",
    };
  }
}
