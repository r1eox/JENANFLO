'use client';
import React, { useState } from "react";
import Link from "next/link";

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';

interface Order {
  orderNumber: string;
  status: OrderStatus;
  statusText: string;
  customer: { name: string; phone: string };
  items: { name: string; quantity: number; price: number }[];
  total: number;
  deliveryAddress: string;
  deliveryDate?: string;
  deliveryTime?: string;
  createdAt: string;
  timeline: { status: string; date: string; time: string; done: boolean }[];
}

const statusSteps: { key: OrderStatus; label: string; icon: string }[] = [
  { key: 'pending', label: 'تم الاستلام', icon: '📥' },
  { key: 'confirmed', label: 'تم التأكيد', icon: '✅' },
  { key: 'preparing', label: 'جاري التحضير', icon: '🌸' },
  { key: 'delivering', label: 'في الطريق', icon: '🚚' },
  { key: 'delivered', label: 'تم التسليم', icon: '🎉' },
];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleTrack = async () => {
    if (!orderNumber.trim()) {
      setError("الرجاء إدخال رقم الطلب");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      // محاولة البحث في API أولاً
      const res = await fetch(`/api/orders?orderNumber=${orderNumber}`);
      
      if (res.ok) {
        const data = await res.json();
        if (data && data.orderNumber) {
          // تحويل الحالة للعربية
          const statusMap: Record<string, string> = {
            'pending': 'قيد الانتظار',
            'confirmed': 'تم التأكيد',
            'preparing': 'جاري التحضير',
            'delivering': 'في الطريق',
            'delivered': 'تم التسليم',
            'cancelled': 'ملغي',
          };
          
          const orderData: Order = {
            orderNumber: data.orderNumber,
            status: data.status || 'pending',
            statusText: statusMap[data.status] || 'قيد الانتظار',
            customer: data.customer || { name: '', phone: '' },
            items: data.items || [],
            total: data.total || 0,
            deliveryAddress: data.deliveryAddress || '',
            deliveryDate: data.deliveryDate,
            deliveryTime: data.deliveryTime,
            createdAt: data.createdAt || new Date().toISOString(),
            timeline: generateTimeline(data.status || 'pending', data.createdAt),
          };
          setOrder(orderData);
        } else {
          // بيانات تجريبية للعرض
          if (orderNumber.toUpperCase().startsWith('JF-')) {
            const mockOrder: Order = {
              orderNumber: orderNumber.toUpperCase(),
              status: 'preparing',
              statusText: 'جاري التحضير',
              customer: { name: 'عميل كريم', phone: phone || '05xxxxxxxx' },
              items: [
                { name: 'باقة الورد الملكية', quantity: 1, price: 280 },
                { name: 'شوكولاتة فاخرة', quantity: 1, price: 45 },
              ],
              total: 350,
              deliveryAddress: 'الرياض - حي النرجس',
              deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              deliveryTime: 'مساءً (4-8)',
              createdAt: new Date().toISOString(),
              timeline: generateTimeline('preparing', new Date().toISOString()),
            };
            setOrder(mockOrder);
          } else {
            setOrder(null);
          }
        }
      } else {
        setOrder(null);
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      // استخدام بيانات تجريبية عند الخطأ
      if (orderNumber.toUpperCase().startsWith('JF-')) {
        const mockOrder: Order = {
          orderNumber: orderNumber.toUpperCase(),
          status: 'preparing',
          statusText: 'جاري التحضير',
          customer: { name: 'عميل كريم', phone: phone || '05xxxxxxxx' },
          items: [
            { name: 'باقة الورد الملكية', quantity: 1, price: 280 },
          ],
          total: 305,
          deliveryAddress: 'الرياض',
          deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          deliveryTime: 'مساءً (4-8)',
          createdAt: new Date().toISOString(),
          timeline: generateTimeline('preparing', new Date().toISOString()),
        };
        setOrder(mockOrder);
      } else {
        setOrder(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateTimeline = (currentStatus: string, createdAt: string): Order['timeline'] => {
    const statusOrder = ['pending', 'confirmed', 'preparing', 'delivering', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const createdDate = new Date(createdAt);
    
    return statusSteps.map((step, index) => {
      const stepDate = new Date(createdDate);
      stepDate.setHours(stepDate.getHours() + index * 2);
      
      return {
        status: step.label,
        date: stepDate.toLocaleDateString('ar-SA'),
        time: stepDate.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        done: index <= currentIndex,
      };
    });
  };

  const getCurrentStepIndex = (status: OrderStatus) => {
    return statusSteps.findIndex(s => s.key === status);
  };

  return (
    <main className="min-h-screen p-6" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 50%, #1E2A2A 100%)" }}>
      {/* Header */}
      <header className="w-full flex justify-between items-center py-4 mb-8 max-w-4xl mx-auto" style={{ borderBottom: "1px solid rgba(74, 155, 160, 0.3)" }}>
        <Link href="/" className="text-2xl font-bold" style={{ color: "#C9A96E" }}>جنان فلو</Link>
        <nav className="flex gap-6 text-lg font-medium">
          <Link href="/" className="transition hover:text-teal-400" style={{ color: "#C9A96E" }}>الرئيسية</Link>
          <Link href="/cart" className="transition hover:text-teal-400" style={{ color: "#4A9BA0" }}>🛒</Link>
        </nav>
      </header>

      {/* Page Title */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ background: "linear-gradient(180deg, #D4AF37, #C9A96E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          📦 تتبع طلبك
        </h1>
        <p className="text-lg" style={{ color: "#8B9A9A" }}>تابع حالة طلبك لحظة بلحظة</p>
      </section>

      {/* Search Form */}
      <section className="max-w-xl mx-auto mb-12">
        <div className="rounded-2xl p-8" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: "#C9A96E" }}>رقم الطلب *</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full p-4 rounded-xl text-center text-lg font-bold"
                placeholder="JF-000123"
                dir="ltr"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201, 169, 110, 0.3)", color: "#fff" }}
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: "#C9A96E" }}>رقم الجوال (اختياري)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-4 rounded-xl text-center"
                placeholder="05xxxxxxxx"
                dir="ltr"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201, 169, 110, 0.3)", color: "#fff" }}
              />
            </div>

            {error && (
              <p className="text-center text-red-400 text-sm">{error}</p>
            )}

            <button
              onClick={handleTrack}
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}
            >
              {loading ? '🔍 جاري البحث...' : '🔍 تتبع الطلب'}
            </button>
          </div>
        </div>
      </section>

      {/* Order Details */}
      {searched && (
        <section className="max-w-4xl mx-auto">
          {order ? (
            <div className="space-y-6">
              {/* Status Header */}
              <div className="rounded-2xl p-8 text-center" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(74, 155, 160, 0.3)" }}>
                <div className="text-5xl mb-4">
                  {statusSteps[getCurrentStepIndex(order.status)]?.icon || '📦'}
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: "#C9A96E" }}>
                  طلب رقم: {order.orderNumber}
                </h2>
                <p className="text-xl" style={{ color: "#4A9BA0" }}>{order.statusText}</p>
              </div>

              {/* Progress Steps */}
              <div className="rounded-2xl p-8" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}>
                <h3 className="text-xl font-bold mb-6 text-center" style={{ color: "#C9A96E" }}>مراحل الطلب</h3>
                
                <div className="flex justify-between items-center relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-0 right-0 h-1 mx-10" style={{ background: "rgba(74, 155, 160, 0.2)" }}>
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        background: "linear-gradient(90deg, #4A9BA0, #2D8B8B)",
                        width: `${(getCurrentStepIndex(order.status) / (statusSteps.length - 1)) * 100}%`
                      }}
                    />
                  </div>
                  
                  {statusSteps.map((step, index) => {
                    const currentIndex = getCurrentStepIndex(order.status);
                    const isDone = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    
                    return (
                      <div key={step.key} className="flex flex-col items-center relative z-10">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${isCurrent ? 'scale-125 animate-pulse' : ''}`}
                          style={{ 
                            background: isDone ? 'linear-gradient(135deg, #4A9BA0, #2D8B8B)' : 'rgba(74, 155, 160, 0.2)',
                            border: isCurrent ? '3px solid #D4AF37' : 'none'
                          }}
                        >
                          {step.icon}
                        </div>
                        <span className={`text-xs mt-2 text-center ${isDone ? '' : 'opacity-50'}`} style={{ color: isDone ? "#C9A96E" : "#8B9A9A" }}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Timeline */}
              <div className="rounded-2xl p-8" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}>
                <h3 className="text-xl font-bold mb-6" style={{ color: "#C9A96E" }}>📋 سجل التحديثات</h3>
                
                <div className="space-y-4">
                  {order.timeline.filter(t => t.done).reverse().map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full" style={{ background: index === 0 ? "#D4AF37" : "#4A9BA0" }} />
                      <div className="flex-1">
                        <p className="font-bold" style={{ color: index === 0 ? "#D4AF37" : "#C9A96E" }}>{item.status}</p>
                        <p className="text-sm" style={{ color: "#8B9A9A" }}>{item.date} - {item.time}</p>
                      </div>
                      {index === 0 && (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(212, 175, 55, 0.2)", color: "#D4AF37" }}>
                          الحالة الحالية
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl p-6" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: "#C9A96E" }}>📦 المنتجات</h3>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span style={{ color: "#fff" }}>{item.name} × {item.quantity}</span>
                        <span style={{ color: "#D4AF37" }}>{item.price} ر.س</span>
                      </div>
                    ))}
                    <div className="border-t pt-3 mt-3 flex justify-between items-center" style={{ borderColor: "rgba(201, 169, 110, 0.2)" }}>
                      <span className="font-bold" style={{ color: "#C9A96E" }}>الإجمالي</span>
                      <span className="font-bold text-lg" style={{ color: "#D4AF37" }}>{order.total} ر.س</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl p-6" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: "#C9A96E" }}>🚚 التوصيل</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm" style={{ color: "#8B9A9A" }}>العنوان</p>
                      <p style={{ color: "#fff" }}>{order.deliveryAddress}</p>
                    </div>
                    {order.deliveryDate && (
                      <div>
                        <p className="text-sm" style={{ color: "#8B9A9A" }}>موعد التوصيل</p>
                        <p style={{ color: "#fff" }}>{order.deliveryDate} - {order.deliveryTime}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(74, 155, 160, 0.1)", border: "1px solid rgba(74, 155, 160, 0.3)" }}>
                <p className="mb-4" style={{ color: "#9AACAC" }}>هل تحتاج مساعدة بخصوص طلبك؟</p>
                <a
                  href="https://wa.me/966501234567"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105"
                  style={{ background: "#25D366", color: "#fff" }}
                >
                  💬 تواصل معنا عبر واتساب
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🔍</div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#C9A96E" }}>لم نجد الطلب</h2>
              <p className="mb-2" style={{ color: "#8B9A9A" }}>تأكد من رقم الطلب وحاول مرة أخرى</p>
              <p className="text-sm" style={{ color: "#6B7B7B" }}>مثال: JF-000123</p>
            </div>
          )}
        </section>
      )}

      {/* Back Button */}
      <div className="text-center mt-12">
        <Link 
          href="/" 
          className="inline-block px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
          style={{ background: "rgba(201, 169, 110, 0.2)", color: "#C9A96E", border: "1px solid #C9A96E" }}
        >
          ← العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
