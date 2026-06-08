"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import { MysteryEventCard } from "@/components/MysteryEventCard";
import { categories, events, rsvps } from "@/lib/mock-data";

function ToggleCheckbox({ checked, onChange, label, helper }: { checked: boolean; onChange: (checked: boolean) => void; label: string; helper?: string }) {
  return (
    <label className="group/check flex cursor-pointer items-start gap-3 rounded-2xl bg-[#f8f6fb] p-4 text-sm ring-1 ring-black/[0.06] transition hover:ring-[#b000b8]/25">
      <input className="sr-only" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border border-black/15 bg-white shadow-sm transition group-hover/check:border-[#b000b8]/40 group-has-[:checked]/check:border-[#b000b8] group-has-[:checked]/check:bg-gradient-to-br group-has-[:checked]/check:from-[#b12bff] group-has-[:checked]/check:to-[#ff25ca]">
        {checked && <Check size={14} className="text-white" />}
      </span>
      <span>
        <span className="block font-black text-[#11081f]">{label}</span>
        {helper && <span className="mt-1 block text-xs leading-5 text-[#11081f]/48">{helper}</span>}
      </span>
    </label>
  );
}

function SelectField({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-black text-[#11081f]/75">
      {label}
      <span className="relative block">
        <select className="dark-select w-full rounded-2xl px-4 py-3 pr-11 outline-none transition focus:border-[#b000b8]/50" value={value} onChange={(event) => onChange(event.target.value)}>
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#b000b8]" size={18} />
      </span>
    </label>
  );
}

export function MysteryEventSearch() {
  const [location, setLocation] = useState("All cities");
  const [maxPrice, setMaxPrice] = useState(60);
  const [category, setCategory] = useState("All categories");
  const [freeOnly, setFreeOnly] = useState(false);
  const [mysteryMode, setMysteryMode] = useState(true);

  const cities = ["All cities", ...Array.from(new Set(events.map((event) => event.city)))];

  const matches = useMemo(() => {
    return rsvps
      .map((rsvp) => ({ rsvp, event: events.find((event) => event.id === rsvp.eventId)! }))
      .filter(({ event }) => {
        const locationMatch = location === "All cities" || event.city === location;
        const priceMatch = freeOnly ? event.price === 0 : event.price <= maxPrice;
        const categoryMatch = category === "All categories" || event.category === category;
        return locationMatch && priceMatch && categoryMatch;
      });
  }, [location, maxPrice, category, freeOnly]);

  return (
    <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
      <aside className="glass-card rounded-[1.75rem] p-5 sm:p-6 lg:sticky lg:top-24">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-cyan-100 text-cyan-700 ring-1 ring-black/[0.04]"><SlidersHorizontal size={20} /></div>
          <div>
            <h2 className="text-2xl font-black tracking-[-0.04em]">Filters</h2>
            <p className="text-sm text-[#11081f]/50">Tune the surprise without spoiling it.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          <SelectField label="Location" value={location} onChange={setLocation}>{cities.map((city) => <option key={city}>{city}</option>)}</SelectField>
          <label className="grid gap-3 text-sm font-black text-[#11081f]/75">
            <span className="flex items-center justify-between gap-3"><span>Max price</span><span className="rounded-full bg-fuchsia-50 px-3 py-1 text-[#b000b8]">${maxPrice}</span></span>
            <input className="price-range" type="range" min="0" max="80" step="5" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} disabled={freeOnly} />
          </label>
          <SelectField label="Category filter" value={category} onChange={setCategory}><option>All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</SelectField>
          <ToggleCheckbox checked={mysteryMode} onChange={setMysteryMode} label="Mystery mode" helper="Hide event categories on ticket cards until the reveal." />
          <ToggleCheckbox checked={freeOnly} onChange={setFreeOnly} label="Free events only" helper="Only show events with a $0 ticket price." />
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 font-black text-[#b000b8]"><SlidersHorizontal size={18} /> {matches.length} mystery matches</p>
            <p className="mt-1 text-sm text-[#11081f]/50">{mysteryMode ? "Categories are hidden on tickets while mystery mode is on." : "Mystery mode is off, so ticket categories are visible."}</p>
          </div>
        </div>

        {matches.length > 0 ? (
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {matches.map(({ rsvp, event }) => <MysteryEventCard key={rsvp.id} rsvp={rsvp} event={event} hideCategory={mysteryMode} />)}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-black/[0.06] bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-black">No mystery events match those filters.</h2>
            <p className="mt-2 text-[#11081f]/55">Try increasing your budget, changing your city, or turning off free-only mode.</p>
          </div>
        )}
      </div>
    </section>
  );
}
