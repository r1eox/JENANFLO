'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminSettings() {
  type GiftExtra = {
    _id: string;
    name: string;
    price: number;
    emoji: string;
    active: boolean;
    sortOrder: number;
  };

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
  const [extras, setExtras] = useState<GiftExtra[]>([]);
  const [extraName, setExtraName] = useState('');
  const [extraPrice, setExtraPrice] = useState(0);
  const [extraEmoji, setExtraEmoji] = useState('🎁');
  const [editingExtraId, setEditingExtraId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editEmoji, setEditEmoji] = useState('🎁');
  const [draggedExtraId, setDraggedExtraId] = useState<string | null>(null);
  const [savingExtraId, setSavingExtraId] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => { setSettings(s => ({ ...s, ...data })); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const loadExtras = async () => {
    try {
      const response = await fetch('/api/extras', { cache: 'no-store' });
      const list = await response.json();
      setExtras(Array.isArray(list) ? list : []);
    } catch {
      setExtras([]);
    }
  };

  useEffect(() => {
    loadExtras();
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

  const handleAddExtra = async () => {
    if (!extraName.trim() || extraPrice <= 0) return;
    const res = await fetch('/api/extras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: extraName.trim(), price: extraPrice, emoji: extraEmoji, active: true }),
    });
    if (res.ok) {
      setExtraName('');
      setExtraPrice(0);
      setExtraEmoji('🎁');
      loadExtras();
    }
  };

  const handleToggleExtra = async (id: string, active: boolean) => {
    setSavingExtraId(id);
    const res = await fetch('/api/extras', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active }),
    });
    setSavingExtraId(null);
    if (res.ok) loadExtras();
  };

  const startEditExtra = (extra: GiftExtra) => {
    setEditingExtraId(extra._id);
    setEditName(extra.name);
    setEditPrice(extra.price);
    setEditEmoji(extra.emoji || '🎁');
  };

  const cancelEditExtra = () => {
    setEditingExtraId(null);
    setEditName('');
    setEditPrice(0);
    setEditEmoji('🎁');
  };

  const saveEditExtra = async () => {
    if (!editingExtraId || !editName.trim() || editPrice <= 0) return;
    setSavingExtraId(editingExtraId);
    const res = await fetch('/api/extras', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingExtraId,
        name: editName.trim(),
        price: Number(editPrice),
        emoji: editEmoji || '🎁',
      }),
    });
    setSavingExtraId(null);
    if (res.ok) {
      cancelEditExtra();
      loadExtras();
    }
  };

  const persistReorder = async (next: GiftExtra[]) => {
    const previous = [...extras];
    setExtras(next);
    setIsReordering(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    try {
      const res = await fetch('/api/extras', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: next.map((e) => e._id) }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error('Failed to reorder');
      }

      await loadExtras();
    } catch {
      setExtras(previous);
    } finally {
      clearTimeout(timeoutId);
      setIsReordering(false);
      setDraggedExtraId(null);
    }
  };

  const handleDragStartExtra = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    if (isReordering) return;
    setDraggedExtraId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragEndExtra = () => {
    setDraggedExtraId(null);
  };

  const handleDragOverExtra = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropExtra = async (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    const sourceId = draggedExtraId || e.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === targetId || isReordering) {
      setDraggedExtraId(null);
      return;
    }

    const fromIndex = extras.findIndex((e) => e._id === sourceId);
    const toIndex = extras.findIndex((e) => e._id === targetId);
    if (fromIndex < 0 || toIndex < 0) {
      setDraggedExtraId(null);
      return;
    }

    const next = [...extras];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);

    await persistReorder(next);
  };

  const handleDropOnList = () => {
    // Always clear stale drag state if drop happens outside cards.
    setDraggedExtraId(null);
  };

  const moveExtra = async (id: string, direction: 'up' | 'down') => {
    if (isReordering) return;
    const index = extras.findIndex((e) => e._id === id);
    if (index < 0) return;

    const toIndex = direction === 'up' ? index - 1 : index + 1;
    if (toIndex < 0 || toIndex >= extras.length) return;

    const next = [...extras];
    const [moved] = next.splice(index, 1);
    next.splice(toIndex, 0, moved);
    await persistReorder(next);
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

        <div className="lg:col-span-2">
          <Section title="إضافات الهدية المميزة" icon="✨">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              <input
                type="text"
                placeholder="اسم الإضافة"
                className="bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                value={extraName}
                onChange={(e) => setExtraName(e.target.value)}
              />
              <input
                type="number"
                placeholder="السعر"
                className="bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                value={extraPrice || ''}
                onChange={(e) => setExtraPrice(Number(e.target.value))}
              />
              <input
                type="text"
                placeholder="إيموجي"
                className="bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                value={extraEmoji}
                onChange={(e) => setExtraEmoji(e.target.value || '🎁')}
              />
              <button
                onClick={handleAddExtra}
                className="bg-[#4A9BA0] text-white rounded-lg p-3 hover:bg-[#3B8A8F] transition"
              >
                + إضافة
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-3">اسحب من مقبض ⋮⋮ للترتيب، أو استخدم ↑ ↓ إذا كان السحب غير مستقر.</p>

            <div className="space-y-2" onDragEnd={handleDragEndExtra} onDrop={handleDropOnList}>
              {extras.map((extra) => (
                <div
                  key={extra._id}
                  onDragOver={handleDragOverExtra}
                  onDrop={(e) => handleDropExtra(e, extra._id)}
                  className="rounded-lg p-3"
                  style={{
                    background: extra.active ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${draggedExtraId === extra._id ? '#4A9BA0' : 'rgba(255,255,255,0.12)'}`,
                    opacity: extra.active ? 1 : 0.7,
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div
                      draggable={!isReordering && editingExtraId !== extra._id}
                      onDragStart={(e) => handleDragStartExtra(e, extra._id)}
                      onDragEnd={handleDragEndExtra}
                      className="text-gray-400 cursor-grab select-none px-1 touch-none"
                      title="اسحب للترتيب"
                    >
                      ⋮⋮
                    </div>

                    {editingExtraId === extra._id ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
                        <input
                          type="text"
                          className="bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                        <input
                          type="number"
                          className="bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                          value={editPrice || ''}
                          onChange={(e) => setEditPrice(Number(e.target.value))}
                        />
                        <input
                          type="text"
                          className="bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                          value={editEmoji}
                          onChange={(e) => setEditEmoji(e.target.value || '🎁')}
                        />
                      </div>
                    ) : (
                      <div className="text-white flex-1">
                        <span className="text-xl ml-2">{extra.emoji}</span>
                        <span>{extra.name}</span>
                        <span className="text-[#D4AF37] mr-2">+{extra.price} ر.س</span>
                        {!extra.active && <span className="text-xs text-gray-400 mr-2">(غير مفعل)</span>}
                      </div>
                    )}

                    <button
                      onClick={() => handleToggleExtra(extra._id, !extra.active)}
                      disabled={savingExtraId === extra._id || isReordering}
                      className={`px-3 py-1 rounded text-sm ${extra.active ? 'bg-amber-500/20 text-amber-200' : 'bg-emerald-500/20 text-emerald-200'}`}
                    >
                      {extra.active ? 'تعطيل' : 'تفعيل'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveExtra(extra._id, 'up')}
                        disabled={isReordering || extras[0]?._id === extra._id}
                        className="px-2 py-1 rounded text-xs bg-white/10 text-gray-200 disabled:opacity-40"
                        title="تحريك لأعلى"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveExtra(extra._id, 'down')}
                        disabled={isReordering || extras[extras.length - 1]?._id === extra._id}
                        className="px-2 py-1 rounded text-xs bg-white/10 text-gray-200 disabled:opacity-40"
                        title="تحريك لأسفل"
                      >
                        ↓
                      </button>
                    </div>

                    {editingExtraId === extra._id ? (
                      <>
                        <button
                          onClick={saveEditExtra}
                          disabled={savingExtraId === extra._id}
                          className="text-emerald-300 hover:text-emerald-200"
                        >
                          حفظ
                        </button>
                        <button onClick={cancelEditExtra} className="text-gray-300 hover:text-white">
                          إلغاء
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEditExtra(extra)}
                        className="text-sky-300 hover:text-sky-200"
                      >
                        تعديل
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {extras.length === 0 && <p className="text-gray-400 text-sm">لا توجد إضافات حتى الآن.</p>}
            </div>
          </Section>
        </div>

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
