import type { GroupMember } from "@/types";

type PersonLike = Partial<Pick<GroupMember, "id" | "name" | "initials">>;

const toneById: Record<string, string> = {
  m1: "avatar-tone-1",
  m2: "avatar-tone-2",
  m3: "avatar-tone-3",
  m4: "avatar-tone-4",
  "m-5": "avatar-tone-1",
  "m-6": "avatar-tone-2",
  "m-7": "avatar-tone-3",
};

const toneByName: Record<string, string> = {
  "Mia Farrow": "avatar-tone-1",
  "Sana Chen": "avatar-tone-2",
  "Jude Blake": "avatar-tone-3",
  "Eli Park": "avatar-tone-4",
  "Noor Patel": "avatar-tone-1",
  "Jalen Brooks": "avatar-tone-2",
  "Maya Rivera": "avatar-tone-3",
};

const toneByInitials: Record<string, string> = {
  MF: "avatar-tone-1",
  SC: "avatar-tone-2",
  JB: "avatar-tone-3",
  EP: "avatar-tone-4",
  NP: "avatar-tone-1",
  MR: "avatar-tone-3",
};

function hashTone(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash + value.charCodeAt(index) * (index + 1)) % 4;
  }

  return `avatar-tone-${hash + 1}`;
}

export function avatarToneForPerson(person: PersonLike) {
  const id = person.id?.trim();
  const name = person.name?.trim();
  const initials = person.initials?.trim().toUpperCase();

  if (id && toneById[id]) return toneById[id];
  if (name && toneByName[name]) return toneByName[name];
  if (initials && toneByInitials[initials]) return toneByInitials[initials];

  return hashTone(name || initials || id || "profile");
}

export function avatarToneForProfile(name: string, initials?: string) {
  return avatarToneForPerson({ name, initials });
}
