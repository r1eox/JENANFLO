import React, { useRef, useState } from "react";

export default function GiftExperience() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioUrl(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-bold text-pink-700 text-center mb-2">أضف لمستك الخاصة مع الهدية</h1>
        <p className="text-gray-600 text-center mb-4">سجّل رسالة صوتية أو فيديو تهنئة، وسيتم إرسالها مع الهدية عبر رمز QR على البطاقة.</p>
        <div className="flex flex-col gap-4 w-full">
          <label className="font-medium">رسالة صوتية (اختياري):
            <input type="file" accept="audio/*" ref={audioRef} onChange={handleAudioChange} className="block mt-2" />
          </label>
          {audioUrl && <audio controls src={audioUrl} className="w-full" />}
          <label className="font-medium">رسالة فيديو (اختياري):
            <input type="file" accept="video/*" ref={videoRef} onChange={handleVideoChange} className="block mt-2" />
          </label>
          {videoUrl && <video controls src={videoUrl} className="w-full max-h-64" />}
        </div>
        <button className="bg-pink-600 text-white py-3 rounded font-bold hover:bg-pink-700 transition w-full mt-4">حفظ الرسالة مع الطلب</button>
      </div>
    </main>
  );
}
