'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { userKey } from "@/lib/userStorage";

interface CartItem {
  _id: string;
  quantity: number;
}

export default function CartIcon() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem(userKey('jenanflo_cart')) || '[]');
        const total = cart.reduce((sum: number, item: CartItem) => sum + (item.quantity || 1), 0);
        setCount(total);
      } catch {
        setCount(0);
      }
    };

    updateCount();

    // تحديث عند تغيير localStorage من تبويب آخر
    const handleStorage = (e: StorageEvent) => {
      if (e.key === userKey('jenanflo_cart')) updateCount();
    };
    // تحديث عند تغيير السلة في نفس التبويب
    const handleCartUpdate = () => updateCount();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('user-changed', handleCartUpdate);  // تحديث عند تغيير المستخدم

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('user-changed', handleCartUpdate);
    };
  }, []);

  return (
    <Link href="/cart" className="relative transition cart-link">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#C9A96E,#D4AF37)", color: "#1E2A2A" }}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
