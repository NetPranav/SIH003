/**
 * Smriti-NER (স্মৃতি) — Sub-Phase 7.2: Community Reminiscence Circles Engine
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Clinical Focus:
 * Collaborative, non-competitive group reminiscence for 4–6 elders at rural
 * Anganwadi/PHC centres, guided by ASHA facilitators with collective star rewards.
 */

import { SupportedVoiceLanguage } from "./bhashiniVoiceService";

export type FacilityType =
  | "ANGANWADI_CENTRE"
  | "SUB_CENTRE"
  | "PRIMARY_HEALTH_CENTRE"
  | "VILLAGE_NAMGHAR"
  | "COMMUNITY_HALL";

export type ParticipantEngagementLevel =
  | "VERY_ACTIVE"
  | "MODERATE"
  | "OBSERVER";

export interface CircleParticipant {
  patientId: string;
  name: string;
  kinshipTitle: string;
  present: boolean;
  engagementLevel: ParticipantEngagementLevel;
}

export interface CommunityCircleSession {
  sessionId: string;
  villageId: string;
  villageName: string;
  facilityType: FacilityType;
  facilitatorName: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  language: SupportedVoiceLanguage;
  topic: string;
  participants: CircleParticipant[];
  collectiveStarsEarned: number;
  laughterInteractionRating: number; // 0.0 to 1.0
  verbalParticipationRating: number; // 0.0 to 1.0
  fieldNotes?: string;
}

export interface AshaFacilitationGuide {
  language: SupportedVoiceLanguage;
  title: string;
  stage1Intro: string;
  stage2PuzzlePrompts: string[];
  stage3StoryPrompt: string;
  stage4Closure: string;
  checklist: string[];
}

export class CommunityCirclesEngine {
  private static sessionStore: Map<string, CommunityCircleSession> = new Map();

  /**
   * Schedules a new village community circle session
   */
  public static scheduleSession(params: {
    villageId: string;
    villageName: string;
    facilityType: FacilityType;
    facilitatorName: string;
    scheduledStartTime: string;
    scheduledEndTime: string;
    language: SupportedVoiceLanguage;
    topic: string;
    initialParticipants?: CircleParticipant[];
  }): CommunityCircleSession {
    const sessionId = `circle_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const session: CommunityCircleSession = {
      sessionId,
      villageId: params.villageId,
      villageName: params.villageName,
      facilityType: params.facilityType,
      facilitatorName: params.facilitatorName,
      scheduledStartTime: params.scheduledStartTime,
      scheduledEndTime: params.scheduledEndTime,
      status: "SCHEDULED",
      language: params.language,
      topic: params.topic,
      participants: params.initialParticipants || [],
      collectiveStarsEarned: 0,
      laughterInteractionRating: 0.0,
      verbalParticipationRating: 0.0,
    };

    this.sessionStore.set(sessionId, session);
    return session;
  }

  /**
   * Retrieves all scheduled or active sessions, optionally filtered by village
   */
  public static getUpcomingSessions(villageId?: string): CommunityCircleSession[] {
    const list: CommunityCircleSession[] = [];
    this.sessionStore.forEach((sess) => {
      if (!villageId || sess.villageId === villageId) {
        if (sess.status === "SCHEDULED" || sess.status === "IN_PROGRESS") {
          list.push(sess);
        }
      }
    });
    return list;
  }

  /**
   * Logs non-competitive group engagement metrics for a completed circle session
   */
  public static logSessionEngagement(
    sessionId: string,
    params: {
      participants: CircleParticipant[];
      collectiveStarsEarned: number;
      laughterInteractionRating: number;
      verbalParticipationRating: number;
      fieldNotes?: string;
    }
  ): CommunityCircleSession {
    const session = this.sessionStore.get(sessionId);
    if (!session) {
      throw new Error(`Circle session '${sessionId}' not found.`);
    }

    session.participants = params.participants;
    session.collectiveStarsEarned = Math.max(0, params.collectiveStarsEarned);
    session.laughterInteractionRating = Math.min(1.0, Math.max(0.0, params.laughterInteractionRating));
    session.verbalParticipationRating = Math.min(1.0, Math.max(0.0, params.verbalParticipationRating));
    session.fieldNotes = params.fieldNotes || "";
    session.status = "COMPLETED";

    this.sessionStore.set(sessionId, session);
    return session;
  }

  /**
   * Returns localized 4-stage ASHA facilitation guide across all 8 NER languages
   */
  public static getAshaFacilitationGuide(lang: SupportedVoiceLanguage): AshaFacilitationGuide {
    const guides: Record<SupportedVoiceLanguage, AshaFacilitationGuide> = {
      as: {
        language: "as",
        title: "আশাকৰ্মীৰ বাবে সাপ্তাহিক স্মৃতি চক্ৰ পৰিচালনা পুথি",
        stage1Intro: "মৰমৰ ককা-আইতাসকলক স্বাগত জনাওক আৰু সকলোৱে একেলগে লোকগীতৰ সুৰত গুণগুণাওক (০-৫ মিনিট)।",
        stage2PuzzlePrompts: [
          "বৰ্তমান স্ক্ৰীণত দেখা দিয়া পুৰণি বাদ্যযন্ত্ৰটো সকলোৱে চিনাক্ত কৰক।",
          "আমাৰ গাঁৱৰ পুৰণি হাটত আটাইতকৈ জনপ্ৰিয় বস্তু কি আছিল বাৰু?",
          "পথাৰত ধান দোৱাৰ সময়ত আমি কি গীত গাইছিলোঁ মনত পেলাওক।",
        ],
        stage3StoryPrompt: "নিজৰ ডেকা কালৰ আটাইতকৈ আনন্দদায়ক বিহু বা উৎসৱৰ এটা মধুৰ স্মৃতি সকলোৰে লগত ভাগ-বতৰা কৰক (১৫-২২ মিনিট)।",
        stage4Closure: "সকলোকে গৰম চাহ আৰু তামোল-পাণেৰে আপ্যায়ন কৰি আশীৰ্বাদ লওক (২২-২৫ মিনিট)।",
        checklist: [
          "প্ৰতিজন বয়োজ্যেষ্ঠ ব্যক্তিৰ বাবে আৰামদায়ক বহাৰ ব্যৱস্থা নিশ্চিত কৰক",
          "কাকো কোনো ব্যক্তিগত নম্বৰ বা স্ক'ৰ নিদিব; মাত্ৰ সমূহীয়া আনন্দ উৎসাহ যোগাওক",
          "কোনোবাই পাহৰি গ'লে সহায়কাৰীৰূপে মৰমেৰে ক্লু আগবঢ়াওক",
        ],
      },
      mni: {
        language: "mni",
        title: "ꯑꯥꯁꯥ ꯊꯕꯛꯄꯨꯔꯣꯏꯒꯤ ꯆꯌꯣꯜꯒꯤ ꯅꯤꯡꯁꯤꯡ ꯂꯩꯔꯣꯜ ꯂꯃꯖꯤꯡ",
        stage1Intro: "ꯏꯄꯥ-ꯏꯃꯥꯁꯤꯡꯕꯨ ꯇꯔꯥꯝꯅꯥ ꯑꯣꯛꯄꯤꯌꯨ ꯑꯃꯁꯨꯡ ꯏꯁꯩ ꯁꯛꯄꯤꯌꯨ (꯰-꯵ ꯃꯤꯅꯤꯠ)꯫",
        stage2PuzzlePrompts: [
          "ꯁ꯭ꯀ꯭ꯔꯤꯟꯗꯥ ꯎꯕꯥ ꯄꯨꯋꯥꯔꯤ ꯁꯥꯟꯅꯄꯣꯠ ꯑꯁꯤ ꯈꯪꯗꯣꯛꯄꯤꯌꯨ꯫",
          "ꯑꯔꯤꯕꯥ ꯀꯩꯊꯦꯂꯒꯤ ꯋꯥꯔꯤ ꯅꯤꯡꯁꯤꯡꯕꯤꯌꯨ꯫",
        ],
        stage3StoryPrompt: "ꯅꯍꯥ ꯑꯣꯏꯔꯤꯉꯩꯒꯤ ꯂꯥꯏ ꯍꯔꯥꯎꯕꯒꯤ ꯅꯨꯡꯉꯥꯏꯕꯥ ꯋꯥꯔꯤ ꯂꯤꯕꯤꯌꯨ (꯱꯵-꯲꯲ ꯃꯤꯅꯤꯠ)꯫",
        stage4Closure: "ꯆꯥ ꯊꯛꯃꯤꯟꯅꯗꯨꯅꯥ ꯊꯧꯅꯤꯖꯕꯥ (꯲꯲-꯲꯵ ꯃꯤꯅꯤꯠ)꯫",
        checklist: [
          "ꯈꯨꯗꯤꯡꯃꯛꯄꯨ ꯅꯨꯡꯉꯥꯏꯅꯥ ꯐꯝꯍꯅꯕꯤꯌꯨ",
          "ꯃꯤꯑꯣꯏ ꯑꯃꯒꯤ ꯁ꯭ꯀꯣꯔ ꯊꯝꯒꯅꯨ, ꯑꯄꯨꯅꯕꯥ ꯊꯕꯛ ꯑꯣꯏꯍꯅꯕꯤꯌꯨ",
        ],
      },
      bn: {
        language: "bn",
        title: "আশাকর্মীদের সাপ্তাহিক স্মৃতিচক্র পরিচালনা নির্দেশিকা",
        stage1Intro: "শ্রদ্ধেয় প্রবীণদের স্বাগত জানান এবং সবাই মিলে লোকগানের সুরে শুরু করুন (০-৫ মিনিট)।",
        stage2PuzzlePrompts: [
          "পর্দায় দেখানো ঐতিহ্যবাহী জিনিসটি সবাই মিলে শনাক্ত করুন।",
          "গ্রামের পুরনো হাটের বিশেষ স্মৃতি মনে করুন।",
        ],
        stage3StoryPrompt: "যৌবনকালের কোনো স্মরণীয় উৎসব বা মেলা নিয়ে গল্প বলুন (১৫-২২ মিনিট)।",
        stage4Closure: "চা ও হালকা জলখাবার পরিবেশন করে সমাপ্তি করুন (২২-২৫ মিনিট)।",
        checklist: [
          "সবার বসার আরামদায়ক ব্যবস্থা নিশ্চিত করুন",
          "ব্যক্তিগত প্রতিযোগিতা বর্জন করুন, দলগত অংশগ্রহণ বাড়ান",
        ],
      },
      brx: {
        language: "brx",
        title: "आशा हेफाजाबगिरिनि सप्ताहानि गोसोखां मेल लामजिर",
        stage1Intro: "गोजोन बयोस गोनां बिथांमोनखौ बराय आरो मेथाय खन (०-५ मिनिट)।",
        stage2PuzzlePrompts: [
          "स्क्रिनआव नुनो मोननाय गोजाम मुवाखौ सायख'दो।",
          "गामियाव गोजाम हाथायनि गोसोखांथि सावरायदो।",
        ],
        stage3StoryPrompt: "उन्दै समनि गोजोन बवैसागुनि सावरायथि हो (१५-२२ मिनिट)।",
        stage4Closure: "चा लोंनानै जोबनाय खालाम (२२-२५ मिनिट)।",
        checklist: [
          "गासैखौबो मोजाङै जिरायहो",
          "गावनि गावनि नम्बर दाखो, गासैबो लोगोसे देरहाथों",
        ],
      },
      kha: {
        language: "kha",
        title: "Ka Jingbthah ia ki ASHA ban pyniaid ia ka Seng Kynmaw",
        stage1Intro: "Pdiang sngewbha ia ki tymmen bad rwai lem ia ki sur tynrai (0-5 minit).",
        stage2PuzzlePrompts: [
          "Ithuh lem ia ka tiar tynrai kaba paw ha ka screen.",
          "Kynmaw pat ia ka iew hyndai ha shnong.",
        ],
        stage3StoryPrompt: "Iathuh shaphang ka por samla bad ki lehkmen kiba sngewtynnad (15-22 minit).",
        stage4Closure: "Dih sha lang bad pynkut da ka jingkyrkhu (22-25 minit).",
        checklist: [
          "Pynbiang ia ka jaka shong kaba suk",
          "Wat ai score marwei, pynshlur ia ka jingialong kawei",
        ],
      },
      lus: {
        language: "lus",
        title: "ASHA tan Chhungkaw Hriatrengna Inkhawm Kaihhruaina",
        stage1Intro: "Pitar leh puterte lo lawm la, hnam hla sa ho rawh u (0-5 minute).",
        stage2PuzzlePrompts: [
          "Screen a hmanlai thil lo lang hi han zawng chhuak ho teh u.",
          "Hmanlai bazara thil thleng ngaihnawmte han sawi ho ula.",
        ],
        stage3StoryPrompt: "Tleirawl laia Kut hman dan ngaihnawm tak han sawi ho teh u (15-22 minute).",
        stage4Closure: "Thingpui in ho la, duhsakna inhlanin tin rawh u (22-25 minute).",
        checklist: [
          "Thutna nuam tak siamsak vek tur a ni",
          "Mi mal in-elna siam suh la, a huhova hlim tlang a pawimawh",
        ],
      },
      hi: {
        language: "hi",
        title: "आशा दीदी हेतु साप्ताहिक सामुदायिक स्मृति चौपाल मार्गदर्शिका",
        stage1Intro: "बुजुर्गों का सस्नेह स्वागत करें और पारंपरिक लोकगीत गुनगुनाकर सत्र शुरू करें (०-५ मिनट)।",
        stage2PuzzlePrompts: [
          "स्क्रीन पर दिख रहे पारंपरिक वाद्य या घरेलू वस्तु को मिलकर पहचानें।",
          "गांव के पुराने हाट-बाजार की कोई रोचक याद साझा करें।",
        ],
        stage3StoryPrompt: "अपनी जवानी के किसी यादगार मेले या त्योहार का सुखद प्रसंग सुनाएं (१५-२२ मिनट)।",
        stage4Closure: "गरम चाय और जलपान के साथ आशीर्वाद लेते हुए समापन करें (२२-२५ मिनट)।",
        checklist: [
          "बुजुर्गों के आरामदायक बैठने की व्यवस्था सुनिश्चित करें",
          "व्यक्तिगत अंक या प्रतिस्पर्धा पूरी तरह वर्जित रखें; सामूहिक आनंद को प्राथमिकता दें",
        ],
      },
      en: {
        language: "en",
        title: "ASHA Facilitator Guide for Weekly Community Reminiscence Circles",
        stage1Intro: "Warmly welcome participating elders and initiate gentle pentatonic folk song humming (0–5 min).",
        stage2PuzzlePrompts: [
          "Collaboratively identify the traditional tool or musical instrument on the shared screen.",
          "Recall fond memories from the historical weekly village market (Haat).",
        ],
        stage3StoryPrompt: "Invite elders to share a cherished harvest or festival story from their youth (15–22 min).",
        stage4Closure: "Conclude with warm herbal tea and collective community blessings (22–25 min).",
        checklist: [
          "Ensure supportive, well-cushioned seating for all elderly participants",
          "Strictly avoid individual scoring or ranking; prioritize collective community stars and shared laughter",
          "Offer gentle, affectionate scaffolding hints if any elder experiences temporary hesitation",
        ],
      },
    };

    return guides[lang] || guides.en;
  }
}
