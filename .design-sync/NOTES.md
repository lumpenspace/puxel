# design-sync notes for Puxel

## Repo-specific build setup

- Puxel started as a Vite **app** only (no library build). Added `vite.lib.config.ts`
  + `tsconfig.lib.json` + `scripts/build-css.mjs` to produce a real library
  entry (`dist/puxel.js`), a full `.d.ts` tree (`dist/types/`), and a flattened
  compiled stylesheet (`dist/puxel.css`) — run together via `npm run build:lib`
  (= `cfg.buildCmd`). The app build (`npm run build`) writes to `dist/app/` so
  the two builds never clobber each other; **always run `build:lib` again**
  after running the plain app build, since both write under `dist/`.
- The pixel font (`Press Start 2P`) originally lived in `public/fonts/` and was
  referenced via an absolute `/fonts/...` path — a Vite-`public/`-only
  convention. That broke the standalone esbuild CSS bundle (and would break
  any non-Vite consumer). Moved it to `src/styles/fonts/` and switched to a
  relative `url("./fonts/...")` reference; `scripts/build-css.mjs` inlines it
  as a `dataurl` so `dist/puxel.css` is fully self-contained.
- **macOS ships bash 3.2** (no associative arrays — `declare -A` silently
  produces garbage, don't use it for anything in this repo's scripts/tooling).
  Use Node one-liners instead for anything needing a key→value map in a shell
  script.

## Known render warns (checked against the current known-warns list on re-sync)

- `[RENDER_THIN] Slider` — the `Default` story has no text and a slim visual
  footprint by design (it's a bare range slider). Confirmed via a full-size
  screenshot (not just the contact-sheet thumbnail): track + thumb render
  correctly at the given value. Benign, will recur on every re-sync — not new.

## Accepted limitations

- **`ToastProvider`'s `Live` story is intentionally unauthored** (`skip:
  ["Live"]` in `cfg.overrides.ToastProvider`, `.design-sync/previews/ToastProvider.tsx`
  deleted). Root cause: the toast viewport uses `position: fixed`, and the
  capture/review harness applies a CSS `transform` to card wrappers for
  grid scaling — any `transform` on an ancestor turns `position: fixed`
  descendants into `position: absolute`-like behavior relative to that
  ancestor instead of the real viewport. This clipped the toast stack no
  matter how large a `viewport` override was set (tried up to 600×600,
  no change — confirmed it's a containing-block issue, not a sizing issue).
  This is **not a bug in Puxel** — `position: fixed` toasts work correctly in
  real app usage. ToastProvider ships as an honest floor card. If a future
  sync wants to fix this properly, the real solution is a preview harness
  that doesn't transform-scale single-card wrappers, which is out of scope
  for this repo to change.
- **`ThemeProvider`'s preview can't demonstrate a non-default theme.**
  `cfg.provider` (globally applied to every preview, including ThemeProvider's
  own) wraps every story in an outer `<ThemeProvider>` too. Because React
  fires effects child-first, the *inner* (authored) ThemeProvider's
  `document.documentElement` theme-attribute effect runs, then the *outer*
  (harness) one runs after and overwrites it. So `ThemeProvider.tsx`'s
  preview demonstrates composition (wrapping themed content) but always
  renders in the harness's default theme (`paper`) regardless of the
  `defaultTheme` prop passed in the story. Not fixable without changing
  `cfg.provider` globally (which would remove ThemeProvider from every other
  preview that needs it, e.g. `ThemeSwitcher`). Documented, not a bug.
- **Menu and Tooltip previews simulate interaction on mount** (a
  `useEffect` that calls `.click()` / `.focus()` on the real trigger element)
  since both components only reveal their open/visible state via real DOM
  events, not props. This is legitimate composition — it exercises the real
  component through its real event handlers — not a reimplementation.

## Re-sync risks

- The three preview-authoring quirks above (ToastProvider skip, ThemeProvider
  theme-not-demoable, Menu/Tooltip click-simulation-on-mount) are stable
  patterns, not one-off hacks — a re-sync agent seeing `[GRID_OVERFLOW]` on
  ToastProvider again, or wondering why ThemeProvider's screenshot looks like
  `paper` regardless of props, should read this file before re-investigating.
- If new components are added to `src/components/index.ts`, they need a
  category stub added to `.design-sync/docs/<Name>.md` (3-line frontmatter,
  see existing files) or they land in the flat `general` group.
- `dist/` is shared between the app build and the lib build (see setup notes
  above) — a re-sync that only runs `npm run build` (app) instead of
  `npm run build:lib` will silently point the converter at a stale/wrong
  `dist/puxel.js` and `dist/puxel.css`.
- No Storybook exists for this repo (confirmed with the user at sync time) —
  package shape is correct; don't re-prompt for this on re-sync.
