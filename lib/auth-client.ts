export type StoredUser = {
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
};

const AUTH_KEY = "ez_auth_user";

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function readCookie(name: string) {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  if (!match) return null;

  return safeDecode(match.slice(name.length + 1));
}

function readCookieProfile() {
  const cookieProfile = readCookie("ez_user_profile");

  if (!cookieProfile) return null;

  try {
    return JSON.parse(cookieProfile) as StoredUser;
  } catch {
    return null;
  }
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;

  const cookieProfile = readCookieProfile();

  if (cookieProfile?.email || cookieProfile?.name) {
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(cookieProfile));
    return cookieProfile;
  }

  const stored = window.localStorage.getItem(AUTH_KEY);

  if (stored) {
    try {
      return JSON.parse(stored) as StoredUser;
    } catch {
      window.localStorage.removeItem(AUTH_KEY);
    }
  }

  if (readCookie("ez_auth") === "1") {
    const fallback = { name: "e-z.rsvp user", email: "" };
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(fallback));
    return fallback;
  }

  return null;
}

export function isLoggedIn() {
  if (typeof window === "undefined") return false;

  return Boolean(getStoredUser());
}

export function setStoredUser(user: StoredUser) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));

  writeCookie("ez_auth", "1", 60 * 60 * 24 * 30);
  writeCookie("ez_user_profile", JSON.stringify(user), 60 * 60 * 24 * 30);

  window.dispatchEvent(new Event("ez-auth-change"));
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AUTH_KEY);

  deleteCookie("ez_auth");
  deleteCookie("ez_user_profile");
  deleteCookie("ez_supabase_access_token");
  deleteCookie("ez_supabase_refresh_token");

  window.dispatchEvent(new Event("ez-auth-change"));
}