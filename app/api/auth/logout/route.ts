import { NextResponse } from "next/server";

const COOKIE_NAMES = [
  "ez_auth",
  "ez_user_profile",
  "ez_demo_user",
  "ez_supabase_access_token",
  "ez_supabase_refresh_token",
  "sb-access-token",
  "sb-refresh-token",
];

export async function POST() {
  const response = NextResponse.json({ ok: true });

  for (const name of COOKIE_NAMES) {
    response.cookies.set(name, "", {
      path: "/",
      maxAge: 0,
      sameSite: "lax",
    });
  }

  return response;
}
