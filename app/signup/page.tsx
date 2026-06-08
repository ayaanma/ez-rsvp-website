import Link from "next/link";

function ProviderButton({ provider, icon, href }: { provider: string; icon: string; href: string }) {
  return (
    <Link className="auth-provider-button" href={href}>
      <span className="auth-provider-icon">{icon}</span>
      <span>Sign in with {provider}</span>
    </Link>
  );
}

export default function SignupPage() {
  return (
    <main className="main-shell auth-wrap">
      <div className="auth-card">
        <h1 className="section-title">Create account</h1>
        <p className="section-copy">Create your e-z.rsvp demo account using a social sign-in.</p>
        <div className="auth-provider-stack">
          <ProviderButton provider="Google" icon="G" href="/dashboard" />
          <ProviderButton provider="Apple" icon="" href="/dashboard" />
        </div>
      </div>
    </main>
  );
}
