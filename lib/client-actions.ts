import type { EventItem } from "@/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export type OAuthProvider = "google" | "apple";

export async function signInWithProvider(provider: OAuthProvider) {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    window.localStorage.setItem("ez-rsvp-demo-auth", provider);
    window.location.href = "/dashboard";
    return;
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) {
    window.alert(error.message);
  }
}

function formatICSDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeICS(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");
}

export function addEventToCalendar(event: EventItem, title?: string) {
  const calendarTitle = title ?? event.name;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//e-z.rsvp//Mystery RSVP//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@e-z.rsvp`,
    `DTSTAMP:${formatICSDate(new Date().toISOString())}`,
    `DTSTART:${formatICSDate(event.startTime)}`,
    `DTEND:${formatICSDate(event.endTime)}`,
    `SUMMARY:${escapeICS(calendarTitle)}`,
    `DESCRIPTION:${escapeICS(event.description || "Your e-z.rsvp plan")}`,
    `LOCATION:${escapeICS(event.address || event.city || "Location revealed later")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function shareEvent(event: EventItem, title?: string) {
  const shareTitle = title ?? event.name;
  const text = `${shareTitle} on e-z.rsvp — ${new Date(event.startTime).toLocaleString()}`;
  const url = window.location.href;

  if (navigator.share) {
    await navigator.share({ title: shareTitle, text, url });
    return;
  }

  await navigator.clipboard.writeText(`${text}\n${url}`);
  window.alert("Share link copied to clipboard.");
}

export async function purchaseTickets(event: EventItem) {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId: event.id }),
  });

  const data = (await response.json()) as {
    url?: string;
    demo?: boolean;
    message?: string;
    error?: string;
  };

  if (!response.ok) {
    window.alert(data.error ?? "Could not start checkout.");
    return;
  }

  if (data.url) {
    window.location.href = data.url;
    return;
  }

  window.localStorage.setItem(`ez-rsvp-purchase-${event.id}`, "demo-paid");
  window.alert(data.message ?? "Demo purchase complete. Add Stripe keys to enable real checkout.");
}
