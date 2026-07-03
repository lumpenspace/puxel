import { Avatar } from "puxel";

export function Sizes() {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
      <Avatar size="sm" initials="P1" />
      <Avatar initials="P2" />
      <Avatar size="lg" initials="P3" />
    </div>
  );
}

export function Status() {
  return (
    <div style={{ display: "flex", gap: 14 }}>
      <Avatar initials="ON" status="online" />
      <Avatar initials="AW" status="away" />
      <Avatar initials="BZ" status="busy" />
      <Avatar initials="OF" status="offline" />
    </div>
  );
}
