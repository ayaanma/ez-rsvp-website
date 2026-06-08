"use client";

import { FormEvent, useEffect, useState } from "react";
import { getStoredUser, setStoredUser } from "@/lib/auth-client";

const favoriteCategories = ["Nightlife", "Dining", "Culture", "Comedy", "Music", "Outdoor"];
const notificationOptions = [
  { title: "Reveal reminders", description: "Get notified before your mystery event unlocks." },
  { title: "Group activity", description: "Hear when friends join, leave, or RSVP to shared plans." },
  { title: "Event changes", description: "Receive updates if timing, venue notes, or entry details change." }
];
const safetyOptions = [
  { title: "Verified organizers only", description: "Prioritize events from reviewed organizers and public venues." },
  { title: "Emergency contact", description: "Keep an emergency contact preference attached to your account." },
  { title: "Accessibility notes", description: "Include accessibility needs in future event matching." }
];

function ToggleRow({ title, description, defaultChecked = true }: { title: string; description: string; defaultChecked?: boolean }) {
  return (
    <label className="toggle-row">
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <input type="checkbox" defaultChecked={defaultChecked} />
      <span className="switch" />
    </label>
  );
}

export function AccountSettingsForm() {
  const [name, setName] = useState("e-z.rsvp user");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState(12);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) return;

    setName(user.name || "e-z.rsvp user");
    setEmail(user.email || "");
    setPhone(user.phone || "");
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStoredUser({ name, email, phone });
    document.cookie = `ez_user_profile=${encodeURIComponent(JSON.stringify({ name, email, phone }))}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    document.cookie = `ez_auth=1; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form className="account-panel card" onSubmit={handleSubmit}>
      <section className="settings-section">
        <h2>Account settings</h2>
        <p className="section-copy" style={{ marginBottom: 18 }}>Update the information used for RSVP confirmations and account details.</p>
        <div className="settings-grid">
          <label className="form-section">
            <span className="small-label">Name</span>
            <input className="input" value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="form-section">
            <span className="small-label">Email</span>
            <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="form-section">
            <span className="small-label">Phone number</span>
            <input className="input subtle-placeholder" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(555) 555-5555" />
          </label>
        </div>
      </section>

      <section className="settings-section">
        <h2>Defaults</h2>
        <p className="section-copy" style={{ marginBottom: 18 }}>Set your normal starting point and comfort radius.</p>
        <div className="settings-grid">
          <label className="form-section">
            <span className="small-label">Default address</span>
            <input className="input subtle-placeholder" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="New York, NY" />
          </label>
          <div className="form-section">
            <div className="label-row">
              <label className="small-label" htmlFor="default-radius">Default radius</label>
              <span>{radius} miles</span>
            </div>
            <input id="default-radius" className="range" type="range" min="1" max="50" value={radius} onChange={(event) => setRadius(Number(event.target.value))} />
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <p className="small-label" style={{ marginBottom: 12 }}>Favorite categories</p>
          <div className="favorite-grid">
            {favoriteCategories.map((category) => (
              <button className="favorite-btn" type="button" key={category}>{category}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2>Notifications</h2>
        <div className="toggle-list">
          {notificationOptions.map((option) => <ToggleRow key={option.title} {...option} />)}
        </div>
      </section>

      <section className="settings-section">
        <h2>Safety preferences</h2>
        <div className="toggle-list">
          {safetyOptions.map((option) => <ToggleRow key={option.title} {...option} />)}
        </div>
      </section>

      <section className="settings-section danger-zone">
        <h2>Delete account</h2>
        <p className="section-copy">Permanently delete your profile, RSVPs, group memberships, and saved preferences.</p>
        <button className="btn btn-danger" type="button" style={{ marginTop: 18 }}>Delete account</button>
      </section>

      <div className="hero-actions">
        <button className="btn btn-primary" type="submit">Save settings</button>
        {saved && <p className="section-copy">Saved.</p>}
      </div>
    </form>
  );
}
