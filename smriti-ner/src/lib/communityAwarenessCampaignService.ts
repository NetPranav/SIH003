/**
 * Smriti-NER Community Awareness Campaign Service
 * Sub-Phase 19.2: Grassroots Demand Generation & Awareness Architecture
 * 
 * Coordinates village-level Panchayat awareness drives across 16 districts,
 * vernacular radio broadcast spots across 9 AIR & community stations in 8 languages,
 * and strategic NGO/SHG institutional partnership MOUs.
 */

export interface CampaignScheduleItem {
  districtId: string;
  districtName: string;
  state: string;
  wave: string;
  startWeek: number;
  endWeek: number;
  targetPanchayats: number;
  targetElders: number;
  ashaPairsDeployed: number;
  leadVenue: string;
}

export interface RadioSpotScript {
  languageCode: string;
  languageName: string;
  spotTitle: string;
  durationSeconds: number;
  stations: string[];
  broadcastWindows: string[];
  scriptTextVernacular: string;
  scriptTextEnglish: string;
  callToAction: string;
}

export interface PartnershipMOU {
  mouId: string;
  partnerName: string;
  organizationType: 'NGO' | 'CLINICAL_SOCIETY' | 'SHG_FEDERATION' | 'COMMUNITY_COUNCIL';
  statesCovered: string[];
  networkScope: string;
  coreDeliverables: string[];
  signatoryAuthority: string;
  termDurationYears: number;
  status: 'EXECUTED' | 'ACTIVE' | 'RATIFIED';
}

export const CAMPAIGN_SCHEDULE: CampaignScheduleItem[] = [
  // Wave 1: Foothills & Plains (Weeks 84–85)
  { districtId: 'dist_kamrup', districtName: 'Kamrup Metropolitan', state: 'Assam', wave: 'Wave 1: Plains & Urban Hubs', startWeek: 84, endWeek: 85, targetPanchayats: 28, targetElders: 2200, ashaPairsDeployed: 56, leadVenue: 'Beltola Community Bhavan' },
  { districtId: 'dist_majuli', districtName: 'Majuli River Island', state: 'Assam', wave: 'Wave 1: Plains & Urban Hubs', startWeek: 84, endWeek: 85, targetPanchayats: 20, targetElders: 1400, ashaPairsDeployed: 40, leadVenue: 'Garamur Satra Namghar' },
  { districtId: 'dist_cachar', districtName: 'Cachar (Barak Valley)', state: 'Assam', wave: 'Wave 1: Plains & Urban Hubs', startWeek: 84, endWeek: 85, targetPanchayats: 24, targetElders: 1800, ashaPairsDeployed: 48, leadVenue: 'Silchar Town Hall' },
  { districtId: 'dist_west_tripura', districtName: 'West Tripura', state: 'Tripura', wave: 'Wave 1: Plains & Urban Hubs', startWeek: 84, endWeek: 85, targetPanchayats: 25, targetElders: 1900, ashaPairsDeployed: 50, leadVenue: 'Agartala Town Hall' },
  { districtId: 'dist_papum_pare', districtName: 'Papum Pare', state: 'Arunachal Pradesh', wave: 'Wave 1: Plains & Urban Hubs', startWeek: 84, endWeek: 85, targetPanchayats: 18, targetElders: 1100, ashaPairsDeployed: 36, leadVenue: 'Naharlagun Community Centre' },
  { districtId: 'dist_imphal_west', districtName: 'Imphal West', state: 'Manipur', wave: 'Wave 1: Plains & Urban Hubs', startWeek: 84, endWeek: 85, targetPanchayats: 26, targetElders: 2000, ashaPairsDeployed: 52, leadVenue: 'Kangla Western Gate Complex' },

  // Wave 2: Hills & Tribal Valleys (Weeks 86–87)
  { districtId: 'dist_east_khasi', districtName: 'East Khasi Hills', state: 'Meghalaya', wave: 'Wave 2: Hills & Tribal Valleys', startWeek: 86, endWeek: 87, targetPanchayats: 24, targetElders: 1700, ashaPairsDeployed: 48, leadVenue: 'Dorbar Shnong Mawlai Courtyard' },
  { districtId: 'dist_west_garo', districtName: 'West Garo Hills', state: 'Meghalaya', wave: 'Wave 2: Hills & Tribal Valleys', startWeek: 86, endWeek: 87, targetPanchayats: 22, targetElders: 1500, ashaPairsDeployed: 44, leadVenue: 'Tura Cultural Centre' },
  { districtId: 'dist_aizawl', districtName: 'Aizawl District', state: 'Mizoram', wave: 'Wave 2: Hills & Tribal Valleys', startWeek: 86, endWeek: 87, targetPanchayats: 25, targetElders: 1850, ashaPairsDeployed: 50, leadVenue: 'Vanapa Hall Complex' },
  { districtId: 'dist_lunglei', districtName: 'Lunglei District', state: 'Mizoram', wave: 'Wave 2: Hills & Tribal Valleys', startWeek: 86, endWeek: 87, targetPanchayats: 18, targetElders: 1200, ashaPairsDeployed: 36, leadVenue: 'Lunglei Convention Hall' },
  { districtId: 'dist_kohima', districtName: 'Kohima District', state: 'Nagaland', wave: 'Wave 2: Hills & Tribal Valleys', startWeek: 86, endWeek: 87, targetPanchayats: 22, targetElders: 1600, ashaPairsDeployed: 44, leadVenue: 'State Academy Hall Kohima' },
  { districtId: 'dist_mokokchung', districtName: 'Mokokchung District', state: 'Nagaland', wave: 'Wave 2: Hills & Tribal Valleys', startWeek: 86, endWeek: 87, targetPanchayats: 20, targetElders: 1350, ashaPairsDeployed: 40, leadVenue: 'Mokokchung Town Hall' },

  // Wave 3: Alpine Border & High Altitude (Weeks 88–90)
  { districtId: 'dist_tawang', districtName: 'Tawang Alpine District', state: 'Arunachal Pradesh', wave: 'Wave 3: Alpine Border & High Altitude', startWeek: 88, endWeek: 90, targetPanchayats: 14, targetElders: 900, ashaPairsDeployed: 28, leadVenue: 'Tawang Kalawangpo Hall' },
  { districtId: 'dist_churachandpur', districtName: 'Churachandpur', state: 'Manipur', wave: 'Wave 3: Alpine Border & High Altitude', startWeek: 88, endWeek: 90, targetPanchayats: 20, targetElders: 1400, ashaPairsDeployed: 40, leadVenue: 'Hiangtam Lamka Community Hall' },
  { districtId: 'dist_south_sikkim', districtName: 'Namchi (South Sikkim)', state: 'Sikkim', wave: 'Wave 3: Alpine Border & High Altitude', startWeek: 88, endWeek: 90, targetPanchayats: 18, targetElders: 1200, ashaPairsDeployed: 36, leadVenue: 'Namchi Central Park Pavilion' },
  { districtId: 'dist_north_sikkim', districtName: 'Mangan (North Sikkim)', state: 'Sikkim', wave: 'Wave 3: Alpine Border & High Altitude', startWeek: 88, endWeek: 90, targetPanchayats: 12, targetElders: 800, ashaPairsDeployed: 24, leadVenue: 'Mangan District Hall' }
];

export const RADIO_SPOT_SCRIPTS: RadioSpotScript[] = [
  {
    languageCode: 'as',
    languageName: 'Assamese',
    spotTitle: 'স্মৃতিৰ সুবাস — আই-বোপাইৰ মগজুৰ যত্ন',
    durationSeconds: 45,
    stations: ['AIR Guwahati (1035 kHz)', 'AIR Dibrugarh (567 kHz)', 'Radio Luit FM (90.8 MHz)'],
    broadcastWindows: ['07:15 - 07:30 IST (Morning Tea Band)', '18:45 - 19:00 IST (Krishi O Gramya)'],
    scriptTextVernacular: 'আই-বোপাইৰ মৰমৰ স্মৃতি... বিহু গীত আৰু সাধুকথাৰে মগজুৰ সতেজতা ঘূৰাই আনক। ডিমেনচিয়া বা পাহৰি যোৱা ৰোগক অৱহেলা নকৰিব। বিনামূলীয়া সহায়ৰ বাবে ১৮০০-৮৯০-স্মৃতি নম্বৰত কল কৰক।',
    scriptTextEnglish: 'Preserve cherished memories of elders through Bihu songs and folk tales. Do not neglect dementia. Call toll-free 1800-890-SMRITI.',
    callToAction: '১৮০০-৮৯০-৭৬৭৪৮৪ নম্বৰত কল কৰক'
  },
  {
    languageCode: 'bn',
    languageName: 'Bengali',
    spotTitle: 'স্মৃতি জাগানো — প্রবীণদের আনন্দ ও যত্ন',
    durationSeconds: 45,
    stations: ['AIR Silchar (828 kHz)', 'AIR Agartala (1269 kHz)', 'Chillar FM (91.2 MHz)'],
    broadcastWindows: ['07:00 - 07:15 IST (Pratah Band)', '19:15 - 19:30 IST (Gramin Asar)'],
    scriptTextVernacular: 'পুরনো দিনের গান, ফেলে আসা সোনালী স্মৃতি... বয়সের ভারে মন ভুলতে দেবেন না। লোকগীতি ও ধাঁধার খেলায় সতেজ রাখুন প্রবীণদের ব্রেন। যোগাযোগ করুন বিনামূল্যে ১৮০০-৮৯০-স্মৃতি নম্বরে।',
    scriptTextEnglish: 'Keep elders’ minds sharp with traditional folk songs and riddles. Do not let old age fade away precious memories. Call toll-free 1800-890-SMRITI.',
    callToAction: 'কল করুন ১৮০০-৮৯০-৭৬৭৪৮৪ নম্বরে'
  },
  {
    languageCode: 'brx',
    languageName: 'Bodo',
    spotTitle: 'मेलेमनि बिथोन — आइजो-आफाफोरनि रैखाथि',
    durationSeconds: 40,
    stations: ['AIR Kokrajhar (102.6 MHz)', 'AIR Guwahati (1035 kHz)'],
    broadcastWindows: ['07:30 - 07:45 IST', '19:00 - 19:15 IST'],
    scriptTextVernacular: 'बर\' हारिमु, मेथाइ आरो बाथ्राफोरनि गेजेरजों मेलेमखौ गोख्रों खालाम। आइजो-आफाफोरखौ गोसोमैल\' जानायनिफ्राय रैखाथि हो। कल खालाम अननानै १८००-८९०-स्म्रितिनाव।',
    scriptTextEnglish: 'Strengthen cognitive faculties using Bodo folklore, songs, and traditional wisdom. Call toll-free 1800-890-SMRITI.',
    callToAction: 'कल खालाम १८००-८९०-७६७४८४'
  },
  {
    languageCode: 'mni',
    languageName: 'Meitei',
    spotTitle: 'পুৱারি নীংশিংবা — অহলশিংগী পুকচেল',
    durationSeconds: 45,
    stations: ['AIR Imphal (756 kHz)', 'Sangai FM (91.2 MHz)'],
    broadcastWindows: ['06:45 - 07:00 IST (Nongalloi)', '18:30 - 18:45 IST (Khunung Esei)'],
    scriptTextVernacular: 'মৈতৈলোনগী লাইরিক অমসুং পুৱারিগী ৱারীশিংগা লোয়ননা অহলশিংগী ৱাখলবু ফগৎহনসি। পুকচেল সতেজ তৌনবা ১৮০০-৮৯০-স্মৃতীদা কোল তৌবীয়ু।',
    scriptTextEnglish: 'Revitalize elder cognitive vitality through Manipuri oral history and ballads. Call toll-free 1800-890-SMRITI.',
    callToAction: 'কোল তৌবীয়ু ১৮০০-৮৯০-৭৬৭৪৮৪'
  },
  {
    languageCode: 'lus',
    languageName: 'Mizo',
    spotTitle: 'Hriatna Tichaktu — Kan Pitar Putarte Tan',
    durationSeconds: 40,
    stations: ['AIR Aizawl (846 kHz)', 'LPS FM Aizawl (101.1 MHz)'],
    broadcastWindows: ['07:00 - 07:15 IST (Zing Daifim)', '19:30 - 19:45 IST (Zan Khawhar Hnem)'],
    scriptTextVernacular: 'Kan pitar leh putarte hriatna vawng him rawh u. Hla hlui leh thawnthu ngaihthlak nan leh hriatna tichak turin 1800-890-SMRITI ah hian awlsamtein a biak theih e.',
    scriptTextEnglish: 'Protect the memory of our elders through old songs and folklore. Easily reach out at toll-free 1800-890-SMRITI.',
    callToAction: 'Biak rawh le 1800-890-767484'
  },
  {
    languageCode: 'kha',
    languageName: 'Khasi',
    spotTitle: 'Ka Jingkoit Jingkhiah ki Tymmen — Kynmaw ia ki Parom',
    durationSeconds: 45,
    stations: ['AIR Shillong (864 kHz)', 'Red FM Shillong (93.5 MHz)'],
    broadcastWindows: ['07:15 - 07:30 IST', '18:15 - 18:30 IST'],
    scriptTextVernacular: 'Pynneh pynsah ia ki parom bad ki sur tynrai jong ki tymmen ki san ha Ri-lum Meghalaya. Iada ia ka jingklet noh da kaba phone sha 1800-890-SMRITI.',
    scriptTextEnglish: 'Sustain traditional stories and songs of our elders across Meghalaya hills. Prevent memory decline by calling toll-free 1800-890-SMRITI.',
    callToAction: 'Phone ha 1800-890-767484'
  },
  {
    languageCode: 'grt',
    languageName: 'Garo',
    spotTitle: 'Ma•gitcham Pagitchamrangni Gisik Tang•ani',
    durationSeconds: 40,
    stations: ['AIR Tura (102.2 MHz)', 'AIR Shillong (864 kHz)'],
    broadcastWindows: ['07:30 - 07:45 IST', '19:00 - 19:15 IST'],
    scriptTextVernacular: 'A•chik ma•gitcham pagitchamrangni gisik an•sengatani gimin golpo aro ring•aniko man•na gita 1800-890-SMRITI-o phone ka•bo. Cha•gualani aro gualgnirangko champengbo.',
    scriptTextEnglish: 'Call 1800-890-SMRITI for elder brain rejuvenation through Garo storytelling and folk songs. Prevent cognitive decline.',
    callToAction: 'Phone ka•bo 1800-890-767484'
  },
  {
    languageCode: 'en',
    languageName: 'English & Nagamese',
    spotTitle: 'Cherishing Elder Memories Across Northeast India',
    durationSeconds: 45,
    stations: ['AIR Kohima (1188 kHz)', 'AIR Itanagar (675 kHz)', 'AIR Gangtok (1566 kHz)'],
    broadcastWindows: ['08:00 - 08:15 IST', '19:45 - 20:00 IST'],
    scriptTextVernacular: 'Elderly minds deserve care, respect, and joyful memories. Connect your grandparents to daily folklore and memory stimulation. Dial toll-free 1800-890-SMRITI.',
    scriptTextEnglish: 'Elderly minds deserve care, respect, and joyful memories. Connect your grandparents to daily folklore and memory stimulation. Dial toll-free 1800-890-SMRITI.',
    callToAction: 'Call Toll-Free 1800-890-767484'
  }
];

export const PARTNERSHIP_MOUS: PartnershipMOU[] = [
  {
    mouId: 'MOU-SMRITI-HELPA-2026',
    partnerName: 'HelpAge India (Northeast Regional Directorate)',
    organizationType: 'NGO',
    statesCovered: ['Assam', 'Meghalaya', 'Manipur', 'Tripura'],
    networkScope: '150+ Elder Self-Help Groups (ESHGs), 8 Mobile Healthcare Units (MHUs), 12 Senior Daycare Centres',
    coreDeliverables: [
      'Screening integration into HelpAge mobile health vans',
      'Cognitive circle activities in HelpAge senior daycare centres',
      'Elder peer-advocacy and digital literacy volunteer support'
    ],
    signatoryAuthority: 'Regional Director, HelpAge India NER',
    termDurationYears: 3,
    status: 'ACTIVE'
  },
  {
    mouId: 'MOU-SMRITI-ARDSI-2026',
    partnerName: 'Alzheimer’s and Related Disorders Society of India (ARDSI - Guwahati & Imphal Chapters)',
    organizationType: 'CLINICAL_SOCIETY',
    statesCovered: ['Assam', 'Manipur', 'Nagaland', 'Mizoram'],
    networkScope: '12 Memory Clinics, 80 Caregiver Support Circles, 35 Consulting Neurologists/Psychiatrists',
    coreDeliverables: [
      'Secondary clinical triage for high-risk CCEI cognitive drop flags',
      'Monthly caregiver psychoeducation and burn-out relief webinars',
      'Clinical validation of AACB acoustic markers against standard ACE-III'
    ],
    signatoryAuthority: 'State Chapter Presidents, ARDSI',
    termDurationYears: 3,
    status: 'ACTIVE'
  },
  {
    mouId: 'MOU-SMRITI-NERLP-2026',
    partnerName: 'Northeast Rural Livelihood Project (NERLP) Women’s SHG Federation',
    organizationType: 'SHG_FEDERATION',
    statesCovered: ['Assam', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim'],
    networkScope: '480 Village Women’s SHGs (5,200+ rural women community mobilizers)',
    coreDeliverables: [
      'Door-to-door zero-device feature phone caller ID registration',
      'Village Namghar and Morung community reminiscence circle leadership',
      'Distribution and upkeep of illustrated cultural reminiscence flipcharts'
    ],
    signatoryAuthority: 'State Project Coordinators, NERLP Federation',
    termDurationYears: 2,
    status: 'ACTIVE'
  },
  {
    mouId: 'MOU-SMRITI-SSCS-2026',
    partnerName: 'Sikkim Senior Citizens Society & Tribal Council Alliances',
    organizationType: 'COMMUNITY_COUNCIL',
    statesCovered: ['Sikkim', 'Arunachal Pradesh'],
    networkScope: '45 Alpine Village Gompas, 60 Tribal Council Dorbar Circles',
    coreDeliverables: [
      'High-altitude alpine outreach in remote snow-bound hamlets',
      'Bhutia, Lepcha, and Monpa oral folklore and sacred chant curation',
      'Village headman (Gaon Burha / Pipon) endorsement and mobilization'
    ],
    signatoryAuthority: 'General Secretary, Sikkim Senior Citizens Society',
    termDurationYears: 3,
    status: 'ACTIVE'
  }
];

export class CommunityAwarenessCampaignService {
  /**
   * Retrieves full campaign schedule across 16 districts.
   */
  public getCampaignSchedule(): CampaignScheduleItem[] {
    return CAMPAIGN_SCHEDULE;
  }

  /**
   * Retrieves campaign schedule for a specific district.
   */
  public getScheduleForDistrict(districtId: string): CampaignScheduleItem | null {
    return CAMPAIGN_SCHEDULE.find(item => item.districtId === districtId) || null;
  }

  /**
   * Retrieves all radio spot scripts across 8 languages.
   */
  public getRadioSpotScripts(): RadioSpotScript[] {
    return RADIO_SPOT_SCRIPTS;
  }

  /**
   * Retrieves radio spot script by language code.
   */
  public getRadioScriptByLanguage(languageCode: string): RadioSpotScript | null {
    return RADIO_SPOT_SCRIPTS.find(script => script.languageCode === languageCode) || null;
  }

  /**
   * Retrieves all active institutional partnership MOUs.
   */
  public getPartnershipMOUs(): PartnershipMOU[] {
    return PARTNERSHIP_MOUS;
  }

  /**
   * Returns consolidated awareness campaign status summary.
   */
  public getAwarenessCampaignSummary(): {
    subPhase: string;
    targetDistrictsCount: number;
    totalTargetPanchayats: number;
    totalTargetElders: number;
    totalAshaPairsDeployed: number;
    radioLanguagesCount: number;
    totalRadioStations: number;
    activeMousCount: number;
    campaignStatus: string;
  } {
    const totalPanchayats = CAMPAIGN_SCHEDULE.reduce((sum, item) => sum + item.targetPanchayats, 0);
    const totalElders = CAMPAIGN_SCHEDULE.reduce((sum, item) => sum + item.targetElders, 0);
    const totalAshas = CAMPAIGN_SCHEDULE.reduce((sum, item) => sum + item.ashaPairsDeployed, 0);
    const allStations = new Set<string>();
    RADIO_SPOT_SCRIPTS.forEach(script => script.stations.forEach(s => allStations.add(s)));

    return {
      subPhase: 'Sub-Phase 19.2: Community Awareness Campaign',
      targetDistrictsCount: CAMPAIGN_SCHEDULE.length,
      totalTargetPanchayats: totalPanchayats,
      totalTargetElders: totalElders,
      totalAshaPairsDeployed: totalAshas,
      radioLanguagesCount: RADIO_SPOT_SCRIPTS.length,
      totalRadioStations: allStations.size,
      activeMousCount: PARTNERSHIP_MOUS.length,
      campaignStatus: 'CAMPAIGN_ROLLOUT_ACTIVE'
    };
  }
}

export const communityAwarenessCampaignService = new CommunityAwarenessCampaignService();
