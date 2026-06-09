import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/account", "/groups", "/create-rsvp"];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const protectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!protectedRoute) {
    return NextResponse.next();
  }

  const isAuthed = request.cookies.get("ez_auth")?.value === "1";

  if (!isAuthed) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/groups/:path*",
    "/create-rsvp/:path*",
  ],
};