import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/localDb";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@jenanflo.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_NAME = process.env.ADMIN_NAME || "مدير المتجر";

function createResponseWithCookie(user: { email: string; role: string; name?: string; phone?: string }) {
  const response = NextResponse.json({ 
    message: "تم تسجيل الدخول بنجاح", 
    user 
  });
  
  response.cookies.set("jenanflo_user", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  
  return response;
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "البريد وكلمة المرور مطلوبة" }, { status: 400 });
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return createResponseWithCookie({ 
        email: ADMIN_EMAIL, 
        role: "admin", 
        name: ADMIN_NAME,
      });
    }

    const user = await getUserByEmail(email);
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
