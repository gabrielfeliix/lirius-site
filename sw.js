const CACHE_NAME = 'floricultura-lirios-v14';

// Assets to cache immediately on installation.
// Só entram aqui caminhos que existem em TODAS as versões publicadas.
// Um único 404 nesta lista impede o Service Worker de instalar.
const PRECACHE_ASSETS = [
  '/',
  '/styles.css',
  '/script.js',
  '/images/logo.png',
  '/images/logo.webp',
  '/images/hero_lirios.webp'
];

// Install Event - Precache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cada asset é cacheado individualmente: se um falhar (arquivo removido,
      // renomeado ou 404), os demais continuam e a instalação conclui.
      return Promise.all(
        PRECACHE_ASSETS.map((url) => cache.add(url).catch(() => null))
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle local GET requests
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return;
  }

  // --- NAVEGAÇÕES (páginas HTML): network-first ---
  // O catálogo muda de produtos e de URLs. Servir HTML do cache faz o navegador
  // exibir uma página antiga cujos links já não existem, resultando em 404 ao
  // navegar ou ao voltar para a home. A rede é sempre a fonte da verdade aqui;
  // o cache só entra em cena quando o usuário está realmente offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        // Respostas 404/500 são repassadas como vieram, sem serem cacheadas.
        return networkResponse;
      }).catch(() => {
        // Offline: tenta a própria página e, em último caso, a home.
        return caches.match(request).then((cached) => cached || caches.match('/'));
      })
    );
    return;
  }

  // --- ASSETS ESTÁTICOS (css, js, imagens, fontes): stale-while-revalidate ---
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(request).then((cachedResponse) => {
        const networkFetch = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || networkFetch;
      });
    })
  );
});
