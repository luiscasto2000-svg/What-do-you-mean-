// What Do You Mean? — Service Worker V14.1
// Strategy:
//  - HTML: network-first (sempre fresh, fallback cache)
//  - Altri asset: cache-first (icone, font, ecc.)
// Il nome cache contiene la versione → cambia ad ogni release.

const CACHE_VERSION = 'wdym-v15-2026-06';
const CACHE = CACHE_VERSION;

const STATIC_ASSETS = [
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&display=swap'
];

self.addEventListener('install', e => {
  // Precache solo asset statici, NON l'index.html
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC_ASSETS).catch(() => {})));
  // Forza attivazione immediata (non aspetta che le pagine si chiudano)
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    // Cancella TUTTE le vecchie cache
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    // Prendi il controllo di tutte le tab aperte subito
    await self.clients.claim();
    // Notifica le pagine che c'è una nuova versione
    const clients = await self.clients.matchAll({type: 'window'});
    clients.forEach(client => client.postMessage({type: 'SW_UPDATED', version: CACHE_VERSION}));
  })());
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const isHtml = e.request.mode === 'navigate' ||
                 e.request.destination === 'document' ||
                 url.pathname.endsWith('.html') ||
                 url.pathname === '/' || url.pathname.endsWith('/');

  if (isHtml) {
    // NETWORK FIRST per HTML (così aggiornamenti arrivano subito)
    e.respondWith(
      fetch(e.request).then(resp => {
        // Cache la copia fresca
        if (resp && resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => {
        // Offline: fallback alla cache
        return caches.match(e.request).then(cached => cached || caches.match('./index.html'));
      })
    );
    return;
  }

  // CACHE FIRST per altri asset (font, icone)
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp && resp.ok && (url.origin === self.location.origin || url.hostname.includes('googleapis') || url.hostname.includes('gstatic'))) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => cached);
    })
  );
});

// Skip waiting on demand (la pagina può chiedere l'aggiornamento immediato)
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
