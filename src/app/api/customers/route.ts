import { NextResponse } from "next/server";
import { 
  getCustomers, 
  getCustomerById, 
  getCustomerByPhone,
  addCustomer, 
  updateCustomer, 
  deleteCustomer 
} from "@/lib/localDb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const status = searchParams.get('status');
  const tag = searchParams.get('tag');
  const search = searchParams.get('search');
  
  // جلب عميل محدد
  if (id) {
    const customer = await getCustomerById(id);
    if (!customer) {
      return NextResponse.json({ error: "العميل غير موجود" }, { status: 404 });
    }
    return NextResponse.json(customer);
  }
  
  // جلب كل العملاء مع الفلترة
  let customers = await getCustomers();
  
  if (status) {
    customers = customers.filter(c => c.status === status);
  }
  
  if (tag) {
    customers = customers.filter(c => c.tags.includes(tag));
  }
  
  if (search) {
    customers = customers.filter(c => 
      c.name.includes(search) || 
      c.phone.includes(search) || 
      (c.email?.includes(search) || false)
    );
  }
  
  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // التحقق من البيانات المطلوبة
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: "الاسم ورقم الجوال مطلوبان" },
        { status: 400 }
      );
    }
    
    // التحقق من عدم وجود العميل
    const existing = await getCustomerByPhone(body.phone);
    if (existing) {
      return NextResponse.json(
        { error: "العميل موجود مسبقاً", customer: existing },
        { status: 400 }
      );
    }
    
    const newCustomer = await addCustomer({
      name: body.name,
      phone: body.phone,
      email: body.email,
      address: body.address,
      tags: body.tags || [],
      status: body.status || 'نشط',
      marketing: body.marketing || { allowWhatsApp: true, allowEmail: true },
      specialDates: body.specialDates || [],
      totalOrders: 0,
      totalSpent: 0
    });
    
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ في إضافة العميل" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    if (!body._id) {
      return NextResponse.json(
        { error: "معرف العميل مطلوب" },
        { status: 400 }
      );
    }
    
    const updated = await updateCustomer(body._id, body);
    
    if (!updated) {
      return NextResponse.json(
        { error: "العميل غير موجود" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ في تحديث العميل" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: "معرف العميل مطلوب" },
      { status: 400 }
    );
  }
  
  const deleted = await deleteCustomer(id);
  
  if (!deleted) {
    return NextResponse.json(
      { error: "العميل غير موجود" },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ message: "تم حذف العميل بنجاح" });
}
