"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { setStoredUser } from "@/lib/auth-client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "signup", name, email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Unable to create account.");
      }

      setStoredUser({
        name: data.user?.name || name || email.split("@")[0] || "e-z.rsvp user",
        email: data.user?.email || email,
      });

      window.location.assign(data.redirectTo || "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main-shell">
      <section className="auth-wrap">
        <div className="auth-card">
          <p className="page-kicker compact-kicker">Start your next plan.</p>
          <h1 className="page-title auth-title">Create account</h1>
          <p className="page-subtitle auth-subtitle">
            Create an account manually, or continue with Google.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="small-label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="input"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
            />

            <label className="small-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />

            <label className="small-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              minLength={6}
              required
            />

            {error && <p className="form-error">{error}</p>}

            <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="auth-divider" aria-hidden="true">
            <span />
            <small>or</small>
            <span />
          </div>

          <a className="auth-provider-button" href="/api/auth/google">
            <span className="auth-provider-icon">G</span>
            <span>Sign in with Google</span>
          </a>

          <p className="auth-switch-text">
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
