import Link from "next/link";
import { MapPin, Ticket, Users } from "lucide-react";
import type { Event, RSVP } from "@/types";
import { canRevealEvent, formatDateTime } from "@/lib/utils";
import { CountdownTimer } from "@/components/CountdownTimer";
import { RevealStatusBadge } from "@/components/RevealStatusBadge";
import { groups } from "@/lib/mock-data";

function FriendsGoing({ eventId }: { eventId: string }) {
  const friends = groups.flatMap((group) => group.members).filter((member) => member.attendingEventId === eventId).slice(0, 4);
  if (!friends.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-sm ring-1 ring-black/[0.06]">
      <div className="friend-avatar-stack">
        {friends.map((friend) => (
          <div
            key={friend.id}
            title={friend.name}
            className={`grid size-8 place-items-center rounded-full bg-gradient-to-br ${friend.avatarGradient} text-[10px] font-black text-white shadow-md ring-2 ring-white`}
          >
            {friend.initials}
          </div>
        ))}
      </div>
      <span className="text-xs font-black text-[#11081f]/60">
        {friends.length} friend{friends.length === 1 ? "" : "s"} going
      </span>
    </div>
  );
}

export function MysteryEventCard({ rsvp, event, hideCategory = false }: { rsvp: RSVP; event: Event; hideCategory?: boolean }) {
  const revealed = canRevealEvent(event.startTime) || rsvp.status === "revealed" || rsvp.status === "attended";
  const remainingTickets = Math.max(event.capacity - rsvp.groupSize, 1);
  const showSoonCountdown = revealed && rsvp.status !== "attended";

  return (
    <Link href={`/rsvp/${rsvp.id}`} className="rsvp-card-pop group block rounded-[1.6rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff25ca]/70">
      <article className="rsvp-card-surface relative overflow-hidden rounded-[1.6rem] border border-black/[0.08] bg-white shadow-xl shadow-slate-200/80 transition-colors duration-300">
        <div className="relative min-h-44 overflow-hidden bg-[linear-gradient(125deg,#bbc5c6_0%,#f3f0f5_45%,#c7fbff_100%)] p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_36%_70%,rgba(255,37,202,.22),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(117,237,245,.55),transparent_34%)]" />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              {!hideCategory && <span className="rounded-full bg-white/82 px-3 py-1 text-[#11081f]/75 shadow-sm">{event.category}</span>}
              {hideCategory && <span className="rounded-full bg-white/82 px-3 py-1 text-[#11081f]/75 shadow-sm">Mystery mode on</span>}
              <span className="rounded-full bg-white/82 px-3 py-1 text-[#b000b8] shadow-sm">≤ ${rsvp.budgetMax}</span>
            </div>
            {!revealed && <div className="rounded-full bg-[#11081f] px-3 py-1.5 text-xs font-black text-white shadow-lg">Locked</div>}
            {revealed && <RevealStatusBadge revealed={revealed} />}
          </div>
          <div className="relative mt-16">
            <p className="text-sm font-black tracking-[0.08em] text-[#11081f]/75">{revealed ? event.venue : `${event.neighborhood} area`}</p>
            <h3 className="mt-2 text-2xl font-black leading-tight tracking-[-0.04em] text-[#11081f]">{revealed ? event.name : "Surprise invite locked"}</h3>
          </div>
        </div>

        <div className="grid gap-4 p-5">
          <div className="grid gap-2 text-sm text-[#11081f]/62">
            <p className="flex items-center gap-2"><MapPin size={16} /> {revealed ? event.address : `${event.neighborhood} area`}</p>
            <p className="flex items-center gap-2"><Ticket size={16} /> {formatDateTime(event.startTime)}</p>
            <p className="flex items-center gap-2"><Users size={16} /> {remainingTickets} remaining tickets</p>
          </div>
          <FriendsGoing eventId={event.id} />
          {!revealed && <CountdownTimer targetIso={rsvp.revealAt} />}
          {showSoonCountdown && <CountdownTimer targetIso={event.startTime} variant="featured" />}
          <p className="text-sm font-black text-[#b000b8] transition duration-300 group-hover:translate-x-1">View RSVP →</p>
        </div>
      </article>
    </Link>
  );
}
