import type { Event, RSVP } from "@/types";
import { formatDateTime } from "@/lib/utils";

export function PastEventCard({ event, rsvp }: { event: Event; rsvp: RSVP }) {
  return (
    <article className="rsvp-card-pop grid gap-4 rounded-[1.6rem] border border-black/[0.08] bg-white p-5 shadow-xl shadow-slate-200/80">
      <div className="h-36 rounded-[1.25rem] bg-[linear-gradient(125deg,#c0c9ca,#faf7ff_48%,#c9fbff)]" />
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-[#b000b8]">Past event</p>
        <h3 className="text-xl font-black tracking-[-0.03em] text-[#11081f]">{event.name}</h3>
        <p className="text-sm text-[#11081f]/55">{formatDateTime(event.startTime)}</p>
      </div>
      <p className="text-sm text-[#11081f]/65">Rating: {"★".repeat(rsvp.rating ?? 0)}</p>
      <div className="rounded-2xl bg-[#f7f5fa] p-4 ring-1 ring-black/[0.06]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b000b8]">Would do again</p>
        <p className="mt-2 text-sm font-black text-[#11081f]/75">{rsvp.wouldDoAgain ? "Yes — this was worth repeating." : "No — I would skip a similar event."}</p>
        {rsvp.reflection && <p className="mt-3 text-sm leading-6 text-[#11081f]/55">“{rsvp.reflection}”</p>}
      </div>
    </article>
  );
}
