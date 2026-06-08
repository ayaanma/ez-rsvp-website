import { NextRequest, NextResponse } from "next/server";

function siteUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

function setAuthCookies(response: NextResponse, request: NextRequest, user: { name: string; email: string }) {
  const secure = siteUrl(request).startsWith("https://");

  response.cookies.set("ez_auth", "1", {
    path: "/",
    sameSite: "lax",
    secure,
    maxAge: 60 * 60 * 24 * 30
  });

  response.cookies.set("ez_user_profile", JSON.stringify(user), {
    path: "/",
    sameSite: "lax",
    secure,
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as {
    mode?: "login" | "signup";
    name?: string;
    email?: string;
    password?: string;
  } | null;

  if (!body?.email || !body?.password) {
    return jsonError("Email and password are required.");
  }

  const cleanEmail = body.email.trim().toLowerCase();
  const displayName = body.name?.trim() || cleanEmail.split("@")[0] || "e-z.rsvp user";
  const user = { name: displayName, email: cleanEmail };
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    const response = NextResponse.json({ ok: true, redirectTo: "/dashboard", demo: true, user });
    setAuthCookies(response, request, user);
    return response;
  }

  const endpoint = body.mode === "signup"
    ? `${supabaseUrl}/auth/v1/signup`
    : `${supabaseUrl}/auth/v1/token?grant_type=password`;

  const payload = body.mode === "signup"
    ? { email: cleanEmail, password: body.password, data: { name: displayName, full_name: displayName } }
    : { email: cleanEmail, password: body.password };

  const supabaseResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`
    },
    body: JSON.stringify(payload)
  });

  const data = await supabaseResponse.json().catch(() => ({}));

  if (!supabaseResponse.ok) {
    return jsonError(data.msg || data.error_description || data.message || "Authentication failed.", supabaseResponse.status);
  }

  const supabaseUser = data.user ?? data.session?.user;
  const resolvedUser = {
    name: supabaseUser?.user_metadata?.name || supabaseUser?.user_metadata?.full_name || displayName,
    email: supabaseUser?.email || cleanEmail
  };

  const response = NextResponse.json({ ok: true, redirectTo: "/dashboard", user: resolvedUser });
  setAuthCookies(response, request, resolvedUser);

  if (data.access_token) {
    response.cookies.set("ez_supabase_access_token", data.access_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: siteUrl(request).startsWith("https://"),
      maxAge: data.expires_in ?? 60 * 60
    });
  }

  if (data.refresh_token) {
    response.cookies.set("ez_supabase_refresh_token", data.refresh_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: siteUrl(request).startsWith("https://"),
      maxAge: 60 * 60 * 24 * 30
    });
  }

  return response;
}
