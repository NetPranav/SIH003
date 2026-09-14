/**
 * Smriti-NER (স্মৃতি) — Sub-Phase 8.3: Multilingual IVR Content Library
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Clinical Focus:
 * Complete 8-language audio script bundles, 1-press DTMF dialect selection,
 * and persistent caller phone number profile mapping for zero-smartphone accessibility.
 */

import { SupportedVoiceLanguage } from "./bhashiniVoiceService";

export interface IVRMenuLanguageOption {
  digit: string;
  code: SupportedVoiceLanguage;
  name: string;
  nativeName: string;
  telecomCircle: string;
}

export interface IVRLanguageScriptBundle {
  language: SupportedVoiceLanguage;
  name: string;
  nativeName: string;
  welcome: string;
  circadianReassurance: string;
  orientationQuestion: string;
  recallPresentation: string;
  recallRetrieval: string;
  adherenceCheck: string;
  ashaEmergency: string;
  goodbyeClosure: string;
}

export class IvrMultilingualLibrary {
  private static callerProfiles: Map<string, SupportedVoiceLanguage> = new Map();

  public static readonly MENU_OPTIONS: IVRMenuLanguageOption[] = [
    { digit: "1", code: "as", name: "Assamese", nativeName: "অসমীয়া", telecomCircle: "Assam" },
    { digit: "2", code: "bn", name: "Bengali", nativeName: "বাংলা", telecomCircle: "Tripura / Barak Valley" },
    { digit: "3", code: "mni", name: "Meitei", nativeName: "ꯃꯤꯇꯩꯂꯣꯟ", telecomCircle: "Manipur" },
    { digit: "4", code: "brx", name: "Bodo", nativeName: "बड़ो", telecomCircle: "Bodoland (BTC)" },
    { digit: "5", code: "kha", name: "Khasi", nativeName: "Ka Ktien Khasi", telecomCircle: "Meghalaya" },
    { digit: "6", code: "lus", name: "Mizo", nativeName: "Mizo ṭawng", telecomCircle: "Mizoram" },
    { digit: "7", code: "hi", name: "Hindi", nativeName: "हिन्दी", telecomCircle: "Pan-NER" },
    { digit: "8", code: "en", name: "English", nativeName: "English", telecomCircle: "Pan-NER" },
  ];

  public static readonly SCRIPT_BUNDLES: Record<SupportedVoiceLanguage, IVRLanguageScriptBundle> = {
    as: {
      language: "as",
      name: "Assamese",
      nativeName: "অসমীয়া",
      welcome: "নমস্কাৰ পিতা! স্মৃতি সেৱালৈ স্বাগতম। আপোনাৰ মনটো আজি কেনে আছে?",
      circadianReassurance: "চিন্তা নকৰিব পিতা, আপুনি আপোনাৰ নিজৰ ঘৰতেই সুৰক্ষিত হৈ আছে। বেলি ওলাইছে, শান্ত হওক।",
      orientationQuestion: "এতিয়া পুৱাৰ ভাগ হৈছেনে গধূলিৰ ভাগ? পুৱা হ'লে ১ টিপক, গধূলি হ'লে ২ টিপক, অথবা মুখেই কওক।",
      recallPresentation: "মই কোৱা এই তিনিটা চিনাকি শব্দ মন দি শুনক আৰু মনত ৰাখক: গামোচা, জাঁপী, কাজিৰঙা।",
      recallRetrieval: "এতিয়া মোক সেই তিনিটা চিনাকি শব্দ আকৌ মনত পেলাই কওকচোন।",
      adherenceCheck: "আজি ৰাতিপুৱাৰ ঔষধ আৰু এগিলাচ কুহুমীয়া পানী খালে নে? খালে ১ টিপক, বা 'খালোঁ' কওক।",
      ashaEmergency: "আমাৰ আশা বাইদেউৰ সৈতে এতিয়াই পোনপটীয়াকৈ কথা পাতিবলৈ ৯ টিপক বা মুখৰে 'বাইদেউ' মাতক।",
      goodbyeClosure: "বৰ ভাল লাগিল পিতা! মনটো প্ৰফুল্ল ৰাখক। স্মৃতি সেৱা সদায় আপোনাৰ কাষতেই আছে।",
    },
    bn: {
      language: "bn",
      name: "Bengali",
      nativeName: "বাংলা",
      welcome: "নমস্কার! স্মৃতি সেবায় আপনাকে স্বাগত। আজ আপনার শরীর ও মন কেমন আছে?",
      circadianReassurance: "চিন্তা করবেন না, আপনি আপনার নিজের বাড়িতেই নিরাপদে আছেন।",
      orientationQuestion: "এখন কি সকালের সময় নাকি সন্ধ্যার সময়? সকাল হলে ১ টিপুন, সন্ধ্যা হলে ২ টিপুন।",
      recallPresentation: "মন দিয়ে শুনুন এই তিনটি পরিচিত শব্দ: গামছা, ঢাক, সুন্দরবন।",
      recallRetrieval: "এখন সেই তিনটি শব্দ আমাকে আবার মনে করে বলুন।",
      adherenceCheck: "আজকের সকালের ওষুধ আর জল কি খাওয়া হয়েছে? খেলে ১ টিপুন।",
      ashaEmergency: "আশাকর্মী বোনের সাথে সরাসরি কথা বলতে ৯ টিপুন।",
      goodbyeClosure: "ভালো থাকবেন! স্মৃতি সেবা সবসময় আপনার পাশে আছে।",
    },
    mni: {
      language: "mni",
      name: "Meitei",
      nativeName: "ꯃꯤꯇꯩꯂꯣꯟ",
      welcome: "ꯇꯔꯥꯝꯅꯥ ꯑꯣꯛꯆꯔꯤ ꯏꯄꯥ! ꯁ꯭ꯃ꯭ꯔꯤꯇꯤ ꯁꯦꯕꯥꯗꯥ ꯇꯔꯥꯝꯅꯥ ꯑꯣꯛꯄꯤꯌꯨ꯫",
      circadianReassurance: "ꯏꯄꯥ ꯋꯥꯈꯜ ꯋꯥꯒꯅꯨ, ꯅꯍꯥꯛ ꯃꯌꯨꯃꯗꯥ ꯅꯨꯡꯉꯥꯏꯅꯥ ꯂꯩꯔꯤ꯫",
      orientationQuestion: "ꯍꯧꯖꯤꯛ ꯑꯌꯨꯛꯅꯤ ꯅꯠꯔꯒꯥ ꯅꯨꯃꯤꯗꯥꯡꯅꯤ? ꯑꯌꯨꯛ ꯑꯣꯏꯔꯒꯗꯤ ꯱ ꯅꯝꯕꯤꯌꯨ꯫",
      recallPresentation: "ꯋꯥꯍꯩ ꯑꯍꯨꯝ ꯑꯁꯤ ꯇꯥꯕꯤꯌꯨ: ꯂꯩꯔꯨꯝ, ꯄꯨꯡ, ꯂꯣꯛꯇꯥꯛ꯫",
      recallRetrieval: "ꯍꯧꯖꯤꯛ ꯋꯥꯍꯩ ꯑꯍꯨꯝ ꯑꯗꯨ ꯑꯃꯨꯛ ꯍꯥꯏꯕꯤꯌꯨ꯫",
      adherenceCheck: "ꯍꯤꯗꯥꯛ ꯆꯥꯕꯤꯔꯕꯔꯥ? ꯆꯥꯔꯕꯗꯤ ꯱ ꯅꯝꯕꯤꯌꯨ꯫",
      ashaEmergency: "ꯑꯥꯁꯥ ꯊꯕꯛꯄꯨꯔꯣꯏꯒꯥ ꯋꯥꯔꯤ ꯁꯥꯅꯅꯕꯥ ꯹ ꯅꯝꯕꯤꯌꯨ꯫",
      goodbyeClosure: "ꯍꯀꯆꯥꯡ ꯐꯅꯥ ꯂꯩꯕꯤꯌꯨ!",
    },
    brx: {
      language: "brx",
      name: "Bodo",
      nativeName: "बड़ो",
      welcome: "खुलुमबाय आबु! स्मृती सेवायाव बरायबाय।",
      circadianReassurance: "गिख'नाङा आबु, नों गावनि नोआवनो दं।",
      orientationQuestion: "दा फुं जानाय ना बेलासे? फुं जाब्ला १ खौ थुदो।",
      recallPresentation: "बे मोनथाम सोदोबखौ गोसो हो: दखना, सिफुं, मानस।",
      recallRetrieval: "दा बै मोनथाम सोदोबखौ फिन बुं।",
      adherenceCheck: "मुलि लोंबाय ना? लोंब्ला १ खौ थुदो।",
      ashaEmergency: "आशा हेफाजाबगिरिजों रायज्लायनो ९ खौ थुदो।",
      goodbyeClosure: "गोजोनै थादो!",
    },
    kha: {
      language: "kha",
      name: "Khasi",
      nativeName: "Ka Ktien Khasi",
      welcome: "Khublei Meiieid! Pdiang sngewbha sha ka Smriti Service.",
      circadianReassurance: "Wat sngewkhia, phi don ha la iing kaba shngain.",
      orientationQuestion: "Ka long ka por step ne janmiet? Lada ka step, pynkhein ia u 1.",
      recallPresentation: "Sngap bha ia kine ki lai tylli ki kyntien: Jainsem, Duitara, Umiam.",
      recallRetrieval: "Kynmaw pat bad iathuh ia kine ki kyntien.",
      adherenceCheck: "Phi la dih ia ki dawai step? Lada hooid pynkhein ia u 1.",
      ashaEmergency: "Ban iakren bad ka ASHA, pynkhein ia u 9.",
      goodbyeClosure: "Khublei shibun!",
    },
    lus: {
      language: "lus",
      name: "Mizo",
      nativeName: "Mizo ṭawng",
      welcome: "Chibai Pu pu! Smriti rawngbawlnaah kan lo lawm a che.",
      circadianReassurance: "Hlauhthawn tur a awm lo, i inah i awm e.",
      orientationQuestion: "Zing lam nge tlai lam a nih? Zing a nih chuan 1 hmet rawh.",
      recallPresentation: "Heng thu pathumte hi lo ngaithla rawh: Puanchei, Khuang, Reiek.",
      recallRetrieval: "Chung thu pathumte chu han sawi leh teh le.",
      adherenceCheck: "Zing damdawi i ei tawh em? Ei tawh chuan 1 hmet rawh.",
      ashaEmergency: "ASHA biak duh chuan 9 hmet rawh.",
      goodbyeClosure: "Dam takin le!",
    },
    hi: {
      language: "hi",
      name: "Hindi",
      nativeName: "हिन्दी",
      welcome: "नमस्ते दादाजी! स्मृति सेवा में आपका स्वागत है। आज आपका स्वास्थ्य कैसा है?",
      circadianReassurance: "चिंता न करें, आप अपने घर पर पूरी तरह सुरक्षित हैं।",
      orientationQuestion: "अभी सुबह का समय है या शाम का? सुबह के लिए १ दबाएं, शाम के लिए २ दबाएं।",
      recallPresentation: "इन तीन परिचित शब्दों को ध्यान से सुनें: शॉल, ढोलक, गंगा।",
      recallRetrieval: "अब वे तीन शब्द मुझे पुनः बताइए।",
      adherenceCheck: "क्या आपने सुबह की दवा और पानी ले लिया? ले लिया हो तो १ दबाएं।",
      ashaEmergency: "आशा दीदी से बात करने के लिए ९ दबाएं।",
      goodbyeClosure: "शुभ दिन! अपना ध्यान रखें।",
    },
    en: {
      language: "en",
      name: "English",
      nativeName: "English",
      welcome: "Hello! Welcome to Smriti Cognitive Wellness IVR line.",
      circadianReassurance: "Do not worry, you are resting safely in your own home.",
      orientationQuestion: "Is it currently morning time or evening time? Press 1 for Morning, Press 2 for Evening.",
      recallPresentation: "Please listen carefully to these 3 familiar words: Shawl, Flute, Mountain.",
      recallRetrieval: "Now please repeat those three words back to me.",
      adherenceCheck: "Have you taken your morning medication and water? Press 1 to confirm.",
      ashaEmergency: "To speak directly with your local ASHA health worker, press 9.",
      goodbyeClosure: "Have a wonderful, peaceful day! Smriti is always here for you.",
    },
  };

  /**
   * Resolves caller language based on past phone profile, DTMF digit, or telecom circle
   */
  public static resolveLanguage(
    phoneNumber: string,
    digit?: string,
    telecomCircle?: string
  ): SupportedVoiceLanguage {
    // 1. Saved caller profile
    if (this.callerProfiles.has(phoneNumber)) {
      return this.callerProfiles.get(phoneNumber)!;
    }

    // 2. DTMF digit selection
    if (digit) {
      const match = this.MENU_OPTIONS.find((opt) => opt.digit === digit);
      if (match) {
        this.callerProfiles.set(phoneNumber, match.code);
        return match.code;
      }
    }

    // 3. Telecom circle fallback
    if (telecomCircle) {
      const circleLower = telecomCircle.toLowerCase();
      if (circleLower.includes("tripura")) return "bn";
      if (circleLower.includes("manipur")) return "mni";
      if (circleLower.includes("meghalaya")) return "kha";
      if (circleLower.includes("mizoram")) return "lus";
      if (circleLower.includes("bodo") || circleLower.includes("btc")) return "brx";
    }

    return "as"; // Default regional Assamese
  }

  /**
   * Explicitly sets and persists caller language preference
   */
  public static saveCallerLanguage(
    phoneNumber: string,
    language: SupportedVoiceLanguage
  ): void {
    this.callerProfiles.set(phoneNumber, language);
  }

  /**
   * Returns complete script bundle for a language
   */
  public static getScriptBundle(language: SupportedVoiceLanguage): IVRLanguageScriptBundle {
    return this.SCRIPT_BUNDLES[language] || this.SCRIPT_BUNDLES.en;
  }
}
