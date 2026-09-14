/**
 * Smriti-NER (স্মৃতি) — Sub-Phase 18.1: Central Analytics Dashboard Service
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Manages Pan-NER GIS district-level telemetry (16 focus districts),
 * 8-state comparative benchmark analytics, and automated monthly policy briefs
 * for MDoNER officials and State Health Mission Directors.
 */

export interface DistrictGeoTelemetry {
  districtId: string;
  districtName: string;
  stateCode: string;
  stateName: string;
  latitude: number;
  longitude: number;
  enrolledPatients: number;
  activeAshas: number;
  meanCceiScore: number;
  syncLatencyHours: number;
  alertLevel: "OPTIMAL" | "ATTENTION_REQUIRED" | "ELEVATED_RISK";
  dominantDialect: string;
}

export interface StateComparisonMetric {
  stateCode: string;
  stateName: string;
  waveAssigned: number;
  enrolledPatients: number;
  phcsCount: number;
  meanMmseProxy: number;
  sessionAdherencePct: number;
  meanSyncLatencyHours: number;
  touchInteractionPct: number;
  voiceIvrInteractionPct: number;
  reminiscenceAttendancePct: number;
}

export interface PolicyKpiScorecardItem {
  kpiName: string;
  target: string;
  current: string;
  status: "ON_TRACK" | "MONITOR" | "ACTION_REQUIRED";
}

export interface PolicyExecutiveBrief {
  reportId: string;
  reportingPeriod: string;
  totalPanNerPatients: number;
  totalActiveAshas: number;
  panNerMeanCcei: number;
  panNerMeanAdherencePct: number;
  keyInsights: string[];
  resourceRecommendations: string[];
  policyKpiScorecard: PolicyKpiScorecardItem[];
  generatedTimestamp: string;
}

export interface CentralAnalyticsSummary {
  subPhase: string;
  totalDistrictsMapped: number;
  totalStatesAnalyzed: number;
  totalEnrolledPatients: number;
  panNerMeanCcei: number;
  meanAdherencePct: number;
  policyBriefActive: boolean;
  status: "CENTRAL_DASHBOARD_OPERATIONAL";
}

export class CentralAnalyticsDashboardService {
  /**
   * Returns geolocated GIS telemetry for 16 primary district clusters across all 8 NER states.
   */
  public static getDistrictGeoTelemetry(): DistrictGeoTelemetry[] {
    return [
      {
        districtId: "DIST-AS-01",
        districtName: "Guwahati (Kamrup Metro)",
        stateCode: "AS",
        stateName: "Assam",
        latitude: 26.1445,
        longitude: 91.7362,
        enrolledPatients: 1050,
        activeAshas: 160,
        meanCceiScore: 83.4,
        syncLatencyHours: 1.2,
        alertLevel: "OPTIMAL",
        dominantDialect: "Assamese / Bengali",
      },
      {
        districtId: "DIST-AS-02",
        districtName: "Silchar (Cachar)",
        stateCode: "AS",
        stateName: "Assam",
        latitude: 24.8333,
        longitude: 92.7789,
        enrolledPatients: 450,
        activeAshas: 120,
        meanCceiScore: 79.8,
        syncLatencyHours: 2.4,
        alertLevel: "OPTIMAL",
        dominantDialect: "Sylheti / Bengali",
      },
      {
        districtId: "DIST-AS-03",
        districtName: "Tezpur (Sonitpur)",
        stateCode: "AS",
        stateName: "Assam",
        latitude: 26.6338,
        longitude: 92.7926,
        enrolledPatients: 200,
        activeAshas: 100,
        meanCceiScore: 81.2,
        syncLatencyHours: 1.8,
        alertLevel: "OPTIMAL",
        dominantDialect: "Assamese",
      },
      {
        districtId: "DIST-AS-04",
        districtName: "Kokrajhar (BTR)",
        stateCode: "AS",
        stateName: "Assam",
        latitude: 26.4014,
        longitude: 90.2718,
        enrolledPatients: 100,
        activeAshas: 90,
        meanCceiScore: 78.5,
        syncLatencyHours: 3.1,
        alertLevel: "ATTENTION_REQUIRED",
        dominantDialect: "Bodo",
      },
      {
        districtId: "DIST-ML-01",
        districtName: "Shillong (East Khasi Hills)",
        stateCode: "ML",
        stateName: "Meghalaya",
        latitude: 25.5788,
        longitude: 91.8933,
        enrolledPatients: 450,
        activeAshas: 130,
        meanCceiScore: 82.6,
        syncLatencyHours: 1.6,
        alertLevel: "OPTIMAL",
        dominantDialect: "Khasi",
      },
      {
        districtId: "DIST-ML-02",
        districtName: "Tura (West Garo Hills)",
        stateCode: "ML",
        stateName: "Meghalaya",
        latitude: 25.5141,
        longitude: 90.2023,
        enrolledPatients: 250,
        activeAshas: 90,
        meanCceiScore: 77.4,
        syncLatencyHours: 4.2,
        alertLevel: "ATTENTION_REQUIRED",
        dominantDialect: "Garo",
      },
      {
        districtId: "DIST-MN-01",
        districtName: "Imphal (Imphal West)",
        stateCode: "MN",
        stateName: "Manipur",
        latitude: 24.8170,
        longitude: 93.9368,
        enrolledPatients: 400,
        activeAshas: 140,
        meanCceiScore: 84.1,
        syncLatencyHours: 1.4,
        alertLevel: "OPTIMAL",
        dominantDialect: "Meitei",
      },
      {
        districtId: "DIST-MN-02",
        districtName: "Churachandpur",
        stateCode: "MN",
        stateName: "Manipur",
        latitude: 24.3333,
        longitude: 93.6667,
        enrolledPatients: 250,
        activeAshas: 110,
        meanCceiScore: 76.9,
        syncLatencyHours: 5.1,
        alertLevel: "ATTENTION_REQUIRED",
        dominantDialect: "Thadou / Paite",
      },
      {
        districtId: "DIST-TR-01",
        districtName: "Agartala (West Tripura)",
        stateCode: "TR",
        stateName: "Tripura",
        latitude: 23.8315,
        longitude: 91.2868,
        enrolledPatients: 400,
        activeAshas: 110,
        meanCceiScore: 82.9,
        syncLatencyHours: 1.5,
        alertLevel: "OPTIMAL",
        dominantDialect: "Bengali / Kokborok",
      },
      {
        districtId: "DIST-TR-02",
        districtName: "Udaipur (Gomati)",
        stateCode: "TR",
        stateName: "Tripura",
        latitude: 23.5333,
        longitude: 91.4833,
        enrolledPatients: 200,
        activeAshas: 70,
        meanCceiScore: 79.1,
        syncLatencyHours: 2.8,
        alertLevel: "OPTIMAL",
        dominantDialect: "Kokborok",
      },
      {
        districtId: "DIST-AR-01",
        districtName: "Itanagar (Papum Pare)",
        stateCode: "AR",
        stateName: "Arunachal Pradesh",
        latitude: 27.0844,
        longitude: 93.6053,
        enrolledPatients: 300,
        activeAshas: 80,
        meanCceiScore: 80.5,
        syncLatencyHours: 3.5,
        alertLevel: "OPTIMAL",
        dominantDialect: "Nyishi / Hindi",
      },
      {
        districtId: "DIST-AR-02",
        districtName: "Tawang",
        stateCode: "AR",
        stateName: "Arunachal Pradesh",
        latitude: 27.5861,
        longitude: 91.8679,
        enrolledPatients: 150,
        activeAshas: 60,
        meanCceiScore: 75.8,
        syncLatencyHours: 6.8,
        alertLevel: "ELEVATED_RISK",
        dominantDialect: "Monpa",
      },
      {
        districtId: "DIST-NL-01",
        districtName: "Kohima",
        stateCode: "NL",
        stateName: "Nagaland",
        latitude: 25.6751,
        longitude: 94.1086,
        enrolledPatients: 250,
        activeAshas: 70,
        meanCceiScore: 81.7,
        syncLatencyHours: 2.1,
        alertLevel: "OPTIMAL",
        dominantDialect: "Tenyidie (Angami)",
      },
      {
        districtId: "DIST-NL-02",
        districtName: "Dimapur",
        stateCode: "NL",
        stateName: "Nagaland",
        latitude: 25.9090,
        longitude: 93.7265,
        enrolledPatients: 200,
        activeAshas: 50,
        meanCceiScore: 83.0,
        syncLatencyHours: 1.3,
        alertLevel: "OPTIMAL",
        dominantDialect: "Nagamese",
      },
      {
        districtId: "DIST-MZ-01",
        districtName: "Aizawl",
        stateCode: "MZ",
        stateName: "Mizoram",
        latitude: 23.7271,
        longitude: 92.7176,
        enrolledPatients: 400,
        activeAshas: 60,
        meanCceiScore: 83.7,
        syncLatencyHours: 2.0,
        alertLevel: "OPTIMAL",
        dominantDialect: "Mizo",
      },
      {
        districtId: "DIST-SK-01",
        districtName: "Gangtok",
        stateCode: "SK",
        stateName: "Sikkim",
        latitude: 27.3389,
        longitude: 88.6065,
        enrolledPatients: 250,
        activeAshas: 50,
        meanCceiScore: 84.5,
        syncLatencyHours: 1.5,
        alertLevel: "OPTIMAL",
        dominantDialect: "Nepali / Bhutia",
      },
    ];
  }

  /**
   * Returns multi-dimensional comparative benchmark metrics across all 8 North Eastern states.
   */
  public static getStateComparisons(): StateComparisonMetric[] {
    return [
      {
        stateCode: "AS",
        stateName: "Assam",
        waveAssigned: 1,
        enrolledPatients: 1800,
        phcsCount: 30,
        meanMmseProxy: 22.8,
        sessionAdherencePct: 91.4,
        meanSyncLatencyHours: 2.1,
        touchInteractionPct: 65.0,
        voiceIvrInteractionPct: 35.0,
        reminiscenceAttendancePct: 92.0,
      },
      {
        stateCode: "ML",
        stateName: "Meghalaya",
        waveAssigned: 2,
        enrolledPatients: 700,
        phcsCount: 12,
        meanMmseProxy: 23.1,
        sessionAdherencePct: 89.8,
        meanSyncLatencyHours: 2.9,
        touchInteractionPct: 52.0,
        voiceIvrInteractionPct: 48.0,
        reminiscenceAttendancePct: 89.5,
      },
      {
        stateCode: "MN",
        stateName: "Manipur",
        waveAssigned: 3,
        enrolledPatients: 650,
        phcsCount: 11,
        meanMmseProxy: 23.4,
        sessionAdherencePct: 92.1,
        meanSyncLatencyHours: 3.2,
        touchInteractionPct: 58.0,
        voiceIvrInteractionPct: 42.0,
        reminiscenceAttendancePct: 91.0,
      },
      {
        stateCode: "TR",
        stateName: "Tripura",
        waveAssigned: 2,
        enrolledPatients: 600,
        phcsCount: 10,
        meanMmseProxy: 22.9,
        sessionAdherencePct: 90.6,
        meanSyncLatencyHours: 2.2,
        touchInteractionPct: 62.0,
        voiceIvrInteractionPct: 38.0,
        reminiscenceAttendancePct: 90.2,
      },
      {
        stateCode: "AR",
        stateName: "Arunachal Pradesh",
        waveAssigned: 3,
        enrolledPatients: 450,
        phcsCount: 8,
        meanMmseProxy: 22.4,
        sessionAdherencePct: 86.5,
        meanSyncLatencyHours: 5.2,
        touchInteractionPct: 41.0,
        voiceIvrInteractionPct: 59.0,
        reminiscenceAttendancePct: 87.0,
      },
      {
        stateCode: "NL",
        stateName: "Nagaland",
        waveAssigned: 4,
        enrolledPatients: 450,
        phcsCount: 8,
        meanMmseProxy: 23.0,
        sessionAdherencePct: 88.2,
        meanSyncLatencyHours: 1.7,
        touchInteractionPct: 55.0,
        voiceIvrInteractionPct: 45.0,
        reminiscenceAttendancePct: 88.8,
      },
      {
        stateCode: "MZ",
        stateName: "Mizoram",
        waveAssigned: 4,
        enrolledPatients: 400,
        phcsCount: 6,
        meanMmseProxy: 23.6,
        sessionAdherencePct: 93.4,
        meanSyncLatencyHours: 2.0,
        touchInteractionPct: 70.0,
        voiceIvrInteractionPct: 30.0,
        reminiscenceAttendancePct: 94.1,
      },
      {
        stateCode: "SK",
        stateName: "Sikkim",
        waveAssigned: 4,
        enrolledPatients: 250,
        phcsCount: 5,
        meanMmseProxy: 23.8,
        sessionAdherencePct: 94.2,
        meanSyncLatencyHours: 1.5,
        touchInteractionPct: 74.0,
        voiceIvrInteractionPct: 26.0,
        reminiscenceAttendancePct: 95.0,
      },
    ];
  }

  /**
   * Generates the automated monthly executive policy brief for MDoNER leadership.
   */
  public static getPolicyExecutiveBrief(): PolicyExecutiveBrief {
    return {
      reportId: "MDONER-TELEMETRY-BRIEF-2026-09",
      reportingPeriod: "September 2026 (Monthly Digest)",
      totalPanNerPatients: 5300,
      totalActiveAshas: 1510,
      panNerMeanCcei: 81.3,
      panNerMeanAdherencePct: 90.8,
      keyInsights: [
        "All 8 NER states are operational across 90 primary health centers, exceeding the 5,000 enrolled elder benchmark.",
        "Feature phone IVR interactions comprise 40.4% of total engagement, verifying that zero-device inclusion successfully reaches remote tribal belts.",
        "Sikkim and Mizoram exhibit the highest session adherence (>93%), driven by strong Community Reminiscence Circle attendance.",
        "High-altitude fringe connectivity in Tawang (AR) and Churachandpur (MN) exhibits sync latencies >4.5 hours, mitigated by offline SQLite caching.",
      ],
      resourceRecommendations: [
        "Procure and deploy 50 cold-resistant thermal battery banking sleeves to Tawang and Mon district PHCs before onset of winter frost.",
        "Allocate 20 additional concurrent SIP trunk channels to Telecom Circle NE-2 to accommodate Arunachal Pradesh IVR surge.",
        "Authorize second cohort of 300 Certified Reminiscence Circle Facilitators across Garo Hills and Barak Valley PHCs.",
      ],
      policyKpiScorecard: [
        {
          kpiName: "Total Patient Enrollment",
          target: ">= 5,000 Elders",
          current: "5,300 Active Elders",
          status: "ON_TRACK",
        },
        {
          kpiName: "Frontline Workforce Deployment",
          target: ">= 1,500 Certified ASHAs",
          current: "1,510 Certified ASHAs",
          status: "ON_TRACK",
        },
        {
          kpiName: "Mean Offline Sync Latency",
          target: "< 4.0 Hours",
          current: "2.6 Hours Average",
          status: "ON_TRACK",
        },
        {
          kpiName: "Mean Population CCEI Index",
          target: ">= 75.0 Index Points",
          current: "81.3 Index Points",
          status: "ON_TRACK",
        },
        {
          kpiName: "High-Altitude Device Downtime",
          target: "< 2.0%",
          current: "0.9% Downtime",
          status: "ON_TRACK",
        },
      ],
      generatedTimestamp: "2026-09-14T14:45:00.000Z",
    };
  }

  /**
   * Returns consolidated summary metrics for Sub-Phase 18.1 Central Analytics Dashboard.
   */
  public static getCentralAnalyticsSummary(): CentralAnalyticsSummary {
    return {
      subPhase: "18.1 Central Analytics Dashboard",
      totalDistrictsMapped: 16,
      totalStatesAnalyzed: 8,
      totalEnrolledPatients: 5300,
      panNerMeanCcei: 81.3,
      meanAdherencePct: 90.8,
      policyBriefActive: true,
      status: "CENTRAL_DASHBOARD_OPERATIONAL",
    };
  }
}
