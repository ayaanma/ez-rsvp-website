import { BadgeCheck, ShieldCheck, MapPinned } from "lucide-react";

export function SafetyTrustSection() {
  return (
    <section>
      <div className="text-center">
        <h2 className="text-4xl font-black tracking-[-0.04em]">Safety & Trust</h2>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          [ShieldCheck, "Public venues only", "No unsafe/private locations. Mystery does not mean risky."],
          [BadgeCheck, "Verified organizers", "Events are built around organizer trust and clear expectations."],
          [MapPinned, "Hard limits", "Budget, radius, accessibility, and cancellation rules stay visible."]
        ].map(([Icon, title, text]) => {
          const I = Icon as typeof ShieldCheck;
          return (
            <div key={String(title)} className="rounded-2xl border border-black/[0.06] bg-white p-7 text-center shadow-sm">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#f3f1f6] text-[#11081f]"><I size={22} /></div>
              <h3 className="mt-5 font-black">{String(title)}</h3>
              <p className="mt-3 text-sm leading-6 text-[#11081f]/55">{String(text)}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
