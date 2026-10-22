const CACHE_NAME = 'spotera-business-media-v13';
const STATIC_ASSETS = [
  '/spoteradeals-logo.png',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/favicon.ico',
  '/favicon-48.png',
  '/favicon-96.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch strategy:
// 1. Never intercept or cache API requests (/api/*)
// 2. Network-first for HTML / navigation requests so shared links and app always get latest HTML
// 3. Network-first for images with fallback to cache to avoid serving stale assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Exclude API requests
  if (url.origin !== self.location.origin || event.request.method !== 'GET' || url.pathname.startsWith('/api/')) {
    return;
  }

  // Network-first for HTML navigations
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || fetch(event.request);
      })
    );
    return;
  }

  // If request has cache-busting query parameter (?v= or ?t=), always fetch fresh from network
  if (url.searchParams.has('v') || url.searchParams.has('t')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Network-first with cache fallback for static images and icons
  if (
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.svg')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return networkRes;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }
});

// Web Push API - Push Event Listener
self.addEventListener('push', (event) => {
  let data = {
    title: 'Spotera Deals UAE',
    body: 'New exclusive UAE family offer or expiring deal in your area!',
    url: '/',
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const title = data.title || 'Spotera Deals UAE';
  const options = {
    body: data.body,
    icon: data.icon || '/spotera-logo.png',
    badge: '/spotera-logo.png',
    data: {
      url: data.url || '/',
      dealId: data.dealId,
      emirate: data.emirate,
    },
    actions: [
      { action: 'open_deal', title: 'View Deal' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    vibrate: [200, 100, 200],
    tag: data.tag || 'spotera-notification',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Web Push API - Notification Click Listener
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  let targetUrl = '/';
  try {
    const candidate = new URL(event.notification.data?.url || '/', self.location.origin);
    if (candidate.origin === self.location.origin) targetUrl = candidate.href;
  } catch { /* Invalid notification links open the homepage. */ }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          if ('navigate' in client && targetUrl !== '/') {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
