// =================================================================
// N One Empire - Service Worker (Official Diamond Version)
// =================================================================

// 👑 تحديث النسخة لإجبار المتصفح والواتساب على رؤية التعديلات الجديدة
const CACHE_NAME = 'n-one-empire-v727-diamond';
const urlsToCache = [
    './',
    './index.html',
    './captain.html',
    './manifest.json',
    './n_one_logo_new.png' // الشعار الجديد الفخم
];

// مرحلة التثبيت: تجهيز ملفات الإمبراطورية في الذاكرة
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[N One SW] تم تخزين الذخيرة الألماسية بنجاح 💎');
                return cache.addAll(urlsToCache);
            })
    );
});

// مرحلة التفعيل: تدمير أي كاش قديم (v5 وغيرها) وتنظيف السيستم
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[N One SW] جاري مسح المخلفات القديمة:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// إدارة الطلبات: استراتيجية (Network First) - الأولوية دايماً للجديد
self.addEventListener('fetch', event => {
    // استثناء روابط Firebase وقواعد البيانات لضمان سرعة الرادار
    if (event.request.url.includes('firebaseio.com') || event.request.url.includes('googleapis.com')) {
        return;
    }

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

// نظام الإشعارات الرسمي للإمبراطورية
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'لديك تحديث أو طلب جديد من الإمبراطورية 🔥',
        icon: 'n_one_logo_new.png',
        badge: 'n_one_logo_new.png',
        vibrate: [200, 100, 200, 100, 200],
        tag: 'n-one-order',
        renotify: true,
        requireInteraction: true,
        data: {
            url: './index.html'
        }
    };

    event.waitUntil(
        self.registration.showNotification('N One - الإمبراطورية 💎', options)
    );
});

// التوجيه الذكي عند النقر على الإشعار
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
