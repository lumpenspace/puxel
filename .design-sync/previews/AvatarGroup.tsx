import { Avatar, AvatarGroup } from "puxel";

export function Stacked() {
  return (
    <AvatarGroup>
      <Avatar initials="A" />
      <Avatar initials="B" />
      <Avatar initials="C" status="online" />
    </AvatarGroup>
  );
}
