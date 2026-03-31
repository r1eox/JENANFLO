'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ImageUploader from "@/app/_components/ImageUploader";

type Category = {
  _id: string;
  name: string;
  nameAr: string;
  description?: string;
  image?: string;
  productsCount?: number;
};

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category?: string;
  stock?: number;
  active?: boolean;
  featured?: boolean;
};

export default function AdminProducts() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({ name: "", nameAr: "", description: "", image: "" });

  const [products, setProducts] = useState<Product[]>([]);
  const [showProdModal, setShowProdModal] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState({
    name: "", description: "", price: "", originalPrice: "", image: "", category: "", stock: "10", featured: false,
  });

  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [catsRes, prodsRes] = await Promise.all([fetch('/api/categories'), fetch('/api/products')]);
      if (catsRes.ok) setCategories(await catsRes.json());
      if (prodsRes.ok) setProducts(await prodsRes.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSaveCategory = async () => {
    if (!catForm.nameAr) return;
    try {
      if (editingCat) {
        const res = await fetch('/api/categories', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: editingCat._id, ...catForm }) });
        if (res.ok) { const u = await res.json(); setCategories(prev => prev.map(c => c._id === editingCat._id ? u : c)); }
      } else {
        const res = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(catForm) });
        if (res.ok) setCategories(prev => [...prev, res.json() as unknown as Category]);
        await loadData();
      }
    } catch (e) { console.error(e); }
    setShowCatModal(false); setEditingCat(null); setCatForm({ name: "", nameAr: "", description: "", image: "" });
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التصنيف؟")) return;
    const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    if (res.ok) setCategories(prev => prev.filter(c => c._id !== id));
  };

  const handleSaveProduct = async () => {
    if (!prodForm.name || !prodForm.price) return;
    const productData = {
      name: prodForm.name, description: prodForm.description,
      price: Number(prodForm.price),
      originalPrice: prodForm.originalPrice ? Number(prodForm.originalPrice) : undefined,
      image: prodForm.image, category: prodForm.category, stock: Number(prodForm.stock), active: true,
      featured: prodForm.featured,
    };
    try {
      if (editingProd) {
        const res = await fetch('/api/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: editingProd._id, ...productData }) });
        if (res.ok) { const u = await res.json(); setProducts(prev => prev.map(p => p._id === editingProd._id ? u : p)); }
      } else {
        const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData) });
        if (res.ok) { const n = await res.json(); setProducts(prev => [...prev, n]); }
      }
    } catch (e) { console.error(e); }
    setShowProdModal(false); setEditingProd(null);
    setProdForm({ name: "", description: "", price: "", originalPrice: "", image: "", category: "", stock: "10", featured: false });
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    if (res.ok) setProducts(prev => prev.filter(p => p._id !== id));
  };

  const editCategory = (cat: Category) => {
    setEditingCat(cat);
    setCatForm({ name: cat.name, nameAr: cat.nameAr, description: cat.description || "", image: cat.image || "" });
    setShowCatModal(true);
  };

  const editProduct = (prod: Product) => {
    setEditingProd(prod);
    setProdForm({ name: prod.name, description: prod.description || "", price: prod.price.toString(), originalPrice: prod.originalPrice?.toString() || "", image: prod.image || "", category: prod.category || "", stock: prod.stock?.toString() || "10", featured: prod.featured || false });
    setShowProdModal(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1E2A2A] to-[#2D3436] p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin" className="text-[#4A9BA0] hover:underline text-sm mb-2 inline-block">&#8594; العودة للوحة التحكم</Link>
          <h1 className="text-3xl font-bold text-[#C9A96E]">إدارة المنتجات</h1>
        </div>
        <button
          className="bg-[#C9A96E] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#D4AF37] transition flex items-center gap-2"
          onClick={() => {
            if (activeTab === "products") { setEditingProd(null); setProdForm({ name: "", description: "", price: "", originalPrice: "", image: "", category: "", stock: "10", featured: false }); setShowProdModal(true); }
            else { setEditingCat(null); setCatForm({ name: "", nameAr: "", description: "", image: "" }); setShowCatModal(true); }
          }}
        >
          + إضافة {activeTab === "products" ? "منتج" : "تصنيف"}
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        {(["products", "categories"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-6 py-3 rounded-lg font-medium transition ${activeTab === t ? "bg-[#C9A96E] text-black" : "bg-white/10 text-white hover:bg-white/20"}`}>
            {t === "products" ? `كل المنتجات (${products.length})` : `التصنيفات (${categories.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">جاري التحميل...</div>
      ) : activeTab === "products" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(prod => (
              <div key={prod._id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-white/30 transition group relative">
              {prod.featured && (
                <span className="absolute top-2 left-2 z-10 bg-[#D4AF37] text-black text-xs font-bold px-2 py-1 rounded-full">&#11088; مميز</span>
              )}
              <div className="relative h-48">
                {prod.image ? <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-white/10 flex items-center justify-center text-4xl">&#127873;</div>}
                {prod.originalPrice && prod.originalPrice > prod.price && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">خصم {Math.round((1 - prod.price / prod.originalPrice) * 100)}%</span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 flex-wrap p-2">
                  <button className="bg-white text-black px-3 py-2 rounded-lg text-sm font-medium" onClick={() => editProduct(prod)}>&#9998; تعديل</button>
                  <Link href={`/products/${prod._id}`} target="_blank" className="bg-[#4A9BA0] text-white px-3 py-2 rounded-lg text-sm font-medium">&#128065; عرض</Link>
                  <button className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium" onClick={() => handleDeleteProduct(prod._id)}>&#128465; حذف</button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold mb-1">{prod.name}</h3>
                <p className="text-gray-400 text-sm mb-2 line-clamp-1">{prod.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[#C9A96E] font-bold">{prod.price} ر.س</span>
                    {prod.originalPrice && prod.originalPrice > prod.price && <span className="text-gray-500 line-through text-sm mr-2">{prod.originalPrice}</span>}
                  </div>
                  <span className="text-gray-400 text-xs">مخزون: {prod.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div key={cat._id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-white/30 transition group">
              <div className="relative h-40">
                {cat.image ? <img src={cat.image} alt={cat.nameAr} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-white/10 flex items-center justify-center text-4xl">&#128193;</div>}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium" onClick={() => editCategory(cat)}>&#9998; تعديل</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium" onClick={() => handleDeleteCategory(cat._id)}>&#128465; حذف</button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold mb-1">{cat.nameAr}</h3>
                <p className="text-gray-400 text-sm mb-2">{cat.description}</p>
                <span className="text-[#4A9BA0] text-sm">{cat.productsCount} منتج</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showProdModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto p-6">
          <div className="bg-[#1E2A2A] rounded-2xl p-6 w-full max-w-lg border border-white/10 my-8">
            <h3 className="text-2xl font-bold text-white mb-6">{editingProd ? "تعديل بيانات المنتج" : "إضافة منتج جديد"}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">اسم المنتج *</label>
                <input type="text" className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} placeholder="مثال: باقة ورد فاخرة" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">الوصف</label>
                <textarea className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white h-20 placeholder-gray-500" value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} placeholder="وصف المنتج..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">السعر *</label>
                  <input type="number" className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} placeholder="250" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-2">السعر قبل الخصم</label>
                  <input type="number" className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500" value={prodForm.originalPrice} onChange={e => setProdForm({...prodForm, originalPrice: e.target.value})} placeholder="300" />
                </div>
              </div>
              <ImageUploader currentImage={prodForm.image} onImageUploaded={url => setProdForm({...prodForm, image: url})} label="صورة المنتج" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">التصنيف</label>
                  <select className="w-full bg-[#1E2A2A] border border-white/20 rounded-lg p-3 text-white" value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})}>
                    <option value="">بدون تصنيف</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id} className="bg-[#1E2A2A]">{cat.nameAr}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-2">المخزون</label>
                  <input type="number" className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500" value={prodForm.stock} onChange={e => setProdForm({...prodForm, stock: e.target.value})} placeholder="10" />
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={prodForm.featured}
                  onChange={e => setProdForm({...prodForm, featured: e.target.checked})}
                  className="w-5 h-5 accent-[#D4AF37] cursor-pointer"
                />
                <label htmlFor="featured-toggle" className="text-white font-medium cursor-pointer select-none">
                  &#11088; إظهار في المنتجات المميزة على الصفحة الرئيسية
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button className="flex-1 bg-[#C9A96E] text-black py-3 rounded-lg font-medium hover:bg-[#D4AF37] transition" onClick={handleSaveProduct}>حفظ</button>
              <button className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition" onClick={() => setShowProdModal(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {showCatModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1E2A2A] rounded-2xl p-6 w-full max-w-lg border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">{editingCat ? "تعديل بيانات التصنيف" : "إضافة تصنيف جديد"}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">الاسم بالعربي *</label>
                <input type="text" className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500" value={catForm.nameAr} onChange={e => setCatForm({...catForm, nameAr: e.target.value})} placeholder="مثال: باقات الورود" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">الاسم بالإنجليزي (Slug)</label>
                <input type="text" dir="ltr" className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} placeholder="flowers" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">الوصف</label>
                <textarea className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white h-20 placeholder-gray-500" value={catForm.description} onChange={e => setCatForm({...catForm, description: e.target.value})} placeholder="وصف التصنيف..." />
              </div>
              <ImageUploader currentImage={catForm.image} onImageUploaded={url => setCatForm({...catForm, image: url})} label="صورة التصنيف" />
            </div>
            <div className="flex gap-4 mt-6">
              <button className="flex-1 bg-[#C9A96E] text-black py-3 rounded-lg font-medium hover:bg-[#D4AF37] transition" onClick={handleSaveCategory}>حفظ</button>
              <button className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition" onClick={() => setShowCatModal(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}