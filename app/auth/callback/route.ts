import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  const error = request.nextUrl.searchParams.get("error") || request.nextUrl.searchParams.get("error_description");

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, siteUrl));
  }

  return NextResponse.redirect(new URL("/dashboard", siteUrl));
}
