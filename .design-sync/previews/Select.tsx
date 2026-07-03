import { Select } from "puxel";

export function Default() {
  return (
    <div style={{ maxWidth: 260 }}>
      <Select defaultValue="mage" aria-label="Class">
        <option value="knight">Knight</option>
        <option value="mage">Mage</option>
        <option value="rogue">Rogue</option>
      </Select>
    </div>
  );
}
