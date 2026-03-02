import React, { useState } from "react";
import dynamic from "next/dynamic";

export default function LocationPage() {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [phone, setPhone] = useState("");
  const [recipient, setRecipient] = useState("");

  // استيراد مكون الخريطة بشكل ديناميكي لتجنب مشاكل SSR
  const GoogleMapPicker = dynamic(() => import("./GoogleMapPicker"), { ssr: false });

  const handleLocationSelect = (lat: number, lng: number) => {
    setLat(lat);
    setLng(lng);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lat || !lng) {
      alert("يرجى تحديد الموقع على الخريطة");
      return;
    }
    // إرسال البيانات إلى السيرفر أو الطلب
    alert(`تم حفظ الموقع: (${lat}, ${lng}) ورقم الجوال بنجاح!`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-pink-700 text-center mb-4">تحديد موقع التوصيل</h1>
        <GoogleMapPicker onLocationSelect={handleLocationSelect} />
        {lat && lng && (
          <div className="text-green-600 text-center">تم تحديد الموقع: ({lat.toFixed(5)}, {lng.toFixed(5)})</div>
        )}
        <input type="text" placeholder="رقم الجوال للتواصل" className="border rounded p-3" value={phone} onChange={e => setPhone(e.target.value)} required />
        <input type="text" placeholder="اسم مستلم الهدية (اختياري)" className="border rounded p-3" value={recipient} onChange={e => setRecipient(e.target.value)} />
        <button type="submit" className="bg-pink-600 text-white py-3 rounded font-bold hover:bg-pink-700 transition">تأكيد الطلب</button>
      </form>
    </main>
  );
}
