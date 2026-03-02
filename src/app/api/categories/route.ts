import { dbConnect } from "@/lib/mongodb";
import { mockCategories } from "@/lib/mockData";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await dbConnect();
  
  // إذا لم يكن MongoDB متاحاً، استخدم البيانات التجريبية
  if (!db) {
    return NextResponse.json(mockCategories);
  }
  
  const categories = await Category.find({ active: { $ne: false } }).sort({ order: 1 });
  
  // إضافة عدد المنتجات لكل قسم
  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const count = await Product.countDocuments({ category: cat.name, active: { $ne: false } });
      return { ...cat.toObject(), productsCount: count };
    })
  );
  
  return NextResponse.json(categoriesWithCount);
}

export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  const category = await Category.create(data);
  return NextResponse.json(category);
}

export async function PUT(req: Request) {
  await dbConnect();
  const data = await req.json();
  const { _id, ...updateData } = data;
  
  if (!_id) {
    return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
  }
  
  const category = await Category.findByIdAndUpdate(_id, updateData, { new: true });
  return NextResponse.json(category);
}

export async function DELETE(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
  }
  
  await Category.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
