import type { GroupMember } from "@/types";
import { avatarToneForPerson } from "@/lib/avatar-profiles";

export function AvatarStack({ members = [] }: { members?: GroupMember[] }) {
  if (!members?.length) return null;

  return (
    <div className="avatar-stack" aria-label="People going">
      {members.slice(0, 4).map((member) => (
        <span
          key={member.id}
          className={`avatar avatar-expand ${avatarToneForPerson(member)}`}
          title={member.name}
          role="button"
          tabIndex={0}
          data-profile-name={member.name}
          data-profile-initials={member.initials}
          data-profile-tone={avatarToneForPerson(member)}
        >
          <span className="avatar-initials">{member.initials}</span>
          <span className="avatar-full-name">{member.name}</span>
        </span>
      ))}
    </div>
  );
}
