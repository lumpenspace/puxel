/**
 * Build self-contained HTML preview cards for design-sync.
 *
 * Each card = one HTML file in previews/ whose first line is a
 * `<!-- @dsCard … -->` marker (indexed by the Claude Design "Design System"
 * pane). All CSS and the pixel font are inlined, so cards render with zero
 * external requests.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const CSS_FILES = ["tokens.css", "base.css", "controls.css", "forms.css", "containers.css", "game.css"];
let css = CSS_FILES.map((f) => readFileSync(join(root, "src/styles", f), "utf8")).join("\n");

const fontB64 = readFileSync(join(root, "src/styles/fonts/press-start-2p.woff2")).toString("base64");
css = css.replace(
  'url("./fonts/press-start-2p.woff2")',
  `url("data:font/woff2;base64,${fontB64}")`,
);

const esc = (s) => s.replace(/"/g, "&quot;");

function page({ name, group, subtitle, theme = "paper", body, pad = 28 }) {
  return `<!-- @dsCard name="${esc(name)}" group="${esc(group)}"${subtitle ? ` subtitle="${esc(subtitle)}"` : ""} -->
<!doctype html>
<html lang="en" data-theme="${theme}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(name)} — Puxel</title>
<style>
${css}
.preview-root { padding: ${pad}px; display: flex; flex-direction: column; gap: 18px; min-height: 100vh; }
.preview-row { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; }
.preview-col { display: flex; flex-direction: column; gap: 12px; }
.preview-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
</style>
</head>
<body>
<div class="preview-root">
${body}
</div>
</body>
</html>
`;
}

/* ---------------------------------------------------------------- markup */

const buttonsBody = `
<div class="preview-row">
  <button class="px-btn">Default</button>
  <button class="px-btn px-btn--primary">Primary</button>
  <button class="px-btn px-btn--secondary">Secondary</button>
  <button class="px-btn px-btn--success">Success</button>
  <button class="px-btn px-btn--danger">Danger</button>
  <button class="px-btn px-btn--ghost">Ghost</button>
  <button class="px-btn" disabled>Disabled</button>
</div>
<div class="preview-row">
  <button class="px-btn px-btn--sm">Small</button>
  <button class="px-btn">Medium</button>
  <button class="px-btn px-btn--lg">Large</button>
  <button class="px-btn px-btn--primary px-btn--pixel">Pixel font</button>
  <button class="px-btn px-btn--primary px-pixelated">Pixel corners</button>
  <button class="px-btn px-btn--icon" aria-label="Settings">⚙</button>
</div>`;

const badgesBody = `
<div class="preview-row">
  <span class="px-badge">Default</span>
  <span class="px-badge px-badge--primary">Primary</span>
  <span class="px-badge px-badge--secondary">Secondary</span>
  <span class="px-badge px-badge--success">Success</span>
  <span class="px-badge px-badge--warning">Warning</span>
  <span class="px-badge px-badge--danger">Danger</span>
  <span class="px-badge px-badge--info">Info</span>
  <span class="px-badge px-badge--outline">Outline</span>
  <span class="px-badge px-badge--primary px-badge--pixel">LVL 99</span>
</div>`;

const avatarsBody = `
<div class="preview-row">
  <span class="px-avatar px-avatar--sm">P1</span>
  <span class="px-avatar">P2<span class="px-avatar-status"></span></span>
  <span class="px-avatar px-avatar--lg">P3<span class="px-avatar-status px-avatar-status--busy"></span></span>
  <span class="px-avatar">P4<span class="px-avatar-status px-avatar-status--away"></span></span>
  <div class="px-avatar-group">
    <span class="px-avatar">A</span>
    <span class="px-avatar">B</span>
    <span class="px-avatar">C</span>
  </div>
</div>
<div class="preview-row">
  <span class="px-spinner px-spinner--sm"></span>
  <span class="px-spinner"></span>
  <span class="px-spinner px-spinner--lg"></span>
  <kbd class="px-kbd">⌘</kbd>
  <kbd class="px-kbd">K</kbd>
  <a href="#" class="px-link">A brutalist link</a>
</div>`;

const typographyBody = `
<h1 class="px-display px-display--xl">Display XL</h1>
<h2 class="px-display px-display--lg">Display LG</h2>
<h3 class="px-display px-display--md">Display MD</h3>
<h4 class="px-display px-display--sm">Display SM</h4>
<p style="max-width:52ch">Body text is a modern sans — readable, honest, and happy to sit next to
a pixel headline. Use <a class="px-link" href="#">links</a>, <kbd class="px-kbd">⌘</kbd>
<kbd class="px-kbd">K</kbd> shortcuts and <span class="px-badge px-badge--primary">badges</span> inline.</p>
<span class="px-label">Label / overline</span>
<p class="px-muted">Muted text for hints and secondary copy.</p>
<hr class="px-separator">
<hr class="px-separator px-separator--dashed">`;

const themeSwatch = (t, label) => `
<div data-theme="${t}" style="background:var(--px-bg); border:3px solid var(--px-border-color); padding:16px; display:flex; flex-direction:column; gap:10px;">
  <span class="px-display px-display--xs" style="color:var(--px-ink)">${label}</span>
  <div style="display:flex; gap:6px;">
    <span style="width:26px;height:26px;background:var(--px-accent);border:2px solid var(--px-border-color)"></span>
    <span style="width:26px;height:26px;background:var(--px-accent-2);border:2px solid var(--px-border-color)"></span>
    <span style="width:26px;height:26px;background:var(--px-success);border:2px solid var(--px-border-color)"></span>
    <span style="width:26px;height:26px;background:var(--px-danger);border:2px solid var(--px-border-color)"></span>
    <span style="width:26px;height:26px;background:var(--px-info);border:2px solid var(--px-border-color)"></span>
    <span style="width:26px;height:26px;background:var(--px-surface);border:2px solid var(--px-border-color)"></span>
  </div>
  <div style="display:flex; gap:8px;">
    <button class="px-btn px-btn--sm px-btn--primary">Play</button>
    <button class="px-btn px-btn--sm">Quit</button>
  </div>
</div>`;

const themesBody = `
<div class="preview-grid">
${themeSwatch("paper", "Paper")}
${themeSwatch("midnight", "Midnight")}
${themeSwatch("arcade", "Arcade")}
${themeSwatch("terminal", "Terminal")}
</div>`;

const inputsBody = `
<div class="px-field">
  <label class="px-label" for="i1">Player name</label>
  <input id="i1" class="px-input" placeholder="AAA">
  <span class="px-field-hint">Shown on the leaderboard</span>
</div>
<div class="px-field">
  <label class="px-label" for="i2">Guild</label>
  <input id="i2" class="px-input px-input--error" value="The Pixel Pushers">
  <span class="px-field-error">This guild name is taken</span>
</div>
<div class="px-field">
  <label class="px-label" for="i3">Class</label>
  <span class="px-select"><select id="i3"><option>Knight</option><option selected>Mage</option><option>Rogue</option></select></span>
</div>
<div class="px-field">
  <label class="px-label" for="i4">Bio</label>
  <textarea id="i4" class="px-textarea" placeholder="A mysterious adventurer…"></textarea>
</div>
<div class="px-input-group">
  <span class="px-input-addon">@</span>
  <input class="px-input" placeholder="username" aria-label="Username">
  <button class="px-btn px-btn--primary">Claim</button>
</div>`;

const selectionBody = `
<div class="preview-row">
  <label class="px-check"><input type="checkbox" checked><span class="px-check-box"></span><span>Enable sound</span></label>
  <label class="px-check"><input type="checkbox"><span class="px-check-box"></span><span>Hard mode</span></label>
  <label class="px-check"><input type="checkbox" disabled><span class="px-check-box"></span><span>Disabled</span></label>
</div>
<div class="preview-row">
  <label class="px-radio"><input type="radio" name="d" checked><span class="px-radio-dot"></span><span>Casual</span></label>
  <label class="px-radio"><input type="radio" name="d"><span class="px-radio-dot"></span><span>Ranked</span></label>
</div>
<div class="preview-row">
  <label class="px-switch"><input type="checkbox" role="switch" checked><span class="px-switch-track"></span><span>CRT filter on</span></label>
  <label class="px-switch"><input type="checkbox" role="switch"><span class="px-switch-track"></span><span>Off</span></label>
</div>
<div class="preview-col">
  <span class="px-label">Volume</span>
  <input type="range" class="px-slider" value="60" aria-label="Volume">
</div>`;

const fieldsetBody = `
<fieldset class="px-fieldset px-fieldset--shadow">
  <span class="px-fieldset-title px-fieldset-title--accent">Player setup</span>
  <p style="margin:6px 0 0">The section title sits on the border — nes-ui style, modern build.</p>
</fieldset>
<fieldset class="px-fieldset">
  <span class="px-fieldset-title px-fieldset-title--center">Centered</span>
  <p style="margin:6px 0 0">Titles can align left, center or right.</p>
</fieldset>`;

const cardsBody = `
<div class="preview-grid">
  <div class="px-card">
    <div class="px-card-header px-card-header--accent">
      <h3 class="px-card-title">Quest log</h3>
      <span class="px-badge px-badge--secondary">3 new</span>
    </div>
    <div class="px-card-body">Defeat the Deadline Dragon before Friday. Reward: 500 XP.</div>
    <div class="px-card-footer">
      <button class="px-btn px-btn--sm px-btn--primary">Accept</button>
      <button class="px-btn px-btn--sm px-btn--ghost">Later</button>
    </div>
  </div>
  <div class="px-card px-card--hover">
    <div class="px-card-header"><h3 class="px-card-title">Hover card</h3></div>
    <div class="px-card-body">Lifts on hover — for clickable list items and links.</div>
  </div>
</div>`;

const alertsBody = `
<div class="px-alert px-alert--info"><span class="px-alert-icon">i</span><div><p class="px-alert-title">New patch</p><p class="px-alert-body">Version 2.1 adds four themes and a CRT filter.</p></div></div>
<div class="px-alert px-alert--success"><span class="px-alert-icon">✓</span><div><p class="px-alert-title">Saved</p><p class="px-alert-body">Your progress was written to slot 3.</p></div></div>
<div class="px-alert px-alert--warning"><span class="px-alert-icon">!</span><div><p class="px-alert-title">Low battery</p><p class="px-alert-body">Save your game before the controller dies.</p></div></div>
<div class="px-alert px-alert--danger"><span class="px-alert-icon">✕</span><div><p class="px-alert-title">Connection lost</p><p class="px-alert-body">Player 2 has left the dungeon.</p></div></div>`;

const toastsBody = `
<div class="preview-col" style="max-width:360px">
  <div class="px-toast">Checkpoint reached<button class="px-toast-close" aria-label="Dismiss">✕</button></div>
  <div class="px-toast px-toast--success">Item crafted!<button class="px-toast-close" aria-label="Dismiss">✕</button></div>
  <div class="px-toast px-toast--warning">Storage almost full<button class="px-toast-close" aria-label="Dismiss">✕</button></div>
  <div class="px-toast px-toast--danger">You died.<button class="px-toast-close" aria-label="Dismiss">✕</button></div>
</div>`;

const tabsBody = `
<div>
  <div class="px-tabs-list" role="tablist">
    <button class="px-tab" role="tab" aria-selected="true">Stats</button>
    <button class="px-tab" role="tab" aria-selected="false">Gear</button>
    <button class="px-tab" role="tab" aria-selected="false">Spells</button>
  </div>
  <div class="px-tabs-panel" role="tabpanel">STR 14 · DEX 9 · INT 17 · LUCK 3. Mostly a wizard, honestly.</div>
</div>
<div class="px-tabs--boxed" style="margin-top:8px">
  <div class="px-tabs-list" role="tablist">
    <button class="px-tab" role="tab" aria-selected="true">Boxed</button>
    <button class="px-tab" role="tab" aria-selected="false">Variant</button>
  </div>
  <div class="px-tabs-panel" role="tabpanel">Pill-style triggers for toolbars and settings pages.</div>
</div>`;

const accordionBody = `
<div class="px-accordion">
  <div class="px-accordion-item">
    <button class="px-accordion-trigger" aria-expanded="true">Controls<span class="px-accordion-indicator">▶</span></button>
    <div class="px-accordion-content">Arrow keys to move, <kbd class="px-kbd">Z</kbd> to jump, <kbd class="px-kbd">X</kbd> to attack.</div>
  </div>
  <div class="px-accordion-item">
    <button class="px-accordion-trigger" aria-expanded="false">Saving<span class="px-accordion-indicator">▶</span></button>
  </div>
  <div class="px-accordion-item">
    <button class="px-accordion-trigger" aria-expanded="false">Secrets<span class="px-accordion-indicator">▶</span></button>
  </div>
</div>`;

const tableBody = `
<div class="px-table-wrap">
  <table class="px-table px-table--striped">
    <thead><tr><th>Rank</th><th>Player</th><th>Score</th><th>Status</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>LUM</td><td>999,999</td><td><span class="px-badge px-badge--success">Online</span></td></tr>
      <tr><td>2</td><td>AAA</td><td>512,340</td><td><span class="px-badge px-badge--warning">Idle</span></td></tr>
      <tr><td>3</td><td>ZZZ</td><td>404,404</td><td><span class="px-badge px-badge--danger">Rage quit</span></td></tr>
    </tbody>
  </table>
</div>`;

const dialogBody = `
<div class="px-dialog" style="position:static; margin:0 auto;">
  <div class="px-dialog-header">
    <h2 class="px-dialog-title">Overwrite save?</h2>
    <button class="px-dialog-close" aria-label="Close">✕</button>
  </div>
  <div class="px-dialog-body">Slot 3 contains 41 hours of progress. This action cannot be undone.</div>
  <div class="px-dialog-footer">
    <button class="px-btn px-btn--ghost">Cancel</button>
    <button class="px-btn px-btn--danger">Overwrite</button>
  </div>
</div>`;

const menuBody = `
<div class="px-menu">
  <button class="px-btn px-menu-trigger" aria-haspopup="menu" aria-expanded="true">Actions ▲</button>
  <ul class="px-menu-list" role="menu" style="position:static; margin-top:8px; max-width:220px;">
    <li role="none"><button class="px-menu-item" role="menuitem">Save game</button></li>
    <li role="none"><button class="px-menu-item" role="menuitem" data-active="true">Load game</button></li>
    <li role="none"><div class="px-menu-separator" role="separator"></div><button class="px-menu-item px-menu-item--danger" role="menuitem">Quit to desktop</button></li>
  </ul>
</div>
<div style="margin-top:16px">
  <span class="px-tooltip-wrap">
    <button class="px-btn px-btn--ghost">Tooltip target</button>
    <span class="px-tooltip" role="tooltip" style="opacity:1">+10 charisma</span>
  </span>
</div>`;

const navBody = `
<nav aria-label="Breadcrumb">
  <ol class="px-breadcrumb">
    <li><a href="#">World 1</a></li>
    <li><a href="#">Dungeon</a></li>
    <li><span aria-current="page">Boss room</span></li>
  </ol>
</nav>
<nav class="px-pagination" aria-label="Pagination">
  <button class="px-pagination-btn" disabled>◀</button>
  <button class="px-pagination-btn">1</button>
  <span class="px-pagination-ellipsis">…</span>
  <button class="px-pagination-btn">4</button>
  <button class="px-pagination-btn" aria-current="page">5</button>
  <button class="px-pagination-btn">6</button>
  <span class="px-pagination-ellipsis">…</span>
  <button class="px-pagination-btn">12</button>
  <button class="px-pagination-btn">▶</button>
</nav>`;

const healthCells = (n) =>
  Array.from({ length: 10 }, (_, i) => `<span class="px-healthbar-cell${i < n ? " px-healthbar-cell--full" : ""}"></span>`).join("");

const gameBody = `
<div class="preview-row">
  <div class="px-score"><span class="px-score-label">Score</span><span class="px-score-value">00042350</span></div>
  <div class="px-score px-score--surface"><span class="px-score-label">Hi-score</span><span class="px-score-value">00999999</span></div>
</div>
<div class="preview-col">
  <div class="px-healthbar px-healthbar--hp" role="meter" aria-label="HP" aria-valuenow="7" aria-valuemin="0" aria-valuemax="10"><span class="px-healthbar-label">HP</span><span class="px-healthbar-cells">${healthCells(7)}</span></div>
  <div class="px-healthbar px-healthbar--mp" role="meter" aria-label="MP" aria-valuenow="4" aria-valuemin="0" aria-valuemax="10"><span class="px-healthbar-label">MP</span><span class="px-healthbar-cells">${healthCells(4)}</span></div>
  <div class="px-healthbar px-healthbar--xp" role="meter" aria-label="XP" aria-valuenow="8" aria-valuemin="0" aria-valuemax="10"><span class="px-healthbar-label">XP</span><span class="px-healthbar-cells">${healthCells(8)}</span></div>
  <div class="px-healthbar px-healthbar--hp px-healthbar--critical" role="meter" aria-label="Critical HP" aria-valuenow="2" aria-valuemin="0" aria-valuemax="10"><span class="px-healthbar-label">HP!</span><span class="px-healthbar-cells">${healthCells(2)}</span></div>
</div>`;

const progressBody = `
<div class="px-progress" role="progressbar" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"><div class="px-progress-fill" style="width:72%"></div><span class="px-progress-label">72%</span></div>
<div class="px-progress px-progress--info" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"><div class="px-progress-fill px-progress-fill--striped px-progress-fill--animated" style="width:45%"></div></div>
<div class="px-progress px-progress--success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"><div class="px-progress-fill" style="width:100%"></div></div>
<div class="preview-grid">
  <div class="px-stat"><div class="px-stat-label">Players online</div><div class="px-stat-value">1,204</div><span class="px-stat-delta px-stat-delta--up">▲ 12%</span></div>
  <div class="px-stat"><div class="px-stat-label">Crash rate</div><div class="px-stat-value">0.03%</div><span class="px-stat-delta px-stat-delta--down">▼ 8%</span></div>
</div>`;

const splashBody = (theme) => `
<div class="px-splash${theme === "terminal" ? " px-crt" : ""}">
  <h1 class="px-splash-title">Puxel</h1>
  <p class="px-splash-subtitle">A brutalist-retro UI kit with modern manners</p>
  <div class="preview-row" style="justify-content:center">
    <button class="px-btn px-btn--primary px-btn--pixel">Insert coin</button>
    <button class="px-btn">New game</button>
  </div>
  <div class="px-splash-prompt">▶ Press start</div>
</div>`;

/* ---------------------------------------------------------------- cards */

const cards = [
  { file: "foundations-themes.html", name: "Themes", group: "Foundations", subtitle: "Paper / Midnight / Arcade / Terminal", body: themesBody },
  { file: "foundations-typography.html", name: "Typography", group: "Foundations", subtitle: "Display scale, label, body, link, kbd", body: typographyBody },
  { file: "controls-buttons.html", name: "Buttons", group: "Controls", subtitle: "6 variants, 3 sizes, pixel font + corners", body: buttonsBody },
  { file: "controls-badges.html", name: "Badges", group: "Controls", subtitle: "8 variants + pixel", body: badgesBody },
  { file: "controls-avatars.html", name: "Avatars & bits", group: "Controls", subtitle: "Avatar, status, group, spinner, kbd, link", body: avatarsBody },
  { file: "forms-inputs.html", name: "Inputs", group: "Forms", subtitle: "Input, error state, select, textarea, input group", body: inputsBody },
  { file: "forms-selection.html", name: "Selection controls", group: "Forms", subtitle: "Checkbox / radio / switch / slider", body: selectionBody },
  { file: "forms-fieldset.html", name: "Fieldset", group: "Forms", subtitle: "Title-on-border sections", body: fieldsetBody },
  { file: "containers-cards.html", name: "Cards", group: "Containers", subtitle: "Header / body / footer, accent, hover", body: cardsBody },
  { file: "containers-accordion.html", name: "Accordion", group: "Containers", subtitle: "Expanded + collapsed items", body: accordionBody },
  { file: "containers-table.html", name: "Table", group: "Containers", subtitle: "Striped leaderboard with badges", body: tableBody },
  { file: "containers-dialog.html", name: "Dialog", group: "Containers", subtitle: "Native <dialog> styling", body: dialogBody },
  { file: "nav-tabs.html", name: "Tabs", group: "Navigation", subtitle: "Folder + boxed variants", body: tabsBody },
  { file: "nav-menu.html", name: "Menu & tooltip", group: "Navigation", subtitle: "Dropdown menu, tooltip", body: menuBody },
  { file: "nav-breadcrumb.html", name: "Breadcrumb & pagination", group: "Navigation", body: navBody },
  { file: "feedback-alerts.html", name: "Alerts", group: "Feedback", subtitle: "Info / success / warning / danger", body: alertsBody },
  { file: "feedback-toasts.html", name: "Toasts", group: "Feedback", subtitle: "4 variants", body: toastsBody },
  { file: "game-hud.html", name: "Score & health bars", group: "Game HUD", subtitle: "Arcade score, HP/MP/XP cells, critical blink", body: gameBody },
  { file: "game-progress.html", name: "Progress & stats", group: "Game HUD", subtitle: "Bars, striped/animated, stat cards", body: progressBody },
  { file: "splash-paper.html", name: "Splash — Paper", group: "Themes", theme: "paper", body: splashBody("paper") },
  { file: "splash-midnight.html", name: "Splash — Midnight", group: "Themes", theme: "midnight", body: splashBody("midnight") },
  { file: "splash-arcade.html", name: "Splash — Arcade", group: "Themes", theme: "arcade", body: splashBody("arcade") },
  { file: "splash-terminal.html", name: "Splash — Terminal", group: "Themes", theme: "terminal", body: splashBody("terminal") },
];

const outDir = join(root, "previews");
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
for (const card of cards) {
  writeFileSync(join(outDir, card.file), page(card));
}
console.log(`Built ${cards.length} preview cards in previews/`);
