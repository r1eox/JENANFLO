import { NextRequest, NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/localDb';

export async function GET() {
  const settings = getSettings();
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const updated = saveSettings(body);
  return NextResponse.json(updated);
}
