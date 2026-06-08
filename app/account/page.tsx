"use client";

import { useEffect, useMemo, useState } from "react";
import { categories } from "@/lib/mock-data";
import { getStoredUser } from "@/lib/auth-client";

const notificationSettings = [
  { title: "Reveal reminders", description: "Get a reminder before an RSVP unlocks." },
  { title: "Friend activity", description: "See when friends or group members join events." },
  { title: "New group invites", description: "Notify me when someone shares a group code or invite." }
];

const safetySettings = [
  { title: "No 21+ events", description: "Avoid events with age restrictions or nightlife-only entry." },
  { title: "Step-free access preferred", description: "Prioritize venues with accessible entrances and routes." },
  { title: "Share reveal with emergency contact", description: "Prepare a placeholder for sharing the final event details." }
];

function ToggleRow({ title, description, defaultChecked = true }: { title: string; description: string; defaultChecked?: boolean }) {
  return (
    <label className="toggle-row">
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <input type="checkbox" defaultChecked={defaultChecked} />
      <span className="switch" aria-hidden="true" />
    </label>
  );
}

export default function AccountPage() {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [defaultAddress, setDefaultAddress] = useState("");
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>(["Nightlife", "Dining", "Culture"]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    const user = getStoredUser();
    if (user) {
      setProfile({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? ""
      });
    }
  }, []);

  const visibleCategories = useMemo(() => categories.slice(0, 8), []);

  function toggleCategory(category: string) {
    setFavoriteCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  }

  return (
    <main className="main-shell">
      <p className="page-kicker">Keep your profile, safety preferences, and notifications polished.</p>
      <h1 className="page-title">Your account.</h1>

      <section className="card account-panel">
        <div className="settings-section">
          <h2>Account settings</h2>
          <div className="settings-grid">
            <label className="form-section">
              <span className="small-label">Name</span>
              <input
                className="input"
                value={profile.name}
                onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                placeholder="Your name"
              />
            </label>
            <label className="form-section">
              <span className="small-label">Email</span>
              <input
                className="input"
                type="email"
                value={profile.email}
                onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))}
                placeholder="you@example.com"
              />
            </label>
            <label className="form-section">
              <span className="small-label">Phone number</span>
              <input
                className="input account-placeholder"
                value={profile.phone}
                onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
                placeholder="(555) 555-5555"
              />
            </label>
            <label className="form-section">
              <span className="small-label">Default address</span>
              <input
                className="input account-placeholder"
                value={defaultAddress}
                onChange={(event) => setDefaultAddress(event.target.value)}
                placeholder="New York, NY"
              />
            </label>
          </div>

          <div className="form-section favorite-section">
            <span className="small-label">Favorite categories</span>
            <div className="favorite-grid">
              {visibleCategories.map((category) => {
                const selected = favoriteCategories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    className={`favorite-btn ${selected ? "selected" : ""}`}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <button className="btn btn-primary" type="button">Save account</button>
        </div>

        <div className="settings-section">
          <h2>Notifications</h2>
          <div className="toggle-list">
            {notificationSettings.map((item) => (
              <ToggleRow key={item.title} {...item} />
            ))}
          </div>
        </div>

        <div className="settings-section">
          <h2>Safety preferences</h2>
          <div className="toggle-list">
            {safetySettings.map((item, index) => (
              <ToggleRow key={item.title} {...item} defaultChecked={index !== 0} />
            ))}
          </div>
        </div>

        <div className="settings-section danger-zone">
          <h2>Delete account</h2>
          <p className="section-copy">
            Permanently delete your profile, RSVP history, groups, and saved preferences.
          </p>
          <button className="btn btn-danger" type="button">Delete account</button>
        </div>
      </section>
    </main>
  );
}
