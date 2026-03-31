'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { products as staticProducts } from "./data";
import { getUD, setUD } from "@/lib/userStorage";

type Product = {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  featured?: boolean;
};

function WishlistBtn({ productId, name, price, image }: { productId: string; name: string; price: number; image: string }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const wl = getUD<{id:string}[]>('jenanflo_wishlist', []);
    setLiked(wl.some((w) => w.id === productId));
  }, [productId]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wl: { id: string; name: string; price: number; image: string }[] =
      getUD('jenanflo_wishlist', []);
    let next;
    if (wl.some(w => w.id === productId)) {
      next = wl.filter(w => w.id !== productId);
      setLiked(false);
    } else {
      next = [...wl, { id: productId, name, price, image }];
      setLiked(true);
    }
    setUD('jenanflo_wishlist', next);
  };

  return (
    <button
      onClick={toggle}
      className="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300 hover:scale-125 z-10 shadow-md"
      style={{
        background: liked ? "rgba(212,175,55,0.85)" : "rgba(30,42,42,0.8)",
        border: `1.5px solid ${liked ? "#D4AF37" : "rgba(201,169,110,0.35)"}`,
        backdropFilter: "blur(6px)",
      }}
      title={liked ? "إزالة من المفضلة" : "إضافة للمفضلة"}
    >
      {liked ? "❤️" : "🧡"}
    </button>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const all: Product[] = await res.json();
          const featured = all.filter(p => p.featured);
          setProducts(featured.length > 0 ? featured : (staticProducts.filter(p => p.featured) as Product[]));
        } else {
          setProducts(staticProducts.filter(p => p.featured) as Product[]);
        }
      } catch {
        setProducts(staticProducts.filter(p => p.featured) as Product[]);
      }
    };
    load();
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="my-16 w-full max-w-5xl mx-auto" id="featured-products">
      <h2 className="text-3xl font-bold mb-10 text-center" style={{ background: "linear-gradient(180deg, #D4AF37, #C9A96E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>✨ منتجات مميزة ✨</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((prod) => {
          const id = prod._id || prod.id || '';
          return (
            <Link
              href={`/products/${id}`}
              key={id}
              className="group rounded-2xl shadow-xl p-6 flex flex-col items-center transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in-up relative overflow-hidden"
              style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)", willChange: 'transform' }}
            >
              <WishlistBtn productId={id} name={prod.name} price={prod.price} image={prod.image} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(circle at 50% 30%, rgba(201, 169, 110, 0.15) 0%, transparent 60%)" }}></div>
              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, #C9A96E, #4A9BA0)" }}></div>
                <img src={prod.image} alt={prod.name} className="relative w-40 h-40 object-cover rounded-full transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" style={{ border: "4px solid rgba(201, 169, 110, 0.6)", boxShadow: "0 8px 32px rgba(74, 155, 160, 0.3)" }} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center transition-colors duration-300 group-hover:text-amber-300" style={{ color: "#C9A96E" }}>{prod.name}</h3>
              <p className="mb-3 text-center text-sm leading-relaxed" style={{ color: "#9AACAC" }}>{prod.description}</p>
              <span className="font-bold text-2xl mb-4" style={{ color: "#D4AF37", textShadow: "0 0 20px rgba(212, 175, 55, 0.3)" }}>{prod.price} ر.س</span>
              <span className="px-8 py-3 rounded-full font-bold transition-all duration-300 group-hover:scale-110 shadow-lg" style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff", boxShadow: "0 4px 15px rgba(74, 155, 160, 0.4)" }}>اطلب الآن</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
