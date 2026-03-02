import { dbConnect } from "@/lib/mongodb";
import { mockOrders } from "@/lib/mockData";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const db = await dbConnect();
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get('orderNumber');
  
  // إذا لم يكن MongoDB متاحاً، استخدم البيانات التجريبية
  if (!db) {
    const status = searchParams.get('status');
    let orders = [...mockOrders];
    
    // البحث برقم الطلب
    if (orderNumber) {
      const found = orders.find(o => o.orderNumber.toLowerCase() === orderNumber.toLowerCase());
      return NextResponse.json(found || null);
    }
    
    if (status) orders = orders.filter(o => o.status === status);
    return NextResponse.json(orders);
  }
  
  // البحث برقم الطلب في MongoDB
  if (orderNumber) {
    const order = await Order.findOne({ orderNumber: { $regex: new RegExp(orderNumber, 'i') } });
    return NextResponse.json(order);
  }
  
  const status = searchParams.get('status');
  const limit = searchParams.get('limit');
  const customerId = searchParams.get('customerId');
  
  const query: any = {};
  if (status && status !== 'الكل') query.status = status;
  if (customerId) query['customer.phone'] = customerId;
  
  let ordersQuery = Order.find(query).sort({ createdAt: -1 });
  if (limit) ordersQuery = ordersQuery.limit(parseInt(limit));
  
  const orders = await ordersQuery;
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const db = await dbConnect();
  const data = await req.json();
  
  // إذا لم يكن MongoDB متاحاً، أرجع نجاح وهمي
  if (!db) {
    const orderNumber = `JF-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
    return NextResponse.json({
      success: true,
      orderNumber,
      message: 'تم استلام طلبك بنجاح! سنتواصل معك قريباً',
      ...data,
      _id: `mock-${Date.now()}`,
      createdAt: new Date().toISOString()
    });
  }
  
  // إنشاء رقم الطلب تلقائياً
  const count = await Order.countDocuments();
  const orderNumber = `JF-${String(count + 1).padStart(6, '0')}`;
  
  const order = await Order.create({
    ...data,
    orderNumber,
    statusHistory: [{ status: 'جديد', date: new Date() }]
  });
  
  return NextResponse.json(order);
}

export async function PUT(req: Request) {
  await dbConnect();
  const data = await req.json();
  const { _id, ...updateData } = data;
  
  if (!_id) {
    return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
  }
  
  // إذا تغيرت الحالة، أضفها للتاريخ
  if (updateData.status) {
    const order = await Order.findById(_id);
    if (order && order.status !== updateData.status) {
      updateData.statusHistory = [
        ...(order.statusHistory || []),
        { status: updateData.status, date: new Date() }
      ];
    }
  }
  
  const updatedOrder = await Order.findByIdAndUpdate(_id, updateData, { new: true });
  return NextResponse.json(updatedOrder);
}

export async function DELETE(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
  }
  
  await Order.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
