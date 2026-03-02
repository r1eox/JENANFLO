import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  const { email, password } = await req.json();
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 401 });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
  }
  // هنا يمكن إنشاء session أو JWT لاحقاً
  return NextResponse.json({ message: "تم تسجيل الدخول بنجاح", user: { email: user.email, role: user.role } });
}
