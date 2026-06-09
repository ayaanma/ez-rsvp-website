"use client";

import { useMemo, useState } from "react";
import { categories, events } from "@/lib/mock-data";
import { RSVPCard } from "@/components/RSVPCard";
import { purchaseTickets } from "@/lib/browser-actions";
import type { EventItem } from "@/types";

const cardColors: EventItem["color"][] = ["apricot", "baby", "wisteria", "amethyst"];
const hiddenPhrases = [
  "Your next adventure.",
  "Let's have some fun.",
  "Your calling.",
  "This is the one.",
];

function DetailIcon({ src, alt, fallback }: { src?: string; alt: string; fallback: string }) {
  return src ? (
    <img className="history-icon-img" src={src} alt={alt} />
  ) : (
    <span>{fallback}</span>
  );
}

function EventPurchaseOverlay({
  event,
  onClose,
  mysteryMode,
  hiddenTitle,
}: {
  event: EventItem | null;
  onClose: () => void;
  mysteryMode: boolean;
  hiddenTitle?: string;
}) {
  if (!event) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="modal-card compact-modal"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose}>
          ×
        </button>

        <p className="page-kicker">Ticket preview</p>
        <h1 className="modal-title page-title">Event details</h1>
        <p className="page-subtitle">
          The exact event stays hidden until reveal time, but your price, timing,
          and comfort limits are set.
        </p>

        <div className="dashboard-grid modal-grid">
          <div>
            <RSVPCard
              event={event}
              forceLocationHidden
              hiddenTitle={hiddenTitle ?? "Your next adventure."}
              hideCategory={mysteryMode}
            />

            <div className="event-description-card">
              <h2>What you can expect</h2>
              <p>
                A verified public venue, clear entry instructions, and a plan that
                fits your selected budget and radius.
              </p>
              <p>
                Once your reveal unlocks, you’ll receive the venue name, address,
                dress guidance, safety notes, and what to do when you arrive.
              </p>
            </div>
          </div>

          <aside className="sidebar-card modal-details">
            <h2>Ticket preview</h2>

            <div className="history-list">
              <div className="history-item">
                <div className="history-icon">
                  <DetailIcon src="/icons/cost.svg" alt="Cost" fallback="$" />
                </div>
                <div>
                  <h3>Cost</h3>
                  <p>You pay ${event.price}</p>
                </div>
              </div>

              <div className="history-item">
                <div className="history-icon">
                  <DetailIcon src="/icons/map.svg" alt="Location" fallback="⌖" />
                </div>
                <div>
                  <h3>Location</h3>
                  <p>Revealed two hours before</p>
                </div>
              </div>

              <div className="history-item">
                <div className="history-icon">
                  <DetailIcon
                    src="/homepage-images/shield.svg"
                    alt="Safety"
                    fallback="✓"
                  />
                </div>
                <div>
                  <h3>Safety</h3>
                  <p>{event.safetyNotes ?? "Verified public venue."}</p>
                </div>
              </div>

              <div className="history-item">
                <div className="history-icon">
                  <DetailIcon src="/icons/shirt.svg" alt="Dress code" fallback="◇" />
                </div>
                <div>
                  <h3>Dress code</h3>
                  <p>{event.dressCode ?? "Comfortable casual"}</p>
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary icon-button"
              type="button"
              onClick={() => purchaseTickets(event)}
              style={{ marginTop: 24, width: "100%" }}
            >
              <img src="/icons/cart.svg" alt="" aria-hidden="true" />
              Purchase tickets
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
  const [activeEvent, setActiveEvent] = useState<{
    event: EventItem;
    hiddenTitle: string;
  } | null>(null);
  const [sortBy, setSortBy] = useState<"soonest" | "latest" | "lowest" | "highest">(
    "soonest"
  );
  const [sortOpen, setSortOpen] = useState(false);

  const sortOptions: { value: typeof sortBy; label: string }[] = [
    { value: "soonest", label: "Soonest time first" },
    { value: "latest", label: "Latest time first" },
    { value: "lowest", label: "Lowest price first" },
    { value: "highest", label: "Highest price first" },
  ];

  const activeSortLabel =
    sortOptions.find((option) => option.value === sortBy)?.label ?? "Soonest time";

  const filtered = useMemo(() => {
    const filteredEvents = events.filter(
      (event) =>
        event.price <= maxPrice &&
        (mysteryMode ||
          selected.length === 0 ||
          selected.some(
            (cat) => cat.toLowerCase() === event.category.toLowerCase()
          ))
    );

    filteredEvents.sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      }

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
    <main className="main-shell">
      <div className="filter-layout">
        <aside className="filters-panel">
          <h2>Filters</h2>

          <div className="form-section">
            <label className="small-label" htmlFor="address">
              Location
            </label>
            <input
              id="address"
              className="input"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Type an address"
            />
          </div>

          <div className="form-section">
            <div className="label-row">
              <label className="small-label" htmlFor="radius">
                Radius
              </label>
              <span>{radius} miles</span>
            </div>
            <input
              id="radius"
              className="range"
              type="range"
              min="1"
              max="50"
              value={radius}
              onChange={(event) => setRadius(Number(event.target.value))}
            />
          </div>

          <div className="form-section">
            <div className="label-row">
              <label className="small-label" htmlFor="price">
                Max price
              </label>
              <span>${maxPrice}</span>
            </div>
            <input
              id="price"
              className="range"
              type="range"
              min="0"
              max="150"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
            />
          </div>

          <div className="form-section sort-field">
            <span className="small-label" id="sort-label">
              Sort by
            </span>

            <div className={`custom-select ${sortOpen ? "open" : ""}`}>
              <button
                className="custom-select-trigger"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                aria-labelledby="sort-label"
                onClick={() => setSortOpen((open) => !open)}
              >
                <span>{activeSortLabel}</span>
                <span className="custom-select-arrow" aria-hidden="true">
                  ▾
                </span>
              </button>

              {sortOpen && (
                <div
                  className="custom-select-menu"
                  role="listbox"
                  aria-labelledby="sort-label"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`custom-select-option ${
                        sortBy === option.value ? "selected" : ""
                      }`}
                      type="button"
                      role="option"
                      aria-selected={sortBy === option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setSortOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-section compact-toggle">
            <label className="toggle-row">
              <span>
                <strong>Mystery mode</strong>
                <small>
                  Hide event categories and exact details until reveal so the
                  browsing experience stays spontaneous.
                </small>
              </span>
              <input
                type="checkbox"
                checked={mysteryMode}
                onChange={() => setMysteryMode(!mysteryMode)}
              />
              <span className="switch" />
            </label>
          </div>

          <div className={`form-section category-filter ${mysteryMode ? "disabled" : ""}`}>
            <label className="small-label">Categories</label>
            <div className="category-tabs">
              {categories.slice(0, 7).map((cat) => (
                <button
                  key={cat}
                  className={`category-tab ${selected.includes(cat) ? "selected" : ""}`}
                  type="button"
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
            Browse mystery-ready plans and filter by comfort level. Mystery mode
            hides exact categories on cards.
          </p>

          <div className="events-grid" style={{ marginTop: 32 }}>
            {filtered.map((event, index) => {
              const displayEvent = {
                ...event,
                color: cardColors[index],
                imageUrl: undefined,
                imageBlurred: false,
              };

              const hiddenTitle = hiddenPhrases[index];

              return (
                <button
                  key={event.id}
                  className="card-button"
                  type="button"
                  onClick={() =>
                    setActiveEvent({ event: displayEvent, hiddenTitle })
                  }
                >
                  <RSVPCard
                    event={displayEvent}
                    forceLocationHidden
                    hiddenTitle={hiddenTitle}
                    hideCategory={mysteryMode}
                  />
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <EventPurchaseOverlay
        event={activeEvent?.event ?? null}
        hiddenTitle={activeEvent?.hiddenTitle}
        onClose={() => setActiveEvent(null)}
        mysteryMode={mysteryMode}
      />
    </main>
  );
}
