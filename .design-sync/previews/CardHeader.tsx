import { Badge, Card, CardBody, CardHeader, CardTitle } from "puxel";

export function AccentHeader() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Card>
        <CardHeader accent>
          <CardTitle>Quest log</CardTitle>
          <Badge variant="secondary">3 new</Badge>
        </CardHeader>
        <CardBody>Header can carry a title plus trailing actions/badges.</CardBody>
      </Card>
    </div>
  );
}
