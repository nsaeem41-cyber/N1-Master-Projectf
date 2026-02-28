const CACHE_NAME = 'n-one-shop-v1-gold';
const urlsToCache = [
    './',
    './shop.html',
    './shop-manifest.json',
    './shop-logo.jpg'
];

self.addEventListener('install', event => {
    self.skipWaiting();
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
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).then(response => {
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request.url, response.clone());
                return response;
            });
        }).catch(() => {
            return caches.match(event.request);
        })
    );
});

// إشعارات بوابة المنشآت الرسمية
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'يوجد تحديث جديد في قائمة العمليات بانتظاركم 📋',
        icon: 'shop-logo.jpg',
        badge: 'shop-logo.jpg',
        vibrate: [100, 50, 100, 50, 100],
        tag: 'n-one-shop-alert',
        renotify: true,
        requireInteraction: true,
        data: {
            url: './shop.html'
        }
    };

    event.waitUntil(
        self.registration.showNotification('N One - بوابة المنشآت 💎', options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if (client.url.includes('shop.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./shop.html');
            }
        })
    );
});
