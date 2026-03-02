import React, { useState } from "react";

const suggestions = [
  "عيد ميلاد سعيد! أتمنى لك يوماً جميلاً مليئاً بالفرح.",
  "مبروك التخرج! بداية جديدة لمستقبل مشرق.",
  "كل عام وأنت بخير بمناسبة عيد الأم، شكراً لحنانك ودعمك الدائم.",
  "أعتذر منك وأتمنى أن تسامحني، أنت شخص غالٍ عليّ.",
];

export default function AiGreetingPage() {
  const [occasion, setOccasion] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = () => {
    // في التطبيق الفعلي: يمكن ربط الذكاء الاصطناعي هنا
    if (!occasion) return;
    setResult(suggestions[Math.floor(Math.random() * suggestions.length)]);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-bold text-pink-700 text-center mb-2">مولد رسائل التهنئة الذكي</h1>
        <p className="text-gray-600 text-center mb-4">اختر المناسبة وسيتم اقتراح رسالة تهنئة مناسبة تلقائياً.</p>
        <input type="text" placeholder="اكتب المناسبة (عيد ميلاد، تخرج، ...الخ)" className="border rounded p-3 w-full" value={occasion} onChange={e => setOccasion(e.target.value)} />
        <button onClick={handleGenerate} className="bg-pink-600 text-white py-3 rounded font-bold hover:bg-pink-700 transition w-full">اقتراح رسالة</button>
        {result && (
          <div className="bg-pink-50 border border-pink-200 rounded p-4 mt-4 text-center">
            <p className="text-pink-700 font-bold mb-2">رسالة مقترحة:</p>
            <span className="text-gray-700">{result}</span>
          </div>
        )}
      </div>
    </main>
  );
}
