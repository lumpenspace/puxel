import { Badge } from "puxel";

export function Variants() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      <Badge>Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  );
}

export function Pixel() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
      <Badge variant="primary" pixel>
        LVL 99
      </Badge>
      <Badge variant="danger" pixel>
        BOSS
      </Badge>
    </div>
  );
}
