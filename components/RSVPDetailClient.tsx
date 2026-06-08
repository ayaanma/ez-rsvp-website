"use client";

import Link from "next/link";
import { RSVPCard } from "@/components/RSVPCard";
import type { EventItem, RSVP } from "@/types";
import { addEventToCalendar, shareEvent } from "@/lib/browser-actions";

export function RSVPDetailClient({ event, rsvp }: { event: EventItem; rsvp: RSVP }) {
  const locked = rsvp.status === "locked";

  return (
    <main className="main-shell dashboard-grid">
      <section>
        <Link href="/dashboard" className="btn btn-secondary">← Back to My events</Link>
        <h1 className="page-title">{locked ? "Still locked." : "It's revealed."}</h1>
        <p className="page-subtitle">{locked ? "The exact event details unlock two hours before it starts." : "Your surprise plan is ready."}</p>

        <RSVPCard event={event} locked={locked} hideCategory={locked} categoryLabel={locked ? "Hidden Category" : event.category} hiddenTitle={locked ? "Location Hidden" : event.name} />

        {!locked && (
          <div className="group-overlay-actions">
            <button className="btn btn-primary" type="button" onClick={() => addEventToCalendar(event)}>Add to calendar</button>
            <button className="btn btn-secondary" type="button" onClick={() => shareEvent(event)}>Share</button>
          </div>
        )}
      </section>

      <aside className="sidebar-card">
        <h2>{locked ? "What you can see" : event.name}</h2>
        <div className="history-list">
          <div className="history-item"><span className="history-icon">$</span><div><h3>Cost</h3><p>You paid ${event.price}</p></div></div>
          <div className="history-item"><span className="history-icon">⌖</span><div><h3>Location</h3><p>{locked ? "Revealed two hours before" : event.address}</p></div></div>
          <div className="history-item"><span className="history-icon">✓</span><div><h3>Safety</h3><p>{event.safetyNotes ?? "Verified public venue."}</p></div></div>
          <div className="history-item"><span className="history-icon">◌</span><div><h3>Dress code</h3><p>{event.dressCode ?? "Comfortable casual"}</p></div></div>
        </div>
      </aside>
    </main>
  );
}
