"use client";

export default function SplashScreen() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      minHeight: "calc(100dvh - var(--status-bar-gap, 28px))",
      padding: "2rem 1.5rem",
      backgroundColor: "var(--white)",
      textAlign: "center",
      position: "relative"
    }}>
      <div style={{
        width: 104,
        height: 104,
        borderRadius: "28px",
        background: "linear-gradient(135deg, var(--primary) 0%, #2c2c4d 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 12px 28px rgba(26, 26, 46, 0.16)",
        marginBottom: "1.5rem"
      }}>
        <span style={{ fontSize: "3rem", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}>🧠</span>
      </div>

      <h1 style={{
        fontSize: "2rem",
        fontWeight: 800,
        color: "var(--gray-900)",
        letterSpacing: "-0.03em",
        marginBottom: "0.25rem"
      }}>
        Smriti-NER
      </h1>
      
      <p style={{
        fontSize: "1.1rem",
        fontWeight: 600,
        color: "var(--accent)",
        letterSpacing: "0.05em",
        marginBottom: "0.5rem"
      }}>
        স্মৃতি • ꯁ꯭ꯃ꯭ꯔꯤꯇꯤ • স্মৃতি
      </p>

      <p style={{
        fontSize: "0.95rem",
        color: "var(--gray-500)",
        maxWidth: "280px",
        lineHeight: 1.4,
        marginBottom: "2.5rem"
      }}>
        Dementia Care & Culturally-Rooted Cognitive Wellness for North East India
      </p>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.6rem 1.2rem",
        background: "var(--gray-50)",
        borderRadius: "999px",
        border: "1px solid var(--gray-200)",
        fontSize: "0.85rem",
        color: "var(--gray-600)"
      }}>
        <span style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "var(--green)",
          display: "inline-block",
          animation: "pulse 1.5s infinite"
        }} />
        <span>Initializing Phase 1.1 Evidence Engine...</span>
      </div>

      <div style={{
        position: "absolute",
        bottom: "1.75rem",
        fontSize: "0.75rem",
        color: "var(--gray-400)",
        fontWeight: 500
      }}>
        SIH 2026 • Problem 26003 • MDoNER
      </div>
    </div>
  );
}
