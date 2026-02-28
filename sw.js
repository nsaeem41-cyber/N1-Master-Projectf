const CACHE_NAME = 'n-one-captain-v2';
const urlsToCache = [
    './',
    './captain.html',
    './manifest.json',
    './logo.jpg'
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

// التعديل الملكي هنا عشان يظهر اسم N One بوضوح
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'لديك طلب جديد بانتظارك الآن 🔥',
        icon: 'logo.jpg',
        badge: 'logo.jpg',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        tag: 'n-one-order', // عشان ما تتراكم الإشعارات المزعجة
        renotify: true,
        requireInteraction: true,
        data: {
            url: './captain.html' // عشان لما يضغط يفتح صفحة الكابتن فوراً
        }
    };

    event.waitUntil(
        self.registration.showNotification('N One - إمبراطورية التوصيل 💎', options)
    );
});

// كود عشان لما يضغط على الإشعار يفتح التطبيق فوراً
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('./captain.html')
    );
});
