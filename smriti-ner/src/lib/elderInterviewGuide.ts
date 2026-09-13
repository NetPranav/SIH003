// ── SMRITI-NER ELDER LIFE-STORY INTERVIEW PILOT & PROTOCOL GUIDE ─────────────
// Sub-Phase 1.4 Deliverable: 4-Stage Oral History Protocol & Sample Vignette Archive

export interface InterviewStage {
  stageNumber: number;
  stageTitle: string;
  nativeTitle: string;
  targetLifeSpan: string; // e.g. "Ages 5–18: Childhood & Village"
  durationMinutes: number;
  coreQuestions: string[];
  clinicalPurpose: string;
  compassionateTip: string;
}

export interface ElderVignette {
  id: string;
  elderName: string;
  age: number;
  location: string;
  community: string;
  theme: string;
  quoteSnippet: string;
  cognitiveResponse: string; // e.g., "Calm, smiles, zero agitation"
}

export const FOUR_STAGE_INTERVIEW_PROTOCOL: InterviewStage[] = [
  {
    stageNumber: 1,
    stageTitle: "Village Roots & Childhood Hearth",
    nativeTitle: "শৈশৱৰ গাঁও আৰু জুহালৰ স্মৃতি",
    targetLifeSpan: "Ages 5–18: Early Memories",
    durationMinutes: 6,
    coreQuestions: [
      "What was the name of your ancestral village or riverbank where you grew up?",
      "Can you tell me about the evening fire (Juhal / Meji) in winter? What games did you play with childhood friends?",
      "Who was the gentlest person in your home when you were small?",
    ],
    clinicalPurpose: "Ribot's Law retrieval: Targets remote autobiographical engrams consolidated in neocortical temporal circuits.",
    compassionateTip: "If the elder cannot recall specific calendar years or dates, never correct them. Focus on sensory details: smells, sounds of rain on tin roofs, and tastes.",
  },
  {
    stageNumber: 2,
    stageTitle: "Youth, Courtship & Festive Celebrations",
    nativeTitle: "যৌৱনকাল, উৎসৱ আৰু প্ৰেমৰ স্মৃতি",
    targetLifeSpan: "Ages 18–30: The Reminiscence Bump",
    durationMinutes: 7,
    coreQuestions: [
      "Tell me about the first Bihu, Chapchar Kut, or Wangala festival where you danced or played an instrument.",
      "How did you and your spouse first meet? What traditional clothes did you wear?",
      "What was the proudest day of your youth?",
    ],
    clinicalPurpose: "Accesses the 'Reminiscence Bump'—the dense neural cluster of identity-defining memories with highest emotional valence.",
    compassionateTip: "Play a faint background recording of the Pepa or Duitara to acoustically prompt retrieval.",
  },
  {
    stageNumber: 3,
    stageTitle: "Life's Craft, Farming & Family Raising",
    nativeTitle: "জীৱনৰ সাধনা, কৰ্ম আৰু পৰিয়াল গঢ়াৰ কাহিনী",
    targetLifeSpan: "Ages 30–55: Midlife Mastery",
    durationMinutes: 6,
    coreQuestions: [
      "What did your hands love making the most—weaving on the loom, tending the paddy fields, or building the home?",
      "Can you describe your children when they were babies taking their first steps?",
      "What traditional recipe or family dish was your specialty during harvest festivals?",
    ],
    clinicalPurpose: "Procedural memory recall (praxis) and parental role reinforcement, sustaining dignity and self-worth.",
    compassionateTip: "Have physical touch cues ready—a piece of raw Muga silk thread or a brass bell.",
  },
  {
    stageNumber: 4,
    stageTitle: "Grandchildren, Blessings & Legacy",
    nativeTitle: "নাতি-নাতিনীৰ মৰম আৰু জীৱনৰ আৰ্শীবাদ",
    targetLifeSpan: "Senior Years: Wisdom & Closure",
    durationMinutes: 5,
    coreQuestions: [
      "What is the most important advice you want your grandchildren to carry in their hearts?",
      "What blessing do you give to your family today?",
      "What brings peace to your mind when you look outside at the trees and sky?",
    ],
    clinicalPurpose: "Integrative life-review (Butler's Theory): Reconciles life achievements, reduces existential dread, and instills peaceful closure.",
    compassionateTip: "Conclude with a warm touch on the shoulder and recorded verbal praise from their grandchild.",
  },
];

export const SAMPLE_ELDER_VIGNETTES: ElderVignette[] = [
  {
    id: "v1_birendra",
    elderName: "Birendra Nath Baruah",
    age: 74,
    location: "Jorhat / Guwahati, Assam",
    community: "Assamese",
    theme: "Playing Dhol in the Tea Gardens (1970)",
    quoteSnippet: "We used to cross the Bhogdoi river on wooden boats with our dhols wrapped in banana leaves so the rain wouldn't wet the leather. The rhythm stayed in my fingers for days.",
    cognitiveResponse: "Smiles warmly, finger taps rhythm on knees; zero confusion or disorientation.",
  },
  {
    id: "v2_radhabinod",
    elderName: "Radhabinod Sharma",
    age: 78,
    location: "Imphal East, Manipur",
    community: "Meitei",
    theme: "Sankirtana Pung Cholom in Govindaji Temple",
    quoteSnippet: "When the temple bells rang at dawn, our masters taught us that each beat of the Pung is a prayer for the peace of Manipur. We leaped like deer on the courtyard tiles.",
    cognitiveResponse: "Closes eyes in deep serenity; heart rate stabilizes, posture visibly upright.",
  },
  {
    id: "v3_ka_merilda",
    elderName: "Kong Merilda Lyngdoh",
    age: 81,
    location: "Cherrapunji (Sohra), Meghalaya",
    community: "Khasi",
    theme: "Weaving Mulberry Silk in the Cloud Rain",
    quoteSnippet: "The rain would drum on our betel-nut trees for two weeks straight. My mother would sit beside the fireplace, guiding my hands on the loin loom: 'Straight thread, pure heart.'",
    cognitiveResponse: "Recognizes grandson's voice immediately; tearful gratitude and peaceful relaxation.",
  },
];
