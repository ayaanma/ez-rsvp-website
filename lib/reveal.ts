export function canRevealEvent(eventStartTime: string, now = new Date()) {
  const start = new Date(eventStartTime).getTime();
  const revealWindow = 1000 * 60 * 60 * 2;
  return start - now.getTime() <= revealWindow;
}

export function getCountdownParts(target: string, now = new Date()) {
  const diff = Math.max(0, new Date(target).getTime() - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export function formatCompactCountdown(target: string) {
  const { days, hours, minutes, seconds } = getCountdownParts(target);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
