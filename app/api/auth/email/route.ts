import { NextRequest, NextResponse } from "next/server";

function siteUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    const response = NextResponse.json({ ok: true, redirectTo: "/dashboard", demo: true });
    response.cookies.set("ez_demo_user", body.name || body.email, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30
    });
    return response;
  }

  const endpoint = body.mode === "signup"
    ? `${supabaseUrl}/auth/v1/signup`
    : `${supabaseUrl}/auth/v1/token?grant_type=password`;

  const payload = body.mode === "signup"
    ? { email: body.email, password: body.password, data: { name: body.name ?? "" } }
    : { email: body.email, password: body.password };

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

  const response = NextResponse.json({ ok: true, redirectTo: "/dashboard" });

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
