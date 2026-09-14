/**
 * Smriti-NER PWA Registration & Lifecycle Manager
 * Sub-Phase 4.1: PWA Foundation & App Shell Architecture
 */

let deferredInstallPrompt: any = null;

/**
 * Registers the Service Worker in production/browser environments.
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    // Check for updates periodically
    registration.addEventListener("updatefound", () => {
      const installingWorker = registration.installing;
      if (installingWorker) {
        installingWorker.addEventListener("statechange", () => {
          if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
            console.log("[Smriti-PWA] New content is available; please refresh.");
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.warn("[Smriti-PWA] Service Worker registration failed:", error);
    return null;
  }
}

/**
 * Captures the `beforeinstallprompt` event to enable an in-app "Install Smriti-NER" button.
 */
export function initPwaInstallPrompt(onPromptReady?: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleBeforeInstall = (e: Event) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (onPromptReady) {
      onPromptReady();
    }
  };

  window.addEventListener("beforeinstallprompt", handleBeforeInstall);

  return () => {
    window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  };
}

/**
 * Triggers the browser's native install banner when the user taps "Install App".
 */
export async function triggerPwaInstall(): Promise<boolean> {
  if (!deferredInstallPrompt) {
    return false;
  }

  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  return outcome === "accepted";
}

/**
 * Subscribes to window online/offline events for real-time connectivity status dots.
 */
export function subscribeToNetworkStatus(callback: (isOnline: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Initial call
  callback(navigator.onLine);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}

/**
 * Inspects CacheStorage usage for diagnostic review.
 */
export async function getPwaCacheStats(): Promise<{
  caches: string[];
  usageMb: number;
  quotaMb: number;
  percentUsed: number;
}> {
  if (typeof window === "undefined" || !("caches" in window)) {
    return { caches: [], usageMb: 0, quotaMb: 0, percentUsed: 0 };
  }

  const cacheKeys = await caches.keys();
  let usageMb = 0;
  let quotaMb = 0;
  let percentUsed = 0;

  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    usageMb = Number(((estimate.usage || 0) / (1024 * 1024)).toFixed(2));
    quotaMb = Number(((estimate.quota || 0) / (1024 * 1024)).toFixed(2));
    percentUsed = quotaMb > 0 ? Number(((usageMb / quotaMb) * 100).toFixed(2)) : 0;
  }

  return {
    caches: cacheKeys,
    usageMb,
    quotaMb,
    percentUsed,
  };
}
