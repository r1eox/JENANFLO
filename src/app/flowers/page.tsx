'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";

type Product = {
  _id: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
};

// بيانات محلية للتحميل الفوري
const localFlowers: Product[] = [
  { _id: "bouquet1", name: "سيمفونية الربيع", description: "أوركسترا من الزهور الطبيعية تعزف لحن الجمال ✨", price: 120, image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=500", category: "flowers" },
  { _id: "bouquet2", name: "همسات القمر", description: "باقة بيضاء ناصعة كضوء القمر 🌙", price: 180, image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=500", category: "flowers" },
  { _id: "roses1", name: "عشق الورد الأحمر", description: "ورود حمراء ملكية تنبض بالرومانسية ❤️", price: 200, image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500", category: "flowers" },
  { _id: "men1", name: "رقصة التوليب", description: "زهور التوليب الوردية تتمايل بأناقة 🌷", price: 140, image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500", category: "flowers" },
  { _id: "bouquet3", name: "غروب العشق", description: "تدرجات دافئة تحكي قصة حب 🌅", price: 165, image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=500", category: "flowers" },
  { _id: "luxury1", name: "تاج الفخامة", description: "تحفة نادرة لعشاق التميز 💎", price: 450, image: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=500", category: "flowers" },
];

export default function FlowersPage() {
  const [products, setProducts] = useState<Product[]>(localFlowers); // تحميل فوري
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // تحديث من API في الخلفية
    const loadProducts = async () => {
      try {
        const res = await fetch('/api/products?category=flowers');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setProducts(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    loadProducts();
  }, []);
  
  return (
    <main className="min-h-screen p-6" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 50%, #1E2A2A 100%)" }}>
      {/* Header */}
      <header className="w-full flex justify-between items-center py-4 mb-8" style={{ borderBottom: "1px solid rgba(74, 155, 160, 0.3)" }}>
        <Link href="/" className="text-2xl font-bold" style={{ color: "#C9A96E" }}>جنان فلو</Link>
        <nav className="flex gap-6 text-lg font-medium">
          <Link href="/flowers" className="transition" style={{ color: "#4A9BA0" }}>أزهارك</Link>
          <Link href="/gifts" className="transition hover:text-teal-400" style={{ color: "#C9A96E" }}>هداياك</Link>
          <Link href="/men" className="transition hover:text-teal-400" style={{ color: "#C9A96E" }}>أناقتك</Link>
          <Link href="/women" className="transition hover:text-teal-400" style={{ color: "#C9A96E" }}>أنوثتك</Link>
          <Link href="/cart" className="transition hover:text-teal-400" style={{ color: "#C9A96E" }}>🛒</Link>
        </nav>
      </header>

      {/* Page Title */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ background: "linear-gradient(180deg, #D4AF37, #C9A96E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🌸 أزهارك
        </h1>
        <p className="text-lg" style={{ color: "#8B9A9A" }}>باقات ورد ساحرة تنثر السعادة وتروي قصص الجمال</p>
      </section>

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((prod) => (
            <Link
              key={prod._id || prod.id}
              href={`/products/${prod._id || prod.id}`}
              className="group rounded-2xl shadow-xl p-6 flex flex-col items-center transition-all duration-500 hover:scale-105 relative overflow-hidden cursor-pointer"
              style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(circle at 50% 30%, rgba(201, 169, 110, 0.15) 0%, transparent 60%)" }}></div>
              
              {prod.originalPrice && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold" style={{ background: "#D4AF37", color: "#1E2A2A" }}>
                  خصم {Math.round((1 - prod.price / prod.originalPrice) * 100)}%
                </div>
              )}
              
              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, #C9A96E, #4A9BA0)" }}></div>
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="relative w-40 h-40 object-cover rounded-full transition-all duration-500 group-hover:scale-110" 
                  style={{ border: "4px solid rgba(201, 169, 110, 0.6)", boxShadow: "0 8px 32px rgba(74, 155, 160, 0.3)" }} 
                />
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: "#C9A96E" }}>{prod.name}</h3>
              <p className="mb-3 text-center text-sm" style={{ color: "#9AACAC" }}>{prod.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-bold text-2xl" style={{ color: "#D4AF37" }}>{prod.price} ر.س</span>
                {prod.originalPrice && (
                  <span className="text-sm line-through" style={{ color: "#666" }}>{prod.originalPrice}</span>
                )}
              </div>
              <span className="px-8 py-3 rounded-full font-bold transition-all duration-300 group-hover:scale-110 shadow-lg" style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}>
                عرض التفاصيل
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Back Button */}
      <div className="text-center mt-12">
        <Link href="/" className="inline-block px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105" style={{ background: "rgba(201, 169, 110, 0.2)", color: "#C9A96E", border: "1px solid #C9A96E" }}>
          ← العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
