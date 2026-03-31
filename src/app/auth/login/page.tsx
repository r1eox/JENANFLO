'use client';
import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "حدث خطأ أثناء تسجيل الدخول");
      } else {
        // حفظ بيانات المستخدم
        localStorage.setItem("jenanflo_user", JSON.stringify(data.user));
        window.dispatchEvent(new Event('user-changed')); // تحديث السلة للمستخدم الجديد
        setSuccess(true);
        // توجيه مباشر بعد 500ms
        const targetUrl = data.user.role === "admin" ? "/admin" : "/account";
        setTimeout(() => {
          window.location.replace(targetUrl);
        }, 500);
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 100%)" }}>
        <div className="text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#C9A96E" }}>تم تسجيل الدخول بنجاح!</h1>
          <p style={{ color: "#8B9A9A" }}>جاري التحويل...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold" style={{ color: "#C9A96E" }}>جنان فلو</Link>
          <p className="mt-2" style={{ color: "#8B9A9A" }}>مرحباً بعودتك</p>
        </div>
        
        <form 
          className="rounded-2xl p-8 flex flex-col gap-6"
          style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-bold text-center" style={{ color: "#C9A96E" }}>تسجيل الدخول</h1>
          
          {error && (
            <div className="p-3 rounded-lg text-center text-red-400" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
              {error}
            </div>
          )}
          
          <div>
            <label className="block mb-2 text-sm" style={{ color: "#9AACAC" }}>البريد الإلكتروني</label>
            <input 
              type="email" 
              placeholder="example@email.com"
              className="w-full p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201, 169, 110, 0.3)", color: "#fff" }}
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              dir="ltr"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm" style={{ color: "#9AACAC" }}>كلمة المرور</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201, 169, 110, 0.3)", color: "#fff" }}
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              dir="ltr"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}
            disabled={loading}
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
          
          <div className="text-center">
            <p style={{ color: "#8B9A9A" }}>
              ليس لديك حساب؟{" "}
              <Link href="/auth/register" className="font-bold" style={{ color: "#C9A96E" }}>
                إنشاء حساب
              </Link>
            </p>
          </div>
        </form>
        
        <div className="text-center mt-6">
          <Link href="/" className="text-sm transition" style={{ color: "#8B9A9A" }}>
            ← العودة للرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
