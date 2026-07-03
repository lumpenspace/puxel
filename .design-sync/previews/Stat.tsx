import { Stat } from "puxel";

export function Dashboard() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(140px, 1fr))", gap: 14 }}>
      <Stat label="Players online" value="1,204" delta="12%" direction="up" />
      <Stat label="Crash rate" value="0.03%" delta="8%" direction="down" />
      <Stat label="Coins collected" value="88,412" delta="31%" direction="up" />
    </div>
  );
}
