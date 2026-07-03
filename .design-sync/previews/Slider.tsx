import { Slider } from "puxel";

export function Default() {
  return (
    <div style={{ maxWidth: 260 }}>
      <Slider defaultValue={60} min={0} max={100} aria-label="Volume" />
    </div>
  );
}
