"use client";

interface Props {
  open: boolean;
  time: string;
  accuracy: string;
  onNext?: () => void;
  onDone: () => void;
}

export default function SuccessModal({ open, time, accuracy, onNext, onDone }: Props) {
  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.45)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      zIndex: 100
    }}>
      <div style={{
        background: "var(--white)",
        borderRadius: "var(--radius-xl)",
        padding: "2rem 1.5rem",
        maxWidth: "360px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        animation: "scaleUp 250ms ease"
      }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          backgroundColor: "#fef3c7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.4rem",
          marginBottom: "1rem"
        }}>
          🌟
        </div>

        <h3 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.25rem" }}>
          খুবেই সুন্দৰ!
        </h3>
        <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--primary)", marginBottom: "0.5rem" }}>
          Wonderful Performance!
        </p>

        <p style={{ fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: "1.5rem", lineHeight: 1.4 }}>
          You completed the exercise with calm focus and great memory recall.
        </p>

        {/* Stats Pill */}
        <div style={{
          display: "flex",
          gap: "1rem",
          background: "var(--gray-50)",
          border: "1px solid var(--gray-200)",
          borderRadius: "var(--radius)",
          padding: "0.75rem 1.25rem",
          marginBottom: "1.5rem"
        }}>
          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--gray-500)", textTransform: "uppercase", fontWeight: 700 }}>
              Time
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gray-900)" }}>
              {time || "35s"}
            </div>
          </div>
          <div style={{ width: 1, backgroundColor: "var(--gray-200)" }} />
          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--gray-500)", textTransform: "uppercase", fontWeight: 700 }}>
              Accuracy
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--green)" }}>
              {accuracy || "100%"}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", width: "100%" }}>
          {onNext && (
            <button
              onClick={onNext}
              style={{
                width: "100%",
                padding: "0.85rem",
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius)",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Play Another Round
            </button>
          )}

          <button
            onClick={onDone}
            style={{
              width: "100%",
              padding: "0.85rem",
              background: "var(--gray-100)",
              color: "var(--gray-800)",
              border: "none",
              borderRadius: "var(--radius)",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Back to Games
          </button>
        </div>
      </div>
    </div>
  );
}
