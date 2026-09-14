// ── SMRITI-NER GAME 4: DAILY HAAT RECALL (দৈনিক হাটৰ স্মৃতি) ───────────────────
// Sub-Phase 4.4: Authentic rural Haat stalls, local produce, recipe cards,
// delayed recall protocol, wooden token currency exchange, and telemetry.

"use client";

import React, { useState, useEffect, useRef } from "react";
import type { ScreenId } from "@/lib/types";
import { playGentleChime, playSuccessJingle, playBeep } from "@/lib/audio";
import { decomposeLatency } from "@/lib/dcdaEngine";
import { sessionManager } from "@/lib/gameSessionManager";
import { type DifficultyTier, getTierConfig } from "@/lib/difficultyStateMachine";
import ElderCard from "@/components/ui/ElderCard";

interface Props {
  navigate: (target: ScreenId) => void;
  showSuccess: (time: string, accuracy: string, onNext?: () => void) => void;
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

export default function DailyHaatGame({ navigate, showSuccess }: Props) {
  const [tier, setTier] = useState<DifficultyTier>(2);
  const tierConfig = getTierConfig(tier);

  const [recipeIndex, setRecipeIndex] = useState<number>(0);
  const [phase, setPhase] = useState<GamePhase>("memorize");
  const [activeStall, setActiveStall] = useState<"all" | "veggies" | "fish" | "spices" | "tea">("all");
  const [basket, setBasket] = useState<string[]>([]);
  const [tokensPaid, setTokensPaid] = useState<number>(0);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [distractorCounter, setDistractorCounter] = useState<number>(4);

  const startTimeRef = useRef<number>(Date.now());
  const interactionStartRef = useRef<number>(Date.now());
  const consecutiveMissesRef = useRef<number>(0);

  const currentRecipe = REGIONAL_RECIPES[recipeIndex % REGIONAL_RECIPES.length];

  // Initialize session on mount
  useEffect(() => {
    sessionManager.startSession({
      gameId: "daily-haat",
      conceptId: "delayed_episodic_recall",
      initialTier: tier,
    });
    startTimeRef.current = Date.now();
    interactionStartRef.current = Date.now();
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

    playBeep(480, 110);

    // If item already in basket, allow gentle removal without penalty
    if (basket.includes(item.id)) {
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
      consecutiveMissesRef.current = 0;
      setHintMessage(null);

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
      // Gentle AACB assist on non-target item
      consecutiveMissesRef.current += 1;
      const newBasket = [...basket, item.id];
      setBasket(newBasket);

      if (consecutiveMissesRef.current >= 2) {
        // Find missing target item and give a calm location hint
        const missingId = currentRecipe.ingredients.find((ing) => !newBasket.includes(ing));
        const missingProduce = HAAT_PRODUCE.find((p) => p.id === missingId);
        if (missingProduce) {
          const stallObj = STALLS.find((s) => s.id === missingProduce.stall);
          setHintMessage(`পোহাৰীৰ টিপ: ${missingProduce.native} (${missingProduce.name}) '${stallObj?.native}' ত পোৱা যাব!`);
        }
      }
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
          setHintMessage(null);
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
      backgroundColor: "var(--background)",
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* ── Top Bar ────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1rem",
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
            দৈনিক হাটৰ স্মৃতি
          </h2>
          <span style={{ fontSize: "0.85rem", color: "#b45309", fontWeight: 700 }}>
            Daily Haat Recall • Recipe {recipeIndex + 1} of {REGIONAL_RECIPES.length}
          </span>
        </div>

        <div style={{
          background: "#fef3c7",
          border: "1.5px solid #fde68a",
          borderRadius: "var(--radius)",
          padding: "0.35rem 0.65rem",
          fontSize: "0.82rem",
          fontWeight: 800,
          color: "#92400e",
        }}>
          Tier {tier}
        </div>
      </div>

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
                <span>পদক্ষেপ ১: মনত ৰাখক • Step 1: Memorize</span>
              </div>

              <h1 style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                color: "var(--gray-900)",
                margin: "0.25rem 0",
              }}>
                {currentRecipe.native}
              </h1>
              <div style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#b45309",
                marginBottom: "0.4rem",
              }}>
                {currentRecipe.name} ({currentRecipe.region})
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
                  বিচাৰি উলিয়াব লগা ৩ বিধ সামগ্ৰী • 3 Ingredients to Find:
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "0.75rem",
                }}>
                  {currentRecipe.ingredients.map((ingId) => {
                    const item = HAAT_PRODUCE.find((p) => p.id === ingId);
                    if (!item) return null;
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
                          {item.native}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--gray-600)", fontWeight: 600 }}>
                          {item.name}
                        </span>
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
                <span>মই মনত ৰাখিছোঁ • Start Shopping</span>
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
            দৈনিক হাট মুকলি হ'ল!
          </h2>
          <p style={{ fontSize: "1.15rem", color: "#b45309", fontWeight: 700, marginTop: "0.5rem" }}>
            The Rural Haat Stalls are Ready!
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
                  বাঁহৰ খৰাহী • Cane Basket
                </div>
                <div style={{ fontSize: "0.78rem", color: "#b45309", fontWeight: 700 }}>
                  Recipe: {currentRecipe.native} ({currentRecipe.name})
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

          {/* Hint Message (AACB Assist) */}
          {hintMessage && (
            <div style={{
              background: "#eff6ff",
              border: "1.5px solid #bfdbfe",
              borderRadius: "var(--radius)",
              padding: "0.6rem 0.85rem",
              marginBottom: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.9rem",
              color: "#1e40af",
              fontWeight: 700,
            }}>
              <span>💡</span>
              <span>{hintMessage}</span>
            </div>
          )}

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
                  <span>{stall.native}</span>
                </button>
              );
            })}
          </div>

          {/* Market Produce Grid */}
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

              return (
                <button
                  key={item.id}
                  onClick={(e) => handleItemTap(item, e)}
                  style={{
                    background: inBasket
                      ? isRequired ? "#ecfdf5" : "#fef2f2"
                      : "var(--white)",
                    border: inBasket
                      ? isRequired ? "2.5px solid var(--green)" : "2.5px solid #f87171"
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
                    {item.native}
                  </span>
                  <span style={{
                    fontSize: "0.75rem",
                    color: "var(--gray-500)",
                    fontWeight: 600,
                    marginTop: "0.15rem",
                  }}>
                    {item.name}
                  </span>

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
                      {isRequired ? "✓ খৰাহীত আছে" : "অপ্ৰয়োজনীয় (Tap to remove)"}
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
                হাটীয়া দোকানীৰ হিচাপ
              </h2>
              <p style={{ fontSize: "1.05rem", fontWeight: 700, color: "#b45309", margin: "0.25rem 0 0.75rem" }}>
                Market Checkout • Wooden Token Exchange
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
                        {item?.native}
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
                পোহাৰীক দিব লগা: {currentRecipe.tokenCost - tokensPaid} টকা বাকী • {currentRecipe.tokenCost - tokensPaid} Tokens Remaining
              </div>

              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}>
                {Array.from({ length: currentRecipe.tokenCost }).map((_, idx) => {
                  const isPaid = idx < tokensPaid;
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
                      <span>{isPaid ? "✓" : "₹ ১"}</span>
                      <span style={{ fontSize: "0.65rem", fontWeight: 800 }}>
                        {isPaid ? "Paid" : "টকা"}
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
