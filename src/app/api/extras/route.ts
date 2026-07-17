import { NextResponse } from 'next/server';
import { addGiftExtra, deleteGiftExtra, getGiftExtras, reorderGiftExtras, updateGiftExtra } from '@/lib/localDb';

export async function GET() {
  const extras = await getGiftExtras();
  return NextResponse.json(extras);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data?.name || Number(data?.price) <= 0) {
      return NextResponse.json({ error: 'الاسم والسعر مطلوبان' }, { status: 400 });
    }

    const created = await addGiftExtra({
      name: String(data.name).trim(),
      price: Number(data.price),
      emoji: data.emoji || '🎁',
      active: data.active !== false,
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error('Error creating gift extra:', error);
    return NextResponse.json({ error: 'خطأ في إضافة الإضافة' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const data = await req.json();

    if (Array.isArray(data?.orderedIds)) {
      const ok = await reorderGiftExtras(data.orderedIds.map((id: unknown) => String(id)));
      if (!ok) {
        return NextResponse.json({ error: 'تعذر حفظ الترتيب' }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    if (!data?.id) {
      return NextResponse.json({ error: 'معرف الإضافة مطلوب' }, { status: 400 });
    }

    const payload: Record<string, unknown> = {};

    if (typeof data.name === 'string') payload.name = data.name.trim();
    if (data.price !== undefined) payload.price = Number(data.price);
    if (typeof data.emoji === 'string') payload.emoji = data.emoji || '🎁';
    if (typeof data.active === 'boolean') payload.active = data.active;

    if (payload.price !== undefined && Number(payload.price) <= 0) {
      return NextResponse.json({ error: 'السعر يجب أن يكون أكبر من صفر' }, { status: 400 });
    }

    if (payload.name !== undefined && !String(payload.name).trim()) {
      return NextResponse.json({ error: 'اسم الإضافة مطلوب' }, { status: 400 });
    }

    const updated = await updateGiftExtra(String(data.id), payload as any);
    if (!updated) {
      return NextResponse.json({ error: 'الإضافة غير موجودة' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating gift extra:', error);
    return NextResponse.json({ error: 'خطأ في تحديث الإضافة' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'معرف الإضافة مطلوب' }, { status: 400 });
    }

    const ok = await deleteGiftExtra(id);
    if (!ok) {
      return NextResponse.json({ error: 'الإضافة غير موجودة' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gift extra:', error);
    return NextResponse.json({ error: 'خطأ في حذف الإضافة' }, { status: 500 });
  }
}
