
import "./globals.css";
import { ToastProvider } from "./_components/ToastProvider";
import AnimatedBackground from "./_components/AnimatedBackground";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AnimatedBackground />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
