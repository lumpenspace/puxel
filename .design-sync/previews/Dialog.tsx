import { useEffect, useState } from "react";
import { Button, Dialog } from "puxel";

export function Confirm() {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(true), []);
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      title="Overwrite save?"
      footer={
        <>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => setOpen(false)}>
            Overwrite
          </Button>
        </>
      }
    >
      Slot 3 contains 41 hours of progress. This action cannot be undone.
    </Dialog>
  );
}
