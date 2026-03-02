"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

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
};

export default function AdminProducts() {
  // الأقسام
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({ name: "", nameAr: "", description: "", image: "" });

  // المنتجات
  const [products, setProducts] = useState<Product[]>([]);
  const [showProdModal, setShowProdModal] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    image: "",
    category: "",
    stock: "10",
  });

  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [loading, setLoading] = useState(true);

  // تحميل البيانات من API
  const loadData = async () => {
    try {
      setLoading(true);
      const [catsRes, prodsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products')
      ]);
      
      if (catsRes.ok) {
        const catsData = await catsRes.json();
        setCategories(catsData);
      }
      
      if (prodsRes.ok) {
        const prodsData = await prodsRes.json();
        setProducts(prodsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // حفظ القسم
  const handleSaveCategory = async () => {
    if (!catForm.nameAr) return;
    
    try {
      if (editingCat) {
        // تعديل
        const res = await fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: editingCat._id, ...catForm })
        });
        if (res.ok) {
          const updated = await res.json();
          setCategories(prev => prev.map(c => c._id === editingCat._id ? updated : c));
        }
      } else {
        // إضافة جديد
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(catForm)
        });
        if (res.ok) {
          const newCat = await res.json();
          setCategories(prev => [...prev, newCat]);
        }
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
    setShowCatModal(false);
    setEditingCat(null);
    setCatForm({ name: "", nameAr: "", description: "", image: "" });
  };

  // حذف القسم
  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا القسم؟")) {
      try {
        const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setCategories(prev => prev.filter(c => c._id !== id));
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  // حفظ المنتج
  const handleSaveProduct = async () => {
    if (!prodForm.name || !prodForm.price) return;
    const productData = {
      name: prodForm.name,
      description: prodForm.description,
      price: Number(prodForm.price),
      originalPrice: prodForm.originalPrice ? Number(prodForm.originalPrice) : undefined,
      image: prodForm.image,
      category: prodForm.category,
      stock: Number(prodForm.stock),
      active: true,
    };
    
    try {
      if (editingProd) {
        const res = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: editingProd._id, ...productData })
        });
        if (res.ok) {
          const updated = await res.json();
          setProducts(prev => prev.map(p => p._id === editingProd._id ? updated : p));
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        if (res.ok) {
          const newProd = await res.json();
          setProducts(prev => [...prev, newProd]);
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
    setShowProdModal(false);
    setEditingProd(null);
    setProdForm({ name: "", description: "", price: "", originalPrice: "", image: "", category: "", stock: "10" });
  };

  // حذف المنتج
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setProducts(prev => prev.filter(p => p._id !== id));
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // تعديل القسم
  const editCategory = (cat: Category) => {
    setEditingCat(cat);
    setCatForm({ name: cat.name, nameAr: cat.nameAr, description: cat.description || "", image: cat.image || "" });
    setShowCatModal(true);
  };

  // تعديل المنتج
  const editProduct = (prod: Product) => {
    setEditingProd(prod);
    setProdForm({
      name: prod.name,
      description: prod.description || "",
      price: prod.price.toString(),
      originalPrice: prod.originalPrice?.toString() || "",
      image: prod.image || "",
      category: prod.category || "",
      stock: prod.stock?.toString() || "10",
    });
    setShowProdModal(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1E2A2A] to-[#2D3436] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin" className="text-[#4A9BA0] hover:underline text-sm mb-2 inline-block">← العودة للوحة التحكم</Link>
          <h1 className="text-3xl font-bold text-[#C9A96E]">المنتجات والأقسام</h1>
        </div>
        <button
          className="bg-[#C9A96E] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#D4AF37] transition flex items-center gap-2"
          onClick={() => {
            if (activeTab === "products") {
              setEditingProd(null);
              setProdForm({ name: "", description: "", price: "", originalPrice: "", image: "", category: "", stock: "10" });
              setShowProdModal(true);
            } else {
              setEditingCat(null);
              setCatForm({ name: "", nameAr: "", description: "", image: "" });
              setShowCatModal(true);
            }
          }}
        >
          <span>+</span> إضافة {activeTab === "products" ? "منتج" : "قسم"}
        </button>
      </div>

      {/* التبويبات */}
      <div className="flex gap-4 mb-8">
        <button
          className={`px-6 py-3 rounded-lg font-medium transition ${
            activeTab === "products" ? "bg-[#C9A96E] text-black" : "bg-white/10 text-white hover:bg-white/20"
          }`}
          onClick={() => setActiveTab("products")}
        >
          🛍️ المنتجات ({products.length})
        </button>
        <button
          className={`px-6 py-3 rounded-lg font-medium transition ${
            activeTab === "categories" ? "bg-[#C9A96E] text-black" : "bg-white/10 text-white hover:bg-white/20"
          }`}
          onClick={() => setActiveTab("categories")}
        >
          📁 الأقسام ({categories.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">جاري التحميل...</div>
      ) : activeTab === "products" ? (
        /* المنتجات */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div key={prod._id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-white/30 transition group">
              <div className="relative h-48">
                {prod.image ? (
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center text-4xl">🌸</div>
                )}
                {prod.originalPrice && prod.originalPrice > prod.price && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                    خصم {Math.round((1 - prod.price / prod.originalPrice) * 100)}%
                  </span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium"
                    onClick={() => editProduct(prod)}
                  >
                    ✏️ تعديل
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    onClick={() => handleDeleteProduct(prod._id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold mb-1">{prod.name}</h3>
                <p className="text-gray-400 text-sm mb-2 line-clamp-1">{prod.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[#C9A96E] font-bold">{prod.price} ر.س</span>
                    {prod.originalPrice && prod.originalPrice > prod.price && (
                      <span className="text-gray-500 line-through text-sm mr-2">{prod.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs">📦 {prod.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* الأقسام */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-white/30 transition group">
              <div className="relative h-40">
                {cat.image ? (
                  <img src={cat.image} alt={cat.nameAr} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center text-4xl">📁</div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium"
                    onClick={() => editCategory(cat)}
                  >
                    ✏️ تعديل
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    onClick={() => handleDeleteCategory(cat._id)}
                  >
                    🗑️
                  </button>
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

      {/* مودال المنتج */}
      {showProdModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-6">
          <div className="bg-[#1E2A2A] rounded-2xl p-6 w-full max-w-lg border border-white/10 my-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              {editingProd ? "✏️ تعديل المنتج" : "➕ إضافة منتج جديد"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">اسم المنتج *</label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  placeholder="مثال: سيمفونية الربيع"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm block mb-2">الوصف</label>
                <textarea
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white h-20"
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  placeholder="وصف المنتج..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">السعر *</label>
                  <input
                    type="number"
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    placeholder="250"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-2">السعر قبل الخصم</label>
                  <input
                    type="number"
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                    value={prodForm.originalPrice}
                    onChange={(e) => setProdForm({ ...prodForm, originalPrice: e.target.value })}
                    placeholder="300"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm block mb-2">رابط الصورة</label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  value={prodForm.image}
                  onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                  placeholder="https://..."
                />
                {prodForm.image && (
                  <img src={prodForm.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">القسم</label>
                  <select
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                  >
                    <option value="" className="bg-[#1E2A2A]">اختر القسم</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name} className="bg-[#1E2A2A]">{cat.nameAr}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-2">المخزون</label>
                  <input
                    type="number"
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                    placeholder="10"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                className="flex-1 bg-[#C9A96E] text-black py-3 rounded-lg font-medium hover:bg-[#D4AF37] transition"
                onClick={handleSaveProduct}
              >
                💾 حفظ
              </button>
              <button
                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                onClick={() => setShowProdModal(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال القسم */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2A2A] rounded-2xl p-6 w-full max-w-lg border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">
              {editingCat ? "✏️ تعديل القسم" : "➕ إضافة قسم جديد"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">الاسم بالعربي *</label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  value={catForm.nameAr}
                  onChange={(e) => setCatForm({ ...catForm, nameAr: e.target.value })}
                  placeholder="مثال: حديقة الأحلام"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm block mb-2">الاسم الإنجليزي (للرابط)</label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="مثال: flowers"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm block mb-2">الوصف</label>
                <textarea
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white h-20"
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  placeholder="وصف القسم..."
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm block mb-2">رابط الصورة</label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  value={catForm.image}
                  onChange={(e) => setCatForm({ ...catForm, image: e.target.value })}
                  placeholder="https://..."
                />
                {catForm.image && (
                  <img src={catForm.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
                )}
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                className="flex-1 bg-[#C9A96E] text-black py-3 rounded-lg font-medium hover:bg-[#D4AF37] transition"
                onClick={handleSaveCategory}
              >
                💾 حفظ
              </button>
              <button
                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                onClick={() => setShowCatModal(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
