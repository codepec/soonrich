const cacheName = 'site-cache-v1'
const assetsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/app.js',
]

self.addEventListener('install', ( event ) => {
    event.waitUntil(  
        caches.open(cacheName).then((cache) => {
              return cache.addAll(assetsToCache);
        })
      );
});