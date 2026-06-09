"use client";

import { useMemo, useState } from "react";
import { categories, events } from "@/lib/mock-data";
import { RSVPCard } from "@/components/RSVPCard";
import { purchaseTickets } from "@/lib/browser-actions";
import type { EventItem } from "@/types";
import styles from "./create-rsvp.module.css";

const cardColors: EventItem["color"][] = ["apricot", "baby", "wisteria", "amethyst"];
const hiddenPhrases = [
  "Your next adventure.",
  "Let's have some fun.",
  "Your calling.",
  "This is the one.",
];

type Coordinates = {
  lat: number;
  lng: number;
};

type AddressOption = Coordinates & {
  label: string;
};

const addressOptions: AddressOption[] = [
  {
    label: "226 West 54th Street, New York, NY",
    lat: 40.76445,
    lng: -73.98217,
  },
  {
    label: "Washington Square Park, New York, NY",
    lat: 40.73082,
    lng: -73.99733,
  },
  {
    label: "Times Square, New York, NY",
    lat: 40.758,
    lng: -73.9855,
  },
  {
    label: "Brooklyn Bridge Park, Brooklyn, NY",
    lat: 40.70029,
    lng: -73.9967,
  },
];

const eventCoordinates: Record<string, Coordinates> = {
  "evt-1": { lat: 40.72862, lng: -73.99908 },
  "evt-2": { lat: 40.76445, lng: -73.98217 },
  "evt-3": { lat: 40.71872, lng: -74.00378 },
  "evt-4": { lat: 40.73003, lng: -74.00067 },
  "evt-5": { lat: 40.74401, lng: -73.98864 },
};

const milesBetween = (origin: Coordinates, destination: Coordinates) => {
  const earthRadiusMiles = 3958.8;
  const toRadians = (value: number) => (value * Math.PI) / 180;

  const dLat = toRadians(destination.lat - origin.lat);
  const dLng = toRadians(destination.lng - origin.lng);
  const lat1 = toRadians(origin.lat);
  const lat2 = toRadians(destination.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

function DetailIcon({ src, alt, fallback }: { src?: string; alt: string; fallback: string }) {
  return src ? <img className="history-icon-img" src={src} alt={alt} /> : <span>{fallback}</span>;
}

function EventPurchaseOverlay({
  event,
  onClose,
  hiddenTitle,
}: {
  event: EventItem | null;
  onClose: () => void;
  mysteryMode: boolean;
  hiddenTitle?: string;
}) {
  if (!event) return null;

  const previewEvent = {
    ...event,
    imageUrl: undefined,
    imageBlurred: false,
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="modal-card compact-modal" onClick={(clickEvent) => clickEvent.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close event details">
          ×
        </button>

        <div className="modal-grid grid-2">
          <div>
            <p className="page-kicker">Ticket preview</p>
            <h1 className="modal-title">Event details</h1>
            <p className="page-subtitle">
              The exact event stays hidden until reveal time, but your price, timing, and comfort limits are set.
            </p>

            <RSVPCard event={previewEvent} locked={false} hideCategory hiddenTitle={hiddenTitle} />

            <div className="event-description-card">
              <h2>What you can expect</h2>
              <p>
                A verified public venue, clear entry instructions, and a plan that fits your selected budget and radius.
              </p>
              <p>
                Once your reveal unlocks, you’ll receive the venue name, address, dress guidance, safety notes, and what to do when you arrive.
              </p>
            </div>
          </div>

          <aside className="sidebar-card">
            <h2>Ticket preview</h2>
            <div className="history-list">
              <div className="history-item">
                <span className="history-icon">
                  <DetailIcon src="/icons/cost.svg" alt="Cost" fallback="$" />
                </span>
                <div>
                  <h3>Cost</h3>
                  <p>You pay ${event.price}</p>
                </div>
              </div>

              <div className="history-item">
                <span className="history-icon">
                  <DetailIcon src="/icons/map.svg" alt="Location" fallback="⌖" />
                </span>
                <div>
                  <h3>Location</h3>
                  <p>Revealed two hours before</p>
                </div>
              </div>

              <div className="history-item">
                <span className="history-icon">
                  <DetailIcon src="/homepage-images/shield.svg" alt="Safety" fallback="◎" />
                </span>
                <div>
                  <h3>Safety</h3>
                  <p>{event.safetyNotes ?? "Verified public venue."}</p>
                </div>
              </div>

              <div className="history-item">
                <span className="history-icon">
                  <DetailIcon src="/icons/shirt.svg" alt="Dress code" fallback="◐" />
                </span>
                <div>
                  <h3>Dress code</h3>
                  <p>{event.dressCode ?? "Comfortable casual"}</p>
                </div>
              </div>
            </div>

            <button className="btn btn-primary icon-button purchase-button" type="button" onClick={() => purchaseTickets(event)}>
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
  const [address, setAddress] = useState(addressOptions[2].label);
  const [selectedAddress, setSelectedAddress] = useState<AddressOption>(addressOptions[2]);
  const [showAddressOptions, setShowAddressOptions] = useState(false);
  const [radius, setRadius] = useState(10);
  const [maxPrice, setMaxPrice] = useState(75);
  const [mysteryMode, setMysteryMode] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeEvent, setActiveEvent] = useState<{ event: EventItem; hiddenTitle: string } | null>(null);
  const [sortBy, setSortBy] = useState<"soonest" | "latest" | "lowest" | "highest">("soonest");
  const [sortOpen, setSortOpen] = useState(false);

  const sortOptions: { value: typeof sortBy; label: string }[] = [
    { value: "soonest", label: "Soonest time first" },
    { value: "latest", label: "Latest time first" },
    { value: "lowest", label: "Lowest price first" },
    { value: "highest", label: "Highest price first" },
  ];

  const activeSortLabel = sortOptions.find((option) => option.value === sortBy)?.label ?? "Soonest time";

  const matchingAddressOptions = useMemo(() => {
    const query = address.trim().toLowerCase();

    if (!query) return addressOptions;

    const matches = addressOptions.filter((option) => option.label.toLowerCase().includes(query));

    return matches.length > 0 ? matches : addressOptions;
  }, [address]);

  const filtered = useMemo(() => {
    const filteredEvents = events.filter((event) => {
      const eventLocation = eventCoordinates[event.id];
      const insideRadius = eventLocation ? milesBetween(selectedAddress, eventLocation) <= radius : true;
      const insideBudget = event.price <= maxPrice;
      const insideCategory =
        mysteryMode ||
        selected.length === 0 ||
        selected.some((cat) => cat.toLowerCase() === event.category.toLowerCase());

      return insideRadius && insideBudget && insideCategory;
    });

    filteredEvents.sort((a, b) => {
      if (sortBy === "latest") return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      if (sortBy === "lowest") return a.price - b.price;
      if (sortBy === "highest") return b.price - a.price;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    return filteredEvents.slice(0, 4);
  }, [maxPrice, selected, mysteryMode, sortBy, selectedAddress, radius]);

  function toggle(cat: string) {
    if (mysteryMode) return;

    setSelected((prev) => (prev.includes(cat) ? prev.filter((item) => item !== cat) : [...prev, cat]));
  }

  function chooseAddress(option: AddressOption) {
    setAddress(option.label);
    setSelectedAddress(option);
    setShowAddressOptions(false);
  }

  return (
    <main className="page-shell">
      <div className="main-shell filter-layout">
        <aside className="filters-panel">
          <h2>Filters</h2>

          <div className="form-section">
            <label className="small-label" htmlFor="event-location-filter">
              Location
            </label>
            <div className={styles.addressField}>
              <input
                id="event-location-filter"
                className="input"
                value={address}
                onChange={(event) => {
                  const value = event.target.value;
                  setAddress(value);
                  setShowAddressOptions(true);

                  const exactMatch = addressOptions.find((option) => option.label.toLowerCase() === value.trim().toLowerCase());
                  if (exactMatch) setSelectedAddress(exactMatch);
                }}
                onFocus={() => setShowAddressOptions(true)}
                placeholder="Type an address"
                autoComplete="off"
              />

              {showAddressOptions && (
                <div className={styles.addressSuggestions} role="listbox" aria-label="Suggested addresses">
                  {matchingAddressOptions.map((option) => (
                    <button
                      key={option.label}
                      className={`${styles.addressSuggestion} ${option.label === selectedAddress.label ? styles.addressSuggestionSelected : ""}`}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => chooseAddress(option)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className={styles.locationHint}>Choose one of the suggested addresses, then adjust your radius.</p>
          </div>

          <div className="form-section">
            <label className="small-label" htmlFor="event-radius-filter">
              Radius <span>{radius} miles</span>
            </label>
            <input
              id="event-radius-filter"
              className="range"
              type="range"
              min="1"
              max="30"
              value={radius}
              onChange={(event) => setRadius(Number(event.target.value))}
            />
          </div>

          <div className="form-section">
            <label className="small-label" htmlFor="event-price-filter">
              Max price <span>${maxPrice}</span>
            </label>
            <input
              id="event-price-filter"
              className="range"
              type="range"
              min="0"
              max="150"
              step="5"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
            />
          </div>

          <div className="form-section sort-field">
            <label className="small-label">Sort by</label>
            <div className={`custom-select ${sortOpen ? "open" : ""}`}>
              <button className="custom-select-trigger" type="button" onClick={() => setSortOpen((open) => !open)}>
                <span>{activeSortLabel}</span>
                <span className="custom-select-arrow">⌄</span>
              </button>

              {sortOpen && (
                <div className="custom-select-menu" role="listbox">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`custom-select-option ${sortBy === option.value ? "selected" : ""}`}
                      type="button"
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

          <label className="toggle-row compact-toggle">
            <span>
              <strong>Mystery mode</strong>
              <small>Hide event categories and exact details until reveal so the browsing experience stays spontaneous.</small>
            </span>
            <input type="checkbox" checked={mysteryMode} onChange={() => setMysteryMode(!mysteryMode)} />
            <span className="switch" />
          </label>

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

        <section>
          <p className="page-kicker">Find your next surprise.</p>
          <h1 className="page-title">Find events.</h1>
          <p className="page-subtitle">
            Browse mystery-ready plans and filter by comfort level. Mystery mode hides exact categories on cards.
          </p>

          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              No mystery events match that address, radius, and price yet. Try widening the radius or choosing another suggested address.
            </div>
          ) : (
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
                    onClick={() => setActiveEvent({ event: displayEvent, hiddenTitle })}
                  >
                    <RSVPCard
                      event={displayEvent}
                      locked={false}
                      hideCategory={mysteryMode}
                      categoryLabel={event.category}
                      forceLocationHidden
                      hiddenTitle={hiddenTitle}
                    />
                  </button>
                );
              })}
            </div>
          )}
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
