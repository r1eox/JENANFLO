import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail, addUser } from "@/lib/localDb";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 });
    }

    // تحقق من عدم تكرار البريد
    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "البريد الإلكتروني مستخدم مسبقاً" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = addUser({ name, email, phone: phone || '', passwordHash, role: 'customer' });

    return NextResponse.json({
      message: "تم إنشاء الحساب بنجاح",
      user: { email: user.email, role: user.role, name: user.name, phone: user.phone },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "حدث خطأ في إنشاء الحساب" }, { status: 500 });
  }
}
