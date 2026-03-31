'use client';
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
  nameAr: string;
  description: string;
  image: string;
  active: boolean;
  productsCount?: number;
};

// أيقونة افتراضية لأي قسم جديد
const DefaultIcon = () => (
  <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="20" fill="none" stroke="#C9A96E" strokeWidth="2"/>
    <path d="M26 16 L30 22 L37 23 L32 28 L33 35 L26 31 L19 35 L20 28 L15 23 L22 22Z" fill="#D4AF37" opacity="0.9"/>
  </svg>
);

const CategoryIcon = ({ id }: { id: string }) => {
  const iconStyle = { width: 52, height: 52 };
  if (id === "flowers") return (
    <svg style={iconStyle} viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="7" fill="#C9A96E"/>
      <ellipse cx="26" cy="12" rx="5" ry="9" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="26" cy="40" rx="5" ry="9" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="12" cy="26" rx="9" ry="5" fill="#4A9BA0" opacity="0.9"/>
      <ellipse cx="40" cy="26" rx="9" ry="5" fill="#4A9BA0" opacity="0.9"/>
      <ellipse cx="15" cy="15" rx="5" ry="9" fill="#C9A96E" opacity="0.7" transform="rotate(-45 15 15)"/>
      <ellipse cx="37" cy="37" rx="5" ry="9" fill="#C9A96E" opacity="0.7" transform="rotate(-45 37 37)"/>
      <ellipse cx="37" cy="15" rx="5" ry="9" fill="#D4AF37" opacity="0.7" transform="rotate(45 37 15)"/>
      <ellipse cx="15" cy="37" rx="5" ry="9" fill="#D4AF37" opacity="0.7" transform="rotate(45 15 37)"/>
      <circle cx="26" cy="26" r="5" fill="#fff" opacity="0.9"/>
    </svg>
  );
  if (id === "gifts") return (
    <svg style={iconStyle} viewBox="0 0 52 52" fill="none">
      <rect x="8" y="22" width="36" height="24" rx="3" fill="#4A9BA0" opacity="0.8"/>
      <rect x="6" y="18" width="40" height="8" rx="3" fill="#C9A96E"/>
      <rect x="23" y="14" width="6" height="36" rx="3" fill="#D4AF37"/>
      <path d="M26 18 C20 10 10 12 12 18" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M26 18 C32 10 42 12 40 18" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="26" cy="18" r="3" fill="#fff"/>
    </svg>
  );
  if (id === "men") return (
    <svg style={iconStyle} viewBox="0 0 52 52" fill="none">
      <ellipse cx="26" cy="22" rx="18" ry="8" fill="#2D3436" stroke="#C9A96E" strokeWidth="2"/>
      <ellipse cx="26" cy="20" rx="14" ry="6" fill="#1E2A2A"/>
      <rect x="8" y="22" width="36" height="6" rx="1" fill="#C9A96E" opacity="0.6"/>
      <rect x="16" y="28" width="20" height="14" rx="8" fill="#4A9BA0" opacity="0.5"/>
      <path d="M22 32 L26 36 L30 32" stroke="#D4AF37" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
  if (id === "women") return (
    <svg style={iconStyle} viewBox="0 0 52 52" fill="none">
      <path d="M26 6 C20 6 15 12 15 19 C15 28 20 33 26 34 C32 33 37 28 37 19 C37 12 32 6 26 6Z" fill="#C9A96E" opacity="0.8"/>
      <path d="M18 32 L10 48 L26 42 L42 48 L34 32" fill="#4A9BA0" opacity="0.7"/>
      <circle cx="26" cy="18" r="6" fill="#1E2A2A"/>
      <circle cx="23" cy="17" r="1.5" fill="#C9A96E"/>
      <circle cx="29" cy="17" r="1.5" fill="#C9A96E"/>
      <path d="M23 21 Q26 24 29 21" stroke="#C9A96E" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
  if (id === "occasions") return (
    <svg style={iconStyle} viewBox="0 0 52 52" fill="none">
      <path d="M26 6 L29 18 L42 18 L32 26 L36 38 L26 30 L16 38 L20 26 L10 18 L23 18Z" fill="#D4AF37" opacity="0.95"/>
      <circle cx="26" cy="26" r="5" fill="#C9A96E" opacity="0.5"/>
      <circle cx="12" cy="10" r="3" fill="#4A9BA0" opacity="0.7"/>
      <circle cx="40" cy="10" r="2" fill="#C9A96E" opacity="0.7"/>
      <circle cx="40" cy="40" r="3" fill="#D4AF37" opacity="0.7"/>
      <circle cx="12" cy="40" r="2" fill="#4A9BA0" opacity="0.7"/>
    </svg>
  );
  if (id === "luxury") return (
    <svg style={iconStyle} viewBox="0 0 52 52" fill="none">
      <polygon points="26,8 32,20 46,20 35,29 39,43 26,34 13,43 17,29 6,20 20,20" fill="none" stroke="#D4AF37" strokeWidth="2"/>
      <path d="M16 20 L26 8 L36 20 L32 32 L20 32Z" fill="#4A9BA0" opacity="0.6"/>
      <path d="M16 20 L20 32 L13 43 L6 20Z" fill="#C9A96E" opacity="0.5"/>
      <path d="M36 20 L32 32 L39 43 L46 20Z" fill="#C9A96E" opacity="0.5"/>
      <path d="M20 32 L26 34 L32 32 L26 46Z" fill="#D4AF37" opacity="0.7"/>
      <circle cx="26" cy="26" r="4" fill="#D4AF37" opacity="0.9"/>
    </svg>
  );
  if (id === "handmade") return (
    <svg style={iconStyle} viewBox="0 0 52 52" fill="none">
      <path d="M28 10 Q32 6 36 10 L44 28 Q46 34 42 38 L28 46 Q24 48 20 44 L8 32 Q4 28 8 22 L18 12 Q22 8 28 10Z" fill="#4A9BA0" opacity="0.25"/>
      <path d="M14 38 L10 42" stroke="#C9A96E" strokeWidth="3" strokeLinecap="round"/>
      <rect x="13" y="22" width="5" height="18" rx="2.5" fill="#C9A96E" transform="rotate(-30 13 22)"/>
      <circle cx="32" cy="20" r="8" fill="none" stroke="#D4AF37" strokeWidth="2.5"/>
      <circle cx="32" cy="20" r="4" fill="#D4AF37" opacity="0.7"/>
      <path d="M38 26 L44 36" stroke="#4A9BA0" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
  return <DefaultIcon />;
};

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then((data: Category[]) => {
        setCategories(data.filter(c => c.active));
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="my-16 w-full max-w-5xl mx-auto" id="categories">
        <h2 className="text-3xl font-bold mb-10 text-center" style={{ background: "linear-gradient(180deg, #D4AF37, #C9A96E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>✨ اكتشف عوالمنا ✨</h2>
        <div className="flex justify-center py-16">
          <div className="w-12 h-12 rounded-full border-4 animate-spin" style={{ borderColor: "#C9A96E", borderTopColor: "transparent" }}></div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-16 w-full max-w-5xl mx-auto" id="categories">
      <h2 className="text-3xl font-bold mb-10 text-center" style={{ background: "linear-gradient(180deg, #D4AF37, #C9A96E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>✨ اكتشف عوالمنا ✨</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div key={cat._id} className="group rounded-2xl shadow-xl p-6 flex flex-col items-center transition-all duration-500 hover:scale-105 relative overflow-hidden" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(circle at 50% 30%, rgba(201, 169, 110, 0.15) 0%, transparent 60%)" }}></div>
            <div className="mb-4 transition-transform duration-300 group-hover:scale-125 drop-shadow-lg relative z-10">
              {cat.image ? (
                <img src={cat.image} alt={cat.nameAr} className="w-14 h-14 object-cover rounded-full" style={{ border: "2px solid rgba(201,169,110,0.4)" }} />
              ) : (
                <CategoryIcon id={cat.name} />
              )}
            </div>
            <h3 className="text-xl font-bold mb-2 transition-colors duration-300 relative z-10 text-center" style={{ color: "#C9A96E" }}>{cat.nameAr || cat.name}</h3>
            <p className="mb-4 text-center text-sm relative z-10" style={{ color: "#9AACAC" }}>{cat.description}</p>
            {cat.productsCount !== undefined && cat.productsCount > 0 && (
              <span className="mb-3 text-xs relative z-10 px-3 py-1 rounded-full" style={{ background: "rgba(74,155,160,0.15)", color: "#4A9BA0", border: "1px solid rgba(74,155,160,0.3)" }}>
                {cat.productsCount} منتج
              </span>
            )}
            <Link href={`/category/${cat._id}`} className="px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg relative z-10" style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}>تصفح القسم</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
