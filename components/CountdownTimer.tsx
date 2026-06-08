"use client";

import { useEffect, useState } from "react";
import { formatCompactCountdown } from "@/lib/reveal";

export function CountdownTimer({ target, soon = false }: { target: string; soon?: boolean }) {
  const [label, setLabel] = useState(formatCompactCountdown(target));

  useEffect(() => {
    const id = setInterval(() => setLabel(formatCompactCountdown(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return <span className="countdown-pill" aria-label={soon ? "Reveal soon" : "Countdown"}>{label}</span>;
}
