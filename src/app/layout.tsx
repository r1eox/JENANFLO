
import "./globals.css";
import { ToastProvider } from "./_components/ToastProvider";
import AnimatedBackground from "./_components/AnimatedBackground";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AnimatedBackground />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
