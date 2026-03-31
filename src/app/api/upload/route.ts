import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "لم يتم اختيار صورة" },
        { status: 400 }
      );
    }

    // التحقق من نوع الملف
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "نوع الملف غير مدعوم. استخدم JPG, PNG, GIF أو WEBP" },
        { status: 400 }
      );
    }

    // التحقق من حجم الملف (أقصى 5 ميجا)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "حجم الصورة يجب أن يكون أقل من 5 ميجابايت" },
        { status: 400 }
      );
    }

    // إنشاء اسم فريد للملف
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // مسار حفظ الصورة
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // التأكد من وجود المجلد
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, fileName);

    // تحويل الملف إلى Buffer وحفظه
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filePath, buffer);

    // إرجاع رابط الصورة
    const imageUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({ 
      success: true,
      url: imageUrl,
      message: "تم رفع الصورة بنجاح"
    });
    
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "حدث خطأ في رفع الصورة" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: "رابط الصورة مطلوب" },
        { status: 400 }
      );
    }

    // استخراج اسم الملف
    const fileName = imageUrl.split("/").pop();
    if (!fileName) {
      return NextResponse.json(
        { error: "رابط الصورة غير صالح" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "public", "uploads", fileName);
    
    // حذف الملف
    const fs = await import("fs/promises");
    await fs.unlink(filePath);
    
    return NextResponse.json({ 
      success: true,
      message: "تم حذف الصورة بنجاح"
    });
    
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "حدث خطأ في حذف الصورة" },
      { status: 500 }
    );
  }
}
