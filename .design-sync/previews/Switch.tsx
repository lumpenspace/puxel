import { Switch } from "puxel";

export function States() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      <Switch label="CRT filter on" defaultChecked />
      <Switch label="Off" />
    </div>
  );
}
