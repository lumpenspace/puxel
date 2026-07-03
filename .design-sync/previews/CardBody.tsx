import { Card, CardBody, CardHeader, CardTitle } from "puxel";

export function BodyContent() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Card>
        <CardHeader>
          <CardTitle>Notice</CardTitle>
        </CardHeader>
        <CardBody>The main content area — padded, regular body text.</CardBody>
      </Card>
    </div>
  );
}
