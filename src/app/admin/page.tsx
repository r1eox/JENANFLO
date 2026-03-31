"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

type Stats = {
  totalOrders: number;
  pendingOrders: number;
  todayOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  newCustomers: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    newCustomers: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes] = await Promise.all([
          fetch('/api/stats?period=today'),
          fetch('/api/orders')
        ]);
        
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats({
            totalOrders: data.orders?.total || 0,
            pendingOrders: data.orders?.new || 0,
            todayOrders: data.orders?.total || 0,
            totalRevenue: data.revenue?.total || 0,
            totalCustomers: data.customers?.total || 0,
            newCustomers: data.customers?.new || 0,
          });
        }
        
        if (ordersRes.ok) {
          const orders = await ordersRes.json();
          const recent = orders.slice(0, 4).map((o: any) => ({
            id: o.orderNumber,
            customer: o.customer?.name || 'غير معروف',
            total: o.total,
            status: o.status,
            date: new Date(o.createdAt).toLocaleDateString('ar-SA', { 
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
            }),
          }));
          setRecentOrders(recent);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "جديد": return "bg-blue-100 text-blue-700";
      case "جاري التحضير": return "bg-yellow-100 text-yellow-700";
      case "جاري التوصيل": return "bg-purple-100 text-purple-700";
      case "تم التسليم": return "bg-green-100 text-green-700";
      case "ملغي": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1E2A2A] to-[#2D3436] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#C9A96E]">لوحة تحكم جنان فلو</h1>
          <p className="text-gray-400 mt-1">مرحباً بك في لوحة الإدارة</p>
        </div>
        <Link href="/" className="bg-[#4A9BA0] hover:bg-[#2D8B8B] text-white px-4 py-2 rounded-lg transition">
          عرض المتجر
        </Link>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
          <div className="text-gray-400 text-sm">إجمالي الطلبات</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-2xl font-bold text-yellow-400">{stats.pendingOrders}</div>
          <div className="text-gray-400 text-sm">طلبات معلقة</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-orange-400">{stats.todayOrders}</div>
          <div className="text-gray-400 text-sm">طلبات اليوم</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-bold text-[#C9A96E]">{stats.totalRevenue.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">الإيرادات (ر.س)</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold text-[#4A9BA0]">{stats.totalCustomers}</div>
          <div className="text-gray-400 text-sm">العملاء</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-3xl mb-2">✨</div>
          <div className="text-2xl font-bold text-green-400">+{stats.newCustomers}</div>
          <div className="text-gray-400 text-sm">عملاء جدد</div>
        </div>
      </div>

      {/* القائمة الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/products" className="group bg-gradient-to-br from-pink-500/20 to-pink-600/20 hover:from-pink-500/30 hover:to-pink-600/30 rounded-2xl p-6 border border-pink-500/30 transition-all">
          <div className="text-5xl mb-4">🛍️</div>
          <h2 className="text-xl font-bold text-white mb-2">المنتجات والأقسام</h2>
          <p className="text-gray-400 text-sm">إضافة، تعديل، حذف المنتجات والأقسام وتغيير الصور والأسعار</p>
          <div className="mt-4 text-pink-400 group-hover:translate-x-[-8px] transition-transform">← الدخول</div>
        </Link>

        <Link href="/admin/orders" className="group bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 rounded-2xl p-6 border border-blue-500/30 transition-all">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-xl font-bold text-white mb-2">إدارة الطلبات</h2>
          <p className="text-gray-400 text-sm">متابعة الطلبات، تحديث الحالات، إرسال الفواتير للواتساب</p>
          <div className="mt-4 text-blue-400 group-hover:translate-x-[-8px] transition-transform">← الدخول</div>
        </Link>

        <Link href="/admin/customers" className="group bg-gradient-to-br from-[#4A9BA0]/20 to-[#2D8B8B]/20 hover:from-[#4A9BA0]/30 hover:to-[#2D8B8B]/30 rounded-2xl p-6 border border-[#4A9BA0]/30 transition-all">
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-white mb-2">العملاء والتسويق</h2>
          <p className="text-gray-400 text-sm">إدارة العملاء، الحملات التسويقية، رسائل واتساب</p>
          <div className="mt-4 text-[#4A9BA0] group-hover:translate-x-[-8px] transition-transform">← الدخول</div>
        </Link>

        <Link href="/admin/reports" className="group bg-gradient-to-br from-[#C9A96E]/20 to-[#D4AF37]/20 hover:from-[#C9A96E]/30 hover:to-[#D4AF37]/30 rounded-2xl p-6 border border-[#C9A96E]/30 transition-all">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-white mb-2">التقارير والإحصائيات</h2>
          <p className="text-gray-400 text-sm">تقارير المبيعات، الإيرادات، الضريبة، المنتجات الأكثر مبيعاً</p>
          <div className="mt-4 text-[#C9A96E] group-hover:translate-x-[-8px] transition-transform">← الدخول</div>
        </Link>
      </div>

      {/* صف ثاني */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/campaigns" className="group bg-gradient-to-br from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 rounded-2xl p-6 border border-purple-500/30 transition-all">
          <div className="text-5xl mb-4">📣</div>
          <h2 className="text-xl font-bold text-white mb-2">الحملات التسويقية</h2>
          <p className="text-gray-400 text-sm">إنشاء وإدارة حملات واتساب والبريد الإلكتروني</p>
          <div className="mt-4 text-purple-400 group-hover:translate-x-[-8px] transition-transform">← الدخول</div>
        </Link>

        <Link href="/admin/whatsapp" className="group bg-gradient-to-br from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 rounded-2xl p-6 border border-green-500/30 transition-all">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="text-xl font-bold text-white mb-2">رسائل واتساب</h2>
          <p className="text-gray-400 text-sm">إرسال الفواتير، تحديثات الطلبات، رسائل الشكر</p>
          <div className="mt-4 text-green-400 group-hover:translate-x-[-8px] transition-transform">← الدخول</div>
        </Link>

        <Link href="/admin/coupons" className="group bg-gradient-to-br from-yellow-500/20 to-amber-600/20 hover:from-yellow-500/30 hover:to-amber-600/30 rounded-2xl p-6 border border-yellow-500/30 transition-all">
          <div className="text-5xl mb-4">🎟️</div>
          <h2 className="text-xl font-bold text-white mb-2">أكواد الخصم</h2>
          <p className="text-gray-400 text-sm">إضافة وإدارة أكواد الخصم وتفعيلها أو تعطيلها</p>
          <div className="mt-4 text-yellow-400 group-hover:translate-x-[-8px] transition-transform">← الدخول</div>
        </Link>

        <Link href="/admin/settings" className="group bg-gradient-to-br from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 rounded-2xl p-6 border border-gray-500/30 transition-all">
          <div className="text-5xl mb-4">⚙️</div>
          <h2 className="text-xl font-bold text-white mb-2">الإعدادات</h2>
          <p className="text-gray-400 text-sm">الضريبة، وسائل الدفع، الإشعارات التلقائية</p>
          <div className="mt-4 text-gray-400 group-hover:translate-x-[-8px] transition-transform">← الدخول</div>
        </Link>
      </div>

      {/* آخر الطلبات */}
      <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">آخر الطلبات</h2>
          <Link href="/admin/orders" className="text-[#4A9BA0] hover:underline text-sm">عرض الكل</Link>
        </div>
        
        {loading ? (
          <div className="text-center text-gray-400 py-8">جاري التحميل...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="pb-4 font-medium">رقم الطلب</th>
                  <th className="pb-4 font-medium">العميل</th>
                  <th className="pb-4 font-medium">المبلغ</th>
                  <th className="pb-4 font-medium">الحالة</th>
                  <th className="pb-4 font-medium">التاريخ</th>
                  <th className="pb-4 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 text-[#C9A96E] font-mono">{order.id}</td>
                    <td className="py-4 text-white">{order.customer}</td>
                    <td className="py-4 text-white">{order.total} ر.س</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400">{order.date}</td>
                    <td className="py-4">
                      <button className="text-[#4A9BA0] hover:underline text-sm ml-4">عرض</button>
                      <button className="text-green-400 hover:underline text-sm">واتساب</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
