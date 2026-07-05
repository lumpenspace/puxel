import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Playground } from "./Playground";
import { DocsPage } from "./docs/DocsPage";
import { spriteAsset } from "./publicAsset";
import {
  Accordion,
  AccordionItem,
  Alert,
  AreaMap,
  type AreaMapTile,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  Button,
  type ButtonVariant,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  CharacterCard,
  Chat,
  ChatAction,
  ChatComposer,
  ChatMessage,
  ChatSeparator,
  Checkbox,
  Dial,
  Dialog,
  Field,
  Fieldset,
  Figure,
  GlobalAnimation,
  type GlobalAnimationTone,
  type GlobalAnimationVariant,
  HealthBar,
  Highlight,
  Icon,
  ICON_NAMES,
  Input,
  InputAddon,
  InputGroup,
  Kbd,
  Menu,
  Pagination,
  PixelShader,
  PlayerProfile,
  Popover,
  Progress,
  Radio,
  RpgCard,
  type RpgCardTone,
  type RpgStatBar,
  Score,
  Select,
  Separator,
  Slider,
  SpriteAvatar,
  Spinner,
  Stat,
  Switch,
  Tab,
  TabPanel,
  Table,
  Tabs,
  TabsList,
  Textarea,
  ThemeProvider,
  ThemeSwitcher,
  type ThemeName,
  ToastProvider,
  Tooltip,
  useToast,
} from "./components";

function Section({
  title,
  wide,
  children,
}: {
  title: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={wide ? "px-showcase-section px-showcase-wide" : "px-showcase-section"}
    >
      <div className="px-section-titlebar">
        <Icon name="angle-right" size={18} className="px-section-chevron" />
        <h2 className="px-display px-display--md">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Row({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 14,
        alignItems: "center",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ---- Spotlight: a composed game table ------------------------------------
   Character cards, chat, dial and health bars wired to one scripted match.
   "Next move" steps the script; every component reacts to the same state. */

type CastKey = "scarlet" | "cobalt" | "llama";

const CAST: Record<
  CastKey,
  {
    name: string;
    role: string;
    model: string;
    tone: "default" | "danger" | "info";
    chatTone?: "danger" | "info";
    sheet: string;
    style: CSSProperties;
  }
> = {
  scarlet: {
    name: "SCARLET",
    role: "Game master",
    model: "✳ claude-opus-4",
    tone: "danger",
    chatTone: "danger",
    sheet: "claude",
    style: {},
  },
  cobalt: {
    name: "COBALT",
    role: "Guesser",
    model: "◆ glm-4.6",
    tone: "info",
    chatTone: "info",
    sheet: "glm",
    style: {},
  },
  llama: {
    name: "LLAMA",
    role: "Guesser",
    model: "⬡ llama-4",
    tone: "default",
    sheet: "llama",
    style: { "--px-sprite-seat": "0.66" } as CSSProperties,
  },
};

type TableEvent = {
  kind: "sep" | "host" | "msg" | "action";
  speaker?: CastKey;
  tone?: "danger" | "info" | "accent";
  tag?: string;
  text: string;
  red?: number;
  blue?: number;
  turn?: number;
};

const TABLE_SCRIPT: TableEvent[] = [
  { kind: "sep", tone: "danger", text: "Red · Turn 7", turn: 7 },
  { kind: "host", text: 'The clue is "WATER" for 2.' },
  { kind: "msg", speaker: "scarlet", text: "OCEAN and RIVER both fit — RIVER first, it's safer." },
  { kind: "action", tone: "danger", tag: "PROPOSE", speaker: "scarlet", text: "RIVER" },
  { kind: "action", tone: "danger", tag: "CONFIRM", speaker: "llama", text: "agrees" },
  { kind: "host", text: "RIVER is a red word! 3 to go.", red: 3 },
  { kind: "msg", speaker: "llama", text: "Called it. OCEAN next, same clue." },
  { kind: "action", tone: "accent", tag: "CLOCK", text: "30 seconds left" },
  { kind: "msg", speaker: "cobalt", text: "Careful — the assassin might be BANK." },
  { kind: "action", tone: "danger", tag: "PROPOSE", speaker: "scarlet", text: "OCEAN" },
  { kind: "host", text: "OCEAN is… a blue word. Turn over.", blue: 3 },
  { kind: "sep", tone: "info", text: "Blue · Turn 8", turn: 8 },
  { kind: "msg", speaker: "cobalt", text: "Thanks for the free guess. CURRENT, obviously." },
  { kind: "action", tone: "info", tag: "PROPOSE", speaker: "cobalt", text: "CURRENT" },
  { kind: "host", text: "CURRENT is blue. It's 3–2.", blue: 2 },
];

const TABLE_START = 3;
const GLOBAL_ANIMATION_OPTIONS: Array<{
  variant: GlobalAnimationVariant;
  label: string;
  tone: GlobalAnimationTone;
  buttonVariant: ButtonVariant;
}> = [
  { variant: "confetti", label: "Confetti", tone: "accent", buttonVariant: "primary" },
  { variant: "burst", label: "Burst", tone: "danger", buttonVariant: "danger" },
  { variant: "sparkles", label: "Sparkles", tone: "info", buttonVariant: "default" },
  { variant: "coin-rain", label: "Coin rain", tone: "warning", buttonVariant: "secondary" },
  { variant: "scanline", label: "Scanline", tone: "success", buttonVariant: "success" },
];
const FOURTH_OF_JULY_THEME: ThemeName = "arcade";
const FOURTH_OF_JULY_THEME_INDEX = 2;
const FOURTH_OF_JULY_UNTIL = Date.parse("2026-07-06T04:05:00.000Z");
const FOURTH_OF_JULY_MARQUEE = "happy fourth of july (:";
const FOURTH_OF_JULY_MARQUEE_REPEATS = [0, 1, 2, 3, 4, 5] as const;
const GITHUB_URL = "https://github.com/lumpenspace/puxel";
const NPM_URL = "https://www.npmjs.com/package/puxel";

const HERO_RPG_CARDS = [
  {
    key: "scarlet",
    title: "Ranger",
    level: 18,
    tone: "success",
    hp: { value: 48, max: 48, valueLabel: "48/48" },
    exp: { value: 66, max: 100, tone: "success" },
  },
  {
    key: "cobalt",
    title: "Mage",
    level: 16,
    tone: "info",
    hp: { value: 36, max: 36, valueLabel: "36/36" },
    exp: { value: 52, max: 100, tone: "info" },
  },
  {
    key: "llama",
    title: "Knight",
    level: 20,
    tone: "warning",
    hp: { value: 60, max: 60, valueLabel: "60/60" },
    exp: { value: 74, max: 100, tone: "accent" },
  },
] satisfies ReadonlyArray<{
  key: CastKey;
  title: string;
  level: number;
  tone: RpgCardTone;
  hp: RpgStatBar;
  exp: RpgStatBar;
}>;

type HeroAvatarSample = {
  id: string;
  name: string;
  role: string;
  model: string;
  sheet: string;
  state?: string;
  style?: CSSProperties;
};

const HERO_AVATAR_SAMPLES = [
  {
    id: "deepseek",
    name: "DeepSeek",
    role: "Reasoner",
    model: "◇ deepseek-r1",
    sheet: "deepseek",
    state: "talking",
    style: {
      "--px-sprite-face-zoom": "1.45",
      "--px-sprite-face-y": "46%",
      "--px-sprite-seat": "0.8",
    } as CSSProperties,
  },
  {
    id: "gemini",
    name: "Gemini",
    role: "Analyst",
    model: "✦ gemini-2.5",
    sheet: "gemini",
    style: { "--px-sprite-face-zoom": "1.7", "--px-sprite-face-y": "34%" } as CSSProperties,
  },
  { id: "gpt", name: "GPT", role: "Planner", model: "● gpt-5", sheet: "gpt" },
  { id: "grok", name: "Grok", role: "Scout", model: "✕ grok-4", sheet: "grok" },
  { id: "kimi", name: "Kimi", role: "Archivist", model: "☾ kimi-k2", sheet: "kimi" },
  { id: "laguna", name: "Laguna", role: "Navigator", model: "≈ laguna", sheet: "laguna" },
  { id: "mistral", name: "Mistral", role: "Striker", model: "△ mistral-large", sheet: "mistral" },
  { id: "qwen", name: "Qwen", role: "Tactician", model: "⬢ qwen3", sheet: "qwen" },
] satisfies readonly HeroAvatarSample[];
const MINI_MAP_TILES = [
  "wall",
  "path",
  "path",
  "wall",
  "path",
  "coin",
  "path",
  "wall",
  "wall",
  "path",
  "wall",
  "path",
  "path",
  "path",
  "path",
  "path",
  "coin",
  "path",
  "wall",
  "path",
  "path",
  "wall",
  "path",
  "path",
  "wall",
  "path",
  "coin",
  "path",
] satisfies readonly AreaMapTile[];

function tableSprite(key: CastKey, state: string, mode: "full" | "face", size: number, className?: string) {
  const c = CAST[key];
  return (
    <SpriteAvatar
      sheetUrl={spriteAsset(c.sheet)}
      state={state}
      mode={mode}
      className={className}
      style={{ "--px-sprite-size": `${size}px`, ...c.style } as CSSProperties}
    />
  );
}

function sampleSprite(sample: HeroAvatarSample, size: number, className?: string) {
  return (
    <SpriteAvatar
      sheetUrl={spriteAsset(sample.sheet)}
      state={sample.state ?? "idle"}
      mode="face"
      className={className}
      style={{ "--px-sprite-size": `${size}px`, ...sample.style } as CSSProperties}
    />
  );
}

function GameTable() {
  const [step, setStep] = useState(TABLE_START);
  const [auto, setAuto] = useState(false);
  const done = step >= TABLE_SCRIPT.length;
  const visible = TABLE_SCRIPT.slice(0, step);

  useEffect(() => {
    if (!auto || done) return;
    const t = setInterval(() => setStep((s) => Math.min(TABLE_SCRIPT.length, s + 1)), 1500);
    return () => clearInterval(t);
  }, [auto, done]);

  const last = <K extends "red" | "blue" | "turn">(k: K, fallback: number) => {
    for (let i = visible.length - 1; i >= 0; i--) {
      const v = visible[i][k];
      if (v != null) return v;
    }
    return fallback;
  };
  const red = last("red", 4);
  const blue = last("blue", 4);
  const turn = last("turn", 7);
  const turnTone = [...visible].reverse().find((e) => e.kind === "sep")?.tone === "info" ? "info" : "danger";

  const talking = [...visible].reverse().find((e) => e.speaker && e.kind !== "sep")?.speaker;
  const nextEvent = TABLE_SCRIPT[step];
  const thinking = nextEvent?.kind === "msg" ? nextEvent.speaker : undefined;

  const castState = (key: CastKey): "idle" | "talking" | "thinking" =>
    key === talking ? "talking" : key === thinking ? "thinking" : "idle";

  return (
    <div className="px-game-table">
      <div className="px-game-table-roster">
        {(Object.keys(CAST) as CastKey[]).map((key) => (
          <CharacterCard
            key={key}
            tone={CAST[key].tone}
            state={castState(key)}
            avatar={tableSprite(key, castState(key), "full", 54)}
            name={CAST[key].name}
            role={CAST[key].role}
            model={CAST[key].model}
            status={
              castState(key) === "talking"
                ? "speaking"
                : castState(key) === "thinking"
                  ? "thinking…"
                  : " "
            }
          />
        ))}
      </div>

      <div className="px-game-table-controls">
        <div className="px-game-table-vitals">
          <div className="px-game-table-team-bars">
            <HealthBar kind="hp" label="RED" value={red} max={4} cells={4} />
            <HealthBar kind="mp" label="BLUE" value={blue} max={4} cells={4} />
          </div>
          <Dial value={turn} max={10} tone={turnTone}>
            <span style={{ fontFamily: "var(--px-font-display)", fontSize: 8, color: "var(--px-ink-muted)" }}>
              Turn
            </span>
            <span style={{ fontFamily: "var(--px-font-display)", fontSize: 30 }}>{turn}</span>
          </Dial>
        </div>
        <div className="px-game-table-actions">
          <Button
            variant="primary"
            pixel
            onClick={() => setStep((s) => (done ? TABLE_START : s + 1))}
          >
            {done ? "Rematch" : "Next move"}
          </Button>
          <Switch label="Auto-play" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
        </div>
      </div>

      <Chat
        title="Table talk"
        scrollKey={step}
        className="px-game-table-chat"
      >
        {visible.map((e, i) => {
          if (e.kind === "sep")
            return (
              <ChatSeparator key={i} tone={e.tone}>
                {e.text}
              </ChatSeparator>
            );
          if (e.kind === "host")
            return (
              <ChatMessage key={i} host>
                {e.text}
              </ChatMessage>
            );
          if (e.kind === "action")
            return (
              <ChatAction key={i} tag={e.tag ?? ""} tone={e.tone}>
                {e.speaker ? (
                  <>
                    <b>{CAST[e.speaker].name}</b> {e.text}
                  </>
                ) : (
                  e.text
                )}
              </ChatAction>
            );
          return (
            <ChatMessage
              key={i}
              tone={e.speaker ? CAST[e.speaker].chatTone : undefined}
              name={e.speaker ? CAST[e.speaker].name : undefined}
              avatar={e.speaker ? tableSprite(e.speaker, "idle", "face", 30) : undefined}
            >
              {e.text}
            </ChatMessage>
          );
        })}
      </Chat>
    </div>
  );
}

function GameHud({
  score,
  hp,
  onHit,
  onHeal,
}: {
  score: number;
  hp: number;
  onHit: () => void;
  onHeal: () => void;
}) {
  return (
    <div className="px-game-hud" aria-label="Game HUD">
      <div className="px-game-hud-top">
        <Score label="Score" value={score} className="px-game-hud-score" />
        <Score label="Hi-score" value={999999} surface className="px-game-hud-score" />
        <div className="px-game-hud-bars">
          <HealthBar kind="hp" value={hp} max={10} />
          <HealthBar kind="mp" value={4} max={10} />
          <HealthBar kind="xp" value={8} max={10} />
        </div>
        <div className="px-game-hud-actions">
          <Button size="sm" variant="danger" onClick={onHit}>
            Take hit
          </Button>
          <Button size="sm" variant="success" onClick={onHeal}>
            Heal
          </Button>
        </div>
      </div>

      <div className="px-game-hud-progress">
        <Progress value={72} showLabel label="Loading" />
        <Progress value={45} striped animated variant="info" label="Downloading" />
      </div>

      <div className="px-game-hud-stats">
        <Stat label="Players online" value="1,204" delta="12%" direction="up" />
        <Stat label="Crash rate" value="0.03%" delta="8%" direction="down" />
        <Stat label="Coins collected" value="88,412" delta="31%" direction="up" />
      </div>

      <div className="px-game-hud-dials">
        <div className="px-game-hud-dial">
          <Dial value={7} max={10} tone="danger">
            <span style={{ fontFamily: "var(--px-font-display)", fontSize: 8, color: "var(--px-ink-muted)" }}>
              Turn
            </span>
            <span style={{ fontFamily: "var(--px-font-display)", fontSize: 30 }}>07</span>
          </Dial>
        </div>
        <div className="px-game-hud-dial">
          <Dial value={4} max={10} tone="info">
            <span style={{ fontFamily: "var(--px-font-display)", fontSize: 30 }}>12</span>
          </Dial>
        </div>
        <div className="px-game-hud-dial">
          <Dial value={2} max={10} tone="accent" size="sm">
            <span style={{ fontFamily: "var(--px-font-display)", fontSize: 22, color: "var(--px-accent-2)" }}>3</span>
          </Dial>
        </div>
        <div className="px-game-hud-dial">
          <Dial value={10} max={10} tone="success" size="lg">
            <span style={{ fontFamily: "var(--px-font-display)", fontSize: 34 }}>99</span>
          </Dial>
        </div>
      </div>
    </div>
  );
}

function HeroPreview({
  score,
  hp,
  onChatSend,
}: {
  score: number;
  hp: number;
  onChatSend: (message: string) => void;
}) {
  return (
    <aside className="px-hero-preview" aria-label="Puxel component preview">
      <div className="px-hero-preview-grid">
        <div className="px-preview-party" aria-label="Party roster">
          {HERO_RPG_CARDS.map((member) => (
            <RpgCard
              key={member.key}
              title={member.title}
              tone={member.tone}
              level={member.level}
              hp={member.hp}
              exp={member.exp}
              avatar={tableSprite(member.key, member.key === "cobalt" ? "thinking" : "idle", "full", 54)}
            />
          ))}
        </div>

        <Chat
          title="Chat"
          className="px-preview-chat"
          footer={<ChatComposer placeholder="Type a message..." onSend={onChatSend} />}
        >
          <ChatMessage
            tone="danger"
            name="Scarlet"
            avatar={tableSprite("scarlet", "idle", "face", 30)}
          >
            Ready when you are.
          </ChatMessage>
          <ChatMessage
            tone="info"
            name="Cobalt"
            avatar={tableSprite("cobalt", "idle", "face", 30)}
          >
            Take the left path.
          </ChatMessage>
          <ChatAction tag="SYSTEM" tone="accent">
            You obtained 32 gold.
          </ChatAction>
        </Chat>

        <PlayerProfile
          compact
          className="px-preview-player"
          title="Player 1"
          avatar={tableSprite("llama", "idle", "face", 42)}
          hp={{ value: hp * 4, max: 40, valueLabel: `${hp * 4}/40` }}
          mp={{ value: 18, max: 18, valueLabel: "18/18" }}
          xp={{ value: 462, max: 1000, valueLabel: "462/1000" }}
        />

        <Score label="Score" value={score} digits={6} surface className="px-preview-score" />

        <div className="px-preview-area">
          <AreaMap label="Area" detail="Mines" tiles={MINI_MAP_TILES} columns={7} size="sm" aria-label="Area mines map" />
        </div>

        <div className="px-preview-sprites" aria-label="Sprite samples">
          {HERO_AVATAR_SAMPLES.map((sample) => (
            <Popover
              key={sample.id}
              className="px-preview-sprite-trigger"
              aria-label={`${sample.name} avatar details`}
              content={
                <div className="px-popover">
                  <div className="px-popover-title">{sample.name}</div>
                  <div className="px-popover-head">
                    {sampleSprite(sample, 44)}
                    <div style={{ fontWeight: 800, color: "var(--px-accent-2)" }}>{sample.role}</div>
                  </div>
                  <div className="px-popover-meta">{sample.model}</div>
                  <div className="px-popover-stats">
                    <b>sheet</b>
                    <span>{sample.sheet}.png</span>
                    <b>state</b>
                    <span>{sample.state ?? "idle"}</span>
                  </div>
                </div>
              }
            >
              {sampleSprite(sample, 64, "px-preview-sprite-avatar")}
            </Popover>
          ))}
        </div>
      </div>
    </aside>
  );
}

function Showcase() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(3);
  const [hp, setHp] = useState(7);
  const [score, setScore] = useState(42350);
  const [volume, setVolume] = useState(60);
  const [mode, setMode] = useState<"home" | "playground" | "docs">("home");
  const [splashDissolved, setSplashDissolved] = useState(false);
  const [globalAnimation, setGlobalAnimation] = useState<{
    id: number;
    variant: GlobalAnimationVariant;
    tone: GlobalAnimationTone;
  } | null>(null);
  const [fourthMarqueeId, setFourthMarqueeId] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroFade, setHeroFade] = useState(0);

  useEffect(() => {
    if (mode !== "home") return;
    const onScroll = () => {
      const h = heroRef.current;
      if (!h) return;
      setHeroFade(Math.min(1, Math.max(0, window.scrollY / h.offsetHeight)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode]);

  useEffect(() => {
    if (fourthMarqueeId == null) return undefined;
    const timeout = window.setTimeout(() => setFourthMarqueeId(null), 7200);
    return () => window.clearTimeout(timeout);
  }, [fourthMarqueeId]);

  const triggerFourthOfJuly = useCallback((theme: ThemeName, index: number) => {
    if (
      theme !== FOURTH_OF_JULY_THEME ||
      index !== FOURTH_OF_JULY_THEME_INDEX ||
      Date.now() > FOURTH_OF_JULY_UNTIL
    ) {
      return;
    }

    setGlobalAnimation((current) => ({
      id: (current?.id ?? 0) + 1,
      variant: "confetti",
      tone: "warning",
    }));
    setFourthMarqueeId((current) => (current ?? 0) + 1);
  }, []);

  const header = (
    <header className="px-site-header">
      <button
        type="button"
        className="px-site-logo px-display px-display--lg"
        onClick={() => setMode("home")}
      >
        Puxel<span style={{ color: "var(--px-accent-2)" }}>_</span>
      </button>
      <div className="px-site-actions">
        <div className="px-site-nav" aria-label="Primary navigation">
          <Button
            size="sm"
            variant={mode === "home" ? "primary" : "default"}
            onClick={() => setMode("home")}
          >
            Home
          </Button>
          <Button
            size="sm"
            variant={mode === "playground" ? "primary" : "default"}
            onClick={() => setMode("playground")}
          >
            Playground
          </Button>
          <Button
            size="sm"
            variant={mode === "docs" ? "primary" : "default"}
            onClick={() => setMode("docs")}
          >
            Docs
          </Button>
        </div>
        <div className="px-site-right">
          <nav className="px-site-links" aria-label="Project links">
            <a
              className="px-btn px-btn--sm px-btn--icon px-site-link"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
              title="GitHub"
            >
              <Icon name="github" />
            </a>
            <a
              className="px-btn px-btn--sm px-btn--icon px-site-link"
              href={NPM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="npm package"
              title="npm"
            >
              <Icon name="npm" />
            </a>
          </nav>
          <ThemeSwitcher className="px-site-themes" onThemeSelect={triggerFourthOfJuly} />
        </div>
      </div>
    </header>
  );

  return (
    <main
      style={{
        maxWidth: mode === "home" ? 1280 : 1200,
        margin: "0 auto",
        padding: mode === "home" ? "0 20px 96px" : "32px 20px 96px",
      }}
    >
      {globalAnimation && (
        <GlobalAnimation
          key={globalAnimation.id}
          variant={globalAnimation.variant}
          tone={globalAnimation.tone}
          seed={globalAnimation.id}
          onComplete={() => setGlobalAnimation(null)}
        />
      )}
      {fourthMarqueeId != null && (
        <div
          key={`fourth-${fourthMarqueeId}`}
          className="px-fourth-marquee"
          role="status"
          aria-label={FOURTH_OF_JULY_MARQUEE}
        >
          <div className="px-fourth-marquee-track">
            {FOURTH_OF_JULY_MARQUEE_REPEATS.map((i) => (
              <span key={i}>{FOURTH_OF_JULY_MARQUEE}</span>
            ))}
          </div>
        </div>
      )}

      {mode === "home" ? (
        <div ref={heroRef} className="px-hero-zone">
          <PixelShader
            dissolved={splashDissolved}
            // re-materialize once the dissolve finishes
            onDissolveEnd={(gone) => gone && setSplashDissolved(false)}
            style={{ opacity: (1 - heroFade) * 0.18 }}
          />
          <div className="px-hero-inner">
            {header}
            <section className="px-home-hero" aria-labelledby="puxel-hero-title">
              <div className="px-home-copy">
                <h1 id="puxel-hero-title" className="px-home-title">
                  Puxel
                </h1>
                <ThemeSwitcher className="px-hero-themes" label={null} onThemeSelect={triggerFourthOfJuly} />
                <p className="px-home-subtitle">
                  A <Highlight>brutalist-retro</Highlight> UI kit with modern manners
                </p>
                <div className="px-home-actions">
                  <Button
                    variant="primary"
                    pixel
                    pixelated
                    onClick={() => {
                      setScore((s) => s + 150);
                      toast("+150 credits", { variant: "success" });
                    }}
                  >
                    Insert coin
                  </Button>
                  <Button
                    pixel
                    onClick={() => {
                      setSplashDissolved(true);
                      toast("Welcome, player one!", { variant: "success" });
                    }}
                  >
                    New game
                  </Button>
                </div>
                <div className="px-press-start" aria-hidden="true">
                  <span className="px-press-start-line" />
                  <Icon name="heart-solid" size={30} className="px-press-start-heart" />
                  <span className="px-press-start-line" />
                </div>
                <div className="px-press-start-label">Press start</div>
              </div>
              <HeroPreview
                score={score}
                hp={hp}
                onChatSend={(message) => toast(`Sent: ${message}`, { variant: "success" })}
              />
            </section>
          </div>
        </div>
      ) : (
        header
      )}

      {mode === "playground" ? (
        <div className="px-page-body">
          <Playground />
        </div>
      ) : mode === "docs" ? (
        <div className="px-page-body">
          <DocsPage />
        </div>
      ) : (
        <>
          <div className="px-showcase-grid">
            <Section title="Table + HUD" wide>
              <p className="px-muted" style={{ margin: 0, maxWidth: 640 }}>
                Everything below is one scripted match: character cards, chat
                feed, turn dial, team bars and HUD now live in one joined block. Step
                through it — or flip auto-play.
              </p>
              <div className="px-game-showcase">
                <GameTable />
                <GameHud
                  score={score}
                  hp={hp}
                  onHit={() => setHp((h) => Math.max(0, h - 1))}
                  onHeal={() => setHp((h) => Math.min(10, h + 1))}
                />
              </div>
            </Section>

            <Section title="Global animations" wide>
              <p className="px-muted" style={{ margin: 0, maxWidth: 720 }}>
                Full-screen pixel celebration overlays for wins, unlocks, alerts,
                coin drops and terminal-style transitions.
              </p>
              <Row>
                {GLOBAL_ANIMATION_OPTIONS.map((effect) => (
                  <Button
                    key={effect.variant}
                    variant={effect.buttonVariant}
                    pixel
                    onClick={() =>
                      setGlobalAnimation((current) => ({
                        id: (current?.id ?? 0) + 1,
                        variant: effect.variant,
                        tone: effect.tone,
                      }))
                    }
                  >
                    {effect.label}
                  </Button>
                ))}
              </Row>
            </Section>

          <Section title="Characters & sprites">
            <Row>
              <SpriteAvatar sheetUrl={spriteAsset("claude")} state="idle" mode="full" style={{ "--px-sprite-size": "72px" } as CSSProperties} />
              <SpriteAvatar
                sheetUrl={spriteAsset("deepseek")}
                state="talking"
                mode="full"
                style={{ "--px-sprite-size": "72px", "--px-sprite-seat": "0.8", "--px-sprite-scale": "1.05" } as CSSProperties}
              />
              <SpriteAvatar sheetUrl={spriteAsset("glm")} state="thinking" mode="full" flip style={{ "--px-sprite-size": "72px" } as CSSProperties} />
              <SpriteAvatar sheetUrl={spriteAsset("claude")} state="idle" mode="face" style={{ "--px-sprite-size": "56px" } as CSSProperties} />
              <SpriteAvatar sheetUrl={spriteAsset("llama")} state="idle" mode="face" style={{ "--px-sprite-size": "56px" } as CSSProperties} />
            </Row>
            <Row>
              <Popover
                content={
                  <div className="px-popover">
                    <div className="px-popover-title">Scarlet</div>
                    <div className="px-popover-head">
                      <SpriteAvatar sheetUrl={spriteAsset("claude")} state="idle" mode="face" style={{ "--px-sprite-size": "44px" } as CSSProperties} />
                      <div style={{ fontWeight: 800, color: "var(--px-danger)" }}>RED · Game master</div>
                    </div>
                    <div className="px-popover-meta">✳ claude-opus-4</div>
                  </div>
                }
              >
                <CharacterCard
                  tone="danger"
                  avatar={<SpriteAvatar sheetUrl={spriteAsset("claude")} state="idle" mode="full" style={{ "--px-sprite-size": "54px" } as CSSProperties} />}
                  name="SCARLET"
                  role="Game master"
                  model="✳ claude-opus-4"
                  status="hover me"
                />
              </Popover>
              <CharacterCard
                tone="info"
                state="thinking"
                avatar={<SpriteAvatar sheetUrl={spriteAsset("glm")} state="thinking" mode="full" style={{ "--px-sprite-size": "54px" } as CSSProperties} />}
                name="COBALT"
                role="Guesser"
                model="◆ glm-4.6"
                status="thinking…"
              />
              <CharacterCard
                avatar={<SpriteAvatar sheetUrl={spriteAsset("llama")} state="idle" mode="full" style={{ "--px-sprite-size": "54px" } as CSSProperties} />}
                name="LLAMA"
                role="Guesser"
                model="⬡ llama-4"
              />
            </Row>
          </Section>

          <Section title="Chat">
            <div style={{ maxWidth: 360 }}>
              <Chat title="Table talk" onClose={() => {}} style={{ height: 360 }}>
                <ChatMessage host>The clue is "water" for 2.</ChatMessage>
                <ChatSeparator tone="danger">Red · Turn 7</ChatSeparator>
                <ChatMessage
                  tone="danger"
                  name="Claude"
                  avatar={<SpriteAvatar sheetUrl={spriteAsset("deepseek")} state="idle" mode="face" style={{ "--px-sprite-size": "30px", "--px-sprite-seat": "0.8" } as CSSProperties} />}
                >
                  OCEAN and RIVER both fit — I'd start with RIVER.
                </ChatMessage>
                <ChatAction tag="PROPOSE" tone="danger">
                  <b>Claude</b> RIVER
                </ChatAction>
                <ChatAction tag="CONFIRM" tone="danger">
                  <b>Llama</b> agrees
                </ChatAction>
                <ChatAction tag="CLOCK" tone="accent">
                  30s left
                </ChatAction>
                <ChatSeparator tone="info">Blue · Turn 8</ChatSeparator>
                <ChatMessage
                  tone="info"
                  name="Cobalt"
                  avatar={<SpriteAvatar sheetUrl={spriteAsset("glm")} state="idle" mode="face" style={{ "--px-sprite-size": "30px" } as CSSProperties} />}
                >
                  Careful — the assassin might be BANK.
                </ChatMessage>
              </Chat>
            </div>
          </Section>

          <Section title="Icons">
            <Row style={{ fontSize: 26, color: "var(--px-ink)" }}>
              {ICON_NAMES.map((n) => (
                <Icon key={n} name={n} title={n} />
              ))}
            </Row>
            <Row>
              <Button variant="primary">
                <Icon name="play" /> Play
              </Button>
              <Button>
                <Icon name="cog" /> Settings
              </Button>
              <Button icon aria-label="Close">
                <Icon name="times" />
              </Button>
            </Row>
          </Section>

          <Section title="Buttons">
            <Row>
              <Button>Default</Button>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="success">Success</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
              <Button disabled>Disabled</Button>
            </Row>
            <Row>
              <Button size="sm">Small</Button>
              <Button>Medium</Button>
              <Button size="lg">Large</Button>
              <Button variant="primary" pixel>
                Pixel font
              </Button>
              <Button variant="primary" pixelated>
                Pixel corners
              </Button>
              <Button icon aria-label="Settings">
                ⚙
              </Button>
            </Row>
          </Section>

          <Section title="Badges">
            <Row>
              <Badge>Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="primary" pixel>
                LVL 99
              </Badge>
            </Row>
          </Section>

          <Section title="Dialog">
            <Row>
              <Button variant="primary" onClick={() => setDialogOpen(true)}>
                Open dialog
              </Button>
            </Row>
            <Dialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              title="Overwrite save?"
              footer={
                <>
                  <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setDialogOpen(false);
                      toast("Save overwritten", { variant: "warning" });
                    }}
                  >
                    Overwrite
                  </Button>
                </>
              }
            >
              Slot 3 contains 41 hours of progress. This action cannot be
              undone.
            </Dialog>
          </Section>

          <Section title="Feedback">
            <div style={{ display: "grid", gap: 12 }}>
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
            <Row>
              <Button onClick={() => toast("Checkpoint reached")}>Toast</Button>
              <Button
                variant="success"
                onClick={() => toast("Item crafted!", { variant: "success" })}
              >
                Success toast
              </Button>
              <Button
                variant="danger"
                onClick={() => toast("You died.", { variant: "danger" })}
              >
                Danger toast
              </Button>
              <Spinner />
              <Spinner size="lg" />
              <Tooltip content="+10 charisma">
                <Button variant="ghost">Hover for tooltip</Button>
              </Tooltip>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </Row>
          </Section>

          <Section title="Navigation">
            <Breadcrumb
              items={[
                { label: "World 1", href: "#" },
                { label: "Dungeon", href: "#" },
                { label: "Boss room" },
              ]}
            />
            <Tabs defaultValue="stats">
              <TabsList>
                <Tab value="stats">Stats</Tab>
                <Tab value="gear">Gear</Tab>
                <Tab value="spells">Spells</Tab>
              </TabsList>
              <TabPanel value="stats">
                STR 14 · DEX 9 · INT 17 · LUCK 3. Mostly a wizard, honestly.
              </TabPanel>
              <TabPanel value="gear">
                Rusty sword, wooden buckler, and a suspiciously heavy backpack.
              </TabPanel>
              <TabPanel value="spells">
                Fireball, Blink, and Summon Coffee (channelled, 4s cast).
              </TabPanel>
            </Tabs>
            <Row>
              <Menu
                label="Actions"
                items={[
                  { label: "Save game", onSelect: () => toast("Game saved") },
                  { label: "Load game", onSelect: () => toast("Game loaded") },
                  {
                    label: "Quit to desktop",
                    danger: true,
                    separator: true,
                    onSelect: () => toast("Bye!", { variant: "danger" }),
                  },
                ]}
              />
              <Pagination page={page} pageCount={12} onPageChange={setPage} />
            </Row>
            <Accordion defaultOpen={["controls"]}>
              <AccordionItem value="controls" title="Controls">
                Arrow keys to move, <Kbd>Z</Kbd> to jump, <Kbd>X</Kbd> to
                attack. Tabs and menus are fully keyboard-navigable.
              </AccordionItem>
              <AccordionItem value="saving" title="Saving">
                Progress autosaves at every checkpoint. Manual saves live in the
                pause menu.
              </AccordionItem>
              <AccordionItem value="secrets" title="Secrets">
                There is a warp zone behind the third waterfall. You didn't hear
                it from us.
              </AccordionItem>
            </Accordion>
          </Section>

          <Section title="Forms" wide>
            <Fieldset title="Player setup" accent shadow>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 18,
                }}
              >
                <Field label="Player name" hint="Shown on the leaderboard">
                  {(p) => <Input {...p} placeholder="AAA" />}
                </Field>
                <Field label="Guild" error="This guild name is taken">
                  {(p) => (
                    <Input {...p} error placeholder="The Pixel Pushers" />
                  )}
                </Field>
                <Field label="Class">
                  {(p) => (
                    <Select {...p} defaultValue="mage">
                      <option value="knight">Knight</option>
                      <option value="mage">Mage</option>
                      <option value="rogue">Rogue</option>
                    </Select>
                  )}
                </Field>
                <Field label="Bio">
                  {(p) => (
                    <Textarea {...p} placeholder="A mysterious adventurer…" />
                  )}
                </Field>
              </div>
              <Separator dashed />
              <Row>
                <Checkbox label="Enable sound" defaultChecked />
                <Checkbox label="Hard mode" />
                <Radio name="diff" label="Casual" defaultChecked />
                <Radio name="diff" label="Ranked" />
                <Switch label="CRT filter" />
              </Row>
              <Separator dashed />
              <Row>
                <span className="px-label">Volume {volume}</span>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <Slider
                    value={volume}
                    min={0}
                    max={100}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    aria-label="Volume"
                  />
                </div>
              </Row>
              <Separator dashed />
              <InputGroup>
                <InputAddon>@</InputAddon>
                <Input placeholder="username" aria-label="Username" />
                <Button variant="primary">Claim</Button>
              </InputGroup>
            </Fieldset>

            <Fieldset title="Arcade cabinet" accent shadow className="px-arcade">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 18,
                }}
              >
                <Field label="Enter initials" hint="Three letters, immortalized">
                  {(p) => (
                    <Input {...p} placeholder="AAA" maxLength={3} style={{ textAlign: "center" }} />
                  )}
                </Field>
                <Field label="Ship">
                  {(p) => (
                    <Select {...p} defaultValue="falcon">
                      <option value="falcon">Falcon</option>
                      <option value="viper">Viper</option>
                      <option value="tortoise">Tortoise</option>
                    </Select>
                  )}
                </Field>
              </div>
              <Separator dashed />
              <Row>
                <Radio name="players" label="1P" defaultChecked />
                <Radio name="players" label="2P" />
                <Checkbox label="Turbo" defaultChecked />
                <Switch label="CRT" defaultChecked />
              </Row>
              <Separator dashed />
              <Row>
                <Button variant="primary" pixel>
                  Insert coin
                </Button>
                <span className="px-muted" style={{ fontSize: 12 }}>
                  One <code>.px-arcade</code> class on the fieldset flips every
                  control; each also takes an <code>arcade</code> prop. Selects
                  get styled dropdown options, and text fields a block caret.
                </span>
              </Row>
            </Fieldset>
          </Section>

          <Section title="Cards" wide>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              <Card>
                <CardHeader accent>
                  <CardTitle>Quest log</CardTitle>
                  <Badge variant="secondary">3 new</Badge>
                </CardHeader>
                <CardBody>
                  Defeat the Deadline Dragon before Friday. Reward: 500 XP and a
                  long weekend.
                </CardBody>
                <CardFooter>
                  <Button size="sm" variant="primary">
                    Accept
                  </Button>
                  <Button size="sm" variant="ghost">
                    Later
                  </Button>
                </CardFooter>
              </Card>
              <Card hoverable>
                <CardHeader>
                  <CardTitle>Hover me</CardTitle>
                </CardHeader>
                <CardBody>
                  This card lifts on hover — use it for clickable list items and
                  links.
                  <div style={{ marginTop: 12 }}>
                    <AvatarGroup>
                      <Avatar initials="P1" />
                      <Avatar initials="P2" status="online" />
                      <Avatar initials="P3" status="busy" />
                    </AvatarGroup>
                  </div>
                </CardBody>
              </Card>
              <Card pixelated hoverable>
                <CardHeader accent>
                  <CardTitle>Pixelated + hoverable</CardTitle>
                </CardHeader>
                <CardBody>
                  Stepped corners, with a shadow that survives the clip.
                </CardBody>
              </Card>
              <Card round>
                <CardHeader>
                  <CardTitle>Round</CardTitle>
                </CardHeader>
                <CardBody>
                  Pixel-rounded frame: every outer pixel is the border colour,
                  and content isn't clipped.
                </CardBody>
              </Card>
            </div>
          </Section>

          <Section title="Figure" wide>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 20,
              }}
            >
              <Figure
                src="https://picsum.photos/seed/puxel1/480/320"
                alt="Random placeholder landscape"
                caption="Below caption"
              />
              <Figure
                src="https://picsum.photos/seed/puxel2/480/320"
                alt="Random placeholder landscape"
                caption="Above caption"
                captionPosition="above"
                pixelated
              />
              <Figure
                src="https://picsum.photos/seed/puxel3/480/320"
                alt="Random placeholder landscape"
                caption="Staggered — hover to dissipate"
                captionPosition="staggered"
                pixelated
                dither
              />
            </div>
          </Section>

          <Section title="Table" wide>
            <Table striped hover>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>LUM</td>
                  <td>999,999</td>
                  <td>
                    <Badge variant="success">Online</Badge>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>AAA</td>
                  <td>512,340</td>
                  <td>
                    <Badge variant="warning">Idle</Badge>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>ZZZ</td>
                  <td>404,404</td>
                  <td>
                    <Badge variant="danger">Rage quit</Badge>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Section>
          </div>
        </>
      )}
    </main>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Showcase />
      </ToastProvider>
    </ThemeProvider>
  );
}
