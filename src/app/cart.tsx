'use client';
import React, { useState, useEffect } from "react";

// نوع المنتج المختصر
interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  // تحميل المنتجات (للتأكد من صحة البيانات)
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  // حساب الإجمالي
  useEffect(() => {
    setTotal(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  }, [cart]);

  // إضافة منتج للسلة (للاستخدام من صفحات المنتجات)
  // يمكن لاحقاً نقلها إلى context أو localStorage
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const found = prev.find((item) => item._id === product._id);
      if (found) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-bold text-pink-700 text-center mb-2">سلة المشتريات</h1>
        {cart.length === 0 ? (
          <div className="text-gray-600">سلتك فارغة. أضف منتجات للمتابعة.</div>
        ) : (
          <table className="min-w-full text-right mb-4">
            <thead>
              <tr>
                <th className="p-2">المنتج</th>
                <th className="p-2">الكمية</th>
                <th className="p-2">السعر</th>
                <th className="p-2">حذف</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td className="p-2 flex items-center gap-2">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full border" />
                    )}
                    <span>{item.name}</span>
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={e => updateQuantity(item._id, Number(e.target.value))}
                      className="border rounded w-16 text-center"
                    />
                  </td>
                  <td className="p-2">{item.price * item.quantity} ر.س</td>
                  <td className="p-2">
                    <button className="text-red-600 hover:underline" onClick={() => removeFromCart(item._id)}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="w-full flex justify-between items-center mt-4">
          <span className="font-bold text-lg">الإجمالي: {total} ر.س</span>
          <a href="/checkout/location" className="bg-pink-600 text-white py-3 px-8 rounded font-bold hover:bg-pink-700 transition disabled:opacity-50 {cart.length === 0 ? 'pointer-events-none opacity-50' : ''}">
            متابعة الدفع
          </a>
        </div>
      </div>
    </main>
  );
}
