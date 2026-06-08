import { Smartphone } from "lucide-react";

export function AppStoreButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      {["App Store", "Google Play"].map((store) => (
        <div key={store} className="pop-button flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-white px-4 py-3 text-[#11081f] shadow-lg shadow-slate-200/70">
          <Smartphone size={20} />
          <div>
            <p className="text-[10px] uppercase text-[#11081f]/50">Coming soon on</p>
            <p className="font-black leading-none">{store}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
