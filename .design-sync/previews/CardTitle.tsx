import { Card, CardBody, CardHeader, CardTitle } from "puxel";

export function InHeader() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Card>
        <CardHeader>
          <CardTitle>Party members</CardTitle>
        </CardHeader>
        <CardBody>The pixel-display heading inside a card header.</CardBody>
      </Card>
    </div>
  );
}
