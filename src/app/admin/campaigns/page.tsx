'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";

type Campaign = {
  _id: string;
  name: string;
  type: string;
  status: string;
  discount: number;
  code?: string;
  startDate: string;
  endDate: string;
  usageCount: number;
  budget?: number;
  description?: string;
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/20 text-green-400",
  scheduled: "bg-blue-500/20 text-blue-400",
  ended: "bg-gray-500/20 text-gray-400",
  paused: "bg-yellow-500/20 text-yellow-400",
};

const STATUS_LABELS: Record<string, string> = {
  active: "نشطة",
  scheduled: "مجدولة",
  ended: "منتهية",
  paused: "موقوفة",
};

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "discount",
    discount: 10,
    code: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      setCampaigns(data.campaigns || data || []);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const addCampaign = async () => {
    if (!newCampaign.name || !newCampaign.startDate || !newCampaign.endDate) {
      alert("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCampaign),
      });
      if (res.ok) {
        await fetchCampaigns();
        setShowAddModal(false);
        setNewCampaign({ name: "", type: "discount", discount: 10, code: "", startDate: "", endDate: "", description: "" });
      }
    } catch (err) {
      console.error("Error adding campaign:", err);
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm("هل تريد حذف هذه الحملة؟")) return;
    try {
      await fetch(`/api/campaigns?id=${id}`, { method: "DELETE" });
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting campaign:", err);
    }
  };

  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const totalUsage = campaigns.reduce((sum, c) => sum + (c.usageCount || 0), 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1E2A2A] to-[#2D3436] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin" className="text-[#4A9BA0] hover:underline text-sm mb-2 inline-block">
            &larr; لوحة التحكم
          </Link>
          <h1 className="text-3xl font-bold text-[#C9A96E]">الحملات التسويقية</h1>
          <p className="text-gray-400 mt-1">ادارة العروض والحملات</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#C9A96E] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#D4A96E] transition"
        >
          + اضافة حملة
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-white">{campaigns.length}</div>
          <div className="text-gray-400 text-sm">اجمالي الحملات</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-green-400">{activeCampaigns.length}</div>
          <div className="text-gray-400 text-sm">حملات نشطة</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-[#C9A96E]">{totalUsage}</div>
          <div className="text-gray-400 text-sm">اجمالي الاستخدام</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-[#4A9BA0]">
            {campaigns.filter((c) => c.status === "ended").length}
          </div>
          <div className="text-gray-400 text-sm">حملات منتهية</div>
        </div>
      </div>

      {/* Campaigns list */}
      {loading ? (
        <div className="text-white text-center py-12">جاري التحميل...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-4">لا توجد حملات حتى الان</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#C9A96E] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#D4A96E] transition"
          >
            اضف اول حملة
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-bold text-lg">{campaign.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${STATUS_COLORS[campaign.status] || "bg-gray-500/20 text-gray-400"}`}>
                      {STATUS_LABELS[campaign.status] || campaign.status}
                    </span>
                  </div>
                  {campaign.description && (
                    <p className="text-gray-400 text-sm mb-3">{campaign.description}</p>
                  )}
                  <div className="flex gap-4 text-sm">
                    <span className="text-[#C9A96E]">خصم {campaign.discount}%</span>
                    {campaign.code && (
                      <span className="bg-white/10 px-2 py-0.5 rounded text-white font-mono">
                        {campaign.code}
                      </span>
                    )}
                    <span className="text-gray-400">
                      {new Date(campaign.startDate).toLocaleDateString("ar-SA")} -{" "}
                      {new Date(campaign.endDate).toLocaleDateString("ar-SA")}
                    </span>
                    <span className="text-gray-400">
                      استخدم {campaign.usageCount || 0} مرة
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteCampaign(campaign._id)}
                  className="text-red-400 hover:text-red-300 text-sm px-3 py-1 rounded-lg hover:bg-red-500/10 transition"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Campaign Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-[#1E2A2A] rounded-2xl p-6 w-full max-w-lg border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">اضافة حملة جديدة</h3>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1">اسم الحملة *</label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="مثال: عروض رمضان"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">نسبة الخصم (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  value={newCampaign.discount}
                  onChange={(e) => setNewCampaign({ ...newCampaign, discount: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">كود الخصم (اختياري)</label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white font-mono uppercase"
                  value={newCampaign.code}
                  onChange={(e) => setNewCampaign({ ...newCampaign, code: e.target.value.toUpperCase() })}
                  placeholder="RAMADAN10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1">تاريخ البداية *</label>
                  <input
                    type="date"
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">تاريخ النهاية *</label>
                  <input
                    type="date"
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">وصف (اختياري)</label>
                <textarea
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white h-20"
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                  placeholder="وصف الحملة..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={addCampaign}
                className="flex-1 bg-[#C9A96E] text-black py-3 rounded-lg font-bold hover:bg-[#D4A96E] transition"
              >
                اضافة الحملة
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
              >
                الغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
