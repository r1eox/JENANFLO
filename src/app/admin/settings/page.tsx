'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    taxEnabled: true, taxRate: 15,
    paymentMada: true, paymentTamara: true, paymentTabby: true, paymentCOD: true,
    deliveryFee: 25, freeDeliveryMin: 300,
    autoConfirmOrder: true, autoPreparingNotify: true, autoDeliveryNotify: true, autoDeliveredNotify: true,
    autoThankYou: true, thankYouDelay: 24,
    autoAbandonedCart: true, abandonedCartDelay: 24,
    autoBirthdayReminder: true, birthdayReminderDays: 3,
    storeName: "جنان فلو",
    storePhone: "+966501234567",
    storeEmail: "info@jenanflo.com",
    storeAddress: "الرياض، المملكة العربية السعودية",
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => { setSettings(s => ({ ...s, ...data })); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Section = ({ title, children, icon }: { title: string; children: React.ReactNode; icon: string }) => (
    <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );

  const Toggle = ({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: () => void }) => (
    <label className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 cursor-pointer">
      <div>
        <div className="text-white">{label}</div>
        {description && <div className="text-gray-400 text-sm">{description}</div>}
      </div>
      <div
        className={`w-12 h-6 rounded-full p-1 transition ${checked ? "bg-green-500" : "bg-white/20"}`}
        onClick={onChange}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white transition transform ${checked ? "translate-x-6" : "translate-x-0"}`}
        />
      </div>
    </label>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1E2A2A] to-[#2D3436] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin" className="text-[#4A9BA0] hover:underline text-sm mb-2 inline-block">
            ← العودة للوحة التحكم
          </Link>
          <h1 className="text-3xl font-bold text-[#C9A96E]">⚙️ إعدادات النظام</h1>
        </div>
        <button
          className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
            saved ? "bg-green-500 text-white" : "bg-[#C9A96E] text-black hover:bg-[#D4AF37]"
          }`}
          onClick={handleSave}
        >
          {saved ? "✓ تم الحفظ" : "💾 حفظ الإعدادات"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* معلومات المتجر */}
        <Section title="معلومات المتجر" icon="🏪">
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm block mb-2">اسم المتجر</label>
              <input
                type="text"
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">رقم الهاتف</label>
              <input
                type="text"
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                value={settings.storePhone}
                onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                value={settings.storeEmail}
                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">العنوان</label>
              <input
                type="text"
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                value={settings.storeAddress}
                onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
              />
            </div>
          </div>
        </Section>

        {/* الضريبة */}
        <Section title="الضريبة المضافة" icon="💰">
          <Toggle
            label="تفعيل الضريبة المضافة"
            description="إضافة ضريبة القيمة المضافة على الطلبات"
            checked={settings.taxEnabled}
            onChange={() => setSettings({ ...settings, taxEnabled: !settings.taxEnabled })}
          />
          {settings.taxEnabled && (
            <div className="mt-4">
              <label className="text-gray-400 text-sm block mb-2">نسبة الضريبة (%)</label>
              <input
                type="number"
                className="w-32 bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
              />
            </div>
          )}
        </Section>

        {/* وسائل الدفع */}
        <Section title="وسائل الدفع" icon="💳">
          <Toggle
            label="مدى (Mada)"
            description="بطاقات الخصم المباشر"
            checked={settings.paymentMada}
            onChange={() => setSettings({ ...settings, paymentMada: !settings.paymentMada })}
          />
          <Toggle
            label="تمارا (Tamara)"
            description="الدفع على 4 دفعات"
            checked={settings.paymentTamara}
            onChange={() => setSettings({ ...settings, paymentTamara: !settings.paymentTamara })}
          />
          <Toggle
            label="تابي (Tabby)"
            description="اشتري الآن وادفع لاحقاً"
            checked={settings.paymentTabby}
            onChange={() => setSettings({ ...settings, paymentTabby: !settings.paymentTabby })}
          />
          <Toggle
            label="الدفع عند الاستلام"
            description="الدفع نقداً عند التوصيل"
            checked={settings.paymentCOD}
            onChange={() => setSettings({ ...settings, paymentCOD: !settings.paymentCOD })}
          />
        </Section>

        {/* التوصيل */}
        <Section title="التوصيل" icon="🚚">
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm block mb-2">رسوم التوصيل (ر.س)</label>
              <input
                type="number"
                className="w-32 bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                value={settings.deliveryFee}
                onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">توصيل مجاني للطلبات فوق (ر.س)</label>
              <input
                type="number"
                className="w-32 bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                value={settings.freeDeliveryMin}
                onChange={(e) => setSettings({ ...settings, freeDeliveryMin: Number(e.target.value) })}
              />
            </div>
          </div>
        </Section>

        {/* الإشعارات التلقائية - طلبات */}
        <Section title="إشعارات الطلبات (تلقائية)" icon="📲">
          <Toggle
            label="إشعار تأكيد الطلب"
            description="إرسال رسالة واتساب تلقائية عند استلام طلب جديد"
            checked={settings.autoConfirmOrder}
            onChange={() => setSettings({ ...settings, autoConfirmOrder: !settings.autoConfirmOrder })}
          />
          <Toggle
            label="إشعار بدء التحضير"
            description="إرسال رسالة عند تغيير الحالة إلى 'جاري التحضير'"
            checked={settings.autoPreparingNotify}
            onChange={() => setSettings({ ...settings, autoPreparingNotify: !settings.autoPreparingNotify })}
          />
          <Toggle
            label="إشعار خروج للتوصيل"
            description="إرسال رسالة عند تغيير الحالة إلى 'جاري التوصيل'"
            checked={settings.autoDeliveryNotify}
            onChange={() => setSettings({ ...settings, autoDeliveryNotify: !settings.autoDeliveryNotify })}
          />
          <Toggle
            label="إشعار تم التسليم"
            description="إرسال رسالة عند تأكيد التسليم"
            checked={settings.autoDeliveredNotify}
            onChange={() => setSettings({ ...settings, autoDeliveredNotify: !settings.autoDeliveredNotify })}
          />
        </Section>

        {/* الإشعارات التلقائية - تسويق */}
        <Section title="إشعارات التسويق (تلقائية)" icon="📣">
          <Toggle
            label="رسالة شكر بعد التسليم"
            description="إرسال رسالة شكر مع كود خصم"
            checked={settings.autoThankYou}
            onChange={() => setSettings({ ...settings, autoThankYou: !settings.autoThankYou })}
          />
          {settings.autoThankYou && (
            <div className="mt-2 mr-4">
              <label className="text-gray-400 text-sm block mb-2">بعد كم ساعة؟</label>
              <input
                type="number"
                className="w-24 bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm"
                value={settings.thankYouDelay}
                onChange={(e) => setSettings({ ...settings, thankYouDelay: Number(e.target.value) })}
              />
            </div>
          )}
          
          <Toggle
            label="تذكير السلة المهجورة"
            description="إرسال رسالة للعملاء الذين تركوا سلة الشراء"
            checked={settings.autoAbandonedCart}
            onChange={() => setSettings({ ...settings, autoAbandonedCart: !settings.autoAbandonedCart })}
          />
          {settings.autoAbandonedCart && (
            <div className="mt-2 mr-4">
              <label className="text-gray-400 text-sm block mb-2">بعد كم ساعة؟</label>
              <input
                type="number"
                className="w-24 bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm"
                value={settings.abandonedCartDelay}
                onChange={(e) => setSettings({ ...settings, abandonedCartDelay: Number(e.target.value) })}
              />
            </div>
          )}
          
          <Toggle
            label="تذكير عيد الميلاد"
            description="إرسال عرض خاص قبل عيد ميلاد العميل"
            checked={settings.autoBirthdayReminder}
            onChange={() => setSettings({ ...settings, autoBirthdayReminder: !settings.autoBirthdayReminder })}
          />
          {settings.autoBirthdayReminder && (
            <div className="mt-2 mr-4">
              <label className="text-gray-400 text-sm block mb-2">قبل كم يوم؟</label>
              <input
                type="number"
                className="w-24 bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm"
                value={settings.birthdayReminderDays}
                onChange={(e) => setSettings({ ...settings, birthdayReminderDays: Number(e.target.value) })}
              />
            </div>
          )}
        </Section>
      </div>

      {/* رابط لقوالب الرسائل */}
      <div className="bg-gradient-to-r from-green-500/20 to-[#4A9BA0]/20 rounded-xl border border-green-500/30 p-6 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">💬 تخصيص رسائل واتساب</h3>
            <p className="text-gray-400">تعديل قوالب الرسائل التلقائية والفواتير</p>
          </div>
          <Link
            href="/admin/whatsapp"
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition"
          >
            تعديل القوالب
          </Link>
        </div>
      </div>
    </main>
  );
}
