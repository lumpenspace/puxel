import { Field, Input } from "puxel";

export function WithHint() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Field label="Player name" hint="Shown on the leaderboard">
        {(p) => <Input {...p} placeholder="AAA" />}
      </Field>
    </div>
  );
}

export function WithError() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Field label="Guild" error="This guild name is taken">
        {(p) => <Input {...p} error value="The Pixel Pushers" />}
      </Field>
    </div>
  );
}
