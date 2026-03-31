import { NextResponse } from "next/server";
import { 
  getCampaigns, 
  getCampaignById, 
  addCampaign, 
  updateCampaign, 
  deleteCampaign 
} from "@/lib/localDb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  
  if (id) {
    const campaign = getCampaignById(id);
    if (!campaign) {
      return NextResponse.json({ error: "الحملة غير موجودة" }, { status: 404 });
    }
    return NextResponse.json(campaign);
  }
  
  let campaigns = getCampaigns();
  
  if (status) {
    campaigns = campaigns.filter(c => c.status === status);
  }
  
  if (type) {
    campaigns = campaigns.filter(c => c.type === type);
  }
  
  return NextResponse.json(campaigns);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: "اسم الحملة ونوعها مطلوبان" },
        { status: 400 }
      );
    }
    
    const newCampaign = addCampaign({
      name: body.name,
      type: body.type,
      status: body.status || 'مسودة',
      target: body.target || 'الكل',
      message: body.message || '',
      scheduledAt: body.scheduledAt,
      sentAt: body.sentAt
    });
    
    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ في إنشاء الحملة" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    if (!body._id) {
      return NextResponse.json(
        { error: "معرف الحملة مطلوب" },
        { status: 400 }
      );
    }
    
    const updated = updateCampaign(body._id, body);
    
    if (!updated) {
      return NextResponse.json(
        { error: "الحملة غير موجودة" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ في تحديث الحملة" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: "معرف الحملة مطلوب" },
      { status: 400 }
    );
  }
  
  const deleted = deleteCampaign(id);
  
  if (!deleted) {
    return NextResponse.json(
      { error: "الحملة غير موجودة" },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ message: "تم حذف الحملة بنجاح" });
}
