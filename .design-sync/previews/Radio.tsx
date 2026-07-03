import { Radio } from "puxel";

export function Group() {
  return (
    <div style={{ display: "flex", gap: 16 }}>
      <Radio name="difficulty" label="Casual" defaultChecked />
      <Radio name="difficulty" label="Ranked" />
    </div>
  );
}
