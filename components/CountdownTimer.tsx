"use client";

import { useEffect, useState } from "react";

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();

  if (diff <= 0) return "00:00:00";

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

export function CountdownTimer({
  target,
  soon = false,
}: {
  target: string;
  soon?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  useEffect(() => {
    setMounted(true);

    const updateCountdown = () => {
      setTimeLeft(getTimeLeft(target));
    };

    updateCountdown();

    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, [target]);

  return (
    <span
      className={`countdown-pill ${soon ? "soon" : ""}`}
      aria-label={soon ? "Reveal soon" : "Countdown"}
      suppressHydrationWarning
    >
      {mounted ? timeLeft : "00:00:00"}
    </span>
  );
}
