"use client";

import { LANGUAGES } from "@/lib/constants";
import { playBeep } from "@/lib/audio";

interface Props {
  onSelect: (code: string) => void;
}

export default function LanguageScreen({ onSelect }: Props) {
  const handleSelect = (code: string) => {
    playBeep(523.25, 120); // Pleasant C5 chime
    onSelect(code);
  };

  return (
    <div style={{
      minHeight: "100dvh",
      padding: "2rem 1.25rem 3rem",
      backgroundColor: "var(--white)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{
          fontSize: "2.5rem",
          marginBottom: "0.5rem"
        }}>
          🗣️
        </div>
        <h2 style={{
          fontSize: "1.65rem",
          fontWeight: 800,
          color: "var(--gray-900)",
          marginBottom: "0.25rem"
        }}>
          Choose Your Language
        </h2>
        <p style={{
          fontSize: "1.1rem",
          color: "var(--primary)",
          fontWeight: 600,
          marginBottom: "0.25rem"
        }}>
          আপোনাৰ ভাষা বাছনি কৰক
        </p>
        <p style={{
          fontSize: "0.85rem",
          color: "var(--gray-500)"
        }}>
          Tap your preferred language to continue
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.85rem",
        width: "100%",
        maxWidth: "420px",
        margin: "0 auto"
      }}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            style={{
              padding: "1.1rem 0.75rem",
              background: "var(--white)",
              border: "1.5px solid var(--gray-200)",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              cursor: "pointer",
              transition: "all var(--transition)",
              boxShadow: "var(--shadow-sm)",
              minHeight: "84px",
              textAlign: "center"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--gray-200)";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            }}
          >
            <span style={{
              fontSize: "1.45rem",
              fontWeight: 700,
              color: "var(--gray-900)",
              lineHeight: 1.2
            }}>
              {lang.native}
            </span>
            <span style={{
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "var(--gray-500)"
            }}>
              {lang.english}
            </span>
          </button>
        ))}
      </div>

      <div style={{
        marginTop: "2.5rem",
        textAlign: "center",
        padding: "0.75rem",
        background: "var(--gray-50)",
        borderRadius: "var(--radius)",
        border: "1px solid var(--gray-200)",
        maxWidth: "420px",
        margin: "2.5rem auto 0"
      }}>
        <p style={{ fontSize: "0.8rem", color: "var(--gray-600)" }}>
          🔊 Multilingual Audio Prompt enabled by default for cognitive comfort
        </p>
      </div>
    </div>
  );
}
