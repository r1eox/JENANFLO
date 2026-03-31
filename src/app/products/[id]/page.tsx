'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { products as localProducts } from "../data";
import { getUD, setUD } from "@/lib/userStorage";

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
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const localFound = localProducts.find((p) =>
          p.id === params.id || p.name === decodeURIComponent(params.id as string)
        );
        if (localFound) {
          const pId = localFound.id;
          setProduct({ ...localFound, _id: pId });
          const wl = getUD<{id:string}[]>('jenanflo_wishlist', []);
          setIsWishlisted(wl.some((w) => w.id === pId));
          const related = localProducts.filter(p => p.category === localFound.category && p.id !== localFound.id).slice(0, 4);
          setRelatedProducts(related.map(p => ({ ...p, _id: p.id })));
          setLoading(false);
          return;
        }
        const res = await fetch(`/api/products/${encodeURIComponent(params.id as string)}`);
        if (res.ok) {
          const found = await res.json();
          setProduct(found);
          const pId = found?._id || found?.id || '';
          if (pId) {
            const wl = getUD<{id:string}[]>('jenanflo_wishlist', []);
            setIsWishlisted(wl.some((w) => w.id === pId));
          }
          try {
            const allRes = await fetch('/api/products');
            if (allRes.ok) {
              const all: Product[] = await allRes.json();
              const related = all.filter(p => p.category === found.category && (p._id || p.id) !== pId).slice(0, 4);
              setRelatedProducts(related);
            }
          } catch {}
        } else {
          const fallback = await fetch('/api/products');
          if (fallback.ok) {
            const all = await fallback.json();
            const found = all.find((p: Product) => p._id === params.id || p.id === params.id);
            setProduct(found || null);
          }
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
    const cart = getUD<{_id:string; quantity:number}[]>('jenanflo_cart', []);
    const existingIndex = cart.findIndex((item) => item._id === productId);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
      if (giftMessage) (cart[existingIndex] as Record<string,unknown>).giftMessage = giftMessage;
    } else {
      cart.push({ _id: productId, name: product.name, price: product.price, image: product.image, quantity, giftMessage } as never);
    }
    setUD('jenanflo_cart', cart);
    window.dispatchEvent(new Event('cart-updated'));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const toggleWishlist = () => {
    if (!product) return;
    const pId = product._id || product.id || '';
    const wl: { id: string; name: string; price: number; image: string }[] =
      getUD('jenanflo_wishlist', []);
    let next;
    if (wl.some(w => w.id === pId)) {
      next = wl.filter(w => w.id !== pId);
      setIsWishlisted(false);
    } else {
      next = [...wl, { id: pId, name: product.name, price: product.price, image: product.image }];
      setIsWishlisted(true);
    }
    setUD('jenanflo_wishlist', next);
  };

  const shareProduct = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: product?.name, text: product?.description, url });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      });
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 100%)" }}>
        <div className="animate-pulse text-center">
          <div className="text-4xl mb-4">&#127800;</div>
          <p style={{ color: "#C9A96E" }}>&#1580;&#1575;&#1585;&#1610; &#1575;&#1604;&#1578;&#1581;&#1605;&#1610;&#1604;...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 100%)" }}>
        <div className="text-6xl mb-4">&#128532;</div>
        <h1 className="text-2xl font-bold mb-4" style={{ color: "#C9A96E" }}>&#1575;&#1604;&#1605;&#1606;&#1578;&#1580; &#1594;&#1610;&#1585; &#1605;&#1608;&#1580;&#1608;&#1583;</h1>
        <Link href="/" className="px-6 py-3 rounded-full" style={{ background: "#4A9BA0", color: "#fff" }}>
          &#1575;&#1604;&#1593;&#1608;&#1583;&#1577; &#1604;&#1604;&#1585;&#1574;&#1610;&#1587;&#1610;&#1577;
        </Link>
      </main>
    );
  }

  const productId = product._id || product.id || '';
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const isInStock = !product.stock || product.stock > 0;

  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 100%)" }}>
      <header className="w-full flex justify-between items-center px-6 py-4" style={{ borderBottom: "1px solid rgba(74,155,160,0.3)" }}>
        <Link href="/" className="text-2xl font-bold" style={{ color: "#C9A96E" }}>&#1580;&#1606;&#1575;&#1606; &#1601;&#1604;&#1608;</Link>
        <div className="flex items-center gap-3">
          <button
            onClick={shareProduct}
            className="px-3 py-2 rounded-full text-sm transition hover:scale-105"
            style={{ background: "rgba(74,155,160,0.15)", color: "#4A9BA0", border: "1px solid rgba(74,155,160,0.3)" }}
          >
            {shareCopied ? <span>&#10003; &#1578;&#1605; &#1575;&#1604;&#1606;&#1587;&#1582;</span> : <span>&#128279; &#1605;&#1588;&#1575;&#1585;&#1603;&#1577;</span>}
          </button>
          <Link href="/cart" className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(74,155,160,0.2)", color: "#4A9BA0" }}>
            <span>&#128722;</span>
            <span>&#1575;&#1604;&#1587;&#1604;&#1577;</span>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: "#8B9A9A" }}>
          <Link href="/" className="hover:underline" style={{ color: "#4A9BA0" }}>&#1575;&#1604;&#1585;&#1574;&#1610;&#1587;&#1610;&#1577;</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/${product.category}`} className="hover:underline capitalize" style={{ color: "#4A9BA0" }}>{product.category}</Link>
              <span>/</span>
            </>
          )}
          <span style={{ color: "#C9A96E" }}>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ border: "2px solid rgba(201,169,110,0.3)" }}>
              <img src={product.image} alt={product.name} className="w-full h-96 lg:h-[480px] object-cover" />
            </div>
            <button
              onClick={toggleWishlist}
              className="absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 shadow-lg"
              style={{
                background: isWishlisted ? "rgba(212,175,55,0.9)" : "rgba(30,42,42,0.85)",
                border: `2px solid ${isWishlisted ? "#D4AF37" : "rgba(201,169,110,0.4)"}`,
                backdropFilter: "blur(8px)",
              }}
            >
              {isWishlisted ? "&#10084;&#65039;" : "&#129505;"}
            </button>
            {discount > 0 && (
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold" style={{ background: "#D4AF37", color: "#1E2A2A" }}>
                &#1608;&#1601;&#1617;&#1585; {discount}%
              </div>
            )}
            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: isInStock ? "rgba(74,155,160,0.85)" : "rgba(239,68,68,0.85)", color: "#fff", backdropFilter: "blur(8px)" }}>
              {isInStock
                ? (product.stock && product.stock <= 5 ? <span>&#9889; {product.stock} &#1605;&#1578;&#1576;&#1602;&#1610;&#1577; &#1601;&#1602;&#1591;!</span> : <span>&#10003; &#1605;&#1578;&#1608;&#1601;&#1585;</span>)
                : <span>&#10005; &#1606;&#1601;&#1583; &#1575;&#1604;&#1605;&#1582;&#1586;&#1608;&#1606;</span>}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "#C9A96E" }}>{product.name}</h1>
              <p className="text-base leading-relaxed" style={{ color: "#9AACAC" }}>{product.description}</p>
            </div>

            <div className="flex items-end gap-4">
              <span className="text-4xl font-bold" style={{ color: "#D4AF37" }}>{product.price} &#1585;.&#1587;</span>
              {product.originalPrice && (
                <div className="flex flex-col">
                  <span className="text-base line-through" style={{ color: "#666" }}>{product.originalPrice} &#1585;.&#1587;</span>
                  <span className="text-xs font-bold" style={{ color: "#4A9BA0" }}>&#1608;&#1601;&#1617;&#1585;&#1578; {product.originalPrice - product.price} &#1585;.&#1587;</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium" style={{ color: "#C9A96E" }}>&#1575;&#1604;&#1603;&#1605;&#1610;&#1577;:</span>
              <div className="flex items-center gap-3 p-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.2)" }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition hover:scale-110" style={{ background: "rgba(74,155,160,0.2)", color: "#4A9BA0" }}>&#8722;</button>
                <span className="text-xl font-bold w-10 text-center" style={{ color: "#fff" }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition hover:scale-110" style={{ background: "rgba(74,155,160,0.2)", color: "#4A9BA0" }}>+</button>
              </div>
              <span className="text-sm" style={{ color: "#8B9A9A" }}>
                &#1575;&#1604;&#1573;&#1580;&#1605;&#1575;&#1604;&#1610;: <strong style={{ color: "#D4AF37" }}>{product.price * quantity} &#1585;.&#1587;</strong>
              </span>
            </div>

            <div>
              <label className="block mb-2" style={{ color: "#C9A96E" }}>&#128140; &#1585;&#1587;&#1575;&#1604;&#1577; &#1575;&#1604;&#1607;&#1583;&#1610;&#1577; (&#1575;&#1582;&#1578;&#1610;&#1575;&#1585;&#1610;):</label>
              <textarea
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="اكتب رسالتك الخاصة هنا..."
                className="w-full p-4 rounded-xl resize-none"
                rows={3}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.3)", color: "#fff" }}
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={addToCart}
                disabled={!isInStock}
                className={`w-full py-4 rounded-full text-lg font-bold transition-all duration-300 ${addedToCart ? 'scale-95' : 'hover:scale-105'} disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{
                  background: addedToCart ? "linear-gradient(135deg, #2D8B8B, #4A9BA0)" : "linear-gradient(135deg, #C9A96E, #D4AF37)",
                  color: addedToCart ? "#fff" : "#1E2A2A",
                  boxShadow: "0 4px 20px rgba(201,169,110,0.3)"
                }}
              >
                {addedToCart ? <span>&#10003; &#1578;&#1605;&#1578; &#1575;&#1604;&#1573;&#1590;&#1575;&#1601;&#1577; &#1604;&#1604;&#1587;&#1604;&#1577;!</span> : <span>&#128722; &#1571;&#1590;&#1601; &#1573;&#1604;&#1609; &#1575;&#1604;&#1587;&#1604;&#1577;</span>}
              </button>

              <Link
                href={`/checkout?product=${productId}&qty=${quantity}&msg=${encodeURIComponent(giftMessage)}`}
                className="w-full py-4 rounded-full text-lg font-bold text-center transition-all duration-300 hover:scale-105 block"
                style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff", boxShadow: "0 4px 20px rgba(74,155,160,0.3)" }}
              >
                &#9889; &#1575;&#1588;&#1578;&#1585;&#1616; &#1575;&#1604;&#1570;&#1606;
              </Link>

              <button
                onClick={toggleWishlist}
                className="w-full py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: isWishlisted ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.04)",
                  color: isWishlisted ? "#D4AF37" : "#9AACAC",
                  border: `1px solid ${isWishlisted ? "#D4AF37" : "rgba(255,255,255,0.1)"}`,
                }}
              >
                {isWishlisted ? <span>&#10084;&#65039; &#1605;&#1581;&#1601;&#1608;&#1592; &#1601;&#1610; &#1575;&#1604;&#1605;&#1601;&#1590;&#1604;&#1577;</span> : <span>&#129505; &#1571;&#1590;&#1601; &#1604;&#1604;&#1605;&#1601;&#1590;&#1604;&#1577;</span>}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              {[
                { icon: "&#128666;", text: "&#1578;&#1608;&#1589;&#1610;&#1604; &#1587;&#1585;&#1610;&#1593; 2-4 &#1587;&#1575;&#1593;&#1575;&#1578;" },
                { icon: "&#127873;", text: "&#1578;&#1594;&#1604;&#1610;&#1601; &#1601;&#1575;&#1582;&#1585; &#1605;&#1580;&#1575;&#1606;&#1575;&#1611;" },
                { icon: "&#128144;", text: "&#1608;&#1585;&#1608;&#1583; &#1591;&#1575;&#1586;&#1580;&#1577; 100%" },
                { icon: "&#128260;", text: "&#1590;&#1605;&#1575;&#1606; &#1575;&#1604;&#1575;&#1587;&#1578;&#1576;&#1583;&#1575;&#1604;" },
              ].map(f => (
                <div key={f.text} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: "rgba(74,155,160,0.08)", border: "1px solid rgba(74,155,160,0.15)" }}>
                  <span className="text-lg" dangerouslySetInnerHTML={{ __html: f.icon }} />
                  <span className="text-xs" style={{ color: "#9AACAC" }} dangerouslySetInnerHTML={{ __html: f.text }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: "#C9A96E" }}>&#10024; &#1602;&#1583; &#1610;&#1593;&#1580;&#1576;&#1603; &#1571;&#1610;&#1590;&#1575;&#1611;</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(rp => {
                const rpId = rp._id || rp.id || '';
                return (
                  <Link key={rpId} href={`/products/${rpId}`} className="group block">
                    <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.15)" }}>
                      <img src={rp.image} alt={rp.name} className="w-full h-40 object-cover" />
                      <div className="p-3">
                        <h3 className="font-bold text-sm mb-1 line-clamp-1" style={{ color: "#fff" }}>{rp.name}</h3>
                        <span className="font-bold text-sm" style={{ color: "#D4AF37" }}>{rp.price} &#1585;.&#1587;</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/" className="inline-block px-8 py-3 rounded-full font-semibold transition hover:scale-105" style={{ background: "rgba(201,169,110,0.15)", color: "#C9A96E", border: "1px solid rgba(201,169,110,0.4)" }}>
            &#8594; &#1578;&#1589;&#1601;&#1581; &#1575;&#1604;&#1605;&#1586;&#1610;&#1583;
          </Link>
        </div>
      </div>
    </main>
  );
}