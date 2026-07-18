import { NextRequest, NextResponse } from "next/server";

const protectedRoute = ["/dashboard", "/calendar"];
const publicRoute = ["/", "login", "/register"];

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("access_token");
  const isProtectedRoute = protectedRoute.includes(path);
  const isPublicRoute = publicRoute.includes(path);

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

// export const config = {
//   matcher: ["/app/:path*"],
// };
