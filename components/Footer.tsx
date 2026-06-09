import Link from "next/link";

const footerLinks = [
  { href: "/download", label: "Download the App" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/safety-trust", label: "Safety & Trust" },
  { href: "/support", label: "Support" },
] as const;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link href="/" className="logo" aria-label="e-z.rsvp home">
          e-z.rsvp
        </Link>

        <nav className="footer-links" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <p>© 2026 e-z.rsvp.</p>
      </div>
    </footer>
  );
}
