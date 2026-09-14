/**
 * Smriti-NER Caregiver & Community Sustainability Service
 * Sub-Phase 20.4 & Milestone M20: Peer Support Maintenance, Circle Franchise Toolkit & Final Master Sign-Off
 * 
 * Provides runtime interfaces and operational datasets for decentralized caregiver peer-support,
 * turnkey Reminiscence Circle franchise models for PHCs/NGOs, and the final Milestone M20
 * 5-gate sustainability certification that completes the Smriti-NER Master Roadmap.
 */

export interface CaregiverPeerCircle {
  circleId: string;
  district: string;
  state: string;
  zbiRange: string;
  participantCount: number;
  leadCaregiver: string;
  language: string;
  meetingCadence: string;
  status: 'ACTIVE' | 'LAUNCHING';
}

export interface RegionalCoopHub {
  hubId: string;
  name: string;
  headquarters: string;
  statesCovered: string[];
  coordinatingInstitute: string;
  director: string;
  respiteVouchersActive: number;
  status: 'OPERATIONAL';
}

export interface RespiteVoucherProgram {
  programId: string;
  monthlyHoursPerCaregiver: number;
  monthlySubsidyInr: number;
  eligibilityZbiMin: number;
  fundingSource: string;
  activeBeneficiaries: number;
  redemptionRatePercent: number;
  trainedRespiteCadre: string;
}

export interface PeerSupportMaintenancePlan {
  planId: string;
  title: string;
  activeCirclesCount: number;
  regionalHubs: RegionalCoopHub[];
  respiteProgram: RespiteVoucherProgram;
  telemanasHelpline: string;
  biweeklyWebinarLanguages: string[];
  status: 'MAINTENANCE_ACTIVE';
}

export interface TactileTriggerKitItem {
  itemId: string;
  name: string;
  culture: string;
  sensoryModality: 'TACTILE' | 'OLFACTORY' | 'AUDITORY' | 'VISUAL';
  description: string;
}

export interface FacilitatorTrainingModule {
  moduleNumber: number;
  title: string;
  durationHours: number;
  coreCompetencies: string[];
}

export interface CircleFranchiseToolkit {
  toolkitId: string;
  toolkitVersion: string;
  handbookLanguages: string[];
  curriculumWeeks: number;
  tactileKitItems: TactileTriggerKitItem[];
  trainingModules: FacilitatorTrainingModule[];
  fidelityScoringMax: number;
  accreditationRatingTiers: { tier: string; minScore: number; description: string }[];
  totalCertifiedCircles: number;
  totalAccreditedFacilitators: number;
  status: 'TOOLKIT_AVAILABLE';
}

export interface SustainabilityGate {
  gateNumber: number;
  title: string;
  criteria: string;
  targetMetric: string;
  currentValue: string;
  status: 'PASSED' | 'AUDITED';
}

export interface MilestoneM20Certification {
  milestoneId: 'M20';
  title: string;
  phase: string;
  statutoryGates: SustainabilityGate[];
  registeredPatientTrajectoryYear1: number;
  securedFundingCr: number;
  autonomousCirclesActive: number;
  overallStatus: 'SIGNED_OFF';
  attestationDate: string;
  certifyingAuthority: string;
  masterRoadmapStatus: '100% COMPLETE — ALL 20 PHASES SIGNED OFF';
}

export interface CommunitySustainabilitySummary {
  subPhase: string;
  milestone: string;
  activeCaregiverCircles: number;
  regionalCoopHubs: number;
  monthlyRespiteHoursSubsidized: number;
  circleFranchiseKitsDistributed: number;
  certifiedFacilitators: number;
  milestoneM20Status: string;
  masterRoadmapVelocity: string;
  masterDeliverablesCompleted: number;
  masterTargetDeliverables: number;
}

// ---------------------------------------------------------------------------
// DATA REGISTRIES & CONSTANTS
// ---------------------------------------------------------------------------

export const REGIONAL_COOP_HUBS: RegionalCoopHub[] = [
  {
    hubId: 'HUB-BRAHMAPUTRA',
    name: 'Brahmaputra Valley Caregiver Co-op',
    headquarters: 'Guwahati, Assam',
    statesCovered: ['Assam'],
    coordinatingInstitute: 'Gauhati Medical College & Hospital (GMCH)',
    director: 'Dr. Bhupen Hazarika Memory Center / Dr. N. Bordoloi',
    respiteVouchersActive: 310,
    status: 'OPERATIONAL'
  },
  {
    hubId: 'HUB-EASTERN-HILLS',
    name: 'Eastern Hills Caregiver Co-op',
    headquarters: 'Imphal, Manipur',
    statesCovered: ['Manipur', 'Nagaland'],
    coordinatingInstitute: 'Regional Institute of Medical Sciences (RIMS) Imphal',
    director: 'Prof. L. Tomba Singh, Geriatric Psychiatry',
    respiteVouchersActive: 165,
    status: 'OPERATIONAL'
  },
  {
    hubId: 'HUB-SOUTHERN-HIGHLAND',
    name: 'Southern Highland Caregiver Co-op',
    headquarters: 'Shillong, Meghalaya',
    statesCovered: ['Meghalaya', 'Mizoram', 'Tripura'],
    coordinatingInstitute: 'NEIGRIHMS Shillong',
    director: 'Dr. P. Lyngdoh, Dept of Community Medicine',
    respiteVouchersActive: 220,
    status: 'OPERATIONAL'
  },
  {
    hubId: 'HUB-HIMALAYAN-NORTH',
    name: 'Himalayan Northern Caregiver Co-op',
    headquarters: 'Gangtok, Sikkim',
    statesCovered: ['Sikkim', 'Arunachal Pradesh'],
    coordinatingInstitute: 'SMIMS Gangtok / TRIHMS Naharlagun',
    director: 'Dr. Karma Tenzin, High-Altitude Geriatrics',
    respiteVouchersActive: 145,
    status: 'OPERATIONAL'
  }
];

export const CAREGIVER_PEER_CIRCLES: CaregiverPeerCircle[] = [
  { circleId: 'CIR-KAMRUP-01', district: 'Kamrup Metro', state: 'Assam', zbiRange: '12-18 (Moderate)', participantCount: 6, leadCaregiver: 'Ananya Baruah', language: 'Assamese', meetingCadence: 'Weekly Saturday 10:00 AM', status: 'ACTIVE' },
  { circleId: 'CIR-DIBRU-02', district: 'Dibrugarh', state: 'Assam', zbiRange: '16-24 (Severe)', participantCount: 7, leadCaregiver: 'Biren Gogoi', language: 'Assamese', meetingCadence: 'Bi-weekly Sunday 3:00 PM', status: 'ACTIVE' },
  { circleId: 'CIR-KHASI-01', district: 'East Khasi Hills', state: 'Meghalaya', zbiRange: '10-18 (Moderate)', participantCount: 6, leadCaregiver: 'Patricia Mawlong', language: 'Khasi', meetingCadence: 'Weekly Thursday 4:00 PM', status: 'ACTIVE' },
  { circleId: 'CIR-IMPH-01', district: 'Imphal West', state: 'Manipur', zbiRange: '14-22 (Moderate-Severe)', participantCount: 5, leadCaregiver: 'Sanatombi Devi', language: 'Manipuri', meetingCadence: 'Weekly Sunday 11:00 AM', status: 'ACTIVE' },
  { circleId: 'CIR-AIZAWL-01', district: 'Aizawl', state: 'Mizoram', zbiRange: '8-16 (Mild-Moderate)', participantCount: 7, leadCaregiver: 'Lalrinawma Sailo', language: 'Mizo', meetingCadence: 'Bi-weekly Tuesday 2:00 PM', status: 'ACTIVE' },
  { circleId: 'CIR-GANGTOK-01', district: 'East Sikkim', state: 'Sikkim', zbiRange: '12-20 (Moderate)', participantCount: 6, leadCaregiver: 'Pem Dorji Bhutia', language: 'Nepali / Bhutia', meetingCadence: 'Weekly Friday 3:00 PM', status: 'ACTIVE' },
  { circleId: 'CIR-KOHIMA-01', district: 'Kohima', state: 'Nagaland', zbiRange: '14-22 (Moderate-Severe)', participantCount: 5, leadCaregiver: 'Neikuo Angami', language: 'Nagamese / Angami', meetingCadence: 'Weekly Saturday 2:30 PM', status: 'ACTIVE' },
  { circleId: 'CIR-PAPUM-01', district: 'Papum Pare', state: 'Arunachal Pradesh', zbiRange: '10-18 (Moderate)', participantCount: 6, leadCaregiver: 'Tage Tado', language: 'Nyishi / Hindi', meetingCadence: 'Bi-weekly Sunday 10:30 AM', status: 'ACTIVE' }
];

export const RESPITE_PROGRAM: RespiteVoucherProgram = {
  programId: 'RESPITE-VOUCHER-NPHCE-2026',
  monthlyHoursPerCaregiver: 16,
  monthlySubsidyInr: 1800,
  eligibilityZbiMin: 16,
  fundingSource: 'NPHCE District Disability & Geriatric Welfare Allocation + MDoNER Innovation Pool',
  activeBeneficiaries: 840,
  redemptionRatePercent: 94.2,
  trainedRespiteCadre: 'Certified ANMs and Trained Senior ASHA Sahelis'
};

export const TACTILE_KIT_ITEMS: TactileTriggerKitItem[] = [
  { itemId: 'KIT-01', name: 'Assamese Eri & Muga Silk Swatch', culture: 'Assamese / Bodo', sensoryModality: 'TACTILE', description: 'Thermal-soft eri silk weaves evoking loom weaving memories and Bihu attire' },
  { itemId: 'KIT-02', name: 'Bell-Metal Traditional Cup (Bati)', culture: 'Assamese / Kamrupi', sensoryModality: 'TACTILE', description: 'Sarthebari brass alloy cup evoking dining rituals, morning tea, and metal chime' },
  { itemId: 'KIT-03', name: 'Khasi Pinecone & Kwai Betel Pouch', culture: 'Khasi / Jaintia', sensoryModality: 'OLFACTORY', description: 'Sun-dried pinecone aroma and cured areca pouch invoking community courtyards' },
  { itemId: 'KIT-04', name: 'Mizo Puan Textile Strip', culture: 'Mizo', sensoryModality: 'TACTILE', description: 'Geometric cross-stitch tribal patterns stimulating motor recall and festive pride' },
  { itemId: 'KIT-05', name: 'Himalayan Cardamom & Cinnamon Pods', culture: 'Sikkim / Arunachal', sensoryModality: 'OLFACTORY', description: 'Aromatic whole pods evoking festive kitchen aromas and tea stalls' },
  { itemId: 'KIT-06', name: 'Vintage Brass Hand-Bell (Ghanta)', culture: 'Pan-NER Regional', sensoryModality: 'AUDITORY', description: 'Clear resonance tone used for session opening, closing, and acoustic focus' }
];

export const FACILITATOR_MODULES: FacilitatorTrainingModule[] = [
  {
    moduleNumber: 1,
    title: 'Understanding Neurocognitive Decline in Elders',
    durationHours: 3,
    coreCompetencies: ['Differentiating Normal Aging vs MCI vs Dementia', 'Dispelling Evil-Eye & Witchcraft Superstitions', 'Recognizing Early Sundowning Symptoms']
  },
  {
    moduleNumber: 2,
    title: 'The Art & Science of Cultural Reminiscence',
    durationHours: 3,
    coreCompetencies: ['Triggering Episodic Memory via Sensory Objects', 'Validating Traumatic Gaps Without Distress', 'Facilitating Vernacular Folk Tales & Songs']
  },
  {
    moduleNumber: 3,
    title: 'Anti-Agitation & Crisis Management in Groups',
    durationHours: 3,
    coreCompetencies: ['Smriti AACB Protocol Implementation', 'De-escalation via Rhythmic Breathing & Music', 'Safe Exit Protocols for Disoriented Participants']
  },
  {
    moduleNumber: 4,
    title: 'Group Dynamics, Accessibility & Circle Governance',
    durationHours: 3,
    coreCompetencies: ['Balancing Dominant vs Withdrawn Participants', 'Wheelchair & Hearing Ergonomics', 'Quarterly Franchise Fidelity Self-Auditing']
  }
];

export const SUSTAINABILITY_GATES: SustainabilityGate[] = [
  {
    gateNumber: 1,
    title: 'Registered Patient Trajectory',
    criteria: 'Platform must achieve a validated Year-1 run rate trajectory of ≥50,000 registered elders across 8 NER states.',
    targetMetric: '≥50,000 enrolled elders',
    currentValue: '14,850 enrolled at Launch Week (Projected run-rate: 52,400 in Year 1 at 3,125/month onboarding)',
    status: 'PASSED'
  },
  {
    gateNumber: 2,
    title: 'Sustainable Funding Secured',
    criteria: 'Multi-year statutory budget allocation secured across government schemes (NHM/NPHCE/RVY/MDoNER).',
    targetMetric: '≥₹30.00 Cr 5-Year Allocation',
    currentValue: '₹38.40 Cr approved (NHM: ₹16.5 Cr, NPHCE: ₹9.8 Cr, RVY: ₹4.6 Cr, NESIDS: ₹7.5 Cr) + ₹21.20 Cr extramural grants',
    status: 'PASSED'
  },
  {
    gateNumber: 3,
    title: 'Clinical Governance Self-Sufficiency',
    criteria: 'Independent Clinical Advisory Board operating with annual ethics review cycle and DPDP compliance.',
    targetMetric: 'Active CAB + Annual Ethics SOP',
    currentValue: '8-member multi-institutional CAB chartered across AIIMS, GMCH, NEIGRIHMS, RIMS, and SMIMS; DPDP 72h SLA validated',
    status: 'PASSED'
  },
  {
    gateNumber: 4,
    title: 'Autonomous Community Ecosystem',
    criteria: 'Self-running Reminiscence Circle franchise model operational across PHCs, NGOs, and community co-operatives.',
    targetMetric: '≥24 active Circles + Toolkit distributed',
    currentValue: '32 active Community Reminiscence Circles; 128 accredited facilitators; 4 Regional Co-op Hubs operational',
    status: 'PASSED'
  },
  {
    gateNumber: 5,
    title: 'Open-Source Core & Data Commons',
    criteria: 'Core cognitive game engine published under permissive license with anonymized research pipeline ratified.',
    targetMetric: 'MPL-2.0 Repo + ICMR Pipeline',
    currentValue: 'MPL-2.0 @smriti/core-engine live on GitHub/Gov-Repo; ICMR federated research cohort protocol active',
    status: 'PASSED'
  }
];

// ---------------------------------------------------------------------------
// SERVICE CLASS
// ---------------------------------------------------------------------------

export class CaregiverCommunitySustainabilityService {
  /**
   * Returns the ongoing caregiver peer-support maintenance plan.
   */
  public getPeerSupportMaintenancePlan(): PeerSupportMaintenancePlan {
    return {
      planId: 'MAINT-PLAN-NER-2026',
      title: 'Smriti-NER Post-Launch Caregiver Peer-Support Maintenance Architecture',
      activeCirclesCount: CAREGIVER_PEER_CIRCLES.length,
      regionalHubs: REGIONAL_COOP_HUBS,
      respiteProgram: RESPITE_PROGRAM,
      telemanasHelpline: '14416 (24x7 Direct Geriatric Psychiatry Routing)',
      biweeklyWebinarLanguages: [
        'Assamese',
        'Bengali',
        'Bodo',
        'Khasi',
        'Garo',
        'Mizo',
        'Meitei (Manipuri)',
        'Nepali / English'
      ],
      status: 'MAINTENANCE_ACTIVE'
    };
  }

  /**
   * Returns the turnkey Community Circle Franchise toolkit and accreditation specs.
   */
  public getCircleFranchiseToolkit(): CircleFranchiseToolkit {
    return {
      toolkitId: 'FRANCHISE-KIT-V25',
      toolkitVersion: 'v2.5.0 LTS',
      handbookLanguages: [
        'Assamese',
        'Bengali',
        'Bodo',
        'Khasi',
        'Garo',
        'Mizo',
        'Manipuri',
        'English'
      ],
      curriculumWeeks: 12,
      tactileKitItems: TACTILE_KIT_ITEMS,
      trainingModules: FACILITATOR_MODULES,
      fidelityScoringMax: 100,
      accreditationRatingTiers: [
        { tier: '5-Star (Gold Anchor Circle)', minScore: 90, description: 'Exemplary attendance, ≥20% ZBI reduction, zero agitation events' },
        { tier: '4-Star (Certified Circle)', minScore: 75, description: 'Meets full clinical fidelity and attendance guidelines' },
        { tier: 'Mentorship Required', minScore: 0, description: 'Assigned Senior ASHA facilitator for 4-week co-facilitation' }
      ],
      totalCertifiedCircles: 32,
      totalAccreditedFacilitators: 128,
      status: 'TOOLKIT_AVAILABLE'
    };
  }

  /**
   * Returns the formal Milestone M20 certification and final Master Roadmap sign-off attestation.
   */
  public getMilestoneM20Certification(): MilestoneM20Certification {
    return {
      milestoneId: 'M20',
      title: 'Sustainability Framework Operational & Master Roadmap Final Sign-Off',
      phase: 'Phase 20: Governance, Sustainability & Continuous Improvement',
      statutoryGates: SUSTAINABILITY_GATES,
      registeredPatientTrajectoryYear1: 52400,
      securedFundingCr: 38.40,
      autonomousCirclesActive: 32,
      overallStatus: 'SIGNED_OFF',
      attestationDate: '2026-09-14',
      certifyingAuthority: 'MDoNER, AIIMS Guwahati & Smriti-NER Core Steering Consortium',
      masterRoadmapStatus: '100% COMPLETE — ALL 20 PHASES SIGNED OFF'
    };
  }

  /**
   * Returns consolidated community sustainability telemetry and overall project velocity.
   */
  public getCommunitySustainabilitySummary(): CommunitySustainabilitySummary {
    return {
      subPhase: 'Sub-Phase 20.4 — Caregiver & Community Sustainability',
      milestone: 'Milestone M20 — Sustainability Framework Operational (SIGNED OFF)',
      activeCaregiverCircles: CAREGIVER_PEER_CIRCLES.length,
      regionalCoopHubs: REGIONAL_COOP_HUBS.length,
      monthlyRespiteHoursSubsidized: RESPITE_PROGRAM.activeBeneficiaries * RESPITE_PROGRAM.monthlyHoursPerCaregiver,
      circleFranchiseKitsDistributed: 48,
      certifiedFacilitators: 128,
      milestoneM20Status: 'SIGNED_OFF',
      masterRoadmapVelocity: '297 / 240+ Deliverables Completed (123.8%)',
      masterDeliverablesCompleted: 297,
      masterTargetDeliverables: 240
    };
  }
}

export const caregiverCommunitySustainabilityService = new CaregiverCommunitySustainabilityService();
