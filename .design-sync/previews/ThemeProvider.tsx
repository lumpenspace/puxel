import { Button, Card, CardBody, CardTitle, ThemeProvider } from "puxel";

/**
 * Wraps a subtree, sets `data-theme` on the document root, and persists the
 * choice to localStorage. Nest your whole app under one instance.
 */
export function Wrapped() {
  return (
    <ThemeProvider defaultTheme="paper" storageKey={null}>
      <Card>
        <CardBody>
          <CardTitle>Themed content</CardTitle>
          <p style={{ margin: "8px 0" }}>Everything inside reads the active theme's CSS variables.</p>
          <Button variant="primary">Themed button</Button>
        </CardBody>
      </Card>
    </ThemeProvider>
  );
}
