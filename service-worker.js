const CACHE_NAME = "kh-pwa-v4";

// Genera URLs absolutas desde el scope actual (sirve perfecto en GitHub Pages / subcarpetas)
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/app.js",

  "./assets/KH1.jpg",
  "./assets/KH2.webp",
  "./assets/KH3.jpg",

  "./assets/Sora.webp",
  "./assets/Riku_KHIII.webp",
  "./assets/Kairi_KHIII.webp",
  "./assets/ventus.png",
  "./assets/Kingdom_Hears_Aqua.png",
  "./assets/Terra.webp",
  "./assets/Donald_KHIII.webp",
  "./assets/Goofy_KH3.webp",
  "./assets/Mickey_KHIII.webp",
  "./assets/Maestro_Xehanort.webp",

  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-512-maskable.png"
].map((p) => new URL(p, self.registration.scope).toString());

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(ASSETS);
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Navegación: network-first, fallback a index
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(req);
        } catch {
          const cache = await caches.open(CACHE_NAME);
          // Busca index.html absoluto por si cambia la ruta
          return (await cache.match(new URL("./index.html", self.registration.scope).toString()))
            || (await cache.match(new URL("./", self.registration.scope).toString()))
            || Response.error();
        }
      })()
    );
    return;
  }

  // Recursos: cache-first
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;

      try {
        const res = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, res.clone());
        return res;
      } catch {
        return cached || Response.error();
      }
    })()
  );
});
