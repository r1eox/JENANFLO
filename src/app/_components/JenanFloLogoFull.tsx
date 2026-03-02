'use client';
import React from "react";

export default function JenanFloLogoFull() {
  return (
    <div className="flex items-center gap-3 cursor-pointer select-none">
      {/* زهرة اللوتس مع الموجات - مطابقة للشعار الأصلي */}
      <svg width="90" height="80" viewBox="0 0 90 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
        {/* الورقة الوسطى - تركوازي */}
        <path d="M45 8 C45 8, 58 18, 55 32 C52 42, 45 48, 45 48 C45 48, 38 42, 35 32 C32 18, 45 8, 45 8" 
          fill="url(#centerLeaf)" stroke="#2D8B8B" strokeWidth="0.5"/>
        
        {/* الورقة اليسرى الداخلية - برونزي */}
        <path d="M38 12 C38 12, 28 22, 30 35 C32 45, 40 52, 40 52 C40 52, 42 40, 38 28 C34 18, 38 12, 38 12" 
          fill="url(#bronzeLeaf)" stroke="#B8860B" strokeWidth="0.5"/>
        
        {/* الورقة اليمنى الداخلية - برونزي */}
        <path d="M52 12 C52 12, 62 22, 60 35 C58 45, 50 52, 50 52 C50 52, 48 40, 52 28 C56 18, 52 12, 52 12" 
          fill="url(#bronzeLeaf)" stroke="#B8860B" strokeWidth="0.5"/>
        
        {/* الورقة اليسرى الخارجية - تركوازي غامق */}
        <path d="M30 18 C30 18, 18 30, 22 42 C25 52, 35 56, 35 56 C35 56, 32 44, 30 34 C28 24, 30 18, 30 18" 
          fill="url(#outerTealLeaf)" stroke="#1E6B6B" strokeWidth="0.5"/>
        
        {/* الورقة اليمنى الخارجية - تركوازي غامق */}
        <path d="M60 18 C60 18, 72 30, 68 42 C65 52, 55 56, 55 56 C55 56, 58 44, 60 34 C62 24, 60 18, 60 18" 
          fill="url(#outerTealLeaf)" stroke="#1E6B6B" strokeWidth="0.5"/>
        
        {/* الموجة الأولى - ذهبي إلى تركوازي */}
        <path d="M25 54 Q35 48, 50 54 Q65 60, 80 52" 
          stroke="url(#wave1)" strokeWidth="4" fill="none" strokeLinecap="round"/>
        
        {/* الموجة الثانية - تركوازي */}
        <path d="M30 60 Q42 54, 55 60 Q70 66, 85 58" 
          stroke="url(#wave2)" strokeWidth="3" fill="none" strokeLinecap="round"/>
        
        {/* التدرجات */}
        <defs>
          <linearGradient id="centerLeaf" x1="45" y1="8" x2="45" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5FBDBA"/>
            <stop offset="50%" stopColor="#4A9BA0"/>
            <stop offset="100%" stopColor="#2D8B8B"/>
          </linearGradient>
          <linearGradient id="bronzeLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CD7F32"/>
            <stop offset="40%" stopColor="#C9A96E"/>
            <stop offset="70%" stopColor="#D4AF37"/>
            <stop offset="100%" stopColor="#8B6914"/>
          </linearGradient>
          <linearGradient id="outerTealLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A9BA0"/>
            <stop offset="100%" stopColor="#1E5B5B"/>
          </linearGradient>
          <linearGradient id="wave1" x1="25" y1="54" x2="80" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C9A96E"/>
            <stop offset="40%" stopColor="#4A9BA0"/>
            <stop offset="100%" stopColor="#2D8B8B"/>
          </linearGradient>
          <linearGradient id="wave2" x1="30" y1="60" x2="85" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4A9BA0"/>
            <stop offset="100%" stopColor="#1E5B5B"/>
          </linearGradient>
        </defs>
      </svg>
      
      {/* النص */}
      <div className="flex flex-col">
        {/* jenanflo */}
        <span 
          className="text-4xl md:text-5xl tracking-wide"
          style={{
            fontFamily: "'Times New Roman', 'Georgia', serif",
            fontWeight: 400,
            background: "linear-gradient(180deg, #D4AF37 0%, #C9A96E 40%, #B8860B 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 2px 4px rgba(201, 169, 110, 0.4))",
            letterSpacing: "0.02em"
          }}
        >
          jenanflo
        </span>
        
        {/* خط زخرفي متموج */}
        <svg width="180" height="12" viewBox="0 0 180 12" className="my-1">
          <path d="M0 6 Q30 2, 60 6 Q90 10, 120 6 Q150 2, 180 6" 
            stroke="url(#textWave)" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <defs>
            <linearGradient id="textWave" x1="0" y1="6" x2="180" y2="6" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C9A96E"/>
              <stop offset="50%" stopColor="#4A9BA0"/>
              <stop offset="100%" stopColor="#C9A96E"/>
            </linearGradient>
          </defs>
        </svg>
        
        {/* هديتك من جنان فلو */}
        <span 
          className="text-lg md:text-xl font-medium"
          style={{
            fontFamily: "'Tajawal', 'Cairo', sans-serif",
            background: "linear-gradient(90deg, #C9A96E, #D4AF37, #C9A96E)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
        >
          هديتك من جنان فلو
        </span>
      </div>
    </div>
  );
}
