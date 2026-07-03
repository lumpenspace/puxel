import { useEffect, useRef } from "react";
import { Menu } from "puxel";

/** Menu manages its own open state internally; click the trigger on mount so the static capture shows the open list. */
function AutoOpenMenu(props: React.ComponentProps<typeof Menu>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>(".px-menu-trigger")?.click();
  }, []);
  return (
    <div ref={ref}>
      <Menu {...props} />
    </div>
  );
}

export function Open() {
  return (
    <AutoOpenMenu
      label="Actions"
      items={[
        { label: "Save game" },
        { label: "Load game" },
        { label: "Quit to desktop", danger: true, separator: true },
      ]}
    />
  );
}
