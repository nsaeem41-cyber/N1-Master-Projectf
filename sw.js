const CACHE_NAME = 'n-one-captain-v6-diamond';
const urlsToCache = [
    './',
    './captain.html',
    './manifest.json',
    './logo.jpg'
];

// مرحلة التثبيت تجهيز ملفات الكابتن في الذاكرة مع تفعيل فوري
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Captain assets cached successfully V6');
                return cache.addAll(urlsToCache);
            })
    );
});

// مرحلة التفعيل مسح أي كاش قديم وتنظيف الذاكرة والسيطرة الفورية
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

// إدارة الطلبات استراتيجية الشبكة أولا عشان نشوف التحديثات فورا
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});

// نظام الإشعارات الرسمي لإمبراطورية N One الوحش الكاسر
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'لديك طلب ألماسي جديد بانتظارك افتح التطبيق فورا 🔥',
        icon: 'logo.jpg',
        badge: 'logo.jpg',
        // اهتزاز عنيف وطويل جدا عشان يصحصح الكابتن لو كان نايم
        vibrate: [500, 250, 500, 250, 500, 250, 500, 250, 500],
        tag: 'n-one-order',
        renotify: true,
        // هاي الخاصية بتخلي الإشعار يضل معلق عالشاشة وما يختفي لحاله أبدا
        requireInteraction: true,
        data: {
            url: './captain.html'
        }
    };

    event.waitUntil(
        self.registration.showNotification('N One - طلب ألماسي جديد 🚀', options)
    );
});

// فتح التطبيق فور النقر على الإشعار وسحبه للشاشة الأمامية
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // فحص إذا التطبيق مفتوح بالخلفية عشان نعمله فوكس غصب عنه
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if (client.url.includes('captain.html') && 'focus' in client) {
                    // نرسل رسالة سرية للتطبيق إنه الكابتن كبس على الإشعار
                    client.postMessage({ action: 'notification_clicked' });
                    return client.focus();
                }
            }
            // إذا التطبيق مسكر تماما بنفتحه من الصفر
            if (clients.openWindow) {
                return clients.openWindow('./captain.html');
            }
        })
    );
});
