import { Tab, TabPanel, Tabs, TabsList } from "puxel";

export function PanelContent() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Tabs defaultValue="stats">
        <TabsList>
          <Tab value="stats">Stats</Tab>
        </TabsList>
        <TabPanel value="stats">The active panel renders below the selected tab.</TabPanel>
      </Tabs>
    </div>
  );
}
