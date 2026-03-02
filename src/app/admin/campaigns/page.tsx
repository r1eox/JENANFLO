"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

type Campaign = {
  id: string;
  name: string;
  type: string;
  channel: string;
  message: {
    title: string;
    body: string;
    couponCode?: string;
  };
  targeting: {
    allCustomers: boolean;
    tags: string[];
  };
  stats: {
    totalSent: number;
    delivered: number;
    opened: number;
    clicked: number;
    conversions: number;
  };
  status: string;
  createdAt: string;
  sentAt?: string;
};

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "ترويجية",
    channel: "واتساب",
    message: { title: "", body: "", couponCode: "" },
    targeting: { allCustomers: true, tags: [] as string[] },
  });

  const campaignTypes = [
    { value: "ترويجية", icon: "📣", color: "bg-purple-500" },
    { value: "تذكير", icon: "⏰", color: "bg-blue-500" },
    { value: "عيد ميلاد", icon: "🎂", color: "bg-pink-500" },
    { value: "ذكرى", icon: "💝", color: "bg-red-500" },
    { value: "عروض", icon: "🏷️", color: "bg-green-500" },
    { value: "جديد", icon: "🆕", color: "bg-[#C9A96E]" },
  ];

  const templates = [
    {
      name: "عرض خاص",
      body: `🌸 مرحباً {customer_name}!

عندنا لك عرض خاص حصري 🎁

خصم 20% على جميع باقات الورد الفاخرة

استخدم الكود: {coupon_code}

العرض ساري حتى نهاية الأسبوع ⏰

تسوق الآن: jenanflo.com

مع حب، جنان فلو 💐`,
    },
    {
      name: "تذكير سلة مهجورة",
      body: `مرحباً {customer_name} 👋

لاحظنا إنك نسيت بعض الورد الجميل في سلتك 🛒

لا تخلي الجمال ينتظر! 🌹

أكمل طلبك الآن واستمتع بتوصيل مجاني 🚚

jenanflo.com/cart

فريق جنان فلو`,
    },
    {
      name: "عيد ميلاد",
      body: `🎂 كل عام وأنت بخير {customer_name}!

بمناسبة عيد ميلادك، عندنا لك هدية 🎁

خصم 25% على أي طلب

الكود: BDAY25

يومك مميز، خله أجمل مع جنان فلو 💐

jenanflo.com`,
    },
    {
      name: "شكر بعد الشراء",
      body: `شكراً لك {customer_name} 💝

نتمنى أن هديتك وصلت بأمان وأسعدت قلوبكم 🌸

رأيك يهمنا كثير! ⭐

شاركنا تجربتك وحصل على خصم 10% على طلبك القادم

الكود: THANKYOU10

مع حب،
جنان فلو 💐`,
    },
  ];

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/campaigns');
        if (res.ok) {
          const data = await res.json();
          const formattedCampaigns = data.map((c: any) => ({
            id: c._id,
            name: c.name,
            type: c.type,
            channel: c.channel || 'واتساب',
            message: c.message || { title: '', body: '' },
            targeting: c.targeting || { allCustomers: true, tags: [] },
            stats: c.stats || { totalSent: 0, delivered: 0, opened: 0, clicked: 0, conversions: 0 },
            status: c.status,
            createdAt: c.createdAt,
            sentAt: c.sentAt,
          }));
          setCampaigns(formattedCampaigns);
        }
      } catch (error) {
        console.error('Error loading campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCampaigns();
  }, []);

  const getTypeInfo = (type: string) => {
    return campaignTypes.find((t) => t.value === type) || campaignTypes[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مسودة": return "bg-gray-500";
      case "مجدولة": return "bg-blue-500";
      case "جاري الإرسال": return "bg-yellow-500";
      case "مكتملة": return "bg-green-500";
      case "متوقفة": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const applyTemplate = (template: { name: string; body: string }) => {
    setNewCampaign({
      ...newCampaign,
      name: template.name,
      message: { ...newCampaign.message, body: template.body },
    });
  };

  const createCampaign = async () => {
    try {
      const campaignData = {
        ...newCampaign,
        stats: { totalSent: 0, delivered: 0, opened: 0, clicked: 0, conversions: 0 },
        status: "مسودة",
      };
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData)
      });
      if (res.ok) {
        const saved = await res.json();
        const newCamp: Campaign = {
          id: saved._id,
          ...campaignData,
          createdAt: saved.createdAt,
        };
        setCampaigns([newCamp, ...campaigns]);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
    setShowCreateModal(false);
    setNewCampaign({
      name: "",
      type: "ترويجية",
      channel: "واتساب",
      message: { title: "", body: "", couponCode: "" },
      targeting: { allCustomers: true, tags: [] },
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1E2A2A] to-[#2D3436] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin" className="text-[#4A9BA0] hover:underline text-sm mb-2 inline-block">
            ← العودة للوحة التحكم
          </Link>
          <h1 className="text-3xl font-bold text-[#C9A96E]">الحملات التسويقية</h1>
          <p className="text-gray-400 mt-1">إنشاء وإدارة حملات واتساب والبريد الإلكتروني</p>
        </div>
        <button
          className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition flex items-center gap-2"
          onClick={() => setShowCreateModal(true)}
        >
          <span>+</span> إنشاء حملة جديدة
        </button>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-white">{campaigns.length}</div>
          <div className="text-gray-400 text-sm">إجمالي الحملات</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-green-400">
            {campaigns.reduce((sum, c) => sum + c.stats.totalSent, 0)}
          </div>
          <div className="text-gray-400 text-sm">رسائل مرسلة</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-blue-400">
            {campaigns.reduce((sum, c) => sum + c.stats.opened, 0)}
          </div>
          <div className="text-gray-400 text-sm">تم الفتح</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-purple-400">
            {campaigns.reduce((sum, c) => sum + c.stats.clicked, 0)}
          </div>
          <div className="text-gray-400 text-sm">نقرات</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-[#C9A96E]">
            {campaigns.reduce((sum, c) => sum + c.stats.conversions, 0)}
          </div>
          <div className="text-gray-400 text-sm">تحويلات (مبيعات)</div>
        </div>
      </div>

      {/* قائمة الحملات */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-400 py-12">جاري التحميل...</div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white/5 rounded-xl border border-white/10 p-12 text-center">
            <div className="text-5xl mb-4">📣</div>
            <div className="text-white text-xl mb-2">لا يوجد حملات حتى الآن</div>
            <div className="text-gray-400 mb-6">ابدأ بإنشاء أول حملة تسويقية</div>
            <button
              className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition"
              onClick={() => setShowCreateModal(true)}
            >
              إنشاء حملة
            </button>
          </div>
        ) : (
          campaigns.map((campaign) => {
            const typeInfo = getTypeInfo(campaign.type);
            const conversionRate = campaign.stats.totalSent > 0
              ? ((campaign.stats.conversions / campaign.stats.totalSent) * 100).toFixed(1)
              : "0";

            return (
              <div
                key={campaign.id}
                className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6 hover:border-white/20 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${typeInfo.color} flex items-center justify-center text-2xl`}>
                      {typeInfo.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{campaign.name}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                        <span className="text-gray-400 text-sm">{campaign.type}</span>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-400 text-sm">{campaign.channel}</span>
                        {campaign.message.couponCode && (
                          <>
                            <span className="text-gray-400 text-sm">•</span>
                            <span className="text-[#C9A96E] text-sm">🏷️ {campaign.message.couponCode}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-400 text-sm">
                      {campaign.sentAt ? `أُرسلت: ${campaign.sentAt}` : `أُنشئت: ${campaign.createdAt}`}
                    </div>
                  </div>
                </div>

                {/* الإحصائيات */}
                {campaign.stats.totalSent > 0 && (
                  <div className="grid grid-cols-5 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-white font-bold">{campaign.stats.totalSent}</div>
                      <div className="text-gray-400 text-xs">مرسل</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 font-bold">{campaign.stats.delivered}</div>
                      <div className="text-gray-400 text-xs">وصل</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">{campaign.stats.opened}</div>
                      <div className="text-gray-400 text-xs">فُتح</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 font-bold">{campaign.stats.clicked}</div>
                      <div className="text-gray-400 text-xs">نقرات</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#C9A96E] font-bold">{campaign.stats.conversions}</div>
                      <div className="text-gray-400 text-xs">تحويل ({conversionRate}%)</div>
                    </div>
                  </div>
                )}

                {/* أزرار الإجراءات */}
                <div className="flex gap-2 mt-4">
                  {campaign.status === "مسودة" && (
                    <button className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg text-sm hover:bg-green-500/30">
                      🚀 إرسال الآن
                    </button>
                  )}
                  {campaign.status === "مجدولة" && (
                    <button className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg text-sm hover:bg-yellow-500/30">
                      ⏸️ إيقاف
                    </button>
                  )}
                  <button className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/20">
                    تعديل
                  </button>
                  <button className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/20">
                    تكرار
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* مودال إنشاء حملة */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-6">
          <div className="bg-[#1E2A2A] rounded-2xl p-6 w-full max-w-2xl border border-white/10 my-8">
            <h3 className="text-2xl font-bold text-white mb-6">📣 إنشاء حملة جديدة</h3>

            <div className="space-y-6">
              {/* اسم الحملة */}
              <div>
                <label className="text-gray-400 text-sm block mb-2">اسم الحملة</label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400"
                  placeholder="مثال: عرض نهاية الأسبوع"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                />
              </div>

              {/* نوع الحملة */}
              <div>
                <label className="text-gray-400 text-sm block mb-2">نوع الحملة</label>
                <div className="grid grid-cols-3 gap-2">
                  {campaignTypes.map((type) => (
                    <button
                      key={type.value}
                      className={`p-3 rounded-lg border transition flex items-center gap-2 ${
                        newCampaign.type === type.value
                          ? `${type.color} border-transparent text-white`
                          : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30"
                      }`}
                      onClick={() => setNewCampaign({ ...newCampaign, type: type.value })}
                    >
                      <span>{type.icon}</span>
                      <span>{type.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* قوالب جاهزة */}
              <div>
                <label className="text-gray-400 text-sm block mb-2">قوالب جاهزة (اختياري)</label>
                <div className="flex gap-2 flex-wrap">
                  {templates.map((template) => (
                    <button
                      key={template.name}
                      className="bg-white/10 text-white px-3 py-1 rounded-lg text-sm hover:bg-white/20"
                      onClick={() => applyTemplate(template)}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* محتوى الرسالة */}
              <div>
                <label className="text-gray-400 text-sm block mb-2">محتوى الرسالة</label>
                <textarea
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-4 text-white placeholder-gray-400 h-40"
                  placeholder="اكتب رسالتك هنا...&#10;&#10;المتغيرات المتاحة:&#10;{customer_name} - اسم العميل&#10;{coupon_code} - كود الخصم"
                  value={newCampaign.message.body}
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      message: { ...newCampaign.message, body: e.target.value },
                    })
                  }
                />
              </div>

              {/* كود الخصم */}
              <div>
                <label className="text-gray-400 text-sm block mb-2">كود الخصم (اختياري)</label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400"
                  placeholder="مثال: SAVE20"
                  value={newCampaign.message.couponCode}
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      message: { ...newCampaign.message, couponCode: e.target.value },
                    })
                  }
                />
              </div>

              {/* الاستهداف */}
              <div>
                <label className="text-gray-400 text-sm block mb-2">استهداف العملاء</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 bg-white/5 p-3 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="targeting"
                      checked={newCampaign.targeting.allCustomers}
                      onChange={() =>
                        setNewCampaign({
                          ...newCampaign,
                          targeting: { ...newCampaign.targeting, allCustomers: true },
                        })
                      }
                      className="accent-[#C9A96E]"
                    />
                    <span className="text-white">جميع العملاء</span>
                  </label>
                  <label className="flex items-center gap-3 bg-white/5 p-3 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="targeting"
                      checked={!newCampaign.targeting.allCustomers}
                      onChange={() =>
                        setNewCampaign({
                          ...newCampaign,
                          targeting: { ...newCampaign.targeting, allCustomers: false },
                        })
                      }
                      className="accent-[#C9A96E]"
                    />
                    <span className="text-white">عملاء VIP فقط</span>
                  </label>
                </div>
              </div>
            </div>

            {/* أزرار */}
            <div className="flex gap-4 mt-8">
              <button
                className="flex-1 bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition"
                onClick={createCampaign}
              >
                إنشاء الحملة
              </button>
              <button
                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                onClick={() => setShowCreateModal(false)}
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
