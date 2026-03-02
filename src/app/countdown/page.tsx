import React, { useEffect, useState } from "react";

const events = [
  { name: "عيد الأم", date: "2026-03-21" },
  { name: "عيد الفطر", date: "2026-04-18" },
  { name: "عيد الأضحى", date: "2026-06-27" },
  { name: "اليوم الوطني", date: "2026-09-23" },
];

function getTimeLeft(target: string) {
  const now = new Date();
  const eventDate = new Date(target);
  const diff = eventDate.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, minutes };
}

export default function CountdownPage() {
  const [timers, setTimers] = useState<any[]>([]);

  useEffect(() => {
    const updateTimers = () => {
      setTimers(events.map(e => ({
        name: e.name,
        ...getTimeLeft(e.date)
      })));
    };
    updateTimers();
    const interval = setInterval(updateTimers, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-bold text-pink-700 text-center mb-2">كم بقي على أقرب مناسبة؟</h1>
        <div className="w-full flex flex-col gap-4">
          {timers.map((t, i) => t.days !== undefined ? (
            <div key={i} className="flex justify-between items-center border rounded-xl p-4 bg-pink-50">
              <span className="font-bold text-pink-700">{t.name}</span>
              <span className="text-gray-700">{t.days} يوم، {t.hours} ساعة، {t.minutes} دقيقة</span>
            </div>
          ) : null)}
        </div>
      </div>
    </main>
  );
}
