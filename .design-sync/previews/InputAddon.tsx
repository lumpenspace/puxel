import { Input, InputAddon, InputGroup } from "puxel";

export function Prefix() {
  return (
    <div style={{ maxWidth: 300 }}>
      <InputGroup>
        <InputAddon>$</InputAddon>
        <Input placeholder="0.00" aria-label="Amount" />
      </InputGroup>
    </div>
  );
}
