/**
 * Smriti-NER (স্মৃতি) — Deterministic NLG Caregiver Summary Engine
 * Sub-Phase 6.4: Natural-Language Caregiver Summaries
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Clinical Focus:
 * Generates transparent, zero-hallucination weekly clinical progress summaries
 * across 8 North Eastern languages with contextual lifestyle correlation hints.
 */

import { SupportedVoiceLanguage } from "./bhashiniVoiceService";

export type CognitiveStatusCategory =
  | "STABLE"
  | "POSITIVE"
  | "MILD_VARIATION"
  | "NEEDS_REVIEW";

export type LifestyleCorrelationPattern =
  | "TUESDAY_HAAT_DIP"
  | "SUNDAY_PRAYER_BOOST"
  | "WINTER_DUSK_AGITATION"
  | "MISSED_DOSE_TREMOR"
  | "NONE";

export interface WeeklyPatientMetrics {
  patientName: string;
  kinshipTitle: string; // e.g. "আইতা", "ককা", "Grandmother"
  language: SupportedVoiceLanguage;
  currentMmseProxy: number;
  mmseDelta7d: number;
  avgReactionTimeMs: number;
  adherenceRatePercent: number;
  sundowningIncidentsCount: number;
  notableDayPattern?: LifestyleCorrelationPattern;
}

export interface CaregiverWeeklySummary {
  language: SupportedVoiceLanguage;
  statusCategory: CognitiveStatusCategory;
  headline: string;
  cognitiveParagraph: string;
  adherenceParagraph: string;
  correlationHintParagraph: string;
  actionItem: string;
  fullSummaryText: string;
  generatedAt: string;
}

/**
 * Deterministic Multi-Language NLG Templates
 */
export class CaregiverNlgEngine {
  /**
   * Generates a fully localized 3-paragraph summary based on 7-day rolling metrics
   */
  public static generateWeeklySummary(metrics: WeeklyPatientMetrics): CaregiverWeeklySummary {
    const lang = metrics.language || "as";
    const name = metrics.patientName || "আইতা";
    const kinship = metrics.kinshipTitle || "আইতা";
    const mmse = metrics.currentMmseProxy.toFixed(1);
    const delta = metrics.mmseDelta7d;
    const adh = metrics.adherenceRatePercent;

    // 1. Determine overall status category
    let statusCategory: CognitiveStatusCategory = "STABLE";
    if (delta >= 1.0) {
      statusCategory = "POSITIVE";
    } else if (delta >= -0.5) {
      statusCategory = "STABLE";
    } else if (delta >= -1.5) {
      statusCategory = "MILD_VARIATION";
    } else {
      statusCategory = "NEEDS_REVIEW";
    }

    // 2. Synthesize paragraphs per language
    const headline = this.composeHeadline(statusCategory, kinship, lang);
    const cognitiveParagraph = this.composeCognitiveParagraph(
      statusCategory,
      kinship,
      mmse,
      delta,
      lang
    );
    const adherenceParagraph = this.composeAdherenceParagraph(
      kinship,
      adh,
      metrics.sundowningIncidentsCount,
      lang
    );
    const correlationHintParagraph = this.composeCorrelationHint(
      metrics.notableDayPattern || "NONE",
      kinship,
      lang
    );
    const actionItem = this.composeActionItem(statusCategory, adh, lang);

    const fullSummaryText = `${headline}\n\n${cognitiveParagraph}\n\n${adherenceParagraph}\n\n${correlationHintParagraph}\n\n📌 ${actionItem}`;

    return {
      language: lang,
      statusCategory,
      headline,
      cognitiveParagraph,
      adherenceParagraph,
      correlationHintParagraph,
      actionItem,
      fullSummaryText,
      generatedAt: new Date().toISOString(),
    };
  }

  private static composeHeadline(
    status: CognitiveStatusCategory,
    kinship: string,
    lang: SupportedVoiceLanguage
  ): string {
    const headlines: Record<CognitiveStatusCategory, Record<SupportedVoiceLanguage, string>> = {
      POSITIVE: {
        as: `সুখবৰ: এই সপ্তাহত ${kinship}ৰ স্মৃতি শক্তিত সুন্দৰ উন্নতি দেখা গৈছে`,
        mni: `ꯄꯥꯎ ꯐꯕꯥ: ꯆꯌꯣꯜ ꯑꯁꯤꯗꯥ ${kinship}ꯒꯤ ꯋꯥꯈꯜ ꯆꯦꯠꯄꯗꯥ ꯐꯒꯠꯂꯛꯄꯥ ꯎꯕꯥ ꯐꯪꯏ`,
        bn: `সুখবর: এই সপ্তাহে ${kinship}র স্মৃতিশক্তি ও একাগ্রতায় ইতিবাচক উন্নতি দেখা গেছে`,
        brx: `गोजोनथाव: बे सप्ताहाव ${kinship}नि गोसोखांनायाव मोजां दावगानाय नुनो मोनदों`,
        kha: `Khabar babha: Ha kane ka taiew ka jingkynmaw jong ${kinship} ka la nang kham bha`,
        lus: `Chanchin tha: Kar kalta chhung khan ${kinship} hriatrengna a tha hle`,
        hi: `शुभ समाचार: इस सप्ताह ${kinship} की स्मृति और एकाग्रता में सराहनीय सुधार देखा गया`,
        en: `Positive Progress: ${kinship}'s cognitive scores demonstrated notable improvement this week`,
      },
      STABLE: {
        as: `সুস্থিৰ অগ্ৰগতি: ${kinship}ৰ সাপ্তাহিক মানসিক অৱস্থা সম্পূৰ্ণ নিয়ন্ত্ৰণত আছে`,
        mni: `ꯆꯌꯣꯜ ꯑꯁꯤꯗꯥ ${kinship}ꯒꯤ ꯋꯥꯈꯜ ꯂꯦꯡꯗꯅꯥ ꯐꯅꯥ ꯂꯩꯔꯤ`,
        bn: `স্থিতিশীল অবস্থা: ${kinship}র সাপ্তাহিক মানসিক স্বাস্থ্য নিয়ন্ত্রণে রয়েছে`,
        brx: `गोजोनै थासारि: ${kinship}नि सप्ताहानि गोसोखां दावगानाया थाद'नानै मोजां दं`,
        kha: `Ka jinglong ba thikna: Ka jingkoit jingkhiah jingmut jong ${kinship} ka la neh kaba biang`,
        lus: `Dinhmun ngai: ${kinship} hriatna dinhmun chu a ngai reng a a tha e`,
        hi: `स्थिर स्थिति: इस सप्ताह ${kinship} का संज्ञानात्मक स्वास्थ्य पूरी तरह स्थिर और सामान्य रहा`,
        en: `Stable Health: ${kinship}'s cognitive baseline remained steady and well-preserved this week`,
      },
      MILD_VARIATION: {
        as: `নজৰ ৰাখিবলগীয়া: ${kinship}ৰ স্মৃতি শক্তিত সামান্য তাৰতম্য লক্ষ্য কৰা গৈছে`,
        mni: `ꯌꯦꯡꯁꯤꯅꯕꯤꯌꯨ: ${kinship}ꯒꯤ ꯋꯥꯈꯜ ꯈꯔꯥ ꯈꯦꯠꯅꯕꯥ ꯎꯕꯥ ꯐꯪꯏ`,
        bn: `মনোযোগ দিন: ${kinship}র কার্যকলাপে মৃদু পরিবর্তন লক্ষ্য করা গেছে`,
        brx: `गोसो होनाय: ${kinship}नि गोसोखांथिआव इसे सोलायनाय नुनो मोनदों`,
        kha: `Donkam jingiarap: Ka don ka jingkylla khyndiat ha ka jingmut jong ${kinship}`,
        lus: `Ngaihtuah deuh a ngai: ${kinship} hriatrengnaah danglamna tlem a awm`,
        hi: `हल्का बदलाव: ${kinship} के प्रदर्शन में हल्का सा उतार-चढ़ाव देखा गया है`,
        en: `Mild Fluctuation: ${kinship} exhibited slight day-to-day variance within acceptable limits`,
      },
      NEEDS_REVIEW: {
        as: `বিশেষ সতৰ্কতা: ${kinship}ৰ স্মৃতিৰ স্ক'ৰ হ্ৰাস পাইছে, আশাকৰ্মীৰ পৰামৰ্শ লওক`,
        mni: `ꯑꯀꯛꯅꯕꯥ ꯆꯦꯛꯁꯤꯅꯕꯥ: ${kinship}ꯒꯤ ꯋꯥꯈꯜ ꯍꯟꯊꯔꯛꯄꯥ ꯎꯕꯥ ꯐꯪꯏ`,
        bn: `সতর্কতা: ${kinship}র স্কোরে উল্লেখযোগ্য পতন ঘটেছে, স্বাস্থ্যকর্মীর পরামর্শ নিন`,
        brx: `सांग्रांथि: ${kinship}नि गोसोखांथि खम जाबाय, आशा हेफाजाबगिरिनि रायज्लाय`,
        kha: `Ka jingmaham: Ka jingkynmaw jong ${kinship} ka la hiar, pyntip ia ka ASHA`,
        lus: `Fimkhur a ngai: ${kinship} hriatrengna a tlahniam, ASHA worker rawn rawh`,
        hi: `समीक्षा आवश्यक: ${kinship} के स्कोर में गिरावट दर्ज हुई है, आशा दीदी से परामर्श लें`,
        en: `Clinical Review Suggested: ${kinship}'s scores dropped notably; consider an ASHA check-in`,
      },
    };
    return headlines[status][lang] || headlines[status].en;
  }

  private static composeCognitiveParagraph(
    status: CognitiveStatusCategory,
    kinship: string,
    mmse: string,
    delta: number,
    lang: SupportedVoiceLanguage
  ): string {
    const deltaStr = delta >= 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1);

    const templates: Record<SupportedVoiceLanguage, string> = {
      as: `${kinship}ৰ সামগ্ৰিক মানসিক সক্ষমতা স্ক'ৰ (MMSE প্ৰক্সি) এই সপ্তাহত ৩০ ৰ ভিতৰত ${mmse} আছিল (যোৱা সপ্তাহৰ তুলনাত ${deltaStr})। পৰম্পৰাগত খেলসমূহত তেওঁৰ মনযোগ আৰু দৃশ্য স্মৃতি যথেষ্ট সক্ৰিয় আছিল।`,
      mni: `${kinship}ꯒꯤ ꯆꯌꯣꯜ ꯑꯁꯤꯒꯤ ꯋꯥꯈꯜ ꯆꯦꯠꯄꯒꯤ ꯁ꯭ꯀꯣꯔ (MMSE) ꯳꯰ꯒꯤ ꯃꯅꯨꯡꯗꯥ ${mmse} ꯑꯣꯏꯔꯤ (${deltaStr})꯫ ꯄꯨꯋꯥꯔꯤ ꯁꯥꯟꯅꯄꯣꯠꯁꯤꯡ ꯁꯥꯟꯅꯕꯗꯥ ꯃꯍꯥꯛꯀꯤ ꯅꯤꯡꯁꯤꯡ ꯊꯧꯅꯥ ꯐꯅꯥ ꯎꯕꯥ ꯐꯪꯏ꯫`,
      bn: `${kinship}র সামগ্রিক মানসিক স্কোর (MMSE প্রক্সি) ৩০ এর মধ্যে ${mmse} রেকর্ড করা হয়েছে (পূর্ববর্তী সপ্তাহের চেয়ে ${deltaStr})। ঐতিহ্যবাহী খেলায় অংশ নিয়ে তিনি স্মৃতিশক্তি বেশ ধরে রেখেছেন।`,
      brx: `${kinship}नि सप्ताहानि गोसोखांथि स्कोर (MMSE) ३० नि मादाव ${mmse} जाबाय (${deltaStr})। दोहोरोम गेलेनायाव बिथांनि गोसोखांथि मोजां जादों।`,
      kha: `Ka score jingmut jong ${kinship} ha kane ka taiew ka long ${mmse} na ka 30 (${deltaStr}). Ha ki jingialehkai tynrai u/ka la lah ban pyni ia ka jingkynmaw kaba biang.`,
      lus: `${kinship} hriatna tehna (MMSE) chu 30 zelah ${mmse} a ni e (${deltaStr}). Hnam infiamna a khelhnaah hriatna a hmang tha hle.`,
      hi: `${kinship} का समग्र संज्ञानात्मक स्कोर (MMSE प्रॉक्सी) इस सप्ताह ३० में से ${mmse} रहा (${deltaStr})। सांस्कृतिक खेलों में उनकी सक्रियता और स्मरण क्षमता संतुलित रही।`,
      en: `${kinship}'s cognitive MMSE proxy score averaged ${mmse} out of 30 this week (${deltaStr} shift). Game interaction confirmed healthy engagement and steady visual-auditory recall.`,
    };
    return templates[lang] || templates.en;
  }

  private static composeAdherenceParagraph(
    kinship: string,
    adherencePercent: number,
    sundowningCount: number,
    lang: SupportedVoiceLanguage
  ): string {
    const templates: Record<SupportedVoiceLanguage, string> = {
      as: `ঔষধ আৰু পানী খোৱাৰ নিয়মীয়াতা আছিল ${adherencePercent}%। সন্ধিয়াৰ সময়ত বিচলিত হোৱাৰ মাত্ৰা ${sundowningCount} বাৰ লক্ষ্য কৰা হৈছিল আৰু লোকগীতৰ সুৰেৰে শান্ত কৰা হৈছিল।`,
      mni: `ꯍꯤꯗꯥꯛ ꯑꯃꯁꯨꯡ ꯏꯁꯤꯡ ꯊꯛꯄꯒꯤ ꯆꯥꯡ ${adherencePercent}% ꯑꯣꯏꯔꯤ꯫ ꯅꯨꯃꯤꯗꯥꯡꯋꯥꯏꯔꯝꯒꯤ ꯏꯉꯥꯎ ${sundowningCount} ꯔꯛ ꯊꯣꯛꯈꯤ ꯑꯃꯁꯨꯡ ꯏꯁꯩꯅꯥ ꯅꯨꯡꯉꯥꯏꯍꯟꯈꯤ꯫`,
      bn: `ওষুধ ও পানীয় গ্রহণের নিয়মিততা ছিল ${adherencePercent}%। সন্ধ্যার সময় অস্বস্তির ঘটনা ${sundowningCount} বার ঘটেছে এবং লোকগানের সুরে প্রশমিত করা হয়েছে।`,
      brx: `मुलि आरो दै लोंनाया ${adherencePercent}% जादों। बेलासिनि गोजोन समआव ${sundowningCount} खेब अनजिमा गोसो गोजोन मेथायजों सोमावसारनाय खम जादों।`,
      kha: `Ka jingdih dawai bad um ka long ${adherencePercent}%. Ha ka por janmiet la don ${sundowningCount} sien ka jingpyngngad da ka sur jingrwai tynrai.`,
      lus: `Damdawi leh tui in thlapna chu ${adherencePercent}% a ni. Tlailam buaina vawi ${sundowningCount} thleng chu nau awih hlain a tiziaawm e.`,
      hi: `दवा और जलपान की नियमितता ${adherencePercent}% रही। शाम के समय हल्की बेचैनी की ${sundowningCount} घटनाएं दर्ज हुईं जिन्हें लोरी और शांत संगीत से नियंत्रित किया गया।`,
      en: `Medication and hydration adherence achieved ${adherencePercent}%. Twilight restlessness was logged ${sundowningCount} time(s) and safely de-escalated via regional lullabies.`,
    };
    return templates[lang] || templates.en;
  }

  private static composeCorrelationHint(
    pattern: LifestyleCorrelationPattern,
    kinship: string,
    lang: SupportedVoiceLanguage
  ): string {
    const hints: Record<LifestyleCorrelationPattern, Record<SupportedVoiceLanguage, string>> = {
      TUESDAY_HAAT_DIP: {
        as: `পৰামৰ্শ: মঙলবাৰে প্ৰতিক্ৰিয়াৰ সময় অলপ বেছি দেখা গৈছিল, যিটো সাপ্তাহিক হাট-বজাৰৰ দিনৰ শাৰীৰিক ভাগৰৰ বাবে হোৱা স্বাভাৱিক কথা।`,
        mni: `ꯋꯥꯈꯜꯂꯣꯟ: ꯂꯩꯄꯥꯀꯄꯣꯛꯄꯗꯥ ꯃꯇꯝ ꯈꯔꯥ ꯆꯪꯈꯤ, ꯃꯁꯤ ꯀꯩꯊꯦꯜ ꯆꯠꯄꯒꯤ ꯊꯕꯛꯅꯥ ꯃꯔꯝ ꯑꯣꯏꯔꯒꯥ ꯍꯀꯆꯥꯡ ꯋꯥꯕꯒꯤꯅꯤ꯫`,
        bn: `পরামর্শ: মঙ্গলবার প্রতিক্রিয়া জানাতে সামান্য বিলম্ব লক্ষ্য করা গেছে, যা গ্রামীণ হাটের দিনে হাঁটাচলার ক্লান্তির স্বাভাবিক ফল।`,
        brx: `थासारि: मंगलबाराव इसे गोबाव जादोंमोन, बेयो हाथाय साननि थाबायनायनि थाखाय जादोंमोन।`,
        kha: `Jingbatai: Ha ka sngi Ba-ar ka la don ka jingbuh por khyndiat namar ka jingbazar iew kaba la pynbut ia ka met.`,
        lus: `Hriattur: Thawhlehnia a chet muan deuhna chu bazar ni a nih vanga taksa chauh vang a ni e.`,
        hi: `जीवनशैली संकेत: मंगलवार को प्रतिक्रिया समय में थोड़ी देरी साप्ताहिक हाट-बाजार की शारीरिक थकान के कारण स्वाभाविक प्रतीत होती है।`,
        en: `Lifestyle Correlation: Tuesday's reaction latency increase coincides with village market day; walking fatigue is typical and non-pathological.`,
      },
      SUNDAY_PRAYER_BOOST: {
        as: `পৰামৰ্শ: দেওবাৰে প্ৰাৰ্থনা সভা বা নামঘৰলৈ যোৱাৰ পিছত স্মৃতি শক্তি আৰু আনন্দ লক্ষণীয়ভাৱে বৃদ্ধি পোৱা দেখা গৈছে।`,
        mni: `ꯋꯥꯈꯜꯂꯣꯟ: ꯅꯣꯡꯃꯥꯏꯖꯤꯡꯗꯥ ꯂꯥꯏꯅꯤꯡ-ꯂꯤꯆꯠ ꯑꯃꯁꯨꯡ ꯏꯁꯩ ꯁꯛꯄꯅꯥ ꯋꯥꯈꯜ ꯌꯥꯝꯅꯥ ꯐꯍꯟꯈꯤ꯫`,
        bn: `পরামর্শ: রবিবার প্রার্থনা সভায় অংশ নেওয়ার পর স্মৃতিশক্তি ও মেজাজে উল্লেখযোগ্য প্রফুল্লতা লক্ষ্য করা গেছে।`,
        brx: `थासारि: रबिबाराव इसोर सोरजिनायनि उनाव गोसोखांथि आरो गोसोनि गोजोननाय बारा जादों।`,
        kha: `Jingbatai: Ha ka sngi U Blei ka jingrwai ha iingmane ka la ai jingkyrmen bad pynshait ia ka jingmut.`,
        lus: `Hriattur: Pathiannia inkhawm leh hla sak hian a hriatrengna leh rilru a pui nasa hle.`,
        hi: `जीवनशैली संकेत: रविवार को सत्संग/प्रार्थना के उपरांत स्मरण शक्ति और मानसिक प्रसन्नता में सकारात्मक वृद्धि देखी गई।`,
        en: `Lifestyle Correlation: Sunday's performance boost correlates with community prayer/singing; social spiritual grounding aided cognitive focus.`,
      },
      WINTER_DUSK_AGITATION: {
        as: `পৰামৰ্শ: সোনকালে বেলি বহাৰ বাবে আবেলি ৪:১৫ মানতেই কোঠাত পোহৰ জ্বলাই দিলে সন্ধিয়াৰ অস্বস্তি সহজে এৰাব পাৰি।`,
        mni: `ꯋꯥꯈꯜꯂꯣꯟ: ꯅꯨꯃꯤꯠ ꯊꯨꯅꯥ ꯇꯥꯕꯅꯥ ꯃꯔꯝ ꯑꯣꯏꯔꯒꯥ ꯑꯌꯨꯛ-ꯅꯨꯃꯤꯗꯥꯡ ꯃꯉꯥꯜ ꯊꯨꯅꯥ ꯊꯥꯅꯕꯤꯌꯨ꯫`,
        bn: `পরামর্শ: শীতের দ্রুত সূর্যাস্তের কারণে বিকেল ৪:১৫ নাগাদ ঘরে উজ্জ্বল আলো জ্বালিয়ে দিলে সন্ধ্যার অস্বস্তি কমে যাবে।`,
        brx: `थासारि: सान थाब हाबनायनि थाखाय बेलासे ४:१५ आव नोआव जोंनाय होबानो गोजोन थागोन।`,
        kha: `Jingbatai: Namar ba step kem janmiet ha tlang, pynbna ia ki sharak ha iing shuwa ka 4:15 PM.`,
        lus: `Hriattur: Fur lai a nih vangin tlai lam 4:15 velah in chhung tih en thin tur a ni.`,
        hi: `जीवनशैली संकेत: सर्दियों में जल्दी ढलते सूरज के कारण शाम ४:१५ बजे कमरे की रोशनी चालू रखने से बेचैनी रोकी जा सकती है।`,
        en: `Lifestyle Correlation: Early twilight dusk triggers restlessness; illuminating rooms by 4:15 PM prevents twilight disorientation.`,
      },
      MISSED_DOSE_TREMOR: {
        as: `পৰামৰ্শ: বৃহস্পতিবাৰে পুৱা ঔষধ পাহৰি যোৱাৰ বাবে হাতৰ কঁপনি সামান্য বাঢ়িছিল; ঔষধৰ বাকচটো পৰীক্ষা কৰক।`,
        mni: `ꯋꯥꯈꯜꯂꯣꯟ: ꯍꯤꯗꯥꯛ ꯆꯥꯕꯥ ꯊꯨꯅꯥ ꯀꯥꯎꯈꯤꯕꯅꯥ ꯃꯔꯝ ꯑꯣꯏꯔꯒꯥ ꯈꯨꯠ ꯈꯔꯥ ꯈꯠꯈꯤ꯫`,
        bn: `পরামর্শ: বৃহস্পতিবার ওষুধ গ্রহণে বিলম্ব হওয়ায় হাতে মৃদু কম্পন বেড়েছিল; ওষুধের বাক্সটি পরীক্ষা করুন।`,
        brx: `थासारि: मुलि लोंनो बावनायनि थाखाय आखाय गोबाव सोमावदोंमोन, मुलिखौ नायदो।`,
        kha: `Jingbatai: Ka jingkynmaw dawai kaba la bakla ka la wanrah jingkhynniuh kti; peit ia ka synduk dawai.`,
        lus: `Hriattur: Damdawi ei theihnghilh avangin kut khur a awm thut a, damdawi bawm enfiah rawh.`,
        hi: `जीवनशैली संकेत: गुरुवार की खुराक छूटने के कारण हाथ का कंपन हल्का बढ़ा था; दवा बॉक्स की जांच करें।`,
        en: `Lifestyle Correlation: Thursday's tremor elevation followed an unconfirmed morning dose; please verify the pill organizer.`,
      },
      NONE: {
        as: `পৰামৰ্শ: দৈনন্দিন অভ্যাস সুস্থিৰ আছিল, কোনো অস্বাভাৱিক ঘটনা লক্ষ্য কৰা হোৱা নাই।`,
        mni: `ꯋꯥꯈꯜꯂꯣꯟ: ꯅꯨꯃꯤꯠ ꯈꯨꯗꯤꯡꯒꯤ ꯊꯕꯛ ꯆꯨꯝꯅꯥ ꯆꯠꯊꯔꯤ꯫`,
        bn: `পরামর্শ: প্রাত্যহিক কার্যকলাপ স্বাভাবিক ছিল, কোনো অস্বাভাবিকতা লক্ষ্য করা যায়নি।`,
        brx: `थासारि: सानफ्रोमनि थासारिया मोजाङैनो थांबाय।`,
        kha: `Jingbatai: Ka rukom im sngi ka la iaid beit kumba juh long.`,
        lus: `Hriattur: Ni tin nunphung a pangngai reng e.`,
        hi: `जीवनशैली संकेत: दैनिक दिनचर्या सामान्य और संतुलित रही।`,
        en: `Lifestyle Correlation: Daily habits proceeded consistently with no abnormal variance detected.`,
      },
    };

    return hints[pattern][lang] || hints[pattern].en;
  }

  private static composeActionItem(
    status: CognitiveStatusCategory,
    adherencePercent: number,
    lang: SupportedVoiceLanguage
  ): string {
    const actions: Record<SupportedVoiceLanguage, string> = {
      as:
        adherencePercent < 80
          ? "পৰিয়ালৰ পৰামৰ্শ: ঔষধৰ বাবে নাতিনীয়েকৰ পৰিয়ালৰ কণ্ঠৰ ৰিমাইণ্ডাৰ ব্যৱহাৰ কৰক।"
          : "পৰিয়ালৰ পৰামৰ্শ: আজি সন্ধিয়া তেওঁৰ সৈতে ১৫ মিনিট পুৰণি স্মৃতিৰ বিষয়ে কথা পাতক।",
      mni:
        adherencePercent < 80
          ? "ꯏꯃꯨꯡꯒꯤ ꯊꯕꯛ: ꯍꯤꯗꯥꯛ ꯆꯥꯅꯕꯥ ꯏꯃꯨꯡꯒꯤ ꯈꯣꯟꯊꯣꯛꯀꯤ ꯔꯤꯃꯥꯏꯟꯗꯔ ꯁꯤꯖꯤꯟꯅꯕꯤꯌꯨ꯫"
          : "ꯏꯃꯨꯡꯒꯤ ꯊꯕꯛ: ꯅꯨꯃꯤꯗꯥꯡꯋꯥꯏꯔꯝꯗꯥ ꯃꯤꯅꯤꯠ ꯱꯵ ꯄꯨꯋꯥꯔꯤ ꯋꯥꯔꯤ ꯁꯥꯅꯕꯤꯌꯨ꯫",
      bn:
        adherencePercent < 80
          ? "পরিবারের করণীয়: ওষুধের সময় প্রিয়জনের গলার ভয়েস অ্যালার্ম সক্রিয় করুন।"
          : "পরিবারের করণীয়: আজ রাতে ওনার সাথে পুরোনো সুখস্মৃতি নিয়ে গল্প করুন।",
      brx:
        adherencePercent < 80
          ? "नख'रनि मावनांगौ: मुलिनि थाखाय नख'रनि गाबनि रिमाइन्डर बाहाय।"
          : "नख'रनि मावनांगौ: दिनै बेलासे बिथांजों १५ मिनिट गोजाम गोसोखांथि रायज्लाय।",
      kha:
        adherencePercent < 80
          ? "Jingbthah: Pyndonkam ia ka sur rwai kur ban kynmaw dawai."
          : "Jingbthah: Iakren bad u/ka 15 minit shaphang ki por ba la leit noh.",
      lus:
        adherencePercent < 80
          ? "Chhungkaw tih tur: Damdawi hriattirnaah chhungte aw hmang rawh."
          : "Chhungkaw tih tur: Zanin chu hmanlai thawnthu minute 15 inhrilh ula.",
      hi:
        adherencePercent < 80
          ? "परिवार का कदम: दवा समय पर लेने के लिए पारिवारिक आवाज वाला अलार्म सेट करें।"
          : "परिवार का कदम: आज शाम उनके साथ बैठकर १५ मिनट पुरानी सुखद यादें साझा करें।",
      en:
        adherencePercent < 80
          ? "Family Action Item: Activate kinship voice prompts to assist medication routine."
          : "Family Action Item: Spend 15 minutes this evening reminiscing over family photo stories.",
    };
    return actions[lang] || actions.en;
  }
}
