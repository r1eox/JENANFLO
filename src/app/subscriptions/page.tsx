'use client';
import React, { useState } from "react";

const plans = [
  { id: 1, name: "باقة ورد شهرية", price: 199, description: "استلم باقة ورد جديدة كل شهر مع توصيل مجاني وتغليف فاخر." },
  { id: 2, name: "اشتراك هدايا موسمية", price: 299, description: "هدايا موسمية مميزة تُرسل تلقائياً في المناسبات الخاصة." },
];

export default function SubscriptionsPage() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-bold text-pink-700 text-center mb-2">اشترك في باقات الورد والهدايا</h1>
        <p className="text-gray-600 text-center mb-4">استمتع بتجربة فريدة مع باقات شهرية أو موسمية تصل إلى باب منزلك تلقائياً.</p>
        <div className="w-full flex flex-col gap-4">
          {plans.map(plan => (
            <div key={plan.id} className={`border rounded-xl p-4 ${selected === plan.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
              onClick={() => setSelected(plan.id)} style={{ cursor: 'pointer' }}>
              <h2 className="font-bold text-lg text-pink-700 mb-1">{plan.name}</h2>
              <p className="text-gray-600 mb-2">{plan.description}</p>
              <span className="font-bold text-pink-600">{plan.price} ر.س / شهر</span>
            </div>
          ))}
        </div>
        <button disabled={selected === null} className="bg-pink-600 text-white py-3 rounded font-bold hover:bg-pink-700 transition w-full mt-4 disabled:opacity-50">اشترك الآن</button>
      </div>
    </main>
  );
}
