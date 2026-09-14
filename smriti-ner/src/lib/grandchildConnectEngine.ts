/**
 * Smriti-NER (স্মৃতি) — Sub-Phase 7.1: Grandchild Connect Engine
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Clinical Focus:
 * Intergenerational Affective Grounding, Async Family Co-Play & Social Isolation Mitigation
 * in Geriatric Dementia through 10-second voice/video clue recording and elder response loops.
 */

import { SupportedVoiceLanguage } from "./bhashiniVoiceService";

export type ClueMediaType = "AUDIO" | "VIDEO";

export type ClueLinkedGameType =
  | "BIHU_LOOM"
  | "FAUNA_CALLS"
  | "VILLAGE_HAAT"
  | "HERITAGE_MEMORY";

export interface GrandchildClue {
  id: string;
  patientId: string;
  grandchildName: string;
  kinshipTitle: string; // e.g. "নাতিনী", "Granddaughter"
  mediaType: ClueMediaType;
  mediaUrlOrBase64: string;
  durationSeconds: number; // Max 10.0s
  transcript: string;
  language: SupportedVoiceLanguage;
  targetGame: ClueLinkedGameType;
  roundId: string;
  targetHintAnswer: string;
  createdAt: string;
  isPlayed: boolean;
}

export type ElderReactionBadge =
  | "CELEBRATION_STAR"
  | "NAMASTE_HEART"
  | "BIG_SMILE"
  | "SWEET_DANCE";

export interface ElderResponseLoopPayload {
  responseId: string;
  clueId: string;
  patientId: string;
  grandchildName: string;
  gameRoundId: string;
  status: "COMPLETED" | "TIMEOUT" | "ABORTED";
  score: number;
  timeSpentMs: number;
  elderReactionBadge: ElderReactionBadge;
  elderVoiceNoteUrlOrBase64?: string;
  celebrationMessage: string;
  completedAt: string;
}

export class GrandchildConnectEngine {
  public static readonly MAX_CLUE_DURATION_SECONDS = 10.0;
  private static clueStore: Map<string, GrandchildClue> = new Map();
  private static responseStore: Map<string, ElderResponseLoopPayload[]> = new Map();

  /**
   * Validates clue duration against strict 10-second cognitive ceiling
   */
  public static validateClueDuration(durationSeconds: number): { valid: boolean; error?: string } {
    if (durationSeconds <= 0) {
      return { valid: false, error: "Clue duration must be greater than 0 seconds." };
    }
    if (durationSeconds > this.MAX_CLUE_DURATION_SECONDS) {
      return {
        valid: false,
        error: `Clue duration exceeds maximum allowed ${this.MAX_CLUE_DURATION_SECONDS} seconds limit (recorded: ${durationSeconds.toFixed(1)}s).`,
      };
    }
    return { valid: true };
  }

  /**
   * Registers a new recorded clue from a grandchild or family member
   */
  public static registerClue(
    clueInput: Omit<GrandchildClue, "id" | "createdAt" | "isPlayed">
  ): GrandchildClue {
    const validation = this.validateClueDuration(clueInput.durationSeconds);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const id = `clue_gcc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const clue: GrandchildClue = {
      ...clueInput,
      id,
      createdAt: new Date().toISOString(),
      isPlayed: false,
    };

    this.clueStore.set(id, clue);
    return clue;
  }

  /**
   * Retrieves pending clues for a specific patient and optionally game type
   */
  public static getPendingCluesForPatient(
    patientId: string,
    gameType?: ClueLinkedGameType
  ): GrandchildClue[] {
    const clues: GrandchildClue[] = [];
    this.clueStore.forEach((clue) => {
      if (clue.patientId === patientId && !clue.isPlayed) {
        if (!gameType || clue.targetGame === gameType) {
          clues.push(clue);
        }
      }
    });
    return clues;
  }

  /**
   * Marks a clue as played when the elder launches the linked puzzle round
   */
  public static markClueAsPlayed(clueId: string): boolean {
    const clue = this.clueStore.get(clueId);
    if (clue) {
      clue.isPlayed = true;
      this.clueStore.set(clueId, clue);
      return true;
    }
    return false;
  }

  /**
   * Dispatches an elder celebration reaction back to the grandchild closing the social loop
   */
  public static dispatchElderResponse(params: {
    clueId: string;
    patientId: string;
    grandchildName: string;
    gameRoundId: string;
    score: number;
    timeSpentMs: number;
    language?: SupportedVoiceLanguage;
    kinshipTitle?: string;
    elderVoiceNoteUrlOrBase64?: string;
  }): ElderResponseLoopPayload {
    const lang = params.language || "as";
    const kinship = params.kinshipTitle || "ককা";
    const responseId = `resp_gcc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const celebrationMessages: Record<SupportedVoiceLanguage, string> = {
      as: `${kinship}য়ে তোমাৰ ক্লুৰে খেলি সম্পূৰ্ণ কৰিলে! ধন্যবাদ তোমাক মৰমৰ ${params.grandchildName}! 🌟`,
      mni: `${kinship}ꯅꯥ ꯅꯍꯥꯛꯀꯤ ꯄꯥꯎꯇꯥꯛ ꯂꯧꯔꯒꯥ ꯃꯥꯏꯄꯥꯛꯂꯦ! ꯊꯥꯒꯠꯆꯔꯤ ${params.grandchildName}! 🌟`,
      bn: `${kinship} তোমার ক্লু দিয়ে ধাঁধা সমাধান করেছেন! অনেক ধন্যবাদ তোমাকে ${params.grandchildName}! 🌟`,
      brx: `${kinship} नोंनि क्लुजों देरहाबाय! गोजोनथों ${params.grandchildName}! 🌟`,
      kha: `${kinship} u/ka la lah ban pyndep da ka jingiarap jong phi ${params.grandchildName}! 🌟`,
      lus: `${kinship} chuan i hriattirna hmangin a hlawhtling e! Ka lawm e ${params.grandchildName}! 🌟`,
      hi: `${kinship} ने आपके संकेत से पहेली पूरी कर ली! बहुत-बहुत प्यार और धन्यवाद ${params.grandchildName}! 🌟`,
      en: `${kinship} successfully solved the puzzle using your clue! Thank you dear ${params.grandchildName}! 🌟`,
    };

    const celebrationMessage = celebrationMessages[lang] || celebrationMessages.en;

    const payload: ElderResponseLoopPayload = {
      responseId,
      clueId: params.clueId,
      patientId: params.patientId,
      grandchildName: params.grandchildName,
      gameRoundId: params.gameRoundId,
      status: "COMPLETED",
      score: params.score,
      timeSpentMs: params.timeSpentMs,
      elderReactionBadge: "CELEBRATION_STAR",
      elderVoiceNoteUrlOrBase64: params.elderVoiceNoteUrlOrBase64,
      celebrationMessage,
      completedAt: new Date().toISOString(),
    };

    const patientResponses = this.responseStore.get(params.patientId) || [];
    patientResponses.push(payload);
    this.responseStore.set(params.patientId, patientResponses);

    return payload;
  }

  /**
   * Provides culturally authentic pre-bundled sample clues across all 8 NER languages
   */
  public static getSampleCluesForLanguage(lang: SupportedVoiceLanguage): GrandchildClue[] {
    const samples: Record<SupportedVoiceLanguage, GrandchildClue[]> = {
      as: [
        {
          id: "clue_sample_as_1",
          patientId: "pt_elder_001",
          grandchildName: "অনন্যা",
          kinshipTitle: "নাতিনী",
          mediaType: "AUDIO",
          mediaUrlOrBase64: "data:audio/ogg;base64,T2dnUwACAAAAAAAAA...",
          durationSeconds: 6.5,
          transcript: "ককা, বিহুৰ সময়ত আমি কি নাচোঁ? সোণালী মুগা সূতাডাল মনত পেলাওক!",
          language: "as",
          targetGame: "BIHU_LOOM",
          roundId: "loom_round_01",
          targetHintAnswer: "মুগা সোণালী সূতা",
          createdAt: new Date().toISOString(),
          isPlayed: false,
        },
        {
          id: "clue_sample_as_2",
          patientId: "pt_elder_001",
          grandchildName: "অৰ্ণৱ",
          kinshipTitle: "নাতি",
          mediaType: "VIDEO",
          mediaUrlOrBase64: "data:video/webm;base64,GkXfo59ChoEBQveBA...",
          durationSeconds: 8.0,
          transcript: "আইতা, কাজিৰঙাত আমি ডাঙৰ শিং থকা কি চৰাইটো দেখিছিলোঁ? ধনেশ পক্ষী!",
          language: "as",
          targetGame: "FAUNA_CALLS",
          roundId: "fauna_round_02",
          targetHintAnswer: "ধনেশ পক্ষী (Great Hornbill)",
          createdAt: new Date().toISOString(),
          isPlayed: false,
        },
      ],
      mni: [
        {
          id: "clue_sample_mni_1",
          patientId: "pt_elder_001",
          grandchildName: "ꯇꯣꯝꯕꯥ",
          kinshipTitle: "ꯏꯕꯨꯡꯉꯣ",
          mediaType: "AUDIO",
          mediaUrlOrBase64: "data:audio/ogg;base64,T2dnUwACAAAAAAAAA...",
          durationSeconds: 7.2,
          transcript: "ꯏꯄꯥ, ꯂꯥꯏ ꯍꯔꯥꯎꯕꯗꯥ ꯁꯤꯖꯤꯟꯅꯕꯥ ꯐꯤꯔꯣꯜ ꯑꯗꯨ ꯅꯤꯡꯁꯤꯡꯕꯤꯌꯨ!",
          language: "mni",
          targetGame: "BIHU_LOOM",
          roundId: "loom_round_01",
          targetHintAnswer: "ꯃꯆꯨ ꯃꯆꯨꯒꯤ ꯐꯤꯔꯣꯜ",
          createdAt: new Date().toISOString(),
          isPlayed: false,
        },
      ],
      bn: [
        {
          id: "clue_sample_bn_1",
          patientId: "pt_elder_001",
          grandchildName: "দিয়া",
          kinshipTitle: "নাতনি",
          mediaType: "AUDIO",
          mediaUrlOrBase64: "data:audio/ogg;base64,T2dnUwACAAAAAAAAA...",
          durationSeconds: 5.8,
          transcript: "দাদু, পুজোয় যে লাল পাড় সাদা শাড়ি পরা হয়, সেই সুতোটা বেছে নাও!",
          language: "bn",
          targetGame: "BIHU_LOOM",
          roundId: "loom_round_01",
          targetHintAnswer: "লাল সুতো",
          createdAt: new Date().toISOString(),
          isPlayed: false,
        },
      ],
      brx: [
        {
          id: "clue_sample_brx_1",
          patientId: "pt_elder_001",
          grandchildName: "बिस्व",
          kinshipTitle: "अनग्रा",
          mediaType: "AUDIO",
          mediaUrlOrBase64: "data:audio/ogg;base64,T2dnUwACAAAAAAAAA...",
          durationSeconds: 6.0,
          transcript: "आबु, दखनानि थाखाय गाब गोजा खौ सायख'!",
          language: "brx",
          targetGame: "BIHU_LOOM",
          roundId: "loom_round_01",
          targetHintAnswer: "गाब गोजा",
          createdAt: new Date().toISOString(),
          isPlayed: false,
        },
      ],
      kha: [
        {
          id: "clue_sample_kha_1",
          patientId: "pt_elder_001",
          grandchildName: "Daphida",
          kinshipTitle: "I pyrsa",
          mediaType: "AUDIO",
          mediaUrlOrBase64: "data:audio/ogg;base64,T2dnUwACAAAAAAAAA...",
          durationSeconds: 6.2,
          transcript: "Meiieid, jied ia u ksai ksiar kumba ha ka Jainsem tynrai!",
          language: "kha",
          targetGame: "BIHU_LOOM",
          roundId: "loom_round_01",
          targetHintAnswer: "Ksai Ksiar",
          createdAt: new Date().toISOString(),
          isPlayed: false,
        },
      ],
      lus: [
        {
          id: "clue_sample_lus_1",
          patientId: "pt_elder_001",
          grandchildName: "Zorina",
          kinshipTitle: "Tupa",
          mediaType: "AUDIO",
          mediaUrlOrBase64: "data:audio/ogg;base64,T2dnUwACAAAAAAAAA...",
          durationSeconds: 6.0,
          transcript: "Pu pu, Puanchei rawng mawi tak kha thlang rawh le!",
          language: "lus",
          targetGame: "BIHU_LOOM",
          roundId: "loom_round_01",
          targetHintAnswer: "Puanchei rawng sen",
          createdAt: new Date().toISOString(),
          isPlayed: false,
        },
      ],
      hi: [
        {
          id: "clue_sample_hi_1",
          patientId: "pt_elder_001",
          grandchildName: "अनन्या",
          kinshipTitle: "पोती",
          mediaType: "AUDIO",
          mediaUrlOrBase64: "data:audio/ogg;base64,T2dnUwACAAAAAAAAA...",
          durationSeconds: 6.4,
          transcript: "दादाजी, सुनहरे मूंगा रेशम का धागा चुनिए, जो हमने मेले में देखा था!",
          language: "hi",
          targetGame: "BIHU_LOOM",
          roundId: "loom_round_01",
          targetHintAnswer: "सुनहरा मूंगा धागा",
          createdAt: new Date().toISOString(),
          isPlayed: false,
        },
      ],
      en: [
        {
          id: "clue_sample_en_1",
          patientId: "pt_elder_001",
          grandchildName: "Ananya",
          kinshipTitle: "Granddaughter",
          mediaType: "AUDIO",
          mediaUrlOrBase64: "data:audio/ogg;base64,T2dnUwACAAAAAAAAA...",
          durationSeconds: 6.5,
          transcript: "Grandpa, pick the shimmering golden Muga silk thread we saw at the Bihu fair!",
          language: "en",
          targetGame: "BIHU_LOOM",
          roundId: "loom_round_01",
          targetHintAnswer: "Golden Muga Thread",
          createdAt: new Date().toISOString(),
          isPlayed: false,
        },
        {
          id: "clue_sample_en_2",
          patientId: "pt_elder_001",
          grandchildName: "Arnav",
          kinshipTitle: "Grandson",
          mediaType: "VIDEO",
          mediaUrlOrBase64: "data:video/webm;base64,GkXfo59ChoEBQveBA...",
          durationSeconds: 8.5,
          transcript: "Grandma, remember the big bird with the yellow beak in Kaziranga? It's the Hornbill!",
          language: "en",
          targetGame: "FAUNA_CALLS",
          roundId: "fauna_round_02",
          targetHintAnswer: "Great Hornbill",
          createdAt: new Date().toISOString(),
          isPlayed: false,
        },
      ],
    };

    return samples[lang] || samples.en;
  }
}
