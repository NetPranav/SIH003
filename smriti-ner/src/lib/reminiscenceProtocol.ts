// ── COCHRANE-ALIGNED REMINISCENCE THERAPY (RT) PROTOCOL v1.0 ─────────────────
// Formulated under Cochrane Dementia Group meta-analytic standards (Woods et al.)
// Standard Dosage: 15–20 minutes/session, 2–3 times daily

export interface RTStage {
  id: number;
  name: string;
  nativeName: string;
  durationMinutes: number;
  clinicalRationale: string;
  targetDomain: string;
  sensoryStimulus: string;
  instructions: string;
}

export interface RTSessionSchedule {
  sessionCode: "A" | "B" | "C";
  timing: string;
  title: string;
  objective: string;
  primaryTarget: string;
}

export const COCHRANE_RT_STAGES: RTStage[] = [
  {
    id: 1,
    name: "Auditory & Folk Rhythm Priming",
    nativeName: "সুৰ আৰু ছন্দ উদ্বোধনী",
    durationMinutes: 4,
    clinicalRationale: "Acoustic activation of primary auditory cortex; lowers pre-session anxiety via familiar pentatonic folk scales.",
    targetDomain: "Auditory Working Memory & Stress Attenuation",
    sensoryStimulus: "Authentic Pepa (440Hz) & Dhol (120Hz) acoustic overtones.",
    instructions: "Listen to the gentle rhythmic beats and tap along at your own comfortable pace.",
  },
  {
    id: 2,
    name: "Autobiographical Life-Review",
    nativeName: "আত্মজীৱনীমূলক স্মৃতি ৰোমন্থন",
    durationMinutes: 8,
    clinicalRationale: "Ribot's Law retrieval: long-term episodic memory pathways (ages 10–30) are intact despite hippocampal CA1 volume loss.",
    targetDomain: "Episodic Recall & Identity Preservation",
    sensoryStimulus: "Historical family photographs, Bihu celebrations, tea garden harvests, and regional wildlife.",
    instructions: "Look at the familiar faces and native animals. Share the story in your own words.",
  },
  {
    id: 3,
    name: "Visuospatial & Motor Praxic Anchoring",
    nativeName: "তাঁত শাল আৰু দৃষ্টিক্ষেত্ৰিক সমন্বয়",
    durationMinutes: 4,
    clinicalRationale: "Engages cerebellar-parietal procedural memory loops through traditional textile weaving sequences and market item sorting.",
    targetDomain: "Praxis, Motor Coordination & Sequencing",
    sensoryStimulus: "Muga Silk Gold, Gamosa Crimson, and Indigo Puan textile palettes.",
    instructions: "Select the yarn colors to complete the traditional cloth pattern on the loom.",
  },
  {
    id: 4,
    name: "Calming Gratitude & Closure",
    nativeName: "শান্ত আৰু কৃতজ্ঞতা সমাপ্তি",
    durationMinutes: 2,
    clinicalRationale: "Preempts fatigue and emotional destabilization; reinforces sense of security and family connection.",
    targetDomain: "Emotional Regulation & Circadian Grounding",
    sensoryStimulus: "Grandchild voice message affirmation and soft natural river soundscape.",
    instructions: "Breathe gently and listen to your family's warm blessing for the afternoon.",
  },
];

export const DAILY_RT_DOSAGE_SCHEDULE: RTSessionSchedule[] = [
  {
    sessionCode: "A",
    timing: "9:30 AM",
    title: "Morning Cognitive Awakening",
    objective: "Sensory activation, morning orientation, and medicine adherence verification.",
    primaryTarget: "Orientation & Auditory Memory",
  },
  {
    sessionCode: "B",
    timing: "2:30 PM",
    title: "Post-Lunch Reminiscence & Life-Review",
    objective: "Autobiographical memory recall, family photo storytelling, and social connection.",
    primaryTarget: "Episodic Memory & Identity Anchoring",
  },
  {
    sessionCode: "C",
    timing: "4:30 PM",
    title: "Pre-Sundowning Calming Sequence",
    objective: "Preemptive anti-agitation calming before sunset, visuospatial loom rhythm, and dim light comfort.",
    primaryTarget: "Circadian Stabilization & Anxiety Reduction",
  },
];

export const TOTAL_SESSION_DURATION_MINUTES = COCHRANE_RT_STAGES.reduce(
  (acc, stage) => acc + stage.durationMinutes,
  0
); // 18 Minutes
