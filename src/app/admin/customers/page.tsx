"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  tags: string[];
  status: string;
  marketing: {
    allowWhatsApp: boolean;
    allowEmail: boolean;
  };
  specialDates?: {
    name: string;
    date: string;
  }[];
  createdAt: string;
};

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("الكل");
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [showAddDateModal, setShowAddDateModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newDate, setNewDate] = useState({ name: "", date: "" });

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/customers');
        if (res.ok) {
          const data = await res.json();
          const formattedCustomers = data.map((c: any) => ({
            id: c._id,
            name: c.name,
            phone: c.phone,
            email: c.email,
            address: c.address,
            totalOrders: c.totalOrders || 0,
            totalSpent: c.totalSpent || 0,
            lastOrderDate: c.lastOrderDate,
            tags: c.tags || [],
            status: c.status || 'نشط',
            marketing: c.marketing || { allowWhatsApp: true, allowEmail: true },
            specialDates: c.specialDates || [],
            createdAt: c.createdAt,
          }));
          setCustomers(formattedCustomers);
        }
      } catch (error) {
        console.error('Error loading customers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const matchesFilter =
      filter === "الكل" ||
      (filter === "VIP" && customer.tags.includes("VIP")) ||
      (filter === "نشط" && customer.status === "نشط") ||
      (filter === "غير نشط" && customer.status === "غير نشط");
    const matchesSearch =
      customer.name.includes(searchTerm) ||
      customer.phone.includes(searchTerm) ||
      (customer.email?.includes(searchTerm) || false);
    return matchesFilter && matchesSearch;
  });

  const toggleSelectCustomer = (id: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map((c) => c.id));
    }
  };

  const sendBulkWhatsApp = () => {
    const selected = customers.filter((c) => selectedCustomers.includes(c.id));
    selected.forEach((customer) => {
      const encodedMessage = encodeURIComponent(message);
      const phone = customer.phone.replace("+", "");
      window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
    });
  };

  const addTag = (customerId: string, tag: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId && !c.tags.includes(tag)
          ? { ...c, tags: [...c.tags, tag] }
          : c
      )
    );
  };

  const removeTag = (customerId: string, tag: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? { ...c, tags: c.tags.filter((t) => t !== tag) }
          : c
      )
    );
  };

  const addSpecialDate = (customerId: string) => {
    if (!newDate.name || !newDate.date) return;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              specialDates: [...(c.specialDates || []), newDate],
            }
          : c
      )
    );
    setNewDate({ name: "", date: "" });
    setShowAddDateModal(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1E2A2A] to-[#2D3436] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin" className="text-[#4A9BA0] hover:underline text-sm mb-2 inline-block">
            ← العودة للوحة التحكم
          </Link>
          <h1 className="text-3xl font-bold text-[#C9A96E]">العملاء والتسويق</h1>
          <p className="text-gray-400 mt-1">{customers.length} عميل مسجل</p>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="بحث بالاسم أو الهاتف..."
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link
            href="/admin/campaigns"
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
          >
            📣 الحملات التسويقية
          </Link>
        </div>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-white">{customers.length}</div>
          <div className="text-gray-400 text-sm">إجمالي العملاء</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-[#C9A96E]">
            {customers.filter((c) => c.tags.includes("VIP")).length}
          </div>
          <div className="text-gray-400 text-sm">عملاء VIP</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-green-400">
            {customers.filter((c) => c.status === "نشط").length}
          </div>
          <div className="text-gray-400 text-sm">عملاء نشطين</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-white">
            {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
          </div>
          <div className="text-gray-400 text-sm">إجمالي الطلبات</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-[#4A9BA0]">
            {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()} ر.س
          </div>
          <div className="text-gray-400 text-sm">إجمالي المبيعات</div>
        </div>
      </div>

      {/* فلاتر */}
      <div className="flex gap-2 mb-6 flex-wrap items-center">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            filter === "الكل" ? "bg-[#C9A96E] text-black" : "bg-white/10 text-white hover:bg-white/20"
          }`}
          onClick={() => setFilter("الكل")}
        >
          الكل
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            filter === "VIP" ? "bg-[#C9A96E] text-black" : "bg-white/10 text-white hover:bg-white/20"
          }`}
          onClick={() => setFilter("VIP")}
        >
          ⭐ VIP
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            filter === "نشط" ? "bg-green-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
          }`}
          onClick={() => setFilter("نشط")}
        >
          نشط
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            filter === "غير نشط" ? "bg-gray-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
          }`}
          onClick={() => setFilter("غير نشط")}
        >
          غير نشط
        </button>

        {selectedCustomers.length > 0 && (
          <div className="mr-auto flex gap-2">
            <span className="text-[#4A9BA0] text-sm">
              {selectedCustomers.length} عميل محدد
            </span>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition"
              onClick={() => setShowMessageModal(true)}
            >
              💬 إرسال رسالة جماعية
            </button>
          </div>
        )}
      </div>

      {/* جدول العملاء */}
      <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-white/5">
            <tr className="text-gray-400 border-b border-white/10">
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                  onChange={selectAll}
                  className="accent-[#C9A96E]"
                />
              </th>
              <th className="p-4 font-medium">العميل</th>
              <th className="p-4 font-medium">التواصل</th>
              <th className="p-4 font-medium">الطلبات</th>
              <th className="p-4 font-medium">إجمالي المشتريات</th>
              <th className="p-4 font-medium">التصنيفات</th>
              <th className="p-4 font-medium">المناسبات</th>
              <th className="p-4 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 py-12">
                  جاري التحميل...
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 py-12">
                  لا يوجد عملاء
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => toggleSelectCustomer(customer.id)}
                      className="accent-[#C9A96E]"
                    />
                  </td>
                  <td className="p-4">
                    <div className="text-white font-medium">{customer.name}</div>
                    <div className="text-gray-400 text-xs">منذ {customer.createdAt}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white text-sm">{customer.phone}</div>
                    {customer.email && (
                      <div className="text-gray-400 text-xs">{customer.email}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-white">{customer.totalOrders} طلب</div>
                    <div className="text-gray-400 text-xs">
                      آخر طلب: {customer.lastOrderDate || "-"}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-[#C9A96E] font-bold">
                      {customer.totalSpent.toLocaleString()} ر.س
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 rounded-full text-xs cursor-pointer ${
                            tag === "VIP"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : tag === "عميل ذهبي"
                              ? "bg-[#C9A96E]/20 text-[#C9A96E]"
                              : "bg-white/10 text-gray-300"
                          }`}
                          onClick={() => removeTag(customer.id, tag)}
                        >
                          {tag} ×
                        </span>
                      ))}
                      <button
                        className="px-2 py-1 rounded-full text-xs bg-white/5 text-gray-400 hover:bg-white/10"
                        onClick={() => addTag(customer.id, "VIP")}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    {customer.specialDates && customer.specialDates.length > 0 ? (
                      <div className="space-y-1">
                        {customer.specialDates.map((date, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="text-pink-400">🎂</span>{" "}
                            <span className="text-gray-300">{date.name}</span>
                            <span className="text-gray-500"> ({date.date})</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs">-</span>
                    )}
                    <button
                      className="text-[#4A9BA0] text-xs hover:underline mt-1 block"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowAddDateModal(true);
                      }}
                    >
                      + إضافة مناسبة
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-xs hover:bg-green-500/30"
                        onClick={() => {
                          const phone = customer.phone.replace("+", "");
                          window.open(`https://wa.me/${phone}`, "_blank");
                        }}
                      >
                        💬
                      </button>
                      <button className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-xs hover:bg-blue-500/30">
                        📋
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* مودال الرسالة الجماعية */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2A2A] rounded-2xl p-6 w-full max-w-lg border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">
              💬 إرسال رسالة جماعية
            </h3>
            <p className="text-gray-400 mb-4">
              سيتم إرسال الرسالة لـ {selectedCustomers.length} عميل
            </p>
            <textarea
              className="w-full bg-white/10 border border-white/20 rounded-lg p-4 text-white placeholder-gray-400 h-40"
              placeholder="اكتب رسالتك هنا..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex gap-4 mt-4">
              <button
                className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition"
                onClick={() => {
                  sendBulkWhatsApp();
                  setShowMessageModal(false);
                  setMessage("");
                }}
              >
                إرسال عبر واتساب
              </button>
              <button
                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                onClick={() => setShowMessageModal(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال إضافة مناسبة */}
      {showAddDateModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2A2A] rounded-2xl p-6 w-full max-w-md border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">
              🎂 إضافة مناسبة خاصة
            </h3>
            <p className="text-gray-400 mb-4">
              للعميل: {selectedCustomer.name}
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="اسم المناسبة (مثل: عيد ميلاد)"
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400"
                value={newDate.name}
                onChange={(e) => setNewDate({ ...newDate, name: e.target.value })}
              />
              <input
                type="date"
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                value={newDate.date}
                onChange={(e) => setNewDate({ ...newDate, date: e.target.value })}
              />
            </div>
            <div className="flex gap-4 mt-6">
              <button
                className="flex-1 bg-[#C9A96E] text-black py-3 rounded-lg font-medium hover:bg-[#D4AF37] transition"
                onClick={() => addSpecialDate(selectedCustomer.id)}
              >
                إضافة
              </button>
              <button
                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                onClick={() => {
                  setShowAddDateModal(false);
                  setSelectedCustomer(null);
                }}
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
