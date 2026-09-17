/**
 * Smriti-NER — Multilingual Family Reminiscence Stories
 * Culturally reverent, comforting stories in all 8 Northeast Indian languages
 * for photo reminiscing and cognitive orientation.
 */

import type { OfflineAlbumPhoto } from "./offlineMobileStorage";

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

/**
 * Retrieves or formats the spoken & readable family story in the chosen native language.
 */
export function getPhotoReminiscenceStory(photo: OfflineAlbumPhoto, language: string): string {
  const langKey = language || "en";

  // 1. Curated cultural seed stories for pre-installed photos
  if (SEED_REMINISCENCE_STORIES[photo.id]?.[langKey]) {
    return SEED_REMINISCENCE_STORIES[photo.id][langKey];
  }

  // 2. Custom caregiver photos: Generate culturally respectful native phrasing
  const title = (langKey !== "en" && photo.nativeTitle) ? photo.nativeTitle : photo.title;
  const relation = photo.relation || "Family";
  const caption = photo.caption ? photo.caption.trim() : "";

  switch (langKey) {
    case "as":
      return `এইখন আমাৰ পৰিয়ালৰ স্মৃতি—${title} (${relation})। ${caption ? `${caption}। ` : ""}আপুনি নিজৰ ঘৰত সুৰক্ষিতভাৱে আছে, পৰিয়ালে আপোনাক সদায় মৰম কৰে।`;

    case "bn":
      return `এটি আমাদের পরিবারের মধুর স্মৃতি—${title} (${relation})। ${caption ? `${caption}। ` : ""}আপনি আপনার বাড়িতে সম্পূর্ণ নিরাপদে আছেন, সবাই আপনাকে খুব ভালোবাসে।`;

    case "hi":
      return `यह हमारे प्यारे परिवार की संस्मरण तस्वीर है—${title} (${relation})। ${caption ? `${caption}। ` : ""}आप अपने घर पर पूरी तरह सुरक्षित और अपनों के बीच हैं।`;

    case "mni":
      return `ꯃꯁꯤ ꯑꯩꯈꯣꯌꯒꯤ ꯏꯃꯨꯡꯒꯤ ꯅꯤꯡꯁꯤꯡ ꯃꯤꯠꯌꯦꯡꯅꯤ—${title} (${relation})꯫ ${caption ? `${caption}꯫ ` : ""}ꯅꯍꯥꯛ ꯃꯌꯨꯃꯗꯥ ꯅꯨꯡꯉꯥꯏꯅꯥ ꯂꯩꯔꯤ꯫`;

    case "brx":
      return `बेयो जोंनि नखरनि गोसोखांथि—${title} (${relation})। ${caption ? `${caption}। ` : ""}नोंथाङा नखराव मोजाङैनो दं, बयबो नोंथांखौ अनसायो।`;

    case "kha":
      return `Kane ka dei ka dur kynmaw jong ka ïing—${title} (${relation}). ${caption ? `${caption}. ` : ""}Phi shngain bha ha ïing bad kiba ha ïing baroh ki ieid ïa phi.`;

    case "lus":
      return `He hi kan chhungkaw thlalak duhawm tak a ni—${title} (${relation}). ${caption ? `${caption}. ` : ""}In lamah him takin i awm e, chhungkuain kan hmangaih che.`;

    case "en":
    default:
      return `${photo.title} with ${photo.relation}. ${caption ? `${caption} ` : ""}You are safe at home with your loving family.`;
  }
}
