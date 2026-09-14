"use client";

import React, { useState } from "react";
import type { ScreenId } from "@/lib/types";
import { DEFAULT_SCHEDULE } from "@/lib/constants";
import { playBeep } from "@/lib/audio";
import ElderCard from "@/components/ui/ElderCard";
import CognitiveProgressRing from "@/components/ui/CognitiveProgressRing";
import ConnectivityIndicator from "@/components/ui/ConnectivityIndicator";
import LanguageSelectorModal from "@/components/ui/LanguageSelectorModal";
import VoiceAssistantButton from "@/components/ui/VoiceAssistantButton";
import ModeSwitchGuard from "@/components/ui/ModeSwitchGuard";

interface Props {
  navigate: (target: ScreenId) => void;
  language?: string;
  onSelectLanguage?: (code: string) => void;
}

// Localized strings for home reassurance & activity cards across 8 NER languages
const LOCALIZED_HOME: Record<string, {
  greeting: string;
  safeMessage: string;
  comfortTitle: string;
  comfortDesc: string;
  gamesTitle: string;
  gamesSub: string;
  remindersTitle: string;
  remindersSub: string;
  albumTitle: string;
  albumSub: string;
  connectTitle: string;
  connectSub: string;
  scheduleTitle: string;
  scheduleSub: string;
  langLabel: string;
}> = {
  as: {
    greeting: "নমস্কাৰ, বৰদেউতা 👋",
    safeMessage: "আপুনি গুৱাহাটীৰ নিজা ঘৰত সুৰক্ষিতভাৱে আছে",
    comfortTitle: "শান্তিপূৰ্ণ প্ৰভাতীয় কাৰ্যসূচী",
    comfortDesc: "আজি ৫ টাৰ ভিতৰত ২ টা কাৰ্যসূচী সম্পন্ন হৈছে",
    gamesTitle: "জ্ঞান ব্যায়াম",
    gamesSub: "৪ টা সাংস্কৃতিক খেল",
    remindersTitle: "দৰব আৰু পানী",
    remindersSub: "আজিৰ ৩ টা সোঁৱৰণী",
    albumTitle: "স্মৃতিৰ এলবাম",
    albumSub: "পুৰণি স্মৃতি আৰু ফটো",
    connectTitle: "নাতি-নাতিনীৰ মেল",
    connectSub: "পৰিয়ালৰ সৈতে যোগাযোগ",
    scheduleTitle: "আজিৰ কাৰ্যসূচী",
    scheduleSub: "স্বয়ংক্ৰিয় কণ্ঠ সতৰ্কবাৰ্তা সক্ৰিয়",
    langLabel: "অসমীয়া"
  },
  mni: {
    greeting: "ꯈꯨꯔꯨꯝꯖꯔꯤ, ꯏꯕꯨꯡꯉꯣ 👋",
    safeMessage: "ꯅꯍꯥꯛ ꯏꯝꯐꯥꯜꯗꯥ ꯂꯩꯕꯥ ꯅꯍꯥꯛꯀꯤ ꯌꨨꯨꯃꯗꯥ ꯂꯩꯔꯤ",
    comfortTitle: "ꯅꯨꯡꯉꯥꯏꯔꯕꯥ ꯑꯌꯨꯛꯀꯤ ꯊꯧꯔꯥꯡ",
    comfortDesc: "ꯉꯁꯤ ꯊꯕꯛ ꯵ꯒꯤ ꯃꯅꯨꯡꯗꯥ ꯲ ꯂꯣꯏꯁꯤꯅꯈ꯭ꯔꯦ",
    gamesTitle: "ꯋꯥꯈꯜ ꯆꯦꯠꯁꯤꯂꯍꯟꯅꯕꯥ ꯁꯥꯟꯅꯄꯣꯠ",
    gamesSub: "ꯁꯥꯟꯅꯄꯣꯠ ꯴ ꯌꯥꯎꯔꯤ",
    remindersTitle: "ꯍꯤꯗꯥꯛ ꯑꯃꯁꯨꯡ ꯏꯁꯤꯡ",
    remindersSub: "ꯉꯁꯤꯒꯤ ꯅꯤꯡꯁꯤꯡꯕꯥ ꯳",
    albumTitle: "ꯅꯤꯡꯁꯤꯡ ꯑꯦꯂꯕꯝ",
    albumSub: "ꯃꯃꯥꯡꯉꯩꯒꯤ ꯐꯣꯇꯣꯁꯤꯡ",
    connectTitle: "ꯅꯥꯄꯨ-ꯅꯥꯕꯦꯜ ꯁꯝꯅꯕꯥ",
    connectSub: "ꯏꯃꯨꯡ ꯃꯅꯨꯡꯒꯥ ꯋꯥꯔꯤ",
    scheduleTitle: "ꯉꯁꯤꯒꯤ ꯊꯧꯔꯥꯡ",
    scheduleSub: "ꯈꯣꯟꯊꯣꯛꯀꯤ ꯄꯥꯎꯇꯥꯛ ꯆꯠꯊꯔꯤ",
    langLabel: "ꯃꯩꯇꯩꯂꯣꯟ"
  },
  bn: {
    greeting: "নমস্কার, দাদু 👋",
    safeMessage: "আপনি নিজের বাড়িতে নিরাপদে আছেন",
    comfortTitle: "শান্তিপূর্ণ সকালের রুটিন",
    comfortDesc: "আজ ৫ টির মধ্যে ২টি ক্রিয়াকলাপ সম্পন্ন হয়েছে",
    gamesTitle: "জ্ঞান ব্যায়াম",
    gamesSub: "৪টি ঐতিহ্যবাহী খেলা",
    remindersTitle: "ঔষধ ও জল",
    remindersSub: "আজকের ৩টি রিমাইন্ডার",
    albumTitle: "স্মৃতির অ্যালবাম",
    albumSub: "পুরানো স্মৃতি ও ছবি",
    connectTitle: "নাতি-নাতনিদের আসর",
    connectSub: "পরিবারের সাথে যোগাযোগ",
    scheduleTitle: "আজকের সময়সূচী",
    scheduleSub: "ভয়েস অ্যালার্ট সক্রিয়",
    langLabel: "বাংলা"
  },
  brx: {
    greeting: "खुलुमबाय, आबौ 👋",
    safeMessage: "नोंथाङा नखराव मोजाङैनो दं",
    comfortTitle: "शान्ति गोनां फुंनि हाबाफारि",
    comfortDesc: "दिनै ५ टा हाबानि गेजेराव २ टा जोबबाय",
    gamesTitle: "मेमोरि गेलेनाय",
    gamesSub: "४ टा गेलेनाय",
    remindersTitle: "मुली आरो दै",
    remindersSub: "दिनैनि ३ टा गोसोखां होनाय",
    albumTitle: "मोनसे एल्बाम",
    albumSub: "गोजाम फोटोफोर",
    connectTitle: "नातिफोरजों लोगो लानाय",
    connectSub: "नखरजों रायलायनाय",
    scheduleTitle: "दिनैनि हाबाफारि",
    scheduleSub: "गारांनि एलार्ट चालू दं",
    langLabel: "बड़ो"
  },
  kha: {
    greeting: "Khublei, Kpa 👋",
    safeMessage: "Phi shngain ha iing ha Guwahati",
    comfortTitle: "Ka Rukom Kiew Step Bymynsaw",
    comfortDesc: "2 na ki 5 ki jingtrei la pyndep mynta",
    gamesTitle: "Ki Jingialehkai Jingmut",
    gamesSub: "4 ki jingialehkai",
    remindersTitle: "Dawai & Um",
    remindersSub: "3 ki jingkynmaw mynta",
    albumTitle: "Ka Kot Dur Jingkynmaw",
    albumSub: "Ki dur kiba rim",
    connectTitle: "Iasyllok Bad ki Ksew",
    connectSub: "Ka jingiakren bad kiba ha iing",
    scheduleTitle: "Ka Por Jingtrei Mynta",
    scheduleSub: "Ka jingpyntip da ka sur la treikam",
    langLabel: "Khasi"
  },
  lus: {
    greeting: "Chibai, Ka Pu 👋",
    safeMessage: "In lamah Guwahati-ah i him e",
    comfortTitle: "Tukthuan Hauhuk Lo Tak",
    comfortDesc: "Vawiinah thiltih 5 atangin 2 i tlingtla tawh",
    gamesTitle: "Thluak Sawizawina Game",
    gamesSub: "Game chi 4",
    remindersTitle: "Damdawi & Tui",
    remindersSub: "Vawiina hriattirna 3",
    albumTitle: "Hriatrengna Album",
    albumSub: "Thlalak hluite",
    connectTitle: "Tute Nen Inbiakpawhna",
    connectSub: "Chhungte nen inzawmna",
    scheduleTitle: "Vawiin Hun Duante",
    scheduleSub: "Aw hmanga hriattirna a nung e",
    langLabel: "Mizo"
  },
  hi: {
    greeting: "नमस्ते, दादाजी 👋",
    safeMessage: "आप गुवाहाटी में अपने घर पर पूरी तरह सुरक्षित हैं",
    comfortTitle: "शांत प्रभात दिनचर्या",
    comfortDesc: "आज ५ में से २ दैनिक गतिविधियां पूरी हुईं",
    gamesTitle: "स्मृति खेल",
    gamesSub: "४ ज्ञानवर्धक खेल",
    remindersTitle: "दवा और पानी",
    remindersSub: "आज के ३ रिमाइंडर",
    albumTitle: "स्मृति एल्बम",
    albumSub: "पारिवारिक पुरानी तस्वीरें",
    connectTitle: "पोते-पोतियों से जुड़ाव",
    connectSub: "परिवार से आवाज साझा करें",
    scheduleTitle: "आज की समय-सारणी",
    scheduleSub: "ध्वनि संदेश सक्रिय",
    langLabel: "हिन्दी"
  },
  en: {
    greeting: "Namaskar, Grandfather 👋",
    safeMessage: "You are safe at home in Guwahati",
    comfortTitle: "Peaceful Morning Routine",
    comfortDesc: "2 out of 5 daily wellness activities completed today",
    gamesTitle: "Cognitive Games",
    gamesSub: "4 Cultural Brain Games",
    remindersTitle: "Reminders & Water",
    remindersSub: "3 reminders scheduled today",
    albumTitle: "Memory Album",
    albumSub: "Life review & family voice photos",
    connectTitle: "Grandchild Connect",
    connectSub: "Co-play voice clues with family",
    scheduleTitle: "Today’s Schedule",
    scheduleSub: "Automated Voice Alerts Active",
    langLabel: "English"
  }
};

export default function HomeScreen({ navigate, language = "as", onSelectLanguage }: Props) {
  const [isLangModalOpen, setIsLangModalOpen] = useState<boolean>(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);

  const loc = LOCALIZED_HOME[language] || LOCALIZED_HOME.en;

  const handleNav = (target: ScreenId) => {
    playBeep(440, 100);
    navigate(target);
  };

  const handleCaregiverRequest = () => {
    playBeep(480, 100);
    setIsPinModalOpen(true);
  };

  const handlePinVerified = () => {
    setIsPinModalOpen(false);
    navigate("caregiver");
  };

  return (
    <div
      style={{
        padding: "1.25rem 1.25rem 6.5rem",
        backgroundColor: "var(--white)",
        minHeight: "100dvh",
      }}
    >
      {/* ── Top Header with Reassurance, Language & Persona Controls ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--gray-200)",
          marginBottom: "1.25rem",
          gap: "0.5rem"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
            <span
              style={{
                fontSize: "0.8rem",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "var(--accent)",
              }}
            >
              Monday • 14 September
            </span>
            <ConnectivityIndicator />
          </div>

          <h1
            style={{
              fontSize: "1.55rem",
              fontWeight: 800,
              color: "var(--gray-900)",
              lineHeight: 1.2,
              margin: 0
            }}
          >
            {loc.greeting}
          </h1>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--gray-500)",
              marginTop: "0.2rem",
              marginBottom: 0
            }}
          >
            {loc.safeMessage}
          </p>
        </div>

        {/* Action Pills: Language Toggle, ASHA, Caregiver Lock */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
          <div style={{ display: "flex", gap: "0.35rem" }}>
            {/* 1-Tap Language Quick Switcher */}
            <button
              type="button"
              onClick={() => setIsLangModalOpen(true)}
              aria-label={`Selected Language: ${loc.langLabel}. Tap to change language.`}
              style={{
                background: "#eff6ff",
                border: "1.5px solid #bfdbfe",
                borderRadius: "999px",
                padding: "0.4rem 0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#1e40af",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <span>🗣️</span>
              <span>{loc.langLabel}</span>
            </button>

            {/* ASHA Portal Button */}
            <button
              type="button"
              onClick={() => handleNav("asha-worker")}
              style={{
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                borderRadius: "999px",
                padding: "0.4rem 0.65rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#065f46",
                cursor: "pointer",
              }}
            >
              <span>🩺</span>
              <span>ASHA</span>
            </button>
          </div>

          {/* Caregiver PIN-Guarded Button */}
          <button
            type="button"
            onClick={handleCaregiverRequest}
            aria-label="Caregiver Mode (Requires PIN)"
            style={{
              background: "var(--gray-50)",
              border: "1px solid var(--gray-300)",
              borderRadius: "999px",
              padding: "0.35rem 0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--gray-700)",
              cursor: "pointer",
            }}
          >
            <span>🔒</span>
            <span>Caregiver Portal</span>
          </button>
        </div>
      </div>

      {/* ── Dementia Comfort & Reassurance Card ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
          border: "1px solid #bbf7d0",
          borderRadius: "var(--radius-lg)",
          padding: "1rem 1.15rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{ fontSize: "2rem" }}>☀️</div>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#166534" }}>
              {loc.comfortTitle}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#15803d", marginTop: "0.1rem" }}>
              {loc.comfortDesc}
            </div>
          </div>
        </div>

        {/* Cognitive Progress Ring */}
        <CognitiveProgressRing
          percentage={50}
          size={56}
          strokeWidth={6}
          color="#16a34a"
          trackColor="#bbf7d0"
          label="2/4"
        />
      </div>

      {/* ── 4 Primary Daily Activity Cards (ElderCard Primitives) ── */}
      <h2
        style={{
          fontSize: "1.05rem",
          fontWeight: 800,
          color: "var(--gray-900)",
          marginBottom: "0.85rem",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem"
        }}
      >
        <span>🎯</span>
        <span>Daily Activities • কাৰ্যসূচী</span>
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        {/* Card 1: Cognitive Games */}
        <ElderCard
          variant="elevated"
          accentColor="#2563eb"
          interactive
          onPress={() => handleNav("games")}
          aria-label={`${loc.gamesTitle}: ${loc.gamesSub}. Tap to play memory games.`}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: "14px",
              background: "#eff6ff",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem"
            }}>
              🎮
            </div>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gray-900)" }}>
                {loc.gamesTitle}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginTop: "0.15rem" }}>
                {loc.gamesSub}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.35rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2563eb", background: "#eff6ff", padding: "0.2rem 0.5rem", borderRadius: "999px" }}>
                2 Done • 2 Left
              </span>
              <span style={{ fontSize: "0.9rem", color: "#2563eb", fontWeight: 700 }}>→</span>
            </div>
          </div>
        </ElderCard>

        {/* Card 2: Reminders */}
        <ElderCard
          variant="elevated"
          accentColor="#d97706"
          interactive
          onPress={() => handleNav("reminders")}
          aria-label={`${loc.remindersTitle}: ${loc.remindersSub}. Tap to review medicines.`}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: "14px",
              background: "#fef3c7",
              color: "#d97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem"
            }}>
              ⏰
            </div>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gray-900)" }}>
                {loc.remindersTitle}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginTop: "0.15rem" }}>
                {loc.remindersSub}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.35rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#b45309", background: "#fef3c7", padding: "0.2rem 0.5rem", borderRadius: "999px" }}>
                Next: 12:30 PM
              </span>
              <span style={{ fontSize: "0.9rem", color: "#d97706", fontWeight: 700 }}>→</span>
            </div>
          </div>
        </ElderCard>

        {/* Card 3: Memory Album */}
        <ElderCard
          variant="elevated"
          accentColor="#c026d3"
          interactive
          onPress={() => handleNav("album")}
          aria-label={`${loc.albumTitle}: ${loc.albumSub}. Tap to look at photo memories.`}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: "14px",
              background: "#fae8ff",
              color: "#c026d3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem"
            }}>
              📸
            </div>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gray-900)" }}>
                {loc.albumTitle}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginTop: "0.15rem" }}>
                {loc.albumSub}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.35rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a21caf", background: "#fae8ff", padding: "0.2rem 0.5rem", borderRadius: "999px" }}>
                8 Photos
              </span>
              <span style={{ fontSize: "0.9rem", color: "#c026d3", fontWeight: 700 }}>→</span>
            </div>
          </div>
        </ElderCard>

        {/* Card 4: Connect */}
        <ElderCard
          variant="elevated"
          accentColor="#15803d"
          interactive
          onPress={() => handleNav("connect")}
          aria-label={`${loc.connectTitle}: ${loc.connectSub}. Tap to listen to grandchild clues.`}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: "14px",
              background: "#dcfce7",
              color: "#15803d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem"
            }}>
              🤝
            </div>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gray-900)" }}>
                {loc.connectTitle}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginTop: "0.15rem" }}>
                {loc.connectSub}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.35rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#15803d", background: "#dcfce7", padding: "0.2rem 0.5rem", borderRadius: "999px" }}>
                1 New Clue!
              </span>
              <span style={{ fontSize: "0.9rem", color: "#15803d", fontWeight: 700 }}>→</span>
            </div>
          </div>
        </ElderCard>
      </div>

      {/* ── Today's Schedule Timeline ── */}
      <div
        style={{
          background: "var(--gray-50)",
          borderRadius: "var(--radius-lg)",
          padding: "1.1rem",
          border: "1px solid var(--gray-200)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.85rem",
          }}
        >
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 800,
              color: "var(--gray-900)",
              margin: 0
            }}
          >
            {loc.scheduleTitle}
          </h3>
          <span style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>
            {loc.scheduleSub}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          {DEFAULT_SCHEDULE.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.65rem 0.85rem",
                background: "var(--white)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--gray-200)",
                fontSize: "0.85rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--gray-900)" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>
                    {item.description}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    color: "var(--primary)",
                  }}
                >
                  {item.time}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color:
                      item.status === "done"
                        ? "var(--green)"
                        : item.status === "pending"
                        ? "#d97706"
                        : "var(--gray-400)",
                    fontWeight: 700,
                  }}
                >
                  {item.status === "done"
                    ? "✓ Done"
                    : item.status === "pending"
                    ? "● Current"
                    : "Upcoming"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Floating Voice Assistant Button ── */}
      <VoiceAssistantButton language={language} navigate={navigate} />

      {/* ── 1-Tap Language Switcher Modal ── */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        currentLanguage={language}
        onClose={() => setIsLangModalOpen(false)}
        onSelectLanguage={(code) => {
          onSelectLanguage?.(code);
          setIsLangModalOpen(false);
        }}
      />

      {/* ── Caregiver PIN Mode Switch Guard Modal ── */}
      <ModeSwitchGuard
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinVerified}
      />
    </div>
  );
}
