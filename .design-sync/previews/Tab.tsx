import { Tab, TabPanel, Tabs, TabsList } from "puxel";

export function SelectedAndUnselected() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Tabs defaultValue="spells">
        <TabsList>
          <Tab value="stats">Stats</Tab>
          <Tab value="spells">Spells</Tab>
        </TabsList>
        <TabPanel value="spells">Fireball, Blink, and Summon Coffee (channelled, 4s cast).</TabPanel>
      </Tabs>
    </div>
  );
}
