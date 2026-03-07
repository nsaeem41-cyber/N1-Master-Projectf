const CACHE_NAME = 'n-one-captain-v6-diamond';
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
                console.log('Captain assets cached successfully 💎');
                return cache.addAll(urlsToCache);
            }).catch(err => console.error('Cache install error:', err))
    );
});

// مرحلة التفعيل: مسح أي كاش قديم وتنظيف الذاكرة لضمان عدم تعليق التطبيق
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Clearing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// إدارة الطلبات: استراتيجية (Network First) مع "حماية الفايربيس" 🛡️
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // 🚨 التعديل الجوهري: استثناء روابط Firebase والـ API الخارجية من الكاش تماماً!
    // هذا يمنع تجميد الرادار ويضمن وصول الطلبات في أجزاء من الثانية.
    if (url.hostname.includes('firebase') || url.hostname.includes('googleapis') || !url.protocol.startsWith('http')) {
        return; // دع الطلب يمر مباشرة للسيرفر دون تدخل
    }

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
                // في حال انقطع النت نرجع النسخة المخزنة من الواجهة
                return caches.match(event.request);
            })
    );
});

// نظام الإشعارات الرسمي الذكي للإمبراطورية
self.addEventListener('push', event => {
    let data = {};
    
    // محاولة قراءة الإشعار كـ JSON (للسماح بعناوين متغيرة من الإدارة)
    try {
        data = event.data.json();
    } catch (e) {
        data = {
            title: 'N One - إمبراطورية التوصيل 💎',
            body: event.data ? event.data.text() : 'لديك طلب جديد بانتظارك الآن 🔥',
            tag: 'n-one-order'
        };
    }

    const options = {
        body: data.body,
        icon: 'logo.jpg',
        badge: 'logo.jpg',
        vibrate: [500, 250, 500, 250, 500], // اهتزاز قوي لتنبيه الكابتن
        tag: data.tag || 'n-one-order',
        renotify: true,
        requireInteraction: true, // يبقى الإشعار على الشاشة حتى يلمسه الكابتن
        data: {
            url: data.url || './captain.html'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'إشعار من النظام 💎', options)
    );
});

// فتح التطبيق فور النقر على الإشعار
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // إذا كان التطبيق مفتوحاً في الخلفية، قم بجلبه للأمام
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if (client.url.includes('captain.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            // إذا كان التطبيق مغلقاً تماماً، افتح نافذة جديدة
            if (clients.openWindow) {
                return clients.openWindow('./captain.html');
            }
        })
    );
});
