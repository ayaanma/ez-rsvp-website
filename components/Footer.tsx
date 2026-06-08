import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link href="/" className="logo">e-z.rsvp</Link>
        <div className="footer-links">
          <Link href="/download">Download the App</Link>
          <Link href="/">Terms of Service</Link>
          <Link href="/">Privacy Policy</Link>
          <Link href="/">Safety & Trust</Link>
          <Link href="/">Support</Link>
        </div>
        <span>© 2026 e-z.rsvp. The thrill of the unknown.</span>
      </div>
    </footer>
  );
}
