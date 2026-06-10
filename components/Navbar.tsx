"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearStoredUser, getStoredUser, isLoggedIn } from "@/lib/auth-client";

type NavLink = {
  href: Route;
  label: string;
};

const appLinks: NavLink[] = [
  { href: "/dashboard", label: "My events" },
  { href: "/create-rsvp", label: "Find events" },
  { href: "/social", label: "Social" },
];

const publicLinks: NavLink[] = [
  { href: "/login", label: "Log in" },
  { href: "/signup", label: "Create account" },
];

function initialsFromName(name?: string) {
  const parts = (name || "e-z user").trim().split(/\s+/).filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "EZ";
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [initials, setInitials] = useState("EZ");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      const user = getStoredUser();
      const loggedIn = Boolean(user) || isLoggedIn();

      setAuthenticated(loggedIn);
      setInitials(initialsFromName(user?.name));
      setAvatarUrl(user?.avatarUrl ?? "");

      if (!loggedIn) setMenuOpen(false);
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("ez-auth-change", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("ez-auth-change", syncAuth);
    };
  }, [pathname]);

  async function handleLogout() {
    clearStoredUser();
    setAuthenticated(false);
    setInitials("EZ");
    setAvatarUrl("");
    setMenuOpen(false);

    await fetch("/api/auth/logout", { method: "POST", cache: "no-store" }).catch(() => null);
    clearStoredUser();
    router.replace("/");
    router.refresh();
  }

  const links = authenticated ? appLinks : publicLinks;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/">
          e-z.rsvp
        </Link>

        <nav className="nav-links" aria-label="Primary navigation">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link key={link.href} className={`nav-link ${active ? "active" : ""}`} href={link.href}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {authenticated ? (
          <div
            className="profile-menu-wrap"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              type="button"
              className="profile-trigger icon-button"
              aria-label="Open account menu"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
              style={{
                background: avatarUrl ? "transparent" : "#91C4F2",
                color: "var(--shadow-grey)",
                overflow: "hidden",
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Your profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    objectFit: "cover",
                    borderRadius: "999px",
                  }}
                />
              ) : (
                initials
              )}
            </button>

            {menuOpen && (
              <div className="profile-menu" role="menu">
                <Link className="profile-menu-link" href="/account" role="menuitem">
                  Settings
                </Link>
                <button className="profile-menu-button" type="button" onClick={handleLogout} role="menuitem">
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="header-spacer" aria-hidden="true" />
        )}
      </div>
    </header>
  );
}
