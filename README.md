
# JenanFlo

تطبيق متجر رقمي محلي مبني باستخدام Next.js و SQLite عبر Prisma.

## ما تم تحسينه
- اعتماد قاعدة بيانات SQLite محلية عبر Prisma
- تخزين وإدارة المنتجات، الأقسام، العملاء، الطلبات، والكوبونات
- نظام كوبونات مع تحقق من الصلاحية وحدود الاستخدام
- تسجيل مستخدمين وحماية كلمة المرور عبر `bcryptjs`
- تعديل سجلات المستخدمين والطلبات ضمن API آمن
- واجهات لوحة التحكم لإدارة المنتجات والكوبونات

## التشغيل المحلي

1. ثبت الحزم:

```bash
npm install
```

2. شغّل الخادم في وضع التطوير:

```bash
npm run dev
```

3. افتح المتصفح على:

```bash
http://localhost:3000
```

## هيكل المشروع
- `src/app/page.tsx` - الصفحة الرئيسية
- `src/app/checkout/page.tsx` - صفحة الدفع
- `src/app/admin/` - لوحة الإدارة
- `src/app/api/` - نقاط نهاية API
- `src/lib/localDb.ts` - منطق العمل مع Prisma
- `prisma/schema.prisma` - مخطط قاعدة البيانات

## إعدادات البيئة
- `DATABASE_URL` (افتراضيًا `file:./dev.db`)
- `ADMIN_EMAIL` (افتراضيًا `admin@jenanflo.com`)
- `ADMIN_PASSWORD` (افتراضيًا `admin123`)
- `ADMIN_NAME` (افتراضيًا `مدير المتجر`)

## ملاحظات مهمة
- يتم حفظ كلمات المرور مشفرة في قاعدة البيانات
- يتم تجاهل قاعدة البيانات المحلية في `.gitignore`
- لا يلزم Supabase أو MongoDB بعد الآن
- تحديثات وإصلاحات المشاريع تتم عبر `npm run build`

## بناء وإنتاج

```bash
npm run build
npm run start
```

---

تم بناء المشروع باستخدام Next.js و Prisma و SQLite.
