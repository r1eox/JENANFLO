import React from "react";

export default function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden animate-fade-in"
      style={{
        background:
          "radial-gradient(circle at 80% 20%, #4A9BA0 0%, transparent 50%)," +
          "radial-gradient(circle at 20% 80%, #C9A96E 0%, transparent 50%)," +
          "radial-gradient(circle at 50% 50%, #2D8B8B 0%, transparent 70%)",
        opacity: 0.12,
      }}
    />
  );
}
