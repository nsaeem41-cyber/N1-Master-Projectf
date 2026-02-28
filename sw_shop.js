const CACHE_NAME = 'n-one-shop-v1-diamond';
const urlsToCache = [
    './',
    './manifest_shop.json',
    './logo_shop.jpg'
];

// مرحلة التثبيت تجهيز ملفات المنشأة في الذاكرة
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Shop assets cached successfully');
                return cache.addAll(urlsToCache);
            })
    );
});

// مرحلة التفعيل مسح أي كاش قديم وتنظيف الذاكرة
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

// إدارة الطلبات استراتيجية Network First عشان نشوف التحديثات فورا
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // إذا الاستجابة صحيحة نخزن نسخة ونرجعها
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // في حال انقطع النت نرجع النسخة المخزنة
                return caches.match(event.request);
            })
    );
});

// نظام الإشعارات الرسمي لبوابة المنشآت N One
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'إشعار إداري جديد من إمبراطورية N One 👑',
        icon: 'logo_shop.jpg',
        badge: 'logo_shop.jpg',
        vibrate: [200, 100, 200, 100, 200],
        tag: 'n-one-shop-alert',
        renotify: true,
        requireInteraction: true,
        data: {
            url: './'
        }
    };

    event.waitUntil(
        self.registration.showNotification('بوابة المنشآت | N One 💎', options)
    );
});

// فتح التطبيق فور النقر على الإشعار
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if ('focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});
