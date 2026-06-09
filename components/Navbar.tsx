"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearStoredUser, getStoredUser, isLoggedIn } from "@/lib/auth-client";

type NavLink = { href: Route; label: string };

const appLinks: NavLink[] = [
  { href: "/dashboard", label: "My events" },
  { href: "/create-rsvp", label: "Find events" },
  { href: "/groups", label: "Groups" },
];

const publicLinks: NavLink[] = [
  { href: "/login", label: "Log in" },
  { href: "/signup", label: "Create account" },
];

function initialsFromName(name?: string) {
  const parts = (name || "e-z user").trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "EZ";
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [initials, setInitials] = useState("EZ");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      const user = getStoredUser();
      const loggedIn = Boolean(user) || isLoggedIn();
      setAuthenticated(loggedIn);
      setInitials(initialsFromName(user?.name));
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
    setMenuOpen(false);

    await fetch("/api/auth/logout", {
      method: "POST",
      cache: "no-store",
    }).catch(() => null);

    clearStoredUser();
    router.replace("/");
    router.refresh();
  }

  const links = authenticated ? appLinks : publicLinks;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo">
          e-z.rsvp
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                className={`nav-link ${active ? "active" : ""}`}
                href={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {authenticated && (
          <div className="profile-menu-wrap">
            <button
              type="button"
              className="icon-button profile-trigger"
              aria-label="Account menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
              onMouseEnter={() => setMenuOpen(true)}
            >
              {initials}
            </button>

            {menuOpen && (
              <div
                className="profile-menu"
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <Link className="profile-menu-item" href="/account">
                  Settings
                </Link>

                <button
                  type="button"
                  className="profile-menu-item"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
