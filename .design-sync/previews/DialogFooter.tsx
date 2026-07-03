import { Button, DialogFooter } from "puxel";

export function Actions() {
  return (
    <div style={{ maxWidth: 360, border: "3px solid var(--px-border-color)", background: "var(--px-surface)" }}>
      <div style={{ padding: 20 }}>Dialog body content goes above the footer.</div>
      <DialogFooter>
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </DialogFooter>
    </div>
  );
}
