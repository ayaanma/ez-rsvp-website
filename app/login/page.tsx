"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { setStoredUser } from "@/lib/auth-client";

export default function LoginPage() {
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
        body: JSON.stringify({ mode: "login", email, password })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Unable to log in.");
      }

      setStoredUser({
        name: data.user?.name || email.split("@")[0] || "e-z.rsvp user",
        email: data.user?.email || email
      });

      window.location.href = data.redirectTo || "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main-shell auth-wrap">
      <section className="auth-card">
        <p className="page-kicker">Welcome back.</p>
        <h1 className="section-title">Log in</h1>
        <p className="section-copy">Use your email and password, or continue with Google.</p>

        <form className="auth-form auth-form-spaced" onSubmit={handleSubmit}>
          <label className="small-label" htmlFor="email">Email</label>
          <input
            id="email"
            className="input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />

          <label className="small-label" htmlFor="password">Password</label>
          <input
            id="password"
            className="input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />

          {error && <p className="form-error">{error}</p>}

          <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <a className="auth-provider-button" href="/auth/oauth?provider=google">
          <span className="auth-provider-icon">G</span>
          <span>Sign in with Google</span>
        </a>

        <p className="auth-switch">
          New to e-z.rsvp? <Link href="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
