"use client";

import { Check, Bell, ShieldCheck, SlidersHorizontal, UserRound } from "lucide-react";
import { currentUser, userPreferences } from "@/lib/mock-data";
import { CategorySelector } from "@/components/CategorySelector";

function SettingsCheckbox({ label, defaultChecked = true }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="group/check flex cursor-pointer items-start gap-3 rounded-2xl bg-[#f8f6fb] p-4 text-sm ring-1 ring-black/[0.06] transition hover:ring-[#b000b8]/25">
      <input className="sr-only" type="checkbox" defaultChecked={defaultChecked} />
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border border-black/15 bg-white shadow-sm transition group-hover/check:border-[#b000b8]/40 group-has-[:checked]/check:border-[#b000b8] group-has-[:checked]/check:bg-gradient-to-br group-has-[:checked]/check:from-[#b12bff] group-has-[:checked]/check:to-[#ff25ca]">
        <Check size={14} className="hidden text-white group-has-[:checked]/check:block" />
      </span>
      <span className="font-black text-[#11081f]/72">{label}</span>
    </label>
  );
}

function SectionHeader({ icon: Icon, title, description }: { icon: typeof UserRound; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-cyan-100 text-cyan-700 ring-1 ring-black/[0.04]"><Icon size={19} /></div>
      <div>
        <h2 className="text-2xl font-black tracking-[-0.04em]">{title}</h2>
        <p className="mt-1 text-sm text-[#11081f]/50">{description}</p>
      </div>
    </div>
  );
}

export function AccountSettingsForm() {
  return (
    <form className="grid gap-6">
      <section className="glass-card grid gap-5 rounded-[1.75rem] p-6">
        <SectionHeader icon={UserRound} title="Account settings" description="Update your profile details for RSVP confirmations." />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-black text-[#11081f]/72">Name<input className="dark-field rounded-2xl px-4 py-3 outline-none focus:border-[#b000b8]/40" defaultValue={currentUser.name}/></label>
          <label className="grid gap-2 text-sm font-black text-[#11081f]/72">Email<input className="dark-field rounded-2xl px-4 py-3 outline-none focus:border-[#b000b8]/40" defaultValue={currentUser.email}/></label>
        </div>
      </section>

      <section className="glass-card grid gap-5 rounded-[1.75rem] p-6">
        <SectionHeader icon={SlidersHorizontal} title="Defaults" description="Set your normal city, radius, and favorite event categories." />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-black text-[#11081f]/72">Default city<input className="dark-field rounded-2xl px-4 py-3 outline-none focus:border-[#b000b8]/40" defaultValue={currentUser.defaultCity}/></label>
          <label className="grid gap-2 text-sm font-black text-[#11081f]/72">Default radius<input className="dark-field rounded-2xl px-4 py-3 outline-none focus:border-[#b000b8]/40" defaultValue={`${userPreferences.defaultRadius} miles`}/></label>
        </div>
        <div>
          <p className="mb-3 font-black">Favorite categories</p>
          <CategorySelector />
        </div>
      </section>

      <section className="glass-card grid gap-5 rounded-[1.75rem] p-6">
        <SectionHeader icon={Bell} title="Notifications" description="Choose how you want reveal alerts and reminders to show up." />
        <div className="grid gap-3 md:grid-cols-2">{userPreferences.notificationPreferences.map((preference) => <SettingsCheckbox key={preference} label={preference} />)}</div>
      </section>

      <section className="glass-card grid gap-5 rounded-[1.75rem] p-6">
        <SectionHeader icon={ShieldCheck} title="Safety preferences" description="Keep every surprise inside your hard comfort limits." />
        <div className="grid gap-3 md:grid-cols-2">{userPreferences.safetyPreferences.map((preference) => <SettingsCheckbox key={preference} label={preference} />)}</div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button className="pop-button rounded-full bg-gradient-to-r from-[#f000d8] via-[#c000d8] to-[#78eaf2] px-5 py-3 font-black text-white shadow-lg shadow-fuchsia-200/70" type="button">Save settings</button>
        <button className="text-sm font-black text-rose-500 transition hover:text-rose-600" type="button">Delete account placeholder</button>
      </div>
    </form>
  );
}
