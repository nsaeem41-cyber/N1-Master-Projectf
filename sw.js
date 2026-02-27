const CACHE_NAME = 'n-one-captain-v1';
const urlsToCache = [
    './',
    './captain.html',
    './manifest.json',
    './logo.jpg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'طلب جديد بانتظارك من N One 🔥',
        icon: 'logo.jpg',
        badge: 'logo.jpg',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        requireInteraction: true
    };

    event.waitUntil(
        self.registration.showNotification('إمبراطورية N One', options)
    );
});
