"use client";

import { FormEvent, useMemo, useState } from "react";
import { events, groups as initialGroups, members } from "@/lib/mock-data";
import { RSVPCard } from "@/components/RSVPCard";
import { purchaseTickets } from "@/lib/browser-actions";
import { avatarToneForPerson } from "@/lib/avatar-profiles";
import type { EventItem, Group, GroupMember } from "@/types";
import styles from "./social.module.css";

type Signal = {
  id: string;
  title: string;
  body: string;
  icon: string;
  eventId: string;
};

const baseFriends = members.map((member, index) => ({
  ...member,
  status:
    [
      "Looking at mystery plans",
      "Joined a ticket drop",
      "Ready for tonight",
      "Browsing nearby plans",
    ][index] ?? "Browsing nearby plans",
}));

const friendCandidates: (GroupMember & { status: string })[] = [
  {
    id: "m-5",
    name: "Noor Patel",
    initials: "NP",
    status: "Looking for weekend plans",
  },
  {
    id: "m-6",
    name: "Jalen Brooks",
    initials: "JB",
    status: "Browsing popular tickets",
  },
  {
    id: "m-7",
    name: "Maya Rivera",
    initials: "MR",
    status: "Interested in surprise events",
  },
];

const mysteryTitles: Record<string, string> = {
  "evt-1": "Your next adventure.",
  "evt-2": "Let's have some fun.",
  "evt-3": "Your calling.",
  "evt-4": "This is the one.",
};

const cardColorsByEventId: Record<string, EventItem["color"]> = {
  "evt-1": "apricot",
  "evt-2": "baby",
  "evt-3": "wisteria",
  "evt-4": "amethyst",
};

const signals: Signal[] = [
  {
    id: "popular",
    title: "This ticket is popular!",
    body: "A mystery plan that fits your preferences is getting attention right now.",
    icon: "/icons/up-arrow.svg",
    eventId: "evt-1",
  },
  {
    id: "running-out",
    title: "Tickets are running out!",
    body: "A nearby event is close to selling through. Grab yours soon.",
    icon: "/icons/exclamation-mark.svg",
    eventId: "evt-2",
  },
  {
    id: "released",
    title: "New event released.",
    body: "A fresh event was added that matches your comfort settings.",
    icon: "/icons/plus.svg",
    eventId: "evt-3",
  },
  {
    id: "friend-ticket",
    title: "Eli Park just bought a ticket.",
    body: "Purchase one too if you want to join your friend there.",
    icon: "/icons/ticket.svg",
    eventId: "evt-4",
  },
];

function PersonAvatar({
  member,
  className,
  expandable = false,
}: {
  member: GroupMember;
  className?: string;
  expandable?: boolean;
}) {
  return (
    <span
      className={`avatar ${avatarToneForPerson(member)} ${expandable ? "avatar-expand" : ""} ${className ?? ""}`.trim()}
      title={member.name}
      role="button"
      tabIndex={0}
      data-profile-name={member.name}
      data-profile-initials={member.initials}
      data-profile-tone={avatarToneForPerson(member)}
    >
      <span className="avatar-initials">{member.initials}</span>
      {expandable && <span className="avatar-full-name">{member.name}</span>}
    </span>
  );
}

function GroupAvatarStack({
  members: groupMembers,
}: {
  members: GroupMember[];
}) {
  if (!groupMembers.length) return null;

  return (
    <div className={styles.avatarStack} aria-label="Group members">
      {groupMembers.slice(0, 4).map((member) => (
        <PersonAvatar key={member.id} member={member} expandable />
      ))}
    </div>
  );
}

function isGoing(status: string) {
  return status.trim().toLowerCase() === "rsvp'd yes";
}

function statusLabel(status: string) {
  const normalized = status.trim().toLowerCase();

  if (normalized === "rsvp'd yes") return "Going";
  if (normalized === "rsvp'd no") return "Pending";
  if (normalized === "haven't rsvp'd yet") return "Pending";

  return status;
}

function formatMysteryPlanDateTime(value: string) {
  const date = new Date(value);

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function readinessScore(group: Group, ready: boolean) {
  const memberGoingCount = group.members.reduce((count, member) => {
    return count + (isGoing(group.memberStatuses?.[member.id] ?? "") ? 1 : 0);
  }, 0);
  const totalPeople = group.members.length + 1;
  const goingCount = memberGoingCount + (ready ? 1 : 0);

  return Math.round((goingCount / totalPeople) * 100);
}

function DetailIcon({
  src,
  alt,
  fallback,
}: {
  src?: string;
  alt: string;
  fallback: string;
}) {
  return src ? (
    <img className="history-icon-img" src={src} alt={alt} />
  ) : (
    <span>{fallback}</span>
  );
}

function TicketOverlay({
  event,
  groups,
  onClose,
  onAddEvent,
}: {
  event: EventItem | null;
  groups: Group[];
  onClose: () => void;
  onAddEvent: (groupId: string, eventId: string) => void;
}) {
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [groupPickerOpen, setGroupPickerOpen] = useState(false);

  if (!event) return null;

  const selectedGroup = groups.find((group) => group.id === selectedGroupId);
  const displayEvent = {
    ...event,
    color: cardColorsByEventId[event.id] ?? event.color,
    imageUrl: undefined,
    imageBlurred: false,
  };
  const hiddenTitle = mysteryTitles[event.id] ?? "Your next adventure.";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-card compact-modal ${styles.scrollModal}`}
        onClick={(clickEvent) => clickEvent.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close ticket details"
        >
          ×
        </button>
        <p className={`page-kicker ${styles.ticketOverlayKicker}`}>
          Ticket preview.
        </p>
        <h1 className={`modal-title ${styles.ticketOverlayTitle}`}>
          Event details
        </h1>
        <p className={`page-subtitle ${styles.ticketOverlaySubtitle}`}>
          The exact event stays hidden until reveal time, but your price,
          timing, and comfort limits are set.
        </p>
        <div className="modal-grid grid-2" style={{ alignItems: "start" }}>
          <div className="modal-details">
            <RSVPCard
              event={displayEvent}
              locked
              hideCategory
              hiddenTitle={hiddenTitle}
            />
            <section className="event-description-card">
              <h2>What you can expect</h2>
              <p>
                A verified public venue, clear entry instructions, and a plan
                that fits your selected preferences.
              </p>
              <p>
                Once your reveal unlocks, you’ll receive the venue name,
                address, dress guidance, safety notes, and what to do when you
                arrive.
              </p>
            </section>
            <section className={`event-description-card ${styles.ticketGroupPanel}`}>
              <div>
                <h2>Add event to group</h2>
                <p>Choose one of your current groups for this mystery ticket.</p>
              </div>
              <div
                className={`custom-select ${groupPickerOpen ? "open" : ""}`}
                tabIndex={0}
                onBlur={(pickerEvent) => {
                  if (!pickerEvent.currentTarget.contains(pickerEvent.relatedTarget as Node | null)) {
                    setGroupPickerOpen(false);
                  }
                }}
              >
                <button
                  type="button"
                  className="custom-select-trigger"
                  aria-haspopup="listbox"
                  aria-expanded={groupPickerOpen}
                  onClick={() => setGroupPickerOpen((current) => !current)}
                >
                  <span>{selectedGroup?.name ?? "No group selected"}</span>
                  <span className="custom-select-arrow" aria-hidden="true">▾</span>
                </button>
                {groupPickerOpen && (
                  <div className="custom-select-menu" role="listbox">
                    <button
                      type="button"
                      className={`custom-select-option ${selectedGroupId === "" ? "selected" : ""}`}
                      role="option"
                      aria-selected={selectedGroupId === ""}
                      onMouseDown={(pickerEvent) => pickerEvent.preventDefault()}
                      onClick={() => {
                        setSelectedGroupId("");
                        setGroupPickerOpen(false);
                      }}
                    >
                      No group selected
                    </button>
                    {groups.map((group) => (
                      <button
                        key={group.id}
                        type="button"
                        className={`custom-select-option ${selectedGroup?.id === group.id ? "selected" : ""}`}
                        role="option"
                        aria-selected={selectedGroup?.id === group.id}
                        onMouseDown={(pickerEvent) => pickerEvent.preventDefault()}
                        onClick={() => {
                          setSelectedGroupId(group.id);
                          setGroupPickerOpen(false);
                        }}
                      >
                        {group.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => selectedGroup && onAddEvent(selectedGroup.id, displayEvent.id)}
                disabled={!selectedGroup}
              >
                Add to group
              </button>
            </section>
          </div>
          <aside className="sidebar-card" style={{ alignSelf: "start" }}>
            <h2>Ticket preview</h2>
            <div className="history-list">
              <div className="history-item">
                <div className="history-icon">
                  <DetailIcon src="/icons/cost.svg" alt="Cost" fallback="$" />
                </div>
                <div>
                  <h3>Cost</h3>
                  <p>You pay ${displayEvent.price}</p>
                </div>
              </div>
              <div className="history-item">
                <div className="history-icon">
                  <DetailIcon
                    src="/icons/map.svg"
                    alt="Location"
                    fallback="⌖"
                  />
                </div>
                <div>
                  <h3>Location</h3>
                  <p>Revealed two hours before</p>
                </div>
              </div>
              <div className="history-item">
                <div className="history-icon">
                  <DetailIcon
                    src="/homepage-images/shield.svg"
                    alt="Safety"
                    fallback="✓"
                  />
                </div>
                <div>
                  <h3>Safety</h3>
                  <p>{displayEvent.safetyNotes ?? "Verified public venue."}</p>
                </div>
              </div>
              <div className="history-item">
                <div className="history-icon">
                  <DetailIcon
                    src="/icons/shirt.svg"
                    alt="Dress code"
                    fallback="◇"
                  />
                </div>
                <div>
                  <h3>Dress code</h3>
                  <p>{displayEvent.dressCode ?? "Comfortable casual"}</p>
                </div>
              </div>
            </div>
            <button
              className={`btn btn-primary ${styles.purchaseButton}`}
              onClick={() => purchaseTickets(displayEvent)}
              style={{ marginTop: 24, width: "100%" }}
            >
              <DetailIcon src="/icons/cart.svg" alt="Cart" fallback="↗" />{" "}
              Purchase tickets
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ManageFriendsOverlay({
  friends,
  onClose,
  onRemove,
  onAdd,
}: {
  friends: (GroupMember & { status: string })[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onAdd: (friend: GroupMember & { status: string }) => void;
}) {
  const [query, setQuery] = useState("");
  const currentIds = new Set(friends.map((friend) => friend.id));
  const results = friendCandidates.filter((friend) => {
    const matchesQuery = friend.name
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    return !currentIds.has(friend.id) && (!query.trim() || matchesQuery);
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-card compact-modal ${styles.friendManagerModal}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close manage friends"
        >
          ×
        </button>
        <p className={`page-kicker ${styles.overlayKicker}`}>Manage friends.</p>
        <h1 className={`modal-title ${styles.overlayTitle}`}>Friends</h1>
        <p className={`page-subtitle ${styles.overlaySubtitle}`}>
          Remove current friends or search for new people to add.
        </p>

        <div className={styles.friendManagerBody}>
          <section className={styles.friendManagerSection}>
            <h2>Add friends</h2>
            <input
              className="input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name"
            />
            <div className={styles.friendManagerList}>
              {results.map((friend) => (
                <div key={friend.id} className={styles.manageFriendRow}>
                  <PersonAvatar
                    member={friend}
                    className={styles.friendAvatar}
                  />
                  <button
                    type="button"
                    className={styles.friendProfileButton}
                    data-profile-name={friend.name}
                    data-profile-initials={friend.initials}
                    data-profile-tone={avatarToneForPerson(friend)}
                  >
                    <h3>{friend.name}</h3>
                    <p>{friend.status}</p>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => onAdd(friend)}
                  >
                    Add
                  </button>
                </div>
              ))}
              {results.length === 0 && (
                <p className={styles.emptyText}>No new friends found.</p>
              )}
            </div>
          </section>

          <section className={styles.friendManagerSection}>
            <h2>Current friends</h2>
            <div className={styles.friendManagerList}>
              {friends.map((friend) => (
                <div key={friend.id} className={styles.manageFriendRow}>
                  <PersonAvatar
                    member={friend}
                    className={styles.friendAvatar}
                  />
                  <button
                    type="button"
                    className={styles.friendProfileButton}
                    data-profile-name={friend.name}
                    data-profile-initials={friend.initials}
                    data-profile-tone={avatarToneForPerson(friend)}
                  >
                    <h3>{friend.name}</h3>
                    <p>{friend.status}</p>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onRemove(friend.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function GroupOverlay({
  group,
  onClose,
  onLeave,
  onDelete,
}: {
  group: Group | null;
  onClose: () => void;
  onLeave: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [ready, setReady] = useState(false);

  if (!group) return null;

  const readiness = readinessScore(group, ready);
  const groupName = group.name;
  const groupCode = group.code;

  async function shareGroupCode() {
    const text = `Join my e-z.rsvp group with code ${groupCode}`;

    if (navigator.share) {
      await navigator.share({ title: groupName, text });
      return;
    }

    await navigator.clipboard.writeText(text);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-card compact-modal ${styles.scrollModal}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <p className={`page-kicker ${styles.overlayKicker}`}>Social circle.</p>
        <h1 className={`modal-title ${styles.overlayTitle}`}>{group.name}</h1>

        <div
          className={`modal-grid grid-2 ${styles.groupOverlayGrid}`}
          style={{ alignItems: "start" }}
        >
          <section
            className={`event-description-card ${styles.sharedPlanCard}`}
          >
            <div className={styles.groupTop}>
              <span className={styles.groupIcon}>{group.icon}</span>
              <div>
                <h2>Shared mystery plan</h2>
                <p>Next shared plan: {group.upcomingDateTime}</p>
              </div>
            </div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${readiness}%` }}
              />
            </div>
            <div className={styles.groupMeta}>
              <span>Group readiness</span>
              <span>{readiness}%</span>
            </div>
            <div className={styles.readyPanel}>
              <div>
                <h3>Ready to go?</h3>
                <p>Mark yourself as ready for this shared plan.</p>
              </div>
              <button
                type="button"
                className={`${styles.readySwitch} ${ready ? styles.readySwitchOn : ""}`}
                role="switch"
                aria-checked={ready}
                onClick={() => setReady((current) => !current)}
              >
                <span />
              </button>
            </div>
            <div className={styles.invitePanel}>
              <div>
                <h3>Invite friends</h3>
                <p>
                  Share code {group.code} to bring more people into this group.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={shareGroupCode}
              >
                Share code
              </button>
            </div>
          </section>

          <aside
            className={`sidebar-card ${styles.statusCard}`}
            style={{ alignSelf: "start" }}
          >
            <h2>Group statuses</h2>
            <div className={styles.memberList}>
              {group.members.map((member) => (
                <div key={member.id} className={styles.memberRow}>
                  <PersonAvatar
                    member={member}
                    className={styles.memberAvatar}
                  />
                  <button
                    type="button"
                    className={styles.friendProfileButton}
                    data-profile-name={member.name}
                    data-profile-initials={member.initials}
                    data-profile-tone={avatarToneForPerson(member)}
                  >
                    <h3>{member.name}</h3>
                    <p>
                      {statusLabel(
                        group.memberStatuses?.[member.id] ??
                          "Haven't RSVP'd yet",
                      )}
                    </p>
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.actionRow}>
              <button
                className="btn btn-secondary"
                onClick={() => onLeave(group.id)}
              >
                Leave group
              </button>
              {group.role === "Owner" && (
                <button
                  className={`btn btn-secondary ${styles.dangerButton}`}
                  onClick={() => onDelete(group.id)}
                >
                  Delete group
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function SocialPage() {
  const [groups, setGroups] = useState(initialGroups);
  const [selected, setSelected] = useState<Group | null>(null);
  const [joinOpen, setJoinOpen] = useState(false);
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");
  const [activeTicket, setActiveTicket] = useState<EventItem | null>(null);
  const [manageFriendsOpen, setManageFriendsOpen] = useState(false);
  const [friendList, setFriendList] = useState(baseFriends);
  const visibleFriends = useMemo(() => friendList, [friendList]);

  function handleJoin(event: FormEvent) {
    event.preventDefault();
    const code = joinCode.trim().toUpperCase();
    const existing =
      initialGroups.find((group) => group.code.toUpperCase() === code) ||
      groups.find((group) => group.code.toUpperCase() === code);

    if (!existing) {
      setMessage("No group found with that code.");
      return;
    }

    if (!groups.some((group) => group.id === existing.id)) {
      setGroups((prev) => [...prev, { ...existing, role: "Member" }]);
    }

    setMessage(`Joined ${existing.name}.`);
    setJoinOpen(false);
    setJoinCode("");
  }

  function handleCreate(event: FormEvent) {
    event.preventDefault();
    const name = groupName.trim();
    if (!name) return;

    const code =
      name
        .replace(/[^a-z0-9]/gi, "")
        .slice(0, 6)
        .toUpperCase() || "GROUP";
    const group: Group = {
      id: `custom-${Date.now()}`,
      name,
      members: [],
      readiness: 0,
      code,
      role: "Owner",
      icon: "◌",
      upcomingPlan: "Mystery plan",
      upcomingDateTime: "Choose a date soon",
      memberStatuses: {},
    };

    setGroups((prev) => [group, ...prev]);
    setMessage(`Created ${name}.`);
    setGroupName("");
    setNewGroupOpen(false);
  }

  function handleLeave(id: string) {
    const group = groups.find((item) => item.id === id);
    setGroups((prev) => prev.filter((item) => item.id !== id));
    setSelected(null);
    setMessage(group ? `Left ${group.name}.` : "Left group.");
  }

  function handleDelete(id: string) {
    const group = groups.find((item) => item.id === id);
    setGroups((prev) => prev.filter((item) => item.id !== id));
    setSelected(null);
    setMessage(group ? `Deleted ${group.name}.` : "Deleted group.");
  }

  function handleViewTicket(eventId: string) {
    const event = events.find((item) => item.id === eventId);
    if (event) setActiveTicket(event);
  }

  function handleAddEventToGroup(groupId: string, eventId: string) {
    const event = events.find((item) => item.id === eventId);

    if (!event) return;

    const formattedTime = formatMysteryPlanDateTime(event.startTime);

    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              upcomingPlan: "Mystery plan",
              upcomingDateTime: formattedTime,
            }
          : group,
      ),
    );
    setMessage(`Added a mystery plan for ${formattedTime}.`);
  }

  function handleRemoveFriend(id: string) {
    setFriendList((prev) => prev.filter((friend) => friend.id !== id));
  }

  function handleAddFriend(friend: GroupMember & { status: string }) {
    setFriendList((prev) =>
      prev.some((item) => item.id === friend.id) ? prev : [...prev, friend],
    );
  }

  return (
    <main className="main-shell">
      <p className="page-kicker">Plan with people.</p>
      <h1 className="page-title">Social</h1>
      <p className="page-subtitle">
        Keep up with friends, local ticket signals, and your mystery RSVP
        groups.
      </p>

      {message && <div className={styles.statusMessage}>{message}</div>}

      <div className={styles.socialGrid}>
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Friends</h2>
              <p>See what your friends are up to.</p>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setManageFriendsOpen(true)}
            >
              Manage friends
            </button>
          </div>
          <div className={styles.friendList}>
            {visibleFriends.map((friend) => (
              <div key={friend.id} className={styles.friendRow}>
                <PersonAvatar member={friend} className={styles.friendAvatar} />
                <button
                  type="button"
                  className={styles.friendProfileButton}
                  data-profile-name={friend.name}
                  data-profile-initials={friend.initials}
                  data-profile-tone={avatarToneForPerson(friend)}
                >
                  <h3>{friend.name}</h3>
                  <p>{friend.status}</p>
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Happening now</h2>
              <p>
                See events popular with your friends and the local community
              </p>
            </div>
          </div>
          <div className={styles.signalList}>
            {signals.map((signal) => (
              <div key={signal.id} className={styles.signalRow}>
                <span className={styles.signalIcon} aria-hidden="true">
                  <img src={signal.icon} alt="" />
                </span>
                <div className={styles.signalText}>
                  <h3>{signal.title}</h3>
                  <p>{signal.body}</p>
                </div>
                <button
                  type="button"
                  className={`btn btn-secondary ${styles.signalButton}`}
                  onClick={() => handleViewTicket(signal.eventId)}
                >
                  View ticket
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className={`section ${styles.groupsSection}`}>
        <div className={styles.sectionHeader}>
          <div>
            <p className="page-kicker">Your groups.</p>
            <h2>Coordinate mystery plans with friends.</h2>
            <p>
              Use share codes to keep your crew together before reveal time.
            </p>
          </div>
          <div className={styles.actionRow}>
            <button
              className="btn btn-secondary"
              onClick={() => setJoinOpen(true)}
            >
              Join with code
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setNewGroupOpen(true)}
            >
              + New group
            </button>
          </div>
        </div>

        <div className={styles.groupGrid}>
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              className={styles.groupButton}
              onClick={() => setSelected(group)}
            >
              <div className={styles.groupCardHeader}>
                <span className={styles.groupIcon}>{group.icon}</span>
                <div className={styles.groupTitle}>
                  <h3>{group.name}</h3>
                  <p>
                    {group.members.length} members · {group.role}
                  </p>
                </div>
              </div>
              <div className={styles.readinessHeader}>
                <span>Group readiness</span>
                <span>{group.readiness}%</span>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${group.readiness}%` }}
                />
              </div>
              <p className={styles.nextPlan}>
                Next shared plan: {group.upcomingDateTime}
              </p>
              <GroupAvatarStack members={group.members} />
              <div className={styles.codeRow}>
                <span>Code {group.code}</span>
                <span>Open to share</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {joinOpen && (
        <div className="modal-backdrop" onClick={() => setJoinOpen(false)}>
          <form
            className={`modal-card compact-modal ${styles.narrowModal} ${styles.scrollModal}`}
            onSubmit={handleJoin}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setJoinOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <p className={`page-kicker ${styles.overlayKicker}`}>
              Join a circle.
            </p>
            <h1 className={`modal-title ${styles.overlayTitle}`}>
              Join group.
            </h1>
            <p className={`page-subtitle ${styles.overlaySubtitle}`}>
              Enter the code your friend shared with you.
            </p>
            <label className="small-label" htmlFor="join-code">
              Group code
            </label>
            <input
              id="join-code"
              className="input"
              value={joinCode}
              onChange={(event) =>
                setJoinCode(event.target.value.toUpperCase())
              }
              placeholder="FRIDAY"
              required
            />
            <div className={styles.formActions}>
              <button className="btn btn-primary" type="submit">
                Join group
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setJoinOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {newGroupOpen && (
        <div className="modal-backdrop" onClick={() => setNewGroupOpen(false)}>
          <form
            className={`modal-card compact-modal ${styles.narrowModal} ${styles.scrollModal}`}
            onSubmit={handleCreate}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setNewGroupOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <p className={`page-kicker ${styles.overlayKicker}`}>
              Build your crew.
            </p>
            <h1 className={`modal-title ${styles.overlayTitle}`}>New group.</h1>
            <p className={`page-subtitle ${styles.overlaySubtitle}`}>
              Create a shareable group for your next mystery RSVP.
            </p>
            <label className="small-label" htmlFor="group-name">
              Group name
            </label>
            <input
              id="group-name"
              className="input"
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              placeholder="Weekend crew"
              required
            />
            <p className="helper-text">
              Generated code{" "}
              {(groupName || "GROUP")
                .replace(/\s+/g, "")
                .slice(0, 6)
                .toUpperCase()}
            </p>
            <div className={styles.formActions}>
              <button className="btn btn-primary" type="submit">
                Create group
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setNewGroupOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <GroupOverlay
        group={selected}
        onClose={() => setSelected(null)}
        onLeave={handleLeave}
        onDelete={handleDelete}
      />
      <TicketOverlay
        event={activeTicket}
        groups={groups}
        onClose={() => setActiveTicket(null)}
        onAddEvent={handleAddEventToGroup}
      />
      {manageFriendsOpen && (
        <ManageFriendsOverlay
          friends={visibleFriends}
          onClose={() => setManageFriendsOpen(false)}
          onRemove={handleRemoveFriend}
          onAdd={handleAddFriend}
        />
      )}
    </main>
  );
}
