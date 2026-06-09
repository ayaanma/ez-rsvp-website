"use client";

import { useEffect, useMemo, useState } from "react";
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

const internalEventLocations: Record<string, { lat: number; lng: number }> = {
  "evt-1": { lat: 40.758896, lng: -73.98513 },
  "evt-2": { lat: 40.719326, lng: -73.961744 },
  "evt-3": { lat: 40.744679, lng: -73.948542 },
  "evt-4": { lat: 40.735657, lng: -74.172367 },
  "evt-5": { lat: 41.033986, lng: -73.76291 },
  "evt-6": { lat: 40.752726, lng: -73.977229 },
};

const fallbackEventLocations = [
  { lat: 40.758896, lng: -73.98513 },
  { lat: 40.719326, lng: -73.961744 },
  { lat: 40.744679, lng: -73.948542 },
  { lat: 40.735657, lng: -74.172367 },
  { lat: 41.033986, lng: -73.76291 },
];

type SortBy = "soonest" | "latest" | "lowest" | "highest";

type AddressSuggestion = {
  label: string;
  lat: number;
  lng: number;
};

function DetailIcon({ src, alt, fallback }: { src?: string; alt: string; fallback: string }) {
  return src ? (
    <img className="history-icon-img" src={src} alt={alt} />
  ) : (
    <span aria-hidden="true">{fallback}</span>
  );
}

function distanceInMiles(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
) {
  const earthRadiusMiles = 3958.8;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * earthRadiusMiles * Math.asin(Math.sqrt(a));
}

function getEventLocation(event: EventItem, index: number) {
  return internalEventLocations[event.id] ?? fallbackEventLocations[index % fallbackEventLocations.length];
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
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card" onClick={(clickEvent) => clickEvent.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-grid grid-2">
          <div className="modal-details">
            <h1 className="modal-title">Event details</h1>
            <p className="section-copy">
              The exact event stays hidden until reveal time, but your price, timing, and comfort limits are set.
            </p>

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
            <RSVPCard event={event} locked hideCategory={mysteryMode} hiddenTitle={hiddenTitle} />

            <h2 style={{ marginTop: 24 }}>Ticket preview</h2>
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
                  <DetailIcon src="/homepage-images/shield.svg" alt="Safety" fallback="✓" />
                </div>
                <div>
                  <h3>Safety</h3>
                  <p>{event.safetyNotes ?? "Verified public venue."}</p>
                </div>
              </div>

              <div className="history-item">
                <div className="history-icon">
                  <DetailIcon src="/icons/shirt.svg" alt="Dress code" fallback="◐" />
                </div>
                <div>
                  <h3>Dress code</h3>
                  <p>{event.dressCode ?? "Comfortable casual"}</p>
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary icon-button purchase-button"
              type="button"
              onClick={() => purchaseTickets(event)}
            >
              <img src="/icons/cart.svg" alt="" aria-hidden="true" />
              Purchase tickets
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function FindEventsPage() {
  const [addressQuery, setAddressQuery] = useState("New York, NY");
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<AddressSuggestion | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [radius, setRadius] = useState(10);
  const [maxPrice, setMaxPrice] = useState(75);
  const [mysteryMode, setMysteryMode] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeEvent, setActiveEvent] = useState<{
    event: EventItem;
    hiddenTitle: string;
  } | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("soonest");
  const [sortOpen, setSortOpen] = useState(false);

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: "soonest", label: "Soonest time" },
    { value: "latest", label: "Latest time" },
    { value: "lowest", label: "Lowest price" },
    { value: "highest", label: "Highest price" },
  ];

  const activeSortLabel =
    sortOptions.find((option) => option.value === sortBy)?.label ?? "Soonest time";

  useEffect(() => {
    const query = addressQuery.trim();

    if (query.length < 3 || selectedLocation?.label === query) {
      setAddressSuggestions([]);
      setAddressLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setAddressLoading(true);

      try {
        const response = await fetch(`/api/geocode?query=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });

        const data = await response.json();
        setAddressSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
      } catch {
        if (!controller.signal.aborted) setAddressSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setAddressLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [addressQuery, selectedLocation?.label]);

  const filtered = useMemo(() => {
    const filteredEvents = events.filter((event, index) => {
      const inBudget = event.price <= maxPrice;
      const inCategory =
        mysteryMode ||
        selected.length === 0 ||
        selected.some((cat) => cat.toLowerCase() === event.category.toLowerCase());

      if (!inBudget || !inCategory) return false;

      if (!selectedLocation) return true;

      return distanceInMiles(selectedLocation, getEventLocation(event, index)) <= radius;
    });

    filteredEvents.sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      }
      if (sortBy === "lowest") return a.price - b.price;
      if (sortBy === "highest") return b.price - a.price;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    return filteredEvents.slice(0, 4);
  }, [maxPrice, selected, mysteryMode, sortBy, selectedLocation, radius]);

  function toggle(cat: string) {
    if (mysteryMode) return;
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((item) => item !== cat) : [...prev, cat]
    );
  }

  function selectAddress(suggestion: AddressSuggestion) {
    setSelectedLocation(suggestion);
    setAddressQuery(suggestion.label);
    setAddressSuggestions([]);
  }

  return (
    <main className="page-shell">
      <section className="main-shell filter-layout">
        <aside className="filters-panel">
          <h2>Filters</h2>

          <div className={`form-section ${styles.locationField}`}>
            <label className="small-label" htmlFor="location-filter">
              Location
            </label>
            <div className={styles.addressInputWrap}>
              <input
                id="location-filter"
                className="input"
                value={addressQuery}
                onChange={(event) => {
                  setAddressQuery(event.target.value);
                  setSelectedLocation(null);
                }}
                placeholder="Type a U.S. address"
                autoComplete="off"
              />

              {addressSuggestions.length > 0 && (
                <div className={styles.addressSuggestions} role="listbox">
                  {addressSuggestions.map((suggestion) => (
                    <button
                      className={styles.addressSuggestion}
                      key={`${suggestion.label}-${suggestion.lat}-${suggestion.lng}`}
                      type="button"
                      onClick={() => selectAddress(suggestion)}
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {addressLoading ? (
              <p className={styles.addressStatus}>Searching addresses...</p>
            ) : selectedLocation ? (
              <p className={styles.addressStatus}>Filtering from selected address.</p>
            ) : (
              <p className={styles.addressStatus}>Select an address to apply radius filtering.</p>
            )}
          </div>

          <div className="form-section">
            <label className="small-label" htmlFor="radius-filter">
              Radius <span>{radius} miles</span>
            </label>
            <input
              id="radius-filter"
              className="range"
              type="range"
              min="1"
              max="25"
              value={radius}
              onChange={(event) => setRadius(Number(event.target.value))}
            />
          </div>

          <div className="form-section">
            <label className="small-label" htmlFor="price-filter">
              Max price <span>${maxPrice}</span>
            </label>
            <input
              id="price-filter"
              className="range"
              type="range"
              min="0"
              max="150"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
            />
          </div>

          <div className={`form-section ${styles.sortField}`}>
            <label className="small-label">Sort by</label>
            <div className={`${styles.customSelect} ${sortOpen ? styles.customSelectOpen : ""}`}>
              <button
                className={styles.customSelectTrigger}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                onClick={() => setSortOpen((open) => !open)}
              >
                <span>{activeSortLabel}</span>
                <span className={styles.customSelectArrow} aria-hidden="true">
                  ▾
                </span>
              </button>

              {sortOpen && (
                <div className={styles.customSelectMenu} role="listbox">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`${styles.customSelectOption} ${
                        sortBy === option.value ? styles.customSelectOptionSelected : ""
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

          <label className="toggle-row compact-toggle">
            <span>
              <strong>Mystery mode</strong>
              <small>
                Hide event categories and exact details until reveal so the browsing experience stays spontaneous.
              </small>
            </span>
            <input
              type="checkbox"
              checked={mysteryMode}
              onChange={() => setMysteryMode(!mysteryMode)}
            />
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

        <section className="content-panel">
          <p className="page-kicker">Find your next surprise.</p>
          <h1 className="page-title">Find events.</h1>
          <p className="page-subtitle">
            Browse mystery-ready plans and filter by comfort level. Mystery mode hides exact categories on cards.
          </p>

          {filtered.length > 0 ? (
            <div className="events-grid" style={{ marginTop: 34 }}>
              {filtered.map((event, index) => {
                const displayEvent = {
                  ...event,
                  color: cardColors[index % cardColors.length],
                  imageUrl: undefined,
                  imageBlurred: false,
                };
                const hiddenTitle = hiddenPhrases[index % hiddenPhrases.length];

                return (
                  <button
                    className="card-button"
                    key={event.id}
                    type="button"
                    onClick={() => setActiveEvent({ event: displayEvent, hiddenTitle })}
                  >
                    <RSVPCard
                      event={displayEvent}
                      locked={false}
                      categoryLabel={event.category}
                      hideCategory={mysteryMode}
                      forceLocationHidden
                      hiddenTitle={hiddenTitle}
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState} style={{ marginTop: 34 }}>
              <strong>No mystery events match those filters.</strong>
              Try increasing your radius, raising your max price, or choosing a nearby address.
            </div>
          )}
        </section>
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
