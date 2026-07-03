import { Breadcrumb } from "puxel";

export function Trail() {
  return (
    <Breadcrumb
      items={[
        { label: "World 1", href: "#" },
        { label: "Dungeon", href: "#" },
        { label: "Boss room" },
      ]}
    />
  );
}
