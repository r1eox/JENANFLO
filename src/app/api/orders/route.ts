import { 
  getOrders, 
  getOrderByNumber, 
  addOrder, 
  updateOrder,
  getCustomerByPhone,
  addCustomer,
  updateCustomer
} from "@/lib/localDb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get('orderNumber');
  const status = searchParams.get('status');
  
  // البحث برقم الطلب
  if (orderNumber) {
    const order = getOrderByNumber(orderNumber);
    return NextResponse.json(order || null);
  }

  let orders = getOrders();

  // فلتر بالجوال (للعميل المسجل)
  const phone = searchParams.get('phone');
  if (phone) {
    const normalized = phone.replace(/^\+/, '').replace(/^0/, '966');
    orders = orders.filter(o => {
      const op = (o.customer?.phone || '').replace(/^\+/, '').replace(/^0/, '966');
      return op === normalized;
    });
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(orders);
  }
  
  if (status && status !== 'الكل') {
    orders = orders.filter(o => o.status === status);
  }
  
  // ترتيب من الأحدث للأقدم
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const order = addOrder({
      customer: data.customer,
      items: data.items,
      extras: data.extras || [],
      extrasTotal: data.extrasTotal || 0,
      discountCode: data.discountCode || null,
      discountAmount: data.discountAmount || 0,
      subtotal: data.subtotal || data.total,
      tax: data.tax || 0,
      deliveryFee: data.deliveryFee || 0,
      total: data.total,
      status: "جديد",
      paymentMethod: data.paymentMethod || "نقدي",
      paymentStatus: data.paymentStatus || "معلق",
      giftMessage: data.giftMessage,
      deliveryDate: data.deliveryDate,
      deliveryTime: data.deliveryTime,
      notes: data.notes
    });

    // إضافة أو تحديث بيانات العميل تلقائياً
    if (data.customer?.phone) {
      const existing = getCustomerByPhone(data.customer.phone);
      if (existing) {
        updateCustomer(existing._id, {
          totalOrders: (existing.totalOrders || 0) + 1,
          totalSpent: (existing.totalSpent || 0) + (data.total || 0),
          lastOrderDate: new Date().toISOString(),
        });
      } else {
        addCustomer({
          name: data.customer.name || 'عميل',
          phone: data.customer.phone,
          email: data.customer.email || '',
          address: data.customer.address || data.deliveryAddress || '',
          totalOrders: 1,
          totalSpent: data.total || 0,
          lastOrderDate: new Date().toISOString(),
          tags: [],
          status: 'نشط',
          marketing: { allowWhatsApp: true, allowEmail: true },
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      message: 'تم استلام طلبك بنجاح! سنتواصل معك قريباً',
      order
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "خطأ في إنشاء الطلب" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { _id, ...updateData } = data;
    
    if (!_id) {
      return NextResponse.json({ error: 'معرف الطلب مطلوب' }, { status: 400 });
    }
    
    const order = updateOrder(_id, updateData);
    if (!order) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "خطأ في تحديث الطلب" }, { status: 500 });
  }
}
