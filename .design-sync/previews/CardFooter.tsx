import { Button, Card, CardBody, CardFooter } from "puxel";

export function ActionFooter() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Card>
        <CardBody>Defeat the Deadline Dragon before Friday.</CardBody>
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
