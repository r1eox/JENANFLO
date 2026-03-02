'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { products as localProducts } from "../data";

type Product = {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  stock?: number;
};

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // أولاً: البحث في المنتجات المحلية
        const localFound = localProducts.find((p) => 
          p.id === params.id || p.name === decodeURIComponent(params.id as string)
        );
        
        if (localFound) {
          setProduct({ ...localFound, _id: localFound.id });
          setLoading(false);
          return;
        }
        
        // ثانياً: البحث في API
        const res = await fetch('/api/products');
        if (res.ok) {
          const apiProducts = await res.json();
          const found = apiProducts.find((p: Product) => 
            p._id === params.id || p.id === params.id || p.name === decodeURIComponent(params.id as string)
          );
          setProduct(found || null);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [params.id]);

  const addToCart = () => {
    if (!product) return;
    
    const productId = product._id || product.id || '';
    
    // حفظ في localStorage
    const cart = JSON.parse(localStorage.getItem('jenanflo_cart') || '[]');
    const existingIndex = cart.findIndex((item: any) => item._id === productId);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
      if (giftMessage) cart[existingIndex].giftMessage = giftMessage;
    } else {
      cart.push({
        _id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        giftMessage,
      });
    }
    
    localStorage.setItem('jenanflo_cart', JSON.stringify(cart));
    setAddedToCart(true);
    
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 100%)" }}>
        <div className="animate-pulse text-center">
          <div className="text-4xl mb-4">🌸</div>
          <p style={{ color: "#C9A96E" }}>جاري التحميل...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 100%)" }}>
        <div className="text-6xl mb-4">😔</div>
        <h1 className="text-2xl font-bold mb-4" style={{ color: "#C9A96E" }}>المنتج غير موجود</h1>
        <Link href="/" className="px-6 py-3 rounded-full" style={{ background: "#4A9BA0", color: "#fff" }}>
          العودة للرئيسية
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 100%)" }}>
      {/* Header */}
      <header className="w-full flex justify-between items-center py-4 mb-8 max-w-6xl mx-auto" style={{ borderBottom: "1px solid rgba(74, 155, 160, 0.3)" }}>
        <Link href="/" className="text-2xl font-bold" style={{ color: "#C9A96E" }}>جنان فلو</Link>
        <Link href="/cart" className="relative flex items-center gap-2 px-4 py-2 rounded-full transition" style={{ background: "rgba(74, 155, 160, 0.2)", color: "#4A9BA0" }}>
          <span className="text-xl">🛒</span>
          <span>السلة</span>
        </Link>
      </header>

      {/* Product Details */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* صورة المنتج */}
        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ border: "2px solid rgba(201, 169, 110, 0.3)" }}>
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          {product.originalPrice && (
            <div className="absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold" style={{ background: "#D4AF37", color: "#1E2A2A" }}>
              خصم {Math.round((1 - product.price / product.originalPrice) * 100)}%
            </div>
          )}
        </div>

        {/* تفاصيل المنتج */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-4" style={{ color: "#C9A96E" }}>{product.name}</h1>
          <p className="text-lg mb-6 leading-relaxed" style={{ color: "#9AACAC" }}>{product.description}</p>
          
          {/* السعر */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold" style={{ color: "#D4AF37" }}>{product.price} ر.س</span>
            {product.originalPrice && (
              <span className="text-xl line-through" style={{ color: "#666" }}>{product.originalPrice} ر.س</span>
            )}
          </div>

          {/* الكمية */}
          <div className="flex items-center gap-4 mb-6">
            <span style={{ color: "#C9A96E" }}>الكمية:</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition hover:scale-110"
                style={{ background: "rgba(74, 155, 160, 0.2)", color: "#4A9BA0" }}
              >
                -
              </button>
              <span className="text-xl font-bold w-12 text-center" style={{ color: "#fff" }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition hover:scale-110"
                style={{ background: "rgba(74, 155, 160, 0.2)", color: "#4A9BA0" }}
              >
                +
              </button>
            </div>
          </div>

          {/* رسالة الهدية */}
          <div className="mb-6">
            <label className="block mb-2" style={{ color: "#C9A96E" }}>💌 رسالة الهدية (اختياري):</label>
            <textarea
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              placeholder="اكتب رسالتك الخاصة هنا..."
              className="w-full p-4 rounded-xl resize-none"
              rows={3}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201, 169, 110, 0.3)", color: "#fff" }}
            />
          </div>

          {/* زر الإضافة للسلة */}
          <button
            onClick={addToCart}
            className={`w-full py-4 rounded-full text-lg font-bold transition-all duration-300 ${addedToCart ? 'scale-95' : 'hover:scale-105'}`}
            style={{ 
              background: addedToCart ? "linear-gradient(135deg, #2D8B8B, #4A9BA0)" : "linear-gradient(135deg, #C9A96E, #D4AF37)", 
              color: addedToCart ? "#fff" : "#1E2A2A",
              boxShadow: "0 4px 20px rgba(201, 169, 110, 0.4)"
            }}
          >
            {addedToCart ? "✓ تمت الإضافة!" : "🛒 أضف إلى السلة"}
          </button>

          {/* أو الشراء المباشر */}
          <Link
            href={`/checkout?product=${product._id || product.id}&qty=${quantity}&msg=${encodeURIComponent(giftMessage)}`}
            className="w-full py-4 rounded-full text-lg font-bold text-center mt-4 transition-all duration-300 hover:scale-105 block"
            style={{ 
              background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", 
              color: "#fff",
              boxShadow: "0 4px 20px rgba(74, 155, 160, 0.4)"
            }}
          >
            ⚡ اشترِ الآن
          </Link>

          {/* معلومات إضافية */}
          <div className="mt-8 p-4 rounded-xl" style={{ background: "rgba(74, 155, 160, 0.1)", border: "1px solid rgba(74, 155, 160, 0.2)" }}>
            <div className="flex items-center gap-3 mb-3">
              <span>🚚</span>
              <span style={{ color: "#9AACAC" }}>توصيل سريع خلال 2-4 ساعات</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span>💐</span>
              <span style={{ color: "#9AACAC" }}>ورود طازجة 100%</span>
            </div>
            <div className="flex items-center gap-3">
              <span>🎁</span>
              <span style={{ color: "#9AACAC" }}>تغليف فاخر مجاناً</span>
            </div>
          </div>
        </div>
      </div>

      {/* زر العودة */}
      <div className="text-center mt-12">
        <Link href="/" className="inline-block px-8 py-3 rounded-full font-semibold transition hover:scale-105" style={{ background: "rgba(201, 169, 110, 0.2)", color: "#C9A96E", border: "1px solid #C9A96E" }}>
          ← تصفح المزيد
        </Link>
      </div>
    </main>
  );
}
