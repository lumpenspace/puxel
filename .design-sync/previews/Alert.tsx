import { Alert } from "puxel";

export function Variants() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
      <Alert variant="info" title="New patch">
        Version 2.1 adds four themes and a CRT filter.
      </Alert>
      <Alert variant="success" title="Saved">
        Your progress was written to slot 3.
      </Alert>
      <Alert variant="warning" title="Low battery">
        Save your game before the controller dies.
      </Alert>
      <Alert variant="danger" title="Connection lost">
        Player 2 has left the dungeon.
      </Alert>
    </div>
  );
}
