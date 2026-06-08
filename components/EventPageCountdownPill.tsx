"use client";

import { useEffect, useState } from "react";
import { getCountdownParts } from "@/lib/utils";

export function EventPageCountdownPill({ targetIso, tone = "dark" }: { targetIso: string; tone?: "dark" | "light" | "gradient" }) {
  const [parts, setParts] = useState(() => getCountdownParts(targetIso));

  useEffect(() => {
    const id = setInterval(() => setParts(getCountdownParts(targetIso)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  const hours = parts.days > 0 ? parts.days * 24 + parts.hours : parts.hours;
  const time = `${String(hours).padStart(2, "0")}:${String(parts.minutes).padStart(2, "0")}:${String(parts.seconds).padStart(2, "0")}`;

  const classes = {
    dark: "bg-[#11081f] text-white shadow-xl shadow-[#11081f]/20",
    light: "bg-white/92 text-[#ff20c8] ring-1 ring-[#ff20c8]/25 shadow-xl shadow-pink-100/80",
    gradient: "bg-gradient-to-r from-[#b12bff] via-[#ff25ca] to-[#75edf5] text-white shadow-xl shadow-fuchsia-200/80"
  }[tone];

  return (
    <div className={`rounded-full px-5 py-3 font-mono text-2xl font-black leading-none tracking-[0.12em] ${classes}`}>
      {time}
    </div>
  );
}
