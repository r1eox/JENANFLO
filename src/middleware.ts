import { NextRequest, NextResponse } from "next/server";

// حماية مسارات لوحة الإدارة: يسمح فقط للمستخدمين من نوع admin
export function middleware(request: NextRequest) {
  // التحقق من وجود session في الكوكيز
  const userCookie = request.cookies.get("jenanflo_user")?.value;
  
  if (!userCookie) {
    // إعادة التوجيه لصفحة تسجيل الدخول
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  
  try {
    const user = JSON.parse(userCookie);
    // التحقق من أن المستخدم admin
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
