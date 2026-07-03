import { Tab, TabPanel, Tabs, TabsList } from "puxel";

export function Folder() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Tabs defaultValue="stats">
        <TabsList>
          <Tab value="stats">Stats</Tab>
          <Tab value="gear">Gear</Tab>
          <Tab value="spells">Spells</Tab>
        </TabsList>
        <TabPanel value="stats">STR 14 · DEX 9 · INT 17 · LUCK 3. Mostly a wizard, honestly.</TabPanel>
      </Tabs>
    </div>
  );
}

export function Boxed() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Tabs defaultValue="boxed" boxed>
        <TabsList>
          <Tab value="boxed">Boxed</Tab>
          <Tab value="variant">Variant</Tab>
        </TabsList>
        <TabPanel value="boxed">Pill-style triggers for toolbars and settings pages.</TabPanel>
      </Tabs>
    </div>
  );
}
