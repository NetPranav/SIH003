"use client";

import { useState, useRef } from "react";
import type { ScreenId } from "@/lib/types";
import { RECIPES } from "@/lib/constants";
import { playGentleChime, playSuccessJingle, playBeep } from "@/lib/audio";

interface Props {
  navigate: (target: ScreenId) => void;
  showSuccess: (time: string, accuracy: string, onNext?: () => void) => void;
}

export default function DailyHaatGame({ navigate, showSuccess }: Props) {
  const [recipeIndex, setRecipeIndex] = useState<number>(0);
  const [basket, setBasket] = useState<string[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  const currentRecipe = RECIPES[recipeIndex % RECIPES.length];

  const handleItemTap = (itemId: string) => {
    playBeep(480, 100);

    if (basket.includes(itemId)) {
      setBasket(basket.filter((id) => id !== itemId));
      return;
    }

    const newBasket = [...basket, itemId];
    setBasket(newBasket);

    // Check if all ingredients are collected
    const allFound = currentRecipe.ingredients.every((ing) => newBasket.includes(ing));

    if (allFound) {
      playGentleChime();
      setTimeout(() => {
        playSuccessJingle();
        const elapsedSec = Math.round((Date.now() - startTimeRef.current) / 1000);
        showSuccess(`${elapsedSec}s`, "100%", () => {
          setRecipeIndex((idx) => idx + 1);
          setBasket([]);
          startTimeRef.current = Date.now();
        });
      }, 800);
    }
  };

  return (
    <div style={{
      padding: "1.25rem 1.25rem 5rem",
      backgroundColor: "var(--white)",
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Top Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1rem",
        paddingBottom: "0.75rem",
        borderBottom: "1px solid var(--gray-200)"
      }}>
        <button
          onClick={() => navigate("games")}
          style={{
            background: "var(--gray-100)",
            border: "none",
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
            cursor: "pointer"
          }}
        >
          ←
        </button>

        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--gray-900)" }}>
            Daily Haat Memory
          </h2>
          <span style={{ fontSize: "0.75rem", color: "#9333ea", fontWeight: 600 }}>
            Market Stalls • Local Ingredients
          </span>
        </div>

        <div style={{ width: 40 }} />
      </div>

      {/* Recipe Goal Box */}
      <div style={{
        background: "#faf5ff",
        border: "1.5px solid #e9d5ff",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem",
        textAlign: "center",
        marginBottom: "1.25rem",
        boxShadow: "var(--shadow-sm)"
      }}>
        <span style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#7e22ce",
          textTransform: "uppercase",
          letterSpacing: "0.06em"
        }}>
          Recipe to Prepare:
        </span>
        <div style={{
          fontSize: "1.5rem",
          fontWeight: 800,
          color: "var(--gray-900)",
          marginTop: "0.25rem"
        }}>
          {currentRecipe.name}
        </div>
        <div style={{
          fontSize: "1.2rem",
          fontWeight: 700,
          color: "var(--accent)",
          marginTop: "0.15rem"
        }}>
          {currentRecipe.native}
        </div>

        <div style={{
          marginTop: "0.75rem",
          padding: "0.5rem",
          background: "var(--white)",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--gray-200)",
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          fontSize: "0.85rem",
          fontWeight: 600
        }}>
          <span>
            Needed: {currentRecipe.ingredients.length} items
          </span>
          <span>•</span>
          <span style={{ color: "var(--green)" }}>
            Collected: {currentRecipe.ingredients.filter((i) => basket.includes(i)).length}
          </span>
        </div>
      </div>

      {/* Market Items Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "0.75rem",
        flex: 1,
        alignContent: "center",
        maxWidth: "380px",
        margin: "0 auto",
        width: "100%"
      }}>
        {currentRecipe.allItems.map((item) => {
          const isSelected = basket.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleItemTap(item.id)}
              style={{
                aspectRatio: "1",
                background: isSelected ? "#f3e8ff" : "var(--white)",
                border: isSelected ? "2.5px solid #9333ea" : "1.5px solid var(--gray-200)",
                borderRadius: "var(--radius)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.25rem",
                cursor: "pointer",
                boxShadow: isSelected ? "var(--shadow-md)" : "var(--shadow-sm)",
                transition: "all var(--transition)",
                padding: "0.5rem"
              }}
            >
              <span style={{ fontSize: "2.4rem" }}>{item.emoji}</span>
              <span style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: isSelected ? "#7e22ce" : "var(--gray-700)",
                textAlign: "center"
              }}>
                {item.name}
              </span>
              {isSelected && (
                <span style={{
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  color: "#9333ea"
                }}>
                  ✓ in basket
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{
        marginTop: "1.5rem",
        textAlign: "center",
        fontSize: "0.75rem",
        color: "var(--gray-400)"
      }}>
        Clinical Domain: Executive Function, Planning & Working Memory Recall
      </div>
    </div>
  );
}
