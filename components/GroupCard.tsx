import { Copy, Share2, Ticket, Sparkles } from "lucide-react";
import type { RSVPGroup } from "@/types";
import { events } from "@/lib/mock-data";

function AvatarStack({ members }: { members: RSVPGroup["members"] }) {
  return (
    <div className="flex -space-x-3">
      {members.slice(0, 5).map((member) => (
        <div key={member.id} title={member.name} className={`grid size-11 place-items-center rounded-full bg-gradient-to-br ${member.avatarGradient ?? "from-[#91C4F2] to-[#8CA0D7]"} text-xs font-black text-white shadow-md ring-2 ring-white`}>
          {member.initials}
        </div>
      ))}
    </div>
  );
}

export function GroupCard({ group }: { group: RSVPGroup }) {
  const attendingMembers = group.members.filter((member) => member.attendingEventId);
  const firstEvent = events.find((event) => event.id === attendingMembers[0]?.attendingEventId);

  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-[#b000b8]/22 bg-white p-6 shadow-xl shadow-slate-200/80 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-300/70 hover:shadow-fuchsia-200/80">
      <div className="pointer-events-none absolute inset-0 opacity-80 transition duration-300 group-hover:opacity-100">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#b12bff] via-[#ff25ca] to-[#75edf5]" />
        <div className="absolute -right-20 -top-20 size-44 rounded-full bg-fuchsia-100 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 size-48 rounded-full bg-cyan-100 blur-3xl" />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[#f4f2f7] text-[#b000b8] ring-1 ring-black/[0.06]"><Sparkles size={28} /></div>
          <div>
            <h2 className="text-2xl font-black leading-tight tracking-[-0.04em] text-[#11081f]">{group.name}</h2>
            <p className="mt-1 text-sm font-bold text-[#11081f]/45">{group.members.length} members</p>
          </div>
        </div>
        <span className="rounded-full bg-gradient-to-r from-[#b12bff] to-[#ff25ca] px-4 py-1.5 text-xs font-black text-white shadow-lg shadow-fuchsia-100">
          {group.ownerUserId === "user_001" ? "Owner" : "Member"}
        </span>
      </div>

      <div className="relative mt-6">
        <div className="mb-2 flex items-center justify-between text-sm font-black"><span className="text-[#11081f]/50">Group readiness</span><span className="text-[#11081f]">{group.readiness}%</span></div>
        <div className="h-3 overflow-hidden rounded-full bg-[#f0edf3]"><div className="h-full rounded-full bg-gradient-to-r from-[#b12bff] via-[#ff25ca] to-[#75edf5]" style={{ width: `${group.readiness}%` }} /></div>
      </div>

      <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4"><AvatarStack members={attendingMembers.length ? attendingMembers : group.members} /></div>

      <div className="relative mt-5 rounded-2xl bg-[#f8f6fb] p-4 ring-1 ring-black/[0.06]">
        <div className="mb-3 flex items-center gap-2 text-sm font-black text-[#11081f]/80"><Ticket size={16} className="text-[#b000b8]" /> Friends attending</div>
        <div className="grid gap-3">
          {attendingMembers.slice(0, 3).map((member) => {
            const event = events.find((item) => item.id === member.attendingEventId);
            return (
              <div key={member.id} className="flex items-center gap-3 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-black/[0.04]">
                <div className={`grid size-9 place-items-center rounded-full bg-gradient-to-br ${member.avatarGradient ?? "from-[#91C4F2] to-[#8CA0D7]"} text-[11px] font-black text-white ring-2 ring-white`}>{member.initials}</div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-[#11081f]">{member.name}</p>
                  <p className="truncate text-xs text-[#11081f]/45">{event ? `${event.neighborhood} · ${event.price === 0 ? "Free" : `$${event.price}`}` : "Mystery RSVP pending"}</p>
                </div>
              </div>
            );
          })}
        </div>
        {firstEvent && <p className="mt-3 text-xs font-bold text-[#11081f]/42">Exact event details stay hidden until reveal time.</p>}
      </div>

      <div className="relative mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="flex items-center gap-3 rounded-full bg-[#f6f4f8] px-4 py-3 text-sm font-bold text-[#11081f]/75 ring-1 ring-black/[0.06]"><Copy size={16} className="text-[#11081f]/45" /><span className="text-[#11081f]/45">Code</span><span className="tracking-[0.2em] text-[#11081f]">{group.code}</span></div>
        <button className="pop-button inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/50 bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-700 hover:border-cyan-400"><Share2 size={16} /> Share</button>
      </div>
    </article>
  );
}
