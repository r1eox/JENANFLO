import React, { useState } from "react";

export default function GroupGiftPage() {
  const [contributors, setContributors] = useState([{ name: "", amount: "" }]);
  const [recipient, setRecipient] = useState("");

  const handleContributorChange = (i: number, field: string, value: string) => {
    const updated = [...contributors];
    updated[i][field as "name" | "amount"] = value;
    setContributors(updated);
  };

  const addContributor = () => setContributors([...contributors, { name: "", amount: "" }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // في التطبيق الفعلي: إرسال بيانات المساهمين والهدية
    alert("تم إنشاء هدية جماعية بنجاح!");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-bold text-pink-700 text-center mb-2">هدية جماعية</h1>
        <p className="text-gray-600 text-center mb-4">اجمع أصدقاءك واشتركوا معًا في شراء هدية واحدة برسائل مخصصة من كل شخص.</p>
        <input type="text" placeholder="اسم المستلم" className="border rounded p-3 w-full" value={recipient} onChange={e => setRecipient(e.target.value)} required />
        <div className="w-full flex flex-col gap-2">
          {contributors.map((c, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" placeholder="اسم المساهم" className="border rounded p-2 flex-1" value={c.name} onChange={e => handleContributorChange(i, "name", e.target.value)} required />
              <input type="number" placeholder="المبلغ" className="border rounded p-2 w-24" value={c.amount} onChange={e => handleContributorChange(i, "amount", e.target.value)} required />
            </div>
          ))}
          <button type="button" onClick={addContributor} className="text-pink-600 font-bold mt-2">+ إضافة مساهم آخر</button>
        </div>
        <button type="submit" className="bg-pink-600 text-white py-3 rounded font-bold hover:bg-pink-700 transition w-full">إنشاء هدية جماعية</button>
      </form>
    </main>
  );
}
