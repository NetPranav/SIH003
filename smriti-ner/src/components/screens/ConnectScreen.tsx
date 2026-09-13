"use client";

import { useState } from "react";
import type { ScreenId } from "@/lib/types";
import { playGentleChime, playTone, playSuccessChime } from "@/lib/audio";
import { SEED_FOLKLORE_COLLECTION, type FolkStory } from "@/lib/seedFolklorePack";
import { FOUR_STAGE_INTERVIEW_PROTOCOL } from "@/lib/elderInterviewGuide";

interface Props {
  navigate: (target: ScreenId) => void;
}

export default function ConnectScreen({ navigate }: Props) {
  const [activeTab, setActiveTab] = useState<"family" | "circle" | "stories">("family");

  // Stories Sub-tab state
  const [storyMode, setStoryMode] = useState<"player" | "record">("player");
  const [selectedStory, setSelectedStory] = useState<FolkStory>(SEED_FOLKLORE_COLLECTION[0]);
  const [isPlayingStory, setIsPlayingStory] = useState<boolean>(false);

  // Elder Interview Record state
  const [currentInterviewStage, setCurrentInterviewStage] = useState<number>(1);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSaved, setRecordingSaved] = useState<boolean>(false);

  const handlePlayStory = () => {
    setIsPlayingStory(true);
    playTone(520, 0.6, "sine");
    setTimeout(() => {
      playTone(660, 0.8, "sine");
    }, 400);
  };

  const handleStopStory = () => {
    setIsPlayingStory(false);
  };

  const handleStartRecording = () => {
    playGentleChime();
    setIsRecording(true);
    setRecordingSaved(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    playSuccessChime();
    setRecordingSaved(true);
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
              Social Connect
            </h1>
            <p style={{
              fontSize: "0.8rem",
              color: "var(--gray-500)"
            }}>
              পৰিয়াল আৰু সমাজ সংযোগ
            </p>
          </div>
        </div>

        <span style={{
          padding: "0.35rem 0.75rem",
          background: "#dcfce7",
          border: "1px solid #bbf7d0",
          borderRadius: "999px",
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#166534"
        }}>
          Active Circle
        </span>
      </div>

      {/* Tabs */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "0.5rem",
        marginBottom: "1.25rem"
      }}>
        <button
          onClick={() => setActiveTab("family")}
          style={{
            padding: "0.6rem 0.4rem",
            borderRadius: "var(--radius)",
            border: activeTab === "family" ? "2px solid var(--primary)" : "1px solid var(--gray-200)",
            background: activeTab === "family" ? "var(--primary)" : "var(--gray-50)",
            color: activeTab === "family" ? "#fff" : "var(--gray-700)",
            fontWeight: 700,
            fontSize: "0.78rem",
            cursor: "pointer"
          }}
        >
          Grandchildren
        </button>
        <button
          onClick={() => setActiveTab("circle")}
          style={{
            padding: "0.6rem 0.4rem",
            borderRadius: "var(--radius)",
            border: activeTab === "circle" ? "2px solid var(--primary)" : "1px solid var(--gray-200)",
            background: activeTab === "circle" ? "var(--primary)" : "var(--gray-50)",
            color: activeTab === "circle" ? "#fff" : "var(--gray-700)",
            fontWeight: 700,
            fontSize: "0.78rem",
            cursor: "pointer"
          }}
        >
          Elders Circle
        </button>
        <button
          onClick={() => setActiveTab("stories")}
          style={{
            padding: "0.6rem 0.4rem",
            borderRadius: "var(--radius)",
            border: activeTab === "stories" ? "2px solid var(--primary)" : "1px solid var(--gray-200)",
            background: activeTab === "stories" ? "var(--primary)" : "var(--gray-50)",
            color: activeTab === "stories" ? "#fff" : "var(--gray-700)",
            fontWeight: 700,
            fontSize: "0.78rem",
            cursor: "pointer"
          }}
        >
          Legacy Tales
        </button>
      </div>

      {/* Tab 1: Grandchildren Co-Play */}
      {activeTab === "family" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "var(--radius-lg)",
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.85rem"
          }}>
            <div style={{ fontSize: "2rem" }}>👧🏻</div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e40af" }}>
                Priya played Dhol-Pepa today!
              </div>
              <div style={{ fontSize: "0.8rem", color: "#2563eb" }}>
                She solved 3 rounds in Bangalore and sent you a video greeting.
              </div>
            </div>
          </div>

          <div style={{
            background: "var(--white)",
            border: "1.5px solid var(--gray-200)",
            borderRadius: "var(--radius-lg)",
            padding: "1.1rem",
            boxShadow: "var(--shadow-sm)"
          }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.35rem" }}>
              Async Co-Play Match
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--gray-600)", lineHeight: 1.45, marginBottom: "1rem" }}>
              Take turn with your grandchildren across distances. Build cognitive endurance together without digital overwhelm.
            </p>
            <button
              onClick={() => navigate("dhol-pepa")}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius)",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              Play Grandchild's Challenge (Dhol-Pepa)
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Elders Circle */}
      {activeTab === "circle" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "var(--radius-lg)",
            padding: "1rem"
          }}>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#166534" }}>
              Guwahati Elders Reminiscence Circle
            </div>
            <div style={{ fontSize: "0.8rem", color: "#15803d", marginTop: "0.2rem" }}>
              Weekly virtual audio gathering • Moderated by ASHA worker Kalpana Barman.
            </div>
          </div>

          <div style={{
            background: "var(--white)",
            border: "1.5px solid var(--gray-200)",
            borderRadius: "var(--radius-lg)",
            padding: "1.1rem",
            boxShadow: "var(--shadow-sm)"
          }}>
            <div style={{ fontSize: "0.85rem", color: "var(--gray-600)", marginBottom: "0.75rem" }}>
              Topic of the week: <strong>"Brahmaputra Floods & The Autumn Harvest in the 1970s"</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--gray-500)" }}>
              <span>👥 8 participants joined</span>
              <span>•</span>
              <span style={{ color: "var(--green)", fontWeight: 600 }}>Next session: Wednesday 4 PM</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Legacy Tales (Sub-Phase 1.4 Interactive Story Studio) */}
      {activeTab === "stories" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Sub-mode selector */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
            background: "var(--gray-100)",
            padding: "0.25rem",
            borderRadius: "var(--radius)"
          }}>
            <button
              onClick={() => setStoryMode("player")}
              style={{
                padding: "0.5rem",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: storyMode === "player" ? "var(--white)" : "transparent",
                fontWeight: storyMode === "player" ? 800 : 500,
                fontSize: "0.78rem",
                color: storyMode === "player" ? "var(--primary)" : "var(--gray-600)",
                cursor: "pointer"
              }}
            >
              📖 Seed Folklore Player
            </button>
            <button
              onClick={() => setStoryMode("record")}
              style={{
                padding: "0.5rem",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: storyMode === "record" ? "var(--white)" : "transparent",
                fontWeight: storyMode === "record" ? 800 : 500,
                fontSize: "0.78rem",
                color: storyMode === "record" ? "var(--primary)" : "var(--gray-600)",
                cursor: "pointer"
              }}
            >
              🎙️ Record Life-Story
            </button>
          </div>

          {/* Mode 1: Seed Folklore Player */}
          {storyMode === "player" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Active Playing Tale Card */}
              <div style={{
                background: "var(--white)",
                border: "1.5px solid var(--gray-200)",
                borderRadius: "var(--radius-xl)",
                padding: "1.25rem",
                boxShadow: "var(--shadow-sm)"
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "2.5rem" }}>{selectedStory.emoji}</span>
                    <div>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--gray-900)" }}>
                        {selectedStory.title}
                      </h3>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent)" }}>
                        {selectedStory.nativeTitle} • {selectedStory.state}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 600 }}>
                    {selectedStory.durationMinutes} min
                  </span>
                </div>

                {/* Animated Waveform if Playing */}
                {isPlayingStory && (
                  <div style={{
                    padding: "0.75rem 1rem",
                    background: "#1a1a2e",
                    borderRadius: "var(--radius)",
                    color: "#fff",
                    marginBottom: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ animation: "pulse 1.2s infinite" }}>▶</span>
                      <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Playing Authentic Audio Narration...</span>
                    </div>
                    <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                      {[12, 22, 16, 28, 14, 24, 18, 26].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            width: 3,
                            height: `${h}px`,
                            backgroundColor: "var(--accent)",
                            borderRadius: "2px",
                            animation: "pulse 0.8s infinite alternate",
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <p style={{ fontSize: "0.85rem", color: "var(--gray-700)", lineHeight: 1.5, marginBottom: "0.85rem" }}>
                  {selectedStory.fullNarrative}
                </p>

                {/* Reminiscence Prompt Box */}
                <div style={{
                  padding: "0.65rem 0.85rem",
                  background: "#eff6ff",
                  borderRadius: "var(--radius)",
                  border: "1px solid #bfdbfe",
                  fontSize: "0.8rem",
                  color: "#1e40af",
                  marginBottom: "1rem"
                }}>
                  💡 <strong>Reminiscence Reflection:</strong> {selectedStory.reminiscenceCue}
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {isPlayingStory ? (
                    <button
                      onClick={handleStopStory}
                      style={{
                        flex: 1,
                        padding: "0.75rem",
                        background: "var(--gray-200)",
                        color: "var(--gray-800)",
                        border: "none",
                        borderRadius: "var(--radius)",
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      ⏸ Pause Narration
                    </button>
                  ) : (
                    <button
                      onClick={handlePlayStory}
                      style={{
                        flex: 1,
                        padding: "0.75rem",
                        background: "var(--primary)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "var(--radius)",
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem"
                      }}
                    >
                      <span>▶</span>
                      <span>Listen to Folk Tale</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Tale Selector List */}
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--gray-900)" }}>
                Choose another regional folk tale:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {SEED_FOLKLORE_COLLECTION.map((story) => {
                  const isSelected = selectedStory.id === story.id;
                  return (
                    <div
                      key={story.id}
                      onClick={() => {
                        setSelectedStory(story);
                        setIsPlayingStory(false);
                      }}
                      style={{
                        padding: "0.75rem 0.85rem",
                        background: isSelected ? "#fdfbf7" : "var(--white)",
                        border: isSelected ? "1.5px solid var(--accent)" : "1px solid var(--gray-200)",
                        borderRadius: "var(--radius)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        transition: "all var(--transition)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                        <span style={{ fontSize: "1.5rem" }}>{story.emoji}</span>
                        <div>
                          <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--gray-900)" }}>
                            {story.title}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>
                            {story.state} • {story.nativeTitle}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 700 }}>
                        {isSelected ? "● Selected" : "Select →"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode 2: Record Elder Life-Story */}
          {storyMode === "record" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Stage Progress Bar */}
              <div style={{
                background: "var(--gray-50)",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--gray-200)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  <span style={{ color: "var(--primary)" }}>Stage {currentInterviewStage} of 4</span>
                  <span style={{ color: "var(--accent)" }}>
                    {FOUR_STAGE_INTERVIEW_PROTOCOL[currentInterviewStage - 1].stageTitle}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[1, 2, 3, 4].map((stg) => (
                    <div
                      key={stg}
                      onClick={() => setCurrentInterviewStage(stg)}
                      style={{
                        flex: 1,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: stg <= currentInterviewStage ? "var(--primary)" : "var(--gray-200)",
                        cursor: "pointer"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Guided Prompt Card */}
              <div style={{
                background: "var(--white)",
                border: "1.5px solid var(--gray-200)",
                borderRadius: "var(--radius-xl)",
                padding: "1.25rem",
                boxShadow: "var(--shadow-sm)"
              }}>
                <div style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.25rem"
                }}>
                  {FOUR_STAGE_INTERVIEW_PROTOCOL[currentInterviewStage - 1].targetLifeSpan}
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.25rem" }}>
                  {FOUR_STAGE_INTERVIEW_PROTOCOL[currentInterviewStage - 1].stageTitle}
                </h3>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--gray-500)", marginBottom: "1rem" }}>
                  {FOUR_STAGE_INTERVIEW_PROTOCOL[currentInterviewStage - 1].nativeTitle}
                </div>

                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--gray-800)", marginBottom: "0.4rem" }}>
                  Suggested questions for Bor-Deuta:
                </div>
                <ul style={{ paddingLeft: "1.2rem", fontSize: "0.8rem", color: "var(--gray-600)", lineHeight: 1.45, marginBottom: "1rem" }}>
                  {FOUR_STAGE_INTERVIEW_PROTOCOL[currentInterviewStage - 1].coreQuestions.map((q, idx) => (
                    <li key={idx} style={{ marginBottom: "0.3rem" }}>{q}</li>
                  ))}
                </ul>

                <div style={{
                  padding: "0.55rem 0.75rem",
                  background: "#fef3c7",
                  borderRadius: "var(--radius)",
                  border: "1px solid #fde68a",
                  fontSize: "0.75rem",
                  color: "#92400e",
                  marginBottom: "1.25rem"
                }}>
                  💡 <strong>Caregiver Tip:</strong> {FOUR_STAGE_INTERVIEW_PROTOCOL[currentInterviewStage - 1].compassionateTip}
                </div>

                {/* Recording Feedback */}
                {isRecording && (
                  <div style={{
                    padding: "0.75rem",
                    background: "#fef2f2",
                    border: "1.5px solid #fca5a5",
                    borderRadius: "var(--radius)",
                    color: "#991b1b",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    textAlign: "center",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem"
                  }}>
                    <span style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: "#dc2626",
                      animation: "pulse 1s infinite"
                    }} />
                    <span>Recording in Progress... (Microphone Active)</span>
                  </div>
                )}

                {recordingSaved && (
                  <div style={{
                    padding: "0.75rem",
                    background: "#f0fdf4",
                    border: "1.5px solid #86efac",
                    borderRadius: "var(--radius)",
                    color: "#166534",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    textAlign: "center",
                    marginBottom: "1rem"
                  }}>
                    ✓ Story chapter preserved and encrypted in Family Cloud!
                  </div>
                )}

                {/* Recording Controls */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {isRecording ? (
                    <button
                      onClick={handleStopRecording}
                      style={{
                        flex: 1,
                        padding: "0.8rem",
                        background: "#dc2626",
                        color: "#fff",
                        border: "none",
                        borderRadius: "var(--radius)",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      ⏹ Stop & Save Story
                    </button>
                  ) : (
                    <button
                      onClick={handleStartRecording}
                      style={{
                        flex: 1,
                        padding: "0.8rem",
                        background: "var(--primary)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "var(--radius)",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem"
                      }}
                    >
                      <span>🎙️</span>
                      <span>Record Answer</span>
                    </button>
                  )}

                  {currentInterviewStage < 4 && (
                    <button
                      onClick={() => {
                        setCurrentInterviewStage((s) => s + 1);
                        setRecordingSaved(false);
                      }}
                      style={{
                        padding: "0.8rem 1rem",
                        background: "var(--gray-100)",
                        border: "1px solid var(--gray-300)",
                        borderRadius: "var(--radius)",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "var(--gray-800)",
                        cursor: "pointer"
                      }}
                    >
                      Next Stage →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
