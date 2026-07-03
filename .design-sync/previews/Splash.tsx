import { Button, Splash } from "puxel";

export function IntroScreen() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Splash title="Puxel" subtitle="A brutalist-retro UI kit with modern manners" prompt="▶ Press start">
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Button variant="primary" pixel>
            Insert coin
          </Button>
          <Button>New game</Button>
        </div>
      </Splash>
    </div>
  );
}
