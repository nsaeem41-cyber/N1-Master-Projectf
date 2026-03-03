// =================================================================
// N One Empire - Service Worker (Smart Cache Controller)
// =================================================================

// 👑 غيري هاد الرقم كل ما تعملي تحديث جديد عشان تجيبري أجهزة الكباتن تتحدث
const CACHE_VERSION = 'N-One-Empire-v727'; 
const DYNAMIC_CACHE = 'N-One-Dynamic-v727';

// 🗂️ الملفات الأساسية اللي لازم تتخزن عشان التطبيق يفتح نفاث حتى لو النت ضعيف
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/n_one_logo_new.png' // الشعار الجديد الفخم
    // بتقدري تضيفي هون أي صفحات ثانية زي '/client.html' لو حبيبتي
];

// 1. التثبيت (Install) - تخزين الملفات الأساسية وتفعيل فوري
self.addEventListener('install', event => {
    self.skipWaiting(); // إجبار التطبيق على التحديث فوراً بدون انتظار
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(cache => {
                console.log('[N One SW] جاري تجهيز الذخيرة الألماسية...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// 2. التفعيل (Activate) - تنظيف الذاكرة القديمة وتطهير السيستم
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.map(key => {
                if (key !== CACHE_VERSION && key !== DYNAMIC_CACHE) {
                    console.log('[N One SW] تم تدمير الذاكرة القديمة:', key);
                    return caches.delete(key);
                }
            }));
        }).then(() => self.clients.claim()) // السيطرة الفورية على كل الصفحات المفتوحة
    );
});

// 3. الاعتراض (Fetch) - خوارزمية جلب البيانات بذكاء
self.addEventListener('fetch', event => {
    const reqUrl = event.request.url;

    // 🛑 حماية خطيرة: منع السيرفر وكر من التدخل في فايربيس عشان الرادار ما يعلق!
    if (reqUrl.includes('firestore.googleapis.com') || 
        reqUrl.includes('firebaseio.com') || 
        reqUrl.includes('google.com')) {
        return; // خليه يمر طبيعي بدون كاش
    }

    // استراتيجية (Network First) - جيب الجديد من النت، وإذا النت فاصل جيب من الذاكرة
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                return caches.open(DYNAMIC_CACHE).then(cache => {
                    // تحديث الذاكرة الديناميكية بالنسخة الجديدة
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // لو النت فاصل، جيب النسخة المخبية في الإمبراطورية
                return caches.match(event.request);
            })
    );
});
