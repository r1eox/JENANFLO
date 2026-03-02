import { categories } from "./data";
import Link from "next/link";
import React from "react";

const categoryLinks: Record<string, string> = {
  flowers: '/flowers',
  gifts: '/gifts',
  men: '/men',
  women: '/women',
  occasions: '/gifts',
  luxury: '/gifts',
  handmade: '/handmade',
};

export default function CategoriesList() {
  return (
    <section className="my-16 w-full max-w-5xl mx-auto" id="categories">
      <h2 className="text-3xl font-bold mb-10 text-center" style={{ background: "linear-gradient(180deg, #D4AF37, #C9A96E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>✨ اكتشف عوالمنا ✨</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div key={cat.id} className="group rounded-2xl shadow-xl p-6 flex flex-col items-center transition-all duration-500 hover:scale-105 relative overflow-hidden" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(circle at 50% 30%, rgba(201, 169, 110, 0.15) 0%, transparent 60%)" }}></div>
            <span className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-125">{cat.icon}</span>
            <h3 className="text-xl font-bold mb-2 transition-colors duration-300" style={{ color: "#C9A96E" }}>{cat.name}</h3>
            <p className="mb-4 text-center text-sm" style={{ color: "#9AACAC" }}>{cat.description}</p>
            <Link href={categoryLinks[cat.id] || '/'} className="px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg" style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}>تصفح القسم</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
