// ── SMRITI-NER PORTRAIT ORIENTATION GUARD ─────────────────────────────────────
// Ensures the application remains strictly in portrait mode with no disruptive overlay switch.

"use client";

import { useEffect } from "react";

export default function OrientationGuard() {
  useEffect(() => {
    // Attempt standard browser orientation lock to portrait
    try {
      if (typeof window !== "undefined" && "screen" in window && "orientation" in window.screen) {
        const orientation = window.screen.orientation as any;
        if (orientation && typeof orientation.lock === "function") {
          orientation.lock("portrait").catch(() => {
            // Orientation lock not supported or rejected; ignore silently
          });
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // No disruptive overlay or orientation switch UI
  return null;
}
