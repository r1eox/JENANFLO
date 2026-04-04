import { NextResponse } from "next/server";
import { getUsers, getUserByEmail, addUser, updateUser } from "@/lib/localDb";

export async function GET() {
  const users = await getUsers();
  // إخفاء كلمات المرور
  const safeUsers = users.map(u => ({ ...u, password: undefined }));
  return NextResponse.json(safeUsers);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }
    
    // التحقق من عدم وجود المستخدم
    const existing = await getUserByEmail(body.email);
    if (existing) {
      return NextResponse.json(
        { error: "البريد مستخدم مسبقاً" },
        { status: 400 }
      );
    }
    
    const newUser = await addUser({
      name: body.name,
      email: body.email,
      passwordHash: body.password, // في الإنتاج يجب تشفيرها
      role: body.role || 'customer'
    });
    
    return NextResponse.json({ ...newUser, password: undefined }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ في إنشاء المستخدم" },
      { status: 500 }
    );
  }
}

// تحديث بيانات المستخدم (مثل الجوال)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { email, phone } = body;
    if (!email) return NextResponse.json({ error: "البريد مطلوب" }, { status: 400 });

    const user = await getUserByEmail(email);
    if (!user) return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });

    const updated = await updateUser(user._id, { phone });
    return NextResponse.json({ success: true, phone: updated?.phone });
  } catch {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
