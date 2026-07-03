import { Avatar, AvatarGroup, Badge, Button, Card, CardBody, CardFooter, CardHeader, CardTitle } from "puxel";

export function QuestLog() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Card>
        <CardHeader accent>
          <CardTitle>Quest log</CardTitle>
          <Badge variant="secondary">3 new</Badge>
        </CardHeader>
        <CardBody>Defeat the Deadline Dragon before Friday. Reward: 500 XP and a long weekend.</CardBody>
        <CardFooter>
          <Button size="sm" variant="primary">
            Accept
          </Button>
          <Button size="sm" variant="ghost">
            Later
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export function HoverCard() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Card hoverable>
        <CardHeader>
          <CardTitle>Party members</CardTitle>
        </CardHeader>
        <CardBody>
          This card lifts on hover — use it for clickable list items.
          <div style={{ marginTop: 12 }}>
            <AvatarGroup>
              <Avatar initials="P1" />
              <Avatar initials="P2" status="online" />
              <Avatar initials="P3" status="busy" />
            </AvatarGroup>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
