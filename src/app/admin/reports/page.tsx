"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

type StatsData = {
  orders: number;
  newOrders: number;
  preparing: number;
  delivering: number;
  delivered: number;
  cancelled: number;
  revenue: number;
  tax: number;
  collected: number;
  pending: number;
  avgOrder: number;
  customers: number;
  newCustomers: number;
};

type TopProduct = { name: string; sales: number; revenue: number };
type TopCategory = { name: string; percentage: number; revenue: number };

export default function AdminReports() {
  const [period, setPeriod] = useState("today");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({
    orders: 0, newOrders: 0, preparing: 0, delivering: 0, delivered: 0, cancelled: 0,
    revenue: 0, tax: 0, collected: 0, pending: 0, avgOrder: 0, customers: 0, newCustomers: 0,
  });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  
  const periods = [
    { label: "اليوم", value: "today" },
    { label: "هذا الأسبوع", value: "week" },
    { label: "هذا الشهر", value: "month" },
    { label: "هذا العام", value: "year" },
  ];

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/stats?period=${period}`);
        if (res.ok) {
          const data = await res.json();
          setStats({
            orders: data.orders?.total || 0,
            newOrders: data.orders?.new || 0,
            preparing: data.orders?.preparing || 0,
            delivering: data.orders?.delivering || 0,
            delivered: data.orders?.delivered || 0,
            cancelled: data.orders?.cancelled || 0,
            revenue: data.revenue?.total || 0,
            tax: data.revenue?.tax || 0,
            collected: data.revenue?.collected || 0,
            pending: data.revenue?.pending || 0,
            avgOrder: data.revenue?.average || 0,
            customers: data.customers?.total || 0,
            newCustomers: data.customers?.new || 0,
          });
          setTopProducts(data.topProducts || []);
          setTopCategories(data.salesByCategory || []);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [period]);

  const currentStats = stats;

  const recentOrders = [
    { id: "JF-000156", customer: "أحمد محمد", status: "جديد", amount: 427.5, date: "اليوم 14:30", statusColor: "text-blue-400" },
    { id: "JF-000155", customer: "سارة علي", status: "جاري التحضير", amount: 444, date: "اليوم 12:15", statusColor: "text-yellow-400" },
    { id: "JF-000154", customer: "خالد سعد", status: "جاري التوصيل", amount: 192.5, date: "اليوم 10:00", statusColor: "text-purple-400" },
    { id: "JF-000153", customer: "نورة أحمد", status: "تم التسليم", amount: 1058.5, date: "أمس 18:45", statusColor: "text-green-400" },
    { id: "JF-000152", customer: "محمد علي", status: "تم التسليم", amount: 350, date: "أمس 16:20", statusColor: "text-green-400" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1E2A2A] to-[#2D3436] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin" className="text-[#4A9BA0] hover:underline text-sm mb-2 inline-block">
            ← العودة للوحة التحكم
          </Link>
          <h1 className="text-3xl font-bold text-[#C9A96E]">📊 التقارير والإحصائيات</h1>
        </div>
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                period === p.value ? "bg-[#C9A96E] text-black" : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* إحصائيات الطلبات */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-2xl font-bold text-white">{currentStats.orders}</div>
          <div className="text-gray-400 text-sm">إجمالي الطلبات</div>
        </div>
        <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
          <div className="text-3xl mb-2">🆕</div>
          <div className="text-2xl font-bold text-blue-400">{currentStats.newOrders}</div>
          <div className="text-gray-400 text-sm">جديدة</div>
        </div>
        <div className="bg-yellow-500/20 rounded-xl p-4 border border-yellow-500/30">
          <div className="text-3xl mb-2">🔧</div>
          <div className="text-2xl font-bold text-yellow-400">{currentStats.preparing}</div>
          <div className="text-gray-400 text-sm">قيد التحضير</div>
        </div>
        <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30">
          <div className="text-3xl mb-2">🚚</div>
          <div className="text-2xl font-bold text-purple-400">{currentStats.delivering}</div>
          <div className="text-gray-400 text-sm">قيد التوصيل</div>
        </div>
        <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-400">{currentStats.delivered}</div>
          <div className="text-gray-400 text-sm">تم التسليم</div>
        </div>
        <div className="bg-red-500/20 rounded-xl p-4 border border-red-500/30">
          <div className="text-3xl mb-2">❌</div>
          <div className="text-2xl font-bold text-red-400">{currentStats.cancelled}</div>
          <div className="text-gray-400 text-sm">ملغية</div>
        </div>
      </div>

      {/* إحصائيات مالية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#C9A96E]/20 to-[#D4AF37]/20 rounded-xl p-6 border border-[#C9A96E]/30">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💰</span>
            <span className="text-gray-400">الإيرادات</span>
          </div>
          <div className="text-3xl font-bold text-[#C9A96E]">{currentStats.revenue.toLocaleString()} ر.س</div>
          <div className="text-green-400 text-sm mt-2">↑ 12% عن الفترة السابقة</div>
        </div>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🧾</span>
            <span className="text-gray-400">الضريبة (15%)</span>
          </div>
          <div className="text-3xl font-bold text-white">{currentStats.tax.toLocaleString()} ر.س</div>
        </div>
        <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💳</span>
            <span className="text-gray-400">المحصّل</span>
          </div>
          <div className="text-3xl font-bold text-green-400">{currentStats.collected.toLocaleString()} ر.س</div>
        </div>
        <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/30">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">⏳</span>
            <span className="text-gray-400">معلّق</span>
          </div>
          <div className="text-3xl font-bold text-yellow-400">{currentStats.pending.toLocaleString()} ر.س</div>
        </div>
      </div>

      {/* إحصائيات إضافية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="text-gray-400 mb-2">متوسط قيمة الطلب</div>
          <div className="text-2xl font-bold text-white">{currentStats.avgOrder} ر.س</div>
        </div>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="text-gray-400 mb-2">إجمالي العملاء</div>
          <div className="text-2xl font-bold text-[#4A9BA0]">{currentStats.customers}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="text-gray-400 mb-2">عملاء جدد</div>
          <div className="text-2xl font-bold text-green-400">+{currentStats.newCustomers}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* المنتجات الأكثر مبيعاً */}
        <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-6">🏆 المنتجات الأكثر مبيعاً</h2>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <div key={product.name} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  idx === 0 ? "bg-yellow-500 text-black" :
                  idx === 1 ? "bg-gray-400 text-black" :
                  idx === 2 ? "bg-orange-700 text-white" :
                  "bg-white/10 text-white"
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="text-white">{product.name}</div>
                  <div className="text-gray-400 text-sm">{product.sales} مبيعة</div>
                </div>
                <div className="text-[#C9A96E] font-bold">{product.revenue.toLocaleString()} ر.س</div>
              </div>
            ))}
          </div>
        </div>

        {/* الأقسام الأكثر مبيعاً */}
        <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-6">📁 المبيعات حسب القسم</h2>
          <div className="space-y-4">
            {topCategories.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-white">{cat.name}</span>
                  <span className="text-gray-400">{cat.percentage}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#4A9BA0] to-[#C9A96E] rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <div className="text-[#C9A96E] text-sm mt-1">{cat.revenue.toLocaleString()} ر.س</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* آخر الطلبات */}
      <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">📋 آخر الطلبات</h2>
          <Link href="/admin/orders" className="text-[#4A9BA0] hover:underline text-sm">
            عرض الكل
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-gray-400 border-b border-white/10">
                <th className="pb-4 font-medium">رقم الطلب</th>
                <th className="pb-4 font-medium">العميل</th>
                <th className="pb-4 font-medium">الحالة</th>
                <th className="pb-4 font-medium">المبلغ</th>
                <th className="pb-4 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5">
                  <td className="py-4 text-[#C9A96E] font-mono">{order.id}</td>
                  <td className="py-4 text-white">{order.customer}</td>
                  <td className={`py-4 ${order.statusColor}`}>{order.status}</td>
                  <td className="py-4 text-white">{order.amount} ر.س</td>
                  <td className="py-4 text-gray-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* أزرار التصدير */}
      <div className="flex gap-4 mt-6 justify-end">
        <button className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition flex items-center gap-2">
          📥 تصدير Excel
        </button>
        <button className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition flex items-center gap-2">
          📄 تصدير PDF
        </button>
      </div>
    </main>
  );
}
