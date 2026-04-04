import { 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory,
  getProductsByCategory 
} from "@/lib/localDb";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await getCategories();
  
  // إضافة عدد المنتجات لكل قسم
  const categoriesWithCount = await Promise.all(categories.map(async cat => {
    const products = await getProductsByCategory(cat.name);
    return { ...cat, productsCount: products.length };
  }));
  
  return NextResponse.json(categoriesWithCount);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const category = await addCategory({
      name: data.name || data.nameAr?.toLowerCase().replace(/\s+/g, '-'),
      nameAr: data.nameAr,
      description: data.description || "",
      image: data.image || "",
      active: data.active !== false
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json({ error: "خطأ في إضافة القسم" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { _id, ...updateData } = data;
    
    if (!_id) {
      return NextResponse.json({ error: 'معرف القسم مطلوب' }, { status: 400 });
    }
    
    const category = await updateCategory(_id, updateData);
    if (!category) {
      return NextResponse.json({ error: 'القسم غير موجود' }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "خطأ في تحديث القسم" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'معرف القسم مطلوب' }, { status: 400 });
    }
    
    const success = await deleteCategory(id);
    if (!success) {
      return NextResponse.json({ error: 'القسم غير موجود' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "تم حذف القسم بنجاح" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "خطأ في حذف القسم" }, { status: 500 });
  }
}
