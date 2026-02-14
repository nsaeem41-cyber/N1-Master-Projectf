/**
 * ========================================================
 * N One Core Engine (Diamond Edition 💎)
 * الملف الموحد: العقل المدبر + المصلح المركزي + ذكاء العميل
 * Developed for: Habbat al-Sukar & Auntie Mimi
 * ========================================================
 */

/* ========================================================
   PART 1: THE CORE (المصلح المركزي والأساسات)
   ======================================================== */
const N_ONE_CORE = {
    // 1. الرابط الملكي الموحد (جسر الاتصال بقاعدة البيانات)
    API_URL: "https://script.google.com/macros/s/AKfycbytYicEdE87FeQ5j9K9l3wrM9YB9uDDojNhjIKLGDDijBfOxwJPxFYDILkfIfBxJiKP/exec",

    // 2. ألوان الهوية البصرية
    THEME: {
        primary: "#00695c",   // لون الشركات
        admin: "#1a237e",     // لون الإدارة
        gold: "#d4af37",      // الذهبي الملكي
        success: "#2e7d32",   // أخضر
        danger: "#c62828",    // أحمر
        bg: "#f4f7f6"         // خلفية
    },

    // 3. نظام "إبرة العنبر" لإصلاح الجلسات والتحقق
    checkSession: function(requiredRole = null) {
        const userStr = localStorage.getItem('currentUser');
        if (!userStr) {
            console.warn("⛔ No session found. Redirecting...");
            this.logout();
            return null;
        }
        const user = JSON.parse(userStr);
        if (requiredRole) {
            if (user.role === 'admin') return user; // الأدمن يدخل كل مكان
            if (user.role !== requiredRole) {
                console.warn(`⛔ Role Mismatch. Required: ${requiredRole}, Found: ${user.role}`);
                this.logout();
                return null;
            }
        }
        localStorage.setItem('nOne_last_active', Date.now());
        return user;
    },

    // 4. الخروج الآمن
    logout: function() {
        localStorage.removeItem('currentUser');
        sessionStorage.clear();
        window.location.replace('index.html');
    },

    // 5. نظام التوصيات الذكي (System 555)
    analyzeCaptainPerformance: function(captainData) {
        const MIN_ORDERS = 50; 
        if (captainData.totalOrders >= MIN_ORDERS) {
            return {
                status: true,
                badge: "🏅 كابتن ماسي",
                message: `🌟 توصية ذكية: الكابتن ${captainData.name} حقق أداءً استثنائياً! (System 555)`
            };
        }
        return { status: false, message: "" };
    },

    // 6. دوال الاتصال بالسيرفر (GET)
    fetchData: async function(action, params = {}) {
        try {
            let url = this.API_URL + "?action=" + action;
            for (const key in params) {
                url += `&${key}=${encodeURIComponent(params[key])}`;
            }
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error("N One Core Fetch Error:", error);
            return [];
        }
    },

    // 7. دوال الإرسال للسيرفر (POST)
    postData: async function(action, dataObj) {
        try {
            await fetch(this.API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: action, data: dataObj })
            });
            return true;
        } catch (error) {
            console.error("N One Core Post Error:", error);
            return false;
        }
    }
};

/* ========================================================
   PART 2: CLIENT INTELLIGENCE (الذكاء الألماسي للعميل)
   يتم تفعيله تلقائياً عند تحميل الصفحة
   ======================================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log("💎 N One Diamond Intelligence Active");

    // التحقق هل نحن في صفحة العميل (client.html)
    const isClientPage = document.getElementById('man_phone'); 
    
    if (isClientPage) {
        // 1. تفعيل ذاكرة الكباتن الفولاذية
        const phoneInput = document.getElementById('man_phone');
        if(phoneInput) phoneInput.addEventListener('input', checkCaptainMemory);
        
        // 2. حقن خانة النسبة (إذا نسيت إضافتها في HTML)
        injectCommissionInput();
        
        // 3. سحب اسم الشركة الحالي
        if(typeof N_ONE_CORE !== 'undefined') {
            const session = N_ONE_CORE.checkSession('client');
            window.currentCompanyName = session ? session.name : "N One";
        }

        // 4. تفعيل عرض الأرشيف المالي
        if(typeof window.renderArchiveOverride === 'function') {
            window.renderArchiveOverride();
        }
    }
});

// --- دوال الذاكرة والنسب ---
function injectCommissionInput() {
    const feeInput = document.getElementById('man_fee');
    // نتأكد أنها غير موجودة عشان ما نكررها
    if (feeInput && !document.getElementById('man_cap_comm')) {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex'; wrapper.style.gap = '10px'; wrapper.style.marginTop = '10px';
        wrapper.innerHTML = `
            <div style="position:relative; flex:1;">
                <input type="number" id="man_cap_comm" placeholder="نسبة الكابتن" style="width:100%; border:1px solid #d4af37; padding:12px; border-radius:8px; outline:none;">
                <span style="position:absolute; left:10px; top:12px; color:#aaa; font-size:12px;">%</span>
            </div>
            <div style="flex:1; display:flex; align-items:center; font-size:11px; color:#555;">سيتم حفظ النسبة تلقائياً 💾</div>
        `;
        // زر الواتساب هو العلامة اللي بنضيف قبلها
        const btn = document.querySelector('.btn-whatsapp');
        if(btn) btn.parentNode.insertBefore(wrapper, btn);
    }
}

function checkCaptainMemory() {
    let phone = document.getElementById('man_phone').value;
    const hint = document.getElementById('cap_memory_hint');
    const nameInput = document.getElementById('man_cap_name');
    const commInput = document.getElementById('man_cap_comm');
    
    // تنظيف الرقم
    let cleanPhone = phone.replace(/\D/g, ''); 
    if (cleanPhone.startsWith('962')) cleanPhone = cleanPhone.substring(3);
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    
    const memory = JSON.parse(localStorage.getItem('n1_captains_db_diamond') || '{}');
    const captainData = memory[cleanPhone];

    if (captainData) {
        if(hint) { 
            hint.style.display = 'block'; 
            document.getElementById('mem_cap_name').innerText = captainData.name + ` (${captainData.comm}%)`; 
        }
        if(nameInput && !nameInput.value) nameInput.value = captainData.name;
        if(commInput) commInput.value = captainData.comm;
    } else {
        if(hint) hint.style.display = 'none';
    }
}

function saveCaptainData(phone, name, comm) {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('962')) cleanPhone = cleanPhone.substring(3);
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    const memory = JSON.parse(localStorage.getItem('n1_captains_db_diamond') || '{}');
    memory[cleanPhone] = { name: name, comm: comm || 0 };
    localStorage.setItem('n1_captains_db_diamond', JSON.stringify(memory));
}

// --- دالة الإرسال اليدوي (Global) ---
// نربطها بـ window عشان تكون متاحة في HTML
window.sendManualOrderExternal = function() {
    const capName = document.getElementById('man_cap_name').value;
    let phoneInput = document.getElementById('man_phone').value;
    const locName = document.getElementById('man_loc').value; 
    const fee = document.getElementById('man_fee').value;
    const price = document.getElementById('man_price').value;
    const comm = document.getElementById('man_cap_comm') ? document.getElementById('man_cap_comm').value : 0;

    if(!capName || !phoneInput || !locName) { alert("يرجى تعبئة كافة البيانات ☺️"); return; }

    // حفظ في الذاكرة
    saveCaptainData(phoneInput, capName, comm);

    // معالجة الرقم
    let finalPhone = phoneInput.replace(/\D/g, '');
    if (finalPhone.startsWith('0')) finalPhone = finalPhone.substring(1);
    if (!finalPhone.startsWith('962')) finalPhone = "962" + finalPhone;

    // رابط الخرائط الدقيق (Search API)
    const smartLink = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(locName);
    
    // عدد الطلبات اليومي
    const dailyArchive = JSON.parse(localStorage.getItem('n1_daily_archive_' + new Date().toLocaleDateString()) || '[]');
    const dailyCount = dailyArchive.filter(x => x.capName === capName).length + 1;
    
    // سحب اسم الشركة
    const companyName = window.currentCompanyName || "N One";

    // تنسيق الرسالة الرسمي
    let msg = `*إشعار طلب جديد - ${companyName}* 📦%0a`;
    msg += `المرسل إليه: ${capName}%0aيرجى استلام الطلب التالي:%0a%0a`;
    msg += `🏢 *المصدر:* ${locName}%0a🗺️ *الموقع الجغرافي:* ${smartLink}%0a%0a`;
    msg += `📋 *بيانات التوصيل:*%0a🔸 أجرة المندوب: ${fee || 0} د.أ%0a🔹 قيمة الشحنة: ${price || 0} د.أ%0a%0a`;
    msg += `📊 *ملخص النشاط اليومي:*%0aإجمالي الطلبات: ${dailyCount}%0a%0a⚠️ نرجو الالتزام بمعايير الجودة والوقت.`;

    window.open(`https://wa.me/${finalPhone}?text=${msg}`, '_blank');
    addToArchiveExternal(capName, locName, fee, comm);
}

// --- دالة الأرشفة المالية ---
function addToArchiveExternal(capName, locName, fee, commRate) {
    const dailyArchive = JSON.parse(localStorage.getItem('n1_daily_archive_' + new Date().toLocaleDateString()) || '[]');
    // حساب صافي الربح
    const netProfit = (Number(fee) * (Number(commRate) / 100)).toFixed(2);
    const order = { capName, locName, fee, netProfit, time: new Date().toLocaleTimeString('ar-JO', {hour: '2-digit', minute:'2-digit'}) };
    dailyArchive.unshift(order);
    localStorage.setItem('n1_daily_archive_' + new Date().toLocaleDateString(), JSON.stringify(dailyArchive));
    window.renderArchiveOverride();
}

// دالة عرض الأرشيف (Global Override)
window.renderArchiveOverride = function() {
    const tbody = document.getElementById('archive-table-body');
    if(!tbody) return;
    const dailyArchive = JSON.parse(localStorage.getItem('n1_daily_archive_' + new Date().toLocaleDateString()) || '[]');
    tbody.innerHTML = '';
    if(dailyArchive.length === 0) { tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">لم يتم إرسال طلبات يدوية اليوم</td></tr>'; return; }
    
    dailyArchive.forEach(o => {
        tbody.innerHTML += `<tr><td><b>${o.capName}</b></td><td>${o.locName}</td><td>${o.fee}</td><td><span class="badge" style="background:#e8f5e9; color:#1b5e20;">${o.netProfit} د.أ</span></td><td><span class="badge" style="background:#e3f2fd; color:#1565c0;">تم ✅</span></td></tr>`;
    });
    
    // إضافة ترويسة صافي الربح ديناميكياً
    const thead = document.querySelector('#archive-table-body').parentNode.querySelector('thead tr');
    if(thead && thead.children.length === 4) {
        const th = document.createElement('th'); th.innerText = "صافي الربح"; thead.insertBefore(th, thead.children[3]);
    }
}

// --- دالة إصلاح التجميد (Active Freeze) ---
window.toggleStatus = async function(u, currentS) {
    const newS = currentS === 'active' ? 'paused' : 'active';
    const action = newS === 'paused' ? "تجميد" : "تفعيل";
    if(!confirm(`هل أنت متأكد من ${action} المنشأة؟`)) return;
    
    document.getElementById('loader-overlay').style.display = 'flex';
    await N_ONE_CORE.postData('update', { user: u, data: { status: newS } });
    
    // نطلب من الصفحة الأصلية تحديث البيانات
    if(typeof fetchData === 'function') await fetchData();
    document.getElementById('loader-overlay').style.display = 'none';
}

// --- تحسين عرض الطلبات الواردة (Live Log Enhancer) ---
// هذه الدالة تعمل بالخلفية لتحديث الجدول بتفاصيل أكثر دقة
setInterval(() => {
    if(window.allData && window.currentUser && document.getElementById('orders-table-body')) {
        const tbody = document.getElementById('orders-table-body');
        const myShopsUsers = window.allData.filter(i => i.type === 'shop' && i.client_user === window.currentUser.user).map(s => s.user);
        const orders = window.allData.filter(i => i.type === 'order' && myShopsUsers.includes(i.client_user)).reverse();

        // التنبيه الصوتي
        if (window.lastOrderCount && orders.length > window.lastOrderCount) {
            const audio = document.getElementById('notif-sound'); if(audio) audio.play().catch(e=>{});
        }
        window.lastOrderCount = orders.length;

        let totalProfit = 0;
        tbody.innerHTML = '';
        if(orders.length===0){ tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">لا توجد طلبات واردة</td></tr>'; return;}

        orders.forEach(ord => {
            const shop = window.allData.find(s => s.user === ord.client_user);
            const commRate = shop ? Number(shop.commission || 0) : 0;
            const deliveryFee = Number(ord.fee || 0);
            const profit = deliveryFee * (commRate / 100);
            totalProfit += profit;
            
            const mapUrl = ord.pickup || (shop ? shop.location_link : '#');
            const sourceName = shop ? shop.name : 'مصدر خارجي';
            const backupLoc = ord.pickup_text || sourceName;

            tbody.innerHTML += `
                <tr>
                    <td style="font-size:12px;">${ord.date.split('T')[1]?.substring(0,5) || 'Now'}</td>
                    <td><b>${sourceName}</b></td>
                    <td><a href="${mapUrl}" target="_blank" style="text-decoration:none; color:#00695c;">📍 الموقع</a> <span style="font-size:10px; color:#888;">(${backupLoc})</span></td>
                    <td>${deliveryFee.toFixed(2)}</td>
                    <td><span class="badge" style="background:#e8f5e9; color:#1b5e20;">+${profit.toFixed(2)}</span></td>
                </tr>
            `;
        });
        const profitEl = document.getElementById('total-profit');
        if(profitEl) profitEl.innerText = totalProfit.toFixed(1) + " د.أ";
    }
}, 2000); // تحديث كل ثانيتين
