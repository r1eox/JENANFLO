'use client';
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { products as localProducts } from "../products/data";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  giftMessage?: string;
}

interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  image: string;
}

// الإضافات المتاحة
const availableExtras = [
  { id: 'card', name: 'بطاقة معايدة فاخرة', price: 15, emoji: '💌' },
  { id: 'chocolate', name: 'شوكولاتة فاخرة', price: 45, emoji: '🍫' },
  { id: 'balloon', name: 'بالونات هيليوم', price: 35, emoji: '🎈' },
  { id: 'wrap', name: 'تغليف فاخر إضافي', price: 25, emoji: '🎁' },
  { id: 'teddy', name: 'دبدوب قطيفة', price: 55, emoji: '🧸' },
  { id: 'perfume', name: 'عطر صغير', price: 75, emoji: '🌸' },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // بيانات العميل
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  
  // ميزات جديدة
  const [deliveryToOther, setDeliveryToOther] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [isSecretGift, setIsSecretGift] = useState(false);
  const [secretMessage, setSecretMessage] = useState("");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // أكواد الخصم
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState<Record<string, number>>({});

  // العناوين المحفوظة + بيانات المستخدم
  const [savedAddresses, setSavedAddresses] = useState<{ id: string; label: string; address: string; nationalAddress?: string; lat?: number; lng?: number; isDefault: boolean }[]>([]);
  const [selectedSavedAddr, setSelectedSavedAddr] = useState<string | null>(null);

  useEffect(() => {
    const u = localStorage.getItem('jenanflo_user');
    if (u) {
      try {
        const parsed = JSON.parse(u);
        if (parsed.name) setCustomerName(parsed.name);
        if (parsed.phone) setCustomerPhone(parsed.phone);
      } catch {}
    }
    // استخدم المفتاح الخاص بالمستخدم لقراءة عناوينه
    import('@/lib/userStorage').then(({ getUD }) => {
      const list = getUD<typeof savedAddresses>('jenanflo_addresses', []);
      setSavedAddresses(list);
      const def = list.find((a) => a.isDefault);
      if (def) { setDeliveryAddress(def.address); setSelectedSavedAddr(def.id); }
    });
  }, []);

  // إعدادات المتجر
  const [storeSettings, setStoreSettings] = useState({ deliveryFee: 25, freeDeliveryMin: 300, storePhone: '966501234567' });

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => setStoreSettings({
        deliveryFee: d.deliveryFee ?? 25,
        freeDeliveryMin: d.freeDeliveryMin ?? 300,
        storePhone: (d.storePhone || '966501234567').replace(/^\+/, '').replace(/^0/, '966')
      }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/coupons')
      .then(r => r.json())
      .then((list: { code: string; discount: number; active: boolean }[]) => {
        const map: Record<string, number> = {};
        list.filter(c => c.active).forEach(c => { map[c.code] = c.discount; });
        setAvailableCoupons(map);
      })
      .catch(() => {});
  }, []);

  const detectLocation = () => {
    setLocLoading(true);
    setLocError("");
    if (!navigator.geolocation) { setLocError("المتصفح لا يدعم تحديد الموقع"); setLocLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setSelectedLocation({ lat, lng });
        setShowMap(true);
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ar`);
          const d = await r.json();
          if (d.display_name) setDeliveryAddress(d.display_name);
        } catch {}
        setLocLoading(false);
      },
      (err) => {
        setLocError(err.code === 1 ? "يرجى السماح بالوصول للموقع" : "تعذر تحديد الموقع");
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const applyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (availableCoupons[code]) {
      setCouponDiscount(availableCoupons[code]);
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("كود الخصم غير صحيح");
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  useEffect(() => {
    const loadCartOrProduct = async () => {
      const productId = searchParams.get('product');
      const qty = parseInt(searchParams.get('qty') || '1');
      const msg = searchParams.get('msg') || '';

      if (productId) {
        // أولاً: البحث في المنتجات المحلية
        const localFound = localProducts.find((p) => p.id === productId);
        if (localFound) {
          setCartItems([{
            _id: localFound.id,
            name: localFound.name,
            price: localFound.price,
            image: localFound.image,
            quantity: qty,
            giftMessage: msg
          }]);
          setLoading(false);
          return;
        }
        
        // ثانياً: البحث في API
        try {
          const res = await fetch('/api/products');
          if (res.ok) {
            const products = await res.json();
            const found = products.find((p: Product) => p._id === productId || p.id === productId);
            if (found) {
              setCartItems([{
                _id: found._id || found.id,
                name: found.name,
                price: found.price,
                image: found.image,
                quantity: qty,
                giftMessage: msg
              }]);
            }
          }
        } catch (error) {
          console.error('Error loading product:', error);
        }
      } else {
        // من السلة
        import('@/lib/userStorage').then(({ getUD }) => {
          const savedCart = getUD<typeof cartItems>('jenanflo_cart', []);
          setCartItems(savedCart);
        });
      }
      setLoading(false);
    };

    loadCartOrProduct();
  }, [searchParams]);

  // حساب الإضافات
  const extrasTotal = selectedExtras.reduce((sum, extraId) => {
    const extra = availableExtras.find(e => e.id === extraId);
    return sum + (extra?.price || 0);
  }, 0);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isFreeDelivery = totalPrice >= storeSettings.freeDeliveryMin;
  const deliveryFee = isFreeDelivery ? 0 : storeSettings.deliveryFee;
  const discountAmount = couponApplied ? Math.round(totalPrice * couponDiscount / 100) : 0;
  const finalTotal = totalPrice + deliveryFee + extrasTotal - discountAmount;

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraId) 
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  const handleSubmitOrder = async () => {
    if (!customerName || !customerPhone || !deliveryAddress) {
      alert('الرجاء تعبئة جميع الحقول المطلوبة');
      return;
    }

    // التحقق من صحة رقم الجوال السعودي
    const saudiPhoneRegex = /^05\d{8}$/;
    if (!saudiPhoneRegex.test(customerPhone)) {
      setPhoneError('رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام');
      return;
    }

    if (deliveryToOther && (!recipientName || !recipientPhone)) {
      alert('الرجاء إدخال بيانات المستلم');
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        customer: {
          name: customerName,
          phone: customerPhone,
        },
        recipient: deliveryToOther ? {
          name: recipientName,
          phone: recipientPhone,
        } : null,
        items: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          giftMessage: item.giftMessage
        })),
        extras: selectedExtras.map(id => availableExtras.find(e => e.id === id)),
        deliveryAddress,
        deliveryLocation: selectedLocation,
        deliveryNotes,
        scheduledDate,
        scheduledTime,
        isSecretGift,
        secretMessage: isSecretGift ? secretMessage : null,
        paymentMethod,
        subtotal: totalPrice,
        extrasTotal,
        deliveryFee,
        discountCode: couponApplied ? couponCode.toUpperCase() : null,
        discountAmount,
        total: finalTotal,
        status: 'جديد'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const result = await res.json();
        // مسح السلة
        import('@/lib/userStorage').then(({ removeUD }) => removeUD('jenanflo_cart'));
        window.dispatchEvent(new Event('cart-updated'));
        setCreatedOrderNumber(result.orderNumber || result._id || '');
        setOrderSuccess(true);
      } else {
        alert('حدث خطأ أثناء إرسال الطلب');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('حدث خطأ أثناء إرسال الطلب');
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 100%)" }}>
        <div className="animate-pulse text-center">
          <div className="text-4xl mb-4">📦</div>
          <p style={{ color: "#C9A96E" }}>جاري التحميل...</p>
        </div>
      </main>
    );
  }

  if (orderSuccess) {
    const waMsg = encodeURIComponent(`مرحباً 🌸\nتم تأكيد طلبي رقم ${createdOrderNumber}\nأرجو التواصل معي لتأكيد موعد التوصيل`);
    return (
      <main className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 100%)" }}>
        <div className="text-center max-w-md w-full">
          <div className="text-8xl mb-6 animate-bounce">🌸</div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#C9A96E" }}>تم استلام طلبك!</h1>
          {createdOrderNumber && (
            <div className="mb-4 px-6 py-3 rounded-2xl inline-block" style={{ background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.4)" }}>
              <span className="text-sm" style={{ color: "#9AACAC" }}>رقم طلبك: </span>
              <span className="text-xl font-mono font-bold" style={{ color: "#C9A96E" }}>{createdOrderNumber}</span>
            </div>
          )}
          <p className="text-base mb-8" style={{ color: "#9AACAC" }}>
            شكراً لك! سنتواصل معك قريباً لتأكيد الطلب وموعد التوصيل 🚚
          </p>
          <div className="flex flex-col gap-3">
            <a
              href={`https://wa.me/${storeSettings.storePhone}?text=${waMsg}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-bold transition hover:scale-105"
              style={{ background: "#25D366", color: "#fff" }}
            >
              <span>💬</span> تواصل عبر واتساب
            </a>
            <Link
              href={`/track?order=${createdOrderNumber}`}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-bold transition hover:scale-105"
              style={{ background: "rgba(74,155,160,0.2)", border: "1px solid #4A9BA0", color: "#4A9BA0" }}
            >
              📦 تتبع الطلب
            </Link>
            <Link
              href="/"
              className="text-sm mt-2 transition hover:underline"
              style={{ color: "#9AACAC" }}
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 100%)" }}>
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold mb-4" style={{ color: "#C9A96E" }}>لا توجد منتجات</h1>
        <Link
          href="/"
          className="px-8 py-4 rounded-full font-bold"
          style={{ background: "#4A9BA0", color: "#fff" }}
        >
          تصفح المنتجات
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 100%)" }}>
      {/* Header */}
      <header className="w-full flex justify-between items-center py-4 mb-8 max-w-5xl mx-auto" style={{ borderBottom: "1px solid rgba(74, 155, 160, 0.3)" }}>
        <Link href="/" className="text-2xl font-bold" style={{ color: "#C9A96E" }}>جنان فلو</Link>
        <Link href="/cart" className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(74, 155, 160, 0.2)", color: "#4A9BA0" }}>
          <span>🛒</span>
          <span>السلة</span>
        </Link>
      </header>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: "#C9A96E" }}>
          📦 إتمام الطلب
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* نموذج البيانات */}
          <div className="space-y-6">
            <div className="rounded-2xl p-6" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: "#C9A96E" }}>👤 بيانات العميل</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm" style={{ color: "#9AACAC" }}>الاسم الكامل *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-3 rounded-xl"
                    placeholder="أدخل اسمك"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201, 169, 110, 0.3)", color: "#fff" }}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm" style={{ color: "#9AACAC" }}>رقم الجوال *</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => { setCustomerPhone(e.target.value); setPhoneError(""); }}
                    className="w-full p-3 rounded-xl"
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                    maxLength={10}
                    style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${phoneError ? '#ff6b6b' : 'rgba(201, 169, 110, 0.3)'}`, color: "#fff" }}
                  />
                  {phoneError && <p className="text-xs mt-1" style={{ color: "#ff6b6b" }}>⚠️ {phoneError}</p>}
                </div>
              </div>
            </div>

            {/* خيار التوصيل لشخص آخر */}
            <div className="rounded-2xl p-6" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}>
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={deliveryToOther}
                  onChange={(e) => setDeliveryToOther(e.target.checked)}
                  className="w-5 h-5 accent-teal-500"
                />
                <span className="text-lg font-bold" style={{ color: "#C9A96E" }}>🎁 التوصيل لشخص آخر (هدية)</span>
              </label>
              
              {deliveryToOther && (
                <div className="space-y-4 mt-4 p-4 rounded-xl" style={{ background: "rgba(74, 155, 160, 0.1)", border: "1px solid rgba(74, 155, 160, 0.2)" }}>
                  <div>
                    <label className="block mb-2 text-sm" style={{ color: "#9AACAC" }}>اسم المستلم *</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full p-3 rounded-xl"
                      placeholder="اسم الشخص الذي سيستلم الهدية"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201, 169, 110, 0.3)", color: "#fff" }}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm" style={{ color: "#9AACAC" }}>رقم جوال المستلم *</label>
                    <input
                      type="tel"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="w-full p-3 rounded-xl"
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201, 169, 110, 0.3)", color: "#fff" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* الهدية السرية */}
            <div className="rounded-2xl p-6" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}>
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={isSecretGift}
                  onChange={(e) => setIsSecretGift(e.target.checked)}
                  className="w-5 h-5 accent-teal-500"
                />
                <span className="text-lg font-bold" style={{ color: "#C9A96E" }}>🤫 هدية سرية</span>
              </label>
              <p className="text-sm mb-4" style={{ color: "#8B9A9A" }}>لن نذكر اسمك للمستلم وسنخفي السعر من الفاتورة</p>
              
              {isSecretGift && (
                <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(201, 169, 110, 0.1)", border: "1px solid rgba(201, 169, 110, 0.2)" }}>
                  <label className="block mb-2 text-sm" style={{ color: "#9AACAC" }}>رسالة سرية للمستلم (اختياري)</label>
                  <textarea
                    value={secretMessage}
                    onChange={(e) => setSecretMessage(e.target.value)}
                    className="w-full p-3 rounded-xl resize-none"
                    rows={2}
                    placeholder="ستُكتشف الرسالة عند فتح الهدية..."
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201, 169, 110, 0.3)", color: "#fff" }}
                  />
                </div>
              )}
            </div>

            {/* الإضافات المميزة */}
            <div className="rounded-2xl p-6" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}>
              <h2 className="text-xl font-bold mb-2" style={{ color: "#C9A96E" }}>✨ إضافات مميزة</h2>
              <p className="text-sm mb-4" style={{ color: "#8B9A9A" }}>اجعل هديتك أكثر تميزاً</p>
              
              <div className="grid grid-cols-2 gap-3">
                {availableExtras.map((extra) => (
                  <label
                    key={extra.id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${selectedExtras.includes(extra.id) ? 'scale-105' : 'hover:scale-102'}`}
                    style={{ 
                      background: selectedExtras.includes(extra.id) ? "rgba(74, 155, 160, 0.3)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${selectedExtras.includes(extra.id) ? "#4A9BA0" : "rgba(201, 169, 110, 0.2)"}` 
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedExtras.includes(extra.id)}
                      onChange={() => toggleExtra(extra.id)}
                      className="w-4 h-4 accent-teal-500"
                    />
                    <div className="flex-1">
                      <span className="text-xl">{extra.emoji}</span>
                      <span className="text-sm mr-2" style={{ color: "#fff" }}>{extra.name}</span>
                      <span className="text-xs font-bold" style={{ color: "#D4AF37" }}>+{extra.price} ر.س</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: "#C9A96E" }}>📍 عنوان التوصيل</h2>
              
              <div className="space-y-4">
                {/* زر GPS */}
                {!selectedLocation && (
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={locLoading}
                    className="w-full py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ background: "rgba(74, 155, 160, 0.15)", border: "1px solid rgba(74,155,160,0.5)", color: "#4A9BA0" }}
                  >
                    {locLoading ? "⏳ جاري تحديد موقعك..." : "📍 حدد موقعك تلقائياً (GPS)"}
                  </button>
                )}
                {selectedLocation && (
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: "rgba(74,155,160,0.15)", border: "1px solid #4A9BA0" }}>
                    <span style={{ color: "#4A9BA0" }}>✅ تم تحديد الموقع</span>
                    <button type="button" onClick={() => { setSelectedLocation(null); setShowMap(false); }} className="text-xs" style={{ color: "#9AACAC" }}>تغيير</button>
                  </div>
                )}
                {locError && <p className="text-xs" style={{ color: "#ff6b6b" }}>{locError}</p>}

                {showMap && selectedLocation && (
                  <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(74, 155, 160, 0.3)" }}>
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedLocation.lng - 0.01},${selectedLocation.lat - 0.01},${selectedLocation.lng + 0.01},${selectedLocation.lat + 0.01}&layer=mapnik&marker=${selectedLocation.lat},${selectedLocation.lng}`}
                      className="w-full h-64"
                      style={{ border: 0 }}
                      loading="lazy"
                    />
                    <div className="p-3 text-sm" style={{ background: "rgba(74, 155, 160, 0.1)", color: "#4A9BA0" }}>
                      📍 الموقع: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                    </div>
                  </div>
                )}

                {/* عناوين محفوظة من حسابي */}
                {savedAddresses.length > 0 && (
                  <div>
                    <p className="text-sm mb-2" style={{ color: "#9AACAC" }}>📂 عناوينك المحفوظة</p>
                    <div className="space-y-2">
                      {savedAddresses.map(addr => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => {
                            setSelectedSavedAddr(addr.id);
                            setDeliveryAddress(addr.address);
                            if (addr.lat && addr.lng) {
                              setSelectedLocation({ lat: addr.lat, lng: addr.lng });
                              setShowMap(true);
                            }
                          }}
                          className="w-full text-right p-3 rounded-xl transition-all hover:scale-[1.01]"
                          style={{
                            background: selectedSavedAddr === addr.id ? "rgba(74,155,160,0.2)" : "rgba(255,255,255,0.04)",
                            border: `1px solid ${selectedSavedAddr === addr.id ? "#4A9BA0" : "rgba(201,169,110,0.2)"}`,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>{selectedSavedAddr === addr.id ? "✅" : "📍"}</span>
                              <span className="font-bold text-sm" style={{ color: selectedSavedAddr === addr.id ? "#4A9BA0" : "#C9A96E" }}>
                                {addr.label}
                              </span>
                              {addr.isDefault && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "rgba(74,155,160,0.2)", color: "#4A9BA0" }}>افتراضي</span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs mt-1 truncate" style={{ color: "#8B9A9A" }}>{addr.address}</p>
                          {addr.nationalAddress && (
                            <p className="text-xs font-mono" style={{ color: "#C9A96E" }}>🇸🇦 {addr.nationalAddress}</p>
                          )}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => { setSelectedSavedAddr(null); setDeliveryAddress(""); }}
                        className="w-full py-2 rounded-xl text-sm transition"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)", color: "#9AACAC" }}
                      >
                        + إدخال عنوان جديد يدوياً
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block mb-2 text-sm" style={{ color: "#9AACAC" }}>العنوان بالتفصيل *</label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => { setDeliveryAddress(e.target.value); setSelectedSavedAddr(null); }}
                    className="w-full p-3 rounded-xl resize-none"
                    rows={3}
                    placeholder="المدينة، الحي، الشارع، رقم المبنى..."
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201, 169, 110, 0.3)", color: "#fff" }}
                  />
                </div>

                {/* جدولة التوصيل */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm" style={{ color: "#9AACAC" }}>📅 تاريخ التوصيل</label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201, 169, 110, 0.3)", color: "#fff" }}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm" style={{ color: "#9AACAC" }}>⏰ وقت التوصيل</label>
                    <select
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full p-3 rounded-xl"
                      style={{ background: "rgba(45, 52, 54, 0.9)", border: "1px solid rgba(201, 169, 110, 0.3)", color: "#fff" }}
                    >
                      <option value="">اختر الوقت</option>
                      <option value="morning">صباحاً (9-12)</option>
                      <option value="afternoon">ظهراً (12-4)</option>
                      <option value="evening">مساءً (4-8)</option>
                      <option value="night">ليلاً (8-11)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm" style={{ color: "#9AACAC" }}>ملاحظات إضافية</label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full p-3 rounded-xl"
                    placeholder="مثال: الدور الثاني، شقة 5"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201, 169, 110, 0.3)", color: "#fff" }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: "#C9A96E" }}>💳 طريقة الدفع</h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition" style={{ background: paymentMethod === 'cod' ? "rgba(74, 155, 160, 0.2)" : "transparent", border: "1px solid " + (paymentMethod === 'cod' ? "#4A9BA0" : "rgba(201, 169, 110, 0.2)") }}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-teal-500"
                  />
                  <span style={{ color: "#fff" }}>💵 الدفع عند الاستلام</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition" style={{ background: paymentMethod === 'mada' ? "rgba(74, 155, 160, 0.2)" : "transparent", border: "1px solid " + (paymentMethod === 'mada' ? "#4A9BA0" : "rgba(201, 169, 110, 0.2)") }}>
                  <input
                    type="radio"
                    name="payment"
                    value="mada"
                    checked={paymentMethod === 'mada'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-teal-500"
                  />
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#fff" }}>💳 مدى / فيزا</span>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#1A4D9A", color: "#fff" }}>mada</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition" style={{ background: paymentMethod === 'tabby' ? "rgba(74, 155, 160, 0.2)" : "transparent", border: "1px solid " + (paymentMethod === 'tabby' ? "#4A9BA0" : "rgba(201, 169, 110, 0.2)") }}>
                  <input
                    type="radio"
                    name="payment"
                    value="tabby"
                    checked={paymentMethod === 'tabby'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-teal-500"
                  />
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#fff" }}>🛍️ تابي - قسّمها على 4</span>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#3BFAAB", color: "#000" }}>Tabby</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition" style={{ background: paymentMethod === 'tamara' ? "rgba(74, 155, 160, 0.2)" : "transparent", border: "1px solid " + (paymentMethod === 'tamara' ? "#4A9BA0" : "rgba(201, 169, 110, 0.2)") }}>
                  <input
                    type="radio"
                    name="payment"
                    value="tamara"
                    checked={paymentMethod === 'tamara'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-teal-500"
                  />
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#fff" }}>💰 تمارا - اشترِ الآن وادفع لاحقاً</span>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#FF6B35", color: "#fff" }}>Tamara</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition" style={{ background: paymentMethod === 'transfer' ? "rgba(74, 155, 160, 0.2)" : "transparent", border: "1px solid " + (paymentMethod === 'transfer' ? "#4A9BA0" : "rgba(201, 169, 110, 0.2)") }}>
                  <input
                    type="radio"
                    name="payment"
                    value="transfer"
                    checked={paymentMethod === 'transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-teal-500"
                  />
                  <span style={{ color: "#fff" }}>🏦 تحويل بنكي</span>
                </label>
              </div>

              {/* ملاحظة تابي/تمارا */}
              {(paymentMethod === 'tabby' || paymentMethod === 'tamara') && (
                <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: "rgba(59, 250, 171, 0.1)", border: "1px solid rgba(59, 250, 171, 0.3)" }}>
                  <p style={{ color: "#9AACAC" }}>
                    {paymentMethod === 'tabby' 
                      ? '✨ قسّم مبلغ الطلب على 4 دفعات بدون فوائد. ستتم إعادة توجيهك لتابي لإتمام الدفع.'
                      : '✨ اشترِ الآن وادفع خلال 30 يوم أو قسّمها على 3 دفعات. ستتم إعادة توجيهك لتمارا.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ملخص الطلب */}
          <div>
            <div className="rounded-2xl p-6 sticky top-6" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: "#C9A96E" }}>🧾 ملخص الطلب</h2>

              {/* المنتجات */}
              <div className="space-y-4 mb-4 pb-4" style={{ borderBottom: "1px solid rgba(201, 169, 110, 0.2)" }}>
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      style={{ border: "1px solid rgba(201, 169, 110, 0.3)" }}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold" style={{ color: "#fff" }}>{item.name}</h3>
                      <p className="text-sm" style={{ color: "#9AACAC" }}>الكمية: {item.quantity}</p>
                      {item.giftMessage && (
                        <p className="text-xs mt-1" style={{ color: "#4A9BA0" }}>💌 {item.giftMessage}</p>
                      )}
                    </div>
                    <span className="font-bold" style={{ color: "#D4AF37" }}>{item.price * item.quantity} ر.س</span>
                  </div>
                ))}
              </div>

              {/* الإضافات المختارة */}
              {selectedExtras.length > 0 && (
                <div className="mb-4 pb-4" style={{ borderBottom: "1px solid rgba(201, 169, 110, 0.2)" }}>
                  <h3 className="text-sm font-bold mb-2" style={{ color: "#C9A96E" }}>✨ الإضافات</h3>
                  {selectedExtras.map(extraId => {
                    const extra = availableExtras.find(e => e.id === extraId);
                    return extra && (
                      <div key={extraId} className="flex justify-between text-sm py-1">
                        <span style={{ color: "#9AACAC" }}>{extra.emoji} {extra.name}</span>
                        <span style={{ color: "#D4AF37" }}>+{extra.price} ر.س</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* المزايا المختارة */}
              {(deliveryToOther || isSecretGift || scheduledDate) && (
                <div className="mb-4 pb-4" style={{ borderBottom: "1px solid rgba(74, 155, 160, 0.2)" }}>
                  <h3 className="text-sm font-bold mb-2" style={{ color: "#4A9BA0" }}>🎯 الخدمات</h3>
                  {deliveryToOther && (
                    <p className="text-sm py-1" style={{ color: "#9AACAC" }}>🎁 توصيل لشخص آخر: {recipientName}</p>
                  )}
                  {isSecretGift && (
                    <p className="text-sm py-1" style={{ color: "#9AACAC" }}>🤫 هدية سرية</p>
                  )}
                  {scheduledDate && (
                    <p className="text-sm py-1" style={{ color: "#9AACAC" }}>📅 موعد التوصيل: {scheduledDate} {scheduledTime && `(${scheduledTime === 'morning' ? 'صباحاً' : scheduledTime === 'afternoon' ? 'ظهراً' : scheduledTime === 'evening' ? 'مساءً' : 'ليلاً'})`}</p>
                  )}
                </div>
              )}

              {/* الحساب */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span style={{ color: "#9AACAC" }}>المجموع الفرعي</span>
                  <span style={{ color: "#fff" }}>{totalPrice} ر.س</span>
                </div>
                {extrasTotal > 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: "#9AACAC" }}>الإضافات</span>
                    <span style={{ color: "#D4AF37" }}>+{extrasTotal} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span style={{ color: "#9AACAC" }}>التوصيل</span>
                  {isFreeDelivery ? (
                    <span style={{ color: "#4A9BA0" }}>مجاني 🎉</span>
                  ) : (
                    <span style={{ color: "#4A9BA0" }}>{deliveryFee} ر.س</span>
                  )}
                </div>

                {/* حقل كود الخصم */}
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(201, 169, 110, 0.15)" }}>
                  <p className="text-sm font-medium mb-2" style={{ color: "#C9A96E" }}>🎟️ كود الخصم</p>
                  {couponApplied ? (
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: "rgba(74, 155, 160, 0.15)", border: "1px solid #4A9BA0" }}>
                      <span style={{ color: "#4A9BA0" }}>✅ خصم {couponDiscount}% مطبّق ({couponCode.toUpperCase()})</span>
                      <button onClick={() => { setCouponApplied(false); setCouponDiscount(0); setCouponCode(""); }} className="text-xs" style={{ color: "#9AACAC" }}>إلغاء</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="أدخل كود الخصم"
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                          onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                          className="flex-1 px-3 py-2 rounded-xl text-sm text-right outline-none"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.3)", color: "#fff" }}
                        />
                        <button
                          onClick={applyCoupon}
                          className="px-4 py-2 rounded-xl text-sm font-bold"
                          style={{ background: "linear-gradient(135deg, #C9A96E, #D4AF37)", color: "#1E2A2A" }}
                        >
                          تطبيق
                        </button>
                      </div>
                      {couponError && <p className="text-xs mt-1" style={{ color: "#ff6b6b" }}>{couponError}</p>}
                    </>
                  )}
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: "#9AACAC" }}>الخصم ({couponDiscount}%)</span>
                    <span style={{ color: "#4A9BA0" }}>- {discountAmount} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between pt-3" style={{ borderTop: "1px solid rgba(201, 169, 110, 0.2)" }}>
                  <span className="text-xl font-bold" style={{ color: "#C9A96E" }}>الإجمالي</span>
                  <span className="text-2xl font-bold" style={{ color: "#D4AF37" }}>{finalTotal} ر.س</span>
                </div>
              </div>

              {/* زر الطلب */}
              <button
                onClick={handleSubmitOrder}
                disabled={submitting}
                className="w-full py-4 rounded-full text-lg font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}
              >
                {submitting ? "جاري الإرسال..." : "✅ تأكيد الطلب"}
              </button>

              <p className="text-center text-sm mt-4" style={{ color: "#9AACAC" }}>
                بالضغط على تأكيد الطلب، أنت توافق على سياسة المتجر
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 100%)" }}>
        <div className="text-center">
          <div className="text-4xl mb-4">🌸</div>
          <p style={{ color: "#C9A96E" }}>جاري التحميل...</p>
        </div>
      </main>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
