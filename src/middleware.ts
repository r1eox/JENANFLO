import { NextRequest, NextResponse } from "next/server";

// حماية مسارات لوحة الإدارة: يسمح فقط للمستخدمين من نوع admin
export function middleware(request: NextRequest) {
  // مثال: التحقق من وجود session أو JWT في الكوكيز
  const token = request.cookies.get("token")?.value;
  // في تطبيق حقيقي: فك التوكن والتحقق من الدور
  if (!token) {
    // إعادة التوجيه لصفحة تسجيل الدخول
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  // يمكن إضافة تحقق من الدور هنا (admin فقط)
  // ...
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
