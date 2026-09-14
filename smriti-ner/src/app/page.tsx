"use client";

import { useState, useEffect } from "react";
import type { ScreenId } from "@/lib/types";
import SplashScreen from "@/components/screens/SplashScreen";
import LanguageScreen from "@/components/screens/LanguageScreen";
import HomeScreen from "@/components/screens/HomeScreen";
import GamesScreen from "@/components/screens/GamesScreen";
import DholPepaGame from "@/components/games/DholPepaGame";
import KazirangaGame from "@/components/games/KazirangaGame";
import WeaversLoomGame from "@/components/games/WeaversLoomGame";
import DailyHaatGame from "@/components/games/DailyHaatGame";
import RemindersScreen from "@/components/screens/RemindersScreen";
import AlbumScreen from "@/components/screens/AlbumScreen";
import ConnectScreen from "@/components/screens/ConnectScreen";
import CaregiverPinScreen from "@/components/screens/CaregiverPinScreen";
import CaregiverDashboard from "@/components/screens/CaregiverDashboard";
import AshaWorkerScreen from "@/components/screens/AshaWorkerScreen";
import BottomNav from "@/components/ui/BottomNav";
import CelebrationOverlay from "@/components/ui/CelebrationOverlay";
import styles from "./page.module.css";

export default function App() {
  const [screen, setScreen] = useState<ScreenId>("splash");
  const [language, setLanguage] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState<{
    open: boolean;
    time: string;
    accuracy: string;
    onNext?: () => void;
  }>({ open: false, time: "", accuracy: "" });

  // Load saved language
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("smriti_language");
      if (saved) setLanguage(saved);
    }
  }, []);

  // Splash → language or home
  useEffect(() => {
    if (screen === "splash") {
      const timer = setTimeout(() => {
        setScreen(language ? "home" : "language");
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [screen, language]);

  const navigate = (target: ScreenId) => {
    if (target === "caregiver") {
      setScreen("caregiver-pin");
    } else {
      setScreen(target);
    }
  };

  const showSuccess = (time: string, accuracy: string, onNext?: () => void) => {
    setSuccessModal({ open: true, time, accuracy, onNext });
  };

  const handleSelectLanguage = (code: string) => {
    setLanguage(code);
    if (typeof window !== "undefined") {
      localStorage.setItem("smriti_language", code);
    }
    setScreen("home");
  };

  const handlePinSuccess = () => {
    setScreen("caregiver");
  };

  const showBottomNav =
    screen === "home" ||
    screen === "games" ||
    screen === "reminders" ||
    screen === "caregiver";

  return (
    <div className={styles.shell}>
      {screen === "splash" && <SplashScreen />}
      {screen === "language" && <LanguageScreen onSelect={handleSelectLanguage} />}
      {screen === "home" && (
        <HomeScreen
          navigate={navigate}
          language={language || "as"}
          onSelectLanguage={handleSelectLanguage}
        />
      )}
      {screen === "games" && (
        <GamesScreen navigate={navigate} language={language || "as"} />
      )}
      {screen === "dhol-pepa" && (
        <DholPepaGame navigate={navigate} showSuccess={showSuccess} />
      )}
      {screen === "kaziranga" && (
        <KazirangaGame navigate={navigate} showSuccess={showSuccess} />
      )}
      {screen === "weavers-loom" && (
        <WeaversLoomGame navigate={navigate} showSuccess={showSuccess} />
      )}
      {screen === "daily-haat" && (
        <DailyHaatGame navigate={navigate} showSuccess={showSuccess} />
      )}
      {screen === "reminders" && (
        <RemindersScreen navigate={navigate} language={language || "as"} />
      )}
      {screen === "album" && (
        <AlbumScreen navigate={navigate} language={language || "as"} />
      )}
      {screen === "connect" && (
        <ConnectScreen navigate={navigate} language={language || "as"} />
      )}
      {screen === "caregiver-pin" && (
        <CaregiverPinScreen onSuccess={handlePinSuccess} onBack={() => setScreen("home")} />
      )}
      {screen === "caregiver" && <CaregiverDashboard navigate={navigate} />}
      {screen === "asha-worker" && <AshaWorkerScreen navigate={navigate} />}

      {showBottomNav && (
        <BottomNav
          active={screen}
          navigate={navigate}
          language={language || "as"}
        />
      )}

      <CelebrationOverlay
        isOpen={successModal.open}
        accuracy={parseInt(successModal.accuracy) || 100}
        timeSpentSeconds={parseInt(successModal.time) || 15}
        language={language || "as"}
        onContinue={() => {
          setSuccessModal({ open: false, time: "", accuracy: "" });
          successModal.onNext?.();
        }}
        onHome={() => {
          setSuccessModal({ open: false, time: "", accuracy: "" });
          setScreen("home");
        }}
      />
    </div>
  );
}
