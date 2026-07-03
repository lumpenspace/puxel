# Puxel

A brutalist-retro UI kit for React — hard offset shadows, thick borders and pixel-font
accents on top of fully modern components (keyboard navigation, ARIA, reduced-motion
support, native `<dialog>`).

## Design

The styling is **CSS-first**: everything lives in plain CSS under `src/styles/`
(`.px-*` classes, themed via CSS variables), and the React components in
`src/components/` are thin typed wrappers that add behavior. You can use the CSS
without React, and the React API without writing any CSS.

### Themes

Set `data-theme` on any ancestor (usually `<html>`), or use `ThemeProvider` /
`ThemeSwitcher`:

| Theme | Vibe |
| --- | --- |
| `paper` (default) | Cream + ink, punchy yellow/orange accents |
| `midnight` | Near-black, off-white ink, yellow + violet |
| `arcade` | NES deep blue, cabinet red + coin gold |
| `terminal` | CRT phosphor green on black, mono body font |

### Components

Buttons, badges, avatars, spinner · inputs, textarea, select, checkbox, radio,
switch, slider, field, fieldset (title-on-border) · card, alert, toast, tabs,
accordion, table, dialog, dropdown menu, tooltip, breadcrumb, pagination ·
progress, segmented health/MP/XP bars, arcade score, stat, splash screen ·
kbd, separator.

Opt-in flourishes: `.px-pixelated` (stepped 8-bit corners), `.px-crt` (scanline
overlay), `pixel` prop (Press Start 2P font).

## Develop

```sh
npm install
npm run dev     # showcase app with theme switcher
npm run build
```

## Use in your app

```tsx
import "puxel/src/styles/puxel.css";
import { ThemeProvider, Button, HealthBar } from "puxel/src/components";

<ThemeProvider defaultTheme="arcade">
  <Button variant="primary" pixel>Insert coin</Button>
  <HealthBar kind="hp" value={7} max={10} />
</ThemeProvider>
```
