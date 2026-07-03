## Puxel — conventions for building with this design system

Puxel is a brutalist/retro-pixel UI kit: hard 4px offset shadows, thick 3px
borders, zero border-radius, press-down active states, and a Press Start 2P
pixel font reserved for headings/scores/badges (body text stays a modern
sans). It ships **four themes** and both a CSS class API and typed React
components.

### Setup

Import the stylesheet once, globally: `import "puxel/styles.css"`. Nothing
renders styled without it — there is no CSS-in-JS, no runtime injection.

Wrap the app root in `<ThemeProvider>` (`theming/ThemeProvider`) to enable
theme switching and persistence:

```tsx
import { ThemeProvider, Button, Card, CardBody } from "puxel";

<ThemeProvider defaultTheme="paper">
  <Card><CardBody><Button variant="primary">Play</Button></CardBody></Card>
</ThemeProvider>
```

`defaultTheme` is one of `"paper" | "midnight" | "arcade" | "terminal"`.
Components render correctly even without `ThemeProvider` (the `:root`
defaults match the `paper` theme), but multi-theme switching requires it.
Use `<ThemeSwitcher />` for a ready-made theme picker.

### Styling idiom: `.px-*` utility classes + CSS variables

Every component is a plain HTML element with `.px-*` classes — no CSS-in-JS.
Modifiers append with `--`: `.px-btn.px-btn--primary.px-btn--sm`. Common
families actually shipped in the bundle:

| Family | Examples |
|---|---|
| Buttons | `.px-btn`, `--primary/--secondary/--success/--danger/--ghost`, `--sm/--lg`, `--pixel` (pixel-font label), `--icon` |
| Badges | `.px-badge`, `--primary/--secondary/--success/--warning/--danger/--info/--outline`, `--pixel` |
| Cards | `.px-card`, `--flat/--hover`; `.px-card-header` (`--accent`), `.px-card-title`, `.px-card-body`, `.px-card-footer` |
| Forms | `.px-input`, `.px-textarea`, `.px-select`, `.px-check`/`.px-radio`/`.px-switch`, all with `--error`/`:disabled` states |
| Alerts | `.px-alert`, `--info/--success/--warning/--danger` |
| Game HUD | `.px-healthbar` (`--hp/--mp/--xp`, `--critical`), `.px-score`, `.px-stat`, `.px-progress` |

Never invent a family not in this list or not found in `styles.css` — check
the shipped stylesheet before styling.

Theme values are CSS custom properties, always prefixed `--px-`:
`--px-bg`, `--px-surface`, `--px-ink`, `--px-ink-muted`, `--px-accent`,
`--px-accent-2`, `--px-success/--px-warning/--px-danger/--px-info` (each with
a matching `-ink` foreground pair), `--px-border-color`, `--px-shadow-color`,
`--px-space-1`..`--px-space-7`, `--px-border-w`, `--px-radius` (always `0`),
`--px-font-display` (pixel font) / `--px-font-body` / `--px-font-mono`. Use
`var(--px-*)` directly for any custom layout glue — never hardcode a hex
color or px shadow value that already has a token.

Two opt-in utility classes layer on top of any element: `.px-pixelated`
(stepped 8-bit corner silhouette) and `.px-crt` (scanline overlay, pairs with
the `terminal` theme).

### Where the truth lives

Read `styles.css` (imports the full token + component stylesheet) and each
component's own doc file before styling anything by hand — the real
selectors and variables are always more current than any summary.

### Example

```tsx
import { HealthBar, Score, Splash, Button } from "puxel";

<Splash title="Puxel" subtitle="Insert coin to continue" prompt="▶ Press start">
  <Button variant="primary" pixel>Insert coin</Button>
</Splash>
<Score label="Score" value={42350} />
<HealthBar kind="hp" value={7} max={10} />
```
