import { dbConnect } from "@/lib/mongodb";
import { mockCustomers } from "@/lib/mockData";
import Customer from "@/models/Customer";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const db = await dbConnect();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const tag = searchParams.get('tag');
  const search = searchParams.get('search');
  
  // إذا لم يكن MongoDB متاحاً، استخدم البيانات التجريبية
  if (!db) {
    let customers: typeof mockCustomers = [...mockCustomers];
    if (status) customers = customers.filter(c => c.status === status);
    if (tag) customers = customers.filter(c => (c.tags as string[]).includes(tag));
    if (search) customers = customers.filter(c => 
      c.name.includes(search) || c.phone.includes(search) || (c.email?.includes(search) || false)
    );
    return NextResponse.json(customers);
  }
  
  const query: any = {};
  if (status) query.status = status;
  if (tag) query.tags = tag;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  
  const customers = await Customer.find(query).sort({ createdAt: -1 });
  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  
  // التحقق من عدم وجود العميل مسبقاً
  const existing = await Customer.findOne({ phone: data.phone });
  if (existing) {
    return NextResponse.json({ error: 'Customer already exists', customer: existing }, { status: 400 });
  }
  
  const customer = await Customer.create(data);
  return NextResponse.json(customer);
}

export async function PUT(req: Request) {
  await dbConnect();
  const data = await req.json();
  const { _id, ...updateData } = data;
  
  if (!_id) {
    return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
  }
  
  const customer = await Customer.findByIdAndUpdate(_id, updateData, { new: true });
  return NextResponse.json(customer);
}

export async function DELETE(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
  }
  
  await Customer.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

// تحديث إحصائيات العميل بعد كل طلب
export async function updateCustomerStats(phone: string) {
  await dbConnect();
  
  const orders = await Order.find({ 'customer.phone': phone, status: { $ne: 'ملغي' } });
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
  const lastOrderDate = orders.length > 0 ? orders[0].createdAt : null;
  
  await Customer.findOneAndUpdate(
    { phone },
    { totalOrders, totalSpent, lastOrderDate },
    { upsert: false }
  );
}
