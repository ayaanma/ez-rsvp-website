"use client";

import { useEffect, useState } from "react";
import { categories } from "@/lib/mock-data";

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
  const [radius, setRadius] = useState(10);
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior }); }, []);

  return (
    <main className="main-shell">
      <h1 className="page-title">Your account.</h1>
      <p className="page-kicker">Keep your defaults, safety preferences, and notifications polished.</p>
      <section className="card account-panel">
        <div className="settings-section">
          <h2>Account settings</h2>
          <div className="form-section"><label className="small-label">Name</label><input className="input" defaultValue="Ayaan Malik" /></div>
          <div className="form-section"><label className="small-label">Email</label><input className="input" defaultValue="ayaan@example.com" /></div>
          <div className="form-section"><label className="small-label">Phone number</label><input className="input" defaultValue="(555) 123-4567" /></div>
          <button className="btn btn-primary">Save account</button>
        </div>

        <div className="settings-section">
          <h2>Defaults</h2>
          <div className="form-section"><label className="small-label">Default address</label><input className="input" defaultValue="New York, NY" /></div>
          <div className="form-section">
            <div className="label-row"><label className="small-label" htmlFor="default-radius">Default radius</label><span>{radius} miles</span></div>
            <input className="range" id="default-radius" type="range" min="1" max="50" value={radius} onChange={(event) => setRadius(Number(event.target.value))} />
          </div>
          <label className="small-label">Favorite categories</label>
          <div className="favorite-grid">{categories.slice(0, 8).map((cat) => <button className="favorite-btn" key={cat}>{cat}</button>)}</div>
        </div>

        <div className="settings-section">
          <h2>Notifications</h2>
          <div className="toggle-list">
            {notificationSettings.map((item) => <ToggleRow key={item.title} {...item} />)}
          </div>
        </div>

        <div className="settings-section">
          <h2>Safety preferences</h2>
          <div className="toggle-list">
            {safetySettings.map((item, index) => <ToggleRow key={item.title} {...item} defaultChecked={index === 0 || index === 2} />)}
          </div>
        </div>

        <div className="settings-section danger-zone">
          <h2>Delete account</h2>
          <p className="section-copy">Permanently delete your profile, RSVP history, groups, and saved preferences.</p>
          <button className="btn btn-danger">Delete account</button>
        </div>
      </section>
    </main>
  );
}
