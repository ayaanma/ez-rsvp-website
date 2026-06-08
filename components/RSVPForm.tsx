import { CategorySelector } from "@/components/CategorySelector";

export function RSVPForm() {
  return (
    <form className="glass-card grid gap-6 rounded-[1.75rem] p-5 sm:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-black text-[#11081f]/72">Date<input className="dark-field rounded-2xl px-4 py-3" type="date" defaultValue="2026-07-01" /></label>
        <label className="grid gap-2 text-sm font-black text-[#11081f]/72">Time range<select className="dark-select rounded-2xl px-4 py-3"><option>6:00 PM - 9:00 PM</option><option>7:00 PM - 11:00 PM</option><option>Weekend afternoon</option></select></label>
        <label className="grid gap-2 text-sm font-black text-[#11081f]/72">Location<input className="dark-field rounded-2xl px-4 py-3" defaultValue="New York, NY" /></label>
        <label className="grid gap-2 text-sm font-black text-[#11081f]/72">Radius<select className="dark-select rounded-2xl px-4 py-3"><option>5 miles</option><option>10 miles</option><option>25 miles</option></select></label>
        <label className="grid gap-2 text-sm font-black text-[#11081f]/72">Maximum ticket budget<input className="dark-field rounded-2xl px-4 py-3" type="number" defaultValue="50" /></label>
        <label className="grid gap-2 text-sm font-black text-[#11081f]/72">Group size<input className="dark-field rounded-2xl px-4 py-3" type="number" defaultValue="2" /></label>
      </div>
      <div className="grid gap-3"><p className="font-black">Pick broad categories</p><CategorySelector /></div>
      <label className="grid gap-2 text-sm font-black text-[#11081f]/72">Vibe preference<select className="dark-select rounded-2xl px-4 py-3"><option>chill</option><option>social</option><option>high-energy</option><option>adventurous</option><option>family-friendly</option></select></label>
      <label className="grid gap-2 text-sm font-black text-[#11081f]/72">Accessibility needs<textarea className="min-h-24 dark-field rounded-2xl px-4 py-3" placeholder="Step-free access, seating preference, sensory needs, etc." /></label>
      <div className="grid gap-2 rounded-3xl bg-[#f8f6fb] p-4 text-sm text-[#11081f]/70 ring-1 ring-black/[0.06]">
        <label className="flex items-center gap-3"><input type="radio" name="paid" defaultChecked /> I’m okay with paid events within my budget</label>
        <label className="flex items-center gap-3"><input type="radio" name="paid" /> I only want free events</label>
        <label className="flex items-center gap-3"><input type="checkbox" defaultChecked /> Public venues only</label>
        <label className="flex items-center gap-3"><input type="checkbox" defaultChecked /> Verified organizers only</label>
      </div>
      <a href="/rsvp/rsvp_002" className="pop-button rounded-full bg-gradient-to-r from-[#f000d8] via-[#c000d8] to-[#78eaf2] px-5 py-4 text-center font-black text-white shadow-lg shadow-fuchsia-200/70">Submit mystery RSVP</a>
      <p className="text-center text-xs text-[#11081f]/45">Demo form uses mock data. Connect this submit action to Supabase, payments, and partner APIs later.</p>
    </form>
  );
}
