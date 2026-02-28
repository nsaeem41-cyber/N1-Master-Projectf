const CACHE_NAME = 'n-one-shop-v1-diamond';
const urlsToCache = [
    './',
    './index.html',
    './manifest_shop.json',
    './logo_shop.jpg'
];

// مرحلة التثبيت: تجهيز ملفات المنشأة في الذاكرة
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Shop portal assets cached successfully');
                return cache.addAll(urlsToCache);
            })
    );
});

// مرحلة التفعيل: مسح أي كاش قديم وتنظيف الذاكرة الخاصة بالمنشأة
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

// إدارة الطلبات: استراتيجية (Network First) لضمان رؤية الطلبات فوراً
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // إذا الاستجابة صحيحة نخزن نسخة للمنشأة ونرجعها
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // في حال انقطع النت نرجع نسخة المنشأة المخزنة
                return caches.match(event.request);
            })
    );
});

// نظام الإشعارات الرسمي لبوابة المنشآت N One
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'تحديث جديد في بوابة المنشآت 👑',
        icon: 'logo_shop.jpg',
        badge: 'logo_shop.jpg',
        vibrate: [200, 100, 200, 100, 200],
        tag: 'n-one-shop-order',
        renotify: true,
        requireInteraction: true,
        data: {
            url: './index.html'
        }
    };

    event.waitUntil(
        self.registration.showNotification('بوابة المنشآت | N One 💎', options)
    );
});

// فتح تطبيق المنشأة فور النقر على الإشعار
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if (client.url.includes('index.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./index.html');
            }
        })
    );
});
