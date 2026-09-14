// ── SMRITI-NER APP SHELL SKELETON LOADER ──────────────────────────────────────
// Sub-Phase 4.1: Accessible Skeleton Loader with 0.7Hz Calming Shimmer
// Eliminates layout shifts (CLS < 0.05) before full paint

"use client";

import React from "react";

export default function AppShellSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading Smriti-NER Application..."
      style={{
        width: "100%",
        maxWidth: "480px",
        margin: "0 auto",
        minHeight: "100vh",
        backgroundColor: "var(--white)",
        display: "flex",
        flexDirection: "column",
        padding: "1rem 1rem 5rem",
        gap: "1.25rem",
      }}
    >
      <style>{`
        @keyframes gentlePulse {
          0% { opacity: 0.55; }
          50% { opacity: 0.95; }
          100% { opacity: 0.55; }
        }
        .skeleton-block {
          background: #E2E8F0;
          border-radius: 16px;
          animation: gentlePulse 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* Header Skeleton */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="skeleton-block" style={{ width: "48px", height: "48px", borderRadius: "50%" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div className="skeleton-block" style={{ width: "120px", height: "18px" }} />
            <div className="skeleton-block" style={{ width: "80px", height: "14px" }} />
          </div>
        </div>
        <div className="skeleton-block" style={{ width: "64px", height: "36px", borderRadius: "999px" }} />
      </div>

      {/* Daily Banner Skeleton */}
      <div className="skeleton-block" style={{ height: "140px", borderRadius: "24px", width: "100%" }} />

      {/* Activity Grid Skeleton */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        <div className="skeleton-block" style={{ width: "160px", height: "20px" }} />
        <div className="skeleton-block" style={{ height: "96px", width: "100%" }} />
        <div className="skeleton-block" style={{ height: "96px", width: "100%" }} />
        <div className="skeleton-block" style={{ height: "96px", width: "100%" }} />
      </div>

      {/* Bottom Nav Skeleton */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "480px",
          background: "#FFFFFF",
          borderTop: "1px solid #E2E8F0",
          height: "64px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          padding: "0.5rem 0.25rem",
          alignItems: "center",
        }}
      >
        <div className="skeleton-block" style={{ height: "40px", margin: "0 0.5rem", borderRadius: "8px" }} />
        <div className="skeleton-block" style={{ height: "40px", margin: "0 0.5rem", borderRadius: "8px" }} />
        <div className="skeleton-block" style={{ height: "40px", margin: "0 0.5rem", borderRadius: "8px" }} />
        <div className="skeleton-block" style={{ height: "40px", margin: "0 0.5rem", borderRadius: "8px" }} />
      </div>
    </div>
  );
}
