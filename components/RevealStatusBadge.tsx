export function RevealStatusBadge({ revealed }: { revealed: boolean }) {
  return (
    <span className={revealed ? "rounded-full bg-white px-3 py-1.5 text-xs font-black text-[#b000b8] shadow-sm" : "rounded-full bg-[#11081f] px-3 py-1.5 text-xs font-black text-white shadow-sm"}>
      {revealed ? "Revealed" : "Locked"}
    </span>
  );
}
