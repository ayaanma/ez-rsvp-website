import type { Event, RSVP } from "@/types";
import { formatDateTime } from "@/lib/utils";

type PastRSVP = RSVP & {
  rating?: number;
  wouldDoAgain?: boolean;
  reflection?: string;
};

export function PastEventCard({
  event,
  rsvp,
}: {
  event: Event;
  rsvp: PastRSVP;
}) {
  const rating = rsvp.rating ?? 5;
  const wouldDoAgain = rsvp.wouldDoAgain ?? true;
  const reflection =
    rsvp.reflection ??
    "This was a fun surprise plan and I would try something like it again.";

  return (
    <article className="rsvp-card-pop grid gap-4 rounded-[1.6rem] border border-black/[0.08] bg-white p-5 shadow-xl shadow-slate-200/80">
      <div className="h-36 rounded-[1.25rem] bg-[#91C4F2]" />

      <div>
        <p className="text-xs font-black uppercase tracking-wide text-[#9D79BC]">
          Past event
        </p>

        <h3 className="text-xl font-black tracking-[-0.03em] text-[#272932]">
          {event.name}
        </h3>

        <p className="text-sm text-[#272932]/55">
          {formatDateTime(event.startTime)}
        </p>
      </div>

      <p className="text-sm text-[#272932]/65">
        Rating: {"★".repeat(rating)}
      </p>

      <div className="rounded-2xl bg-[#FCD7AD]/25 p-4 ring-1 ring-black/[0.06]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9D79BC]">
          Your review
        </p>

        <p className="mt-2 text-sm font-black text-[#272932]/75">
          {wouldDoAgain
            ? "Yes — this was worth repeating."
            : "No — I would skip a similar event."}
        </p>

        <p className="mt-3 text-sm leading-6 text-[#272932]/55">
          “{reflection}”
        </p>
      </div>
    </article>
  );
}