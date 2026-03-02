'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface CartItem {
  _id: string;
  quantity: number;
}

export default function CartIcon() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // تحميل عدد المنتجات عند البدء
    const updateCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('jenanflo_cart') || '[]');
        const total = cart.reduce((sum: number, item: CartItem) => sum + (item.quantity || 1), 0);
        setCount(total);
      } catch {
        setCount(0);
      }
    };

    updateCount();

    // الاستماع لتغييرات السلة
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'jenanflo_cart') {
        updateCount();
      }
    };

    // تحديث كل ثانيتين (للتحديث من نفس التبويب)
    const interval = setInterval(updateCount, 2000);

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <Link href="/cart" className="relative transition flex items-center gap-1" style={{ color: "#4A9BA0" }}>
      <span className="text-2xl">🛒</span>
      {count > 0 && (
        <span 
          className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold animate-pulse"
          style={{ background: "#D4AF37", color: "#1E2A2A" }}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
      <span className="sr-only">سلة المشتريات ({count})</span>
    </Link>
  );
}
