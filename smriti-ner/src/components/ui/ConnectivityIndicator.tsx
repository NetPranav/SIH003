"use client";

import React, { useState, useEffect } from "react";
import { announceToScreenReader } from "@/lib/accessibilityMiddleware";

interface ConnectivityIndicatorProps {
  className?: string;
}

export default function ConnectivityIndicator({ className }: ConnectivityIndicatorProps) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    // Check initial status in browser environment
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);

      const handleOnline = () => {
        setIsOnline(true);
        announceToScreenReader("Network connected. Cloud synchronization active.", "polite");
      };

      const handleOffline = () => {
        setIsOnline(false);
        announceToScreenReader(
          "You are offline. Do not worry — all games, photos, and medicine reminders are fully stored on this device and work safely.",
          "polite"
        );
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }} className={className}>
      <button
        type="button"
        onClick={() => setShowTooltip((prev) => !prev)}
        aria-label={isOnline ? "Network Status: Online" : "Network Status: Offline (Local Mode Active)"}
        aria-expanded={showTooltip}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          background: isOnline ? "#f0fdf4" : "#fef3c7",
          border: `1px solid ${isOnline ? "#86efac" : "#fde68a"}`,
          borderRadius: "999px",
          padding: "0.35rem 0.7rem",
          cursor: "pointer",
          fontSize: "0.75rem",
          fontWeight: 700,
          color: isOnline ? "#166534" : "#92400e",
          transition: "all 0.2s ease"
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: isOnline ? "#10b981" : "#f59e0b",
            boxShadow: `0 0 0 2px ${isOnline ? "rgba(16, 185, 129, 0.25)" : "rgba(245, 158, 11, 0.25)"}`
          }}
        />
        <span>{isOnline ? "Online" : "Offline Ready"}</span>
      </button>

      {/* Non-alarming Reassurance Tooltip / Popover */}
      {showTooltip && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            right: 0,
            zIndex: 50,
            width: "240px",
            background: "var(--white)",
            border: "1px solid var(--gray-200)",
            borderRadius: "var(--radius-lg)",
            padding: "0.85rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            fontSize: "0.8rem",
            color: "var(--gray-700)",
            lineHeight: 1.4
          }}
        >
          <div style={{ fontWeight: 800, color: isOnline ? "#166534" : "#92400e", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <span>{isOnline ? "🟢 Connected to Cloud" : "🟡 Offline Memory Mode"}</span>
          </div>
          <p style={{ margin: 0 }}>
            {isOnline
              ? "All your cognitive scores and family messages are syncing with caregiver records."
              : "Zero internet required! All games, music, and medicine schedules are stored safely on your device."}
          </p>
        </div>
      )}
    </div>
  );
}
