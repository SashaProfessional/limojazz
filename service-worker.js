const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/limojazz/',
  '/limojazz/index.html',
  '/limojazz/reservation.html',
  '/limojazz/css/common.css',
  '/limojazz/app.js',
  '/limojazz/scripts/header.js',
  '/limojazz/img/favicon/web-app-manifest-192x192.png',
  '/limojazz/img/favicon/web-app-manifest-512x512.png'
];

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
