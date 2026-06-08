import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  const secure = siteUrl.startsWith("https://");
  const error = request.nextUrl.searchParams.get("error") || request.nextUrl.searchParams.get("error_description");

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, siteUrl));
  }

  const response = NextResponse.redirect(new URL("/dashboard?auth=google", siteUrl));
  const fallbackUser = { name: "Google user", email: "google-user@example.com" };

  response.cookies.set("ez_auth", "1", {
    path: "/",
    sameSite: "lax",
    secure,
    maxAge: 60 * 60 * 24 * 30
  });

  response.cookies.set("ez_user_profile", JSON.stringify(fallbackUser), {
    path: "/",
    sameSite: "lax",
    secure,
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}
