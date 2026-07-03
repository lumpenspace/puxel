import { Kbd } from "puxel";

export function Shortcut() {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </div>
  );
}
