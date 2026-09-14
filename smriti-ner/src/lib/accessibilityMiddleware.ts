/**
 * Smriti-NER Accessibility Middleware & Elder Interaction Layer
 * Sub-Phase 4.1: PWA Foundation & App Shell Architecture
 * WCAG 2.2 AAA Compliance Engine
 */

let liveRegionElement: HTMLElement | null = null;

/**
 * Dispatches an accessible message to screen readers (TalkBack / VoiceOver)
 * using an invisible polite aria-live region.
 */
export function announceToScreenReader(
  message: string,
  politeness: "polite" | "assertive" = "polite"
): void {
  if (typeof window === "undefined" || !document.body) return;

  if (!liveRegionElement) {
    liveRegionElement = document.createElement("div");
    liveRegionElement.id = "smriti-sr-announcer";
    liveRegionElement.setAttribute("aria-live", politeness);
    liveRegionElement.setAttribute("aria-atomic", "true");
    liveRegionElement.style.position = "absolute";
    liveRegionElement.style.width = "1px";
    liveRegionElement.style.height = "1px";
    liveRegionElement.style.padding = "0";
    liveRegionElement.style.margin = "-1px";
    liveRegionElement.style.overflow = "hidden";
    liveRegionElement.style.clip = "rect(0, 0, 0, 0)";
    liveRegionElement.style.whiteSpace = "nowrap";
    liveRegionElement.style.border = "0";
    document.body.appendChild(liveRegionElement);
  }

  liveRegionElement.setAttribute("aria-live", politeness);
  // Clear and update text to trigger screen reader event
  liveRegionElement.textContent = "";
  setTimeout(() => {
    if (liveRegionElement) {
      liveRegionElement.textContent = message;
    }
  }, 50);
}

/**
 * Triggers non-visual tactile haptic feedback for physical confirmation.
 */
export function triggerHaptic(
  type: "tap" | "success" | "warning" | "error" | "celebration" = "tap"
): boolean {
  if (typeof window === "undefined" || !("vibrate" in navigator)) {
    return false;
  }

  const patterns: Record<string, number[]> = {
    tap: [25], // Gentle 25ms micro-vibration
    success: [40, 60, 40], // Two gentle pulses
    warning: [70, 50, 70], // Two firmer pulses
    error: [100], // Single firm pulse
    celebration: [30, 40, 30, 40, 50], // Rhythmic folk chime pattern
  };

  try {
    return navigator.vibrate(patterns[type] || [25]);
  } catch {
    return false;
  }
}

/**
 * Motor Tremor Dampening Handler:
 * Debounces erratic repeated micro-taps within a 60ms window and suppresses
 * unintentional double-taps common in Parkinsonian and dementia tremors.
 */
export function createTremorDampener(debounceMs: number = 60) {
  let lastTimestamp = 0;

  return function shouldAcceptTap(): boolean {
    const now = Date.now();
    const elapsed = now - lastTimestamp;
    if (elapsed < debounceMs) {
      return false; // Suppress erratic tremor tap
    }
    lastTimestamp = now;
    return true; // Valid intentional tap
  };
}

/**
 * Traps keyboard and assistive technology focus within an active dialog/modal.
 */
export function setupFocusTrap(
  container: HTMLElement,
  onClose?: () => void
): () => void {
  const focusableSelectors = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");

  const focusableElements = Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelectors)
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // Focus first element initially
  if (firstElement) {
    firstElement.focus();
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && onClose) {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === "Tab") {
      if (e.shiftKey) {
        // Shift + Tab: if on first element, cycle to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: if on last element, cycle to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }
  };

  container.addEventListener("keydown", handleKeyDown);

  return () => {
    container.removeEventListener("keydown", handleKeyDown);
  };
}
