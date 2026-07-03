import { Input } from "puxel";

export function States() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 280 }}>
      <Input placeholder="Placeholder text" />
      <Input defaultValue="Filled value" />
      <Input error defaultValue="Invalid value" />
      <Input disabled defaultValue="Disabled" />
    </div>
  );
}
