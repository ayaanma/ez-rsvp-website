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
  { href: "/social", label: "Social" },
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
    await fetch("/api/auth/logout", { method: "POST", cache: "no-store" }).catch(() => null);
    clearStoredUser();
    router.replace("/");
    router.refresh();
  }

  const links = authenticated ? appLinks : publicLinks;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="logo" href="/" aria-label="e-z.rsvp home">
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
        <div className="header-actions">
          {authenticated && (
            <div
              className="profile-menu-wrap"
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                className="icon-button profile-trigger"
                onClick={() => setMenuOpen((value) => !value)}
                aria-label="Open account menu"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="avatar-initials">{initials}</span>
              </button>
              {menuOpen && (
                <div className="profile-menu">
                  <Link href="/account">Settings</Link>
                  <button type="button" onClick={handleLogout}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
