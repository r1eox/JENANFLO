"use client";
import React, { useState } from "react";
import Link from "next/link";

type MessageTemplate = {
  id: string;
  name: string;
  type: string;
  trigger: string;
  message: string;
  active: boolean;
  sentCount: number;
};

export default function AdminWhatsApp() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: "1",
      name: "تأكيد الطلب",
      type: "طلب جديد",
      trigger: "تلقائي عند استلام طلب جديد",
      message: `مرحباً {customer_name}! 🌸

شكراً لطلبك من جنان فلو 💐

رقم طلبك: {order_number}
المبلغ: {total} ر.س

سنبدأ بتحضير طلبك فوراً ✨

للاستفسار: +966501234567`,
      active: true,
      sentCount: 156,
    },
    {
      id: "2",
      name: "بدء التحضير",
      type: "تحديث الحالة",
      trigger: "تلقائي عند تغيير الحالة إلى 'جاري التحضير'",
      message: `مرحباً {customer_name} 👋

طلبك رقم {order_number} الآن قيد التحضير! 🔧

فريقنا يجهز هديتك بكل حب 💝

موعد التسليم المتوقع: {delivery_date}

جنان فلو 🌸`,
      active: true,
      sentCount: 134,
    },
    {
      id: "3",
      name: "خرج للتوصيل",
      type: "تحديث الحالة",
      trigger: "تلقائي عند تغيير الحالة إلى 'جاري التوصيل'",
      message: `{customer_name}، أخبار سارة! 🎉

طلبك في الطريق إليك الآن! 🚚💨

رقم الطلب: {order_number}
العنوان: {address}

السائق سيتواصل معك قريباً 📞

جنان فلو 💐`,
      active: true,
      sentCount: 128,
    },
    {
      id: "4",
      name: "تم التسليم",
      type: "تحديث الحالة",
      trigger: "تلقائي عند تغيير الحالة إلى 'تم التسليم'",
      message: `تم تسليم طلبك بنجاح! ✅

{customer_name}، نتمنى أن هديتك أسعدت قلبك 💝

شاركنا رأيك وقيّم تجربتك ⭐⭐⭐⭐⭐

شكراً لثقتك بجنان فلو 🌸`,
      active: true,
      sentCount: 120,
    },
    {
      id: "5",
      name: "رسالة شكر",
      type: "بعد التسليم",
      trigger: "تلقائي بعد 24 ساعة من التسليم",
      message: `شكراً لك {customer_name} 💐

نتمنى أن تكون تجربتك معنا رائعة!

خصم 10% على طلبك القادم 🎁
الكود: THANKYOU10

ننتظرك دائماً 🌸
جنان فلو`,
      active: true,
      sentCount: 98,
    },
    {
      id: "6",
      name: "تذكير عيد الميلاد",
      type: "مناسبة",
      trigger: "قبل 3 أيام من عيد ميلاد العميل",
      message: `مرحباً {customer_name}! 🎂

عيد ميلادك قريب! ماذا لو أهديت نفسك شيئاً مميزاً؟

خصم 25% بمناسبة عيد ميلادك 🎁
الكود: BDAY25

صالح حتى نهاية شهر ميلادك 💝

jenanflo.com`,
      active: false,
      sentCount: 45,
    },
    {
      id: "7",
      name: "سلة مهجورة",
      type: "تذكير",
      trigger: "بعد 24 ساعة من ترك السلة",
      message: `مرحباً {customer_name} 👋

نسيت بعض الجمال في سلتك! 🛒

لا تخلي الورد ينتظر 🌹

أكمل طلبك الآن واستمتع بتوصيل مجاني 🚚

jenanflo.com/cart`,
      active: true,
      sentCount: 67,
    },
    {
      id: "8",
      name: "إرسال الفاتورة",
      type: "فاتورة",
      trigger: "يدوي أو تلقائي مع تأكيد الطلب",
      message: `🌸 *فاتورة جنان فلو* 🌸

رقم الطلب: {order_number}
التاريخ: {order_date}

━━━━━━━━━━━━━━━━
*تفاصيل الطلب:*
{order_items}

━━━━━━━━━━━━━━━━
المجموع: {subtotal} ر.س
الضريبة (15%): {tax} ر.س
التوصيل: {delivery_fee} ر.س
*الإجمالي: {total} ر.س*

📍 {address}
📅 {delivery_date} ({delivery_time})

شكراً لثقتكم بجنان فلو 💐`,
      active: true,
      sentCount: 156,
    },
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [testPhone, setTestPhone] = useState("");

  const toggleTemplate = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  const sendTestMessage = (template: MessageTemplate) => {
    if (!testPhone) {
      alert("الرجاء إدخال رقم الهاتف للاختبار");
      return;
    }
    const sampleMessage = template.message
      .replace("{customer_name}", "أحمد (اختبار)")
      .replace("{order_number}", "JF-000999")
      .replace("{total}", "350")
      .replace("{subtotal}", "300")
      .replace("{tax}", "45")
      .replace("{delivery_fee}", "25")
      .replace("{delivery_date}", "2026-03-03")
      .replace("{delivery_time}", "14:00 - 16:00")
      .replace("{address}", "الرياض، حي النرجس")
      .replace("{order_date}", "2026-03-02")
      .replace("{order_items}", "• باقة سيمفونية الربيع × 1 = 250 ر.س");

    const encodedMessage = encodeURIComponent(sampleMessage);
    const phone = testPhone.replace("+", "").replace(/\s/g, "");
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "طلب جديد": return "bg-blue-500/20 text-blue-400";
      case "تحديث الحالة": return "bg-purple-500/20 text-purple-400";
      case "بعد التسليم": return "bg-green-500/20 text-green-400";
      case "مناسبة": return "bg-pink-500/20 text-pink-400";
      case "تذكير": return "bg-yellow-500/20 text-yellow-400";
      case "فاتورة": return "bg-[#C9A96E]/20 text-[#C9A96E]";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const variables = [
    { name: "{customer_name}", desc: "اسم العميل" },
    { name: "{order_number}", desc: "رقم الطلب" },
    { name: "{total}", desc: "المبلغ الإجمالي" },
    { name: "{subtotal}", desc: "المجموع قبل الضريبة" },
    { name: "{tax}", desc: "الضريبة" },
    { name: "{delivery_fee}", desc: "رسوم التوصيل" },
    { name: "{delivery_date}", desc: "تاريخ التوصيل" },
    { name: "{delivery_time}", desc: "وقت التوصيل" },
    { name: "{address}", desc: "عنوان التوصيل" },
    { name: "{order_items}", desc: "قائمة المنتجات" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1E2A2A] to-[#2D3436] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin" className="text-[#4A9BA0] hover:underline text-sm mb-2 inline-block">
            ← العودة للوحة التحكم
          </Link>
          <h1 className="text-3xl font-bold text-[#C9A96E]">💬 رسائل واتساب</h1>
          <p className="text-gray-400 mt-1">قوالب الرسائل التلقائية والفواتير</p>
        </div>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="رقم للاختبار: 966501234567"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 w-52"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
          />
        </div>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-white">{templates.length}</div>
          <div className="text-gray-400 text-sm">قوالب الرسائل</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-green-400">
            {templates.filter((t) => t.active).length}
          </div>
          <div className="text-gray-400 text-sm">قوالب نشطة</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-[#4A9BA0]">
            {templates.reduce((sum, t) => sum + t.sentCount, 0)}
          </div>
          <div className="text-gray-400 text-sm">رسائل مرسلة</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-[#C9A96E]">98%</div>
          <div className="text-gray-400 text-sm">معدل الوصول</div>
        </div>
      </div>

      {/* المتغيرات المتاحة */}
      <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/10">
        <h3 className="text-white font-medium mb-3">📝 المتغيرات المتاحة في الرسائل:</h3>
        <div className="flex flex-wrap gap-2">
          {variables.map((v) => (
            <span
              key={v.name}
              className="bg-white/10 px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-white/20"
              title={v.desc}
            >
              <span className="text-[#C9A96E]">{v.name}</span>
              <span className="text-gray-400 mr-1">- {v.desc}</span>
            </span>
          ))}
        </div>
      </div>

      {/* قوالب الرسائل */}
      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`bg-white/5 backdrop-blur rounded-xl border p-6 transition ${
              template.active ? "border-green-500/30" : "border-white/10"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white font-bold text-lg">{template.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(template.type)}`}>
                    {template.type}
                  </span>
                  {template.active ? (
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                      ✓ نشط
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400">
                      متوقف
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-4">⚡ {template.trigger}</p>

                {/* معاينة الرسالة */}
                <div className="bg-[#075E54]/20 rounded-xl p-4 border border-[#075E54]/30 max-w-md">
                  <div className="text-white/90 text-sm whitespace-pre-wrap leading-relaxed">
                    {template.message.slice(0, 200)}
                    {template.message.length > 200 && "..."}
                  </div>
                </div>

                <div className="text-gray-400 text-xs mt-3">
                  📤 {template.sentCount} رسالة مرسلة
                </div>
              </div>

              <div className="flex flex-col gap-2 mr-4">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    template.active
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  }`}
                  onClick={() => toggleTemplate(template.id)}
                >
                  {template.active ? "⏸️ إيقاف" : "▶️ تفعيل"}
                </button>
                <button
                  className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/20"
                  onClick={() => {
                    setEditingTemplate(template);
                    setShowEditModal(true);
                  }}
                >
                  ✏️ تعديل
                </button>
                <button
                  className="bg-[#25D366]/20 text-[#25D366] px-4 py-2 rounded-lg text-sm hover:bg-[#25D366]/30"
                  onClick={() => sendTestMessage(template)}
                >
                  🧪 اختبار
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* مودال التعديل */}
      {showEditModal && editingTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-6">
          <div className="bg-[#1E2A2A] rounded-2xl p-6 w-full max-w-2xl border border-white/10 my-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              ✏️ تعديل قالب: {editingTemplate.name}
            </h3>

            <div className="space-y-6">
              <div>
                <label className="text-gray-400 text-sm block mb-2">اسم القالب</label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">محتوى الرسالة</label>
                <textarea
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-4 text-white h-64 font-mono text-sm"
                  value={editingTemplate.message}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, message: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">المتغيرات السريعة</label>
                <div className="flex flex-wrap gap-2">
                  {variables.map((v) => (
                    <button
                      key={v.name}
                      className="bg-white/10 px-3 py-1 rounded text-xs text-[#C9A96E] hover:bg-white/20"
                      onClick={() =>
                        setEditingTemplate({
                          ...editingTemplate,
                          message: editingTemplate.message + " " + v.name,
                        })
                      }
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                className="flex-1 bg-[#C9A96E] text-black py-3 rounded-lg font-medium hover:bg-[#D4AF37] transition"
                onClick={() => {
                  setTemplates((prev) =>
                    prev.map((t) => (t.id === editingTemplate.id ? editingTemplate : t))
                  );
                  setShowEditModal(false);
                }}
              >
                💾 حفظ التغييرات
              </button>
              <button
                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                onClick={() => setShowEditModal(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
