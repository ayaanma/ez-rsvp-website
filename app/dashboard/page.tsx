"use client";

import { useMemo, useState } from "react";
import { events, pastEvents, rsvps } from "@/lib/mock-data";
import { RSVPCard } from "@/components/RSVPCard";
import type { EventItem, PastEvent, RSVP } from "@/types";
import { addEventToCalendar, shareEvent } from "@/lib/browser-actions";
import styles from "./dashboard.module.css";

type SelectedItem =
  | { kind: "upcoming"; event: EventItem; rsvp: RSVP; locked: boolean }
  | { kind: "past"; event: PastEvent };

type EventClueSet = {
  revealCount: number;
  clues: string[];
};

const eventClues: Record<string, EventClueSet> = {
  "evt-1": {
    revealCount: 2,
    clues: [
      "Expect a room built around music, lights, and high energy.",
      "The venue is easiest to reach from lower Manhattan.",
      "Wear something that works well in a nightlife crowd.",
      "The activity centers on a live sound experience."
    ]
  },
  "evt-2": {
    revealCount: 4,
    clues: [
      "Your night is in Midtown Manhattan.",
      "The setting is polished, social, and lounge-inspired.",
      "Smart casual will fit the venue best.",
      "Expect an easy arrival plan with reserved entry."
    ]
  },
  "evt-3": {
    revealCount: 1,
    clues: [
      "The energy is quieter than a party but still made for friends.",
      "You will be near creative spaces and interactive rooms.",
      "Comfortable shoes are a good idea.",
      "The plan is more visual than physical."
    ]
  },
  "evt-4": {
    revealCount: 1,
    clues: [
      "The room will be casual, seated, and easy to enter.",
      "The activity is built around a live performance.",
      "Expect a public venue with a relaxed crowd.",
      "This is the kind of plan where timing matters."
    ]
  },
  "evt-5": {
    revealCount: 1,
    clues: [
      "The vibe is calm, social, and low pressure.",
      "The best part happens close to golden hour.",
      "Expect skyline energy without a packed-club feel.",
      "This plan is designed for conversation and light activities."
    ]
  }
};


type MapPoint = {
  lat: number;
  lng: number;
  label: string;
};

const eventMapPoints: Record<string, MapPoint> = {
  "evt-1": { lat: 40.72862, lng: -73.99908, label: "Secret Warehouse Rave" },
  "evt-2": { lat: 40.76445, lng: -73.98217, label: "Fifty Four NYC" },
  "evt-3": { lat: 40.71872, lng: -74.00378, label: "Creative downtown reveal" },
  "evt-4": { lat: 40.7359, lng: -73.9911, label: "Live comedy reveal" },
  "evt-5": { lat: 40.7648, lng: -73.9808, label: "Rooftop reset reveal" }
};

function mapPointForEvent(event: EventItem): MapPoint {
  return eventMapPoints[event.id] ?? { lat: 40.758, lng: -73.9855, label: event.venue || event.name };
}

function mapEmbedUrl(point: MapPoint) {
  const query = encodeURIComponent(`${point.lat},${point.lng}`);
  return `https://maps.google.com/maps?q=${query}&z=15&output=embed`;
}

function mapsUrl(point: MapPoint) {
  return `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`;
}

function EventMap({ event, locked }: { event: EventItem; locked: boolean }) {
  const point = mapPointForEvent(event);

  return (
    <section aria-label="Event map" style={{ alignSelf: "start" }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 28,
          minHeight: 260,
          background: "var(--wash)",
          boxShadow: "0 18px 42px rgba(39,41,50,.12)"
        }}
      >
        <iframe
          title={locked ? "Blurred event location map" : `Map for ${event.name}`}
          src={mapEmbedUrl(point)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{
            width: "100%",
            height: 260,
            border: 0,
            display: "block",
            filter: locked ? "blur(10px) saturate(.78) contrast(.96)" : "none",
            transform: locked ? "scale(1.06)" : "none",
            pointerEvents: locked ? "none" : "auto"
          }}
        />
        {locked && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,.32)",
              backdropFilter: "blur(1px)",
              padding: 18,
              textAlign: "center"
            }}
          >
            <span
              style={{
                borderRadius: 999,
                background: "#fff",
                border: "1px solid var(--line)",
                padding: "10px 14px",
                color: "var(--shadow-grey)",
                fontWeight: 800,
                boxShadow: "0 12px 28px rgba(39,41,50,.12)"
              }}
            >
              Exact pin unlocks at reveal
            </span>
          </div>
        )}
      </div>
      {locked ? (
        <button className="btn btn-secondary" disabled style={{ width: "100%", marginTop: 14, opacity: .62, cursor: "not-allowed" }}>
          Open in maps
        </button>
      ) : (
        <a className="btn btn-secondary" href={mapsUrl(point)} target="_blank" rel="noreferrer" style={{ width: "100%", marginTop: 14 }}>
          Open in maps
        </a>
      )}
    </section>
  );
}

function DetailIcon({ src, alt, fallback }: { src?: string; alt: string; fallback: string }) {
  return src ? <img className="history-icon-img" src={src} alt={alt} /> : <span>{fallback}</span>;
}

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

function ClueSection({ event, locked }: { event: EventItem; locked: boolean }) {
  const clueSet = eventClues[event.id] ?? {
    revealCount: locked ? 1 : 4,
    clues: [
      "The plan is selected to match your timing and comfort settings.",
      "The venue is public and verified before reveal.",
      "You will receive arrival details before the event.",
      "The activity is designed to be easy to join."
    ]
  };

  const revealedCount = locked ? clueSet.revealCount : clueSet.clues.length;

  return (
    <section className="event-description-card" aria-label="Event clues">
      <h2>Clues</h2>
      <p>
        {locked
          ? "A few hints are unlocked before the full reveal. More clues become clear as the event gets closer."
          : "These are the hints you received before the full reveal."}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 12,
          marginTop: 16
        }}
      >
        {clueSet.clues.map((clue, index) => {
          const revealed = index < revealedCount;

          return (
            <div
              key={clue}
              style={{
                border: "1px solid var(--line)",
                borderRadius: 18,
                background: revealed ? "#fff" : "rgba(255,255,255,.66)",
                padding: 16,
                minHeight: 112,
                boxShadow: revealed ? "0 10px 24px rgba(39,41,50,.05)" : "none"
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  color: "var(--muted)",
                  fontSize: ".72rem",
                  fontWeight: 800,
                  letterSpacing: ".12em",
                  textTransform: "uppercase"
                }}
              >
                Clue {index + 1}
              </p>
              <p
                style={{
                  margin: 0,
                  color: "var(--shadow-grey)",
                  fontWeight: 720,
                  lineHeight: 1.45,
                  filter: revealed ? "none" : "blur(5px)",
                  userSelect: revealed ? "auto" : "none"
                }}
              >
                {clue}
              </p>
              {!revealed && (
                <p style={{ margin: "10px 0 0", color: "var(--muted)", fontSize: ".8rem", fontWeight: 700 }}>
                  Unlocking soon
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DetailOverlay({
  selected,
  onClose,
  pastReviews,
  onUpdatePastReview
}: {
  selected: SelectedItem | null;
  onClose: () => void;
  pastReviews: Record<string, string>;
  onUpdatePastReview: (eventId: string, review: string) => void;
}) {
  const [editingPastReview, setEditingPastReview] = useState(false);
  const [reviewDraft, setReviewDraft] = useState("");

  if (!selected) return null;

  if (selected.kind === "past") {
    const currentReview = pastReviews[selected.event.id] ?? selected.event.wouldDoAgain;
    const cardEvent = { ...pastEventToCardEvent(selected.event), description: currentReview };

    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-card compact-modal" onClick={(event) => event.stopPropagation()}>
          <button className="modal-close" onClick={onClose} aria-label="Close details">
            ×
          </button>
          <p className="page-kicker">Past event.</p>
          <h1 className="modal-title">Your memory from this RSVP.</h1>
          <div className="modal-grid grid-2" style={{ alignItems: "start" }}>
            <div className="modal-details">
              <RSVPCard event={cardEvent} locked={false} />
              <section className="event-description-card">
                <h2>About this place</h2>
                <p>
                  {selected.event.name} was a curated {selected.event.category.toLowerCase()} experience designed to be easy to enter, simple to enjoy, and memorable after the reveal.
                </p>
              </section>
              <section className="event-description-card">
                <div className={styles.reviewHeader}>
                  <h2>Your review</h2>
                  <button
                    type="button"
                    className={styles.editReviewButton}
                    aria-label="Edit review"
                    onClick={() => {
                      setReviewDraft(currentReview);
                      setEditingPastReview((current) => !current);
                    }}
                  >
                    <img src="/icons/pencil.svg" alt="" aria-hidden="true" />
                  </button>
                </div>
                {editingPastReview ? (
                  <form
                    className={styles.reviewEditForm}
                    onSubmit={(event) => {
                      event.preventDefault();
                      const nextReview = reviewDraft.trim();
                      if (nextReview) onUpdatePastReview(selected.event.id, nextReview);
                      setEditingPastReview(false);
                    }}
                  >
                    <textarea
                      className={styles.reviewTextarea}
                      value={reviewDraft}
                      onChange={(event) => setReviewDraft(event.target.value)}
                      aria-label="Edit your review"
                    />
                    <div className={styles.reviewEditActions}>
                      <button type="button" className="btn btn-secondary" onClick={() => setEditingPastReview(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <p>{currentReview}</p>
                )}
              </section>
            </div>
            <aside className="sidebar-card" style={{ alignSelf: "start" }}>
              <h2>Ticket Information</h2>
              <div className="history-list">
                <div className="history-item">
                  <div className="history-icon"><DetailIcon src="/icons/clock.svg" alt="When" fallback="↗" /></div>
                  <div><h3>When</h3><p>{selected.event.date}</p></div>
                </div>
                <div className="history-item">
                  <div className="history-icon"><DetailIcon src="/icons/map.svg" alt="Location" fallback="⌖" /></div>
                  <div><h3>Location</h3><p>{selected.event.address}</p></div>
                </div>
                <div className="history-item">
                  <div className="history-icon"><DetailIcon src="/icons/shirt.svg" alt="Dress code" fallback="◇" /></div>
                  <div><h3>Dress code</h3><p>Comfortable casual</p></div>
                </div>
                <div className="history-item">
                  <div className="history-icon"><DetailIcon src="/homepage-images/shield.svg" alt="Safety" fallback="✓" /></div>
                  <div><h3>Safety</h3><p>Verified public venue.</p></div>
                </div>

              </div>
              <div className={`sidebar-actions ${styles.pastShareActions}`}>
                <button className="btn btn-secondary" onClick={() => shareEvent(cardEvent)}>Share</button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  const { event, locked } = selected;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(clickEvent) => clickEvent.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close details">
          ×
        </button>
        <p className="page-kicker">{locked ? "Still locked." : "It's revealed."}</p>
        <h1 className="modal-title">{locked ? "Your RSVP is building suspense." : event.name}</h1>
        <p className="page-subtitle">
          {locked ? "The exact event details unlock two hours before it starts." : "Your surprise plan is ready."}
        </p>
        <div className="modal-grid grid-2" style={{ alignItems: "start" }}>
          <div className="modal-details">
            <RSVPCard event={event} locked={locked} hideCategory={locked} hiddenTitle={locked ? "Awaiting reveal." : undefined} />
            <section className="event-description-card">
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
            </section>
            <ClueSection event={event} locked={locked} />
          </div>
          <div className="stack" style={{ alignSelf: "start" }}>
            <aside className="sidebar-card" style={{ alignSelf: "start" }}>
              <h2>Ticket Information</h2>
              <div className="history-list">
                <div className="history-item">
                  <div className="history-icon"><DetailIcon src="/icons/cost.svg" alt="Cost" fallback="$" /></div>
                  <div><h3>Cost</h3><p>You paid ${event.price}</p></div>
                </div>
                <div className="history-item">
                  <div className="history-icon"><DetailIcon src="/icons/map.svg" alt="Location" fallback="⌖" /></div>
                  <div><h3>Location</h3><p>{locked ? "Revealed two hours before" : event.address}</p></div>
                </div>
                <div className="history-item">
                  <div className="history-icon"><DetailIcon src="/homepage-images/shield.svg" alt="Safety" fallback="✓" /></div>
                  <div><h3>Safety</h3><p>{event.safetyNotes ?? "Verified public venue."}</p></div>
                </div>
                <div className="history-item">
                  <div className="history-icon"><DetailIcon src="/icons/shirt.svg" alt="Dress code" fallback="◇" /></div>
                  <div><h3>Dress code</h3><p>{event.dressCode ?? "Comfortable casual"}</p></div>
                </div>
              </div>
              {!locked && (
                <div className={`sidebar-actions ${styles.ticketActions}`} style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <button className="btn btn-secondary" onClick={() => addEventToCalendar(event)}>Add to calendar</button>
                  <button className="btn btn-secondary" onClick={() => shareEvent(event)}>Share</button>
                </div>
              )}
            </aside>
            <EventMap event={event} locked={locked} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const [pastReviews, setPastReviews] = useState<Record<string, string>>({});

  const upcoming = useMemo(
    () =>
      rsvps
        .map((rsvp) => ({ rsvp, event: events.find((event) => event.id === rsvp.eventId)! }))
        .filter(({ event }) => Boolean(event))
        .sort((a, b) => new Date(a.event.startTime).getTime() - new Date(b.event.startTime).getTime()),
    []
  );

  return (
    <main className={`main-shell ${styles.dashboardPage}`}>
      <p className={`page-kicker ${styles.dashboardKicker}`}>Your upcoming thrills await.</p>
      <h1 className={`page-title ${styles.dashboardTitle}`}>Welcome back.</h1>

      <div className="dashboard-grid">
        <section className={`section ${styles.upcomingSection}`}>
          <h2 className="upcoming-heading">Upcoming RSVPs</h2>
          <div className="stack rsvp-stack">
            {upcoming.map(({ rsvp, event }) => (
              <button
                key={rsvp.id}
                type="button"
                className="card-button"
                onClick={() => setSelected({ kind: "upcoming", event, rsvp, locked: rsvp.status === "locked" })}
              >
                <RSVPCard event={event} locked={rsvp.status === "locked"} hideCategory={rsvp.status === "locked"} hiddenTitle={rsvp.status === "locked" ? "Awaiting reveal." : undefined} />
              </button>
            ))}
          </div>
        </section>

        <div className={`stack ${styles.dashboardSidebar}`}>
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
                <button key={event.id} className="history-button" onClick={() => setSelected({ kind: "past", event })}>
                  <div className="history-item">
                    <div className="history-icon"><DetailIcon src={event.icon} alt={event.category} fallback="•" /></div>
                    <div>
                      <h3>{event.name}</h3>
                      <p>{event.date} · {event.category}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <DetailOverlay
        selected={selected}
        onClose={() => setSelected(null)}
        pastReviews={pastReviews}
        onUpdatePastReview={(eventId, review) =>
          setPastReviews((current) => ({ ...current, [eventId]: review }))
        }
      />
    </main>
  );
}
