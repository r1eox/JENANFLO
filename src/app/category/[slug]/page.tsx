'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getUD, setUD } from "@/lib/userStorage";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
};

type Category = {
  _id: string;
  name: string;
  nameAr: string;
  description: string;
  image: string;
};

export default function DynamicCategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // جلب الأقسام للحصول على بيانات القسم الحالي
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/products?category=${slug}`),
        ]);

        if (catRes.ok) {
          const cats: Category[] = await catRes.json();
          // البحث بالمعرّف _id أو name
          const found = cats.find(c => c._id === slug || c.name === slug);
          if (found) setCategory(found);
        }

        if (prodRes.ok) {
          const data = await prodRes.json();
          setProducts(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // جلب السلة من localStorage (خاصة بالمستخدم الحالي)
    try {
      setCart(getUD('jenanflo_cart', []));
    } catch {}
  }, [slug]);

  const addToCart = (product: Product) => {
    const existing = cart.find(i => i._id === product._id);
    let newCart;
    if (existing) {
      newCart = cart.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    setUD('jenanflo_cart', newCart);
    window.dispatchEvent(new Event('cart-updated'));
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 50%, #1E2A2A 100%)" }}>
        <div className="w-14 h-14 rounded-full border-4 animate-spin" style={{ borderColor: "#C9A96E", borderTopColor: "transparent" }} />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 50%, #1E2A2A 100%)" }}>
      {/* Header */}
      <header className="w-full flex justify-between items-center py-4 mb-8" style={{ borderBottom: "1px solid rgba(74, 155, 160, 0.3)" }}>
        <Link href="/" className="text-2xl font-bold" style={{ color: "#C9A96E" }}>جنان فلو</Link>
        <nav className="flex gap-6 text-lg font-medium items-center">
          <Link href="/flowers" style={{ color: "#C9A96E" }} className="hover:text-teal-400 transition">أزهارك</Link>
          <Link href="/gifts"   style={{ color: "#C9A96E" }} className="hover:text-teal-400 transition">هداياك</Link>
          <Link href="/men"     style={{ color: "#C9A96E" }} className="hover:text-teal-400 transition">أناقتك</Link>
          <Link href="/women"   style={{ color: "#C9A96E" }} className="hover:text-teal-400 transition">أنوثتك</Link>
          <Link href="/cart" style={{ color: "#4A9BA0" }}>🛒 {cart.length > 0 && <span className="text-sm">({cart.reduce((a,i)=>a+i.quantity,0)})</span>}</Link>
        </nav>
      </header>

      {/* عنوان القسم */}
      <section className="text-center mb-12">
        {category?.image && (
          <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4" style={{ borderColor: "rgba(201,169,110,0.4)" }}>
            <img src={category.image} alt={category.nameAr} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ background: "linear-gradient(180deg, #D4AF37, #C9A96E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          {category?.nameAr || category?.name || 'القسم'}
        </h1>
        {category?.description && (
          <p className="text-lg" style={{ color: "#8B9A9A" }}>{category.description}</p>
        )}
      </section>

      {/* المنتجات */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛍️</div>
          <p className="text-xl" style={{ color: "#8B9A9A" }}>لا توجد منتجات في هذا القسم حتى الآن</p>
          <p className="mt-2 text-sm" style={{ color: "#6B7B7B" }}>يمكنك إضافة منتجات من لوحة التحكم</p>
          <Link href="/" className="inline-block mt-6 px-6 py-3 rounded-full font-medium transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}>
            العودة للرئيسية
          </Link>
        </div>
      ) : (
        <section className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product._id} className="group rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}>
                <div className="relative overflow-hidden h-56">
                  <img src={product.image || 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400'} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold" style={{ background: "linear-gradient(135deg, #e74c3c, #c0392b)", color: "#fff" }}>
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2" style={{ color: "#C9A96E" }}>{product.name}</h3>
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: "#8B9A9A" }}>{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold" style={{ color: "#D4AF37" }}>{product.price} ر.س</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm line-through mr-2" style={{ color: "#6B7B7B" }}>{product.originalPrice}</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 rounded-full font-medium transition-all hover:scale-105 text-sm"
                      style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}
                    >
                      أضف للسلة
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="text-center mt-16">
        <Link href="/" className="inline-block px-8 py-3 rounded-full font-medium border transition-all hover:scale-105" style={{ borderColor: "rgba(201,169,110,0.4)", color: "#C9A96E" }}>
          ← العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
