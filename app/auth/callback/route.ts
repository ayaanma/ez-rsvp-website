import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSiteUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
}

function getUserDisplayName(user: {
  email?: string;
  user_metadata?: Record<string, unknown>;
}) {
  const metadata = user.user_metadata || {};

  const possibleName =
    metadata.full_name ||
    metadata.name ||
    metadata.user_name ||
    metadata.preferred_username;

  if (typeof possibleName === "string" && possibleName.trim()) {
    return possibleName.trim();
  }

  if (user.email) {
    return user.email.split("@")[0];
  }

  return "e-z.rsvp user";
}

export async function GET(request: NextRequest) {
  const siteUrl = getSiteUrl(request);
  const secure = siteUrl.startsWith("https://");
  const redirectToDashboard = new URL("/dashboard", siteUrl);
  const redirectToLogin = new URL("/login", siteUrl);

  const error =
    request.nextUrl.searchParams.get("error") ||
    request.nextUrl.searchParams.get("error_description");

  if (error) {
    redirectToLogin.searchParams.set("error", error);
    return NextResponse.redirect(redirectToLogin);
  }

  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    redirectToLogin.searchParams.set("error", "Missing OAuth code.");
    return NextResponse.redirect(redirectToLogin);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    redirectToLogin.searchParams.set("error", "Missing Supabase configuration.");
    return NextResponse.redirect(redirectToLogin);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError || !data.user) {
    redirectToLogin.searchParams.set(
      "error",
      exchangeError?.message || "Google sign-in failed."
    );
    return NextResponse.redirect(redirectToLogin);
  }

  const user = data.user;

  const profile = {
    name: getUserDisplayName(user),
    email: user.email || "",
    phone: "",
    avatarUrl:
      typeof user.user_metadata?.avatar_url === "string"
        ? user.user_metadata.avatar_url
        : typeof user.user_metadata?.picture === "string"
          ? user.user_metadata.picture
          : "",
  };

  const response = NextResponse.redirect(redirectToDashboard);

  response.cookies.set("ez_auth", "1", {
    path: "/",
    sameSite: "lax",
    secure,
    maxAge: 60 * 60 * 24 * 30,
  });

  response.cookies.set(
    "ez_user_profile",
    encodeURIComponent(JSON.stringify(profile)),
    {
      path: "/",
      sameSite: "lax",
      secure,
      maxAge: 60 * 60 * 24 * 30,
    }
  );

  if (data.session?.access_token) {
    response.cookies.set("ez_supabase_access_token", data.session.access_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure,
      maxAge: data.session.expires_in ?? 60 * 60,
    });
  }

  if (data.session?.refresh_token) {
    response.cookies.set(
      "ez_supabase_refresh_token",
      data.session.refresh_token,
      {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure,
        maxAge: 60 * 60 * 24 * 30,
      }
    );
  }

  return response;
}