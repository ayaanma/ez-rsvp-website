"use client";

import { useMemo, useState } from "react";
import { categories, events } from "@/lib/mock-data";
import type { EventItem } from "@/types";
import { RSVPCard } from "@/components/RSVPCard";
import { purchaseTickets } from "@/lib/browser-actions";

function DetailIcon({ src, alt, fallback }: { src?: string; alt: string; fallback: string }) {
  return (
    <span className="history-icon">
      {src ? <img src={src} alt={alt} className="history-icon-img" /> : fallback}
    </span>
  );
}

function EventPurchaseOverlay({
  event,
  onClose,
  mysteryMode,
  hiddenTitle
}: {
  event: EventItem | null;
  onClose: () => void;
  mysteryMode: boolean;
  hiddenTitle?: string;
}) {
  if (!event) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="modal-card" onClick={(clickEvent) => clickEvent.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <p className="page-kicker">
          {mysteryMode
            ? "The exact event stays hidden until reveal time, but your price, timing, and comfort limits are set."
            : event.description}
        </p>
        <h1 className="page-title modal-title">Event details</h1>

        <div className="dashboard-grid modal-grid">
          <div className="modal-details">
            <RSVPCard
              event={event}
              locked={mysteryMode}
              hideCategory={mysteryMode}
              hiddenTitle={mysteryMode ? hiddenTitle ?? "Mystery RSVP" : undefined}
            />

            <div className="event-description-card">
              <h2>What you can expect</h2>
              <p>
                {mysteryMode
                  ? "A verified public venue, clear entry instructions, and a plan that fits your selected budget and radius."
                  : event.description}
              </p>
              <p>
                {mysteryMode
                  ? "Once your reveal unlocks, you’ll receive the venue name, address, dress guidance, safety notes, and what to do when you arrive."
                  : `This plan starts in ${event.city}. Tickets are limited, and your group members can join before the reveal window closes.`}
              </p>
            </div>
          </div>

          <aside className="sidebar-card">
            <h2>Ticket preview</h2>
            <div className="history-list">
              <div className="history-item">
                <DetailIcon src="/icons/cost.svg" alt="Cost" fallback="$" />
                <div>
                  <h3>Cost</h3>
                  <p>You pay ${event.price}</p>
                </div>
              </div>
              <div className="history-item">
                <DetailIcon src="/icons/map.svg" alt="Location" fallback="⌖" />
                <div>
                  <h3>Location</h3>
                  <p>{mysteryMode ? "Revealed two hours before" : event.address}</p>
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

            <button className="btn btn-primary icon-button purchase-button" type="button" onClick={() => purchaseTickets(event)}>
              <img src="/icons/cart.svg" alt="" aria-hidden="true" />
              <span>Purchase tickets</span>
            </button>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default function FindEventsPage() {
  const [address, setAddress] = useState("New York, NY");
  const [radius, setRadius] = useState(10);
  const [maxPrice, setMaxPrice] = useState(75);
  const [mysteryMode, setMysteryMode] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeEvent, setActiveEvent] = useState<{ event: EventItem; hiddenTitle: string } | null>(null);
  const [sortBy, setSortBy] = useState<"soonest" | "latest" | "lowest" | "highest">("soonest");

  const cardColors: EventItem["color"][] = ["apricot", "baby", "wisteria", "amethyst"];
  const hiddenPhrases = ["Your next adventure.", "Let's have some fun.", "Your calling.", "This is the one."];

  const filtered = useMemo(() => {
    const filteredEvents = events.filter(
      (event) =>
        event.price <= maxPrice &&
        (mysteryMode || selected.length === 0 || selected.some((cat) => cat.toLowerCase() === event.category.toLowerCase()))
    );

    filteredEvents.sort((a, b) => {
      if (sortBy === "latest") return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      if (sortBy === "lowest") return a.price - b.price;
      if (sortBy === "highest") return b.price - a.price;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    return filteredEvents.slice(0, 4);
  }, [maxPrice, selected, mysteryMode, sortBy]);

  function toggle(cat: string) {
    if (mysteryMode) return;
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((item) => item !== cat) : [...prev, cat]
    );
  }

  return (
    <main className="main-shell filter-layout">
      <aside className="filters-panel">
        <h2>Filters</h2>
        <label className="form-section">
          <span className="small-label">Location</span>
          <input className="input" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Type an address" />
        </label>
        <label className="form-section">
          <div className="label-row">
            <span>Radius</span>
            <span>{radius} miles</span>
          </div>
          <input className="range" type="range" min="1" max="50" value={radius} onChange={(event) => setRadius(Number(event.target.value))} />
        </label>
        <label className="form-section">
          <div className="label-row">
            <span>Max price</span>
            <span>${maxPrice}</span>
          </div>
          <input className="range" type="range" min="0" max="150" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} />
        </label>
        <label className="form-section">
          <span className="small-label">Sort by</span>
          <select className="select" value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}>
            <option value="soonest">Soonest time</option>
            <option value="latest">Latest time</option>
            <option value="lowest">Lowest price</option>
            <option value="highest">Highest price</option>
          </select>
        </label>

        <label className="toggle-row compact-toggle">
          <span>
            <strong>Mystery mode</strong>
            <small>Hide event categories and exact details until reveal so the browsing experience stays spontaneous.</small>
          </span>
          <input type="checkbox" checked={mysteryMode} onChange={() => setMysteryMode(!mysteryMode)} />
          <span className="switch" aria-hidden="true" />
        </label>

        <div className={`form-section category-filter ${mysteryMode ? "disabled" : ""}`}>
          <span className="small-label">Categories</span>
          <div className="category-tabs">
            {categories.slice(0, 7).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-tab ${selected.includes(cat) ? "selected" : ""}`}
                onClick={() => toggle(cat)}
                disabled={mysteryMode}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="content-panel">
        <p className="page-kicker">Find your next surprise.</p>
        <h1 className="page-title">Find events.</h1>
        <p className="page-subtitle">
          Browse mystery-ready plans and filter by comfort level. Mystery mode hides exact categories on cards.
        </p>

        <div className="events-grid" style={{ marginTop: 28 }}>
          {filtered.map((event, index) => {
            const displayEvent = { ...event, color: cardColors[index], imageUrl: undefined, imageBlurred: false };
            return (
              <button
                className="card-button"
                type="button"
                key={event.id}
                onClick={() => setActiveEvent({ event: displayEvent, hiddenTitle: hiddenPhrases[index] })}
              >
                <RSVPCard
                  event={displayEvent}
                  locked={mysteryMode}
                  hideCategory={mysteryMode}
                  hiddenTitle={hiddenPhrases[index]}
                />
              </button>
            );
          })}
        </div>
      </section>

      <EventPurchaseOverlay
        event={activeEvent?.event ?? null}
        hiddenTitle={activeEvent?.hiddenTitle}
        onClose={() => setActiveEvent(null)}
        mysteryMode={mysteryMode}
      />
    </main>
  );
}
