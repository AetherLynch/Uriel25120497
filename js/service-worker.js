// service-worker.js
const CACHE_NAME = "kh-pwa-v1";

// Agrega aquí los archivos esenciales de tu proyecto:
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/app.js",

  // Imágenes del banner
  "./assets/KH1.jpg",
  "./assets/KH2.webp",
  "./assets/KH3.jpg",

  // Imágenes de personajes (ajusta si cambian nombres/rutas)
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

  // Icons
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-512-maskable.png"
];

// Instalación: guarda recursos en caché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activación: limpia cachés viejas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: responde desde caché si existe, si no, pide a red y guarda
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Evita cachear cosas que no son GET
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          // Guarda en caché solo si es una respuesta válida
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() => {
          // Si se cae la red y no está en caché, al menos regresa index (para navegar offline)
          return caches.match("./index.html");
        });
    })
  );
});
