import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get("jenanflo_user")?.value;

  if (!userCookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const user = JSON.parse(userCookie);
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
