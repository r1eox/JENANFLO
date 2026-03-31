'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";

type Customer = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
  notes?: string;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [sortBy, setSortBy] = useState<"totalSpent" | "totalOrders" | "createdAt">("totalSpent");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(data.customers || data || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    if (!confirm("هل تريد حذف هذا العميل؟")) return;
    try {
      await fetch(`/api/customers?id=${id}`, { method: "DELETE" });
      setCustomers((prev) => prev.filter((c) => c._id !== id));
      if (selectedCustomer?._id === id) setSelectedCustomer(null);
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const message = encodeURIComponent(`مرحبا ${name}! 🌸\n\nشكرا لتسوقك من جنان فلو`);
    const p = phone.replace(/\s/g, "").replace(/^0/, "");
    window.open(`https://wa.me/${p}?text=${message}`, "_blank");
  };

  const filteredCustomers = customers
    .filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        !q ||
        c.name?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "totalSpent") return (b.totalSpent || 0) - (a.totalSpent || 0);
      if (sortBy === "totalOrders") return (b.totalOrders || 0) - (a.totalOrders || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const avgOrderValue = customers.length > 0
    ? customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / customers.reduce((sum, c) => sum + (c.totalOrders || 0), 1)
    : 0;

  const getCustomerTier = (spent: number) => {
    if (spent >= 2000) return { label: "ذهبي", color: "text-yellow-400" };
    if (spent >= 1000) return { label: "فضي", color: "text-gray-300" };
    if (spent >= 500) return { label: "برونزي", color: "text-orange-400" };
    return { label: "عادي", color: "text-gray-500" };
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1E2A2A] to-[#2D3436] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin" className="text-[#4A9BA0] hover:underline text-sm mb-2 inline-block">
            &larr; لوحة التحكم
          </Link>
          <h1 className="text-3xl font-bold text-[#C9A96E]">العملاء</h1>
          <p className="text-gray-400 mt-1">قاعدة بيانات العملاء</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">{customers.length}</div>
            <div className="text-gray-400 text-sm">اجمالي العملاء</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-[#C9A96E]">
              {totalRevenue.toFixed(0)} ر.س
            </div>
            <div className="text-gray-400 text-sm">اجمالي الانفاق</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-green-400">
              {avgOrderValue.toFixed(0)} ر.س
            </div>
            <div className="text-gray-400 text-sm">متوسط الطلب</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-yellow-400">
              {customers.filter((c) => (c.totalSpent || 0) >= 1000).length}
            </div>
            <div className="text-gray-400 text-sm">عملاء VIP</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="بحث بالاسم او الهاتف..."
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
        >
          <option value="totalSpent">ترتيب حسب: الاعلى انفاقا</option>
          <option value="totalOrders">ترتيب حسب: الاكثر طلبات</option>
          <option value="createdAt">ترتيب حسب: الاحدث</option>
        </select>
      </div>

      {/* Customers + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer list */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-white text-center py-12">جاري التحميل...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-gray-400 text-center py-12">لا يوجد عملاء</div>
          ) : (
            filteredCustomers.map((customer) => {
              const tier = getCustomerTier(customer.totalSpent || 0);
              return (
                <div
                  key={customer._id}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`bg-white/5 backdrop-blur rounded-xl border p-4 cursor-pointer transition hover:bg-white/10 ${
                    selectedCustomer?._id === customer._id
                      ? "border-[#C9A96E]/50"
                      : "border-white/10"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-bold">{customer.name}</span>
                        <span className={`text-xs ${tier.color}`}>{tier.label}</span>
                      </div>
                      <p className="text-gray-400 text-sm">{customer.phone}</p>
                      {customer.email && (
                        <p className="text-gray-500 text-xs">{customer.email}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[#C9A96E] font-bold">
                        {(customer.totalSpent || 0).toFixed(2)} ر.س
                      </p>
                      <p className="text-gray-400 text-sm">{customer.totalOrders || 0} طلبات</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Customer detail */}
        {selectedCustomer && (
          <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6 h-fit sticky top-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-white font-bold text-xl">{selectedCustomer.name}</h2>
                  <span className={`text-sm ${getCustomerTier(selectedCustomer.totalSpent || 0).color}`}>
                    {getCustomerTier(selectedCustomer.totalSpent || 0).label}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  عميل منذ {new Date(selectedCustomer.createdAt).toLocaleDateString("ar-SA")}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            {/* Contact info */}
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <h3 className="text-white font-medium mb-3">معلومات التواصل</h3>
              <p className="text-gray-300 text-sm mb-1">
                <span className="text-gray-500">الهاتف: </span>{selectedCustomer.phone}
              </p>
              {selectedCustomer.email && (
                <p className="text-gray-300 text-sm mb-1">
                  <span className="text-gray-500">البريد: </span>{selectedCustomer.email}
                </p>
              )}
              {selectedCustomer.address && (
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-500">العنوان: </span>{selectedCustomer.address}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-xl font-bold text-[#C9A96E]">
                  {(selectedCustomer.totalSpent || 0).toFixed(2)} ر.س
                </div>
                <div className="text-gray-400 text-xs">اجمالي الانفاق</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-xl font-bold text-white">
                  {selectedCustomer.totalOrders || 0}
                </div>
                <div className="text-gray-400 text-xs">عدد الطلبات</div>
              </div>
            </div>

            {/* Last order */}
            {selectedCustomer.lastOrderDate && (
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <h3 className="text-white font-medium mb-2">اخر طلب</h3>
                <p className="text-gray-400 text-sm">
                  {new Date(selectedCustomer.lastOrderDate).toLocaleDateString("ar-SA", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </p>
              </div>
            )}

            {/* Notes */}
            {selectedCustomer.notes && (
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <h3 className="text-white font-medium mb-2">ملاحظات</h3>
                <p className="text-gray-400 text-sm">{selectedCustomer.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                className="flex-1 bg-[#25D366]/20 text-[#25D366] py-3 rounded-lg font-medium hover:bg-[#25D366]/30 transition text-sm"
                onClick={() => openWhatsApp(selectedCustomer.phone, selectedCustomer.name)}
              >
                واتساب
              </button>
              <a
                href={`tel:${selectedCustomer.phone}`}
                className="flex-1 bg-blue-500/20 text-blue-400 py-3 rounded-lg font-medium hover:bg-blue-500/30 transition text-sm text-center"
              >
                اتصال
              </a>
              <button
                className="px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm"
                onClick={() => deleteCustomer(selectedCustomer._id)}
              >
                حذف
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
