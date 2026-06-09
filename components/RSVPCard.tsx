import Link from "next/link";
import type { Route } from "next";
import type { CSSProperties } from "react";
import type { EventItem } from "@/types";
import { CountdownTimer } from "./CountdownTimer";
import { AvatarStack } from "./AvatarStack";

const colorClass: Record<EventItem["color"], string> = {
  baby: "food",
  wisteria: "music",
  amethyst: "culture",
  apricot: "revealed",
};

type RSVPCardProps = {
  event: EventItem;
  locked?: boolean;
  href?: Route;
  categoryLabel?: string;
  forceLocationHidden?: boolean;
  hideCategory?: boolean;
  hiddenTitle?: string;
};

export function RSVPCard({
  event,
  locked = false,
  href,
  categoryLabel,
  forceLocationHidden = false,
  hideCategory = false,
  hiddenTitle,
}: RSVPCardProps) {
  const title =
    locked || forceLocationHidden ? hiddenTitle ?? "Location Hidden" : event.name;

  const pillLabel = categoryLabel ?? event.category;

  const imageStyle = event.imageUrl
    ? ({ "--card-image": `url(${event.imageUrl})` } as CSSProperties)
    : undefined;

  const inner = (
    <article
      className={`rsvp-card ${locked ? "locked" : ""} ${
        event.imageUrl ? "image-card" : ""
      }`}
    >
      <div
        className={`rsvp-card-bg ${colorClass[event.color]} ${
          locked ? "locked" : ""
        } ${event.imageUrl ? "image-bg" : ""} ${
          event.imageBlurred ? "image-blurred" : ""
        }`}
        style={imageStyle}
      />

      <div className="rsvp-content">
        <div className="rsvp-top">
          {!hideCategory ? (
            <span className="pill">{pillLabel}</span>
          ) : (
            <span className="pill-spacer" aria-hidden="true" />
          )}

          <CountdownTimer target={event.startTime} soon={!locked} />
        </div>

        <div>
          <h3 className="rsvp-title">{title}</h3>

          <p className="rsvp-meta">
            {event.remainingTickets} remaining tickets · ${event.price}
          </p>

          <AvatarStack members={event.groupMembersGoing} />
        </div>
      </div>
    </article>
  );

  return href ? (
    <Link className="card-link" href={href}>
      {inner}
    </Link>
  ) : (
    inner
  );
}
