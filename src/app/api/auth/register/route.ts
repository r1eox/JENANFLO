import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  const { name, email, password } = await req.json();
  const exists = await User.findOne({ email });
  if (exists) {
    return NextResponse.json({ error: "البريد الإلكتروني مستخدم مسبقاً" }, { status: 400 });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  return NextResponse.json({ message: "تم إنشاء الحساب بنجاح", user: { email: user.email, role: user.role } });
}
