import Link from "next/link";
import type { Route } from "next";

function ProviderButton({
  provider,
  icon,
  href,
}: {
  provider: string;
  icon: string;
  href: Route;
}) {
  return (
    <Link className="auth-provider-button" href={href}>
      <span className="auth-provider-icon">{icon}</span>
      <span>Sign in with {provider}</span>
    </Link>
  );
}

export default function LoginPage() {
  return (
    <main className="main-shell auth-wrap">
      <div className="auth-card">
        <h1 className="section-title">Log in</h1>
        <p className="section-copy">Enter the demo app with a social account.</p>
        <div className="auth-provider-stack">
          <ProviderButton provider="Google" icon="G" href="/dashboard" />
          <ProviderButton provider="Apple" icon="" href="/dashboard" />
        </div>
      </div>
    </main>
  );
}
