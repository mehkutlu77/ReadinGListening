/* ============================================================
   LinguiVance — Service Worker v1.0
   Offline-first caching strategy
   ============================================================ */

const CACHE_NAME = 'linguivance-v11';
const STATIC_CACHE = 'linguivance-static-v10';
const DATA_CACHE = 'linguivance-data-v10';

// Core app shell — always cache these
const APP_SHELL = [
  './index.html',
  './offline.html',
  './manifest.json',
  './kelimeler.js',
  './reading.js',
  './sinavlar.js',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// External CDN resources
const CDN_RESOURCES = [
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// ── INSTALL ──────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(APP_SHELL).catch((err) => {
        console.warn('[SW] Some files failed to cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ─────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== STATIC_CACHE && name !== DATA_CACHE)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ── FETCH ─────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and non-http requests
  if (!request.url.startsWith('http')) return;

  // CDN resources: Cache first, then network
  if (url.hostname !== self.location.hostname) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then(cache => cache.put(request, clone));
          }
          return response;
        }).catch(() => {
          // CDN offline — return empty response gracefully
          return new Response('', { status: 503, statusText: 'Offline' });
        });
      })
    );
    return;
  }

  // App shell: Network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(STATIC_CACHE).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // Fallback: navigation → offline page, others → 503
          if (request.mode === 'navigate') {
            return caches.match('./offline.html') || caches.match('./index.html');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// ── PUSH NOTIFICATIONS ────────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'LinguiVance';
  const options = {
    body: data.body || 'Time to practice your English! 📚',
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-72x72.png',
    tag: 'linguivance-reminder',
    renotify: true,
    data: { url: data.url || './index.html' },
    actions: [
      { action: 'open', title: 'Start Learning' },
      { action: 'dismiss', title: 'Later' }
    ]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// ── NOTIFICATION CLICK ────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('linguivance') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('./index.html');
    })
  );
});

// ── BACKGROUND SYNC ───────────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncUserProgress());
  }
});

async function syncUserProgress() {
  // Future: sync user progress to server when back online
  console.log('[SW] Background sync triggered');
}

// ── SKIP WAITING (triggered by update banner) ──────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
