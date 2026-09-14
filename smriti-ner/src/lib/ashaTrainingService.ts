/**
 * Smriti-NER (স্মৃতি) — Sub-Phase 14.2: ASHA Worker Training Engine
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Manages the 40-hour 4-module curriculum, 20 Lead Master ASHA certifications
 * across the 10 pilot PHCs, group reminiscence circle facilitation guides,
 * and the 3-tiered rural field help desk with SLA tracking.
 */

export interface TrainingModule {
  moduleId: string;
  moduleCode: string;
  title: string;
  durationHours: number;
  competencyObjectives: string[];
  languagesAvailable: string[];
  assessmentType: "WRITTEN_QUIZ" | "HANDS_ON_OSCE" | "ROLE_PLAY";
}

export interface CertifiedMasterAsha {
  trainerId: string;
  name: string;
  assignedPhcId: string;
  phcName: string;
  district: string;
  osceScorePct: number; // >= 85.0%
  primaryLanguage: string;
  certificationHash: string;
  certifiedAt: string;
}

export interface CircleFacilitationSessionPlan {
  themeId: string;
  themeTitle: string;
  targetParticipants: number;
  durationMinutes: number;
  culturalPrompts: string[];
  consentChecklist: string[];
  calmingMelodyPreset: string;
}

export interface HelpDeskTicketStatus {
  tier: "TIER_1_ASHA_LEAD" | "TIER_2_FIELD_ENGINEER" | "TIER_3_MEDICAL_OFFICER";
  tierDescription: string;
  slaMaxHours: number;
  openTicketsCount: number;
  resolvedTicketsCount: number;
  avgResolutionMinutes: number;
}

export interface AshaTrainingSummary {
  subPhase: string;
  modulesCreated: number;
  totalTrainingHours: number;
  masterAshasCertified: number;
  averageOsceScorePct: number;
  circleFacilitationReady: boolean;
  helpdeskOperational: boolean;
  helpdeskActiveHelpline: string;
  status: "TRAINING_COMPLETE_CASCADE_READY";
}

export class AshaTrainingService {
  private static readonly MODULES: TrainingModule[] = [
    {
      moduleId: "MOD_101",
      moduleCode: "DEM-LIT-01",
      title: "Dementia Literacy & Culturally Sensitive Stigma Reduction",
      durationHours: 8,
      competencyObjectives: [
        "Differentiate normal geriatric cognitive ageing from progressive neurodegenerative dementia",
        "Adopt non-pejorative maternal vocabulary (স্মৃতিবিভ্ৰম, পাহৰণি ৰোগ, মায়াই লানথাফম)",
        "Recognize early cognitive red flags during monthly village home visits",
      ],
      languagesAvailable: ["as", "mni", "kha", "bn", "hi", "en"],
      assessmentType: "WRITTEN_QUIZ",
    },
    {
      moduleId: "MOD_102",
      moduleCode: "DEV-OPS-02",
      title: "Tablet Kiosk Operations, Solar Charging & Offline Delta Sync",
      durationHours: 12,
      competencyObjectives: [
        "Unbox, power on, and configure single-app kiosk lockdown mode",
        "Maintain solar battery charging schedules under monsoonal power outages",
        "Initiate peer-to-peer BLE mesh delta synchronization during weekly PHC visits",
      ],
      languagesAvailable: ["as", "mni", "kha", "bn", "hi", "en"],
      assessmentType: "HANDS_ON_OSCE",
    },
    {
      moduleId: "MOD_103",
      moduleCode: "AACB-EMP-03",
      title: "Anti-Agitation Circuit Breaker (AACB) & Empathy De-escalation",
      durationHours: 10,
      competencyObjectives: [
        "Identify clinical agitation triggers: rapid screen tapping, frowning, verbal distress",
        "Trigger AACB calming protocols with authentic regional folk melodies (Bihu, Pena, Khasi folk)",
        "Conduct post-agitation debrief with primary family caregiver",
      ],
      languagesAvailable: ["as", "mni", "kha", "bn", "hi", "en"],
      assessmentType: "ROLE_PLAY",
    },
    {
      moduleId: "MOD_104",
      moduleCode: "CONS-DISHA-04",
      title: "Statutory Informed Consent & Elder Verbal Assent Protocol",
      durationHours: 10,
      competencyObjectives: [
        "Execute DISHA 2018 / DPDP Act 2023 dual-gate consent forms with family caregivers",
        "Record crisp verbal assent audio clips from elderly participants in maternal dialect",
        "Explain voluntary participation and instant right-to-revoke policies to rural households",
      ],
      languagesAvailable: ["as", "mni", "kha", "bn", "hi", "en"],
      assessmentType: "HANDS_ON_OSCE",
    },
  ];

  private static readonly CERTIFIED_TRAINERS: CertifiedMasterAsha[] = [
    // Kamrup Metro (Sonapur, Chandrapur, Khetri)
    {
      trainerId: "TR-KAM-01",
      name: "Rina Das",
      assignedPhcId: "PHC_01_SONAPUR",
      phcName: "Sonapur BPHC",
      district: "Kamrup Metro",
      osceScorePct: 92.5,
      primaryLanguage: "as",
      certificationHash: "sha256_e7a9b01c_rina",
      certifiedAt: "2026-08-25T14:30:00Z",
    },
    {
      trainerId: "TR-KAM-02",
      name: "Monita Bora",
      assignedPhcId: "PHC_01_SONAPUR",
      phcName: "Sonapur BPHC",
      district: "Kamrup Metro",
      osceScorePct: 88.0,
      primaryLanguage: "as",
      certificationHash: "sha256_c4f8d22e_monita",
      certifiedAt: "2026-08-25T14:30:00Z",
    },
    {
      trainerId: "TR-KAM-03",
      name: "Pratima Kalita",
      assignedPhcId: "PHC_02_CHANDRAPUR",
      phcName: "Chandrapur PHC",
      district: "Kamrup Metro",
      osceScorePct: 90.0,
      primaryLanguage: "as",
      certificationHash: "sha256_b1e9c55d_pratima",
      certifiedAt: "2026-08-25T14:30:00Z",
    },
    {
      trainerId: "TR-KAM-04",
      name: "Dipali Saikia",
      assignedPhcId: "PHC_02_CHANDRAPUR",
      phcName: "Chandrapur PHC",
      district: "Kamrup Metro",
      osceScorePct: 89.5,
      primaryLanguage: "as",
      certificationHash: "sha256_f9a8d43c_dipali",
      certifiedAt: "2026-08-25T14:30:00Z",
    },
    {
      trainerId: "TR-KAM-05",
      name: "Anjali Medhi",
      assignedPhcId: "PHC_03_KHETRI",
      phcName: "Khetri Mini PHC",
      district: "Kamrup Metro",
      osceScorePct: 94.0,
      primaryLanguage: "as",
      certificationHash: "sha256_aa77b62e_anjali",
      certifiedAt: "2026-08-25T14:30:00Z",
    },
    {
      trainerId: "TR-KAM-06",
      name: "Niru Begum",
      assignedPhcId: "PHC_03_KHETRI",
      phcName: "Khetri Mini PHC",
      district: "Kamrup Metro",
      osceScorePct: 86.5,
      primaryLanguage: "as",
      certificationHash: "sha256_dd44c88e_niru",
      certifiedAt: "2026-08-25T14:30:00Z",
    },
    // Majuli (Kamalabari, Jengraimukh, Garmur)
    {
      trainerId: "TR-MAJ-01",
      name: "Bonti Payeng",
      assignedPhcId: "PHC_04_KAMALABARI",
      phcName: "Kamalabari BPHC",
      district: "Majuli",
      osceScorePct: 95.0,
      primaryLanguage: "as",
      certificationHash: "sha256_11cc99ee_bonti",
      certifiedAt: "2026-08-26T16:00:00Z",
    },
    {
      trainerId: "TR-MAJ-02",
      name: "Rumi Kutum",
      assignedPhcId: "PHC_04_KAMALABARI",
      phcName: "Kamalabari BPHC",
      district: "Majuli",
      osceScorePct: 91.0,
      primaryLanguage: "as",
      certificationHash: "sha256_22dd88ff_rumi",
      certifiedAt: "2026-08-26T16:00:00Z",
    },
    {
      trainerId: "TR-MAJ-03",
      name: "Junmoni Doley",
      assignedPhcId: "PHC_05_JENGRAIMUKH",
      phcName: "Jengraimukh Tribal PHC",
      district: "Majuli",
      osceScorePct: 93.5,
      primaryLanguage: "as",
      certificationHash: "sha256_33ee77aa_junmoni",
      certifiedAt: "2026-08-26T16:00:00Z",
    },
    {
      trainerId: "TR-MAJ-04",
      name: "Parul Pegu",
      assignedPhcId: "PHC_05_JENGRAIMUKH",
      phcName: "Jengraimukh Tribal PHC",
      district: "Majuli",
      osceScorePct: 87.5,
      primaryLanguage: "as",
      certificationHash: "sha256_44ff66bb_parul",
      certifiedAt: "2026-08-26T16:00:00Z",
    },
    {
      trainerId: "TR-MAJ-05",
      name: "Tarulata Hazarika",
      assignedPhcId: "PHC_06_GARMUR",
      phcName: "Garmur Civil Hospital PHC",
      district: "Majuli",
      osceScorePct: 89.0,
      primaryLanguage: "as",
      certificationHash: "sha256_55aa55cc_tarulata",
      certifiedAt: "2026-08-26T16:00:00Z",
    },
    {
      trainerId: "TR-MAJ-06",
      name: "Mousumi Nath",
      assignedPhcId: "PHC_06_GARMUR",
      phcName: "Garmur Civil Hospital PHC",
      district: "Majuli",
      osceScorePct: 90.5,
      primaryLanguage: "as",
      certificationHash: "sha256_66bb44dd_mousumi",
      certifiedAt: "2026-08-26T16:00:00Z",
    },
    // Ri-Bhoi (Nongpoh, Umsning)
    {
      trainerId: "TR-RIB-01",
      name: "Philimon Maring",
      assignedPhcId: "PHC_07_NONGPOH",
      phcName: "Nongpoh CHC & Model PHC",
      district: "Ri-Bhoi",
      osceScorePct: 93.0,
      primaryLanguage: "kha",
      certificationHash: "sha256_77cc33ee_philimon",
      certifiedAt: "2026-08-27T15:00:00Z",
    },
    {
      trainerId: "TR-RIB-02",
      name: "Dariti Syiem",
      assignedPhcId: "PHC_07_NONGPOH",
      phcName: "Nongpoh CHC & Model PHC",
      district: "Ri-Bhoi",
      osceScorePct: 88.5,
      primaryLanguage: "kha",
      certificationHash: "sha256_88dd22ff_dariti",
      certifiedAt: "2026-08-27T15:00:00Z",
    },
    {
      trainerId: "TR-RIB-03",
      name: "Ibalari Nongrum",
      assignedPhcId: "PHC_08_UMSNING",
      phcName: "Umsning Community PHC",
      district: "Ri-Bhoi",
      osceScorePct: 91.5,
      primaryLanguage: "kha",
      certificationHash: "sha256_99ee11aa_ibalari",
      certifiedAt: "2026-08-27T15:00:00Z",
    },
    {
      trainerId: "TR-RIB-04",
      name: "Biolinda Mawlong",
      assignedPhcId: "PHC_08_UMSNING",
      phcName: "Umsning Community PHC",
      district: "Ri-Bhoi",
      osceScorePct: 89.0,
      primaryLanguage: "kha",
      certificationHash: "sha256_00ff00bb_biolinda",
      certifiedAt: "2026-08-27T15:00:00Z",
    },
    // Churachandpur (Tuibong, Singngat)
    {
      trainerId: "TR-CHU-01",
      name: "Chinglunmawi",
      assignedPhcId: "PHC_09_TUIBONG",
      phcName: "Tuibong PHC",
      district: "Churachandpur",
      osceScorePct: 94.5,
      primaryLanguage: "lus",
      certificationHash: "sha256_11aa22cc_chinglunmawi",
      certifiedAt: "2026-08-28T16:30:00Z",
    },
    {
      trainerId: "TR-CHU-02",
      name: "Nemneikim Haokip",
      assignedPhcId: "PHC_09_TUIBONG",
      phcName: "Tuibong PHC",
      district: "Churachandpur",
      osceScorePct: 92.0,
      primaryLanguage: "mni",
      certificationHash: "sha256_33bb44dd_nemneikim",
      certifiedAt: "2026-08-28T16:30:00Z",
    },
    {
      trainerId: "TR-CHU-03",
      name: "Mercy Vungkhanching",
      assignedPhcId: "PHC_10_SINGNGAT",
      phcName: "Singngat Tribal Border PHC",
      district: "Churachandpur",
      osceScorePct: 87.0,
      primaryLanguage: "lus",
      certificationHash: "sha256_55cc66ee_mercy",
      certifiedAt: "2026-08-28T16:30:00Z",
    },
    {
      trainerId: "TR-CHU-04",
      name: "Lhingneithem Baite",
      assignedPhcId: "PHC_10_SINGNGAT",
      phcName: "Singngat Tribal Border PHC",
      district: "Churachandpur",
      osceScorePct: 88.0,
      primaryLanguage: "mni",
      certificationHash: "sha256_77dd88ff_lhingneithem",
      certifiedAt: "2026-08-28T16:30:00Z",
    },
  ];

  public static getTrainingCurriculumModules(): TrainingModule[] {
    return [...this.MODULES];
  }

  public static getCertifiedMasterAshas(): CertifiedMasterAsha[] {
    return [...this.CERTIFIED_TRAINERS];
  }

  public static getCircleFacilitationGuide(): CircleFacilitationSessionPlan[] {
    return [
      {
        themeId: "CIRCLE_THEME_01",
        themeTitle: "Village Haat & Old Trade Route Reminiscence",
        targetParticipants: 6,
        durationMinutes: 45,
        culturalPrompts: [
          "What was the first item you bought with your own earnings at the weekly haat?",
          "How did villagers cross the river before modern concrete bridges were built?",
        ],
        consentChecklist: [
          "Verbal assent confirmed from all seated elders",
          "Family caregiver informed of community circle participation",
          "No commercial branding or outsider attendance without PHC approval",
        ],
        calmingMelodyPreset: "Bihu_Bahi_Flute_Calm",
      },
      {
        themeId: "CIRCLE_THEME_02",
        themeTitle: "Traditional Weaving Motifs & Monsoon Folklore",
        targetParticipants: 6,
        durationMinutes: 45,
        culturalPrompts: [
          "Share the story of the first Gamusa or Shawl design you learned from your mother",
          "What seasonal songs were sung during the rice planting season?",
        ],
        consentChecklist: [
          "Participant comfort level verified with physical seating and hydration",
          "ASHA facilitator actively manages turn-taking without cognitive pressure",
        ],
        calmingMelodyPreset: "Pena_Manipur_Lullaby_Calm",
      },
    ];
  }

  public static getHelpDeskStatus(): HelpDeskTicketStatus[] {
    return [
      {
        tier: "TIER_1_ASHA_LEAD",
        tierDescription: "On-site Master ASHA peer resolution (App UI, elder comfort, language settings)",
        slaMaxHours: 0.5,
        openTicketsCount: 2,
        resolvedTicketsCount: 48,
        avgResolutionMinutes: 14,
      },
      {
        tier: "TIER_2_FIELD_ENGINEER",
        tierDescription: "NHM District Hardware & Sync Engineer (Battery, MDM kiosk lock, BLE mesh)",
        slaMaxHours: 2.0,
        openTicketsCount: 1,
        resolvedTicketsCount: 19,
        avgResolutionMinutes: 65,
      },
      {
        tier: "TIER_3_MEDICAL_OFFICER",
        tierDescription: "PHC Medical Officer & Tele-Neurologist (Acute elder agitation, delirium triage)",
        slaMaxHours: 4.0,
        openTicketsCount: 0,
        resolvedTicketsCount: 6,
        avgResolutionMinutes: 90,
      },
    ];
  }

  public static getAshaTrainingSummary(): AshaTrainingSummary {
    const totalHours = this.MODULES.reduce((sum, m) => sum + m.durationHours, 0);
    const avgScore =
      this.CERTIFIED_TRAINERS.reduce((sum, t) => sum + t.osceScorePct, 0) /
      this.CERTIFIED_TRAINERS.length;

    return {
      subPhase: "14.2 ASHA Worker Training Program",
      modulesCreated: this.MODULES.length,
      totalTrainingHours: totalHours,
      masterAshasCertified: this.CERTIFIED_TRAINERS.length,
      averageOsceScorePct: Math.round(avgScore * 10) / 10,
      circleFacilitationReady: true,
      helpdeskOperational: true,
      helpdeskActiveHelpline: "1800-345-SMRITI (Toll-Free BSNL)",
      status: "TRAINING_COMPLETE_CASCADE_READY",
    };
  }
}
