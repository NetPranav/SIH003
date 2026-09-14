"use client";

import { useState, useEffect } from "react";
import type { ScreenId } from "@/lib/types";
import { playGentleChime } from "@/lib/audio";
import { ALBUM_SCREEN_LOCALES } from "@/lib/screenLocalizations";
import { offlineMobileStore, type OfflineAlbumPhoto } from "@/lib/offlineMobileStorage";
import { speakSpokenVoice } from "@/lib/audioVoiceService";

interface Props {
  navigate: (target: ScreenId) => void;
  language?: string;
}

export default function AlbumScreen({ navigate, language = "en" }: Props) {
  const loc = ALBUM_SCREEN_LOCALES[language] || ALBUM_SCREEN_LOCALES.en;
  const [photos, setPhotos] = useState<OfflineAlbumPhoto[]>(() => offlineMobileStore.getAlbumPhotos());
  const [playingStoryId, setPlayingStoryId] = useState<string | null>(null);

  useEffect(() => {
    return offlineMobileStore.subscribe(() => {
      setPhotos(offlineMobileStore.getAlbumPhotos());
    });
  }, []);

  const handlePlayStory = (id: string) => {
    playGentleChime();
    setPlayingStoryId(id);
    const photo = photos.find((p) => p.id === id);
    if (photo) {
      offlineMobileStore.recordReminiscence(photo.id, photo.title);
      speakSpokenVoice(photo.caption, language);
    }
    setTimeout(() => setPlayingStoryId(null), 4500);
  };

  return (
    <div style={{
      padding: "1.25rem 1.25rem 6rem",
      backgroundColor: "var(--white)",
      minHeight: "100dvh"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.25rem",
        paddingBottom: "0.85rem",
        borderBottom: "1px solid var(--gray-200)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={() => navigate("home")}
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
          <div>
            <h1 style={{
              fontSize: "1.35rem",
              fontWeight: 800,
              color: "var(--gray-900)"
            }}>
              {loc.headerTitle}
            </h1>
            <p style={{
              fontSize: "0.8rem",
              color: "var(--gray-500)"
            }}>
              {loc.headerSubtitle}
            </p>
          </div>
        </div>

        <span style={{
          padding: "0.35rem 0.75rem",
          background: "var(--gray-50)",
          border: "1px solid var(--gray-200)",
          borderRadius: "999px",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "var(--accent)"
        }}>
          {loc.reminiscenceBadge}
        </span>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem"
      }}>
        {photos.map((p) => {
          const isPlaying = playingStoryId === p.id;
          return (
            <div
              key={p.id}
              style={{
                background: "var(--white)",
                border: "1.5px solid var(--gray-200)",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              {/* Real Photograph with Cultural Warm Frame */}
              <div style={{
                position: "relative",
                width: "100%",
                height: "220px",
                backgroundColor: "#0f172a",
                overflow: "hidden",
                borderBottom: "1px solid var(--gray-200)",
              }}>
                <img
                  src={p.image}
                  alt={p.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  loading="lazy"
                />
                <span style={{
                  position: "absolute",
                  bottom: "0.75rem",
                  right: "0.75rem",
                  background: "rgba(0, 0, 0, 0.72)",
                  backdropFilter: "blur(4px)",
                  color: "#ffffff",
                  fontSize: "0.8rem",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "999px",
                  fontWeight: 700,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}>
                  {p.year}
                </span>
              </div>

              {/* Photo Caption & Life Story Details */}
              <div style={{ padding: "1.1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--gray-900)" }}>
                    {language === "en" ? p.title : (p.nativeTitle || p.title)}
                  </h3>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)" }}>
                    {p.relation}
                  </span>
                </div>
                {language !== "en" && (
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--gray-600)", marginBottom: "0.5rem" }}>
                    {p.title}
                  </div>
                )}
                <p style={{ fontSize: "0.85rem", color: "var(--gray-600)", lineHeight: 1.45, marginBottom: "0.85rem" }}>
                  {p.caption}
                </p>

                {isPlaying && (
                  <div style={{
                    padding: "0.6rem 0.85rem",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "var(--radius)",
                    color: "#166534",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    marginBottom: "0.85rem"
                  }}>
                    {loc.playingAudioText}
                  </div>
                )}

                <button
                  onClick={() => handlePlayStory(p.id)}
                  style={{
                    width: "100%",
                    padding: "0.65rem",
                    background: "var(--gray-50)",
                    border: "1px solid var(--gray-200)",
                    borderRadius: "var(--radius)",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--primary)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem"
                  }}
                >
                  <span>🎙️</span>
                  <span>{loc.listenBtn}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
