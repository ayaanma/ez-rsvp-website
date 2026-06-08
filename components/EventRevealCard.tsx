import { CalendarPlus, Map, Share2, ShieldCheck, Ticket } from "lucide-react";
import type { Event, RSVP } from "@/types";
import { formatDateTime } from "@/lib/utils";

export function EventRevealCard({ event, rsvp }: { event: Event; rsvp: RSVP }) {
  return (
    <section className="grid gap-6 rounded-[1.75rem] bg-white p-6 shadow-xl shadow-slate-200/80 ring-1 ring-black/[0.06]">
      <div className="rounded-[1.5rem] bg-[linear-gradient(125deg,#fdfdff,#f4eaff_45%,#d3fbff)] p-6">
        <p className="text-sm font-black text-[#b000b8]">Your surprise is revealed</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-[#11081f]">{event.name}</h1>
        <p className="mt-3 max-w-3xl leading-7 text-[#11081f]/62">{event.description}</p>
      </div>
      <div className="grid gap-3 text-sm text-[#11081f]/68 md:grid-cols-2">
        <p><b>Venue:</b> {event.venue}</p><p><b>Address:</b> {event.address}</p><p><b>When:</b> {formatDateTime(event.startTime)}</p><p><b>Ticket:</b> {event.ticketDetails}</p><p><b>Dress code:</b> {event.dressCode}</p><p><b>Bring:</b> {event.whatToBring}</p><p><b>Accessibility:</b> {event.accessibilityNotes}</p><p><b>Age:</b> {event.ageRestriction}</p>
      </div>
      <div className="rounded-3xl bg-[#f7f5fa] p-8 text-center font-black text-[#11081f]/45 ring-1 ring-black/[0.06]"><Map className="mx-auto mb-2" /> Google Maps placeholder</div>
      <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-100"><ShieldCheck className="mb-2" /> {event.safetyNotes} Organizer: {event.organizerName}. {event.verifiedOrganizer ? "Verified organizer badge active." : "Pending verification."}</div>
      <div className="flex flex-wrap gap-3">
        <button className="pop-button rounded-full bg-gradient-to-r from-[#f000d8] via-[#c000d8] to-[#78eaf2] px-5 py-3 font-black text-white"><CalendarPlus className="mr-2 inline" size={18}/>Add to calendar</button>
        <button className="pop-button rounded-full bg-white px-5 py-3 font-black text-[#11081f] ring-1 ring-black/[0.08]"><Share2 className="mr-2 inline" size={18}/>Share</button>
        <button className="pop-button rounded-full bg-rose-50 px-5 py-3 font-black text-rose-600 ring-1 ring-rose-100"><Ticket className="mr-2 inline" size={18}/>Cancel RSVP</button>
      </div>
      <p className="text-xs text-[#11081f]/45">RSVP ID: {rsvp.id}. Calendar, share, Apple Wallet, and cancellation actions are placeholders for real integrations.</p>
    </section>
  );
}
