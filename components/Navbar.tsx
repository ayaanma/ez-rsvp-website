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
  { href: "/groups", label: "Groups" }
];

const publicLinks: NavLink[] = [
  { href: "/login", label: "Log in" },
  { href: "/signup", label: "Create account" }
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

  useEffect(() => {
    const syncAuth = () => {
      const user = getStoredUser();
      setAuthenticated(Boolean(user) || isLoggedIn());
      setInitials(initialsFromName(user?.name));
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("ez-auth-change", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("ez-auth-change", syncAuth);
    };
  }, []);

  async function handleLogout() {
    clearStoredUser();
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    setAuthenticated(false);
    router.push("/");
    router.refresh();
  }

  const links = authenticated ? appLinks : publicLinks;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo">e-z.rsvp</Link>

        <nav className="nav-links" aria-label="Main navigation">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} className={`nav-link ${active ? "active" : ""}`} href={link.href}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {authenticated && (
          <div className="profile-menu-wrap">
            <button className="icon-button profile-trigger" type="button" aria-label="Open account menu">
              {initials}
            </button>
            <div className="profile-menu" role="menu">
              <Link href="/account" role="menuitem">Settings</Link>
              <button type="button" role="menuitem" onClick={handleLogout}>Log out</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
