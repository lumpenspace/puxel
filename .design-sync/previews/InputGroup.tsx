import { Button, Input, InputAddon, InputGroup } from "puxel";

export function WithAddonAndButton() {
  return (
    <div style={{ maxWidth: 360 }}>
      <InputGroup>
        <InputAddon>@</InputAddon>
        <Input placeholder="username" aria-label="Username" />
        <Button variant="primary">Claim</Button>
      </InputGroup>
    </div>
  );
}
