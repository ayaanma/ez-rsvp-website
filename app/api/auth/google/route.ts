import { NextRequest, NextResponse } from "next/server";

function getSiteUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
}

function setDemoGoogleSession(response: NextResponse, request: NextRequest) {
  const siteUrl = getSiteUrl(request);
  const secure = siteUrl.startsWith("https://");
  const fallbackUser = {
    name: "Google user",
    email: "google-user@example.com",
  };

  response.cookies.set("ez_auth", "1", {
    path: "/",
    sameSite: "lax",
    secure,
    maxAge: 60 * 60 * 24 * 30,
  });

  response.cookies.set("ez_user_profile", JSON.stringify(fallbackUser), {
    path: "/",
    sameSite: "lax",
    secure,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function GET(request: NextRequest) {
  const siteUrl = getSiteUrl(request);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const redirectTo = new URL("/auth/callback", siteUrl).toString();

  if (!supabaseUrl) {
    const response = NextResponse.redirect(new URL("/dashboard?auth=demo-google", siteUrl));
    setDemoGoogleSession(response, request);
    return response;
  }

  const authUrl = new URL(`${supabaseUrl}/auth/v1/authorize`);
  authUrl.searchParams.set("provider", "google");
  authUrl.searchParams.set("redirect_to", redirectTo);

  return NextResponse.redirect(authUrl);
}
