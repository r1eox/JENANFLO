'use client';
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  customer: { name: string; phone: string; address: string };
  items: OrderItem[];
  extras?: { name: string; price: number }[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  discountCode?: string;
  discountAmount?: number;
  giftMessage?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt: string;
}

const STATUS_STEPS = [
  { value: "جديد",          icon: "📥", label: "تم استلام الطلب" },
  { value: "قيد المراجعة",  icon: "🔍", label: "قيد المراجعة"   },
  { value: "جاري التحضير", icon: "🌸", label: "جاري التحضير"   },
  { value: "جاري التوصيل", icon: "🚚", label: "في الطريق"       },
  { value: "تم التسليم",   icon: "🎉", label: "تم التسليم"      },
];

const STATUS_COLOR: Record<string, string> = {
  "جديد":          "bg-blue-500",
  "قيد المراجعة":  "bg-indigo-500",
  "جاري التحضير": "bg-yellow-500",
  "جاري التوصيل": "bg-purple-500",
  "تم التسليم":   "bg-green-500",
  "ملغي":          "bg-red-500",
};

function TrackOrderContent() {
  const searchParams  = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(() => searchParams.get('order') || "");
  const [phone, setPhone]             = useState("");
  const [order, setOrder]             = useState<Order | null>(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [searched, setSearched]       = useState(false);

  // بحث تلقائي لو جاء رقم الطلب من الرابط
  useEffect(() => {
    const num = searchParams.get('order');
    if (num) {
      setOrderNumber(num.toUpperCase());
      // نفذ البحث مباشرة
      fetch(`/api/orders?orderNumber=${encodeURIComponent(num.toUpperCase())}`)
        .then(r => r.json())
        .then(data => {
          if (data && data._id) setOrder(data);
          else setOrder(null);
        })
        .catch(() => setOrder(null))
        .finally(() => { setSearched(true); setLoading(false); });
      setLoading(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTrack = async () => {
    const trimmed = orderNumber.trim().toUpperCase();
    if (!trimmed) {
      setError("الرجاء إدخال رقم الطلب");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(false);
    setOrder(null);

    try {
      const res  = await fetch(`/api/orders?orderNumber=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (res.ok && data && data._id) {
        // إذا أدخل رقم الجوال، تحقق منه
        if (phone.trim()) {
          const entered = phone.trim().replace(/^0/, "966").replace(/^\+/, "");
          const stored  = (data.customer?.phone || "").replace(/^0/, "966").replace(/^\+/, "");
          if (entered !== stored) {
            setError("رقم الجوال لا يطابق الطلب");
            setSearched(true);
            setLoading(false);
            return;
          }
        }
        setOrder(data);
      } else {
        setOrder(null);
      }
    } catch {
      setOrder(null);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  const getCurrentStepIndex = (status: string) => {
    const idx = STATUS_STEPS.findIndex(s => s.value === status);
    return idx === -1 ? 0 : idx;
  };

  const isCancelled = order?.status === "ملغي";

  return (
    <main
      className="min-h-screen p-6"
      style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 50%, #1E2A2A 100%)" }}
    >
      {/* Header */}
      <header
        className="w-full flex justify-between items-center py-4 mb-8 max-w-4xl mx-auto"
        style={{ borderBottom: "1px solid rgba(74, 155, 160, 0.3)" }}
      >
        <Link href="/" className="text-2xl font-bold" style={{ color: "#C9A96E" }}>
          جنان فلو
        </Link>
        <Link
          href="/cart"
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: "rgba(74,155,160,0.15)", color: "#4A9BA0" }}
        >
          🛒 السلة
        </Link>
      </header>

      {/* Title */}
      <section className="text-center mb-10">
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-3"
          style={{
            background: "linear-gradient(180deg, #D4AF37, #C9A96E)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          📦 تتبع طلبك
        </h1>
        <p className="text-base" style={{ color: "#8B9A9A" }}>
          أدخل رقم الطلب لمعرفة حالته لحظة بلحظة
        </p>
      </section>

      {/* Search */}
      <section className="max-w-xl mx-auto mb-10">
        <div
          className="rounded-2xl p-8"
          style={{
            background: "linear-gradient(145deg, #2D3436, #1E2A2A)",
            border: "1px solid rgba(201, 169, 110, 0.2)",
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: "#C9A96E" }}>
                رقم الطلب *
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => { setOrderNumber(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                className="w-full p-4 rounded-xl text-center text-lg font-bold tracking-widest"
                placeholder="JF-000123"
                dir="ltr"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(201, 169, 110, 0.3)",
                  color: "#fff",
                }}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: "#C9A96E" }}>
                رقم الجوال (اختياري للتحقق)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                className="w-full p-4 rounded-xl text-center"
                placeholder="05xxxxxxxx"
                dir="ltr"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(201, 169, 110, 0.3)",
                  color: "#fff",
                }}
              />
            </div>

            {error && (
              <p className="text-center text-sm" style={{ color: "#ff6b6b" }}>
                ⚠️ {error}
              </p>
            )}

            <button
              onClick={handleTrack}
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}
            >
              {loading ? "🔍 جاري البحث..." : "🔍 تتبع الطلب"}
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      {searched && (
        <section className="max-w-4xl mx-auto">
          {order ? (
            <div className="space-y-6">

              {/* Status Banner */}
              <div
                className="rounded-2xl p-8 text-center"
                style={{
                  background: "linear-gradient(145deg, #2D3436, #1E2A2A)",
                  border: `1px solid ${isCancelled ? "rgba(239,68,68,0.4)" : "rgba(74,155,160,0.4)"}`,
                }}
              >
                <div className="text-6xl mb-4">
                  {isCancelled ? "❌" : STATUS_STEPS[getCurrentStepIndex(order.status)]?.icon || "📦"}
                </div>
                <p className="text-sm mb-1" style={{ color: "#8B9A9A" }}>رقم الطلب</p>
                <div className="text-3xl font-mono font-bold mb-4" style={{ color: "#C9A96E" }}>
                  {order.orderNumber}
                </div>
                <span
                  className={`inline-block px-5 py-2 rounded-full text-white text-lg font-bold ${STATUS_COLOR[order.status] || "bg-gray-500"}`}
                >
                  {order.status}
                </span>
                <p className="mt-3 text-sm" style={{ color: "#8B9A9A" }}>
                  تاريخ الطلب:{" "}
                  {new Date(order.createdAt).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Progress Steps */}
              {!isCancelled && (
                <div
                  className="rounded-2xl p-8"
                  style={{
                    background: "linear-gradient(145deg, #2D3436, #1E2A2A)",
                    border: "1px solid rgba(201, 169, 110, 0.2)",
                  }}
                >
                  <h3 className="text-xl font-bold mb-8 text-center" style={{ color: "#C9A96E" }}>
                    مراحل الطلب
                  </h3>

                  <div className="flex justify-between items-start relative">
                    <div
                      className="absolute top-5 h-1"
                      style={{ background: "rgba(74,155,160,0.2)", left: "5%", right: "5%" }}
                    >
                      <div
                        className="h-full transition-all duration-700"
                        style={{
                          background: "linear-gradient(90deg, #4A9BA0, #D4AF37)",
                          width: `${(getCurrentStepIndex(order.status) / (STATUS_STEPS.length - 1)) * 100}%`,
                        }}
                      />
                    </div>

                    {STATUS_STEPS.map((step, index) => {
                      const currentIdx = getCurrentStepIndex(order.status);
                      const isDone    = index <= currentIdx;
                      const isCurrent = index === currentIdx;

                      return (
                        <div key={step.value} className="flex flex-col items-center relative z-10 flex-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${isCurrent ? "scale-125" : ""}`}
                            style={{
                              background: isDone
                                ? "linear-gradient(135deg, #4A9BA0, #2D8B8B)"
                                : "rgba(74,155,160,0.12)",
                              border: isCurrent ? "3px solid #D4AF37" : "2px solid transparent",
                              boxShadow: isCurrent ? "0 0 14px rgba(212,175,55,0.5)" : "none",
                            }}
                          >
                            {step.icon}
                          </div>
                          <span
                            className="text-xs mt-2 text-center leading-tight px-1"
                            style={{ color: isDone ? "#C9A96E" : "#525F5F" }}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* المنتجات */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "linear-gradient(145deg, #2D3436, #1E2A2A)",
                    border: "1px solid rgba(201, 169, 110, 0.2)",
                  }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: "#C9A96E" }}>
                    🛍️ المنتجات
                  </h3>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                        )}
                        <div className="flex-1">
                          <span style={{ color: "#fff" }}>{item.name}</span>
                          <span className="text-xs mr-1" style={{ color: "#8B9A9A" }}>
                            × {item.quantity}
                          </span>
                        </div>
                        <span style={{ color: "#D4AF37" }}>{item.price * item.quantity} ر.س</span>
                      </div>
                    ))}

                    {order.extras && order.extras.length > 0 && (
                      <div className="border-t pt-2" style={{ borderColor: "rgba(201,169,110,0.15)" }}>
                        <p className="text-xs mb-2" style={{ color: "#C9A96E" }}>🎁 الإضافات</p>
                        {order.extras.map((ex, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span style={{ color: "#9AACAC" }}>{ex.name}</span>
                            <span style={{ color: "#D4AF37" }}>+{ex.price} ر.س</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="border-t pt-3 space-y-1 text-sm" style={{ borderColor: "rgba(201,169,110,0.2)" }}>
                      {order.discountAmount && order.discountAmount > 0 && (
                        <div className="flex justify-between" style={{ color: "#4A9BA0" }}>
                          <span>خصم ({order.discountCode})</span>
                          <span>- {order.discountAmount} ر.س</span>
                        </div>
                      )}
                      <div className="flex justify-between" style={{ color: "#9AACAC" }}>
                        <span>التوصيل</span>
                        <span>{order.deliveryFee === 0 ? "مجاني 🎉" : `${order.deliveryFee} ر.س`}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base pt-1">
                        <span style={{ color: "#C9A96E" }}>الإجمالي</span>
                        <span style={{ color: "#D4AF37" }}>{order.total} ر.س</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: "#8B9A9A" }}>الدفع</span>
                        <span
                          className={`px-2 py-0.5 rounded ${
                            order.paymentStatus === "مدفوع"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {order.paymentStatus || "معلق"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* التوصيل */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "linear-gradient(145deg, #2D3436, #1E2A2A)",
                    border: "1px solid rgba(201, 169, 110, 0.2)",
                  }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: "#C9A96E" }}>
                    🚚 معلومات التوصيل
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs mb-1" style={{ color: "#8B9A9A" }}>العميل</p>
                      <p className="font-medium" style={{ color: "#fff" }}>{order.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: "#8B9A9A" }}>عنوان التوصيل</p>
                      <p style={{ color: "#fff" }}>{order.customer.address}</p>
                    </div>
                    {order.deliveryDate && (
                      <div>
                        <p className="text-xs mb-1" style={{ color: "#8B9A9A" }}>📅 موعد التوصيل</p>
                        <p style={{ color: "#4A9BA0" }}>
                          {order.deliveryDate}
                          {order.deliveryTime && (
                            <span className="mr-2 text-sm" style={{ color: "#9AACAC" }}>
                              ({order.deliveryTime})
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                    {order.giftMessage && (
                      <div
                        className="p-3 rounded-xl"
                        style={{
                          background: "rgba(201,169,110,0.08)",
                          border: "1px solid rgba(201,169,110,0.2)",
                        }}
                      >
                        <p className="text-xs mb-1" style={{ color: "#C9A96E" }}>🌹 رسالة الهدية</p>
                        <p className="text-sm italic" style={{ color: "#fff" }}>
                          &ldquo;{order.giftMessage}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* WhatsApp Help */}
              <div
                className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                style={{
                  background: "rgba(74,155,160,0.08)",
                  border: "1px solid rgba(74,155,160,0.25)",
                }}
              >
                <div>
                  <p className="font-medium" style={{ color: "#fff" }}>هل تحتاج مساعدة بخصوص طلبك؟</p>
                  <p className="text-sm" style={{ color: "#8B9A9A" }}>فريقنا جاهز للمساعدة في أي وقت</p>
                </div>
                <a
                  href={`https://wa.me/966501234567?text=${encodeURIComponent(`استفسار عن طلب رقم ${order.orderNumber}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all hover:scale-105 whitespace-nowrap"
                  style={{ background: "#25D366", color: "#fff" }}
                >
                  💬 تواصل واتساب
                </a>
              </div>
            </div>
          ) : (
            <div
              className="max-w-md mx-auto text-center rounded-2xl p-12"
              style={{
                background: "linear-gradient(145deg, #2D3436, #1E2A2A)",
                border: "1px solid rgba(201,169,110,0.2)",
              }}
            >
              <div className="text-6xl mb-6">🔍</div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: "#C9A96E" }}>
                لم يُعثر على الطلب
              </h2>
              <p className="mb-2" style={{ color: "#8B9A9A" }}>
                تأكد من رقم الطلب وحاول مرة أخرى
              </p>
              <p className="text-sm mb-6" style={{ color: "#525F5F" }}>
                مثال: JF-000123
              </p>
              <a
                href="https://wa.me/966501234567"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold transition hover:scale-105"
                style={{ background: "#25D366", color: "#fff" }}
              >
                💬 تواصل معنا
              </a>
            </div>
          )}
        </section>
      )}

      <div className="text-center mt-12">
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-full font-semibold transition hover:scale-105"
          style={{
            background: "rgba(201,169,110,0.15)",
            color: "#C9A96E",
            border: "1px solid rgba(201,169,110,0.3)",
          }}
        >
          ← العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
export default function TrackOrderPage() {
  return (
    <Suspense>
      <TrackOrderContent />
    </Suspense>
  );
}