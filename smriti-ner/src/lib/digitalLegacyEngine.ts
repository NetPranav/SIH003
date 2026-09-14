/**
 * Smriti-NER (স্মৃতি) — Sub-Phase 7.3: Digital Legacy Storytelling Engine
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Clinical Focus:
 * Robert Butler's Life-Review Therapy, Generational Folklore Archiving &
 * Deterministic Story-to-Trivia Content Flywheel for Dementia Care.
 */

import { SupportedVoiceLanguage } from "./bhashiniVoiceService";

export type StoryCategory =
  | "CHILDHOOD_FOLKLORE"
  | "AGRICULTURE_HARVEST"
  | "TRADITIONAL_CRAFTS"
  | "FAMILY_CELEBRATION"
  | "COMMUNITY_HISTORY";

export interface LegacyStory {
  id: string;
  patientId: string;
  patientName: string;
  kinshipTitle: string;
  title: string;
  category: StoryCategory;
  language: SupportedVoiceLanguage;
  audioUrlOrBase64: string;
  durationSeconds: number;
  transcript: string;
  isTranscribed: boolean;
  generatedTriviaCount: number;
  recordedAt: string;
  isApprovedForGames: boolean;
}

export interface GeneratedTriviaQuestion {
  questionId: string;
  storyId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  language: SupportedVoiceLanguage;
}

export interface StoryArchiveFilter {
  category?: StoryCategory;
  language?: SupportedVoiceLanguage;
  searchQuery?: string;
}

export class DigitalLegacyEngine {
  private static storyStore: Map<string, LegacyStory> = new Map();
  private static triviaStore: Map<string, GeneratedTriviaQuestion[]> = new Map();

  /**
   * Records a new oral story from an elder
   */
  public static recordStory(params: {
    patientId: string;
    patientName: string;
    kinshipTitle: string;
    title: string;
    category: StoryCategory;
    language: SupportedVoiceLanguage;
    audioUrlOrBase64: string;
    durationSeconds: number;
    initialTranscript?: string;
  }): LegacyStory {
    const id = `story_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const story: LegacyStory = {
      id,
      patientId: params.patientId,
      patientName: params.patientName,
      kinshipTitle: params.kinshipTitle,
      title: params.title,
      category: params.category,
      language: params.language,
      audioUrlOrBase64: params.audioUrlOrBase64,
      durationSeconds: Math.max(1, params.durationSeconds),
      transcript: params.initialTranscript || "",
      isTranscribed: Boolean(params.initialTranscript && params.initialTranscript.length > 0),
      generatedTriviaCount: 0,
      recordedAt: new Date().toISOString(),
      isApprovedForGames: false,
    };

    this.storyStore.set(id, story);
    return story;
  }

  /**
   * Simulates/processes Bhashini ASR transcription for a recorded story
   */
  public static transcribeStory(storyId: string, asrTranscript?: string): LegacyStory {
    const story = this.storyStore.get(storyId);
    if (!story) {
      throw new Error(`Story '${storyId}' not found.`);
    }

    story.transcript = asrTranscript || `[ASR Transcribed]: ${story.title} (${story.language})`;
    story.isTranscribed = true;
    this.storyStore.set(storyId, story);
    return story;
  }

  /**
   * Converts transcribed story snippets into interactive game trivia (Content Flywheel)
   */
  public static convertStoryToTrivia(storyId: string): GeneratedTriviaQuestion[] {
    const story = this.storyStore.get(storyId);
    if (!story) {
      throw new Error(`Story '${storyId}' not found.`);
    }
    if (!story.transcript) {
      throw new Error(`Cannot generate trivia for untranscribed story '${storyId}'.`);
    }

    const kinship = story.kinshipTitle || "ককা";
    const lang = story.language;

    const triviaList: GeneratedTriviaQuestion[] = [
      {
        questionId: `triv_${storyId}_01`,
        storyId,
        prompt:
          lang === "as"
            ? `${kinship}ৰ স্মৃতিৰ পৰা: এই সাধুটো বা স্মৃতিটো কি বিষয়ক আছিল?`
            : `From ${kinship}'s memory: What was the primary theme of this story?`,
        options:
          lang === "as"
            ? ["পুৰণি খেতি আৰু উৎসৱ", "ৰেল যাত্ৰা", "বজাৰৰ অভিজ্ঞতা", "বিদেশ ভ্ৰমণ"]
            : ["Harvest & Festival", "Train Journey", "Market Visit", "Foreign Trip"],
        correctIndex: 0,
        explanation: `${kinship}'s narrative focused on cultural traditions and community memories.`,
        language: lang,
      },
      {
        questionId: `triv_${storyId}_02`,
        storyId,
        prompt:
          lang === "as"
            ? `${kinship}য়ে উল্লেখ কৰা মূল ঘটনাটো কোন সময়ৰ আছিল?`
            : `What era did ${kinship} mention during this reflection?`,
        options:
          lang === "as"
            ? ["ডেকা কালৰ স্মৃতি", "যোৱা বছৰৰ ঘটনা", "কালিৰ কথা", "সপ্তম শ্ৰেণীৰ খেল"]
            : ["Youth & Early Adulthood", "Last Year", "Yesterday", "High School Sports"],
        correctIndex: 0,
        explanation: "Ribot's law: episodic memories from early youth are deeply preserved.",
        language: lang,
      },
    ];

    story.generatedTriviaCount = triviaList.length;
    story.isApprovedForGames = true;
    this.storyStore.set(storyId, story);
    this.triviaStore.set(storyId, triviaList);

    return triviaList;
  }

  /**
   * Retrieves family archive for a patient with search and filtering
   */
  public static getFamilyArchive(
    patientId: string,
    filter?: StoryArchiveFilter
  ): LegacyStory[] {
    const results: LegacyStory[] = [];
    this.storyStore.forEach((story) => {
      if (story.patientId === patientId) {
        if (filter?.category && story.category !== filter.category) {
          return;
        }
        if (filter?.language && story.language !== filter.language) {
          return;
        }
        if (filter?.searchQuery) {
          const q = filter.searchQuery.toLowerCase();
          const matchTitle = story.title.toLowerCase().includes(q);
          const matchTranscript = story.transcript.toLowerCase().includes(q);
          if (!matchTitle && !matchTranscript) {
            return;
          }
        }
        results.push(story);
      }
    });
    return results;
  }

  /**
   * Toggles moderation approval for story-to-game trivia reuse
   */
  public static approveStoryForGames(storyId: string, approved: boolean): LegacyStory {
    const story = this.storyStore.get(storyId);
    if (!story) {
      throw new Error(`Story '${storyId}' not found.`);
    }
    story.isApprovedForGames = approved;
    this.storyStore.set(storyId, story);
    return story;
  }
}
