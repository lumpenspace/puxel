import { Accordion, AccordionItem, Kbd } from "puxel";

export function Default() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Accordion defaultOpen={["controls"]}>
        <AccordionItem value="controls" title="Controls">
          Arrow keys to move, <Kbd>Z</Kbd> to jump, <Kbd>X</Kbd> to attack.
        </AccordionItem>
        <AccordionItem value="saving" title="Saving">
          Progress autosaves at every checkpoint.
        </AccordionItem>
        <AccordionItem value="secrets" title="Secrets">
          There is a warp zone behind the third waterfall.
        </AccordionItem>
      </Accordion>
    </div>
  );
}
