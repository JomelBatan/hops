import { NextRequest, NextResponse } from "next/server";
import { getToken } from "./libs/api";

export function middleware(request: NextRequest) {
  const token = getToken();

  const isProtected = request.nextUrl.pathname.startsWith("/app");

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
