import React, { useState } from "react";

export default function SecretGiftPage() {
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // في التطبيق الفعلي: يتم إنشاء طلب هدية سرية وتوليد رابط خاص للمستلم
    setLink("https://jenanflo.com/secret-gift/unique-code");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-bold text-pink-700 text-center mb-2">أرسل هدية سرية!</h1>
        <p className="text-gray-600 text-center mb-4">أدخل اسم المستلم ورسالة تهنئة، وسيصله رابط خاص لإدخال عنوانه واختيار وقت الاستلام بنفسه دون معرفة المرسل.</p>
        <input type="text" placeholder="اسم المستلم (اختياري)" className="border rounded p-3 w-full" value={recipientName} onChange={e => setRecipientName(e.target.value)} />
        <textarea placeholder="رسالة تهنئة مع الهدية" className="border rounded p-3 w-full" value={message} onChange={e => setMessage(e.target.value)} rows={3} />
        <button type="submit" className="bg-pink-600 text-white py-3 rounded font-bold hover:bg-pink-700 transition w-full">إنشاء رابط الهدية السرية</button>
        {link && (
          <div className="bg-pink-50 border border-pink-200 rounded p-4 mt-4 text-center">
            <p className="text-pink-700 font-bold mb-2">تم إنشاء رابط الهدية السرية:</p>
            <a href={link} className="text-blue-600 underline break-all">{link}</a>
            <p className="text-gray-500 mt-2">يمكنك إرسال هذا الرابط للمستلم عبر واتساب أو أي وسيلة تواصل.</p>
          </div>
        )}
      </form>
    </main>
  );
}
