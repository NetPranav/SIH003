// ── SMRITI-NER 8-LANGUAGE GERIATRIC PHRASE DICTIONARY & DIALECT MATRIX ───────
// Sub-Phase 1.3 Deliverable: Clinical, compassionate phrases mapped across all 8 NER official languages

export interface PhraseTranslation {
  nativeScript: string;
  romanizedPhonetic: string;
}

export interface GeriatricPhrase {
  id: string;
  category: "greeting" | "comfort" | "medication" | "hydration" | "memory" | "evening" | "family";
  englishMeaning: string;
  translations: {
    as: PhraseTranslation;  // Assamese
    mni: PhraseTranslation; // Meitei
    bn: PhraseTranslation;  // Bengali
    brx: PhraseTranslation; // Bodo
    kha: PhraseTranslation; // Khasi
    lus: PhraseTranslation; // Mizo
    hi: PhraseTranslation;  // Hindi
    en: PhraseTranslation;  // English
  };
}

export const GERIATRIC_PHRASE_DICTIONARY: GeriatricPhrase[] = [
  {
    id: "p1_greeting",
    category: "greeting",
    englishMeaning: "Good morning! How are you feeling today?",
    translations: {
      as: { nativeScript: "নমস্কাৰ! আজি আপোনাৰ গাটো কেনে লাগিছে?", romanizedPhonetic: "Nomoskar! Aji aponar gato kene lagise?" },
      mni: { nativeScript: "ꯈꯨꯔꯨꯝꯖꯔꯤ! ꯉꯁꯤ ꯑꯗꯣꯝ ꯀꯔꯝꯅꯥ ꯇꯧꯔꯤ?", romanizedPhonetic: "Khurumjari! Ngasi adom karamna touri?" },
      bn: { nativeScript: "শুভ সকাল! আজ আপনার শরীর কেমন আছে?", romanizedPhonetic: "Shubho shokal! Aaj aponar shorir kemon ache?" },
      brx: { nativeScript: "गोजोन फुं! दिनै नोंथांनि देहाया माबोरै?", romanizedPhonetic: "Gojon fung! Dinwi nowngthangni dehaya maborwi?" },
      kha: { nativeScript: "Khublei step! Kumno phi sngew mynta ka sngi?", romanizedPhonetic: "Khublei step! Kumno phi sngew mynta ka sngi?" },
      lus: { nativeScript: "Chibai zing lam! Vawiin chu i inngaih dan eng nge?", romanizedPhonetic: "Chibai zing lam! Vawiin chu i inngaih dan eng nge?" },
      hi: { nativeScript: "सुप्रभात! आज आपका स्वास्थ्य कैसा लग रहा है?", romanizedPhonetic: "Suprabhat! Aaj aapka swasthya kaisa lag raha hai?" },
      en: { nativeScript: "Good morning! How are you feeling today?", romanizedPhonetic: "Good morning! How are you feeling today?" },
    },
  },
  {
    id: "p2_safe_at_home",
    category: "comfort",
    englishMeaning: "You are safe and warm at home with your family.",
    translations: {
      as: { nativeScript: "আপুনি নিজৰ ঘৰতেই সপৰিয়ালে সুৰক্ষিত আৰু শান্তিত আছে।", romanizedPhonetic: "Apuni nijor ghortei soporiyale surokkhit aru shantit ase." },
      mni: { nativeScript: "ꯑꯗꯣꯝ ꯏꯃꯨꯡ ꯃꯅꯨꯡꯒꯥ ꯂꯣꯌꯅꯅꯥ ꯌꯨꯃꯗꯥ ꯏꯉꯥꯎ ꯉꯥꯎꯅꯥ ꯂꯩꯔꯤ।", romanizedPhonetic: "Adom imung manungga loynana yumda ingao ngaona leiri." },
      bn: { nativeScript: "আপনি পরিবারের সাথে নিজের ঘরেই সম্পূর্ণ নিরাপদে আছেন।", romanizedPhonetic: "Apni poribarer shathe nijer ghorei shompurno nirapode achen." },
      brx: { nativeScript: "नोंथाङा नख'रजों लोगोसे न'आवनो रैखाथि जानानै दं।", romanizedPhonetic: "Nowngthanga nokhorjong logose nowaowno rowikhathi jananwi dong." },
      kha: { nativeScript: "Phi shngain bha ha la iing ryngkat bad ka kur ka jait.", romanizedPhonetic: "Phi shngain bha ha la iing ryngkat bad ka kur ka jait." },
      lus: { nativeScript: "I chhungte nen in inah him takin in awm e.", romanizedPhonetic: "I chhungte nen in inah him takin in awm e." },
      hi: { nativeScript: "आप अपने परिवार के साथ घर पर बिल्कुल सुरक्षित और शांत हैं।", romanizedPhonetic: "Aap apne parivar ke saath ghar par bilkul surakshit aur shant hain." },
      en: { nativeScript: "You are safe and warm at home with your family.", romanizedPhonetic: "You are safe and warm at home with your family." },
    },
  },
  {
    id: "p3_medicine",
    category: "medication",
    englishMeaning: "It is time to take your medicine with warm water.",
    translations: {
      as: { nativeScript: "দেউতা, এতিয়া কুহুমীয়া পানীৰে ঔষধখিনি খোৱাৰ সময় হ’ল।", romanizedPhonetic: "Deuta, etiya kuhumiya panire ouxodhkhini khowar xomoy hol." },
      mni: { nativeScript: "ꯏꯄꯨ, ꯍꯤꯗꯥꯛ ꯑꯁꯨꯝ ꯏꯁꯤꯡꯒꯥ ꯆꯥꯕꯒꯤ ꯃꯇꯝ ꯑꯣꯏꯔꯦ।", romanizedPhonetic: "Epu, hidak asum eesingga chabagi matam oire." },
      bn: { nativeScript: "বাবা, এখন ঈষদুষ্ণ জল দিয়ে ওষুধ খাওয়ার সময় হয়েছে।", romanizedPhonetic: "Baba, ekhon eeshodushno jol diye oshudh khaowar shomoy hoyeche." },
      brx: { nativeScript: "दवाइखौ दुंहाब दैजों लोंनो सम जाबाय।", romanizedPhonetic: "Dawaikhow dunghab dwijong longno som jabay." },
      kha: { nativeScript: "Ka la dei ka por ban dih dawai bad ka um ba syaid.", romanizedPhonetic: "Ka la dei ka por ban dih dawai bad ka um ba syaid." },
      lus: { nativeScript: "Tui lum nena damdawi ei a hun ta e.", romanizedPhonetic: "Tui lum nena damdawi ei a hun ta e." },
      hi: { nativeScript: "दवा को गुनगुने पानी के साथ लेने का समय हो गया है।", romanizedPhonetic: "Dawa ko gungune paani ke saath lene ka samay ho gaya hai." },
      en: { nativeScript: "It is time to take your medicine with warm water.", romanizedPhonetic: "It is time to take your medicine with warm water." },
    },
  },
  {
    id: "p4_hydration",
    category: "hydration",
    englishMeaning: "Please have a refreshing glass of water.",
    translations: {
      as: { nativeScript: "অনুগ্ৰহ কৰি এগিলাচ পানী খাই লওক।", romanizedPhonetic: "Anugroh kori egilas pani khai lowk." },
      mni: { nativeScript: "ꯆꯥꯅꯕꯤꯗꯨꯅꯥ ꯏꯁꯤꯡ ꯒ꯭ꯂꯥꯁ ꯑꯃꯥ ꯊꯛꯄꯤꯌꯨ।", romanizedPhonetic: "Chanabiduna eesing glass ama thakpiyu." },
      bn: { nativeScript: "দয়া করে এক গ্লাস জল খেয়ে নিন।", romanizedPhonetic: "Doya kore ek glass jol kheye nin." },
      brx: { nativeScript: "অনनानै गंसे ग्लाश दै लोंना ला।", romanizedPhonetic: "Onnanwi gongse glass dwi longna la." },
      kha: { nativeScript: "Sngewbha dih shi klat ka um.", romanizedPhonetic: "Sngewbha dih shi klat ka um." },
      lus: { nativeScript: "Khawngaihin tui no khat in rawh le.", romanizedPhonetic: "Khawngaihin tui no khat in rawh le." },
      hi: { nativeScript: "कृपया एक गिलास ताजा पानी पी लीजिए।", romanizedPhonetic: "Kripya ek glass taaza paani pee lijiye." },
      en: { nativeScript: "Please have a refreshing glass of water.", romanizedPhonetic: "Please have a refreshing glass of water." },
    },
  },
  {
    id: "p5_memory_praise",
    category: "memory",
    englishMeaning: "Wonderful! Your memory is staying sharp and strong.",
    translations: {
      as: { nativeScript: "খুবেই সুন্দৰ! আপোনাৰ মনত ৰখাৰ ক্ষমতা খুবেই উজ্জ্বল।", romanizedPhonetic: "Khubei sundor! Aponar monot rokhar khomota khubei ujjwol." },
      mni: { nativeScript: "ꯌꯥꯝꯅꯥ ꯐꯖꯔꯦ! ꯑꯗꯣꯃꯒꯤ ꯅꯤꯡꯁꯤꯡ ꯊꯧꯅꯥ ꯌꯥꯝꯅꯥ ꯀꯟꯅꯥ ꯂꯩꯔꯤ।", romanizedPhonetic: "Yamna fajare! Adomgi ningshing thouna yamna kanna leiri." },
      bn: { nativeScript: "অসাধারণ! আপনার স্মৃতিশক্তি খুবই সতেজ ও প্রখর রয়েছে।", romanizedPhonetic: "Oshadharon! Aponar smritishokti khubee shotej o prokhor royeche." },
      brx: { nativeScript: "जोबोर मोजां! नोंथांनि गोसोखांनाय बोलोआ गोख्रों दं।", romanizedPhonetic: "Jobor mojang! Nowngthangni gosokhangnay boloa gokhrong dong." },
      kha: { nativeScript: "Bha shibun! Ka jingkynmaw jong phi ka dang shai bha.", romanizedPhonetic: "Bha shibun! Ka jingkynmaw jong phi ka dang shai bha." },
      lus: { nativeScript: "A va tha em! I hriatna chu a la chak tha hle mai.", romanizedPhonetic: "A va tha em! I hriatna chu a la chak tha hle mai." },
      hi: { nativeScript: "बहुत खूब! आपकी याददाश्त बहुत तेज और मजबूत है।", romanizedPhonetic: "Bahut khoob! Aapki yaaddasht bahut tez aur mazboot hai." },
      en: { nativeScript: "Wonderful! Your memory is staying sharp and strong.", romanizedPhonetic: "Wonderful! Your memory is staying sharp and strong." },
    },
  },
  {
    id: "p6_calming",
    category: "comfort",
    englishMeaning: "No hurry at all. Take your time, everything is peaceful.",
    translations: {
      as: { nativeScript: "কোনো খৰখেদা নাই। লাহে-ধীৰে কৰক, সকলো শান্তিময় হৈ আছে।", romanizedPhonetic: "Kono khorkheda nai. Lahe-dhire korok, xokolo xantimoy hoi ase." },
      mni: { nativeScript: "ꯊꯨꯅꯥ ꯌꯥꯡꯅꯥ ꯇꯧꯕꯒꯤ ꯃꯊꯧ ꯇꯥꯗꯦ। ꯇꯞꯅꯥ ꯇꯧꯕꯤꯌꯨ, ꯄꯨꯝꯅꯃꯛ ꯁꯥꯟꯇꯤ ꯑꯣꯏꯔꯤ।", romanizedPhonetic: "Thuna yangna toubagi mathou tade. Tapna toubiyu, pumnamak shanti oiri." },
      bn: { nativeScript: "কোনো তাড়াহুড়ো নেই। ধীরে ধীরে করুন, সবকিছু শান্ত ও সুন্দর আছে।", romanizedPhonetic: "Kono tarahuro nei. Dhire dhire korun, shobkichu shanto o shundor ache." },
      brx: { nativeScript: "जेबो गोख्रोंथि गैया। लासै लासै खालाम, गासैबो शान्ति दं।", romanizedPhonetic: "Jebo gokhrongthi goyia. Laswi laswi khalam, gaswibo shanti dong." },
      kha: { nativeScript: "Ym donkam ban kyrkieh. Leh suki suki, kiei kiei baroh ki suk.", romanizedPhonetic: "Ym donkam ban kyrkieh. Leh suki suki, kiei kiei baroh ki suk." },
      lus: { nativeScript: "Hmanhmawh a ngai lo ve. Muangchangin ti rawh, engkim a tha e.", romanizedPhonetic: "Hmanhmawh a ngai lo ve. Muangchangin ti rawh, engkim a tha e." },
      hi: { nativeScript: "कोई जल्दी नहीं है। आराम से कीजिए, सब कुछ बहुत शांत है।", romanizedPhonetic: "Koi jaldi nahi hai. Aaram se kijiye, sab kuch bahut shant hai." },
      en: { nativeScript: "No hurry at all. Take your time, everything is peaceful.", romanizedPhonetic: "No hurry at all. Take your time, everything is peaceful." },
    },
  },
  {
    id: "p7_evening",
    category: "evening",
    englishMeaning: "The sun is setting peacefully. Let us rest and listen to soft music.",
    translations: {
      as: { nativeScript: "বেলি লহিওৱাৰ শান্ত সন্ধিয়া। আহক, অলপ জিৰণি লৈ বাঁহীৰ সুৰ শুনো।", romanizedPhonetic: "Beli lohiowar xanto xondhiya. Aahok, olop jironi loi bahir xur xuno." },
      mni: { nativeScript: "ꯅꯨꯃꯤꯠ ꯇꯥꯔꯦ। ꯄꯣꯊꯥꯔꯁꯤ ꯑꯃꯁꯨꯡ ꯇꯞꯅꯥ ꯈꯣꯟꯖꯦꯜ ꯇꯥꯔꯁꯤ।", romanizedPhonetic: "Numit tare. Potharasi amasung tapna khonjel tarasi." },
      bn: { nativeScript: "শান্ত সুন্দর সন্ধে নেমেছে। আসুন, একটু বিশ্রাম নিয়ে বাঁশির সুর শুনি।", romanizedPhonetic: "Shanto shundor shondhe nemeche. Aashun, ektu bishram niye bashir shur shuni." },
      brx: { nativeScript: "सान हाबबाय। फै, इसे जिरायनानै बांहि सुर खनासंनो।", romanizedPhonetic: "San habbay. Fwi, ise jiraynanwi banhi sur khonasongno." },
      kha: { nativeScript: "Ka sngi ka la sep suk. To ngin shong thait bad sngap jingrwai.", romanizedPhonetic: "Ka sngi ka la sep suk. To ngin shong thait bad sngap jingrwai." },
      lus: { nativeScript: "Ni a tla fel ta. Chawl hahdam ila, rimawi ngaihmthlak i ngaithla ang u.", romanizedPhonetic: "Ni a tla fel ta. Chawl hahdam ila, rimawi ngaihmthlak i ngaithla ang u." },
      hi: { nativeScript: "शाम ढल चुकी है। आइए, थोड़ा विश्राम करें और बांसुरी की मधुर धुन सुनें।", romanizedPhonetic: "Shaam dhal chuki hai. Aaiye, thoda vishram karein aur bansuri ki madhur dhun sunein." },
      en: { nativeScript: "The sun is setting peacefully. Let us rest and listen to soft music.", romanizedPhonetic: "The sun is setting peacefully. Let us rest and listen to soft music." },
    },
  },
];
