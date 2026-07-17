import { NextRequest, NextResponse } from 'next/server';
import { getCoupons, validateCoupon, addCoupon, deleteCoupon, updateCoupon } from '@/lib/localDb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const phone = searchParams.get('phone');

  if (code) {
    const result = await validateCoupon(code, phone || undefined);
    if (!result.valid) {
      return NextResponse.json({ error: result.reason || 'الكود غير صالح' }, { status: 404 });
    }
    return NextResponse.json(result.coupon);
  }

  const coupons = await getCoupons();
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code, discount, usageLimit, customerPhone, active } = body;

  if (!code || !discount) {
    return NextResponse.json({ error: 'الكود والخصم مطلوبان' }, { status: 400 });
  }

  const normalizedCode = String(code).toUpperCase().trim();
  const existing = (await getCoupons()).find(c => c.code === normalizedCode);
  if (existing) {
    return NextResponse.json({ error: 'هذا الكود موجود مسبقاً' }, { status: 409 });
  }

  const coupon = await addCoupon({
    code: normalizedCode,
    discount: Number(discount),
    active: active !== false,
    usageLimit: Number(usageLimit || 0),
    customerPhone: customerPhone || null,
  });
  return NextResponse.json(coupon, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });

  const deleted = await deleteCoupon(id);
  if (!deleted) return NextResponse.json({ error: 'الكود غير موجود' }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });

  if (typeof data.code === 'string') {
    data.code = data.code.toUpperCase().trim();
  }

  const updated = await updateCoupon(id, data);
  if (!updated) return NextResponse.json({ error: 'الكود غير موجود' }, { status: 404 });
  return NextResponse.json(updated);
}
