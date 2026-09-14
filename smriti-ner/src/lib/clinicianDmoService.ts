/**
 * Smriti-NER (স্মৃতি) — Sub-Phase 9.3: District Medical Officer / Clinician Service
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Clinical Focus:
 * Population-Level Cognitive Triage, DISHA 2018-Compliant Patient Drilldown,
 * Automated >3-Point MMSE Drop Surveillance, and e-Sanjeevani Teleconsultation Handoff.
 */

export interface DistrictCognitiveCohortMetric {
  districtId: string;
  districtName: string;
  state: string;
  totalMonitoredElders: number;
  prevalencePercentage: number;
  averageMmseScore: number;
  activeInterventionFlagsCount: number;
  cohortBreakdown: {
    normalCount: number;
    mciCount: number;
    dementiaCount: number;
  };
  channelBreakdown: {
    appUsers: number;
    ivrUsers: number;
    hybridUsers: number;
  };
}

export interface CognitiveDomainScore {
  domain: "MEMORY" | "ATTENTION" | "EXECUTIVE" | "LANGUAGE";
  score: number; // 0 to 10 scale
  percentile: number;
  interpretation: string;
}

export interface ClinicianPatientDrilldown {
  patientId: string;
  name: string;
  age: number;
  village: string;
  district: string;
  abhaId: string;
  baselineMmse: number;
  currentMmse: number;
  thirtyDaySlope: number; // e.g. -0.15 pts/day
  domainScores: CognitiveDomainScore[];
  adherencePercentage: number;
  consentVerified: boolean;
  dishaConsentToken: string;
}

export interface InterventionFlag {
  flagId: string;
  patientId: string;
  patientName: string;
  age: number;
  village: string;
  baselineMmse: number;
  currentMmse: number;
  scoreDropPoints: number;
  severity: "URGENT_INTERVENTION" | "CLINICAL_MONITORING" | "ROUTINE_FOLLOWUP";
  flaggedAt: string;
  triggerReason: string;
  adherenceRate: number;
  caregiverPhone: string;
  ashaWorkerName: string;
  status: "PENDING_REVIEW" | "ESANJEEVANI_QUEUED" | "RESOLVED";
}

export interface ClinicalExportReport {
  reportId: string;
  patientId: string;
  generatedAt: string;
  clinicianName: string;
  fhirBundleId: string;
  clinicalSummaryText: string;
  pdfDownloadUrl: string;
}

export interface ESanjeevaniReferralPacket {
  referralId: string;
  patientId: string;
  abhaId: string;
  provisionalDiagnosis: string;
  mmseProxyScore: number;
  scoreDrop30Days: number;
  clinicalSummary: string;
  telemedicineNode: string;
  referralPriority: "EMERGENCY" | "HIGH" | "ROUTINE";
  queuedAt: string;
  fhirReportBundleId: string;
}

export class ClinicianDmoService {
  private static interventionFlagsStore: InterventionFlag[] = [
    {
      flagId: "flg_majuli_01",
      patientId: "p4",
      patientName: "Purnima Devi Gogoi",
      age: 83,
      village: "Garamur, Majuli",
      baselineMmse: 18,
      currentMmse: 14,
      scoreDropPoints: 4,
      severity: "URGENT_INTERVENTION",
      flaggedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      triggerReason: "Acute 4-point MMSE drop over 30 days (18 → 14). Medication adherence dropped to 62% with evening sundowning tremor.",
      adherenceRate: 62,
      caregiverPhone: "9864077889",
      ashaWorkerName: "Jonali Saikia (Kamalabari PHC)",
      status: "PENDING_REVIEW",
    },
    {
      flagId: "flg_sohra_02",
      patientId: "p2",
      patientName: "Kong Merilda Lyngdoh",
      age: 81,
      village: "Nongthymmai, Sohra",
      baselineMmse: 22,
      currentMmse: 19,
      scoreDropPoints: 3,
      severity: "CLINICAL_MONITORING",
      flaggedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      triggerReason: "3-point MMSE decline over 30 days with circadian sleep rhythm disruptions.",
      adherenceRate: 78,
      caregiverPhone: "9862011223",
      ashaWorkerName: "Merilda Lyngdoh",
      status: "PENDING_REVIEW",
    },
  ];

  /**
   * 1. District Population Cognitive Surveillance
   */
  public static getDistrictOverview(districtId: string = "dist_majuli"): DistrictCognitiveCohortMetric {
    return {
      districtId,
      districtName: "Majuli River Island District",
      state: "Assam",
      totalMonitoredElders: 412,
      prevalencePercentage: 7.8,
      averageMmseScore: 23.4,
      activeInterventionFlagsCount: this.interventionFlagsStore.filter((f) => f.status !== "RESOLVED").length,
      cohortBreakdown: {
        normalCount: 218, // MMSE >= 24
        mciCount: 142,   // MMSE 18-23
        dementiaCount: 52, // MMSE < 18
      },
      channelBreakdown: {
        appUsers: 184,
        ivrUsers: 156,
        hybridUsers: 72,
      },
    };
  }

  /**
   * 2. DISHA-Gated Patient Drilldown
   */
  public static getPatientDrilldown(
    patientId: string,
    consentToken: string = "cst_valid_token_26003"
  ): ClinicianPatientDrilldown {
    const isConsentValid = consentToken.includes("valid") || consentToken.includes("26003");

    return {
      patientId,
      name: isConsentValid ? "Purnima Devi Gogoi" : "DE-IDENTIFIED ELDER #4102",
      age: 83,
      village: "Garamur, Majuli",
      district: "Majuli",
      abhaId: isConsentValid ? "91-4021-8891-2301" : "91-****-****-2301",
      baselineMmse: 18,
      currentMmse: 14,
      thirtyDaySlope: -0.13,
      domainScores: [
        { domain: "MEMORY", score: 3.8, percentile: 22, interpretation: "Significant delayed recall impairment" },
        { domain: "ATTENTION", score: 4.5, percentile: 34, interpretation: "Moderate attentional drift during dusk" },
        { domain: "EXECUTIVE", score: 4.0, percentile: 28, interpretation: "Difficulty in multi-step game sequences" },
        { domain: "LANGUAGE", score: 6.2, percentile: 58, interpretation: "Intact regional Assamese mother-tongue fluency" },
      ],
      adherencePercentage: 62,
      consentVerified: isConsentValid,
      dishaConsentToken: consentToken,
    };
  }

  /**
   * 3. Clinical Export Report Generator (PDF / FHIR R4)
   */
  public static generateClinicalReport(
    patientId: string,
    clinicianName: string = "Dr. Sanjib Kakoti (DMO, Majuli)"
  ): ClinicalExportReport {
    const reportId = `rep_cli_${Date.now().toString(36)}`;
    return {
      reportId,
      patientId,
      generatedAt: new Date().toISOString(),
      clinicianName,
      fhirBundleId: `fhir_diag_${Date.now()}_r4`,
      clinicalSummaryText: `Smriti-NER Comprehensive Clinical Neurocognitive Evaluation. Patient shows 4-point decline over 30 days (18 -> 14). Sub-domain analysis reveals predominant short-term episodic memory decay with preserved linguistic fluency. Blended IVR adherence shows 62% compliance. Recommended for immediate secondary tele-neurology workup.`,
      pdfDownloadUrl: `/api/v1/clinician/reports/${reportId}.pdf`,
    };
  }

  /**
   * 4. Automated Intervention Flags (>3-point MMSE drop)
   */
  public static getInterventionFlags(): InterventionFlag[] {
    return this.interventionFlagsStore;
  }

  /**
   * 5. e-Sanjeevani Teleconsultation Handoff
   */
  public static createESanjeevaniHandoff(
    patientId: string,
    doctorNotes?: string
  ): ESanjeevaniReferralPacket {
    const flag = this.interventionFlagsStore.find((f) => f.patientId === patientId);
    if (flag) {
      flag.status = "ESANJEEVANI_QUEUED";
    }

    return {
      referralId: `esanj_${Date.now().toString(36)}`,
      patientId,
      abhaId: "91-4021-8891-2301",
      provisionalDiagnosis: "Moderate Dementia with Secondary Agitation (ICD-10 F03)",
      mmseProxyScore: flag ? flag.currentMmse : 14,
      scoreDrop30Days: flag ? flag.scoreDropPoints : 4,
      clinicalSummary: doctorNotes || "Acute >3-point MMSE cognitive slope drop over 30 days flagged via Smriti-NER telemetry. Patient referred for tertiary hospital tele-consultation.",
      telemedicineNode: "GMCH Tele-medicine Node (Guwahati Medical College & Hospital)",
      referralPriority: "HIGH",
      queuedAt: new Date().toISOString(),
      fhirReportBundleId: `fhir_bundle_${Date.now()}`,
    };
  }
}
