"use client";

import type { ScreenId } from "@/lib/types";
import { DEFAULT_SCHEDULE } from "@/lib/constants";
import { playBeep } from "@/lib/audio";

interface Props {
  navigate: (target: ScreenId) => void;
}

export default function HomeScreen({ navigate }: Props) {
  const handleNav = (target: ScreenId) => {
    playBeep(440, 100);
    navigate(target);
  };

  return (
    <div style={{
      padding: "1.25rem 1.25rem 6rem",
      backgroundColor: "var(--white)",
      minHeight: "100dvh"
    }}>
      {/* Top Reassurance & Profile Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: "1rem",
        borderBottom: "1px solid var(--gray-200)",
        marginBottom: "1.25rem"
      }}>
        <div>
          <span style={{
            fontSize: "0.8rem",
            textTransform: "uppercase",
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "var(--accent)"
          }}>
            Monday • 14 September
          </span>
          <h1 style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "var(--gray-900)",
            lineHeight: 1.2
          }}>
            নমস্কাৰ, বৰদেউতা 👋
          </h1>
          <p style={{
            fontSize: "0.85rem",
            color: "var(--gray-500)",
            marginTop: "0.15rem"
          }}>
            You are safe at home in Guwahati
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.35rem" }}>
          <button
            onClick={() => handleNav("asha-worker")}
            style={{
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: "999px",
              padding: "0.45rem 0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#065f46",
              cursor: "pointer"
            }}
          >
            <span>🩺</span>
            <span>ASHA</span>
          </button>
          <button
            onClick={() => handleNav("caregiver")}
            style={{
              background: "var(--gray-50)",
              border: "1px solid var(--gray-200)",
              borderRadius: "999px",
              padding: "0.45rem 0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--gray-700)",
              cursor: "pointer"
            }}
          >
            <span>🔒</span>
            <span>Caregiver</span>
          </button>
        </div>
      </div>

      {/* Dementia Comfort & Reassurance Card */}
      <div style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        border: "1px solid #bbf7d0",
        borderRadius: "var(--radius-lg)",
        padding: "1rem 1.15rem",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.85rem"
      }}>
        <div style={{ fontSize: "2rem" }}>☀️</div>
        <div>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#166534" }}>
            Peaceful Morning Routine
          </div>
          <div style={{ fontSize: "0.8rem", color: "#15803d" }}>
            2 out of 5 daily wellness activities completed today
          </div>
        </div>
      </div>

      {/* Main 4 Action Cards (Large Accessible Hitboxes ≥ 64px) */}
      <h2 style={{
        fontSize: "1rem",
        fontWeight: 700,
        color: "var(--gray-900)",
        marginBottom: "0.75rem"
      }}>
        Daily Activities
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        marginBottom: "1.75rem"
      }}>
        {/* Card 1: Cognitive Games */}
        <button
          onClick={() => handleNav("games")}
          style={{
            background: "var(--white)",
            border: "1.5px solid var(--gray-200)",
            borderRadius: "var(--radius-lg)",
            padding: "1.25rem 1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "left",
            gap: "0.5rem",
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
            transition: "all var(--transition)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--primary)";
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--gray-200)";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            e.currentTarget.style.transform = "none";
          }}
        >
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
            <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--gray-900)" }}>
              Cognitive Games
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>
              জ্ঞান ব্যায়াম (4 Games)
            </div>
          </div>
        </button>

        {/* Card 2: Reminders */}
        <button
          onClick={() => handleNav("reminders")}
          style={{
            background: "var(--white)",
            border: "1.5px solid var(--gray-200)",
            borderRadius: "var(--radius-lg)",
            padding: "1.25rem 1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "left",
            gap: "0.5rem",
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
            transition: "all var(--transition)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--primary)";
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--gray-200)";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            e.currentTarget.style.transform = "none";
          }}
        >
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
            <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--gray-900)" }}>
              Reminders
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>
              দৰব আৰু পানী সোঁৱৰণী
            </div>
          </div>
        </button>

        {/* Card 3: Memory Album */}
        <button
          onClick={() => handleNav("album")}
          style={{
            background: "var(--white)",
            border: "1.5px solid var(--gray-200)",
            borderRadius: "var(--radius-lg)",
            padding: "1.25rem 1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "left",
            gap: "0.5rem",
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
            transition: "all var(--transition)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--primary)";
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--gray-200)";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            e.currentTarget.style.transform = "none";
          }}
        >
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
            <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--gray-900)" }}>
              Memory Album
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>
              পুৰণি স্মৃতিৰ ফটো
            </div>
          </div>
        </button>

        {/* Card 4: Connect */}
        <button
          onClick={() => handleNav("connect")}
          style={{
            background: "var(--white)",
            border: "1.5px solid var(--gray-200)",
            borderRadius: "var(--radius-lg)",
            padding: "1.25rem 1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "left",
            gap: "0.5rem",
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
            transition: "all var(--transition)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--primary)";
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--gray-200)";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            e.currentTarget.style.transform = "none";
          }}
        >
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
            <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--gray-900)" }}>
              Connect
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>
              নাতি-নাতিনীৰ সৈতে
            </div>
          </div>
        </button>
      </div>

      {/* Today's Schedule Timeline */}
      <div style={{
        background: "var(--gray-50)",
        borderRadius: "var(--radius-lg)",
        padding: "1.1rem",
        border: "1px solid var(--gray-200)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.85rem"
        }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--gray-900)" }}>
            Today’s Schedule
          </h3>
          <span style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>
            Automated Voice Alerts Active
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
                padding: "0.6rem 0.75rem",
                background: "var(--white)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--gray-200)",
                fontSize: "0.85rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--gray-900)" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>
                    {item.description}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--primary)" }}>
                  {item.time}
                </div>
                <div style={{
                  fontSize: "0.7rem",
                  color: item.status === "done" ? "var(--green)" : item.status === "pending" ? "#d97706" : "var(--gray-400)",
                  fontWeight: 600
                }}>
                  {item.status === "done" ? "✓ Done" : item.status === "pending" ? "● Current" : "Upcoming"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
