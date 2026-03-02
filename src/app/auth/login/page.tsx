import React, { useState } from "react";
import { useToast } from "../../_components/ToastProvider";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      toast.showToast(data.error || "حدث خطأ أثناء تسجيل الدخول", "error");
    } else {
      toast.showToast(data.message || "تم تسجيل الدخول بنجاح", "success");
      // يمكن إعادة التوجيه هنا حسب الدور
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <form className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md flex flex-col gap-6" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-pink-700 text-center mb-4">تسجيل الدخول</h1>
        <input type="email" placeholder="البريد الإلكتروني" className="border rounded p-3" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="كلمة المرور" className="border rounded p-3" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="bg-pink-600 text-white py-3 rounded font-bold hover:bg-pink-700 transition" disabled={loading}>{loading ? "...جاري الدخول" : "دخول"}</button>
      </form>
    </main>
  );
}
