export type StoredUser = {
  name: string;
  email: string;
  phone?: string;
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

function expireCookie(name: string) {
  if (typeof document === "undefined") return;

  const options = [
    `${name}=; Max-Age=0; path=/`,
    `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`,
    `${name}=; Max-Age=0; path=/; SameSite=Lax`,
  ];

  options.forEach((cookie) => {
    document.cookie = cookie;
  });
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;

  const stored = window.localStorage.getItem(AUTH_KEY);

  if (stored) {
    try {
      return JSON.parse(stored) as StoredUser;
    } catch {
      window.localStorage.removeItem(AUTH_KEY);
    }
  }

  const cookieProfile = readCookie("ez_user_profile");

  if (cookieProfile) {
    try {
      const profile = JSON.parse(cookieProfile) as StoredUser;
      window.localStorage.setItem(AUTH_KEY, JSON.stringify(profile));
      return profile;
    } catch {
      return null;
    }
  }

  return null;
}

export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return Boolean(getStoredUser() || readCookie("ez_auth") === "1");
}

export function setStoredUser(user: StoredUser) {
  if (typeof window === "undefined") return;

  const normalizedUser = {
    name: user.name || user.email?.split("@")[0] || "e-z.rsvp user",
    email: user.email || "",
    phone: user.phone || "",
  };

  window.localStorage.setItem(AUTH_KEY, JSON.stringify(normalizedUser));
  document.cookie = `ez_auth=1; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  document.cookie = `ez_user_profile=${encodeURIComponent(
    JSON.stringify(normalizedUser)
  )}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  window.dispatchEvent(new Event("ez-auth-change"));
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AUTH_KEY);
  window.localStorage.removeItem("ez_auth");
  window.localStorage.removeItem("ez_demo_user");

  [
    "ez_auth",
    "ez_user_profile",
    "ez_demo_user",
    "ez_supabase_access_token",
    "ez_supabase_refresh_token",
    "sb-access-token",
    "sb-refresh-token",
  ].forEach(expireCookie);

  window.dispatchEvent(new Event("ez-auth-change"));
}
