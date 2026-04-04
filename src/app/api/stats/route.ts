import { NextResponse } from "next/server";
import { getStats } from "@/lib/localDb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'today';
  
  // جلب الإحصائيات الحقيقية من localDb
  const stats = await getStats(period);
  
  return NextResponse.json({
    orders: stats.orders,
    revenue: stats.revenue,
    customers: stats.customers,
    products: stats.products,
    topProducts: stats.topProducts,
    salesByCategory: stats.salesByCategory
  });
}
