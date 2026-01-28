const CACHE_NAME = "kh-pwa-v3";

// Archivos esenciales (rutas relativas al SW, o sea, a la raíz)
const CORE_ASSETS = [
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
];

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
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

// Cache-first para recursos; navegación offline -> index.html
self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.method !== "GET") return;

  // Navegación (clicks / refresh)
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const network = await fetch(req);
          return network;
        } catch (e) {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match("./index.html")) || Response.error();
        }
      })()
    );
    return;
  }

  // Recursos (css, js, imágenes)
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;

      try {
        const res = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, res.clone());
        return res;
      } catch (e) {
        return cached || Response.error();
      }
    })()
  );
});
