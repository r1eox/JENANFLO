import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/localDb";

// حساب admin ثابت
const DEMO_ADMIN = {
  email: "admin@jenanflo.com",
  password: "admin123",
  name: "مدير المتجر",
  role: "admin"
};

// دالة لإنشاء response مع cookie
function createResponseWithCookie(user: { email: string; role: string; name?: string; phone?: string }) {
  const response = NextResponse.json({ 
    message: "تم تسجيل الدخول بنجاح", 
    user 
  });
  
  // إضافة الكوكي
  response.cookies.set("jenanflo_user", JSON.stringify(user), {
    httpOnly: false, // نحتاجه قابل للقراءة من JavaScript
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // أسبوع
    path: "/",
  });
  
  return response;
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // التحقق من حساب admin التجريبي أولاً
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      return createResponseWithCookie({ 
        email: DEMO_ADMIN.email, 
        role: DEMO_ADMIN.role, 
        name: DEMO_ADMIN.name 
      });
    }
    
    // البحث في قاعدة البيانات المحلية
    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
    }
    return createResponseWithCookie({ email: user.email, role: user.role, name: user.name, phone: user.phone });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "حدث خطأ في تسجيل الدخول" }, { status: 500 });
  }
}
