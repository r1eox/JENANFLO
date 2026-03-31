'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getUD, setUD, removeUD } from "@/lib/userStorage";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  giftMessage?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedCart = getUD<CartItem[]>('jenanflo_cart', []);
    if (savedCart.length) {
      setCartItems(savedCart);
    }
    setIsLoading(false);
  }, []);

  const updateQuantity = (_id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updated = cartItems.map(item =>
      item._id === _id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updated);
    setUD('jenanflo_cart', updated);
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (_id: string) => {
    const updated = cartItems.filter(item => item._id !== _id);
    setCartItems(updated);
    setUD('jenanflo_cart', updated);
    window.dispatchEvent(new Event('cart-updated'));
  };

  const clearCart = () => {
    setCartItems([]);
    removeUD('jenanflo_cart');
    window.dispatchEvent(new Event('cart-updated'));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 50%, #1E2A2A 100%)" }}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4" style={{ borderColor: "#C9A96E" }}></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 50%, #1E2A2A 100%)" }}>
      {/* Header */}
      <header className="w-full flex justify-between items-center py-4 mb-8" style={{ borderBottom: "1px solid rgba(74, 155, 160, 0.3)" }}>
        <Link href="/" className="text-2xl font-bold" style={{ color: "#C9A96E" }}>جنان فلو</Link>
        <nav className="flex gap-6 text-lg font-medium">
          <Link href="/flowers" className="transition hover:text-teal-400" style={{ color: "#C9A96E" }}>أزهارك</Link>
          <Link href="/gifts" className="transition hover:text-teal-400" style={{ color: "#C9A96E" }}>هداياك</Link>
          <Link href="/men" className="transition hover:text-teal-400" style={{ color: "#C9A96E" }}>أناقتك</Link>
          <Link href="/women" className="transition hover:text-teal-400" style={{ color: "#C9A96E" }}>أنوثتك</Link>
        </nav>
      </header>

      {/* Page Title */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ background: "linear-gradient(180deg, #D4AF37, #C9A96E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🛒 سلة التسوق
        </h1>
        <p className="text-lg" style={{ color: "#8B9A9A" }}>
          {totalItems > 0 ? `لديك ${totalItems} منتج في السلة` : 'سلة التسوق فارغة'}
        </p>
      </section>

      {cartItems.length === 0 ? (
        <section className="text-center py-20">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#C9A96E" }}>سلة التسوق فارغة</h2>
          <p className="mb-8" style={{ color: "#8B9A9A" }}>ابدأ بإضافة منتجات رائعة إلى سلتك</p>
          <Link 
            href="/flowers"
            className="inline-block px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}
          >
            تصفح المنتجات
          </Link>
        </section>
      ) : (
        <section className="max-w-4xl mx-auto">
          {/* Cart Items */}
          <div className="space-y-6 mb-8">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6"
                style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}
              >
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl"
                  style={{ border: "2px solid rgba(201, 169, 110, 0.4)" }}
                />

                {/* Product Details */}
                <div className="flex-1 text-center md:text-right">
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#C9A96E" }}>{item.name}</h3>
                  <p className="text-lg" style={{ color: "#D4AF37" }}>{item.price} ر.س</p>
                  {item.giftMessage && (
                    <p className="text-sm mt-2" style={{ color: "#8B9A9A" }}>
                      💌 {item.giftMessage}
                    </p>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all hover:scale-110"
                    style={{ background: "rgba(201, 169, 110, 0.2)", color: "#C9A96E", border: "1px solid #C9A96E" }}
                  >
                    -
                  </button>
                  <span className="text-xl font-bold min-w-[40px] text-center" style={{ color: "#fff" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all hover:scale-110"
                    style={{ background: "rgba(201, 169, 110, 0.2)", color: "#C9A96E", border: "1px solid #C9A96E" }}
                  >
                    +
                  </button>
                </div>

                {/* Item Total & Remove */}
                <div className="text-center">
                  <p className="text-lg font-bold mb-2" style={{ color: "#D4AF37" }}>
                    {item.price * item.quantity} ر.س
                  </p>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    🗑️ حذف
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div
            className="rounded-2xl p-8"
            style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.3)" }}
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl" style={{ color: "#8B9A9A" }}>المجموع الفرعي:</span>
              <span className="text-2xl font-bold" style={{ color: "#D4AF37" }}>{totalPrice} ر.س</span>
            </div>
            
            <div className="flex justify-between items-center mb-6 pb-6" style={{ borderBottom: "1px solid rgba(201, 169, 110, 0.2)" }}>
              <span className="text-xl" style={{ color: "#8B9A9A" }}>التوصيل:</span>
              <span className="text-lg" style={{ color: "#4A9BA0" }}>يُحدد عند الدفع</span>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-2xl font-bold" style={{ color: "#C9A96E" }}>الإجمالي:</span>
              <span className="text-3xl font-bold" style={{ color: "#D4AF37" }}>{totalPrice} ر.س</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={clearCart}
                className="flex-1 px-6 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105"
                style={{ background: "rgba(201, 169, 110, 0.2)", color: "#C9A96E", border: "1px solid #C9A96E" }}
              >
                🗑️ إفراغ السلة
              </button>
              <Link
                href="/checkout"
                className="flex-1 px-6 py-4 rounded-full font-bold text-center transition-all duration-300 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}
              >
                🚀 إتمام الطلب
              </Link>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              style={{ background: "rgba(201, 169, 110, 0.2)", color: "#C9A96E", border: "1px solid #C9A96E" }}
            >
              ← متابعة التسوق
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
