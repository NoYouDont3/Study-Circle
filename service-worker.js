const CACHE_NAME = 'study-circle-v1';

const APP_SHELL = [
  './study-circle.html',
  './manifest.webmanifest',
  './icon-190.png',
  './icon-192.png',
  './icon-512.png',
  './effect.gif',
  './icons/icons.png',
  './icons/icons.json',
  './battlepass/s1/verity_skin.png',
  './battlepass/s1/Connor_Backbling.png',
  './battlepass/s1/gobble_glitch.png',
  './battlepass/s1/verity%20pickaxe.png',
  './battlepass/s1/elbuki_Emoticon.png',
  './battlepass/s1/verity_backbling.png',
  './battlepass/s1/ULTIMATE.png',
  './battlepass/s1/demonte%20vershaw.png',
  './battlepass/s1/DIAMOND%20VERITY.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key.startsWith('study-circle-') && key !== CACHE_NAME)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./study-circle.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok || response.type === 'opaque') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
