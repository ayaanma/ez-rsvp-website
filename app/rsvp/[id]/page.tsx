import { notFound } from "next/navigation";
import { events, rsvps } from "@/lib/mock-data";
import { RSVPDetailClient } from "@/components/RSVPDetailClient";

export default async function RSVPDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rsvp = rsvps.find((item) => item.id === id) ?? rsvps[0];
  if (!rsvp) return notFound();

  const event = events.find((item) => item.id === rsvp.eventId);
  if (!event) return notFound();

  return <RSVPDetailClient event={event} rsvp={rsvp} />;
}
