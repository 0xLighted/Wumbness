const CACHE_NAME = "wumbo-wellness-v1";
const APP_SHELL = ["/", "/offline.html", "/manifest.webmanifest", "/favicon.ico", "/WumbnessLogoNew.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match("/offline.html");
      })
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }

        return fetch(request)
          .then((response) => {
            if (response && response.status === 200 && response.type === "basic") {
              const responseToCache = response.clone();
              void caches.open(CACHE_NAME).then((cache) => {
                void cache.put(request, responseToCache);
              });
            }
            return response;
          })
          .catch(() => caches.match("/offline.html"));
      })
    );
  }
});