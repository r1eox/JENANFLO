"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

type Extra = {
  name: string;
  price: number;
};

type Order = {
  _id: string;
  id?: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
  };
  items: OrderItem[];
  status: string;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  giftMessage?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  notes?: string;
  invoiceSent?: boolean;
  thankYouSent?: boolean;
  createdAt: string;
  extras?: Extra[];
  extrasTotal?: number;
  discountCode?: string;
  discountAmount?: number;
};

const statusOptions = [
  { value: "جديد", color: "bg-blue-500", icon: "🆕" },
  { value: "قيد المراجعة", color: "bg-indigo-500", icon: "🔍" },
  { value: "جاري التحضير", color: "bg-yellow-500", icon: "🌸" },
  { value: "جاري التوصيل", color: "bg-purple-500", icon: "🚚" },
  { value: "تم التسليم", color: "bg-green-500", icon: "✅" },
  { value: "ملغي", color: "bg-red-500", icon: "❌" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          const raw = Array.isArray(data) ? data : data.orders || [];
          const formattedOrders = raw.map((order: any) => ({
            _id: order._id,
            id: order._id,
            orderNumber: order.orderNumber,
            customer: order.customer,
            items: order.items,
            status: order.status,
            subtotal: order.subtotal,
            tax: order.tax || 0,
            deliveryFee: order.deliveryFee || 0,
            total: order.total,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus || "معلق",
            giftMessage: order.giftMessage,
            deliveryDate: order.deliveryDate,
            deliveryTime: order.deliveryTime,
            notes: order.notes,
            invoiceSent: order.invoiceSent || false,
            thankYouSent: order.thankYouSent || false,
            createdAt: order.createdAt,
            extras: order.extras || [],
            extrasTotal: order.extrasTotal || 0,
            discountCode: order.discountCode,
            discountAmount: order.discountAmount || 0,
          }));
          setOrders(formattedOrders);
        }
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const getStatusColor = (status: string) => {
    const option = statusOptions.find((s) => s.value === status);
    return option?.color || "bg-gray-500";
  };

  const getStatusIcon = (status: string) => {
    const option = statusOptions.find((s) => s.value === status);
    return option?.icon || "📦";
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "الكل" || order.status === filter;
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.includes(searchTerm) ||
      order.customer?.phone?.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const sendWhatsAppInvoice = (order: Order) => {
    const itemsList = order.items
      .map((item) => `• ${item.name} × ${item.quantity} = ${item.price * item.quantity} ر.س`)
      .join("\n");

    const extrasList =
      order.extras && order.extras.length > 0
        ? "\n\nالإضافات:\n" + order.extras.map((e) => `+ ${e.name} = ${e.price} ر.س`).join("\n")
        : "";

    const discountLine =
      order.discountCode
        ? `\nخصم (${order.discountCode}): -${order.discountAmount?.toFixed(2)} ر.س`
        : "";

    const message = `🌸 *فاتورة جنان فلو* 🌸

رقم الطلب: ${order.orderNumber}
التاريخ: ${new Date(order.createdAt).toLocaleDateString("ar-SA")}

════════════════
*تفاصيل الطلب:*
${itemsList}${extrasList}${discountLine}

════════════════
المجموع: ${order.subtotal} ر.س
الضريبة (15%): ${order.tax} ر.س
التوصيل: ${order.deliveryFee} ر.س
*الإجمالي: ${order.total} ر.س*

📍 عنوان التوصيل: ${order.customer.address}
📅 موعد التسليم: ${order.deliveryDate || "—"} (${order.deliveryTime || "—"})

شكراً لثقتكم بجنان فلو 🌸`;

    const encodedMessage = encodeURIComponent(message);
    const phone = order.customer.phone.replace("+", "").replace(/^0/, "966");
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");

    setOrders((prev) =>
      prev.map((o) => (o._id === order._id ? { ...o, invoiceSent: true } : o))
    );
    if (selectedOrder?._id === order._id) {
      setSelectedOrder({ ...order, invoiceSent: true });
    }
  };

  const sendWhatsAppStatusUpdate = (order: Order) => {
    let statusMessage = "";
    switch (order.status) {
      case "قيد المراجعة":
        statusMessage = "تم استلام طلبك وجاري مراجعته ✅";
        break;
      case "جاري التحضير":
        statusMessage = "طلبك الآن قيد التحضير بكل حب 🌸";
        break;
      case "جاري التوصيل":
        statusMessage = "طلبك في الطريق إليك! 🚚🎀";
        break;
      case "تم التسليم":
        statusMessage = "تم تسليم طلبك بنجاح! نتمنى أن ينال إعجابكم 🌸";
        break;
      default:
        statusMessage = `حالة طلبك: ${order.status}`;
    }

    const message = `مرحباً ${order.customer.name} 🌸

*تحديث طلبك رقم ${order.orderNumber}*

${statusMessage}

للاستفسارات تواصل معنا 💐
جنان فلو 🌸`;

    const encodedMessage = encodeURIComponent(message);
    const phone = order.customer.phone.replace("+", "").replace(/^0/, "966");
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
  };

  const sendThankYouMessage = (order: Order) => {
    const message = `شكراً لك ${order.customer.name} 🌸

نتمنى أن تكون هديتك قد أسعدت قلبك وقلب من تحب 🌸

رأيك يهمنا! شاركنا تجربتك ⭐⭐⭐⭐⭐

خصم 10% على طلبك القادم مع كود: THANKYOU10

مع حبنا 🌸
فريق جنان فلو 🌺`;

    const encodedMessage = encodeURIComponent(message);
    const phone = order.customer.phone.replace("+", "").replace(/^0/, "966");
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");

    setOrders((prev) =>
      prev.map((o) => (o._id === order._id ? { ...o, thankYouSent: true } : o))
    );
    if (selectedOrder?._id === order._id) {
      setSelectedOrder({ ...order, thankYouSent: true });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1E2A2A] to-[#2D3436] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href="/admin"
            className="text-[#4A9BA0] hover:underline text-sm mb-2 inline-block"
          >
            ← العودة للوحة التحكم
          </Link>
          <h1 className="text-3xl font-bold text-[#C9A96E]">إدارة الطلبات</h1>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="بحث برقم الطلب أو اسم العميل..."
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* فلاتر الحالة */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            filter === "الكل"
              ? "bg-[#C9A96E] text-black"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
          onClick={() => setFilter("الكل")}
        >
          الكل ({orders.length})
        </button>
        {statusOptions.map((status) => (
          <button
            key={status.value}
            className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${
              filter === status.value
                ? `${status.color} text-white`
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
            onClick={() => setFilter(status.value)}
          >
            <span>{status.icon}</span>
            {status.value} ({orders.filter((o) => o.status === status.value).length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* قائمة الطلبات */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center text-gray-400 py-12">جاري التحميل...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center text-gray-400 py-12">لا توجد طلبات</div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className={`bg-white/5 backdrop-blur rounded-xl border transition cursor-pointer ${
                  selectedOrder?._id === order._id
                    ? "border-[#C9A96E]"
                    : "border-white/10 hover:border-white/30"
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#C9A96E] font-mono font-bold">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)} {order.status}
                        </span>
                      </div>
                      <div className="text-white mt-1">{order.customer.name}</div>
                      <div className="text-gray-400 text-sm">{order.customer.phone}</div>
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-bold text-white">{order.total} ر.س</div>
                      <div className="text-gray-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        order.paymentStatus === "مدفوع"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">{order.paymentMethod}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">{order.items.length} منتجات</span>
                    {order.extras && order.extras.length > 0 && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-green-400 text-xs">🎁 {order.extras.length} إضافات</span>
                      </>
                    )}
                  </div>

                  {/* أزرار سريعة */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                    <select
                      className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white text-sm flex-1"
                      value={order.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateOrderStatus(order._id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {statusOptions.map((s) => (
                        <option key={s.value} value={s.value} className="bg-[#1E2A2A]">
                          {s.icon} {s.value}
                        </option>
                      ))}
                    </select>
                    <button
                      className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm hover:bg-green-500/30 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        sendWhatsAppInvoice(order);
                      }}
                    >
                      💐 الفاتورة
                    </button>
                    <button
                      className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-sm hover:bg-blue-500/30 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        sendWhatsAppStatusUpdate(order);
                      }}
                    >
                      📱 تحديث
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* تفاصيل الطلب */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-white mb-4">تفاصيل الطلب</h3>

              <div className="space-y-4">
                {/* معلومات الطلب */}
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#C9A96E] font-mono text-lg">
                      {selectedOrder.orderNumber}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm text-white ${getStatusColor(selectedOrder.status)}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {new Date(selectedOrder.createdAt).toLocaleString("ar-SA")}
                  </div>
                </div>

                {/* معلومات العميل */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-[#4A9BA0] font-medium mb-2">👤 معلومات العميل</h4>
                  <div className="text-white">{selectedOrder.customer.name}</div>
                  <div className="text-gray-400 text-sm">{selectedOrder.customer.phone}</div>
                  {selectedOrder.customer.email && (
                    <div className="text-gray-400 text-sm">{selectedOrder.customer.email}</div>
                  )}
                  <div className="text-gray-400 text-sm mt-1">
                    {selectedOrder.customer.address}
                  </div>
                </div>

                {/* المنتجات */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-[#4A9BA0] font-medium mb-3">🛍️ المنتجات</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="text-white text-sm">{item.name}</div>
                          <div className="text-gray-400 text-xs">× {item.quantity}</div>
                        </div>
                        <div className="text-[#C9A96E]">
                          {item.price * item.quantity} ر.س
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* الإضافات */}
                {selectedOrder.extras && selectedOrder.extras.length > 0 && (
                  <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
                    <h4 className="text-amber-400 font-medium mb-2">🎁 الإضافات</h4>
                    {selectedOrder.extras.map((extra, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-white">{extra.name}</span>
                        <span className="text-amber-400">+{extra.price} ر.س</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* رسالة الهدية */}
                {selectedOrder.giftMessage && (
                  <div className="bg-pink-500/10 rounded-lg p-4 border border-pink-500/20">
                    <h4 className="text-pink-400 font-medium mb-2">🌹 رسالة الهدية</h4>
                    <div className="text-white text-sm italic">
                      &ldquo;{selectedOrder.giftMessage}&rdquo;
                    </div>
                  </div>
                )}

                {/* التوصيل */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-[#4A9BA0] font-medium mb-2">🚚 التوصيل</h4>
                  <div className="text-white">📅 {selectedOrder.deliveryDate || "—"}</div>
                  <div className="text-gray-400 text-sm">⏰ {selectedOrder.deliveryTime || "—"}</div>
                  {selectedOrder.notes && (
                    <div className="text-yellow-400 text-sm mt-2">📝 {selectedOrder.notes}</div>
                  )}
                </div>

                {/* الفاتورة */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-[#4A9BA0] font-medium mb-3">💰 الفاتورة</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span>المجموع</span>
                      <span>{selectedOrder.subtotal} ر.س</span>
                    </div>
                    {selectedOrder.extrasTotal && selectedOrder.extrasTotal > 0 && (
                      <div className="flex justify-between text-amber-400">
                        <span>الإضافات</span>
                        <span>+{selectedOrder.extrasTotal} ر.س</span>
                      </div>
                    )}
                    {selectedOrder.discountAmount && selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>خصم ({selectedOrder.discountCode})</span>
                        <span>-{selectedOrder.discountAmount} ر.س</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-300">
                      <span>الضريبة (15%)</span>
                      <span>{selectedOrder.tax} ر.س</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>التوصيل</span>
                      <span>{selectedOrder.deliveryFee} ر.س</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                      <span>الإجمالي</span>
                      <span className="text-[#C9A96E]">{selectedOrder.total} ر.س</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        selectedOrder.paymentStatus === "مدفوع"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {selectedOrder.paymentStatus}
                    </span>
                    <span className="px-2 py-1 rounded text-xs bg-white/10 text-gray-300">
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="space-y-2">
                  <button
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition flex items-center justify-center gap-2"
                    onClick={() => sendWhatsAppInvoice(selectedOrder)}
                  >
                    💐 إرسال الفاتورة واتساب
                    {selectedOrder.invoiceSent && (
                      <span className="text-xs opacity-80">(تم الإرسال)</span>
                    )}
                  </button>
                  <button
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2"
                    onClick={() => sendWhatsAppStatusUpdate(selectedOrder)}
                  >
                    📱 إرسال تحديث الحالة
                  </button>
                  {selectedOrder.status === "تم التسليم" && (
                    <button
                      className="w-full bg-pink-500 text-white py-3 rounded-lg font-medium hover:bg-pink-600 transition flex items-center justify-center gap-2"
                      onClick={() => sendThankYouMessage(selectedOrder)}
                    >
                      🌹 إرسال رسالة شكر
                      {selectedOrder.thankYouSent && (
                        <span className="text-xs opacity-80">(تم الإرسال)</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-12 text-center">
              <div className="text-5xl mb-4">📋</div>
              <div className="text-gray-400">اختر طلباً لعرض التفاصيل</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
