"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const appLinks = [
  { href: "/dashboard", label: "My events" },
  { href: "/create-rsvp", label: "Find events" },
  { href: "/groups", label: "Groups" }
];

export function Navbar() {
  const pathname = usePathname();
  const publicPage = pathname === "/" || pathname === "/login" || pathname === "/signup";
  const links = publicPage ? [
    { href: "/login", label: "Log in" },
    { href: "/signup", label: "Create account" }
  ] : appLinks;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo">e-z.rsvp</Link>
        <nav className="nav-links" aria-label="Main navigation">
          {links.map((link) => {
            const active = pathname === link.href;
            return <Link key={link.href} className={`nav-link ${active ? "active" : ""}`} href={link.href}>{link.label}</Link>;
          })}
        </nav>
        {!publicPage && <Link className="icon-button" href="/account" aria-label="Account">◎</Link>}
      </div>
    </header>
  );
}
