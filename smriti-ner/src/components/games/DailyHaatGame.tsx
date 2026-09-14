// ── SMRITI-NER GAME 4: DAILY HAAT RECALL (দৈনিক হাটৰ স্মৃতি) ───────────────────
// Sub-Phase 4.5: Authentic rural Haat stalls, local produce, recipe cards,
// delayed recall protocol, wooden token currency exchange, unified AACB de-escalation.

"use client";

import React, { useState, useEffect, useRef } from "react";
import type { ScreenId } from "@/lib/types";
import { playGentleChime, playSuccessJingle, playBeep, playNeutralTap } from "@/lib/audio";
import { decomposeLatency } from "@/lib/dcdaEngine";
import { sessionManager } from "@/lib/gameSessionManager";
import { type DifficultyTier, getTierConfig } from "@/lib/difficultyStateMachine";
import { aacbEngine, type AACBState } from "@/lib/aacbEngine";
import ElderCard from "@/components/ui/ElderCard";
import AACBBanner from "@/components/ui/AACBBanner";
import { GAMES_SCREEN_LOCALES } from "@/lib/screenLocalizations";

interface Props {
  navigate: (target: ScreenId) => void;
  showSuccess: (time: string, accuracy: string, onNext?: () => void) => void;
  language?: string;
}

// ── Market Produce Item ──────────────────────────────────────────
interface HaatProduce {
  id: string;
  stall: "veggies" | "fish" | "spices" | "tea";
  name: string;
  native: string;
  emoji: string;
  description: string;
}

// ── Market Stall Definition ─────────────────────────────────────
interface HaatStall {
  id: "all" | "veggies" | "fish" | "spices" | "tea";
  label: string;
  native: string;
  icon: string;
  color: string;
}

const STALLS: HaatStall[] = [
  { id: "all", label: "All Stalls", native: "সকলো দোকান", icon: "🏪", color: "#6b7280" },
  { id: "veggies", label: "Vegetables", native: "শাক-পাচলি", icon: "🥬", color: "#16a34a" },
  { id: "fish", label: "Fresh Fish", native: "মাছৰ দোকান", icon: "🐟", color: "#0284c7" },
  { id: "spices", label: "Spices", native: "মচলা", icon: "🌶️", color: "#d97706" },
  { id: "tea", label: "Tea & Grains", native: "চাহ আৰু চাউল", icon: "☕", color: "#9333ea" },
];

// ── Authentic North-Eastern Rural Haat Catalog ──────────────────
const HAAT_PRODUCE: HaatProduce[] = [
  // 1. Vegetable Stall
  { id: "lai_xak", stall: "veggies", name: "Mustard Greens", native: "লাই শাক", emoji: "🌿", description: "Fresh winter organic greens" },
  { id: "koldil", stall: "veggies", name: "Banana Flower", native: "কলডিল", emoji: "🪷", description: "Iron-rich crisp banana blossom" },
  { id: "omita", stall: "veggies", name: "Raw Papaya", native: "কেঁচা অমিতা", emoji: "🍈", description: "Essential for Assamese Khar" },
  { id: "bah_gaaj", stall: "veggies", name: "Bamboo Shoot", native: "বাঁহ গাজ", emoji: "🎋", description: "Aromatic tender hill bamboo shoot" },

  // 2. Fresh Fish Stall
  { id: "rohu_fish", stall: "fish", name: "Brahmaputra Rohu", native: "ৰৌ মাছ", emoji: "🐟", description: "Fresh river sweet-water carp" },
  { id: "chital_fish", stall: "fish", name: "River Chital", native: "চিতল মাছ", emoji: "🐠", description: "Prized featherback fish" },
  { id: "river_prawn", stall: "fish", name: "River Prawn", native: "মিছা মাছ", emoji: "🦐", description: "Fresh local stream prawn" },
  { id: "borali_fish", stall: "fish", name: "Borali Catfish", native: "বৰালী মাছ", emoji: "🐡", description: "Traditional delicacy fish" },

  // 3. Traditional Spice Rack
  { id: "bhut_jolokia", stall: "spices", name: "Bhut Jolokia", native: "ভূত জলকীয়া", emoji: "🌶️", description: "Legendary Assam Ghost Pepper" },
  { id: "turmeric", stall: "spices", name: "Raw Turmeric", native: "কেঁচা হালধি", emoji: "🧡", description: "Golden aromatic hill turmeric root" },
  { id: "ada", stall: "spices", name: "Hill Ginger", native: "কেঁচা আদা", emoji: "🫚", description: "Pungent highland rhizome" },
  { id: "soriyoh", stall: "spices", name: "Mustard Seeds", native: "সৰিয়হ গুটি", emoji: "🌾", description: "Stone-ground yellow mustard" },

  // 4. Assam Tea & Grains Corner
  { id: "joha_rice", stall: "tea", name: "Joha Scented Rice", native: "জোহা চাউল", emoji: "🍚", description: "Naturally fragrant heritage rice" },
  { id: "assam_tea", stall: "tea", name: "Assam CTC Tea", native: "অসম চাহ", emoji: "☕", description: "Malty rich upper Assam black tea" },
  { id: "pitha_flour", stall: "tea", name: "Rice Flour", native: "বৰা চাউলৰ গুৰি", emoji: "🥣", description: "Sticky rice flour for Bihu pitha" },
  { id: "laal_gur", stall: "tea", name: "Organic Jaggery", native: "কেঁচা গুড়", emoji: "🍯", description: "Pure sugarcane jaggery block" },
];

// ── Traditional Regional Recipes ────────────────────────────────
interface RegionalRecipe {
  id: string;
  name: string;
  native: string;
  region: string;
  description: string;
  ingredients: string[]; // produce item IDs
  tokenCost: number;
}

const REGIONAL_RECIPES: RegionalRecipe[] = [
  {
    id: "fish_curry",
    name: "Assamese Fish Curry",
    native: "মাছৰ টেঙা / জোল",
    region: "Assam (অসম)",
    description: "Light midday river fish curry seasoned with golden turmeric and freshly pounded mustard seeds.",
    ingredients: ["rohu_fish", "turmeric", "soriyoh"],
    tokenCost: 3,
  },
  {
    id: "omita_khar",
    name: "Traditional Omita Khar",
    native: "অমিতাৰ খাৰ",
    region: "Assam (অসম)",
    description: "Digestive alkaline heritage starter cooked with tender raw papaya, fresh hill ginger, and mustard seeds.",
    ingredients: ["omita", "ada", "soriyoh"],
    tokenCost: 3,
  },
  {
    id: "manipuri_kangsoi",
    name: "Manipuri Kangsoi Stew",
    native: "ꯃꯅꯤꯄꯨꯔꯤ ꯀꯥꯡꯁꯣꯏ",
    region: "Manipur (ꯃꯅꯤꯄꯨꯔ)",
    description: "Soothing Meitei vegetable stew simmered with mustard greens, fresh river fish, and aromatic king chili.",
    ingredients: ["lai_xak", "rohu_fish", "bhut_jolokia"],
    tokenCost: 3,
  },
  {
    id: "bodo_onla",
    name: "Bodo Narzi Onla",
    native: "नाफ्सी अनला",
    region: "Bodoland (बड़ोलेण्ड)",
    description: "Classic festival comfort curry made with tender bamboo shoot, sticky rice powder, and fresh hill ginger.",
    ingredients: ["bah_gaaj", "pitha_flour", "ada"],
    tokenCost: 3,
  },
];

type GamePhase = "memorize" | "distractor" | "shopping" | "checkout";

export default function DailyHaatGame({ navigate, showSuccess, language = "en" }: Props) {
  const loc = GAMES_SCREEN_LOCALES[language] || GAMES_SCREEN_LOCALES.en;

  const [tier, setTier] = useState<DifficultyTier>(2);
  const tierConfig = getTierConfig(tier);

  const [recipeIndex, setRecipeIndex] = useState<number>(0);
  const [phase, setPhase] = useState<GamePhase>("memorize");
  const [activeStall, setActiveStall] = useState<"all" | "veggies" | "fish" | "spices" | "tea">("all");
  const [basket, setBasket] = useState<string[]>([]);
  const [tokensPaid, setTokensPaid] = useState<number>(0);
  const [distractorCounter, setDistractorCounter] = useState<number>(4);
  const [aacbState, setAacbState] = useState<AACBState>(aacbEngine.getState());

  const startTimeRef = useRef<number>(Date.now());
  const interactionStartRef = useRef<number>(Date.now());

  const currentRecipe = REGIONAL_RECIPES[recipeIndex % REGIONAL_RECIPES.length];

  const getProduceLabel = (p: HaatProduce) => {
    if (language === "en") return p.name;
    if (language === "hi") {
      const hiMap: Record<string, string> = {
        lai_xak: "सरसों साग",
        koldil: "केले का फूल",
        omita: "कच्चा पपीता",
        bah_gaaj: "बांस की सब्जी",
        rohu_fish: "रोहू मछली",
        chital_fish: "चितल मछली",
        river_prawn: "नदी का झींगा",
        borali_fish: "बोराली मछली",
        bhut_jolokia: "भूत जोलोकिया (मिर्च)",
        turmeric: "कच्ची हल्दी",
        ada: "अदरक",
        soriyoh: "सरसों दाना",
        joha_rice: "जोहा सुगंधित चावल",
        assam_tea: "असम की चाय",
        pitha_flour: "चावल का आटा",
        laal_gur: "गुड़",
      };
      return hiMap[p.id] || p.name;
    }
    if (language === "bn") {
      const bnMap: Record<string, string> = {
        lai_xak: "লাই শাক",
        koldil: "কলার মোচা",
        omita: "কাঁচা পেঁপে",
        bah_gaaj: "বাঁশের কোঁড়ল",
        rohu_fish: "রুই মাছ",
        chital_fish: "চিতল মাছ",
        river_prawn: "নদীর চিংড়ি",
        borali_fish: "বোয়াল মাছ",
        bhut_jolokia: "ভূত লঙ্কা",
        turmeric: "কাঁচা হলুদ",
        ada: "আদা",
        soriyoh: "সরিষা",
        joha_rice: "সুগন্ধি চাল",
        assam_tea: "আসামের চা",
        pitha_flour: "চালের গুঁড়া",
        laal_gur: "গুড়",
      };
      return bnMap[p.id] || p.name;
    }
    if (language === "as") return p.native;
    return p.name;
  };

  const getStallLabel = (s: HaatStall) => {
    if (language === "en") return s.label;
    if (language === "hi") {
      const hiStalls: Record<string, string> = {
        all: "सभी दुकानें",
        veggies: "ताज़ा सब्ज़ियाँ",
        fish: "मछली बाज़ार",
        spices: "मसाले",
        tea: "चाय व अनाज",
      };
      return hiStalls[s.id] || s.label;
    }
    if (language === "bn") {
      const bnStalls: Record<string, string> = {
        all: "সব দোকান",
        veggies: "শাকসবজি",
        fish: "তাজা মাছ",
        spices: "মশলা",
        tea: "চা ও শস্য",
      };
      return bnStalls[s.id] || s.label;
    }
    if (language === "as") return s.native;
    return s.label;
  };

  const getRecipeTitle = (r: RegionalRecipe) => {
    if (language === "en") return r.name;
    if (language === "as") return r.native;
    if (language === "hi") {
      const hiRecipes: Record<string, string> = {
        fish_curry: "पारंपरिक मछली का झोल (असमिया फिश करी)",
        omita_khar: "पारंपरिक कच्चे पपीते का खार",
        manipuri_kangsoi: "मणिपुरी कांगसोई सब्जी",
        bodo_onla: "बोडो नारज़ी अनला करी",
      };
      return hiRecipes[r.id] || r.name;
    }
    if (language === "bn") {
      const bnRecipes: Record<string, string> = {
        fish_curry: "আসামের মাছের ঝোল",
        omita_khar: "কলার ক্ষার ও কাঁচা পেঁপে",
        manipuri_kangsoi: "মণিপুরী কাংসোই স্টু",
        bodo_onla: "বোডো নারজী অনলা",
      };
      return bnRecipes[r.id] || r.name;
    }
    return r.name;
  };

  // Subscribe to AACB engine
  useEffect(() => {
    const unsubscribe = aacbEngine.subscribe((state) => {
      setAacbState(state);
    });

    sessionManager.startSession({
      gameId: "daily-haat",
      conceptId: "delayed_episodic_recall",
      initialTier: tier,
    });
    startTimeRef.current = Date.now();
    interactionStartRef.current = Date.now();

    return () => {
      unsubscribe();
      aacbEngine.reset();
    };
  }, []);

  // Distractor countdown effect
  useEffect(() => {
    if (phase !== "distractor") return;

    if (distractorCounter > 0) {
      const timer = setTimeout(() => {
        setDistractorCounter((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setPhase("shopping");
      interactionStartRef.current = Date.now();
      playGentleChime();
    }
  }, [phase, distractorCounter]);

  // Start shopping from memorization
  const handleStartShopping = () => {
    playGentleChime();
    setPhase("distractor");
    setDistractorCounter(4);
  };

  // Handle tap on market item
  const handleItemTap = (item: HaatProduce, e?: React.MouseEvent<HTMLButtonElement>) => {
    const totalReactionTime = Date.now() - interactionStartRef.current;
    const latency = decomposeLatency(totalReactionTime, 1.15);

    // If item already in basket, allow gentle removal without penalty
    if (basket.includes(item.id)) {
      playNeutralTap();
      setBasket(basket.filter((id) => id !== item.id));
      return;
    }

    const isTargetIngredient = currentRecipe.ingredients.includes(item.id);

    // Record interaction in Shared Game Framework
    try {
      const touchCoords = e ? { x: e.clientX, y: e.clientY } : undefined;
      const targetRect = e?.currentTarget.getBoundingClientRect();
      const targetCenter = targetRect
        ? { x: Math.round(targetRect.left + targetRect.width / 2), y: Math.round(targetRect.top + targetRect.height / 2) }
        : undefined;

      const { session } = sessionManager.recordInteraction({
        targetId: isTargetIngredient ? item.id : currentRecipe.ingredients[0],
        selectedId: item.id,
        totalReactionTimeMs: totalReactionTime,
        touchCoordinates: touchCoords,
        targetCenter,
      });

      setTier(session.currentTier);
    } catch {
      // fallback
    }

    if (isTargetIngredient) {
      playGentleChime();
      aacbEngine.recordSuccess();

      const newBasket = [...basket, item.id];
      setBasket(newBasket);
      interactionStartRef.current = Date.now();

      // Check if all ingredients collected
      const allFound = currentRecipe.ingredients.every((ingId) => newBasket.includes(ingId));
      if (allFound) {
        setTimeout(() => {
          setPhase("checkout");
          setTokensPaid(0);
          playGentleChime();
        }, 600);
      }
    } else {
      // Non-target produce selected: Zero failure sound, record in AACB engine
      playNeutralTap();
      const newBasket = [...basket, item.id];
      setBasket(newBasket);

      const missingId = currentRecipe.ingredients.find((ing) => !newBasket.includes(ing));
      aacbEngine.recordError({
        gameId: "daily-haat",
        targetId: missingId,
        deliberationMs: totalReactionTime,
        language: "as",
      });
    }
  };

  // Handle Token Payment in Checkout
  const handlePayToken = (tokenIndex: number) => {
    if (tokenIndex !== tokensPaid) return;

    playBeep(540 + tokenIndex * 80, 150);
    const newPaid = tokensPaid + 1;
    setTokensPaid(newPaid);

    if (newPaid >= currentRecipe.tokenCost) {
      // All tokens paid!
      playSuccessJingle();

      setTimeout(() => {
        let summaryAccuracy = 100;
        let summaryDuration = Math.round((Date.now() - startTimeRef.current) / 1000);
        try {
          const summary = sessionManager.endSession();
          summaryAccuracy = summary.accuracy;
          summaryDuration = summary.durationSeconds;
        } catch {
          // fallback
        }

        showSuccess(`${summaryDuration}s`, `${summaryAccuracy}%`, () => {
          // Advance to next recipe
          setRecipeIndex((idx) => idx + 1);
          setPhase("memorize");
          setBasket([]);
          setTokensPaid(0);
          aacbEngine.reset();
          startTimeRef.current = Date.now();
          interactionStartRef.current = Date.now();
          sessionManager.startSession({
            gameId: "daily-haat",
            conceptId: "delayed_episodic_recall",
            initialTier: tier,
          });
        });
      }, 700);
    }
  };

  // Filtered produce for display
  const displayedProduce = activeStall === "all"
    ? HAAT_PRODUCE
    : HAAT_PRODUCE.filter((p) => p.stall === activeStall);

  const missingCount = currentRecipe.ingredients.filter((id) => !basket.includes(id)).length;
  const collectedCount = currentRecipe.ingredients.filter((id) => basket.includes(id)).length;

  return (
    <div style={{
      padding: "1.25rem 1.25rem 5rem",
      backgroundColor: "var(--bg)",
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* ── Top Bar ────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "0.75rem",
        paddingBottom: "0.75rem",
        borderBottom: "1.5px solid var(--gray-200)",
      }}>
        <button
          onClick={() => navigate("games")}
          style={{
            background: "var(--white)",
            border: "1.5px solid var(--gray-200)",
            borderRadius: "50%",
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.3rem",
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
          }}
          aria-label="Back to Games"
        >
          ←
        </button>

        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--gray-900)" }}>
            {loc.haat.native}
          </h2>
          <span style={{ fontSize: "0.82rem", color: "#b45309", fontWeight: 700 }}>
            {loc.haat.name} • Recipe {recipeIndex + 1} of {REGIONAL_RECIPES.length}
          </span>
        </div>

        <div style={{
          background: aacbState.triggered ? "#fef3c7" : "#fffbeb",
          border: `1.5px solid ${aacbState.triggered ? "#fde68a" : "#fde68a"}`,
          borderRadius: "var(--radius)",
          padding: "0.35rem 0.65rem",
          fontSize: "0.82rem",
          fontWeight: 800,
          color: "#92400e",
        }}>
          {aacbState.triggered ? "AACB Active" : `Tier ${tier}`}
        </div>
      </div>

      {/* ── AACB Compassionate Family Guidance Banner ── */}
      {phase === "shopping" && (
        <AACBBanner
          active={aacbState.triggered}
          language={language}
          message={aacbState.nativeVoiceCue || aacbState.guidanceMessage}
          kinshipTitle={aacbState.kinshipTitle}
          onReplayVoice={() =>
            aacbEngine.speakVoiceCue(aacbState.nativeVoiceCue || aacbState.guidanceMessage || "", language)
          }
        />
      )}

      {/* ── PHASE 1: MEMORIZATION SCREEN ───────────────────── */}
      {phase === "memorize" && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
          maxWidth: "500px",
          margin: "0 auto",
          width: "100%",
        }}>
          <ElderCard variant="cultural" accentColor="#b45309">
            <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "#fef3c7",
                padding: "0.3rem 0.8rem",
                borderRadius: "999px",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#92400e",
                marginBottom: "0.5rem",
              }}>
                <span>📖</span>
                <span>
                  {language === "as"
                    ? "পদক্ষেপ ১: মনত ৰাখক • Step 1: Memorize"
                    : language === "hi"
                    ? "चरण १: याद रखें • Step 1: Memorize"
                    : language === "bn"
                    ? "পদক্ষেপ ১: মনে রাখুন • Step 1: Memorize"
                    : "Step 1: Memorize Recipe"}
                </span>
              </div>

              <h1 style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                color: "var(--gray-900)",
                margin: "0.25rem 0",
              }}>
                {getRecipeTitle(currentRecipe)}
              </h1>
              <div style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#b45309",
                marginBottom: "0.4rem",
              }}>
                {currentRecipe.region}
              </div>

              <p style={{
                fontSize: "0.95rem",
                color: "var(--gray-600)",
                lineHeight: 1.45,
                margin: "0.5rem 0 1.25rem",
              }}>
                {currentRecipe.description}
              </p>

              <div style={{
                background: "var(--white)",
                border: "2px dashed #f59e0b",
                borderRadius: "var(--radius-lg)",
                padding: "1rem",
                marginBottom: "1.25rem",
              }}>
                <div style={{
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  color: "#b45309",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.75rem",
                }}>
                  {language === "as"
                    ? "বিচাৰি উলিয়াব লগা ৩ বিধ সামগ্ৰী • 3 Ingredients to Find:"
                    : language === "hi"
                    ? "खोजने के लिए ३ सामग्रियां • 3 Ingredients to Find:"
                    : language === "bn"
                    ? "খুঁজে বের করার ৩টি উপাদান • 3 Ingredients to Find:"
                    : "3 Ingredients to Find:"}
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "0.75rem",
                }}>
                  {currentRecipe.ingredients.map((ingId) => {
                    const item = HAAT_PRODUCE.find((p) => p.id === ingId);
                    if (!item) return null;
                    const label = getProduceLabel(item);
                    return (
                      <div
                        key={ingId}
                        style={{
                          background: "#fffbeb",
                          border: "1.5px solid #fde68a",
                          borderRadius: "var(--radius)",
                          padding: "0.6rem 0.4rem",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                          boxShadow: "var(--shadow-sm)",
                        }}
                      >
                        <span style={{ fontSize: "2.4rem", marginBottom: "0.25rem" }}>{item.emoji}</span>
                        <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--gray-900)" }}>
                          {label}
                        </span>
                        {language !== "en" && (
                          <span style={{ fontSize: "0.75rem", color: "var(--gray-600)", fontWeight: 600 }}>
                            {item.name}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleStartShopping}
                style={{
                  width: "100%",
                  minHeight: "64px",
                  background: "linear-gradient(135deg, #d97706, #b45309)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "var(--radius-lg)",
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  boxShadow: "0 4px 14px rgba(180, 83, 9, 0.35)",
                  transition: "transform 0.15s ease",
                }}
              >
                <span>🛒</span>
                <span>
                  {language === "as"
                    ? "মই মনত ৰাখিছোঁ • Start Shopping"
                    : language === "hi"
                    ? "मुझे याद है • खरीदारी शुरू करें"
                    : language === "bn"
                    ? "আমার মনে আছে • কেনাকাটা শুরু করুন"
                    : "I Remember • Start Shopping"}
                </span>
              </button>
            </div>
          </ElderCard>
        </div>
      )}

      {/* ── PHASE 2: DISTRACTOR / HAAT TRANSITION ─────────── */}
      {phase === "distractor" && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          textAlign: "center",
          padding: "2rem",
        }}>
          <div style={{
            fontSize: "4.5rem",
            marginBottom: "1rem",
            animation: "pulse 1.5s infinite ease-in-out",
          }}>
            🏪
          </div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--gray-900)" }}>
            {language === "as"
              ? "দৈনিক হাট মুকলি হ'ল!"
              : language === "hi"
              ? "दैनिक ग्रामीण हाट खुल गया!"
              : language === "bn"
              ? "দৈনিক হাট খুলে গেছে!"
              : "The Rural Haat is Open!"}
          </h2>
          <p style={{ fontSize: "1.15rem", color: "#b45309", fontWeight: 700, marginTop: "0.5rem" }}>
            {language === "as" ? "পোহাৰী সকল সাজু হৈছে!" : "The Rural Haat Stalls are Ready!"}
          </p>
          <p style={{ fontSize: "0.95rem", color: "var(--gray-600)", maxWidth: "340px", margin: "0.5rem auto 1.5rem" }}>
            Recalling the recipe ingredients from memory... Entering the weekly market!
          </p>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#fef3c7",
            border: "3px solid #f59e0b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "#92400e",
          }}>
            {distractorCounter}
          </div>
        </div>
      )}

      {/* ── PHASE 3: SHOPPING & MARKET BROWSING ────────────── */}
      {phase === "shopping" && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {/* Active Cane Basket Bar */}
          <div style={{
            background: "#fffbeb",
            border: "1.5px solid #fde68a",
            borderRadius: "var(--radius-lg)",
            padding: "0.85rem 1rem",
            marginBottom: "0.85rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.8rem" }}>🧺</span>
              <div>
                <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--gray-900)" }}>
                  {language === "as"
                    ? "বাঁহৰ খৰাহী • Cane Basket"
                    : language === "hi"
                    ? "बांस की टोकरी • Cane Basket"
                    : language === "bn"
                    ? "বাঁশের ঝুড়ি • Cane Basket"
                    : "Cane Basket"}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#b45309", fontWeight: 700 }}>
                  Recipe: {getRecipeTitle(currentRecipe)}
                </div>
              </div>
            </div>

            <div style={{
              background: missingCount === 0 ? "var(--green)" : "#fef3c7",
              color: missingCount === 0 ? "var(--white)" : "#92400e",
              padding: "0.35rem 0.75rem",
              borderRadius: "999px",
              fontSize: "0.85rem",
              fontWeight: 800,
              border: "1px solid #fde68a",
            }}>
              {collectedCount} / {currentRecipe.ingredients.length} Collected
            </div>
          </div>

          {/* Market Stall Filter Tabs */}
          <div style={{
            display: "flex",
            gap: "0.4rem",
            overflowX: "auto",
            paddingBottom: "0.5rem",
            marginBottom: "0.75rem",
          }}>
            {STALLS.map((stall) => {
              const isActive = activeStall === stall.id;
              return (
                <button
                  key={stall.id}
                  onClick={() => {
                    playBeep(420, 80);
                    setActiveStall(stall.id);
                  }}
                  style={{
                    background: isActive ? stall.color : "var(--white)",
                    color: isActive ? "#ffffff" : "var(--gray-700)",
                    border: isActive ? "none" : "1.5px solid var(--gray-200)",
                    borderRadius: "var(--radius)",
                    padding: "0.5rem 0.85rem",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    minHeight: "44px",
                    boxShadow: isActive ? "var(--shadow-sm)" : "none",
                  }}
                >
                  <span>{stall.icon}</span>
                  <span>{getStallLabel(stall)}</span>
                </button>
              );
            })}
          </div>

          {/* Market Produce Grid with AACB Golden Halo & Dimming */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "0.75rem",
            flex: 1,
            alignContent: "start",
          }}>
            {displayedProduce.map((item) => {
              const inBasket = basket.includes(item.id);
              const isRequired = currentRecipe.ingredients.includes(item.id);
              const isMissingRequired = isRequired && !inBasket;

              let cardClass = "";
              if (aacbState.triggered && isMissingRequired) {
                cardClass = "aacb-golden-halo aacb-expanded-hitbox";
              } else if (aacbState.triggered && !isRequired) {
                cardClass = "aacb-dimmed";
              }

              const produceLabel = getProduceLabel(item);

              return (
                <button
                  key={item.id}
                  className={cardClass}
                  onClick={(e) => handleItemTap(item, e)}
                  style={{
                    background: inBasket
                      ? isRequired ? "#ecfdf5" : "#fef2f2"
                      : isMissingRequired && aacbState.triggered
                      ? "#fffbeb"
                      : "var(--white)",
                    border: inBasket
                      ? isRequired ? "2.5px solid var(--green)" : "2.5px solid #f87171"
                      : isMissingRequired && aacbState.triggered
                      ? "3px solid #f59e0b"
                      : "1.5px solid var(--gray-200)",
                    borderRadius: "var(--radius-lg)",
                    minHeight: "130px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.75rem 0.5rem",
                    cursor: "pointer",
                    textAlign: "center",
                    position: "relative",
                    boxShadow: inBasket ? "var(--shadow-md)" : "var(--shadow-sm)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: "2.5rem", marginBottom: "0.35rem" }}>
                    {item.emoji}
                  </span>
                  <span style={{
                    fontSize: "0.95rem",
                    fontWeight: 800,
                    color: "var(--gray-900)",
                    lineHeight: 1.2,
                  }}>
                    {produceLabel}
                  </span>
                  {language !== "en" && (
                    <span style={{
                      fontSize: "0.75rem",
                      color: "var(--gray-500)",
                      fontWeight: 600,
                      marginTop: "0.15rem",
                    }}>
                      {item.name}
                    </span>
                  )}

                  {inBasket && (
                    <div style={{
                      marginTop: "0.4rem",
                      background: isRequired ? "var(--green)" : "#ef4444",
                      color: "#ffffff",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "999px",
                    }}>
                      {isRequired
                        ? (language === "as" ? "✓ খৰাহীত আছে" : language === "hi" ? "✓ टोकरी में है" : language === "bn" ? "✓ ঝুড়িতে আছে" : "✓ In Basket")
                        : (language === "as" ? "অপ্ৰয়োজনীয় (হটাওক)" : language === "hi" ? "अनावश्यक (हटाएं)" : language === "bn" ? "অপ্রয়োজনীয় (সরান)" : "Remove")}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{
            marginTop: "1.25rem",
            textAlign: "center",
            fontSize: "0.8rem",
            color: "var(--gray-500)",
          }}>
            Clinical Domain: Delayed Episodic Memory, Working Memory & Category Fluency
          </div>
        </div>
      )}

      {/* ── PHASE 4: WOODEN TOKEN CURRENCY EXCHANGE ─────────── */}
      {phase === "checkout" && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          maxWidth: "480px",
          margin: "0 auto",
          width: "100%",
        }}>
          <ElderCard variant="cultural" accentColor="#b45309">
            <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.35rem" }}>🪙</div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--gray-900)" }}>
                {language === "as"
                  ? "হাটীয়া দোকানীৰ হিচাপ"
                  : language === "hi"
                  ? "दुकानदार का हिसाब"
                  : language === "bn"
                  ? "দোকানির হিসাব"
                  : "Market Checkout"}
              </h2>
              <p style={{ fontSize: "1.05rem", fontWeight: 700, color: "#b45309", margin: "0.25rem 0 0.75rem" }}>
                {language === "as"
                  ? "বজাৰৰ হিচাপ • কাঠেৰে তৈয়াৰী মুদ্ৰা"
                  : language === "hi"
                  ? "बाज़ार भुगतान • लकड़ी के सिक्के"
                  : language === "bn"
                  ? "বাজারের বিল • কাঠের কয়েন"
                  : "Wooden Token Currency Exchange"}
              </p>
              <p style={{ fontSize: "0.95rem", color: "var(--gray-600)", marginBottom: "1.25rem" }}>
                All recipe ingredients gathered! Tap the wooden tokens below to pay the stall vendor.
              </p>

              {/* Basket Recap */}
              <div style={{
                background: "#f0fdf4",
                border: "1.5px solid #bbf7d0",
                borderRadius: "var(--radius)",
                padding: "0.75rem",
                display: "flex",
                justifyContent: "center",
                gap: "1.25rem",
                marginBottom: "1.5rem",
              }}>
                {currentRecipe.ingredients.map((ingId) => {
                  const item = HAAT_PRODUCE.find((p) => p.id === ingId);
                  return (
                    <div key={ingId} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <span style={{ fontSize: "1.4rem" }}>{item?.emoji}</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#166534" }}>
                        {item ? getProduceLabel(item) : ""}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Wooden Coins to Tap */}
              <div style={{
                fontSize: "0.88rem",
                fontWeight: 800,
                color: "#92400e",
                marginBottom: "0.85rem",
                textTransform: "uppercase",
              }}>
                {language === "as"
                  ? `পোহাৰীক দিব লগা: ${currentRecipe.tokenCost - tokensPaid} টকা বাকী`
                  : language === "hi"
                  ? `दुकानदार को दें: ${currentRecipe.tokenCost - tokensPaid} टोकन शेष`
                  : language === "bn"
                  ? `দোকানিকে দিতে হবে: ${currentRecipe.tokenCost - tokensPaid} টোকেন বাকি`
                  : `${currentRecipe.tokenCost - tokensPaid} Tokens Remaining`}
              </div>

              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}>
                {Array.from({ length: currentRecipe.tokenCost }).map((_, idx) => {
                  const isPaid = idx < tokensPaid;
                  const tokenSymbol = isPaid
                    ? "✓"
                    : language === "as"
                    ? "₹ ১"
                    : language === "hi"
                    ? "₹ १"
                    : language === "bn"
                    ? "₹ ১"
                    : "🪙 1";
                  const tokenSub = isPaid
                    ? "Paid"
                    : language === "as"
                    ? "টকা"
                    : language === "hi"
                    ? "रुपया"
                    : language === "bn"
                    ? "টাকা"
                    : "Token";

                  return (
                    <button
                      key={idx}
                      onClick={() => handlePayToken(idx)}
                      disabled={isPaid}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: isPaid
                          ? "#e5e7eb"
                          : "radial-gradient(circle at 30% 30%, #fde047, #d97706)",
                        border: isPaid
                          ? "2px solid #d1d5db"
                          : "3px solid #b45309",
                        color: isPaid ? "#9ca3af" : "#78350f",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.1rem",
                        fontWeight: 900,
                        cursor: isPaid ? "default" : "pointer",
                        boxShadow: isPaid ? "none" : "0 6px 16px rgba(180, 83, 9, 0.4)",
                        transform: isPaid ? "scale(0.9)" : "scale(1)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span>{tokenSymbol}</span>
                      <span style={{ fontSize: "0.65rem", fontWeight: 800 }}>
                        {tokenSub}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div style={{
                fontSize: "0.8rem",
                color: "var(--gray-500)",
              }}>
                Clinical Mechanism: Calculation & Tactile Motor Exchange
              </div>
            </div>
          </ElderCard>
        </div>
      )}
    </div>
  );
}
