import { Tab, TabPanel, Tabs, TabsList } from "puxel";

export function ThreeTabs() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Tabs defaultValue="gear">
        <TabsList>
          <Tab value="stats">Stats</Tab>
          <Tab value="gear">Gear</Tab>
          <Tab value="spells">Spells</Tab>
        </TabsList>
        <TabPanel value="gear">Rusty sword, wooden buckler, and a suspiciously heavy backpack.</TabPanel>
      </Tabs>
    </div>
  );
}
