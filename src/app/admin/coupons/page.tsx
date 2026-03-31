'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";

type Coupon = {
  _id: string;
  code: string;
  discount: number;
  active: boolean;
  createdAt: string;
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/coupons');
    if (res.ok) setCoupons(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addCoupon = async () => {
    setError(""); setSuccess("");
    if (!newCode.trim() || !newDiscount) return setError("أدخل الكود ونسبة الخصم");
    const disc = Number(newDiscount);
    if (disc < 1 || disc > 100) return setError("نسبة الخصم يجب أن تكون بين 1 و 100");

    setSaving(true);
    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: newCode, discount: disc }),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess("تم إضافة الكود ✓");
      setNewCode(""); setNewDiscount("");
      load();
    } else {
      setError(data.error || "حدث خطأ");
    }
    setSaving(false);
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("هل تريد حذف هذا الكود؟")) return;
    await fetch(`/api/coupons?id=${id}`, { method: 'DELETE' });
    load();
  };

  const toggleActive = async (coupon: Coupon) => {
    await fetch('/api/coupons', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: coupon._id, active: !coupon.active }),
    });
    load();
  };

  return (
    <main className="min-h-screen p-6 md:p-10" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 100%)", color: "#fff" }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-sm px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.1)", color: "#9AACAC" }}>← لوحة التحكم</Link>
          <h1 className="text-2xl font-bold" style={{ color: "#C9A96E" }}>🎟️ أكواد الخصم</h1>
        </div>

        {/* إضافة كود جديد */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.2)" }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: "#D4AF37" }}>إضافة كود جديد</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="الكود (مثال: SAVE20)"
              value={newCode}
              onChange={e => setNewCode(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-3 rounded-xl outline-none text-right"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(201,169,110,0.3)", color: "#fff" }}
            />
            <input
              type="number"
              placeholder="نسبة الخصم %"
              value={newDiscount}
              onChange={e => setNewDiscount(e.target.value)}
              min={1} max={100}
              className="w-40 px-4 py-3 rounded-xl outline-none text-center"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(201,169,110,0.3)", color: "#fff" }}
            />
            <button
              onClick={addCoupon}
              disabled={saving}
              className="px-6 py-3 rounded-xl font-bold"
              style={{ background: "linear-gradient(135deg,#C9A96E,#D4AF37)", color: "#1E2A2A" }}
            >
              {saving ? "..." : "إضافة"}
            </button>
          </div>
          {error && <p className="mt-2 text-sm" style={{ color: "#ff6b6b" }}>{error}</p>}
          {success && <p className="mt-2 text-sm" style={{ color: "#4A9BA0" }}>{success}</p>}
        </div>

        {/* قائمة الأكواد */}
        {loading ? (
          <p className="text-center" style={{ color: "#9AACAC" }}>جاري التحميل...</p>
        ) : coupons.length === 0 ? (
          <p className="text-center" style={{ color: "#9AACAC" }}>لا توجد أكواد بعد</p>
        ) : (
          <div className="space-y-3">
            {coupons.map(coupon => (
              <div key={coupon._id} className="flex items-center justify-between px-5 py-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${coupon.active ? "rgba(74,155,160,0.4)" : "rgba(255,255,255,0.1)"}` }}>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg tracking-widest" style={{ color: coupon.active ? "#D4AF37" : "#666" }}>{coupon.code}</span>
                  <span className="text-sm px-3 py-1 rounded-full font-bold" style={{ background: "rgba(74,155,160,0.15)", color: "#4A9BA0" }}>خصم {coupon.discount}%</span>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: coupon.active ? "rgba(74,155,160,0.2)" : "rgba(255,100,100,0.15)", color: coupon.active ? "#4A9BA0" : "#ff6b6b" }}>
                    {coupon.active ? "مفعّل" : "معطّل"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleActive(coupon)} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: "rgba(255,255,255,0.08)", color: "#9AACAC" }}>
                    {coupon.active ? "تعطيل" : "تفعيل"}
                  </button>
                  <button onClick={() => deleteCoupon(coupon._id)} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: "rgba(255,100,100,0.15)", color: "#ff6b6b" }}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
