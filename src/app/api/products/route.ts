import { dbConnect } from "@/lib/mongodb";
import { mockProducts } from "@/lib/mockData";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const db = await dbConnect();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  
  // إذا لم يكن MongoDB متاحاً، استخدم البيانات التجريبية
  if (!db) {
    let products = [...mockProducts];
    if (category) products = products.filter(p => p.category === category);
    if (featured === 'true') products = products.filter(p => p.featured);
    return NextResponse.json(products);
  }
  
  const query: any = {};
  if (category) query.category = category;
  if (featured === 'true') query.featured = true;
  
  const products = await Product.find(query).sort({ createdAt: -1 });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  const product = await Product.create(data);
  return NextResponse.json(product);
}

export async function PUT(req: Request) {
  await dbConnect();
  const data = await req.json();
  const { _id, ...updateData } = data;
  
  if (!_id) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
  }
  
  const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });
  return NextResponse.json(product);
}

export async function DELETE(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
  }
  
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
