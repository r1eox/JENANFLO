import React from "react";

const gallery = [
  { id: 1, name: "سارة", image: "/images/customer1.jpg", message: "أجمل هدية وصلتني!" },
  { id: 2, name: "محمد", image: "/images/customer2.jpg", message: "تجربة رائعة وخدمة سريعة." },
  // ... يمكن إضافة المزيد لاحقاً
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-bold text-pink-700 text-center mb-2">معرض صور عملائنا</h1>
        <p className="text-gray-600 text-center mb-4">صور حقيقية من عملائنا مع هداياهم (بإذنهم).</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {gallery.map(item => (
            <div key={item.id} className="flex flex-col items-center border rounded-xl p-4 bg-pink-50">
              <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-full border-4 border-pink-200 mb-2" />
              <span className="font-bold text-pink-700">{item.name}</span>
              <p className="text-gray-600 text-center mt-2">{item.message}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
