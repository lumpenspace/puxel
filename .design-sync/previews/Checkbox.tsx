import { Checkbox } from "puxel";

export function States() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      <Checkbox label="Enable sound" defaultChecked />
      <Checkbox label="Hard mode" />
      <Checkbox label="Disabled" disabled />
    </div>
  );
}
