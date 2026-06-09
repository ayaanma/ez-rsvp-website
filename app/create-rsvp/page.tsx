"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { categories, events } from "@/lib/mock-data";
import { RSVPCard } from "@/components/RSVPCard";
import { purchaseTickets } from "@/lib/browser-actions";
import type { EventItem } from "@/types";

type Coordinates = {
  lat: number;
  lon: number;
};

type AddressSuggestion = Coordinates & {
  label: string;
};

const cardColorsByEventId: Record<string, EventItem["color"]> = {
  "evt-1": "apricot",
  "evt-2": "baby",
  "evt-3": "wisteria",
  "evt-4": "amethyst",
  "evt-5": "apricot",
};

const hiddenPhraseByEventId: Record<string, string> = {
  "evt-1": "Your next adventure.",
  "evt-2": "Let's have some fun.",
  "evt-3": "Your calling.",
  "evt-4": "This is the one.",
  "evt-5": "This is the one.",
};

const defaultLocation: AddressSuggestion = {
  label: "Times Square, New York, NY",
  lat: 40.758,
  lon: -73.9855,
};

const internalEventLocations: Record<string, Coordinates & { address: string }> = {
  "evt-1": {
    address: "226 West 54th Street, New York, NY 10019",
    lat: 40.7647,
    lon: -73.9827,
  },
  "evt-2": {
    address: "90 Wythe Avenue, Brooklyn, NY 11249",
    lat: 40.7219,
    lon: -73.9575,
  },
  "evt-3": {
    address: "23-10 Queens Plaza South, Long Island City, NY 11101",
    lat: 40.7505,
    lon: -73.9397,
  },
  "evt-4": {
    address: "550 Broad Street, Newark, NJ 07102",
    lat: 40.7435,
    lon: -74.1692,
  },
  "evt-5": {
    address: "49 Mamaroneck Avenue, White Plains, NY 10601",
    lat: 41.0318,
    lon: -73.7634,
  },
};

function distanceInMiles(from: Coordinates, to: Coordinates) {
  const earthRadiusMiles = 3958.8;
  const toRadians = (value: number) => (value * Math.PI) / 180;

  const dLat = toRadians(to.lat - from.lat);
  const dLon = toRadians(to.lon - from.lon);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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

const sortOptions = [
  { value: "soonest", label: "Soonest time" },
  { value: "latest", label: "Latest time" },
  { value: "lowest", label: "Lowest price" },
  { value: "highest", label: "Highest price" },
] as const;

export default function FindEventsPage() {
  const [address, setAddress] = useState(defaultLocation.label);
  const [selectedLocation, setSelectedLocation] = useState<AddressSuggestion>(defaultLocation);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [addressFocused, setAddressFocused] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState("");
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

  const selectedSortLabel =
    sortOptions.find((option) => option.value === sortBy)?.label ?? "Soonest time";

  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const query = address.trim();

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    if (query.length < 3 || query === selectedLocation.label) {
      setAddressSuggestions([]);
      setAddressLoading(false);
      setAddressError("");
      return;
    }

    setAddressLoading(true);
    setAddressError("");

    debounceRef.current = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
        const data = (await response.json().catch(() => ({}))) as {
          suggestions?: AddressSuggestion[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error || "Address search failed.");
        }

        setAddressSuggestions(data.suggestions ?? []);
        setAddressError("");
      } catch {
        setAddressSuggestions([]);
        setAddressError("Address search is temporarily unavailable.");
      } finally {
        setAddressLoading(false);
      }
    }, 260);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [address, selectedLocation.label]);

  const filtered = useMemo(() => {
    const filteredEvents = events.filter((event) => {
      const eventLocation = internalEventLocations[event.id];
      const withinRadius = eventLocation
        ? distanceInMiles(selectedLocation, eventLocation) <= radius
        : true;

      return (
        event.price <= maxPrice &&
        withinRadius &&
        (mysteryMode ||
          selected.length === 0 ||
          selected.some(
            (cat) => cat.toLowerCase() === event.category.toLowerCase()
          ))
      );
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
  }, [maxPrice, selected, mysteryMode, sortBy, radius, selectedLocation]);

  function chooseAddress(suggestion: AddressSuggestion) {
    setAddress(suggestion.label);
    setSelectedLocation(suggestion);
    setAddressSuggestions([]);
    setAddressFocused(false);
    setAddressError("");
  }

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

          <div className="form-section address-field">
            <label className="small-label" htmlFor="address">
              Location
            </label>
            <input
              id="address"
              className="input"
              value={address}
              onBlur={() => window.setTimeout(() => setAddressFocused(false), 150)}
              onChange={(event) => {
                setAddress(event.target.value);
                setAddressFocused(true);
              }}
              onFocus={() => setAddressFocused(true)}
              placeholder="Type any U.S. address"
            />

            {addressFocused &&
              (addressSuggestions.length > 0 || addressLoading || addressError) && (
                <div className="address-suggestions" role="listbox">
                  {addressLoading && (
                    <div className="address-suggestion-muted">Searching addresses...</div>
                  )}

                  {!addressLoading &&
                    addressSuggestions.map((suggestion) => (
                      <button
                        key={`${suggestion.label}-${suggestion.lat}-${suggestion.lon}`}
                        className="address-suggestion"
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => chooseAddress(suggestion)}
                      >
                        {suggestion.label}
                      </button>
                    ))}

                  {!addressLoading && addressError && (
                    <div className="address-suggestion-muted">{addressError}</div>
                  )}

                  {!addressLoading &&
                    !addressError &&
                    address.trim().length >= 3 &&
                    addressSuggestions.length === 0 && (
                      <div className="address-suggestion-muted">
                        No matching U.S. addresses found.
                      </div>
                    )}
                </div>
              )}

            <p className="filter-hint">
              Showing events within {radius} miles of {selectedLocation.label}.
            </p>
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
            <label className="small-label">Sort by</label>

            <div
              className={`custom-select ${sortOpen ? "open" : ""}`}
              tabIndex={0}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setSortOpen(false);
                }
              }}
            >
              <button
                type="button"
                className="custom-select-trigger"
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                onClick={() => setSortOpen((current) => !current)}
              >
                <span>{selectedSortLabel}</span>
                <span className="custom-select-arrow" aria-hidden="true">
                  ▾
                </span>
              </button>

              {sortOpen && (
                <div className="custom-select-menu" role="listbox">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`custom-select-option ${
                        sortBy === option.value ? "selected" : ""
                      }`}
                      role="option"
                      aria-selected={sortBy === option.value}
                      onMouseDown={(event) => event.preventDefault()}
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
            {filtered.map((event) => {
              const displayEvent = {
                ...event,
                color: cardColorsByEventId[event.id] ?? event.color,
                imageUrl: undefined,
                imageBlurred: false,
              };

              const hiddenTitle = hiddenPhraseByEventId[event.id] ?? "Your next adventure.";

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

          {filtered.length === 0 && (
            <div className="empty-state-card">
              <h2>No mystery plans found.</h2>
              <p>
                Try expanding your radius, raising your max price, or choosing a
                nearby address from the location suggestions.
              </p>
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
