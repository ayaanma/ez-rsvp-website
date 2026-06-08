import type { EventItem, PastEvent } from "@/types";

type CalendarEvent = {
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime?: string;
};

function formatIcsDate(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

export function downloadCalendarFile(event: CalendarEvent) {
  const start = formatIcsDate(event.startTime);
  const end = formatIcsDate(
    event.endTime ?? new Date(new Date(event.startTime).getTime() + 2 * 60 * 60 * 1000).toISOString()
  );

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//e-z.rsvp//Mystery RSVP//EN",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@e-z.rsvp`,
    `DTSTAMP:${formatIcsDate(new Date().toISOString())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "ez-rsvp"}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function sharePlan(payload: { title: string; text: string; url?: string }) {
  const url = payload.url ?? window.location.href;
  const shareData = { title: payload.title, text: payload.text, url };

  if (navigator.share) {
    await navigator.share(shareData);
    return "Shared.";
  }

  await navigator.clipboard.writeText(`${payload.title}\n${payload.text}\n${url}`);
  return "Copied share link.";
}

export function signInWithProvider(provider: "google" | "apple") {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const redirectTo = `${window.location.origin}/auth/callback`;

  if (supabaseUrl) {
    const url = new URL(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/authorize`);
    url.searchParams.set("provider", provider);
    url.searchParams.set("redirect_to", redirectTo);
    window.location.href = url.toString();
    return;
  }

  localStorage.setItem("ez-rsvp-demo-auth", JSON.stringify({ provider, signedInAt: new Date().toISOString() }));
  window.location.href = "/dashboard";
}

export async function purchaseTickets(event: EventItem) {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventId: event.id,
      name: event.name,
      description: event.description,
      price: event.price
    })
  });

  if (!response.ok) throw new Error("Unable to start checkout.");

  const result = (await response.json()) as { url?: string; demo?: boolean; message?: string };

  if (result.url) {
    window.location.href = result.url;
    return;
  }

  if (result.demo) {
    alert(result.message ?? "Demo purchase complete. Add Stripe keys to enable live checkout.");
    return;
  }

  throw new Error("Checkout did not return a destination.");
}

export function eventToCalendarItem(event: EventItem): CalendarEvent {
  return {
    title: event.name,
    description: event.description,
    location: event.address,
    startTime: event.startTime,
    endTime: event.endTime
  };
}

export function pastEventToCalendarItem(event: PastEvent): CalendarEvent {
  const start = new Date().toISOString();
  return {
    title: event.name,
    description: event.wouldDoAgain,
    location: event.address,
    startTime: start,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
  };
}
