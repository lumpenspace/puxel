import { Progress } from "puxel";

export function Variants() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 300 }}>
      <Progress value={72} showLabel label="Loading" />
      <Progress value={45} striped animated variant="info" label="Downloading" />
      <Progress value={100} variant="success" label="Complete" />
    </div>
  );
}
