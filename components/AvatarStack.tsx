import type { GroupMember } from "@/types";

export function AvatarStack({ members = [] }: { members?: GroupMember[] }) {
  if (!members?.length) return null;

  return (
    <div className="avatar-row">
      {members.slice(0, 4).map((member) => (
        <span
          className="avatar avatar-expand"
          key={member.id}
          style={{
            transition:
              "width .46s cubic-bezier(.16,1,.3,1), max-width .46s cubic-bezier(.16,1,.3,1), box-shadow .32s ease, transform .32s ease"
          }}
          title={member.name}
        >
          <span className="avatar-initials">{member.initials}</span>
          <span
            className="avatar-full-name"
            style={{
              transition:
                "opacity .26s ease .08s, max-width .46s cubic-bezier(.16,1,.3,1), margin-left .46s cubic-bezier(.16,1,.3,1)"
            }}
          >
            {member.name}
          </span>
        </span>
      ))}
    </div>
  );
}
