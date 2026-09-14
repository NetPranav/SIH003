// ── SMRITI-NER CENTRALIZED SCREEN LOCALIZATIONS ─────────────────
// Ensures the selected language is consistently displayed everywhere across screens
// with English as secondary/side language, eliminating hardcoded Assamese leaks.

export interface GameItemLocale {
  native: string;
  name: string;
  desc: string;
}

export interface GamesScreenLocale {
  headerTitle: string;
  headerSubtitle: string;
  dhol: GameItemLocale;
  kaziranga: GameItemLocale;
  loom: GameItemLocale;
  haat: GameItemLocale;
}

export const GAMES_SCREEN_LOCALES: Record<string, GamesScreenLocale> = {
  as: {
    headerTitle: "জ্ঞান উদ্দীপক খেল",
    headerSubtitle: "Cognitive Games • Brain Exercises",
    dhol: {
      native: "ঢোল-পেঁপা সুৰ-মিলন",
      name: "Dhol-Pepa Sur-Milon",
      desc: "পৰম্পৰাগত বাদ্যৰ তাল শুনক আৰু পুনৰাবৃত্তি কৰক।"
    },
    kaziranga: {
      native: "কাজিৰঙা চাফাৰী",
      name: "Kaziranga Safari",
      desc: "উত্তৰ-পূবৰ বন্যপ্ৰাণী চিনি উলিয়াওক আৰু মিল কৰক।"
    },
    loom: {
      native: "তাঁত শালৰ ছন্দ",
      name: "Weaver's Loom",
      desc: "মুগা আৰু গামোচাৰ পৰম্পৰাগত নক্সা সাজক।"
    },
    haat: {
      native: "দৈনিক বজাৰ স্মৃতি",
      name: "Daily Haat Memory",
      desc: "সোৱাদপূৰ্ণ ব্যঞ্জনৰ বাবে থলুৱা উপকৰণ মনত ৰাখক।"
    }
  },
  bn: {
    headerTitle: "জ্ঞানচর্চার খেলা",
    headerSubtitle: "Cognitive Games • Brain Exercises",
    dhol: {
      native: "ঢোল-বাঁশি সুর-মিলন",
      name: "Dhol-Pepa Sur-Milon",
      desc: "ঐতিহ্যবাহী লোক বাদ্যযন্ত্রের ছন্দ শুনুন এবং পুনরাবৃত্তি করুন।"
    },
    kaziranga: {
      native: "কাজিরাঙ্গা সাফারি",
      name: "Kaziranga Safari",
      desc: "উত্তর-পূর্ব ভারতের বন্যপ্রাণী চিনে সঠিক নাম মিলিয়ে নিন।"
    },
    loom: {
      native: "তাঁতের নকশা ও ছন্দ",
      name: "Weaver's Loom",
      desc: "ঐতিহ্যবাহী মুগা রেশম ও গামোছার সুন্দর নকশা বুনুন।"
    },
    haat: {
      native: "দৈনিক বাজারের স্মৃতি",
      name: "Daily Haat Memory",
      desc: "সুস্বাদু খাবারের জন্য স্থানীয় বাজারের উপকরণ মনে রাখুন।"
    }
  },
  hi: {
    headerTitle: "संज्ञानात्मक खेल",
    headerSubtitle: "Cognitive Games • Brain Exercises",
    dhol: {
      native: "ढोल-बांसुरी सुर-मिलन",
      name: "Dhol-Pepa Sur-Milon",
      desc: "पारंपरिक लोक वाद्यों की मधुर ताल सुनें और दोहराएं।"
    },
    kaziranga: {
      native: "काजीरंगा वन्यजीव सफारी",
      name: "Kaziranga Safari",
      desc: "पूर्वोत्तर के दुर्लभ वन्यजीवों को पहचानें और नाम मिलाएं।"
    },
    loom: {
      native: "करघा बुनाई पैटर्न",
      name: "Weaver's Loom",
      desc: "पारंपरिक मूंगा रेशम और गमोसा के वस्त्र पैटर्न बनाएं।"
    },
    haat: {
      native: "दैनिक हाट बाजार",
      name: "Daily Haat Memory",
      desc: "स्वादिष्ट स्थानीय व्यंजनों की ताज़ा सामग्री याद रखें।"
    }
  },
  mni: {
    headerTitle: "ꯋꯥꯈꯜ ꯆꯦꯠꯁꯤꯂꯍꯟꯅꯕꯥ ꯁꯥꯟꯅꯄꯣꯠ",
    headerSubtitle: "Cognitive Games • Brain Exercises",
    dhol: {
      native: "ꯄꯨꯡ-ꯄꯦꯅꯥ ꯁꯨꯔ-ꯃꯤꯂꯣꯟ",
      name: "Pung-Pena Rhythm",
      desc: "ꯑꯔꯤꯕꯥ ꯈꯣꯟꯊꯣꯛ ꯇꯥꯕꯤꯌꯨ ꯑꯃꯁꯨꯡ ꯁꯥꯟꯅꯕꯤꯌꯨ꯫"
    },
    kaziranga: {
      native: "ꯀꯥꯖꯤꯔꯉ꯭ꯒꯥ ꯁꯥꯐꯥꯔꯤ",
      name: "Kaziranga Safari",
      desc: "ꯑꯋꯥꯡ-ꯅꯣꯡꯄꯣꯛꯀꯤ ꯁꯥ-ꯁꯟꯁꯤꯡ ꯈꯪꯗꯣꯛꯎ꯫"
    },
    loom: {
      native: "ꯌꯣꯡꯈꯝ ꯁꯥꯕꯥ ꯄꯦꯇꯔꯟ",
      name: "Weaver's Loom",
      desc: "ꯐꯤꯔꯣꯜ ꯁꯥꯕꯒꯤ ꯃꯑꯣꯡ-ꯃꯇꯧ ꯁꯦꯃꯒꯠꯄꯥ꯫"
    },
    haat: {
      native: "ꯀꯩꯊꯦꯜ ꯅꯤꯡꯁꯤꯡꯕꯥ",
      name: "Daily Haat Memory",
      desc: "ꯆꯥꯅꯕꯥ ꯄꯣꯠꯂꯃꯁꯤꯡ ꯅꯤꯡꯁꯤꯡꯗꯨꯅꯥ ꯂꯧꯕꯤꯌꯨ꯫"
    }
  },
  brx: {
    headerTitle: "मेमोरि गेलेनाय",
    headerSubtitle: "Cognitive Games • Brain Exercises",
    dhol: {
      native: "दामफ्ला-सिफुं सुर-मिलन",
      name: "Folk Rhythm",
      desc: "दावराव खोनासं आरो गेले।"
    },
    kaziranga: {
      native: "काजिरंगा साफारि",
      name: "Kaziranga Safari",
      desc: "सा-सान्जा हादोरनि जिब-जुनाफोर नागिर।"
    },
    loom: {
      native: "दाम्रा बानाइ नखसा",
      name: "Weaver's Loom",
      desc: "गोजाम नखसा बानाइ।"
    },
    haat: {
      native: "सानफ्रोमनि हाट गोसोखां",
      name: "Daily Haat Memory",
      desc: "जाग्रा मुवाफोर गोसोखां।"
    }
  },
  kha: {
    headerTitle: "Ki Jingïalehkai Jingmut",
    headerSubtitle: "Cognitive Games • Brain Exercises",
    dhol: {
      native: "Ka Ksing bad Besli",
      name: "Folk Rhythm",
      desc: "Sngap ïa ki sur bad pynphai pat."
    },
    kaziranga: {
      native: "Ka Kaziranga Safari",
      name: "Kaziranga Safari",
      desc: "Shem ïa ki mrad khlaw jong ka Dong Shatei-Lam Mihngi."
    },
    loom: {
      native: "Ka Jingthain Jain",
      name: "Weaver's Loom",
      desc: "Thain ïa ki dur jain tynrai."
    },
    haat: {
      native: "Ka Iew Jingkynmaw",
      name: "Daily Haat Memory",
      desc: "Kynmaw ïa ki jingbam ban shet."
    }
  },
  lus: {
    headerTitle: "Thluak Sawizawina Game",
    headerSubtitle: "Cognitive Games • Brain Exercises",
    dhol: {
      native: "Khuang leh Hla Zai",
      name: "Folk Rhythm",
      desc: "Hla thluk ngaithla la zui rawh."
    },
    kaziranga: {
      native: "Kaziranga Rannung Enna",
      name: "Kaziranga Safari",
      desc: "Hmarchhak rannungte zawng chhuak rawh."
    },
    loom: {
      native: "Puan Zai Zirna",
      name: "Weaver's Loom",
      desc: "Puan them mawi tak tah rawh."
    },
    haat: {
      native: "Bazar Hriatrengna",
      name: "Daily Haat Memory",
      desc: "Bazar mamawh vawng tlat rawh."
    }
  },
  en: {
    headerTitle: "Cognitive Games",
    headerSubtitle: "Traditional North-East Brain Exercises",
    dhol: {
      native: "Folk Rhythm Recall",
      name: "Dhol-Pepa Sur-Milon",
      desc: "Listen to traditional folk instruments and repeat the melodious pattern."
    },
    kaziranga: {
      native: "Wildlife Safari Search",
      name: "Kaziranga Safari",
      desc: "Spot indigenous North-East wildlife and match traditional animal names."
    },
    loom: {
      native: "Weaver's Loom Pattern",
      name: "Weaver's Loom",
      desc: "Recreate timeless Muga silk and indigenous textile patterns."
    },
    haat: {
      native: "Daily Market Memory",
      name: "Daily Haat Memory",
      desc: "Remember authentic local ingredients to prepare beloved recipes."
    }
  }
};

// ── REMINDERS SCREEN LOCALES ──────────────────────────────────
export interface RemindersScreenLocale {
  headerTitle: string;
  headerSubtitle: string;
  familyVoiceBadge: string;
  voiceEngineTitle: string;
  voiceEngineDesc: string;
  testAlertBtn: string;
  morningMedTitle: string;
  hydrationTitle: string;
  afternoonMedTitle: string;
  eveningMedTitle: string;
}

export const REMINDERS_SCREEN_LOCALES: Record<string, RemindersScreenLocale> = {
  as: {
    headerTitle: "দৰব আৰু পানী সোঁৱৰণী",
    headerSubtitle: "Daily Reminders • Routine",
    familyVoiceBadge: "পৰিয়ালৰ কণ্ঠ সংমিশ্ৰণ",
    voiceEngineTitle: "চিনাকি পৰিয়ালৰ কণ্ঠ প্ৰণালী",
    voiceEngineDesc: "সকলো ঔষধৰ সোঁৱৰণী আপোনাৰ নাতিনী প্ৰিয়াৰ চিনাকি কণ্ঠত অসমীয়াত বাজে।",
    testAlertBtn: "সতৰ্কবাৰ্তা পৰীক্ষা কৰক",
    morningMedTitle: "পুৱাৰ ঔষধ • Morning Medicine",
    hydrationTitle: "পানী খোৱা • Water Hydration",
    afternoonMedTitle: "দুপৰীয়াৰ ঔষধ • Afternoon Medicine",
    eveningMedTitle: "গধূলিৰ ঔষধ • Evening Medicine"
  },
  bn: {
    headerTitle: "ওষুধ ও জল রিমাইন্ডার",
    headerSubtitle: "Daily Reminders • Routine",
    familyVoiceBadge: "পারিবারিক কণ্ঠ সংযোগ",
    voiceEngineTitle: "পরিচিত পারিবারিক ভয়েস ইঞ্জিন",
    voiceEngineDesc: "সমস্ত ওষুধের রিমাইন্ডার আপনার নাতনি প্রিয়ার পরিচিত মিষ্টি কণ্ঠে বাংলায় বাজে।",
    testAlertBtn: "অ্যালার্ট পরীক্ষা করুন",
    morningMedTitle: "সকালের ওষুধ • Morning Medicine",
    hydrationTitle: "জল খাওয়া • Water Hydration",
    afternoonMedTitle: "দুপুরের ওষুধ • Afternoon Medicine",
    eveningMedTitle: "সন্ধ্যার ওষুধ • Evening Medicine"
  },
  hi: {
    headerTitle: "दवा और पानी रिमाइंडर",
    headerSubtitle: "Daily Reminders • Routine",
    familyVoiceBadge: "पारिवारिक ध्वनि सिंक",
    voiceEngineTitle: "परिचित पारिवारिक ध्वनि प्रणाली",
    voiceEngineDesc: "सभी दवा और पानी के स्मरण आपकी पोती प्रिया की परिचित आवाज में बोले जाते हैं।",
    testAlertBtn: "अलर्ट टेस्ट करें",
    morningMedTitle: "सुबह की दवा • Morning Medicine",
    hydrationTitle: "पानी पिएं • Water Hydration",
    afternoonMedTitle: "दोपहर की दवा • Afternoon Medicine",
    eveningMedTitle: "शाम की दवा • Evening Medicine"
  },
  mni: {
    headerTitle: "ꯍꯤꯗꯥꯛ ꯑꯃꯁꯨꯡ ꯏꯁꯤꯡ ꯅꯤꯡꯁꯤꯡꯕꯥ",
    headerSubtitle: "Daily Reminders • Routine",
    familyVoiceBadge: "ꯏꯃꯨꯡꯒꯤ ꯈꯣꯟꯊꯣꯛ",
    voiceEngineTitle: "ꯏꯃꯨꯡꯒꯤ ꯈꯣꯟꯊꯣꯛ ꯊꯧꯔꯥꯡ",
    voiceEngineDesc: "ꯍꯤꯗꯥꯛ ꯆꯥꯕꯒꯤ ꯄꯥꯎꯇꯥꯛ ꯄ꯭ꯔꯤꯌꯥꯒꯤ ꯈꯣꯟꯊꯣꯛꯇꯥ ꯇꯥꯍꯜꯂꯤ꯫",
    testAlertBtn: "ꯇꯦꯁ꯭ꯠ ꯇꯧꯕꯤꯌꯨ",
    morningMedTitle: "ꯑꯌꯨꯛꯀꯤ ꯍꯤꯗꯥꯛ • Morning Medicine",
    hydrationTitle: "ꯏꯁꯤꯡ ꯊꯛꯄꯥ • Water Hydration",
    afternoonMedTitle: "ꯅꯨꯃꯤꯗꯥꯡꯋꯥꯏꯒꯤ ꯍꯤꯗꯥꯛ • Afternoon Medicine",
    eveningMedTitle: "ꯅꯨꯃꯤꯗꯥꯡꯒꯤ ꯍꯤꯗꯥꯛ • Evening Medicine"
  },
  brx: {
    headerTitle: "मुली आरो दै गोसोखां",
    headerSubtitle: "Daily Reminders • Routine",
    familyVoiceBadge: "नखरनि गारां",
    voiceEngineTitle: "नखरनि गारां इन्जिन",
    voiceEngineDesc: "गासैबो मुलिनि गोसोखां होनाया नखरनि गारांआव बुं जायो।",
    testAlertBtn: "नायबिजिर",
    morningMedTitle: "फुंनि मुली • Morning Medicine",
    hydrationTitle: "दै लोंनाय • Water Hydration",
    afternoonMedTitle: "सानजुफुनि मुली • Afternoon Medicine",
    eveningMedTitle: "बेलासिनि मुली • Evening Medicine"
  },
  kha: {
    headerTitle: "Dawai bad Um Jingkynmaw",
    headerSubtitle: "Daily Reminders • Routine",
    familyVoiceBadge: "Sur Kiba Ha Iing",
    voiceEngineTitle: "Ka Sur Kiba Ha Iing",
    voiceEngineDesc: "Ki jingpyntip dawai baroh la kren da ka sur jong i ksew.",
    testAlertBtn: "Pyrshang",
    morningMedTitle: "Dawai Step • Morning Medicine",
    hydrationTitle: "Dih Um • Water Hydration",
    afternoonMedTitle: "Dawai Kmie Sngi • Afternoon Medicine",
    eveningMedTitle: "Dawai Janmiet • Evening Medicine"
  },
  lus: {
    headerTitle: "Damdawi leh Tui Hriattirna",
    headerSubtitle: "Daily Reminders • Routine",
    familyVoiceBadge: "Chhungkaw Aw",
    voiceEngineTitle: "Chhungkaw Aw Hriattirna",
    voiceEngineDesc: "Damdawi ei hun zawng zawng chhungte aw ngeiin a hriattir ang.",
    testAlertBtn: "Chhin Chhin Rawh",
    morningMedTitle: "Zing Damdawi • Morning Medicine",
    hydrationTitle: "Tui In Rawh • Water Hydration",
    afternoonMedTitle: "Chhun Damdawi • Afternoon Medicine",
    eveningMedTitle: "Zan Damdawi • Evening Medicine"
  },
  en: {
    headerTitle: "Daily Reminders",
    headerSubtitle: "Hydration & Medication Routine",
    familyVoiceBadge: "Family Voice Sync",
    voiceEngineTitle: "Familiar Family Voice Engine",
    voiceEngineDesc: "All medicine reminders speak in your granddaughter Priya’s reassuring voice.",
    testAlertBtn: "Test Full Alert",
    morningMedTitle: "Morning Medicine",
    hydrationTitle: "Hydration & Water",
    afternoonMedTitle: "Afternoon Medicine",
    eveningMedTitle: "Evening Medicine"
  }
};

// ── ALBUM SCREEN LOCALES ──────────────────────────────────────
export interface AlbumPhotoLocale {
  native: string;
  relation: string;
}

export interface AlbumScreenLocale {
  headerTitle: string;
  headerSubtitle: string;
  reminiscenceBadge: string;
  playingAudioText: string;
  listenBtn: string;
  photos: {
    bihu: AlbumPhotoLocale;
    graduation: AlbumPhotoLocale;
    majuli: AlbumPhotoLocale;
  };
}

export const ALBUM_SCREEN_LOCALES: Record<string, AlbumScreenLocale> = {
  as: {
    headerTitle: "স্মৃতিৰ এলবাম",
    headerSubtitle: "Memory Album • Life Review",
    reminiscenceBadge: "স্মৃতিচাৰণ থেৰাপী",
    playingAudioText: "🔊 পৰিয়ালৰ কণ্ঠৰে পুৰণি স্মৃতিৰ অডিঅ' বাজি আছে...",
    listenBtn: "পৰিয়ালৰ স্মৃতি শুনক",
    photos: {
      bihu: { native: "যোৰহাটৰ ৰঙালী বিহু", relation: "পৰিয়ালৰ উৎসৱ" },
      graduation: { native: "প্ৰিয়াৰ সমাৱৰ্তন", relation: "নাতিনী" },
      majuli: { native: "মাজুলীৰ ফেৰী ঘাট", relation: "নৈৰ যাত্ৰা" }
    }
  },
  bn: {
    headerTitle: "স্মৃতির অ্যালবাম",
    headerSubtitle: "Memory Album • Life Review",
    reminiscenceBadge: "স্মৃতিচারণ থেরাপি",
    playingAudioText: "🔊 পরিবারের মিষ্টি কণ্ঠে পুরানো স্মৃতির অডিও বাজছে...",
    listenBtn: "পারিবারিক স্মৃতি শুনুন",
    photos: {
      bihu: { native: "বসন্ত উৎসব ও বিহু মেলা", relation: "পারিবারিক উৎসব" },
      graduation: { native: "প্রিয়ার সমাবর্তন উৎসব", relation: "নাতনি" },
      majuli: { native: "মাজুলী দ্বীপের নদী পারাপার", relation: "নদী যাত্রা" }
    }
  },
  hi: {
    headerTitle: "स्मृति एल्बम",
    headerSubtitle: "Memory Album • Life Review",
    reminiscenceBadge: "स्मृति संस्मरण थेरेपी",
    playingAudioText: "🔊 परिवार की आवाज में पुरानी यादें सुनाई जा रही हैं...",
    listenBtn: "पारिवारिक संस्मरण सुनें",
    photos: {
      bihu: { native: "पारिवारिक बिहू व वसंत उत्सव", relation: "पारिवारिक पर्व" },
      graduation: { native: "प्रिया का दीक्षांत समारोह", relation: "पोती" },
      majuli: { native: "माजुली ब्रह्मपुत्र नौका यात्रा", relation: "नदी यात्रा" }
    }
  },
  mni: {
    headerTitle: "ꯅꯤꯡꯁꯤꯡ ꯑꯦꂢꯕꯝ",
    headerSubtitle: "Memory Album • Life Review",
    reminiscenceBadge: "ꯅꯤꯡꯁꯤꯡ ꯂꯥꯌꯦꯡ",
    playingAudioText: "🔊 ꯏꯃꯨꯡꯒꯤ ꯈꯣꯟꯊꯣꯛꯇꯥ ꯅꯤꯡꯁꯤꯡ ꯋꯥꯔꯤ ꯇꯥꯔꯤ...",
    listenBtn: "ꯏꯃꯨꯡꯒꯤ ꯋꯥꯔꯤ ꯇꯥꯕꯤꯌꯨ",
    photos: {
      bihu: { native: "ꯏꯃꯨꯡꯒꯤ ꯀꯨꯃꯍꯩ", relation: "ꯏꯃꯨꯡ ꯃꯅꯨꯡ" },
      graduation: { native: "ꯄ꯭ꯔꯤꯌꯥꯒꯤ ꯒ꯭ꯔꯦꯖꯨꯑꯦꯁꯟ", relation: "ꯏꯕꯦꯝꯃꯥ" },
      majuli: { native: "ꯃꯥꯖꯨꯂꯤ ꯏꯊꯠ ꯍꯤꯍꯣꯟꯕꯥ", relation: "ꯏꯊꯠ ꯆꯠꯄꯥ" }
    }
  },
  brx: {
    headerTitle: "मोनसे एल्बाम",
    headerSubtitle: "Memory Album • Life Review",
    reminiscenceBadge: "गोसोखां थिराफि",
    playingAudioText: "🔊 नखरनि गारांआव गोसोखां खोनासं गासिनो दं...",
    listenBtn: "नखरनि खोनासं",
    photos: {
      bihu: { native: "बैसागु नखरनि फोरबो", relation: "नखरनि फोरबो" },
      graduation: { native: "प्रियानि समावर्तन", relation: "नाति" },
      majuli: { native: "माजुली दैसा फेरि", relation: "दैसा दावबायनाय" }
    }
  },
  kha: {
    headerTitle: "Ka Kot Dur Jingkynmaw",
    headerSubtitle: "Memory Album • Life Review",
    reminiscenceBadge: "Ka Jingkynmaw Bymynsaw",
    playingAudioText: "🔊 Dang sngap ïa ka puriskam ha ka sur kiba ha ïing...",
    listenBtn: "Sngap ïa ka Puriskam",
    photos: {
      bihu: { native: "Ka Lehniam Bihu", relation: "Kiba Ha Ïing" },
      graduation: { native: "Ka Jingioh Degree Priya", relation: "I Ksew" },
      majuli: { native: "Ka Lieng Majuli", relation: "Ka Jingleit Wah" }
    }
  },
  lus: {
    headerTitle: "Hriatrengna Album",
    headerSubtitle: "Memory Album • Life Review",
    reminiscenceBadge: "Hriatrengna Damdawi",
    playingAudioText: "🔊 Chhungte aw ngeiin thlalak chanchin an sawi e...",
    listenBtn: "Chhungkaw Chanchin Ngaithla Rawh",
    photos: {
      bihu: { native: "Chhungkaw Kut Mawi", relation: "Chhungkaw Kut" },
      graduation: { native: "Priya-i Degree Lak Ni", relation: "Tu Hmeichhia" },
      majuli: { native: "Majuli Lawng Chuan", relation: "Lawng Zin" }
    }
  },
  en: {
    headerTitle: "Memory Album",
    headerSubtitle: "Life Review & Photo Memories",
    reminiscenceBadge: "Reminiscence Therapy",
    playingAudioText: "🔊 Playing Reminiscence Audio with Family Voice...",
    listenBtn: "Listen to Family Story",
    photos: {
      bihu: { native: "Family Spring Festival", relation: "Family Festival" },
      graduation: { native: "Graduation Celebration", relation: "Granddaughter" },
      majuli: { native: "River Island Ferry Journey", relation: "Spiritual Journey" }
    }
  }
};

// ── CONNECT SCREEN LOCALES ────────────────────────────────────
export interface ConnectScreenLocale {
  headerTitle: string;
  headerSubtitle: string;
}

export const CONNECT_SCREEN_LOCALES: Record<string, ConnectScreenLocale> = {
  as: {
    headerTitle: "পৰিয়াল আৰু সমাজ সংযোগ",
    headerSubtitle: "Social Connect • Circles & Stories"
  },
  bn: {
    headerTitle: "পরিবার ও সামাজিক সংযোগ",
    headerSubtitle: "Social Connect • Circles & Stories"
  },
  hi: {
    headerTitle: "परिवार एवं सामाजिक जुड़ाव",
    headerSubtitle: "Social Connect • Circles & Stories"
  },
  mni: {
    headerTitle: "ꯏꯃꯨꯡ ꯑꯃꯁꯨꯡ ꯂꯩꯀꯥꯏ ꯁꯝꯅꯕꯥ",
    headerSubtitle: "Social Connect • Circles & Stories"
  },
  brx: {
    headerTitle: "नखर आरो समाजजों लोगो जानाय",
    headerSubtitle: "Social Connect • Circles & Stories"
  },
  kha: {
    headerTitle: "Ka Jingïasyllok bad Kiba ha Ïing",
    headerSubtitle: "Social Connect • Circles & Stories"
  },
  lus: {
    headerTitle: "Chhungte leh Khawtlang Inzawmna",
    headerSubtitle: "Social Connect • Circles & Stories"
  },
  en: {
    headerTitle: "Social Connect",
    headerSubtitle: "Family Circles & Folk Stories"
  }
};
