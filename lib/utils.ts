import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function canRevealEvent(eventStartTime: string, now = new Date()) {
  const start = new Date(eventStartTime).getTime();
  const revealWindowMs = 2 * 60 * 60 * 1000;
  return start - now.getTime() <= revealWindowMs;
}

export function getRevealTime(eventStartTime: string) {
  return new Date(new Date(eventStartTime).getTime() - 2 * 60 * 60 * 1000).toISOString();
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function getCountdownParts(targetIso: string) {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}
