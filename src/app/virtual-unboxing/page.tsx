import React, { useState } from "react";

export default function VirtualUnboxingPage() {
  const [opened, setOpened] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-bold text-pink-700 text-center mb-2">افتح هديتك افتراضيًا!</h1>
        <p className="text-gray-600 text-center mb-4">اضغط على الصندوق لتكتشف المفاجأة قبل استلامها فعليًا.</p>
        <div className="flex flex-col items-center gap-4">
          {!opened ? (
            <button onClick={() => setOpened(true)} className="focus:outline-none">
              <span className="text-7xl">🎁</span>
              <div className="text-pink-600 font-bold mt-2">اضغط لفتح الهدية</div>
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-7xl">🌸</span>
              <div className="text-pink-700 font-bold text-xl">مبروك! هذه هديتك الافتراضية 🎉</div>
              <div className="text-gray-600">سيتم تسليم الهدية الحقيقية قريبًا.</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
