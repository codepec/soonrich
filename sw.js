const cacheName = 'site-cache-v4'
const assetsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/icons/*',
    '/img/*',
        '/img/profile2.jpg',
            '/img/profile3.jpg',
    '/items/*',
    '/eventCards.json',
    '/experience.json',
    '/favicon.ico',
    '/itemCards.json',
    '/script.js',
    '/storyCards.json'
]

self.addEventListener('install', ( event ) => {
    event.waitUntil(  
        caches.open(cacheName).then((cache) => {
              return cache.addAll(assetsToCache);
        })
      );
});