import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/calendar",
  "/my-tasks",
  "/board",
  "/settings",
];
const publicRoute = ["/login", "/register"];

export function proxy(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route),
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
