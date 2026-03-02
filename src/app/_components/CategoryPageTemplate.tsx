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

type CategoryPageProps = {
  categoryKey: string;
  title: string;
  emoji: string;
  subtitle: string;
  activeLink: string;
};

// بيانات محلية للتحميل الفوري
const localProductsData: Record<string, Product[]> = {
  gifts: [
    { _id: "giftbox1", name: "صندوق الأمنيات", description: "كنز من المفاجآت السعيدة مغلف بلمسة سحرية 🎁", price: 250, image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500", category: "gifts" },
    { _id: "gift2", name: "سحر المفاجأة", description: "صندوق هدايا فاخر يفتح أبواب السعادة 🎀", price: 320, image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500", category: "gifts" },
    { _id: "occasions1", name: "لحظة للأبد", description: "هدية تخلد اللحظات الثمينة في ذاكرة القلب 🎊", price: 280, image: "https://images.unsplash.com/photo-1549488344-cbb6c34cf1d4?w=500", category: "gifts" },
  ],
  men: [
    { _id: "men1", name: "طقم العود الملكي", description: "مجموعة عود فاخرة تليق بالرجل الأنيق 🎩", price: 380, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500", category: "men" },
    { _id: "men2", name: "ساعة الوقت الثمين", description: "ساعة فاخرة تجمع بين الأناقة والدقة ⌚", price: 650, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500", category: "men" },
    { _id: "men3", name: "محفظة الجنتلمان", description: "محفظة جلد طبيعي بتصميم كلاسيكي راقي 👔", price: 220, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500", category: "men" },
  ],
  women: [
    { _id: "women1", name: "نسمة الأنوثة", description: "عطر الورد يعانق نعومة الأنثى في باقة ساحرة 🦋", price: 135, image: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=500", category: "women" },
    { _id: "women2", name: "عقد اللؤلؤ الساحر", description: "لؤلؤ طبيعي يعانق جمال الأنثى بأناقة 💎", price: 480, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500", category: "women" },
    { _id: "women3", name: "حقيبة الأميرة", description: "حقيبة فاخرة بتصميم يخطف الأنظار 👛", price: 550, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500", category: "women" },
  ],
  handmade: [
    { _id: "hand1", name: "شمعة الهدوء", description: "شمعة معطرة مصنوعة يدوياً بحب 🕯️", price: 85, image: "https://images.unsplash.com/photo-1602874801006-e5e54b87a9d9?w=500", category: "handmade" },
    { _id: "hand2", name: "سلة الخوص", description: "سلة يدوية من الخوص الطبيعي 🧺", price: 120, image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=500", category: "handmade" },
    { _id: "hand3", name: "إطار الذكريات", description: "إطار خشبي محفور يدوياً 🖼️", price: 150, image: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=500", category: "handmade" },
  ],
};

export default function CategoryPageTemplate({ categoryKey, title, emoji, subtitle, activeLink }: CategoryPageProps) {
  // تحميل فوري من البيانات المحلية
  const [products, setProducts] = useState<Product[]>(localProductsData[categoryKey] || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // تحديث من API في الخلفية
    const loadProducts = async () => {
      try {
        const res = await fetch(`/api/products?category=${categoryKey}`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setProducts(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    loadProducts();
  }, [categoryKey]);
  
  const navLinks = [
    { href: "/flowers", label: "أزهارك", key: "flowers" },
    { href: "/gifts", label: "هداياك", key: "gifts" },
    { href: "/men", label: "أناقتك", key: "men" },
    { href: "/women", label: "أنوثتك", key: "women" },
    { href: "/handmade", label: "فن الإبداع", key: "handmade" },
  ];

  return (
    <main className="min-h-screen p-6" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 50%, #1E2A2A 100%)" }}>
      {/* Header */}
      <header className="w-full flex justify-between items-center py-4 mb-8" style={{ borderBottom: "1px solid rgba(74, 155, 160, 0.3)" }}>
        <Link href="/" className="text-2xl font-bold" style={{ color: "#C9A96E" }}>جنان فلو</Link>
        <nav className="flex gap-6 text-lg font-medium">
          {navLinks.map((link) => (
            <Link 
              key={link.key}
              href={link.href} 
              className="transition" 
              style={{ color: link.key === activeLink ? "#4A9BA0" : "#C9A96E" }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/cart" className="transition" style={{ color: "#C9A96E" }}>🛒</Link>
        </nav>
      </header>

      {/* Page Title */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ background: "linear-gradient(180deg, #D4AF37, #C9A96E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {emoji} {title}
        </h1>
        <p className="text-lg" style={{ color: "#8B9A9A" }}>{subtitle}</p>
      </section>

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p style={{ color: "#C9A96E" }}>لا توجد منتجات في هذا القسم حالياً</p>
            <Link href="/" className="inline-block mt-4 px-6 py-2 rounded-full" style={{ background: "#4A9BA0", color: "#fff" }}>
              تصفح الأقسام الأخرى
            </Link>
          </div>
        ) : (
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
                <p className="mb-3 text-center text-sm line-clamp-2" style={{ color: "#9AACAC" }}>{prod.description}</p>
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
        )}
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
