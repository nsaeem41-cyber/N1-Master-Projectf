const CACHE_NAME = 'n-one-captain-v5-diamond';
const urlsToCache = [
    './',
    './captain.html',
    './manifest.json',
    './logo.jpg'
];

// مرحلة التثبيت: تجهيز ملفات الكابتن في الذاكرة
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Captain assets cached successfully');
                return cache.addAll(urlsToCache);
            })
    );
});

// مرحلة التفعيل: مسح أي كاش قديم وتنظيف الذاكرة
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

// إدارة الطلبات: استراتيجية (Network First) عشان نشوف التحديثات فوراً
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

// نظام الإشعارات الرسمي لإمبراطورية N One
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'لديك طلب جديد بانتظارك الآن 🔥',
        icon: 'logo.jpg',
        badge: 'logo.jpg',
        vibrate: [200, 100, 200, 100, 200],
        tag: 'n-one-order',
        renotify: true,
        requireInteraction: true,
        data: {
            url: './captain.html'
        }
    };

    event.waitUntil(
        self.registration.showNotification('N One - إمبراطورية التوصيل 💎', options)
    );
});

// فتح التطبيق فور النقر على الإشعار
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if (client.url.includes('captain.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./captain.html');
            }
        })
    );
});
