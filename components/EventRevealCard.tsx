import { CalendarPlus, Map, Share2, ShieldCheck, Ticket } from "lucide-react";
import type { Event, RSVP } from "@/types";
import { formatDateTime } from "@/lib/utils";

type RevealEvent = Event & {
  ticketDetails?: string;
  whatToBring?: string;
  verifiedOrganizer?: boolean;
  verified?: boolean;
};

export function EventRevealCard({
  event,
  rsvp,
}: {
  event: RevealEvent;
  rsvp: RSVP;
}) {
  return (
    <section className="grid gap-6 rounded-[1.75rem] bg-white p-6 shadow-xl shadow-slate-200/80 ring-1 ring-black/[0.06]">
      <div className="rounded-[1.5rem] bg-[#91C4F2]/20 p-6">
        <p className="text-sm font-bold text-[#9D79BC]">
          Your surprise is revealed
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-[-0.035em] text-[#272932]">
          {event.name}
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-[#272932]/65">
          {event.description}
        </p>
      </div>

      <div className="grid gap-3 text-sm text-[#272932]/70 md:grid-cols-2">
        <p>
          <b>Venue:</b> {event.venue}
        </p>

        <p>
          <b>Address:</b> {event.address}
        </p>

        <p>
          <b>When:</b> {formatDateTime(event.startTime)}
        </p>

        <p>
          <b>Ticket:</b> {event.ticketDetails ?? "Entry included with RSVP"}
        </p>

        <p>
          <b>Dress code:</b> {event.dressCode ?? "Casual"}
        </p>

        <p>
          <b>Bring:</b>{" "}
          {event.whatToBring ??
            "Your ID, ticket confirmation, and anything you need for the night."}
        </p>

        <p>
          <b>Accessibility:</b>{" "}
          {event.accessibilityNotes ??
            "Accessibility details will be confirmed before arrival."}
        </p>

        <p>
          <b>Age:</b> {event.ageRestriction ?? "All ages unless noted"}
        </p>
      </div>

      <div className="rounded-3xl bg-[#FCD7AD]/25 p-8 text-center font-bold text-[#272932]/50 ring-1 ring-black/[0.06]">
        <Map className="mx-auto mb-2" />
        Google Maps placeholder
      </div>

      <div className="rounded-3xl bg-[#272932] p-4 text-sm text-white">
        <ShieldCheck className="mb-2" />
        {event.safetyNotes ?? "Verified public venue with staff on site."}{" "}
        Organizer: {event.organizerName ?? "e-z.rsvp"}.{" "}
        {event.verifiedOrganizer || event.verified
          ? "Verified organizer badge active."
          : "Pending verification."}
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="rounded-full bg-[#272932] px-5 py-3 font-semibold text-white shadow-sm transition hover:shadow-md">
          <CalendarPlus className="mr-2 inline" size={18} />
          Add to calendar
        </button>

        <button className="rounded-full bg-white px-5 py-3 font-semibold text-[#272932] ring-1 ring-black/[0.08] transition hover:shadow-md">
          <Share2 className="mr-2 inline" size={18} />
          Share
        </button>

        <button className="rounded-full bg-[#FCD7AD]/40 px-5 py-3 font-semibold text-[#272932] ring-1 ring-black/[0.06] transition hover:shadow-md">
          <Ticket className="mr-2 inline" size={18} />
          Cancel RSVP
        </button>
      </div>

      <p className="text-xs text-[#272932]/45">
        RSVP ID: {rsvp.id}. Calendar, share, Apple Wallet, and cancellation
        actions are placeholders for real integrations.
      </p>
    </section>
  );
}