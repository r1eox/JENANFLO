'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import JenanFloLogoFull from "./_components/JenanFloLogoFull";
import CartIcon from "./_components/CartIcon";

import CategoriesList from "./categories/CategoriesList";
import FeaturedProducts from "./products/FeaturedProducts";
import BlogIdeas from "./blog/BlogIdeas";

export default function HomePage() {
  const [user, setUser] = useState<{ name?: string; role?: string; email?: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("jenanflo_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jenanflo_user");
    setUser(null);
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-6" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 50%, #1E2A2A 100%)" }}>
      {/* شريط المدير */}
      {user?.role === "admin" && (
        <div className="fixed top-0 left-0 right-0 z-50 py-2 px-4 flex justify-between items-center" style={{ background: "linear-gradient(90deg, #C9A96E, #D4AF37)", color: "#1E2A2A" }}>
          <span className="font-bold">👑 مرحباً {user.name || "مدير المتجر"}</span>
          <div className="flex gap-4 items-center">
            <Link href="/admin" className="font-bold hover:underline">🎛️ لوحة التحكم</Link>
            <button onClick={handleLogout} className="font-medium hover:underline">تسجيل خروج</button>
          </div>
        </div>
      )}
      
      <header className={`w-full flex flex-col md:flex-row justify-between items-center py-4 mb-8 gap-4 ${user?.role === "admin" ? "mt-10" : ""}`} style={{ borderBottom: "1px solid rgba(74, 155, 160, 0.3)" }}>
        <JenanFloLogoFull />
        <nav className="flex gap-6 text-lg font-medium items-center nav-links">
          <Link href="/flowers" className="nav-link transition">أزهارك</Link>
          <Link href="/gifts" className="nav-link transition">هداياك</Link>
          <Link href="/men" className="nav-link transition">أناقتك</Link>
          <Link href="/women" className="nav-link transition">أنوثتك</Link>
          <Link href="/handmade" className="nav-link transition">فن الإبداع</Link>
          <Link href="/create-gift" className="nav-link transition">اصنع هديتك</Link>
          <Link href="/track" className="nav-link transition">تتبع طلبك</Link>
          {!user
            ? <Link href="/auth/login" className="nav-link transition">دخول</Link>
            : <Link href="/account" className="nav-link transition font-bold" style={{ color: "#C9A96E" }}>👤 حسابي</Link>
          }
          <CartIcon />
        </nav>
      </header>
      <section className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 main-title">أهلاً بكم في جنان فلو</h1>
        <p className="text-lg md:text-xl mb-8" style={{ color: "#8B9A9A" }}>
          حيث تتراقص الزهور وتتجسد الأحلام في هدايا تُعانق القلوب ✨
        </p>
        <a href="#flowers" className="inline-block px-8 py-3 rounded-full text-lg font-semibold shadow transition cta-button">اكتشف السحر</a>
      </section>
      {/* المنتجات المميزة */}
      <FeaturedProducts />
      {/* الأقسام الرئيسية */}
      <CategoriesList />
      {/* أفكار الهدايا والمناسبات */}
      <BlogIdeas />
      
      {/* Footer */}
      <footer className="w-full mt-16 pt-12 pb-6" style={{ background: "linear-gradient(180deg, #1A2424 0%, #151C1C 100%)", borderTop: "1px solid rgba(201, 169, 110, 0.2)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* من نحن */}
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: "#C9A96E" }}>من نحن</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#8B9A9A" }}>
                جنان فلو... حيث تتحول المشاعر إلى هدايا ساحرة. نصنع لحظات الفرح بعناية فائقة منذ 2020، ونوصل السعادة لأحبائكم في كل مكان.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span style={{ color: "#D4AF37" }}>📍</span>
                <span className="text-sm" style={{ color: "#8B9A9A" }}>الرياض، المملكة العربية السعودية</span>
              </div>
            </div>

            {/* روابط سريعة */}
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: "#C9A96E" }}>روابط سريعة</h3>
              <ul className="space-y-2">
                <li><Link href="/flowers" className="text-sm transition hover:pr-2" style={{ color: "#8B9A9A" }}>أزهارك 🌸</Link></li>
                <li><Link href="/gifts" className="text-sm transition hover:pr-2" style={{ color: "#8B9A9A" }}>هداياك ✨</Link></li>
                <li><Link href="/men" className="text-sm transition hover:pr-2" style={{ color: "#8B9A9A" }}>أناقتك 🎩</Link></li>
                <li><Link href="/women" className="text-sm transition hover:pr-2" style={{ color: "#8B9A9A" }}>أنوثتك 🦋</Link></li>
                <li><Link href="/create-gift" className="text-sm transition hover:pr-2" style={{ color: "#8B9A9A" }}>اصنع هديتك 🎁</Link></li>
              </ul>
            </div>

            {/* تواصل معنا */}
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: "#C9A96E" }}>تواصل معنا</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span style={{ color: "#4A9BA0" }}>📱</span>
                  <span className="text-sm" style={{ color: "#8B9A9A" }}>+966 50 123 4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: "#4A9BA0" }}>✉️</span>
                  <span className="text-sm" style={{ color: "#8B9A9A" }}>info@jenanflo.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: "#4A9BA0" }}>⏰</span>
                  <span className="text-sm" style={{ color: "#8B9A9A" }}>يومياً 9 ص - 11 م</span>
                </li>
              </ul>
            </div>

            {/* تابعنا */}
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: "#C9A96E" }}>تابعنا</h3>
              <div className="flex gap-4 mb-6">
                {/* انستقرام */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="انستغرام" className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg" style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)", border: "none" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* تويتر X */}
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" title="تويتر X" className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg" style={{ background: "#000", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                {/* تيك توك */}
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" title="تيك توك" className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg" style={{ background: "#010101", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.54V6.78a4.85 4.85 0 01-1.07-.09z"/>
                  </svg>
                </a>
                {/* واتساب */}
                <a href="https://wa.me/966501234567" target="_blank" rel="noopener noreferrer" title="واتساب" className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg" style={{ background: "#25D366" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
              
              {/* الاقتراحات */}
              <h4 className="font-bold mb-2" style={{ color: "#C9A96E" }}>شاركنا رأيك</h4>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="بريدك الإلكتروني" 
                  className="flex-1 px-3 py-2 rounded-lg text-sm text-right"
                  style={{ background: "rgba(45, 52, 54, 0.8)", border: "1px solid rgba(74, 155, 160, 0.3)", color: "#fff" }}
                />
                <button className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105" style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}>
                  إرسال
                </button>
              </div>
            </div>
          </div>

          {/* خط فاصل */}
          <div className="border-t pt-6" style={{ borderColor: "rgba(201, 169, 110, 0.2)" }}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm" style={{ color: "#6B7B7B" }}>
                جميع الحقوق محفوظة © {new Date().getFullYear()} <span className="font-bold" style={{ color: "#C9A96E" }}>جنان فلو</span>
              </p>
              <div className="flex gap-4 text-sm" style={{ color: "#6B7B7B" }}>
                <a href="#" className="transition hover:text-teal-400">سياسة الخصوصية</a>
                <span>|</span>
                <a href="#" className="transition hover:text-teal-400">الشروط والأحكام</a>
                <span>|</span>
                <a href="#" className="transition hover:text-teal-400">سياسة الاسترجاع</a>
              </div>
              <p className="text-sm" style={{ color: "#6B7B7B" }}>
                تصميم وبرمجة <span className="font-bold" style={{ color: "#D4AF37" }}>جنان بيز</span> 💛
              </p>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .nav-link { color: #C9A96E; }
        .nav-link:hover { color: #4A9BA0; }
        .cart-link { color: #4A9BA0; }
        .main-title {
          background: linear-gradient(180deg, #D4AF37, #C9A96E);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .cta-button {
          background: linear-gradient(135deg, #4A9BA0, #2D8B8B);
          color: #fff;
        }
        .cta-button:hover {
          transform: scale(1.05);
        }
      `}</style>
    </main>
  );
}
