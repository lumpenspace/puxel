import { Accordion, AccordionItem } from "puxel";

export function ExpandedAndCollapsed() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Accordion defaultOpen={["saving"]}>
        <AccordionItem value="saving" title="Saving">
          Progress autosaves at every checkpoint. Manual saves live in the pause menu.
        </AccordionItem>
        <AccordionItem value="secrets" title="Secrets">
          Collapsed by default — click to reveal.
        </AccordionItem>
      </Accordion>
    </div>
  );
}
