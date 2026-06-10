"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { events } from "@/lib/mock-data";
import { avatarToneForProfile } from "@/lib/avatar-profiles";
import styles from "./ProfileOverlayRoot.module.css";

type ProfileState = {
  name: string;
  initials: string;
  tone: string;
};

const profileBio: Record<string, string> = {
  "Mia Farrow": "Always looking for creative nights, calm surprises, and plans that feel easy to join with friends.",
  "Sana Chen": "Likes curated social plans, polished venues, and mystery events with a little bit of atmosphere.",
  "Jude Blake": "Usually says yes to culture, comedy, and relaxed plans that leave room for conversation.",
  "Eli Park": "Down for last-minute tickets, music-forward nights, and group plans that feel spontaneous.",
  "Noor Patel": "Interested in weekend plans, low-pressure outings, and mystery events with a cozy feel.",
  "Jalen Brooks": "Keeps an eye on popular ticket drops and likes joining plans once they start moving.",
  "Maya Rivera": "Loves surprise events that feel social, visual, and easy to remember afterward.",
};

const profileEvents: Record<string, string[]> = {
  "Mia Farrow": ["evt-1", "evt-3", "evt-5"],
  "Sana Chen": ["evt-1", "evt-2"],
  "Jude Blake": ["evt-1", "evt-3", "evt-4"],
  "Eli Park": ["evt-2", "evt-4", "evt-5"],
  "Noor Patel": ["evt-3", "evt-5"],
  "Jalen Brooks": ["evt-1", "evt-4"],
  "Maya Rivera": ["evt-2", "evt-3"],
};

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function eventRowsForProfile(name: string) {
  const ids = profileEvents[name] ?? [];

  return ids
    .map((id) => events.find((event) => event.id === id))
    .filter(Boolean)
    .map((event) => ({
      id: event!.id,
      label: "Mystery RSVP",
      date: formatEventDate(event!.startTime),
      detail: `${event!.category} · ${event!.city}`,
    }));
}

function initialsForName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileOverlayRoot() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<ProfileState | null>(null);

  useEffect(() => {
    if (pathname === "/") return;

    function openProfile(element: HTMLElement, event: Event) {
      const name = element.dataset.profileName?.trim();
      if (!name) return;

      event.preventDefault();
      event.stopPropagation();
      const initials = element.dataset.profileInitials?.trim() || initialsForName(name);

      setProfile({
        name,
        initials,
        tone: element.dataset.profileTone?.trim() || avatarToneForProfile(name, initials),
      });
    }

    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-profile-name]") : null;
      if (target) openProfile(target, event);
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-profile-name]") : null;
      if (target) openProfile(target, event);
    }

    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKeydown, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeydown, true);
    };
  }, [pathname]);

  const rows = useMemo(() => (profile ? eventRowsForProfile(profile.name) : []), [profile]);

  if (!profile || pathname === "/") return null;

  return (
    <div className={`modal-backdrop ${styles.profileBackdrop}`} onClick={() => setProfile(null)}>
      <div className={`modal-card compact-modal ${styles.profileModal}`} onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={() => setProfile(null)} aria-label="Close profile">
          ×
        </button>
        <div className={styles.profileHeader}>
          <div className={`avatar ${profile.tone}`} aria-hidden="true">
            <span className="avatar-initials">{profile.initials}</span>
          </div>
          <div>
            <p className="page-kicker">Profile</p>
            <h1 className="modal-title">{profile.name}</h1>
            <p className="page-subtitle">{profileBio[profile.name] ?? "A friend exploring mystery plans and upcoming RSVP drops."}</p>
          </div>
        </div>
        <section className={styles.eventsSection}>
          <h2>Upcoming plans</h2>
          <div className={styles.eventList}>
            {rows.map((event) => (
              <div key={event.id} className={styles.eventRow}>
                <div>
                  <h3>{event.label}</h3>
                  <p>{event.detail}</p>
                </div>
                <span>{event.date}</span>
              </div>
            ))}
            {rows.length === 0 && <p className={styles.emptyText}>No upcoming plans are visible yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
