import { Input, Label } from "puxel";

export function Standalone() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 260 }}>
      <Label htmlFor="pl-name">Player name</Label>
      <Input id="pl-name" placeholder="AAA" />
    </div>
  );
}
