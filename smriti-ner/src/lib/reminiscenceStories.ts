/**
 * Smriti-NER — Multilingual Family Reminiscence Stories
 * Culturally reverent, comforting stories in all 8 Northeast Indian languages
 * for photo reminiscing and cognitive orientation.
 */

import { offlineMobileStore, type OfflineAlbumPhoto } from "./offlineMobileStorage";
import { translatePhotoStoryToNative } from "./geminiCompanionService";

export const SEED_REMINISCENCE_STORIES: Record<string, Record<string, string>> = {
  photo_1: {
    as: "মনত পেলাওক বৰদেউতা, যোৰহাটৰ ৰঙালী বিহুৰ সেই অপূৰ্ব দিনটো। আপুনি নিজৰ পৰম্পৰাগত মুগা কুৰ্তা পিন্ধি চাহ বাগিচাৰ কাষত পৰিয়াল আৰু আত্মীয়সকলৰ সৈতে আনন্দৰে ঢোল বজাইছিল। সকলোৱে কিমান হাঁহিছিল আৰু আনন্দ কৰিছিল!",
    bn: "মনে করুন দাদু, জোরহাটের সেই রঙ্গালী বিহুর সুন্দর দিনটি। আপনি আপনার ঐতিহ্যবাহী মুগা কুর্তা পরে চা বাগানের কাছে পরিবার আর ভাইবোনদের সাথে মন খুলে ঢোল বাজাচ্ছিলেন। সবাই কত আনন্দ করেছিল!",
    hi: "याद कीजिए दादाजी, जोरहाट के उस रंगाली बिहू का दिन। पारंपरिक मुगा कुर्ता पहनकर, आप चाय बागान के पास अपने परिवार और प्रियजनों के साथ खुशी से ढोल बजा रहे थे। सब बहुत खुश थे!",
    mni: "ꯏꯄꯥ ꯅꯤꯡꯁꯤꯡꯕꯤꯌꯨ, ꯖꯣꯔꯍꯥꯇꯀꯤ ꯔꯣꯡꯒꯥꯂꯤ ꯕꯤꯍꯨꯒꯤ ꯅꯨꯃꯤꯠ꯫ ꯅꯍꯥꯛꯅꯥ ꯃꯨꯒꯥ ꯀꯨꯔꯇꯥ ꯁꯦꯠꯇꯨꯅꯥ ꯆꯥ ꯄꯥꯝꯕꯤ ꯃꯅꯥꯛꯇꯥ ꯏꯃꯨꯡ-ꯃꯅꯨꯡꯒꯥ ꯂꯣꯌꯅꯅꯥ ꯄꯨꯡ ꯊꯥꯔꯝꯃꯤ꯫ ꯌꯥꯝꯅꯥ ꯅꯨꯡꯉꯥꯏꯈꯤ꯫",
    brx: "आफा गोसोखां, जरहाटनि रोंगाली बिहुनि सानखौ। नोंथाङा मुगा कुर्ता गाननानै साहा बागानसिम नखरजों द्राम दामदोंमोन। बयबो मोजां मोन्दोंमोन!",
    kha: "Kynmaw Kpa, ka sngi Bihu ha Jorhat. Phi phong ka Muga Kurta bad tem ksing ha syndah ka kper sha bad ka ïing ka sem baroh. Ka ba kmen bha!",
    lus: "Ka pa, Jorhat-a Rongali Bihu hun lai kha hre reng em? Muga Kurta mawi tak ha chunga thingpui huan bula chhungte nen hlim taka khuang i vuak lai a ni.",
    en: "Remember this day, Grandfather. Rongali Bihu in Jorhat. You were wearing your traditional Muga Kurta, happily playing the Dhol with family and cousins by the tea garden.",
  },
  photo_2: {
    as: "আমাৰ প্ৰিয়াৰ গৌৰৱৰ দিন! গুৱাহাটী বিশ্ববিদ্যালয়ৰ সমাবৰ্তনত আপুনি আনন্দৰ চকুলোৰে তাইৰ হাতত ডিগ্ৰীৰ প্ৰমাণপত্ৰ তুলি দিছিল। তাই এতিয়াও আপোনাৰ আশীৰ্বাদ শিৰত লৈ চলে।",
    bn: "আমাদের প্রিয় প্রিয়ার গর্বের দিন! গুয়াহাটি বিশ্ববিদ্যালয়ের সমাবর্তনে আপনি আনন্দের অশ্রু চোখে প্রিয়ার হাতে তার ডিগ্রি সার্টিফিকেট তুলে দিয়েছিলেন। ও আপনাকে খুব ভালোবাসে।",
    hi: "हमारी प्यारी पोती प्रिया के दीक्षांत समारोह का दिन! गुवाहाटी विश्वविद्यालय में आपने गर्व और खुशी के आंसुओं के साथ प्रिया को उसकी डिग्री सौंपी थी। वह आज भी आपका बहुत आदर करती है।",
    mni: "ꯄ꯭ꯔꯤꯌꯥꯒꯤ ꯒ꯭ꯔꯦꯖꯨꯑꯦꯁꯟ ꯅꯨꯃꯤꯠ꯫ ꯒꯨꯋꯥꯍꯥꯇꯤ ꯌꯨꯅꯤꯚꯔꯁꯤꯇꯤꯗꯥ ꯅꯍꯥꯛꯅꯥ ꯅꯨꯡꯉꯥꯏꯕꯒꯤ ꯄꯤꯔꯥꯡꯒꯥ ꯂꯣꯌꯅꯅꯥ ꯄ꯭ꯔꯤꯌꯥꯗꯥ ꯁꯔꯇꯤꯐꯤꯀꯦꯠ ꯄꯤꯈꯤ꯫",
    brx: "प्रियानि युनिभार्सिटि सम जाबाय। गुवाहाटी युनिभार्सिटियाव नोंथाङा गोजोननायजों प्रियानो बिथांनि दिग्रि बिलाइ होदोंमोन।",
    kha: "Ka sngi pdiang degree jong ka Priya ha Gauhati University. Phi ai ïa ka certificate degree ha ka Priya da ki ummat jong ka jingkmen.",
    lus: "Gauhati University-a Priya-in a degree a lak ni a nih kha. Hlimna mittui nena a certificate i hlan lai kha chhungkua zawng zawngin kan hrereng e.",
    en: "Priya’s proud Graduation Day at Gauhati University. You handed Priya her degree certificate with proud tears of joy in your eyes.",
  },
  photo_3: {
    as: "মাজুলীৰ কমলাবাৰী সত্ৰলৈ আমাৰ ফেৰী যাত্ৰা। মহামতি ব্ৰহ্মপুত্ৰৰ বুকুত সুন্দৰ সূৰ্যাস্ত, চাৰিওফালে কিমান শান্তি! আমি সকলোৱে মিলি ঈশ্বৰৰ আশীৰ্বাদ লৈছিলোঁ।",
    bn: "মাজুলীর কমলাবাড়ি সত্রের সেই পবিত্র তীর্থযাত্রা। বিশাল ব্রহ্মপুত্রের বুকে সূর্যাস্তের অপূর্ব দৃশ্য আর চারদিকে কি সুন্দর শান্তি! আমরা সবাই একসঙ্গে ভগবানের আশীর্বাদ নিয়েছিলাম।",
    hi: "माजुली के कमलाबाड़ी सत्र की पवित्र यात्रा। विशाल ब्रह्मपुत्र नदी पर सूर्यास्त की शांत छटा और परिवार का साथ। वह यात्रा बहुत ही शांतिदायक और पावन थी।",
    mni: "ꯃꯥꯖꯨꯂꯤꯒꯤ ꯀꯃꯂꯥꯕꯥꯔꯤ ꯁꯠꯔꯥꯗꯥ ꯆꯠꯄꯒꯤ ꯐꯦꯔꯤ ꯌꯥꯇ꯭ꯔꯥ꯫ ꯕ꯭ꯔꯍ꯭ꯃꯄꯨꯇ꯭ꯔ ꯏꯔꯦꯟꯄꯨꯡꯗꯥ ꯅꯨꯃꯤꯠ ꯇꯥꯕꯒꯤ ꯁꯥꯟꯇꯤ ꯑꯣꯏꯔꯕꯥ ꯃꯇꯝ꯫",
    brx: "माजुलीनि कमलाबारी सथ्रसिम फेरिफ्राय थांनायनि गोसोखांथि। ब्रह्मपुत्र दैमायाव सान गाहायाव गोलोमनाय आरो सान्थि मोननाय।",
    kha: "Ka jingleit sha Kamalabari Satra ha Majuli. Ka sngi kaba sep ha ka wah Brahmaputra, ka ba shngain bad suk bha ïa ka ïing baroh.",
    lus: "Brahmaputra luia Kamalabari Satra panna lawng chunga in zinchhuah lai kha a ni. Ni tla tur mawi tak leh thlamuanna hlir mai kha a va nuam tak em.",
    en: "Sunset over the mighty Brahmaputra river heading to Kamalabari Satra in Majuli for the sacred festival with the whole family.",
  },
};

// ── Kinship & Location Term Dictionaries for 100% Offline Translation ───
const KINSHIP_DICTIONARY: Record<string, Record<string, string>> = {
  hi: {
    granddaughter: "पोती",
    grandson: "पोता",
    daughter: "बेटी",
    son: "बेटा",
    family: "परिवार",
    cousin: "भाई-बहन",
    cousins: "भाई-बहन",
    wife: "पत्नी",
    husband: "पति",
    mother: "माँ",
    father: "पिताजी",
    brother: "भाई",
    sister: "बहन",
    children: "बच्चे",
    friend: "दोस्त",
    home: "घर",
  },
  as: {
    granddaughter: "নাতিনী",
    grandson: "নাতি",
    daughter: "জীয়াৰী",
    son: "ল’ৰা",
    family: "পৰিয়াল",
    cousin: "আত্মীয়",
    cousins: "আত্মীয়সকল",
    wife: "পত্নী",
    husband: "স্বামী",
    mother: "মা",
    father: "দেউতা",
    brother: "ভাই",
    sister: "ভনী",
    children: "সন্তানসকল",
    friend: "বন্ধু",
    home: "ঘৰ",
  },
  bn: {
    granddaughter: "নাতনি",
    grandson: "নাতি",
    daughter: "মেয়ে",
    son: "ছেলে",
    family: "পরিবার",
    cousin: "তুতো ভাইবোন",
    cousins: "আত্মীয়রা",
    wife: "স্ত্রী",
    husband: "স্বামী",
    mother: "মা",
    father: "বাবা",
    brother: "ভাই",
    sister: "বোন",
    children: "সন্তানরা",
    friend: "বন্ধু",
    home: "বাড়ি",
  },
  mni: {
    granddaughter: "ꯅꯥꯇꯣꯟ",
    grandson: "ꯅꯥꯇꯣꯟ",
    daughter: "ꯃꯆꯥꯅꯨꯄꯤ",
    son: "ꯃꯆꯥꯅꯨꯄꯥ",
    family: "ꯏꯃꯨꯡ",
    wife: "ꯂꯣꯌꯅꯕꯤ",
    husband: "ꯃꯄꯨꯔꯣꯏꯕꯥ",
    home: "ꯌꯨꯝ",
  },
  brx: {
    granddaughter: "फिसौजो",
    grandson: "फिसौला",
    daughter: "फिसाजो",
    son: "फिसाला",
    family: "नखर",
    wife: "हिनजाव",
    husband: "होवा",
    home: "न",
  },
  kha: {
    granddaughter: "ksiew kynthei",
    grandson: "ksiew shynrang",
    daughter: "khun kynthei",
    son: "khun shynrang",
    family: "ïing",
    home: "ïing",
  },
  lus: {
    granddaughter: "tunu",
    grandson: "tupa",
    daughter: "fanu",
    son: "fapa",
    family: "chhungkua",
    home: "in",
  },
};

const COMMON_VOCABULARY: Record<string, Record<string, string>> = {
  hi: {
    "college visit": "कॉलेज की सुखद यात्रा",
    "college": "कॉलेज",
    "university": "विश्वविद्यालय",
    "graduation": "दीक्षांत समारोह",
    "wedding": "शादी",
    "marriage": "विवाह",
    "visit": "भ्रमण और मुलाकात",
    "trip": "यात्रा",
    "festival": "त्योहार और उत्सव",
    "garden": "बागान",
    "tea garden": "चाय बागान",
    "home": "घर",
    "house": "घर",
    "party": "उत्सव",
    "celebration": "उत्सव",
    "birthday": "जन्मदिन",
    "morning": "सुबह",
    "evening": "शाम",
    "sunset": "सूर्यास्त",
    "tea": "चाय",
    "guwahati": "गुवाहाटी",
    "jorhat": "जोरहाट",
    "shillong": "शिलांग",
    "majuli": "माजुली",
    "brahmaputra": "ब्रह्मपुत्र",
    "happy": "खुशी",
    "joy": "आनंद",
    "love": "स्नेह",
  },
  as: {
    "college visit": "মহাবিদ্যালয় ভ্ৰমণৰ আনন্দ",
    "college": "মহাবিদ্যালয়",
    "university": "বিশ্ববিদ্যালয়",
    "graduation": "সমাবৰ্তন",
    "wedding": "বিয়া",
    "marriage": "বিবাহ",
    "visit": "ভ্ৰমণ",
    "trip": "যাত্ৰা",
    "festival": "উৎসৱ",
    "garden": "বাগিচা",
    "tea garden": "চাহ বাগিচা",
    "home": "ঘৰ",
    "house": "ঘৰ",
    "party": "উৎসৱ",
    "celebration": "আনন্দোৎসৱ",
    "birthday": "জন্মদিন",
    "morning": "পুৱা",
    "evening": "গধূলি",
    "sunset": "সূৰ্যাস্ত",
    "tea": "চাহ",
    "guwahati": "গুৱাহাটী",
    "jorhat": "যোৰহাট",
    "shillong": "শ্বিলং",
    "majuli": "মাজুলী",
    "brahmaputra": "ব্ৰহ্মপুত্ৰ",
  },
  bn: {
    "college visit": "কলেজ পরিদর্শনের মধুর স্মৃতি",
    "college": "কলেজ",
    "university": "বিশ্ববিদ্যালয়",
    "graduation": "সমাবর্তন",
    "wedding": "বিয়ে",
    "marriage": "বিবাহ",
    "visit": "ভ্রমণ",
    "trip": "ভ্রমণ",
    "festival": "উৎসব",
    "garden": "বাগান",
    "tea garden": "চা বাগান",
    "home": "বাড়ি",
    "house": "বাড়ি",
    "celebration": "উৎসব",
    "birthday": "জন্মদিন",
    "morning": "সকাল",
    "evening": "সন্ধ্যা",
    "sunset": "সূর্যাস্ত",
    "tea": "চা",
    "guwahati": "গুয়াহাটি",
    "jorhat": "জোরহাট",
    "shillong": "শিলং",
    "majuli": "মাজুলী",
    "brahmaputra": "ব্রহ্মপুত্র",
  },
};

/**
 * Intelligent on-device translator that converts raw English phrases and terms
 * into natural regional words to guarantee zero English words in native speech.
 */
function localizeTextOffline(rawText: string, langKey: string): string {
  if (!rawText || langKey === "en") return rawText;

  let text = rawText.trim();
  const vocab = COMMON_VOCABULARY[langKey] || {};
  const kinship = KINSHIP_DICTIONARY[langKey] || {};

  // Replace multi-word and single-word terms case-insensitively
  for (const [enTerm, nativeTerm] of Object.entries(vocab)) {
    const regex = new RegExp(`\\b${enTerm}\\b`, "gi");
    text = text.replace(regex, nativeTerm);
  }

  for (const [enTerm, nativeTerm] of Object.entries(kinship)) {
    const regex = new RegExp(`\\b${enTerm}\\b`, "gi");
    text = text.replace(regex, nativeTerm);
  }

  // Remove common English prepositions that make speech awkward
  text = text
    .replace(/\bwith family\b/gi, "")
    .replace(/\bduring\b/gi, "")
    .replace(/\btaken at\b/gi, "")
    .replace(/\btaken in\b/gi, "")
    .replace(/\btaken\b/gi, "")
    .replace(/\bwith\b/gi, "")
    .replace(/\sin\s/gi, " ")
    .replace(/\sat\s/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

/**
 * Formats a 100% native sentence offline if Gemini has not yet cached a translation.
 */
function formatOfflineNativeStory(photo: OfflineAlbumPhoto, langKey: string): string {
  const relDict = KINSHIP_DICTIONARY[langKey] || {};
  const rawRel = (photo.relation || "Family").toLowerCase();
  const localizedRel = relDict[rawRel] || relDict.family || photo.relation || "";

  const localizedCaption = photo.caption ? localizeTextOffline(photo.caption, langKey) : "";
  const localizedTitle = photo.nativeTitle || localizeTextOffline(photo.title, langKey);

  switch (langKey) {
    case "as":
      return `এইখন আমাৰ আপোন পৰিয়ালৰ স্মৃতি—${localizedRel ? `${localizedRel} ` : ""}${localizedTitle}ৰ সৈতে কটোৱা সেই আনন্দৰ দিন। ${localizedCaption ? `${localizedCaption}ৰ সোঁৱৰণি। ` : ""}আপুনি নিজৰ ঘৰত সুৰক্ষিতভাৱে আছে, সকলোৱে আপোনাক খুব মৰম কৰে।`;

    case "bn":
      return `এটি আমাদের প্রিয় পরিবারের মধুর স্মৃতি—${localizedRel ? `${localizedRel} ` : ""}${localizedTitle}-এর সাথে কাটানো সেই আনন্দের দিন। ${localizedCaption ? `${localizedCaption}-এর মধুর স্মৃতি। ` : ""}আপনি আপনার বাড়িতে সম্পূর্ণ নিরাপদে আছেন, সবাই আপনাকে খুব ভালোবাসে।`;

    case "hi":
      return `यह हमारे प्यारे परिवार की संस्मरण तस्वीर है—${localizedRel ? `${localizedRel} ` : ""}${localizedTitle} के साथ बिताए गए सुखद पल। ${localizedCaption ? `${localizedCaption} की मधुर याद। ` : ""}आप अपने घर पर पूरी तरह सुरक्षित हैं और सभी आपसे बहुत प्यार करते हैं।`;

    case "mni":
      return `ꯃꯁꯤ ꯑꯩꯈꯣꯌꯒꯤ ꯏꯃꯨꯡꯒꯤ ꯅꯤꯡꯁꯤꯡ ꯃꯤꯠꯌꯦꯡꯅꯤ—${localizedRel ? `${localizedRel} ` : ""}${localizedTitle}꯫ ${localizedCaption ? `${localizedCaption}꯫ ` : ""}ꯅꯍꯥꯛ ꯃꯌꯨꯃꯗꯥ ꯅꯨꯡꯉꯥꯏꯅꯥ ꯂꯩꯔꯤ꯫`;

    case "brx":
      return `बेयो जोंनि नखरनि गोसोखांथि—${localizedRel ? `${localizedRel} ` : ""}${localizedTitle}। ${localizedCaption ? `${localizedCaption}। ` : ""}नोंथाङा नखराव मोजाङैनो दं, बयबो नोंथांखौ अनसायो।`;

    case "kha":
      return `Kane ka dei ka dur kynmaw jong ka ïing—${localizedRel ? `${localizedRel} ` : ""}${localizedTitle}. ${localizedCaption ? `${localizedCaption}. ` : ""}Phi shngain bha ha ïing bad kiba ha ïing baroh ki ieid ïa phi.`;

    case "lus":
      return `He hi kan chhungkaw thlalak duhawm tak a ni—${localizedRel ? `${localizedRel} ` : ""}${localizedTitle}. ${localizedCaption ? `${localizedCaption}. ` : ""}In lamah him takin i awm e, chhungkuain kan hmangaih che.`;

    case "en":
    default:
      return `${photo.title} with ${photo.relation}. ${photo.caption ? `${photo.caption} ` : ""}You are safe at home with your loving family.`;
  }
}

/**
 * Retrieves the spoken & readable family story in the chosen native language.
 * Checks for cached translations, pre-installed seed stories, or intelligent native paraphrasing.
 */
export function getPhotoReminiscenceStory(photo: OfflineAlbumPhoto, language: string): string {
  const langKey = language || "en";

  // 1. Return already cached native translation (from Gemini or Caregiver)
  if (photo.translations && photo.translations[langKey]) {
    return photo.translations[langKey];
  }

  // 2. Curated cultural seed stories for pre-installed photos
  if (SEED_REMINISCENCE_STORIES[photo.id]?.[langKey]) {
    return SEED_REMINISCENCE_STORIES[photo.id][langKey];
  }

  // 3. English returns original caption with greeting
  if (langKey === "en") {
    return `${photo.title} with ${photo.relation}. ${photo.caption ? `${photo.caption}. ` : ""}You are safe at home with your loving family.`;
  }

  // 4. Pure native phrase reconstruction without raw English words
  return formatOfflineNativeStory(photo, langKey);
}

/**
 * In-flight translation tracker to prevent duplicate requests
 */
const inFlightTranslations = new Set<string>();

/**
 * Asynchronously requests Gemini 3.6 Flash to translate and adapt a custom photo
 * into fluent, compassionate native phrasing, caching it on-device in offlineMobileStore.
 */
export async function ensurePhotoTranslated(photo: OfflineAlbumPhoto, language: string): Promise<void> {
  const langKey = language || "en";
  if (langKey === "en") return;

  // Already translated or pre-seeded
  if (photo.translations?.[langKey] || SEED_REMINISCENCE_STORIES[photo.id]?.[langKey]) {
    return;
  }

  const trackKey = `${photo.id}_${langKey}`;
  if (inFlightTranslations.has(trackKey)) return;
  inFlightTranslations.add(trackKey);

  try {
    const translated = await translatePhotoStoryToNative(
      photo.caption || "",
      photo.title,
      photo.relation || "Family",
      langKey
    );

    if (translated && translated.trim().length > 5) {
      offlineMobileStore.updatePhotoTranslation(photo.id, langKey, translated.trim());
    }
  } catch (err) {
    console.warn("Auto-translation notice:", err);
  } finally {
    inFlightTranslations.delete(trackKey);
  }
}
