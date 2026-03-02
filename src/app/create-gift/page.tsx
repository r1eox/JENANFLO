'use client';
import React, { useState } from "react";
import Link from "next/link";

interface GiftSelections {
  base: string;
  flowers: string[];
  extras: string[];
  message: string;
}

export default function CreateGiftPage() {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState<GiftSelections>({
    base: '',
    flowers: [],
    extras: [],
    message: '',
  });

  const bases = [
    { id: 'box', name: 'صندوق فاخر', price: 50, icon: '📦' },
    { id: 'basket', name: 'سلة أنيقة', price: 40, icon: '🧺' },
    { id: 'vase', name: 'فازة كريستال', price: 80, icon: '🏺' },
  ];

  const flowers = [
    { id: 'roses', name: 'ورود حمراء', price: 30, icon: '🌹' },
    { id: 'tulips', name: 'توليب', price: 35, icon: '🌷' },
    { id: 'lilies', name: 'زنبق', price: 40, icon: '🌸' },
    { id: 'sunflowers', name: 'دوار الشمس', price: 25, icon: '🌻' },
  ];

  const extras = [
    { id: 'chocolate', name: 'شوكولاتة فاخرة', price: 45, icon: '🍫' },
    { id: 'teddy', name: 'دبدوب', price: 60, icon: '🧸' },
    { id: 'candle', name: 'شمعة معطرة', price: 35, icon: '🕯️' },
    { id: 'balloon', name: 'بالونات', price: 20, icon: '🎈' },
  ];

  return (
    <main className="min-h-screen p-6" style={{ background: "linear-gradient(180deg, #1E2A2A 0%, #2D3436 50%, #1E2A2A 100%)" }}>
      {/* Header */}
      <header className="w-full flex justify-between items-center py-4 mb-8" style={{ borderBottom: "1px solid rgba(74, 155, 160, 0.3)" }}>
        <Link href="/" className="text-2xl font-bold" style={{ color: "#C9A96E" }}>جنان فلو</Link>
      </header>

      {/* Page Title */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ background: "linear-gradient(180deg, #D4AF37, #C9A96E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🎁 اصنع هديتك
        </h1>
        <p className="text-lg" style={{ color: "#8B9A9A" }}>صمم هديتك الخاصة بلمستك الشخصية</p>
      </section>

      {/* Progress Steps */}
      <div className="flex justify-center gap-4 mb-12">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s ? 'scale-110' : ''}`}
              style={{ 
                background: step >= s ? 'linear-gradient(135deg, #4A9BA0, #2D8B8B)' : 'rgba(74, 155, 160, 0.2)',
                color: step >= s ? '#fff' : '#8B9A9A'
              }}
            >
              {s}
            </div>
            {s < 4 && <div className="w-12 h-1 mx-2" style={{ background: step > s ? '#4A9BA0' : 'rgba(74, 155, 160, 0.2)' }}></div>}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <section className="max-w-4xl mx-auto">
        {step === 1 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8" style={{ color: "#C9A96E" }}>اختر القاعدة</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bases.map((base) => (
                <div
                  key={base.id}
                  onClick={() => setSelections({...selections, base: base.id})}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${selections.base === base.id ? 'ring-2 ring-teal-400' : ''}`}
                  style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}
                >
                  <div className="text-5xl mb-4">{base.icon}</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#C9A96E" }}>{base.name}</h3>
                  <p style={{ color: "#D4AF37" }}>{base.price} ر.س</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8" style={{ color: "#C9A96E" }}>اختر الزهور</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {flowers.map((flower) => (
                <div
                  key={flower.id}
                  onClick={() => {
                    const newFlowers = selections.flowers.includes(flower.id) 
                      ? selections.flowers.filter(f => f !== flower.id)
                      : [...selections.flowers, flower.id];
                    setSelections({...selections, flowers: newFlowers});
                  }}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${selections.flowers.includes(flower.id) ? 'ring-2 ring-teal-400' : ''}`}
                  style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}
                >
                  <div className="text-4xl mb-3">{flower.icon}</div>
                  <h3 className="font-bold mb-1" style={{ color: "#C9A96E" }}>{flower.name}</h3>
                  <p className="text-sm" style={{ color: "#D4AF37" }}>{flower.price} ر.س</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8" style={{ color: "#C9A96E" }}>أضف لمسات إضافية</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {extras.map((extra) => (
                <div
                  key={extra.id}
                  onClick={() => {
                    const newExtras = selections.extras.includes(extra.id) 
                      ? selections.extras.filter(e => e !== extra.id)
                      : [...selections.extras, extra.id];
                    setSelections({...selections, extras: newExtras});
                  }}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${selections.extras.includes(extra.id) ? 'ring-2 ring-teal-400' : ''}`}
                  style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}
                >
                  <div className="text-4xl mb-3">{extra.icon}</div>
                  <h3 className="font-bold mb-1" style={{ color: "#C9A96E" }}>{extra.name}</h3>
                  <p className="text-sm" style={{ color: "#D4AF37" }}>{extra.price} ر.س</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8" style={{ color: "#C9A96E" }}>أضف رسالتك</h2>
            <textarea
              value={selections.message}
              onChange={(e) => setSelections({...selections, message: e.target.value})}
              placeholder="اكتب رسالتك هنا..."
              className="w-full max-w-xl p-4 rounded-xl text-right"
              style={{ background: "rgba(45, 52, 54, 0.8)", border: "1px solid rgba(201, 169, 110, 0.3)", color: "#fff", minHeight: "150px" }}
            />
            <div className="mt-8 p-6 rounded-2xl max-w-xl mx-auto" style={{ background: "linear-gradient(145deg, #2D3436, #1E2A2A)", border: "1px solid rgba(201, 169, 110, 0.2)" }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: "#C9A96E" }}>ملخص الطلب</h3>
              <p style={{ color: "#9AACAC" }}>القاعدة: {bases.find(b => b.id === selections.base)?.name || '-'}</p>
              <p style={{ color: "#9AACAC" }}>الزهور: {selections.flowers.map(f => flowers.find(fl => fl.id === f)?.name).join(', ') || '-'}</p>
              <p style={{ color: "#9AACAC" }}>الإضافات: {selections.extras.map(e => extras.find(ex => ex.id === e)?.name).join(', ') || '-'}</p>
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(201, 169, 110, 0.2)" }}>
                <span className="text-2xl font-bold" style={{ color: "#D4AF37" }}>
                  الإجمالي: {
                    (bases.find(b => b.id === selections.base)?.price || 0) +
                    selections.flowers.reduce((sum, f) => sum + (flowers.find(fl => fl.id === f)?.price || 0), 0) +
                    selections.extras.reduce((sum, e) => sum + (extras.find(ex => ex.id === e)?.price || 0), 0)
                  } ر.س
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-8 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105"
              style={{ background: "rgba(201, 169, 110, 0.2)", color: "#C9A96E", border: "1px solid #C9A96E" }}
            >
              السابق
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-8 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #4A9BA0, #2D8B8B)", color: "#fff" }}
            >
              التالي
            </button>
          ) : (
            <button
              className="px-8 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #D4AF37, #C9A96E)", color: "#1E2A2A" }}
            >
              إتمام الطلب 🎉
            </button>
          )}
        </div>
      </section>

      {/* Back Button */}
      <div className="text-center mt-12">
        <Link href="/" className="inline-block px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105" style={{ background: "rgba(201, 169, 110, 0.2)", color: "#C9A96E", border: "1px solid #C9A96E" }}>
          ← العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
