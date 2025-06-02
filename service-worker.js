const CACHE_NAME = 'pwa-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/reservation.html',
  '/css/common.css',
  '/app.js',
  '/scripts/header.js',
  '/img/favicon/web-app-manifest-192x192.png',
  '/img/favicon/web-app-manifest-512x512.png'
];

console.log(CACHE_NAME)

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
