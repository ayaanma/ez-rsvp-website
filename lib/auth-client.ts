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
  window.dispatchEvent(new Event("ez-auth-change"));
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event("ez-auth-change"));
}
