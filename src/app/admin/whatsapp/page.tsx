'use client';
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

export default function AdminWhatsAppPage() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: "1",
      name: "تاكيد الطلب",
      type: "تاكيد",
      trigger: "عند تقديم طلب جديد",
      message: `مرحبا {customer_name}!\n\nشكرا على طلبك من جنان فلو 🌸\n\nرقم طلبك: {order_number}\nالمجموع: {total} ر.س\n\nسيتم التواصل معك قريبا،\njenanflo.com`,
      active: true,
      sentCount: 156,
    },
    {
      id: "2",
      name: "تحديث الشحن",
      type: "شحن",
      trigger: "عند تحديث حالة الطلب الى شحن",
      message: `مرحبا {customer_name}!\n\nطلبك رقم {order_number} في الطريق اليك! 🚚\n\nتاريخ التوصيل: {deliver_date}`,
      active: true,
      sentCount: 134,
    },
    {
      id: "3",
      name: "تم التسليم",
      type: "تسليم",
      trigger: "عند تحديث حالة الطلب الى تم التسليم",
      message: `مرحبا {customer_name}!\n\nتم توصيل طلبك! 🎉\nنتمنى تكون راضي!\n\nالطلب: {order_number}\nالعنوان: {address}\n\nشكرا من جنان فلو`,
      active: true,
      sentCount: 128,
    },
    {
      id: "4",
      name: "عرض خاص",
      type: "عروض",
      trigger: "يدوي",
      message: `مرحبا {customer_name}!\n\nلديك عرض خاص حصري! 🌸\n\nاحصل على خصم 10% على طلبك القادم\nكود الخصم: JENAN10\n\njenanflo.com/cart`,
      active: true,
      sentCount: 20,
    },
    {
      id: "5",
      name: "متابعة بعد الشراء",
      type: "متابعة",
      trigger: "3 ايام بعد التوصيل",
      message: `مرحبا {customer_name}!\n\nنتمنى اعجبك طلبك من جنان فلو 🌸\n\nممكن تشارك تجربتك معنا?`,
      active: true,
      sentCount: 98,
    },
    {
      id: "6",
      name: "عيد ميلاد",
      type: "مناسبة",
      trigger: "في يوم عيد الميلاد",
      message: `مرحبا {customer_name}!\n\nكل عام وانتي بخير! 🎂\n\nاهدي نفسك اليوم من جنان فلو\nاحصل على خصم 25% اليوم فقط`,
      active: false,
      sentCount: 45,
    },
    {
      id: "7",
      name: "سلة متروكة",
      type: "سلة",
      trigger: "24 ساعة بعد اضافة منتج للسلة",
      message: `مرحبا {customer_name}!\n\nنسيتي شي في سلتك! 🛒\n\nاكملي طلبك الان:\njenanflo.com/cart`,
      active: true,
      sentCount: 67,
    },
    {
      id: "8",
      name: "فاتورة الطلب",
      type: "فاتورة",
      trigger: "عند تقديم طلب جديد",
      message: `*مرحبا {customer_name}!*\n\nرقم طلبك: {order_number}\nتاريخ الطلب: {order_date}\n\nالمنتجات:\n{order_items}\n\nالمجموع: {subtotal} ر.س\nالضريبة (15%): {tax} ر.س\nالتوصيل: {delivery_fee} ر.س\n*الاجمالي: {total} ر.س*\n\n{address}\n{deliver_date} ({delivery_time})\n\nشكرا من جنان فلو! 🌸`,
      active: true,
      sentCount: 76,
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
      alert("الرجاء ادخال رقم الهاتف للتجربة");
      return;
    }
    const sampleMessage = template.message
      .replace("{customer_name}", "عميل تجربة")
      .replace("{order_number}", "JF-000999")
      .replace("{total}", "350")
      .replace("{subtotal}", "300")
      .replace("{tax}", "45")
      .replace("{delivery_fee}", "25")
      .replace("{deliver_date}", "2026-03-30")
      .replace("{delivery_time}", "14:00 - 16:00")
      .replace("{address}", "الرياض، حي النخيل")
      .replace("{order_date}", "2026-03-28")
      .replace("{order_items}", "× 1 ورد = 250 ر.س");

    const encodedMessage = encodeURIComponent(sampleMessage);
    const phone = testPhone.replace(/\s/g, "").replace(/^0/, "");
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "تاكيد": return "bg-blue-500/20 text-blue-400";
      case "شحن": return "bg-purple-500/20 text-purple-400";
      case "تسليم": return "bg-green-500/20 text-green-400";
      case "عروض": return "bg-pink-500/20 text-pink-400";
      case "متابعة": return "bg-yellow-500/20 text-yellow-400";
      case "مناسبة": return "bg-[#C9A96E]/20 text-[#C9A96E]";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const variables = [
    { name: "{customer_name}", desc: "اسم العميل" },
    { name: "{order_number}", desc: "رقم الطلب" },
    { name: "{total}", desc: "المجموع الكلي" },
    { name: "{subtotal}", desc: "المجموع قبل الضريبة" },
    { name: "{tax}", desc: "الضريبة" },
    { name: "{delivery_fee}", desc: "رسوم التوصيل" },
    { name: "{deliver_date}", desc: "تاريخ التوصيل" },
    { name: "{delivery_time}", desc: "وقت التوصيل" },
    { name: "{address}", desc: "عنوان التوصيل" },
    { name: "{order_items}", desc: "قائمة المنتجات" },
    { name: "{order_date}", desc: "تاريخ الطلب" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1E2A2A] to-[#2D3436] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin" className="text-[#4A9BA0] hover:underline text-sm mb-2 inline-block">
            &larr; لوحة التحكم
          </Link>
          <h1 className="text-3xl font-bold text-[#C9A96E]">رسائل واتساب</h1>
          <p className="text-gray-400 mt-1">ادارة قوالب الرسائل التلقائية</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">{templates.length}</div>
            <div className="text-gray-400 text-sm">اجمالي القوالب</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-green-400">
              {templates.filter((t) => t.active).length}
            </div>
            <div className="text-gray-400 text-sm">قوالب نشطة</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-[#C9A96E]">98%</div>
            <div className="text-gray-400 text-sm">معدل الايصال</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-[#4A9BA0]">
              {templates.reduce((sum, t) => sum + t.sentCount, 0).toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">اجمالي المرسلة</div>
          </div>
        </div>
      </div>

      {/* Test phone */}
      <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/10">
        <h3 className="text-white font-medium mb-3">تجربة ارسال رسالة</h3>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="رقم الهاتف: 9665012345677"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 w-64"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
          />
          <span className="text-gray-400 text-sm">اضغط تجربة على اي قالب لفتح واتساب</span>
        </div>
      </div>

      {/* Variables */}
      <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/10">
        <h3 className="text-white font-medium mb-3">المتغيرات المتاحة</h3>
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

      {/* Templates list */}
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
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">نشط</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400">موقوف</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-3">{template.trigger}</p>
                <div className="bg-[#075E54]/20 rounded-xl p-4 max-w-md">
                  <div className="text-white/90 text-sm whitespace-pre-wrap leading-relaxed">
                    {template.message.slice(0, 200)}
                    {template.message.length > 200 && "..."}
                  </div>
                  <div className="text-gray-400 text-xs mt-3">
                    تم الارسال: {template.sentCount} {template.active ? "✅" : "⏸️"}
                  </div>
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
                  {template.active ? "ايقاف" : "تفعيل"}
                </button>
                <button
                  className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/20"
                  onClick={() => {
                    setEditingTemplate(template);
                    setShowEditModal(true);
                  }}
                >
                  تعديل
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    template.active
                      ? "bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30"
                      : "bg-gray-500/20 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => template.active && sendTestMessage(template)}
                >
                  تجربة
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-6">
          <div className="bg-[#1E2A2A] rounded-2xl p-6 w-full max-w-2xl border border-white/10 my-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              تعديل: {editingTemplate.name}
            </h3>

            <div className="space-y-6">
              <div>
                <label className="text-gray-400 text-sm block mb-2">اسم القالب</label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">وقت الارسال</label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  value={editingTemplate.trigger}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, trigger: e.target.value })}
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">نص الرسالة</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {variables.map((v) => (
                    <button
                      key={v.name}
                      className="bg-white/10 px-3 py-1 rounded-lg text-xs text-[#C9A96E] hover:bg-white/20"
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
                <textarea
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-4 text-white h-64 font-mono text-sm"
                  value={editingTemplate.message}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, message: e.target.value })}
                />
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  className="flex-1 bg-[#C9A96E] text-black py-3 rounded-lg font-medium hover:bg-[#D4A96E] transition"
                  onClick={() => {
                    setTemplates((prev) =>
                      prev.map((t) => (t.id === editingTemplate.id ? editingTemplate : t))
                    );
                    setShowEditModal(false);
                  }}
                >
                  حفظ التغييرات
                </button>
                <button
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                  onClick={() => setShowEditModal(false)}
                >
                  الغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
