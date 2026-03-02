import { dbConnect } from "@/lib/mongodb";
import { mockCampaigns } from "@/lib/mockData";
import Campaign from "@/models/Campaign";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const db = await dbConnect();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  
  // إذا لم يكن MongoDB متاحاً، استخدم البيانات التجريبية
  if (!db) {
    let campaigns = [...mockCampaigns];
    if (status) campaigns = campaigns.filter(c => c.status === status);
    if (type) campaigns = campaigns.filter(c => c.type === type);
    return NextResponse.json(campaigns);
  }
  
  const query: any = {};
  if (status) query.status = status;
  if (type) query.type = type;
  
  const campaigns = await Campaign.find(query).sort({ createdAt: -1 });
  return NextResponse.json(campaigns);
}

export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  const campaign = await Campaign.create(data);
  return NextResponse.json(campaign);
}

export async function PUT(req: Request) {
  await dbConnect();
  const data = await req.json();
  const { _id, ...updateData } = data;
  
  if (!_id) {
    return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
  }
  
  const campaign = await Campaign.findByIdAndUpdate(_id, updateData, { new: true });
  return NextResponse.json(campaign);
}

export async function DELETE(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
  }
  
  await Campaign.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
