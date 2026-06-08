import { categories } from "@/lib/mock-data";
export function OrganizerEventForm() {
  return (
    <form className="glass-card grid gap-4 rounded-[1.75rem] p-6">
      {[
        ["Event name", "text"], ["Venue", "text"], ["Date/time", "datetime-local"], ["Price", "number"], ["Capacity", "number"], ["Dress code", "text"], ["Age restrictions", "text"]
      ].map(([label, type]) => <label key={label} className="grid gap-2 text-sm font-black text-[#11081f]/72">{label}<input className="dark-field rounded-2xl px-4 py-3 outline-none focus:border-[#b000b8]/40" type={type}/></label>)}
      <label className="grid gap-2 text-sm font-black text-[#11081f]/72">Category<select className="dark-select rounded-2xl px-4 py-3 outline-none focus:border-[#b000b8]/40">{categories.map(c => <option key={c}>{c}</option>)}</select></label>
      {['Description','Accessibility info','Safety notes'].map(label => <label key={label} className="grid gap-2 text-sm font-black text-[#11081f]/72">{label}<textarea className="dark-field min-h-24 rounded-2xl px-4 py-3 outline-none focus:border-[#b000b8]/40" /></label>)}
      <button type="button" className="pop-button rounded-full bg-gradient-to-r from-[#f000d8] via-[#c000d8] to-[#78eaf2] px-5 py-3 font-black text-white shadow-lg shadow-fuchsia-200/70">Submit event for review</button>
    </form>
  );
}
