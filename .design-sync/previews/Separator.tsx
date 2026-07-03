import { Separator } from "puxel";

export function Variants() {
  return (
    <div style={{ maxWidth: 300 }}>
      <p style={{ margin: 0 }}>Above</p>
      <Separator />
      <p style={{ margin: 0 }}>Between</p>
      <Separator dashed />
      <p style={{ margin: 0 }}>Below</p>
    </div>
  );
}
