import { useEffect, useRef } from "react";
import { Button, Tooltip } from "puxel";

export function Visible() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector("button")?.focus();
  }, []);
  return (
    <div ref={ref} style={{ paddingTop: 30 }}>
      <Tooltip content="+10 charisma">
        <Button variant="ghost">Hover or focus me</Button>
      </Tooltip>
    </div>
  );
}
