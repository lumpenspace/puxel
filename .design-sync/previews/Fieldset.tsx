import { Button, Checkbox, Field, Fieldset, Input, Radio, Select } from "puxel";

export function PlayerSetup() {
  return (
    <Fieldset title="Player setup" accent shadow>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <Field label="Player name" hint="Shown on the leaderboard">
          {(p) => <Input {...p} placeholder="AAA" />}
        </Field>
        <Field label="Class">
          {(p) => (
            <Select {...p} defaultValue="mage">
              <option value="knight">Knight</option>
              <option value="mage">Mage</option>
              <option value="rogue">Rogue</option>
            </Select>
          )}
        </Field>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        <Checkbox label="Hard mode" />
        <Radio name="diff" label="Casual" defaultChecked />
        <Radio name="diff" label="Ranked" />
      </div>
      <div style={{ marginTop: 16 }}>
        <Button variant="primary" size="sm">
          Save
        </Button>
      </div>
    </Fieldset>
  );
}

export function TitleAlignment() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Fieldset title="Left aligned">
        <p style={{ margin: 0 }}>The default: title chip sits on the top-left border.</p>
      </Fieldset>
      <Fieldset title="Centered" align="center">
        <p style={{ margin: 0 }}>Titles can center on the border, nes-ui style.</p>
      </Fieldset>
      <Fieldset title="Right aligned" align="right">
        <p style={{ margin: 0 }}>Or align to the right.</p>
      </Fieldset>
    </div>
  );
}
