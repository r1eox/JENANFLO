import { dbConnect } from "@/lib/mongodb";
import { mockStats } from "@/lib/mockData";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

interface OrderDoc {
  _id: any;
  status: string;
  total?: number;
  tax?: number;
  paymentStatus?: string;
  items?: { name?: string; quantity?: number; price?: number }[];
  createdAt: Date;
  customer?: { name?: string };
  orderNumber?: string;
}

interface CategoryDoc {
  _id: any;
  nameAr?: string;
}

export async function GET(req: Request) {
  const db = await dbConnect();
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'today';
  
  // إذا لم يكن MongoDB متاحاً، استخدم البيانات التجريبية
  if (!db) {
    return NextResponse.json(mockStats);
  }
  
  // تحديد نطاق التاريخ
  const now = new Date();
  let startDate: Date;
  
  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  
  // إحصائيات الطلبات
  const allOrders: OrderDoc[] = await Order.find({ createdAt: { $gte: startDate } });
  const totalOrders = allOrders.length;
  const newOrders = allOrders.filter((o: OrderDoc) => o.status === 'جديد').length;
  const preparingOrders = allOrders.filter((o: OrderDoc) => o.status === 'جاري التحضير' || o.status === 'قيد المراجعة').length;
  const deliveringOrders = allOrders.filter((o: OrderDoc) => o.status === 'جاري التوصيل').length;
  const deliveredOrders = allOrders.filter((o: OrderDoc) => o.status === 'تم التسليم').length;
  const cancelledOrders = allOrders.filter((o: OrderDoc) => o.status === 'ملغي').length;
  
  // الإيرادات
  const completedOrders = allOrders.filter((o: OrderDoc) => o.status !== 'ملغي');
  const revenue = completedOrders.reduce((sum: number, o: OrderDoc) => sum + (o.total || 0), 0);
  const tax = completedOrders.reduce((sum: number, o: OrderDoc) => sum + (o.tax || 0), 0);
  const collected = completedOrders.filter((o: OrderDoc) => o.paymentStatus === 'مدفوع').reduce((sum: number, o: OrderDoc) => sum + (o.total || 0), 0);
  const pending = revenue - collected;
  
  const avgOrder = totalOrders > 0 ? Math.round(revenue / totalOrders) : 0;
  
  // العملاء
  const totalCustomers = await Customer.countDocuments();
  const newCustomers = await Customer.countDocuments({ createdAt: { $gte: startDate } });
  
  // المنتجات الأكثر مبيعاً
  const productSales: { [key: string]: { name: string; count: number; revenue: number } } = {};
  allOrders.forEach((order: OrderDoc) => {
    (order.items || []).forEach((item: any) => {
      const name = item.name || 'غير معروف';
      if (!productSales[name]) {
        productSales[name] = { name, count: 0, revenue: 0 };
      }
      productSales[name].count += item.quantity || 1;
      productSales[name].revenue += (item.price || 0) * (item.quantity || 1);
    });
  });
  
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(p => ({ name: p.name, sales: p.count, revenue: p.revenue }));
  
  // المبيعات حسب القسم
  const categorySales: { [key: string]: number } = {};
  allOrders.forEach((order: OrderDoc) => {
    (order.items || []).forEach((item: any) => {
      const cat = item.category || 'أخرى';
      categorySales[cat] = (categorySales[cat] || 0) + (item.price || 0) * (item.quantity || 1);
    });
  });
  
  const totalCategorySales = Object.values(categorySales).reduce((a, b) => a + b, 0) || 1;
  const topCategories = Object.entries(categorySales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, revenue]) => ({
      name,
      revenue,
      percentage: Math.round((revenue / totalCategorySales) * 100),
    }));
  
  // آخر الطلبات
  const recentOrders: OrderDoc[] = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('orderNumber customer status total createdAt');
  
  return NextResponse.json({
    orders: {
      total: totalOrders,
      new: newOrders,
      preparing: preparingOrders,
      delivering: deliveringOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders,
    },
    financial: {
      revenue,
      tax,
      collected,
      pending,
      avgOrder,
    },
    customers: {
      total: totalCustomers,
      new: newCustomers,
    },
    topProducts,
    topCategories,
    recentOrders: recentOrders.map((o: OrderDoc) => ({
      id: o.orderNumber,
      customer: o.customer?.name || 'غير معروف',
      status: o.status,
      amount: o.total,
      date: o.createdAt,
    })),
  });
}
