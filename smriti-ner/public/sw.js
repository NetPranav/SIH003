/**
 * Smriti-NER (স্মৃতি / ꯁ꯭ꯃ꯭ꯔꯤꯇꯤ) Production Service Worker
 * Sub-Phase 4.1: PWA Foundation & App Shell Architecture
 * SIH 2026 Problem Statement ID: 26003 | MDoNER
 * 
 * Provides:
 * - Offline-first App Shell pre-caching
 * - Cache-first strategy for folk audio & vector cultural motifs
 * - Network-first strategy for dynamic cognitive telemetry
 * - Calming offline fallback (offline.html)
 * - Background sync for deferred offline session synchronization
 */

const CACHE_VERSION = "v2.5.0-lts";
const STATIC_CACHE_NAME = `smriti-static-${CACHE_VERSION}`;
const AUDIO_CACHE_NAME = `smriti-audio-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `smriti-dynamic-${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
  "/",
  "/manifest.json",
  "/offline.html",
  "/globe.svg",
  "/next.svg"
];

// 1. Install Event: Pre-cache App Shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// 2. Activate Event: Purge outdated caches & claim clients
self.addEventListener("activate", (event) => {
  const currentCaches = [STATIC_CACHE_NAME, AUDIO_CACHE_NAME, DYNAMIC_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 3. Fetch Event: Intelligent multi-tier caching strategy
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests or chrome-extension URLs
  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // Strategy A: Audio Assets & Fonts -> Cache-First
  if (
    request.destination === "audio" ||
    url.pathname.match(/\.(mp3|wav|ogg|aac|m4a|woff2?|ttf|otf)$/i)
  ) {
    event.respondWith(
      caches.open(AUDIO_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Strategy B: Static Vector / Images -> Cache-First with Network Revalidate
  if (
    request.destination === "image" ||
    url.pathname.match(/\.(svg|png|jpg|jpeg|webp|gif|ico)$/i)
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => null);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Strategy C: HTML Navigation & Page Requests -> Network-First with Offline Fallback
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(async () => {
        // Fallback to cached route or offline.html
        const cachedRoute = await caches.match(request);
        if (cachedRoute) return cachedRoute;
        const offlinePage = await caches.match("/offline.html");
        if (offlinePage) return offlinePage;
        return new Response("Offline - Smriti-NER is available locally.", {
          headers: { "Content-Type": "text/plain" }
        });
      })
    );
    return;
  }

  // Strategy D: Dynamic API & Script Chunks -> Network-First
  event.respondWith(
    fetch(request).then((networkResponse) => {
      return networkResponse;
    }).catch(async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      return new Response(JSON.stringify({ error: "Network offline", offline: true }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      });
    })
  );
});

// 4. Background Sync: Deferred offline telemetry submission
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-telemetry") {
    event.waitUntil(
      // Broadcast to client windows that sync is underway
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: "BACKGROUND_SYNC_TRIGGERED",
            timestamp: Date.now()
          });
        });
      })
    );
  }
});

// 5. Message Listener: Support instant update trigger
self.addEventListener("message", (event) => {
  if (event.data && event.data.action === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
