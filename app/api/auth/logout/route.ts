import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  for (const name of [
    "ez_auth",
    "ez_user_profile",
    "ez_demo_user",
    "ez_supabase_access_token",
    "ez_supabase_refresh_token"
  ]) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }

  return response;
}
