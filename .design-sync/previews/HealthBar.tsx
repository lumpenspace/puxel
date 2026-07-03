import { HealthBar } from "puxel";

export function Resources() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <HealthBar kind="hp" value={7} max={10} />
      <HealthBar kind="mp" value={4} max={10} />
      <HealthBar kind="xp" value={8} max={10} />
    </div>
  );
}

export function Critical() {
  return <HealthBar kind="hp" value={2} max={10} />;
}
