import Link from "next/link";
import { notFound } from "next/navigation";
import { events, rsvps } from "@/lib/mock-data";
import { RSVPCard } from "@/components/RSVPCard";

export default async function RSVPDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rsvp = rsvps.find((item) => item.id === id) ?? rsvps[0];
  if (!rsvp) return notFound();
  const event = events.find((item) => item.id === rsvp.eventId)!;
  const locked = rsvp.status === "locked";
  return (
    <main className="main-shell">
      <Link className="nav-link" href="/dashboard">← Back to My events</Link>
      <h1 className="page-title">{locked ? "Still locked." : "It's revealed."}</h1>
      <p className="page-kicker">{locked ? "The exact event details unlock two hours before it starts." : "Your surprise plan is ready."}</p>
      <div className="dashboard-grid">
        <RSVPCard event={event} locked={locked} />
        <aside className="sidebar-card">
          <h2>{locked ? "What you can see" : event.name}</h2>
          <div className="history-list">
            <div className="history-item"><span className="history-icon">$</span><div><h3>Budget</h3><p>${event.price}</p></div></div>
            <div className="history-item"><span className="history-icon">⌁</span><div><h3>{locked ? "Venue" : event.venue}</h3><p>{locked ? "Revealed two hours before" : event.address}</p></div></div>
          </div>
          {!locked && <div className="hero-actions"><button className="btn btn-primary">Add to calendar</button><button className="btn btn-secondary">Share</button></div>}
        </aside>
      </div>
    </main>
  );
}
