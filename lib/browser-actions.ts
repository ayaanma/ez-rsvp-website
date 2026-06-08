import type { EventItem, PastEvent } from "@/types";

type CalendarEvent = {
  id: string;
  name: string;
  description?: string;
  venue?: string;
  address?: string;
  startTime?: string;
  endTime?: string;
};

function formatIcsDate(value?: string) {
  const date = value ? new Date(value) : new Date();
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function addEventToCalendar(event: CalendarEvent) {
  const start = formatIcsDate(event.startTime);
  const end = formatIcsDate(event.endTime ?? event.startTime);
  const location = [event.venue, event.address].filter(Boolean).join(" - ");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//e-z.rsvp//Mystery RSVP//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@e-z.rsvp`,
    `DTSTAMP:${formatIcsDate(new Date().toISOString())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.name}`,
    `DESCRIPTION:${event.description ?? "Your e-z.rsvp plan."}`,
    `LOCATION:${location || "Revealed before the event"}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  downloadFile(`${event.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`, ics, "text/calendar;charset=utf-8");
}

export async function shareEvent(event: EventItem | PastEvent) {
  const title = "e-z.rsvp";
  const text = `Check out this e-z.rsvp plan: ${event.name}`;
  const url = typeof window !== "undefined" ? window.location.href : "";

  if (navigator.share) {
    await navigator.share({ title, text, url });
    return;
  }

  await navigator.clipboard.writeText(`${text} ${url}`.trim());
  window.alert("Share link copied to clipboard.");
}

export async function purchaseTickets(event: EventItem) {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventId: event.id,
      name: event.name,
      price: event.price,
      description: event.description
    })
  });

  if (!response.ok) {
    window.alert("Ticket checkout is temporarily unavailable. Please try again.");
    return;
  }

  const data = (await response.json()) as { url?: string; demo?: boolean };

  if (data.url) {
    window.location.href = data.url;
    return;
  }

  window.alert("Demo checkout completed.");
}
