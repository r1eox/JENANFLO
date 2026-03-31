'use client';
"use client";
import React, { useState, useRef } from "react";

type ImageUploaderProps = {
  currentImage?: string;
  onImageUploaded: (url: string) => void;
  label?: string;
};

export default function ImageUploader({ 
  currentImage, 
  onImageUploaded, 
  label = "صورة المنتج" 
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // عرض معاينة فورية
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // رفع الصورة
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        onImageUploaded(data.url);
        setPreview(data.url);
      } else {
        setError(data.error || "فشل في رفع الصورة");
        setPreview(currentImage || null);
      }
    } catch (err) {
      setError("حدث خطأ في رفع الصورة");
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const input = fileInputRef.current;
      if (input) {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        handleFileSelect({ target: input } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer
          transition-all duration-200
          ${uploading ? "border-[#C9A96E] bg-[#C9A96E]/10" : "border-white/20 hover:border-[#4A9BA0]"}
          ${error ? "border-red-500" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#C9A96E] border-t-transparent"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-gray-400 text-sm">
              اسحب الصورة هنا أو اضغط للاختيار
            </p>
            <p className="text-gray-500 text-xs mt-1">
              JPG, PNG, GIF, WEBP - حد أقصى 5 ميجا
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {preview && !uploading && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPreview(null);
            onImageUploaded("");
          }}
          className="text-red-400 text-sm hover:text-red-300"
        >
          إزالة الصورة
        </button>
      )}
    </div>
  );
}
