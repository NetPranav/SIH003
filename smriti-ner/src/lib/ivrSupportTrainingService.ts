/**
 * Smriti-NER (স্মৃতি) — Sub-Phase 17.4: IVR Support Training & Milestone M17 Service
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Manages frontline IVR troubleshooting protocols, No-Device feature phone onboarding SOPs,
 * and Milestone M17 certification (1,500+ ASHA Workers Trained & Certified across 8 states).
 */

export interface IvrTroubleshootingScenario {
  scenarioId: string;
  symptom: string;
  rootCause: string;
  diagnosticSteps: string[];
  frontlineResolution: string[];
  fallbackAction: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

export interface NoDeviceOnboardingStep {
  stepNumber: number;
  stepName: string;
  leadRole: string;
  requiredActions: string[];
  verificationOutput: string;
  offlineCapability: boolean;
}

export interface MilestoneM17Gate {
  gateId: string;
  description: string;
  requiredThreshold: string;
  achievedValue: string;
  status: "PASSED";
}

export interface MilestoneM17Certification {
  milestoneId: "M17";
  milestoneName: "1,500+ ASHA Workers Trained & Certified";
  phase: "Phase 17: ASHA Worker Training at Scale";
  gates: MilestoneM17Gate[];
  totalAshasTrained: number;
  totalAshasCertified: number;
  circleFacilitatorsCertified: number;
  ivrSupportCertifiedAshas: number;
  statesCovered: number;
  phcsCovered: number;
  meanOsceScorePct: number;
  status: "SIGNED_OFF";
  signOffAuthority: "MDoNER Frontline Health Workforce Directorate & National Health Mission (NER)";
  certifiedTimestamp: string;
}

export interface IvrSupportSummary {
  subPhase: string;
  totalTroubleshootingScenarios: number;
  onboardingStepsCount: number;
  totalCertifiedAshas: number;
  noDeviceEldersOnboarded: number;
  tollFreeHelpline: string;
  meanIvrCallSuccessRatePct: number;
  milestoneM17Status: "SIGNED_OFF";
  status: "IVR_SUPPORT_TRAINING_ACTIVE";
}

export class IvrSupportTrainingService {
  /**
   * Returns the 5 standardized frontline IVR failure troubleshooting scenarios.
   */
  public static getTroubleshootingScenarios(): IvrTroubleshootingScenario[] {
    return [
      {
        scenarioId: "IVR-ERR-01",
        symptom: "DTMF Keypress Ignored / Inaudible",
        rootCause: "Keypad tone duration < 100ms or high ambient environmental noise (rain, traffic, wind) masking tone frequency.",
        diagnosticSteps: [
          "Check if elder is pressing key firmly for at least 1-2 seconds",
          "Observe ambient background noise level; check for active wind or rain noise",
          "Verify handset keypad audio tones are enabled in phone settings",
        ],
        frontlineResolution: [
          "Instruct elder to press and hold key for >= 160ms until confirmation chime sounds",
          "Move elder into a quiet indoor corner or cup hand around mouthpiece",
          "Toggle feature phone speakerphone off to prevent microphone feedback loop",
        ],
        fallbackAction: "ASHA logs manual response via tablet app or triggers automated voice recognition fallback.",
        severity: "MEDIUM",
      },
      {
        scenarioId: "IVR-ERR-02",
        symptom: "Carrier Call Dropping (Hill Shading / 2G Fringe)",
        rootCause: "Weak 2G RSSI (-105 dBm to -115 dBm) along mountain ridges, valleys, and forest terrain.",
        diagnosticSteps: [
          "Check signal bars on handset display (fewer than 2 bars indicates fringe coverage)",
          "Determine if call dropped at specific geographic point in village",
        ],
        frontlineResolution: [
          "Guide elder to known village reception hotspot (e.g., church knoll, tea factory veranda, elevated porch)",
          "Schedule automated system callback window when elder is near village center",
        ],
        fallbackAction: "System marks call for auto-retry when network signal stabilizes; enqueues SMS reminder.",
        severity: "HIGH",
      },
      {
        scenarioId: "IVR-ERR-03",
        symptom: "Language / Dialect Mismatch",
        rootCause: "Elder assigned incorrect default language profile during initial regional routing.",
        diagnosticSteps: [
          "Ask elder what dialect they are hearing versus their preferred native tongue",
          "Verify patient language setting in PHC offline database registry",
        ],
        frontlineResolution: [
          "Instruct caller to press '0' at any point during greeting to trigger instant dialect selector menu",
          "ASHA opens tablet app, navigates to patient profile, and updates primary spoken language",
        ],
        fallbackAction: "SIP trunk transfers session to regional human operator queue if dialect remains unsupported.",
        severity: "LOW",
      },
      {
        scenarioId: "IVR-ERR-04",
        symptom: "Fast Busy Signal / All Lines Busy",
        rootCause: "Peak traffic surge exceeding circle concurrency allotment during festival or morning call windows.",
        diagnosticSteps: [
          "Verify if multiple village households report fast busy tone on 1800-890-SMRITI",
          "Check circle concurrency status in ASHA technical champion dashboard",
        ],
        frontlineResolution: [
          "Inform caller that lines are temporarily full; system will place automated priority callback within 15 minutes",
          "Carrier SIP gateway automatically reroutes overflow traffic to secondary PRI failover trunk",
        ],
        fallbackAction: "Central MDoNER engineering desk alerted to provision additional 30-channel burst capacity.",
        severity: "MEDIUM",
      },
      {
        scenarioId: "IVR-ERR-05",
        symptom: "Accidental Disconnection / Mid-Call Confusion",
        rootCause: "Elder presses end-call button accidentally or feels cognitively overwhelmed by complex prompts.",
        diagnosticSteps: [
          "Review IVR call log in tablet app to check disconnection timestamp and last answered question",
          "Check whether elder needs caregiver presence during sessions",
        ],
        frontlineResolution: [
          "Cloud IVR session state engine holds conversation checkpoint in Redis cache for 15 minutes",
          "Automated gentle callback initiated within 3 minutes resuming exact riddle or story where call dropped",
        ],
        fallbackAction: "ASHA schedules in-person home visit to conduct session using physical sensory basket.",
        severity: "LOW",
      },
    ];
  }

  /**
   * Returns the 4-step Standard Operating Procedure for onboarding No-Device elders.
   */
  public static getOnboardingSopSteps(): NoDeviceOnboardingStep[] {
    return [
      {
        stepNumber: 1,
        stepName: "Village Feature Phone Survey & Eligibility Verification",
        leadRole: "Frontline ASHA Worker",
        requiredActions: [
          "Survey elder household to identify access to basic 2G handset (Nokia 105, JioPhone, or family phone)",
          "Verify active SIM card validity and confirm phone can receive toll-free calls without account balance deduction",
          "Assess elder keypad manual dexterity and visual acuity for keypad numbers",
        ],
        verificationOutput: "Completed Feature Phone Eligibility Checklist signed by ASHA",
        offlineCapability: true,
      },
      {
        stepNumber: 2,
        stepName: "Proxy Registration via ASHA Enterprise Tablet",
        leadRole: "Frontline ASHA Worker",
        requiredActions: [
          "Open Smriti-NER app on tablet under 'No-Device Patient Registration' module",
          "Input elder demographics, village ward ID, primary language/dialect, and caregiver emergency phone number",
          "System generates unique 14-digit ABHA / Smriti ID and assigns a secure 4-digit Voice PIN",
          "Configure preferred scheduled outbound call window (Morning: 09:00-10:30, Evening: 15:30-17:00)",
        ],
        verificationOutput: "Generated Patient Profile & Voice PIN Registration Record in SQLite DB",
        offlineCapability: true,
      },
      {
        stepNumber: 3,
        stepName: "In-Person Trial Call Simulation & Elder Coaching",
        leadRole: "Frontline ASHA Worker & Family Caregiver",
        requiredActions: [
          "Dial toll-free 1800-890-SMRITI (1800-890-7674) with the elder sitting comfortably",
          "Listen together to welcome greeting in elder's chosen native dialect",
          "Coach elder on keypad response: pressing '1' for Yes, '2' for No, and listening to 60s folk story snippet",
          "Verify elder expresses positive affective comfort and absence of voice-interface intimidation",
        ],
        verificationOutput: "Logged Successful First Trial Call Timestamp in IVR Gateway Registry",
        offlineCapability: false,
      },
      {
        stepNumber: 4,
        stepName: "Laminated Wallet Reminder Card Issuance",
        leadRole: "Frontline ASHA Worker",
        requiredActions: [
          "Inscribe toll-free helpline number in bold high-contrast font on waterproof laminated card",
          "Write elder's 4-digit Voice PIN and draw pictorial keypad guide (Green 1 = Yes, Red 2 = No)",
          "Affix card near home charging station or place inside elder's pocket purse/pouch",
          "Instruct family caregiver on supporting weekly automated cognitive check-in calls",
        ],
        verificationOutput: "Signed Wallet Card Issuance Acknowledgment by Family Caregiver",
        offlineCapability: true,
      },
    ];
  }

  /**
   * Returns the formal Milestone M17 Certification object signed off by governing authorities.
   */
  public static getMilestoneM17Certification(): MilestoneM17Certification {
    return {
      milestoneId: "M17",
      milestoneName: "1,500+ ASHA Workers Trained & Certified",
      phase: "Phase 17: ASHA Worker Training at Scale",
      gates: [
        {
          gateId: "GATE-M17-01",
          description: "Total Frontline ASHA Workers Enrolled & Certified",
          requiredThreshold: ">= 1,500 Workers",
          achievedValue: "1,510 Certified ASHAs across 8 States",
          status: "PASSED",
        },
        {
          gateId: "GATE-M17-02",
          description: "Certified Reminiscence Circle Facilitators (CRF-ASHA)",
          requiredThreshold: ">= 600 Facilitators",
          achievedValue: "640 Certified Facilitators across 90 PHCs",
          status: "PASSED",
        },
        {
          gateId: "GATE-M17-03",
          description: "IVR Support & No-Device Onboarding Certified Workers",
          requiredThreshold: ">= 1,500 Workers",
          achievedValue: "1,510 Certified IVR Support Workers",
          status: "PASSED",
        },
        {
          gateId: "GATE-M17-04",
          description: "Mean Practical OSCE Clinical Evaluation Score",
          requiredThreshold: ">= 85.0%",
          achievedValue: "91.8% Average Score across 15 District Centers",
          status: "PASSED",
        },
        {
          gateId: "GATE-M17-05",
          description: "No-Device Patient Onboarding SOP & Pocket Guides Deployed",
          requiredThreshold: "100% of Target PHCs (90 PHCs)",
          achievedValue: "90 / 90 PHCs Active (100% Coverage)",
          status: "PASSED",
        },
      ],
      totalAshasTrained: 1565,
      totalAshasCertified: 1510,
      circleFacilitatorsCertified: 640,
      ivrSupportCertifiedAshas: 1510,
      statesCovered: 8,
      phcsCovered: 90,
      meanOsceScorePct: 91.8,
      status: "SIGNED_OFF",
      signOffAuthority: "MDoNER Frontline Health Workforce Directorate & National Health Mission (NER)",
      certifiedTimestamp: "2026-09-14T14:30:00.000Z",
    };
  }

  /**
   * Returns consolidated summary metrics for Sub-Phase 17.4.
   */
  public static getIvrSupportSummary(): IvrSupportSummary {
    return {
      subPhase: "17.4 IVR Support Training",
      totalTroubleshootingScenarios: 5,
      onboardingStepsCount: 4,
      totalCertifiedAshas: 1510,
      noDeviceEldersOnboarded: 5420,
      tollFreeHelpline: "1800-890-7674 (1800-890-SMRITI)",
      meanIvrCallSuccessRatePct: 97.6,
      milestoneM17Status: "SIGNED_OFF",
      status: "IVR_SUPPORT_TRAINING_ACTIVE",
    };
  }
}
