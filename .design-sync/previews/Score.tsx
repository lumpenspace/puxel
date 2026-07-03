import { Score } from "puxel";

export function Variants() {
  return (
    <div style={{ display: "flex", gap: 14 }}>
      <Score label="Score" value={42350} animate={false} />
      <Score label="Hi-score" value={999999} surface animate={false} />
    </div>
  );
}
