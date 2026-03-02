import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const users = await User.find({});
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  const user = await User.create(data);
  return NextResponse.json(user);
}
