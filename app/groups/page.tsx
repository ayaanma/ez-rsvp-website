"use client";

import { useState } from "react";
import { groups } from "@/lib/mock-data";
import { AvatarStack } from "@/components/AvatarStack";
import type { Group } from "@/types";

function GroupOverlay({ group, onClose }: { group: Group | null; onClose: () => void }) {
  if (!group) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <h1 className="page-title modal-title">{group.name}</h1>
        <p className="page-kicker">Share code {group.code} with friends to coordinate mystery plans.</p>
        <div className="dashboard-grid modal-grid">
          <aside className="sidebar-card">
            <h2>Group details</h2>
            <div className="history-list">
              <div className="history-item"><span className="history-icon">{group.icon}</span><div><h3>Role</h3><p>{group.role}</p></div></div>
              <div className="history-item"><span className="history-icon">%</span><div><h3>Readiness</h3><p>{group.readiness}% ready for the next plan</p></div></div>
              <div className="history-item"><span className="history-icon">⌁</span><div><h3>Next event</h3><p>{group.upcomingDateTime}</p></div></div>
            </div>
          </aside>
          <aside className="sidebar-card">
            <h2>Group statuses</h2>
            <div className="history-list" style={{marginTop:18}}>
              {group.members.map((member, index) => (
                <div className="history-item" key={member.id}><span className={`avatar mini-avatar avatar-tone-${index + 1}`}>{member.initials}</span><div><h3>{member.name}</h3><p>{group.memberStatuses?.[member.id] ?? "RSVP'd yes"}</p></div></div>
              ))}
            </div>
            <div className="group-overlay-actions">
              <button className="btn btn-secondary">Leave group</button>
              {group.role === "Owner" && <button className="btn btn-danger">Delete group</button>}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function GroupsPage() {
  const [selected, setSelected] = useState<Group | null>(null);
  const [joinOpen, setJoinOpen] = useState(false);
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [groupName, setGroupName] = useState("");
  return (
    <main className="main-shell">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"end", gap:16, flexWrap:"wrap", marginBottom:30}}>
        <div><h1 className="page-title">Your Groups</h1><p className="page-kicker">Coordinate mystery plans with friends using share codes.</p></div>
        <div className="hero-actions" style={{marginTop:0}}><button className="btn btn-secondary" onClick={() => setJoinOpen(true)}>Join with code</button><button className="btn btn-primary" onClick={() => setNewGroupOpen(true)}>+ New group</button></div>
      </div>
      <div className="group-grid">
        {groups.map((group) => (
          <button className="group-card" key={group.id} onClick={() => setSelected(group)}>
            <div className="group-head">
              <div className="group-title-row">
                <div className="group-icon">{group.icon}</div>
                <div><h2 style={{margin:"0 0 4px"}}>{group.name}</h2><p className="rsvp-meta">{group.members.length} members · {group.role}</p></div>
              </div>
            </div>
            <div style={{marginTop:26, display:"flex", justifyContent:"space-between"}}><span className="rsvp-meta">Group readiness</span><strong>{group.readiness}%</strong></div>
            <div className="progress-bar"><div className="progress-fill" style={{width:`${group.readiness}%`}} /></div>
            <AvatarStack members={group.members} />
            <p className="section-copy" style={{marginTop:18}}>Next shared plan: {group.upcomingDateTime}</p>
            <div className="code-box"><span>Code {group.code}</span><span className="btn btn-secondary" style={{padding:"8px 12px"}}>Open to share</span></div>
          </button>
        ))}
      </div>

      {joinOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setJoinOpen(false)}>
          <div className="modal-card small-action-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setJoinOpen(false)} aria-label="Close">×</button>
            <h1 className="page-title modal-title">Join group.</h1>
            <p className="page-kicker">Enter the code your friend shared with you.</p>
            <div className="form-section">
              <label className="small-label" htmlFor="join-code">Group code</label>
              <input className="input code-input" id="join-code" value={joinCode} onChange={(event) => setJoinCode(event.target.value.toUpperCase())} placeholder="FRIDAY" />
            </div>
            <div className="hero-actions"><button className="btn btn-primary" onClick={() => setJoinOpen(false)}>Join group</button><button className="btn btn-secondary" onClick={() => setJoinOpen(false)}>Cancel</button></div>
          </div>
        </div>
      )}
      {newGroupOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setNewGroupOpen(false)}>
          <div className="modal-card small-action-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setNewGroupOpen(false)} aria-label="Close">×</button>
            <h1 className="page-title modal-title">New group.</h1>
            <p className="page-kicker">Create a shareable group for your next mystery RSVP.</p>
            <div className="form-section">
              <label className="small-label" htmlFor="group-name">Group name</label>
              <input className="input" id="group-name" value={groupName} onChange={(event) => setGroupName(event.target.value)} placeholder="Weekend crew" />
            </div>
            <div className="form-section">
              <label className="small-label">Generated code</label>
              <div className="code-box"><span>{(groupName || "GROUP").replace(/\s+/g, "").slice(0, 6).toUpperCase()}</span><span>Ready to share</span></div>
            </div>
            <div className="hero-actions"><button className="btn btn-primary" onClick={() => setNewGroupOpen(false)}>Create group</button><button className="btn btn-secondary" onClick={() => setNewGroupOpen(false)}>Cancel</button></div>
          </div>
        </div>
      )}
      <GroupOverlay group={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
