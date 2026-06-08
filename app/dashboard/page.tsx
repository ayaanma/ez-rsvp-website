"use client";

import { useMemo, useState } from "react";
import { events, pastEvents, rsvps } from "@/lib/mock-data";
import { RSVPCard } from "@/components/RSVPCard";
import type { EventItem, PastEvent, RSVP } from "@/types";

function DetailIcon({ src, alt, fallback }: { src?: string; alt: string; fallback: string }) {
  return (
    <span className="history-icon">
      {src ? <img className="history-icon-img" src={src} alt={alt} /> : fallback}
    </span>
  );
}

type SelectedItem =
  | { kind: "upcoming"; event: EventItem; rsvp: RSVP; locked: boolean }
  | { kind: "past"; event: PastEvent };

function pastEventToCardEvent(event: PastEvent): EventItem {
  return {
    id: event.id,
    name: event.name,
    category: event.category,
    description: event.wouldDoAgain,
    venue: event.name,
    address: event.address,
    city: "New York, NY",
    area: "",
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    price: 32,
    remainingTickets: 0,
    capacity: 40,
    organizerName: "e-z.rsvp",
    color: "wisteria",
    groupMembersGoing: []
  };
}

function DetailOverlay({ selected, onClose }: { selected: SelectedItem | null; onClose: () => void }) {
  if (!selected) return null;

  if (selected.kind === "past") {
    const cardEvent = pastEventToCardEvent(selected.event);
    return (
      <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
        <div className="modal-card" onClick={(event) => event.stopPropagation()}>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
          <h1 className="page-title modal-title">Past event.</h1>
          <p className="page-kicker">Your memory from this RSVP.</p>
          <div className="dashboard-grid modal-grid">
            <div>
              <RSVPCard event={cardEvent} locked={false} />
              <div className="event-description-card">
                <h2>About this place</h2>
                <p>{selected.event.name} was a curated {selected.event.category.toLowerCase()} experience designed to be easy to enter, simple to enjoy, and memorable after the reveal.</p>
              </div>
            </div>
            <aside className="sidebar-card">
              <h2>{selected.event.name}</h2>
              <div className="history-list">
                <div className="history-item"><DetailIcon src="/icons/clock.svg" fallback="◷" alt="When" /><div><h3>When</h3><p>{selected.event.date}</p></div></div>
                <div className="history-item"><DetailIcon src="/icons/map.svg" alt="Location" fallback="⌁" /><div><h3>Location</h3><p>{selected.event.address}</p></div></div>
                <div className="history-item"><DetailIcon src="/icons/shirt.svg" alt="Dress code" fallback="◐" /><div><h3>Dress code</h3><p>Comfortable casual</p></div></div>
                <div className="history-item"><DetailIcon src="/homepage-images/shield.svg" alt="Safety" fallback="◎" /><div><h3>Safety</h3><p>Verified public venue.</p></div></div>
                <div className="history-item"><DetailIcon src="/icons/heart.svg" fallback="♡" alt="Your review" /><div><h3>Your review</h3><p>{selected.event.wouldDoAgain}</p></div></div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  const { event, locked } = selected;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card" onClick={(clickEvent) => clickEvent.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <h1 className="page-title modal-title">{locked ? "Still locked." : "It's revealed."}</h1>
        <p className="page-kicker">{locked ? "The exact event details unlock two hours before it starts." : "Your surprise plan is ready."}</p>
        <div className="dashboard-grid modal-grid">
          <div>
            <RSVPCard event={event} locked={locked} />
            <div className="event-description-card">
              <h2>About this place</h2>
              <p>{locked ? "This venue is selected for a public, easy-to-navigate reveal. Expect clear arrival instructions, a comfortable setting, and everything you need to know two hours before start time." : event.description}</p>
              <p>{locked ? "Once unlocked, you’ll see what is offered there and what to do when you arrive." : `At ${event.venue}, you can expect a planned experience with entry details, safety notes, and a simple plan for what to do when you get there.`}</p>
            </div>
          </div>
          <aside className="sidebar-card">
            <h2>{locked ? "What you can see" : event.name}</h2>
            <div className="history-list">
              <div className="history-item"><DetailIcon src="/icons/cost.svg" alt="Cost" fallback="$" /><div><h3>Cost</h3><p>You paid ${event.price}</p></div></div>
              <div className="history-item"><DetailIcon src="/icons/map.svg" alt="Location" fallback="⌁" /><div><h3>Location</h3><p>{locked ? "Revealed two hours before" : event.address}</p></div></div>
              <div className="history-item"><DetailIcon src="/homepage-images/shield.svg" alt="Safety" fallback="◎" /><div><h3>Safety</h3><p>{event.safetyNotes ?? "Verified public venue."}</p></div></div>
              <div className="history-item"><DetailIcon src="/icons/shirt.svg" alt="Dress code" fallback="◐" /><div><h3>Dress code</h3><p>{event.dressCode ?? "Comfortable casual"}</p></div></div>
            </div>
            {!locked && <div className="hero-actions"><button className="btn btn-primary">Add to calendar</button><button className="btn btn-secondary">Share</button></div>}
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const upcoming = useMemo(() => rsvps
    .map((r) => ({ rsvp: r, event: events.find((event) => event.id === r.eventId)! }))
    .sort((a, b) => new Date(a.event.startTime).getTime() - new Date(b.event.startTime).getTime()), []);

  return (
    <main className="main-shell">
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, flexWrap:"wrap"}}>
        <div>
          <h1 className="page-title">Welcome Back.</h1>
          <p className="page-kicker">Your upcoming thrills await.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section>
          <h2 className="section-title upcoming-heading">Upcoming RSVPs</h2>
          <div className="stack rsvp-stack">
            {upcoming.map(({ rsvp, event }) => (
              <button className="card-button" key={rsvp.id} onClick={() => setSelected({ kind: "upcoming", event, rsvp, locked: rsvp.status === "locked" })}>
                <RSVPCard event={event} locked={rsvp.status === "locked"} categoryLabel={rsvp.status === "locked" ? "Hidden Category" : event.category} />
              </button>
            ))}
          </div>
        </section>

        <aside className="stack">
          <div className="sidebar-card">
            <h2>Curated for You</h2>
            <div className="chip-row">
              <span className="chip">Underground Beats</span><span className="chip">Speakeasy</span><span className="chip">Late Night Eats</span><span className="chip">Rooftop Views</span>
            </div>
          </div>
          <div className="sidebar-card">
            <h2>Past events</h2>
            <div className="history-list">
              {pastEvents.map((event) => (
                <button className="history-item history-button" key={event.id} onClick={() => setSelected({ kind: "past", event })}>
                  <DetailIcon src={event.icon} fallback="•" alt={event.category} />
                  <div><h3>{event.name}</h3><p>{event.date} · {event.category}</p></div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
      <DetailOverlay selected={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
