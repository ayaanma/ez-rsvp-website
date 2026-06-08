"use client";

import { FormEvent, useState } from "react";
import { groups as initialGroups } from "@/lib/mock-data";
import { AvatarStack } from "@/components/AvatarStack";
import type { Group } from "@/types";

function GroupOverlay({
  group,
  onClose,
  onLeave,
  onDelete
}: {
  group: Group | null;
  onClose: () => void;
  onLeave: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (!group) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <section className="modal-card compact-modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">×</button>
        <h1 className="page-title modal-title">{group.name}</h1>
        <p className="page-subtitle">Share code {group.code} with friends to coordinate mystery plans.</p>

        <div className="grid-3" style={{ marginTop: 28 }}>
          <div className="mini-card">
            <div className="group-icon">{group.icon}</div>
            <h3>Role</h3>
            <p>{group.role}</p>
          </div>
          <div className="mini-card">
            <h3>Readiness</h3>
            <p>{group.readiness}% ready for the next plan</p>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${group.readiness}%` }} /></div>
          </div>
          <div className="mini-card">
            <h3>Next event</h3>
            <p>{group.upcomingDateTime}</p>
          </div>
        </div>

        <div className="sidebar-card" style={{ marginTop: 24 }}>
          <h2>Group statuses</h2>
          <div className="history-list">
            {group.members.map((member) => (
              <div className="history-item" key={member.id}>
                <span className="avatar mini-avatar avatar-tone-1">{member.initials}</span>
                <div>
                  <h3>{member.name}</h3>
                  <p>{group.memberStatuses?.[member.id] ?? "RSVP'd yes"}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="group-overlay-actions">
            <button className="btn btn-secondary" type="button" onClick={() => onLeave(group.id)}>Leave group</button>
            {group.role === "Owner" && (
              <button className="btn btn-danger" type="button" onClick={() => onDelete(group.id)}>Delete group</button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [selected, setSelected] = useState<Group | null>(null);
  const [joinOpen, setJoinOpen] = useState(false);
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");

  function handleJoin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = joinCode.trim().toUpperCase();
    const existing = initialGroups.find((group) => group.code.toUpperCase() === code) || groups.find((group) => group.code.toUpperCase() === code);

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

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = groupName.trim();
    if (!name) return;

    const code = name.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase() || "GROUP";
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
      memberStatuses: {}
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

  return (
    <main className="main-shell">
      <div className="section-head" style={{ textAlign: "left", marginLeft: 0 }}>
        <h1 className="page-title">Your Groups</h1>
        <p className="page-subtitle">Coordinate mystery plans with friends using share codes.</p>
        {message && <p className="section-copy" style={{ marginTop: 12 }}>{message}</p>}
        <div className="hero-actions">
          <button className="btn btn-primary" type="button" onClick={() => setJoinOpen(true)}>Join with code</button>
          <button className="btn btn-secondary" type="button" onClick={() => setNewGroupOpen(true)}>+ New group</button>
        </div>
      </div>

      <div className="group-grid">
        {groups.map((group) => (
          <button key={group.id} className="group-card" type="button" onClick={() => setSelected(group)}>
            <div className="group-head">
              <div className="group-title-row">
                <div className="group-icon">{group.icon}</div>
                <div>
                  <h2>{group.name}</h2>
                  <p>{group.members.length} members · {group.role}</p>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 22 }}>
              <div className="label-row"><span>Group readiness</span><span>{group.readiness}%</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${group.readiness}%` }} /></div>
            </div>
            <p className="section-copy" style={{ marginTop: 16 }}>Next shared plan: {group.upcomingDateTime}</p>
            <AvatarStack members={group.members} />
            <div className="code-box"><span>Code {group.code}</span><span>Open to share</span></div>
          </button>
        ))}
      </div>

      {joinOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setJoinOpen(false)}>
          <form className="modal-card small-action-modal" onSubmit={handleJoin} onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setJoinOpen(false)} aria-label="Close">×</button>
            <h1 className="section-title">Join group.</h1>
            <p className="section-copy">Enter the code your friend shared with you.</p>
            <div className="form-section" style={{ marginTop: 22 }}>
              <label className="small-label" htmlFor="join-code">Group code</label>
              <input id="join-code" className="input code-input" value={joinCode} onChange={(event) => setJoinCode(event.target.value.toUpperCase())} placeholder="FRIDAY" required />
            </div>
            <div className="hero-actions">
              <button className="btn btn-primary" type="submit">Join group</button>
              <button className="btn btn-secondary" type="button" onClick={() => setJoinOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {newGroupOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setNewGroupOpen(false)}>
          <form className="modal-card small-action-modal" onSubmit={handleCreate} onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setNewGroupOpen(false)} aria-label="Close">×</button>
            <h1 className="section-title">New group.</h1>
            <p className="section-copy">Create a shareable group for your next mystery RSVP.</p>
            <div className="form-section" style={{ marginTop: 22 }}>
              <label className="small-label" htmlFor="group-name">Group name</label>
              <input id="group-name" className="input" value={groupName} onChange={(event) => setGroupName(event.target.value)} placeholder="Weekend crew" required />
            </div>
            <div className="code-box"><span>Generated code</span><span>{(groupName || "GROUP").replace(/\s+/g, "").slice(0, 6).toUpperCase()}</span></div>
            <div className="hero-actions">
              <button className="btn btn-primary" type="submit">Create group</button>
              <button className="btn btn-secondary" type="button" onClick={() => setNewGroupOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <GroupOverlay group={selected} onClose={() => setSelected(null)} onLeave={handleLeave} onDelete={handleDelete} />
    </main>
  );
}
