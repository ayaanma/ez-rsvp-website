"use client";

import { useMemo, useState } from "react";
import { events, pastEvents, rsvps } from "@/lib/mock-data";
import { RSVPCard } from "@/components/RSVPCard";
import type { EventItem, PastEvent, RSVP } from "@/types";
import { addEventToCalendar, shareEvent } from "@/lib/browser-actions";

function DetailIcon({ src, alt, fallback }: { src?: string; alt: string; fallback: string }) {
  return (
    <span className="history-icon">
      {src ? <img src={src} alt={alt} className="history-icon-img" /> : fallback}
    </span>
  );
}

type SelectedItem =
  | { kind: "upcoming"; event: EventItem; rsvp: RSVP; locked: boolean }
  | { kind: "past"; event: PastEvent };

function pastImageFor(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("velvet")) return "/event-images/velvet-lounge-venue.webp";
  if (lower.includes("neon")) return "/event-images/art-gallery-venue.jpg";
  if (lower.includes("supper")) return "/event-images/supper-club-venue.jpg";
  return undefined;
}

function pastEventToCardEvent(event: PastEvent): EventItem {
  const startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const endTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString();

  return {
    id: event.id,
    name: event.name,
    category: event.category,
    description: event.wouldDoAgain,
    venue: event.name,
    address: event.address,
    city: "New York, NY",
    area: "",
    startTime,
    endTime,
    price: 32,
    remainingTickets: 0,
    capacity: 40,
    organizerName: "e-z.rsvp",
    color: "wisteria",
    groupMembersGoing: [],
    imageUrl: pastImageFor(event.name),
    imageBlurred: Boolean(pastImageFor(event.name)),
    dressCode: "Comfortable casual",
    safetyNotes: "Verified public venue."
  };
}

function DetailOverlay({ selected, onClose }: { selected: SelectedItem | null; onClose: () => void }) {
  if (!selected) return null;

  if (selected.kind === "past") {
    const cardEvent = pastEventToCardEvent(selected.event);

    return (
      <div className="modal-backdrop" onClick={onClose}>
        <section className="modal-card" onClick={(event) => event.stopPropagation()}>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
          <p className="page-kicker">Your memory from this RSVP.</p>
          <h1 className="page-title modal-title">Past event.</h1>

          <div className="dashboard-grid modal-grid">
            <div className="modal-details">
              <RSVPCard event={cardEvent} locked={false} hideCategory={false} />

              <div className="event-description-card">
                <h2>About this place</h2>
                <p>
                  {selected.event.name} was a curated {selected.event.category.toLowerCase()} experience
                  designed to be easy to enter, simple to enjoy, and memorable after the reveal.
                </p>
                <p>{selected.event.wouldDoAgain}</p>
              </div>
            </div>

            <aside className="sidebar-card">
              <h2>{selected.event.name}</h2>
              <div className="history-list">
                <div className="history-item">
                  <DetailIcon src="/icons/clock.svg" alt="When" fallback="🕒" />
                  <div>
                    <h3>When</h3>
                    <p>{selected.event.date}</p>
                  </div>
                </div>
                <div className="history-item">
                  <DetailIcon src="/icons/map.svg" alt="Location" fallback="⌖" />
                  <div>
                    <h3>Location</h3>
                    <p>{selected.event.address}</p>
                  </div>
                </div>
                <div className="history-item">
                  <DetailIcon src="/icons/shirt.svg" alt="Dress code" fallback="◌" />
                  <div>
                    <h3>Dress code</h3>
                    <p>Comfortable casual</p>
                  </div>
                </div>
                <div className="history-item">
                  <DetailIcon src="/homepage-images/shield.svg" alt="Safety" fallback="✓" />
                  <div>
                    <h3>Safety</h3>
                    <p>Verified public venue.</p>
                  </div>
                </div>
                <div className="history-item">
                  <DetailIcon src="/icons/heart.svg" alt="Your review" fallback="♡" />
                  <div>
                    <h3>Your review</h3>
                    <p>{selected.event.wouldDoAgain}</p>
                  </div>
                </div>
              </div>
              <button className="btn btn-secondary" type="button" onClick={() => shareEvent(cardEvent)}>
                Share
              </button>
            </aside>
          </div>
        </section>
      </div>
    );
  }

  const { event, locked } = selected;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="modal-card" onClick={(clickEvent) => clickEvent.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <p className="page-kicker">{locked ? "The exact event details unlock two hours before it starts." : "Your surprise plan is ready."}</p>
        <h1 className="page-title modal-title">{locked ? "Still locked." : "It\'s revealed."}</h1>

        <div className="dashboard-grid modal-grid">
          <div className="modal-details">
            <RSVPCard event={event} locked={locked} hideCategory={locked} hiddenTitle={locked ? "Location hidden" : undefined} />

            <div className="event-description-card">
              <h2>About this place</h2>
              <p>
                {locked
                  ? "This venue is selected for a public, easy-to-navigate reveal. Expect clear arrival instructions, a comfortable setting, and everything you need to know two hours before start time."
                  : event.description}
              </p>
              <p>
                {locked
                  ? "Once unlocked, you’ll see what is offered there and what to do when you arrive."
                  : `At ${event.venue}, you can expect a planned experience with entry details, safety notes, and a simple plan for what to do when you get there.`}
              </p>
            </div>
          </div>

          <aside className="sidebar-card">
            <h2>{locked ? "What you can see" : event.name}</h2>
            <div className="history-list">
              <div className="history-item">
                <DetailIcon src="/icons/cost.svg" alt="Cost" fallback="$" />
                <div>
                  <h3>Cost</h3>
                  <p>You paid ${event.price}</p>
                </div>
              </div>
              <div className="history-item">
                <DetailIcon src="/icons/map.svg" alt="Location" fallback="⌖" />
                <div>
                  <h3>Location</h3>
                  <p>{locked ? "Revealed two hours before" : event.address}</p>
                </div>
              </div>
              <div className="history-item">
                <DetailIcon src="/homepage-images/shield.svg" alt="Safety" fallback="✓" />
                <div>
                  <h3>Safety</h3>
                  <p>{event.safetyNotes ?? "Verified public venue."}</p>
                </div>
              </div>
              <div className="history-item">
                <DetailIcon src="/icons/shirt.svg" alt="Dress code" fallback="◌" />
                <div>
                  <h3>Dress code</h3>
                  <p>{event.dressCode ?? "Comfortable casual"}</p>
                </div>
              </div>
            </div>

            {!locked && (
              <div className="overlay-action-row">
                <button className="btn btn-secondary" type="button" onClick={() => addEventToCalendar(event)}>
                  Add to calendar
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => shareEvent(event)}>
                  Share
                </button>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  const [selected, setSelected] = useState<SelectedItem | null>(null);

  const upcoming = useMemo(
    () =>
      rsvps
        .map((rsvp) => ({ rsvp, event: events.find((event) => event.id === rsvp.eventId)! }))
        .filter((item) => Boolean(item.event))
        .sort((a, b) => new Date(a.event.startTime).getTime() - new Date(b.event.startTime).getTime()),
    []
  );

  return (
    <main className="main-shell">
      <p className="page-kicker">Your upcoming thrills await.</p>
      <h1 className="page-title">Welcome Back.</h1>

      <section className="dashboard-grid">
        <div>
          <h2 className="section-title upcoming-heading">Upcoming RSVPs</h2>
          <div className="stack rsvp-stack">
            {upcoming.map(({ rsvp, event }) => (
              <button
                className="card-button"
                type="button"
                key={rsvp.id}
                onClick={() => setSelected({ kind: "upcoming", event, rsvp, locked: rsvp.status === "locked" })}
              >
                <RSVPCard
                  event={event}
                  locked={rsvp.status === "locked"}
                  hideCategory={rsvp.status === "locked"}
                  hiddenTitle={rsvp.status === "locked" ? "Location hidden" : undefined}
                />
              </button>
            ))}
          </div>
        </div>

        <aside className="stack">
          <section className="sidebar-card">
            <h2>Curated for You</h2>
            <div className="chip-row">
              <span className="chip">Underground Beats</span>
              <span className="chip">Speakeasy</span>
              <span className="chip">Late Night Eats</span>
              <span className="chip">Rooftop Views</span>
            </div>
          </section>

          <section className="sidebar-card">
            <h2>Past events</h2>
            <div className="history-list">
              {pastEvents.map((event) => (
                <button className="history-button" type="button" key={event.id} onClick={() => setSelected({ kind: "past", event })}>
                  <div className="history-item">
                    <DetailIcon src={event.icon} alt={event.category} fallback="★" />
                    <div>
                      <h3>{event.name}</h3>
                      <p>{event.date} · {event.category}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <DetailOverlay selected={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
