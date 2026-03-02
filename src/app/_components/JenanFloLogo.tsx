'use client';
import React from "react";

export default function JenanFloLogo() {
  return (
    <div className="flex items-center gap-2 cursor-pointer select-none group">
      <span 
        className="text-4xl"
        style={{ 
          filter: "drop-shadow(0 2px 8px rgba(244, 114, 182, 0.5))",
          animation: "pulse 2s ease-in-out infinite"
        }}
      >
        🌸
      </span>
      <span 
        className="text-3xl font-black tracking-wide"
        style={{
          background: "linear-gradient(135deg, #be185d 0%, #ec4899 50%, #f472b6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "0 2px 10px rgba(236, 72, 153, 0.2)"
        }}
      >
        Jenan Flo
      </span>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
