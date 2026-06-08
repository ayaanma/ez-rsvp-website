import type { GroupMember } from "@/types";

export function AvatarStack({ members = [] }: { members?: GroupMember[] }) {
  if (!members?.length) return null;
  return (
    <div className="avatar-row" aria-label="Group members attending">
      {members.slice(0, 4).map((member) => (
        <span className="avatar avatar-expand" key={member.id} title={member.name}>
          <span className="avatar-initials">{member.initials}</span>
          <span className="avatar-full-name">{member.name}</span>
        </span>
      ))}
    </div>
  );
}
