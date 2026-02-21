/**
 * ========================================================
 * N One Core Engine (v3.0 CC) - The Amber Needle 💉💎
 * المحرك المندمج كلياً مع المايسترو v18.6 السيادي
 * ========================================================
 */

const N_ONE_CORE = {
    // 1. الرابط الملكي الموحد (يتعدل هنا ويتطبق في كل الإمبراطورية)
    API_URL: "https://script.google.com/macros/s/AKfycbzKQKytFxtHRh1J6tG2GHJjJVl5I2Iz0eYomc963sqn-V8M4Vd3t3Hmm6daykMWUjHj/exec",

    // 2. ألوان الهوية البصرية (Theme)
    THEME: {
        primary: "#1a237e",   // كحلي ملكي
        gold: "#d4af37",      // ذهبي
        success: "#2e7d32",   // أخضر
        danger: "#c62828",    // أحمر
        warning: "#f57f17",   // برتقالي
        bg: "#f4f7f6"         // خلفية
    },

    // 3. نظام "إبرة العنبر" لإصلاح الجلسات والتحقق (Auth Guard)
    checkSession: function(requiredRole = null) {
        const userStr = localStorage.getItem('currentUser');
        
        if (!userStr) {
            console.warn("⛔ خالتو ميمي تتدخل: لا يوجد تصريح دخول جاري الطرد برقي");
            this.logout();
            return null;
        }

        const user = JSON.parse(userStr);

        if (requiredRole && user.role !== requiredRole) {
            console.warn(`⛔ صلاحيات غير مطابقة المطلوب: ${requiredRole}`);
            if (user.role === 'admin') return user; 
            
            this.logout();
            return null;
        }

        // إبرة العنبر: تحديث وقت آخر ظهور لضمان أن الحساب حي
        localStorage.setItem('nOne_last_active', Date.now());
        return user;
    },

    // 4. الخروج الآمن وتنظيف الذاكرة
    logout: function() {
        localStorage.removeItem('currentUser');
        sessionStorage.clear();
        window.location.replace('index.html');
    },

    // 5. نظام التوصيات الذكي (Brain 555) 🧠
    analyzeCaptainPerformance: function(captainData) {
        const MIN_ORDERS = 50; 
        const MIN_RATING = 4.8; 

        if (captainData.totalOrders >= MIN_ORDERS && captainData.rating >= MIN_RATING) {
            return {
                status: true,
                message: `🌟 توصية ملوكية: الكابتن ${captainData.name} أبدع اليوم يستحق "يوم الإجازة المُهدى" (Idea 555) خاوة القرار لك يا مدير`
            };
        }
        return { status: false, message: "" };
    },

    // 6. دوال الاتصال بالسيرفر السيادي (Fetch Helper)
    fetchData: async function(action, params = {}) {
        try {
            let url = this.API_URL + "?action=" + action;
            for (const key in params) {
                url += `&${key}=${encodeURIComponent(params[key])}`;
            }
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error("N One Core Error: شريان القراءة مسدود", error);
            throw error;
        }
    },

    // اللحام الأبدي والتغليف الملكي المعتمد للـ 10 أكواد
    postData: async function(action, payload) {
        try {
            let bodyData = { action: action };
            
            // تكتيك ملوكي لفصل المفتاح عن البيانات عشان المايسترو يفهمها
            if ((action === 'update' || action === 'delete') && payload.user) {
                bodyData.user = payload.user;
                bodyData.data = payload.data || {};
            } else {
                bodyData.data = payload;
            }

            await fetch(this.API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });
            return true;
        } catch (error) {
            console.error("N One Core Post Error: جلطة في الإرسال", error);
            return false;
        }
    }
};

// تفعيل فوري مع رسالة سيادية
console.log("%c N One Core Loaded 🚀 | V3.0 CC Fusion Active | خالتو ميمي تسيطر", "color: #d4af37; background: #1a237e; font-weight: bold; font-size: 14px; padding: 5px;");
