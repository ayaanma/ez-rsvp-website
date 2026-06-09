import { NextRequest, NextResponse } from "next/server";

function getSiteUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
}

function setAppSession(
  response: NextResponse,
  request: NextRequest,
  user: { name: string; email: string }
) {
  const siteUrl = getSiteUrl(request);
  const secure = siteUrl.startsWith("https://");

  response.cookies.set("ez_auth", "1", {
    path: "/",
    sameSite: "lax",
    secure,
    maxAge: 60 * 60 * 24 * 30,
  });

  response.cookies.set("ez_user_profile", JSON.stringify(user), {
    path: "/",
    sameSite: "lax",
    secure,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function GET(request: NextRequest) {
  const siteUrl = getSiteUrl(request);
  const params = request.nextUrl.searchParams;
  const error = params.get("error") || params.get("error_description");

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, siteUrl)
    );
  }

  const code = params.get("code");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let user = {
    name: "Google user",
    email: "google-user@example.com",
  };

  if (code && supabaseUrl && supabaseAnonKey) {
    try {
      const tokenResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=authorization_code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          auth_code: code,
          redirect_to: new URL("/auth/callback", siteUrl).toString(),
        }),
      });

      const tokenData = await tokenResponse.json().catch(() => ({}));

      if (tokenResponse.ok) {
        const supabaseUser = tokenData.user ?? tokenData.session?.user;
        user = {
          name:
            supabaseUser?.user_metadata?.name ||
            supabaseUser?.user_metadata?.full_name ||
            supabaseUser?.email?.split("@")[0] ||
            "Google user",
          email: supabaseUser?.email || "google-user@example.com",
        };
      }
    } catch {
      user = {
        name: "Google user",
        email: "google-user@example.com",
      };
    }
  }

  const response = NextResponse.redirect(new URL("/dashboard?auth=google", siteUrl));
  setAppSession(response, request, user);
  return response;
}
