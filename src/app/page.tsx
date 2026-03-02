'use client';
import React from "react";
import Link from "next/link";
import JenanFloLogoFull from "./_components/JenanFloLogoFull";
import CartIcon from "./_components/CartIcon";

import CategoriesList from "./categories/CategoriesList";
import FeaturedProducts from "./products/FeaturedProducts";
import BlogIdeas from "./blog/BlogIdeas";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-6" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 50%, #1E2A2A 100%)" }}>
      <header className="w-full flex flex-col md:flex-row justify-between items-center py-4 mb-8 gap-4" style={{ borderBottom: "1px solid rgba(74, 155, 160, 0.3)" }}>
        <JenanFloLogoFull />
        <nav className="flex gap-6 text-lg font-medium items-center nav-links">
          <Link href="/flowers" className="nav-link transition">أزهارك</Link>
          <Link href="/gifts" className="nav-link transition">هداياك</Link>
          <Link href="/men" className="nav-link transition">أناقتك</Link>
          <Link href="/women" className="nav-link transition">أنوثتك</Link>
          <Link href="/handmade" className="nav-link transition">فن الإبداع</Link>
          <Link href="/create-gift" className="nav-link transition">اصنع هديتك</Link>
          <Link href="/track" className="nav-link transition">تتبع طلبك</Link>
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
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: "rgba(74, 155, 160, 0.2)", border: "1px solid rgba(74, 155, 160, 0.3)" }}>
                  <span className="text-xl">📸</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: "rgba(74, 155, 160, 0.2)", border: "1px solid rgba(74, 155, 160, 0.3)" }}>
                  <span className="text-xl">🐦</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: "rgba(74, 155, 160, 0.2)", border: "1px solid rgba(74, 155, 160, 0.3)" }}>
                  <span className="text-xl">📘</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: "rgba(201, 169, 110, 0.2)", border: "1px solid rgba(201, 169, 110, 0.3)" }}>
                  <span className="text-xl">💬</span>
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
