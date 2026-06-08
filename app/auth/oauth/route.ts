import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get("provider") || "google";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

  if (provider !== "google") {
    return NextResponse.redirect(new URL("/login?error=unsupported-provider", siteUrl));
  }

  if (!supabaseUrl) {
    const response = NextResponse.redirect(new URL("/dashboard?auth=demo-google", siteUrl));
    response.cookies.set("ez_demo_user", "Google demo user", {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30
    });
    return response;
  }

  const redirectTo = `${siteUrl}/auth/callback`;
  const url = new URL(`${supabaseUrl}/auth/v1/authorize`);
  url.searchParams.set("provider", "google");
  url.searchParams.set("redirect_to", redirectTo);
  return NextResponse.redirect(url);
}
