// ── SMRITI-NER ELDER-ACCESSIBLE MODAL DIALOG ──────────────────────────────────
// Sub-Phase 4.1: Focus-Trapped, Non-Distressing Screen Dialog

"use client";

import React, { useEffect, useRef } from "react";
import { setupFocusTrap, announceToScreenReader } from "@/lib/accessibilityMiddleware";
import ElderButton from "@/components/ui/ElderButton";

interface ElderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  nativeTitle?: string;
  children: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  variant?: "info" | "success" | "warning";
}

export default function ElderModal({
  isOpen,
  onClose,
  title,
  nativeTitle,
  children,
  confirmLabel = "Understand",
  cancelLabel = "Close",
  onConfirm,
  variant = "info",
}: ElderModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    announceToScreenReader(`${title} dialog opened`);
    const cleanup = setupFocusTrap(modalRef.current, onClose);

    return () => {
      cleanup();
    };
  }, [isOpen, title, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="elder-modal-title"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          border: "2px solid #E2E8F0",
          maxWidth: "480px",
          width: "100%",
          padding: "1.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            {nativeTitle && (
              <div style={{ fontSize: "0.9rem", color: "#065F46", fontWeight: 800 }}>
                {nativeTitle}
              </div>
            )}
            <h3
              id="elder-modal-title"
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "#0F172A",
                lineHeight: 1.3,
              }}
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Dialog"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "#F1F5F9",
              border: "1.5px solid #CBD5E1",
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "#334155",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            &times;
          </button>
        </div>

        {/* Content Body */}
        <div style={{ fontSize: "1rem", color: "#334155", lineHeight: 1.5 }}>
          {children}
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
          {onConfirm && (
            <ElderButton
              variant={variant === "warning" ? "warning" : "success"}
              fullWidth
              onPress={onConfirm}
            >
              {confirmLabel}
            </ElderButton>
          )}
          <ElderButton
            variant="secondary"
            fullWidth
            onPress={onClose}
          >
            {cancelLabel}
          </ElderButton>
        </div>
      </div>
    </div>
  );
}
