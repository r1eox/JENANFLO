'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUD, setUD, dispatchUserChanged } from "@/lib/userStorage";

type User = { name: string; email: string; phone?: string; role: string };
type Order = {
  _id: string; orderNumber: string; status: string; total: number;
  items: { name: string; quantity: number; price: number }[];
  createdAt: string; deliveryDate?: string;
};
type Address = { id: string; label: string; address: string; nationalAddress?: string; lat?: number; lng?: number; isDefault: boolean };
type WishItem = { id: string; name: string; price: number; image: string };
type Coupon = { _id: string; code: string; discount: number; active: boolean };

const STATUS_COLOR: Record<string, string> = {
  "جديد": "bg-blue-500", "قيد المراجعة": "bg-indigo-500",
  "جاري التحضير": "bg-yellow-500", "جاري التوصيل": "bg-purple-500",
  "تم التسليم": "bg-green-500", "ملغي": "bg-red-500",
};

export default function AccountPage() {
  const router   = useRouter();
  const [user, setUser]       = useState<User | null>(null);
  const [tab, setTab]         = useState<'orders' | 'addresses' | 'wishlist' | 'coupons'>('orders');
  const [orders, setOrders]   = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlist, setWishlist]   = useState<WishItem[]>([]);
  const [coupons, setCoupons]     = useState<Coupon[]>([]);
  const [loading, setLoading]     = useState(false);
  const [phoneInput, setPhoneInput]   = useState("");
  const [phoneSaving, setPhoneSaving] = useState(false);
  const [newAddress, setNewAddress]       = useState("");
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [newNationalAddr, setNewNationalAddr] = useState("");
  const [newLat, setNewLat]               = useState<number | null>(null);
  const [newLng, setNewLng]               = useState<number | null>(null);
  const [showAddAddr, setShowAddAddr]     = useState(false);
  const [showAddrMap, setShowAddrMap]     = useState(false);
  const [locLoading, setLocLoading]       = useState(false);
  const [locError, setLocError]           = useState("");
  const [copied, setCopied]   = useState<string | null>(null);

  // تحميل بيانات المستخدم
  useEffect(() => {
    const stored = localStorage.getItem("jenanflo_user");
    if (!stored) { router.replace("/auth/login"); return; }
    const u: User = JSON.parse(stored);
    setUser(u);

    // تحميل العناوين والمفضلة من localStorage (خاص بهذا المستخدم)
    setAddresses(getUD("jenanflo_addresses", []));
    setWishlist(getUD("jenanflo_wishlist", []));
  }, []);

  // تحميل الطلبات
  useEffect(() => {
    if (!user) return;
    if (tab !== 'orders') return;
    if (!user.phone) return; // لا تجلب لو ما في جوال
    setLoading(true);
    fetch(`/api/orders?phone=${encodeURIComponent(user.phone)}`)
      .then(r => r.json())
      .then(d => setOrders(Array.isArray(d) ? d : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user, tab]);

  const savePhone = async () => {
    const ph = phoneInput.trim();
    if (!ph || !/^05\d{8}$/.test(ph)) return;
    setPhoneSaving(true);
    // حفظ في localStorage
    const updated = { ...user!, phone: ph };
    localStorage.setItem('jenanflo_user', JSON.stringify(updated));
    setUser(updated);
    // حفظ في data/users.json عبر API
    try {
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user!.email, phone: ph }),
      });
    } catch {}
    setPhoneInput('');
    setPhoneSaving(false);
  };

  // تحميل الكوبونات
  useEffect(() => {
    if (tab !== 'coupons') return;
    fetch('/api/coupons')
      .then(r => r.json())
      .then(d => setCoupons(Array.isArray(d) ? d.filter((c: Coupon) => c.active) : []))
      .catch(() => setCoupons([]));
  }, [tab]);

  const logout = () => {
    localStorage.removeItem("jenanflo_user");
    document.cookie = "jenanflo_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    dispatchUserChanged(); // تحديث أيقونة السلة وإعادة ضبط الحالة
    router.replace("/");
  };

  const saveAddresses = (list: Address[]) => {
    setAddresses(list);
    setUD("jenanflo_addresses", list);
  };

  const detectLocation = () => {
    setLocLoading(true);
    setLocError("");
    if (!navigator.geolocation) {
      setLocError("المتصفح لا يدعم تحديد الموقع");
      setLocLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setNewLat(lat);
        setNewLng(lng);
        setShowAddrMap(true);
        // Reverse geocode via Nominatim
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ar`);
          const d = await r.json();
          if (d.display_name) setNewAddress(d.display_name);
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

  const addAddress = () => {
    if (!newAddress.trim()) return;
    const list = [...addresses, {
      id: `addr${Date.now()}`,
      label: newAddressLabel || "عنوان جديد",
      address: newAddress.trim(),
      nationalAddress: newNationalAddr.trim() || undefined,
      lat: newLat ?? undefined,
      lng: newLng ?? undefined,
      isDefault: addresses.length === 0,
    }];
    saveAddresses(list);
    setNewAddress(""); setNewAddressLabel(""); setNewNationalAddr("");
    setNewLat(null); setNewLng(null); setShowAddrMap(false);
    setShowAddAddr(false);
  };

  const deleteAddress = (id: string) => {
    saveAddresses(addresses.filter(a => a.id !== id));
  };

  const setDefault = (id: string) => {
    saveAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const removeWishItem = (id: string) => {
    const list = wishlist.filter(w => w.id !== id);
    setWishlist(list);
    setUD("jenanflo_wishlist", list);
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(code);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  if (!user) return null;

  const tabs = [
    { key: 'orders',    label: 'طلباتي',    icon: '📦' },
    { key: 'addresses', label: 'عناويني',   icon: '📍' },
    { key: 'wishlist',  label: 'مفضلتي',    icon: '💛' },
    { key: 'coupons',   label: 'العروض',    icon: '🎟️' },
  ] as const;

  return (
    <main className="min-h-screen p-4 md:p-8" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 100%)" }}>
      {/* Header */}
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-8 pb-4" style={{ borderBottom: "1px solid rgba(74,155,160,0.3)" }}>
        <Link href="/" className="text-2xl font-bold" style={{ color: "#C9A96E" }}>جنان فلو</Link>
        <div className="flex gap-3 items-center">
          <Link href="/cart" style={{ color: "#4A9BA0" }}>🛒</Link>
          <button
            onClick={logout}
            className="text-sm px-4 py-2 rounded-full transition hover:scale-105"
            style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            تسجيل خروج
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Welcome Card */}
        <div
          className="rounded-2xl p-6 mb-6 flex items-center gap-5"
          style={{ background: "linear-gradient(135deg, rgba(201,169,110,0.15), rgba(74,155,160,0.1))", border: "1px solid rgba(201,169,110,0.25)" }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold" style={{ background: "linear-gradient(135deg, #C9A96E, #D4AF37)" }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#C9A96E" }}>مرحباً، {user.name} 👋</h1>
            <p className="text-sm" style={{ color: "#8B9A9A" }}>{user.email}</p>
            {user.phone
              ? <p className="text-sm" style={{ color: "#4A9BA0" }}>📱 {user.phone}</p>
              : <button onClick={() => setTab('orders')} className="text-xs mt-1 px-3 py-1 rounded-full" style={{ background: "rgba(201,169,110,0.15)", color: "#C9A96E", border: "1px solid rgba(201,169,110,0.3)" }}>
                  + أضف رقم الجوال
                </button>
            }
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all"
              style={{
                background: tab === t.key ? "linear-gradient(135deg, #4A9BA0, #2D8B8B)" : "rgba(255,255,255,0.05)",
                color: tab === t.key ? "#fff" : "#9AACAC",
                border: tab === t.key ? "none" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* ── طلباتي ── */}
        {tab === 'orders' && (
          <div className="space-y-4">
            {/* لو ما في جوال محفوظ */}
            {!user.phone && (
              <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, rgba(201,169,110,0.12), rgba(74,155,160,0.08))", border: "1px solid rgba(201,169,110,0.35)" }}>
                <p className="font-bold mb-1" style={{ color: "#C9A96E" }}>📱 أضف رقم جوالك لعرض طلباتك</p>
                <p className="text-sm mb-4" style={{ color: "#8B9A9A" }}>رقم الجوال هو المفتاح لربط طلباتك بحسابك</p>
                <div className="flex gap-3">
                  <input
                    type="tel" dir="ltr" maxLength={10}
                    placeholder="05xxxxxxxx"
                    value={phoneInput} onChange={e => setPhoneInput(e.target.value)}
                    className="flex-1 p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(201,169,110,0.4)", color: "#fff" }}
                    onKeyDown={e => e.key === 'Enter' && savePhone()}
                  />
                  <button
                    onClick={savePhone} disabled={phoneSaving || !/^05\d{8}$/.test(phoneInput.trim())}
                    className="px-6 py-3 rounded-xl font-bold transition hover:scale-105 disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}
                  >
                    حفظ
                  </button>
                </div>
                {phoneInput && !/^05\d{8}$/.test(phoneInput.trim()) && (
                  <p className="text-xs mt-2" style={{ color: "#f87171" }}>⚠️ الجوال يبدأ بـ 05 ويتكون من 10 أرقام</p>
                )}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 text-gray-400">جاري التحميل...</div>
            ) : !user.phone ? null : orders.length === 0 ? (
              <div className="text-center py-16 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-5xl mb-4">📦</div>
                <p className="text-lg font-bold mb-2" style={{ color: "#C9A96E" }}>لا توجد طلبات بعد</p>
                <p className="mb-6" style={{ color: "#8B9A9A" }}>ما وجدنا طلبات مرتبطة بالجوال {user.phone}</p>
                <Link
                  href="/"
                  className="px-6 py-3 rounded-full font-bold transition hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}
                >
                  تصفح المنتجات
                </Link>
              </div>
            ) : (
              orders.map(order => (
                <div
                  key={order._id}
                  className="rounded-2xl p-5"
                  style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201,169,110,0.15)" }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-mono font-bold text-lg" style={{ color: "#C9A96E" }}>{order.orderNumber}</span>
                      <span className={`mr-3 px-2 py-1 rounded-full text-xs text-white ${STATUS_COLOR[order.status] || 'bg-gray-500'}`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="font-bold text-xl" style={{ color: "#D4AF37" }}>{order.total} ر.س</span>
                  </div>
                  <div className="text-sm mb-3" style={{ color: "#8B9A9A" }}>
                    {order.items.map(i => `${i.name} × ${i.quantity}`).join(' • ')}
                  </div>
                  <div className="flex justify-between items-center text-xs" style={{ color: "#525F5F" }}>
                    <span>📅 {new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
                    <Link
                      href={`/track?order=${order.orderNumber}`}
                      className="text-sm font-medium hover:underline"
                      style={{ color: "#4A9BA0" }}
                    >
                      تتبع الطلب →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── عناويني ── */}
        {tab === 'addresses' && (
          <div className="space-y-4">
            {addresses.map(addr => (
              <div key={addr.id} className="rounded-2xl p-5 flex gap-4 items-start" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: `1px solid ${addr.isDefault ? 'rgba(74,155,160,0.4)' : 'rgba(201,169,110,0.15)'}` }}>
                <div className="text-2xl mt-1">📍</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold" style={{ color: "#C9A96E" }}>{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(74,155,160,0.2)", color: "#4A9BA0" }}>
                        افتراضي
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-1" style={{ color: "#fff" }}>{addr.address}</p>
                  {addr.nationalAddress && (
                    <p className="text-xs font-mono" style={{ color: "#C9A96E" }}>
                      🇸🇦 {addr.nationalAddress}
                    </p>
                  )}
                  {addr.lat && addr.lng && (
                    <a
                      href={`https://www.google.com/maps?q=${addr.lat},${addr.lng}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-xs hover:underline"
                      style={{ color: "#4A9BA0" }}
                    >
                      🗺️ عرض على الخريطة
                    </a>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {!addr.isDefault && (
                    <button onClick={() => setDefault(addr.id)} className="text-xs px-3 py-1 rounded-full transition hover:scale-105" style={{ background: "rgba(74,155,160,0.15)", color: "#4A9BA0" }}>
                      تعيين افتراضي
                    </button>
                  )}
                  <button onClick={() => deleteAddress(addr.id)} className="text-xs px-3 py-1 rounded-full transition hover:scale-105" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
                    حذف
                  </button>
                </div>
              </div>
            ))}

            {!showAddAddr ? (
              <button
                onClick={() => setShowAddAddr(true)}
                className="w-full py-4 rounded-2xl font-bold transition hover:scale-105 flex items-center justify-center gap-2"
                style={{ background: "rgba(201,169,110,0.1)", border: "1px dashed rgba(201,169,110,0.4)", color: "#C9A96E" }}
              >
                + إضافة عنوان جديد
              </button>
            ) : (
              <div className="rounded-2xl p-6 space-y-4" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201,169,110,0.25)" }}>
                <h3 className="font-bold" style={{ color: "#C9A96E" }}>عنوان جديد</h3>

                {/* تسمية */}
                <input
                  type="text" placeholder="تسمية (مثال: البيت، العمل)"
                  value={newAddressLabel} onChange={e => setNewAddressLabel(e.target.value)}
                  className="w-full p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.3)", color: "#fff" }}
                />

                {/* زر تحديد الموقع */}
                <button
                  type="button" onClick={detectLocation} disabled={locLoading}
                  className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition hover:scale-105"
                  style={{ background: newLat ? "rgba(74,155,160,0.25)" : "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.4)", color: "#C9A96E" }}
                >
                  {locLoading ? (
                    <><span className="animate-spin">⌛</span> جاري تحديد الموقع...</>
                  ) : newLat ? (
                    <>✅ تم تحديد الموقع — اضغط للتغيير</>
                  ) : (
                    <>📍 استخدم موقعي الحالي (GPS)</>
                  )}
                </button>
                {locError && <p className="text-xs" style={{ color: "#f87171" }}>{locError}</p>}

                {/* معاينة الخريطة */}
                {showAddrMap && newLat && newLng && (
                  <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(74,155,160,0.3)" }}>
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${newLng-0.01},${newLat-0.01},${newLng+0.01},${newLat+0.01}&layer=mapnik&marker=${newLat},${newLng}`}
                      width="100%" height="220" loading="lazy"
                      style={{ border: 0, display: "block" }}
                    />
                    <div className="p-2 text-xs text-center" style={{ background: "rgba(74,155,160,0.1)", color: "#4A9BA0" }}>
                      📍 {newLat.toFixed(5)}, {newLng.toFixed(5)} &nbsp;—&nbsp;
                      <a href={`https://www.google.com/maps?q=${newLat},${newLng}`} target="_blank" rel="noopener noreferrer" className="underline">
                        افتح في غوغل مابس
                      </a>
                    </div>
                  </div>
                )}

                {/* العنوان التفصيلي */}
                <textarea
                  placeholder="المدينة، الحي، الشارع، رقم المبنى..."
                  value={newAddress} onChange={e => setNewAddress(e.target.value)}
                  rows={2} className="w-full p-3 rounded-xl resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.3)", color: "#fff" }}
                />

                {/* العنوان الوطني */}
                <div>
                  <label className="block text-sm mb-1" style={{ color: "#9AACAC" }}>
                    🇸🇦 العنوان الوطني (اختياري)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 3532 حي الملقا، الرياض 13521"
                    value={newNationalAddr} onChange={e => setNewNationalAddr(e.target.value)}
                    className="w-full p-3 rounded-xl font-mono"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.3)", color: "#C9A96E" }}
                  />
                  <p className="text-xs mt-1" style={{ color: "#525F5F" }}>
                    يمكن تجده عبر تطبيق البريد السعودي أو sp.com.sa
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={addAddress} className="flex-1 py-3 rounded-xl font-bold transition hover:scale-105" style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}>
                    حفظ
                  </button>
                  <button onClick={() => { setShowAddAddr(false); setNewLat(null); setNewLng(null); setShowAddrMap(false); setLocError(""); }} className="px-6 py-3 rounded-xl transition" style={{ background: "rgba(255,255,255,0.05)", color: "#9AACAC" }}>
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── مفضلتي ── */}
        {tab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div className="text-center py-16 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-5xl mb-4">💛</div>
                <p className="text-lg font-bold mb-2" style={{ color: "#C9A96E" }}>قائمة المفضلة فارغة</p>
                <p className="mb-6" style={{ color: "#8B9A9A" }}>اضغط على قلب أي منتج لحفظه هنا</p>
                <Link href="/" className="px-6 py-3 rounded-full font-bold transition hover:scale-105" style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}>
                  تصفح المنتجات
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlist.map(item => (
                  <div key={item.id} className="rounded-2xl overflow-hidden flex gap-4 p-4" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201,169,110,0.15)" }}>
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="font-bold mb-1" style={{ color: "#fff" }}>{item.name}</p>
                      <p className="font-bold mb-3" style={{ color: "#D4AF37" }}>{item.price} ر.س</p>
                      <div className="flex gap-2">
                        <Link
                          href={`/checkout?product=${item.id}`}
                          className="text-xs px-3 py-1.5 rounded-full font-bold transition hover:scale-105"
                          style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}
                        >
                          اطلب الآن
                        </Link>
                        <button onClick={() => removeWishItem(item.id)} className="text-xs px-3 py-1.5 rounded-full transition" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── العروض ── */}
        {tab === 'coupons' && (
          <div className="space-y-4">
            <p className="text-sm mb-2" style={{ color: "#8B9A9A" }}>الأكواد المتاحة حالياً — اضغط للنسخ</p>
            {coupons.length === 0 ? (
              <div className="text-center py-16 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-5xl mb-4">🎟️</div>
                <p style={{ color: "#8B9A9A" }}>لا توجد عروض متاحة حالياً</p>
              </div>
            ) : (
              coupons.map(coupon => (
                <button
                  key={coupon._id}
                  onClick={() => copyCoupon(coupon.code)}
                  className="w-full rounded-2xl p-5 text-right transition hover:scale-[1.01] flex items-center justify-between gap-4"
                  style={{
                    background: "linear-gradient(135deg, rgba(201,169,110,0.12), rgba(212,175,55,0.08))",
                    border: "1px dashed rgba(201,169,110,0.4)",
                  }}
                >
                  <div>
                    <div className="font-mono text-xl font-bold mb-1" style={{ color: "#D4AF37" }}>{coupon.code}</div>
                    <div className="text-sm" style={{ color: "#9AACAC" }}>خصم {coupon.discount}% على طلبك</div>
                  </div>
                  <div className="text-sm font-bold px-4 py-2 rounded-full" style={{ background: copied === coupon.code ? "rgba(74,155,160,0.3)" : "rgba(201,169,110,0.2)", color: copied === coupon.code ? "#4A9BA0" : "#C9A96E" }}>
                    {copied === coupon.code ? "✅ تم النسخ!" : "📋 انسخ"}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
