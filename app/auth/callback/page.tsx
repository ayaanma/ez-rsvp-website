"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setStoredUser } from "@/lib/auth-client";

type JwtPayload = {
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    picture?: string;
    email?: string;
  };
};

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

function getHashParams() {
  if (typeof window === "undefined") return new URLSearchParams();

  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;

  return new URLSearchParams(hash);
}

function getQueryParams() {
  if (typeof window === "undefined") return new URLSearchParams();

  return new URLSearchParams(window.location.search);
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Finishing sign in...");

  useEffect(() => {
    const hashParams = getHashParams();
    const queryParams = getQueryParams();

    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    const error =
      queryParams.get("error") ||
      queryParams.get("error_description") ||
      hashParams.get("error") ||
      hashParams.get("error_description");

    if (error) {
      setMessage("Sign in failed. Redirecting...");
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (!accessToken) {
      setMessage("Missing sign-in token. Redirecting...");
      router.replace("/login?error=Missing OAuth token.");
      return;
    }

    const payload = decodeJwtPayload(accessToken);

    const metadata = payload?.user_metadata || {};

    const name =
      metadata.full_name ||
      metadata.name ||
      payload?.email?.split("@")[0] ||
      "e-z.rsvp user";

    const email = metadata.email || payload?.email || "";

    const avatarUrl = metadata.avatar_url || metadata.picture || "";

    const profile = {
      name,
      email,
      phone: "",
      avatarUrl,
    };

    setStoredUser(profile);

    writeCookie("ez_auth", "1", 60 * 60 * 24 * 30);
    writeCookie("ez_user_profile", JSON.stringify(profile), 60 * 60 * 24 * 30);

    if (accessToken) {
      writeCookie("ez_supabase_access_token", accessToken, 60 * 60);
    }

    if (refreshToken) {
      writeCookie("ez_supabase_refresh_token", refreshToken, 60 * 60 * 24 * 30);
    }

    window.history.replaceState({}, document.title, "/auth/callback");

    router.replace("/dashboard");
  }, [router]);

  return (
    <main className="main-shell auth-wrap">
      <section className="auth-card">
        <p className="page-kicker">Authentication</p>
        <h1 className="page-title">One moment.</h1>
        <p className="page-subtitle">{message}</p>
      </section>
    </main>
  );
}
