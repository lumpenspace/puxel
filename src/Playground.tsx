import { useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import "./styles/playground.css";
import {
  Avatar,
  AvatarGroup,
  Badge,
  type BadgeVariant,
  Button,
  type ButtonSize,
  type ButtonVariant,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  CharacterCard,
  type CharacterCardState,
  type CharacterCardTone,
  Chat,
  ChatAction,
  ChatMessage,
  ChatSeparator,
  type ChatTone,
  Checkbox,
  Dial,
  type DialTone,
  HealthBar,
  PixelShader,
  type PixelShaderPattern,
  Progress,
  type ProgressVariant,
  Radio,
  Score,
  SpriteAvatar,
  Field,
  Fieldset,
  Figure,
  type FigureCaptionPosition,
  Input,
  Select,
  Slider,
  Spinner,
  Switch,
  Tab,
  TabPanel,
  Tabs,
  TabsList,
  Textarea,
  VideoPlayer,
} from "./components";

/* ---- shared chrome: stage + control panel ------------------------------ */

function Stage({ children, bare }: { children: ReactNode; bare?: boolean }) {
  return (
    <section className={bare ? "px-playground-stage px-playground-stage--bare" : "px-playground-stage"}>
      <div className="px-playground-stage-body">{children}</div>
    </section>
  );
}

function Controls({ children }: { children: ReactNode }) {
  return (
    <div className="px-playground-controls">
      <div className="px-playground-controls-body">{children}</div>
    </div>
  );
}

function ControlRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span className="px-label">{label}</span>
      {children}
    </div>
  );
}

function ShowcaseSection({
  title,
  controls,
  children,
  footer,
}: {
  title: ReactNode;
  controls: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Fieldset title={title} shadow>
      <div className="px-showcase-section-grid">
        <div className="px-showcase-section-controls">
          <div className="px-showcase-section-controls-body">{controls}</div>
        </div>
        <div className="px-showcase-section-target">
          <div className="px-showcase-section-target-body">{children}</div>
        </div>
      </div>
      {footer}
    </Fieldset>
  );
}

function Playfield({ children }: { children: ReactNode }) {
  return <div className="px-playground-playfield">{children}</div>;
}

const BUTTON_VARIANTS: ButtonVariant[] = [
  "default",
  "primary",
  "secondary",
  "success",
  "danger",
  "ghost",
];
const BUTTON_SIZES: ButtonSize[] = ["sm", "md", "lg"];
const BADGE_VARIANTS: BadgeVariant[] = [
  "default",
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
  "outline",
];

/* ---- Sprites (sprite avatar, character card, dial) ------------------------ */

const SHEETS = ["claude", "deepseek", "gemini", "glm", "gpt", "grok", "kimi", "laguna", "llama", "mistral", "qwen"];
const SPRITE_STATES = ["idle", "talking", "thinking", "correct", "victory", "loss"];
// per-sheet placement (the puxel showcase has no .lab-* CSS, so set the knobs inline)
const SHEET_STYLE: Record<string, CSSProperties> = {
  claude: {},
  deepseek: {
    "--px-sprite-seat": "0.8",
    "--px-sprite-scale": "1.05",
    "--px-sprite-face-zoom": "1.7",
    "--px-sprite-face-y": "34%",
  } as CSSProperties,
  glm: {},
  llama: { "--px-sprite-seat": "0.66" } as CSSProperties,
};

function SpritesPanel() {
  const [sheet, setSheet] = useState("claude");
  const [state, setState] = useState("idle");
  const [mode, setMode] = useState<"full" | "face">("full");
  const [flip, setFlip] = useState(false);
  const [tone, setTone] = useState<CharacterCardTone>("danger");
  const [ccState, setCcState] = useState<CharacterCardState>("talking");
  const [dialValue, setDialValue] = useState(6);
  const [dialTone, setDialTone] = useState<DialTone>("danger");

  const spriteStyle = {
    "--px-sprite-size": mode === "full" ? "84px" : "60px",
    ...SHEET_STYLE[sheet],
  } as CSSProperties;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <Fieldset title="Sprite avatar" shadow>
        <Playfield>
          <Stage bare>
            <SpriteAvatar sheetUrl={`/sprites/${sheet}.png`} state={state} mode={mode} flip={flip} style={spriteStyle} />
          </Stage>
          <Controls>
            <ControlRow label="Sheet">
              <Select value={sheet} onChange={(e) => setSheet(e.target.value)}>
                {SHEETS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </ControlRow>
            <ControlRow label="State">
              <Select value={state} onChange={(e) => setState(e.target.value)}>
                {SPRITE_STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </ControlRow>
            <ControlRow label="Mode">
              <Select value={mode} onChange={(e) => setMode(e.target.value as "full" | "face")}>
                <option value="full">full</option>
                <option value="face">face</option>
              </Select>
            </ControlRow>
            <Checkbox label="Flip (mirror)" checked={flip} onChange={(e) => setFlip(e.target.checked)} />
            <p className="px-muted" style={{ fontSize: 12, margin: 0 }}>
              Sheets are the codenames LLM art; per-sheet placement uses the --px-sprite-* vars.
            </p>
          </Controls>
        </Playfield>
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 20,
            paddingTop: 20,
            borderTop: "1px solid var(--px-border, rgba(0,0,0,0.1))",
          }}
        >
          {SHEETS.map((s) => (
            <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <SpriteAvatar
                sheetUrl={`/sprites/${s}.png`}
                state={state}
                mode={mode}
                flip={flip}
                style={{ "--px-sprite-size": mode === "full" ? "84px" : "60px", ...SHEET_STYLE[s] } as CSSProperties}
              />
              <span className="px-muted" style={{ fontSize: 11 }}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </Fieldset>

      <Fieldset title="Character card" shadow>
        <Playfield>
          <Stage bare>
            <CharacterCard
              tone={tone}
              state={ccState}
              avatar={
                <SpriteAvatar
                  sheetUrl={`/sprites/${sheet}.png`}
                  state={ccState}
                  mode="full"
                  style={{ "--px-sprite-size": "54px", ...SHEET_STYLE[sheet] } as CSSProperties}
                />
              }
              name="SCARLET"
              role="Guesser"
              model={`◆ ${sheet}-model`}
              status={ccState === "thinking" ? "thinking…" : ccState === "talking" ? "speaking" : " "}
            />
          </Stage>
          <Controls>
            <ControlRow label="Tone">
              <Select value={tone} onChange={(e) => setTone(e.target.value as CharacterCardTone)}>
                <option value="default">default</option>
                <option value="danger">danger</option>
                <option value="info">info</option>
                <option value="accent">accent</option>
              </Select>
            </ControlRow>
            <ControlRow label="State">
              <Select value={ccState} onChange={(e) => setCcState(e.target.value as CharacterCardState)}>
                <option value="idle">idle</option>
                <option value="talking">talking</option>
                <option value="thinking">thinking</option>
              </Select>
            </ControlRow>
          </Controls>
        </Playfield>
      </Fieldset>

      <Fieldset title="Dial" shadow>
        <Playfield>
          <Stage>
            <Dial value={dialValue} max={10} tone={dialTone}>
              <span style={{ fontFamily: "var(--px-font-display)", fontSize: 8, color: "var(--px-ink-muted)" }}>Turn</span>
              <span style={{ fontFamily: "var(--px-font-display)", fontSize: 30 }}>{dialValue}</span>
            </Dial>
          </Stage>
          <Controls>
            <ControlRow label={`Value: ${dialValue} / 10`}>
              <Slider min={0} max={10} value={dialValue} onChange={(e) => setDialValue(Number(e.target.value))} />
            </ControlRow>
            <ControlRow label="Tone">
              <Select value={dialTone} onChange={(e) => setDialTone(e.target.value as DialTone)}>
                <option value="default">default</option>
                <option value="danger">danger</option>
                <option value="info">info</option>
                <option value="accent">accent</option>
                <option value="success">success</option>
              </Select>
            </ControlRow>
          </Controls>
        </Playfield>
      </Fieldset>
    </div>
  );
}

/* ---- Chat (interactive feed builder) -------------------------------------- */

type SpeakerKey = "scarlet" | "cobalt" | "llama";

const SPEAKERS: Record<
  SpeakerKey,
  { name: string; tone: ChatTone; sheet: string; model: string; role: string }
> = {
  scarlet: { name: "Scarlet", tone: "danger", sheet: "claude", model: "✳ claude-opus-4", role: "Game master" },
  cobalt: { name: "Cobalt", tone: "info", sheet: "glm", model: "◆ glm-4.6", role: "Guesser" },
  llama: { name: "Llama", tone: "accent", sheet: "llama", model: "⬡ llama-4", role: "Guesser" },
};

type ChatEntry =
  | { id: number; kind: "msg"; speaker: SpeakerKey; text: string }
  | { id: number; kind: "action"; speaker: SpeakerKey; tag: string; text: string }
  | { id: number; kind: "sep"; tone: ChatTone; text: string }
  | { id: number; kind: "host"; text: string };

// distributive Omit — plain Omit over the union would collapse it to the common keys
type NewChatEntry = ChatEntry extends infer E ? (E extends ChatEntry ? Omit<E, "id"> : never) : never;

const CHAT_SEED: ChatEntry[] = [
  { id: -3, kind: "host", text: 'The clue is "water" for 2.' },
  { id: -2, kind: "sep", tone: "danger", text: "Red · Turn 7" },
  { id: -1, kind: "msg", speaker: "scarlet", text: "OCEAN and RIVER both fit — I'd start with RIVER." },
];

function chatAvatar(speaker: SpeakerKey, size: number) {
  const s = SPEAKERS[speaker];
  return (
    <SpriteAvatar
      sheetUrl={`/sprites/${s.sheet}.png`}
      state="idle"
      mode="face"
      style={{ "--px-sprite-size": `${size}px`, ...SHEET_STYLE[s.sheet] } as CSSProperties}
    />
  );
}

function ChatPanel() {
  const [entries, setEntries] = useState<ChatEntry[]>(CHAT_SEED);
  const [speaker, setSpeaker] = useState<SpeakerKey>("cobalt");
  const [draft, setDraft] = useState("");
  const [tag, setTag] = useState("PROPOSE");
  const [talking, setTalking] = useState(false);
  const [turn, setTurn] = useState(8);
  const nextId = useRef(0);
  const talkTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const push = (entry: NewChatEntry) =>
    setEntries((es) => [...es, { ...entry, id: nextId.current++ } as ChatEntry]);

  const speak = () => {
    setTalking(true);
    clearTimeout(talkTimer.current);
    talkTimer.current = setTimeout(() => setTalking(false), 1800);
  };

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    push({ kind: "msg", speaker, text: draft.trim() });
    setDraft("");
    speak();
  };

  const current = SPEAKERS[speaker];
  const cardState: CharacterCardState = talking ? "talking" : draft ? "thinking" : "idle";

  return (
    <ShowcaseSection
      title="Table talk"
      controls={
        <>
          <ControlRow label="Speaker">
            <Select value={speaker} onChange={(e) => setSpeaker(e.target.value as SpeakerKey)}>
              {(Object.keys(SPEAKERS) as SpeakerKey[]).map((k) => (
                <option key={k} value={k}>
                  {SPEAKERS[k].name} · {SPEAKERS[k].tone}
                </option>
              ))}
            </Select>
          </ControlRow>
          <form onSubmit={send} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span className="px-label">Message</span>
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type, then Enter"
            />
            <Button type="submit" variant="primary" size="sm" disabled={!draft.trim()}>
              Send
            </Button>
          </form>
          <ControlRow label="Action chip">
            <div style={{ display: "flex", gap: 8 }}>
              <Select value={tag} onChange={(e) => setTag(e.target.value)} style={{ flex: 1 }}>
                <option>PROPOSE</option>
                <option>CONFIRM</option>
                <option>VETO</option>
                <option>CLOCK</option>
              </Select>
              <Button
                size="sm"
                onClick={() => {
                  push({ kind: "action", speaker, tag, text: draft.trim() || "RIVER" });
                  setDraft("");
                }}
              >
                Add
              </Button>
            </div>
          </ControlRow>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button
              size="sm"
              onClick={() => {
                push({
                  kind: "sep",
                  tone: current.tone,
                  text: `${current.tone === "info" ? "Blue" : current.tone === "danger" ? "Red" : "Gold"} · Turn ${turn}`,
                });
                setTurn((t) => t + 1);
              }}
            >
              Turn break
            </Button>
            <Button size="sm" onClick={() => push({ kind: "host", text: draft.trim() || "The host raises an eyebrow." })}>
              Host line
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEntries(CHAT_SEED)}>
              Reset
            </Button>
          </div>
          <p className="px-muted" style={{ fontSize: 12, margin: 0 }}>
            The sprite thinks while you type and talks when you send. The feed
            auto-scrolls via <code>scrollKey</code>.
          </p>
        </>
      }
    >
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }}>
            <CharacterCard
              tone={current.tone === "accent" ? "default" : current.tone}
              state={cardState}
              avatar={
                <SpriteAvatar
                  sheetUrl={`/sprites/${current.sheet}.png`}
                  state={cardState}
                  mode="full"
                  style={{ "--px-sprite-size": "54px", ...SHEET_STYLE[current.sheet] } as CSSProperties}
                />
              }
              name={current.name.toUpperCase()}
              role={current.role}
              model={current.model}
              status={cardState === "thinking" ? "typing…" : cardState === "talking" ? "speaking" : " "}
            />
            <Chat title="Table talk" scrollKey={entries.length} style={{ width: 340, height: 380 }}>
              {entries.map((entry) => {
                switch (entry.kind) {
                  case "host":
                    return (
                      <ChatMessage key={entry.id} host>
                        {entry.text}
                      </ChatMessage>
                    );
                  case "sep":
                    return (
                      <ChatSeparator key={entry.id} tone={entry.tone}>
                        {entry.text}
                      </ChatSeparator>
                    );
                  case "action":
                    return (
                      <ChatAction key={entry.id} tag={entry.tag} tone={SPEAKERS[entry.speaker].tone}>
                        <b>{SPEAKERS[entry.speaker].name}</b> {entry.text}
                      </ChatAction>
                    );
                  default:
                    return (
                      <ChatMessage
                        key={entry.id}
                        tone={SPEAKERS[entry.speaker].tone}
                        name={SPEAKERS[entry.speaker].name}
                        avatar={chatAvatar(entry.speaker, 30)}
                      >
                        {entry.text}
                      </ChatMessage>
                    );
                }
              })}
            </Chat>
      </div>
    </ShowcaseSection>
  );
}

/* ---- Game HUD (score, bars, dial, progress) -------------------------------- */

function HudPanel() {
  const [hp, setHp] = useState(7);
  const [score, setScore] = useState(42350);
  const [progress, setProgress] = useState(64);
  const [striped, setStriped] = useState(true);
  const [animated, setAnimated] = useState(true);
  const [variant, setVariant] = useState<ProgressVariant>("default");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <Fieldset title="Vitals" shadow>
        <Playfield>
          <Stage>
            <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <HealthBar kind="hp" value={hp} max={10} />
                <HealthBar kind="mp" value={4} max={10} />
                <HealthBar kind="xp" value={8} max={10} />
              </div>
              <Dial value={hp} max={10} tone={hp <= 3 ? "danger" : "success"}>
                <span style={{ fontFamily: "var(--px-font-display)", fontSize: 8, color: "var(--px-ink-muted)" }}>HP</span>
                <span style={{ fontFamily: "var(--px-font-display)", fontSize: 30 }}>{hp}</span>
              </Dial>
            </div>
          </Stage>
          <Controls>
            <ControlRow label={`HP: ${hp} / 10`}>
              <Slider min={0} max={10} value={hp} onChange={(e) => setHp(Number(e.target.value))} />
            </ControlRow>
            <div style={{ display: "flex", gap: 8 }}>
              <Button size="sm" variant="danger" onClick={() => setHp((h) => Math.max(0, h - 1))}>
                Take hit
              </Button>
              <Button size="sm" variant="success" onClick={() => setHp((h) => Math.min(10, h + 1))}>
                Heal
              </Button>
            </div>
            <p className="px-muted" style={{ fontSize: 12, margin: 0 }}>
              Drop HP to 2 or less — the remaining cells blink and the dial goes
              red.
            </p>
          </Controls>
        </Playfield>
      </Fieldset>

      <Fieldset title="Score &amp; progress" shadow>
        <Playfield>
          <Stage>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 300 }}>
              <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
                <Score label="Score" value={score} />
                <Score label="Hi-score" value={999999} surface />
              </div>
              <Progress
                value={progress}
                striped={striped}
                animated={animated}
                variant={variant}
                showLabel
                label="Loading"
              />
            </div>
          </Stage>
          <Controls>
            <div style={{ display: "flex", gap: 8 }}>
              <Button size="sm" variant="primary" onClick={() => setScore((s) => s + 150)}>
                +150
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setScore(0)}>
                Reset
              </Button>
            </div>
            <ControlRow label={`Progress: ${progress}%`}>
              <Slider min={0} max={100} value={progress} onChange={(e) => setProgress(Number(e.target.value))} />
            </ControlRow>
            <ControlRow label="Variant">
              <Select value={variant} onChange={(e) => setVariant(e.target.value as ProgressVariant)}>
                <option value="default">default</option>
                <option value="success">success</option>
                <option value="danger">danger</option>
                <option value="info">info</option>
              </Select>
            </ControlRow>
            <Checkbox label="Striped" checked={striped} onChange={(e) => setStriped(e.target.checked)} />
            <Checkbox label="Animated" checked={animated} onChange={(e) => setAnimated(e.target.checked)} />
          </Controls>
        </Playfield>
      </Fieldset>
    </div>
  );
}

/* ---- Shader (hero background field) ---------------------------------------- */

function ShaderPanel() {
  const [pattern, setPattern] = useState<PixelShaderPattern>("plasma");
  const [cellSize, setCellSize] = useState(6);
  const [speed, setSpeed] = useState(4); // quarters — /4 below
  const [vivid, setVivid] = useState(false);
  const [dissolved, setDissolved] = useState(false);
  const [crt, setCrt] = useState(false);

  return (
    <Fieldset title="Pixel shader" shadow>
      <Playfield>
        <Stage bare>
          <div
            className={crt ? "px-crt" : undefined}
            style={{
              position: "relative",
              width: 400,
              maxWidth: "100%",
              height: 250,
              background: "var(--px-bg)",
              border: "var(--px-border-w) solid var(--px-border-color)",
              boxShadow: "var(--px-shadow)",
              overflow: "hidden",
            }}
          >
            <PixelShader
              pattern={pattern}
              cell={cellSize}
              speed={speed / 4}
              colors={vivid ? ["--px-surface-2", "--px-info", "--px-accent", "--px-accent-2"] : undefined}
              dissolved={dissolved}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="px-display px-display--lg" style={{ textShadow: "3px 3px 0 var(--px-bg)" }}>
                Hero
              </span>
            </div>
          </div>
        </Stage>
        <Controls>
          <ControlRow label="Pattern">
            <Select value={pattern} onChange={(e) => setPattern(e.target.value as PixelShaderPattern)}>
              <option value="plasma">plasma</option>
              <option value="ripple">ripple</option>
              <option value="waves">waves</option>
            </Select>
          </ControlRow>
          <ControlRow label={`Cell: ${cellSize}px`}>
            <Slider min={2} max={16} value={cellSize} onChange={(e) => setCellSize(Number(e.target.value))} />
          </ControlRow>
          <ControlRow label={`Speed: ${(speed / 4).toFixed(2)}×`}>
            <Slider min={1} max={12} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
          </ControlRow>
          <Checkbox label="Vivid palette" checked={vivid} onChange={(e) => setVivid(e.target.checked)} />
          <Checkbox label="CRT overlay" checked={crt} onChange={(e) => setCrt(e.target.checked)} />
          <Switch label="Dissolved" checked={dissolved} onChange={(e) => setDissolved(e.target.checked)} />
          <p className="px-muted" style={{ fontSize: 12, margin: 0 }}>
            A WebGL field quantized to theme colors with Bayer dithering. It
            fills any positioned container; the dissolve removes cells in the
            dither pattern. Switch the theme — the palette follows.
          </p>
        </Controls>
      </Playfield>
    </Fieldset>
  );
}

/* ---- Primitives ---------------------------------------------------------- */

function PrimitivesPanel() {
  const [variant, setVariant] = useState<ButtonVariant>("primary");
  const [size, setSize] = useState<ButtonSize>("md");
  const [label, setLabel] = useState("Click me");
  const [pixel, setPixel] = useState(false);
  const [pixelated, setPixelated] = useState(true);
  const [icon, setIcon] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [badgeVariant, setBadgeVariant] = useState<BadgeVariant>("primary");
  const [badgePixel, setBadgePixel] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <Fieldset title="Button" shadow>
        <Playfield>
          <Stage>
            <Button
              variant={variant}
              size={size}
              pixel={pixel}
              pixelated={pixelated}
              icon={icon}
              disabled={disabled}
              aria-label={icon ? "Settings" : undefined}
            >
              {icon ? "⚙" : label}
            </Button>
          </Stage>
          <Controls>
            <ControlRow label="Label">
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                disabled={icon}
              />
            </ControlRow>
            <ControlRow label="Variant">
              <Select
                value={variant}
                onChange={(e) => setVariant(e.target.value as ButtonVariant)}
              >
                {BUTTON_VARIANTS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </Select>
            </ControlRow>
            <ControlRow label="Size">
              <Select
                value={size}
                onChange={(e) => setSize(e.target.value as ButtonSize)}
              >
                {BUTTON_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </ControlRow>
            <Checkbox
              label="Pixel font"
              checked={pixel}
              onChange={(e) => setPixel(e.target.checked)}
            />
            <Checkbox
              label="Pixel corners"
              checked={pixelated}
              onChange={(e) => setPixelated(e.target.checked)}
            />
            <Checkbox
              label="Icon-only"
              checked={icon}
              onChange={(e) => setIcon(e.target.checked)}
            />
            <Checkbox
              label="Disabled"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            />
          </Controls>
        </Playfield>
      </Fieldset>

      <Fieldset title="Badge" shadow>
        <Playfield>
          <Stage>
            <Badge variant={badgeVariant} pixel={badgePixel}>
              {badgeVariant}
            </Badge>
          </Stage>
          <Controls>
            <ControlRow label="Variant">
              <Select
                value={badgeVariant}
                onChange={(e) =>
                  setBadgeVariant(e.target.value as BadgeVariant)
                }
              >
                {BADGE_VARIANTS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </Select>
            </ControlRow>
            <Checkbox
              label="Pixel font"
              checked={badgePixel}
              onChange={(e) => setBadgePixel(e.target.checked)}
            />
          </Controls>
        </Playfield>
      </Fieldset>

      <Fieldset title="Avatar &amp; Spinner" shadow>
        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
            padding: "8px 4px",
          }}
        >
          <Avatar initials="P1" />
          <Avatar initials="P2" status="online" />
          <AvatarGroup>
            <Avatar initials="A" />
            <Avatar initials="B" />
            <Avatar initials="C" />
          </AvatarGroup>
          <Spinner />
        </div>
      </Fieldset>
    </div>
  );
}

/* ---- Cards ---------------------------------------------------------------- */

function CardsPanel() {
  const [flat, setFlat] = useState(false);
  const [hoverable, setHoverable] = useState(true);
  const [pixelated, setPixelated] = useState(false);
  const [round, setRound] = useState(true);
  const [headerAccent, setHeaderAccent] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [title, setTitle] = useState("Quest log");
  const [body, setBody] = useState("Defeat the Deadline Dragon before Friday.");

  return (
    <ShowcaseSection
      title="Card"
      controls={
        <>
          <ControlRow label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </ControlRow>
          <ControlRow label="Body">
            <Textarea
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </ControlRow>
          <Checkbox
            label="Flat (no shadow)"
            checked={flat}
            onChange={(e) => setFlat(e.target.checked)}
          />
          <Checkbox
            label="Hoverable (lifts)"
            checked={hoverable}
            onChange={(e) => setHoverable(e.target.checked)}
          />
          <Checkbox
            label="Pixel corners (clip)"
            checked={pixelated}
            onChange={(e) => setPixelated(e.target.checked)}
          />
          <Checkbox
            label="Round (pixel frame)"
            checked={round}
            onChange={(e) => setRound(e.target.checked)}
          />
          <Checkbox
            label="Accent header"
            checked={headerAccent}
            onChange={(e) => setHeaderAccent(e.target.checked)}
          />
          <Checkbox
            label="Show footer"
            checked={showFooter}
            onChange={(e) => setShowFooter(e.target.checked)}
          />
          <p className="px-muted" style={{ fontSize: 12, margin: 0 }}>
            The footer always sticks to the card's bottom edge — try toggling it
            with a short vs. long body.
          </p>
        </>
      }
    >
        <div style={{ width: 300 }}>
          <Card flat={flat} hoverable={hoverable} pixelated={pixelated} round={round}>
            <CardHeader accent={headerAccent}>
              <CardTitle>{title}</CardTitle>
              <Badge variant="secondary">NEW</Badge>
            </CardHeader>
            <CardBody>{body}</CardBody>
            {showFooter && (
              <CardFooter>
                <Button size="sm" variant="primary">
                  Accept
                </Button>
                <Button size="sm" variant="ghost">
                  Later
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
    </ShowcaseSection>
  );
}

/* ---- Forms ---------------------------------------------------------------- */

function FormsPanel() {
  const [arcade, setArcade] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [volume, setVolume] = useState(60);

  return (
    <ShowcaseSection
      title="Forms"
      controls={
        <>
          <Switch
            label="Arcade variant"
            checked={arcade}
            onChange={(e) => setArcade(e.target.checked)}
          />
          <Checkbox
            label="Disabled"
            checked={disabled}
            onChange={(e) => setDisabled(e.target.checked)}
          />
          <Checkbox
            label="Error state"
            checked={error}
            onChange={(e) => setError(e.target.checked)}
          />
          <p className="px-muted" style={{ fontSize: 12, margin: 0 }}>
            Arcade mode here uses the <code>.px-arcade</code> scope class; each
            control also takes an <code>arcade</code> prop. Open the class select
            — the dropdown options are styled too (blinking ▶ on the pick, in
            browsers with customizable selects). And mind the cursor.
          </p>
        </>
      }
    >
        <div
          className={arcade ? "px-arcade" : undefined}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: 320,
          }}
        >
          <Field
            label="Player name"
            error={error ? "This field is required" : undefined}
          >
            {(p) => (
              <Input
                {...p}
                placeholder="AAA"
                maxLength={arcade ? 12 : undefined}
                disabled={disabled}
                error={error}
              />
            )}
          </Field>
          <Field label="Class">
            {(p) => (
              <Select {...p} disabled={disabled} defaultValue="mage">
                <option value="mage">Mage</option>
                <option value="warrior">Warrior</option>
                <option value="rogue">Rogue</option>
                <option value="bard">Bard</option>
              </Select>
            )}
          </Field>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span className="px-label">Difficulty</span>
            <Radio name="pg-diff" label="Casual" defaultChecked disabled={disabled} />
            <Radio name="pg-diff" label="Ranked" disabled={disabled} />
            <Radio name="pg-diff" label="Nightmare" disabled={disabled} />
          </div>
          <Checkbox label="Hard mode" disabled={disabled} defaultChecked />
          <Switch label="CRT filter" disabled={disabled} defaultChecked />
          <div>
            <span className="px-label">Volume {volume}</span>
            <Slider
              min={0}
              max={100}
              value={volume}
              disabled={disabled}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </div>
          <Field label="Bio">
            {(p) => <Textarea {...p} rows={2} disabled={disabled} placeholder="A mysterious adventurer…" />}
          </Field>
        </div>
    </ShowcaseSection>
  );
}

/* ---- Media (Figure) -------------------------------------------------------- */

const FIGURE_SOURCES = [
  { label: "Canyon", value: "https://picsum.photos/seed/puxel1/560/380" },
  { label: "Coastline", value: "https://picsum.photos/seed/puxel2/560/380" },
  { label: "Street", value: "https://picsum.photos/seed/puxel3/560/380" },
];
const EXAMPLE_VIDEO_SRC = "/jingle.mov";

function MediaPanel() {
  const [src, setSrc] = useState(FIGURE_SOURCES[0].value);
  const [caption, setCaption] = useState("Hover to dissipate");
  const [captionPosition, setCaptionPosition] =
    useState<FigureCaptionPosition>("staggered");
  const [pixelated, setPixelated] = useState(true);
  const [dither, setDither] = useState(true);
  const [ditherCell, setDitherCell] = useState(4);

  return (
    <ShowcaseSection
      title="Media"
      controls={
        <>
          <ControlRow label="Image">
            <Select value={src} onChange={(e) => setSrc(e.target.value)}>
              {FIGURE_SOURCES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </ControlRow>
          <ControlRow label="Caption">
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="(none)"
            />
          </ControlRow>
          <ControlRow label="Caption position">
            <Select
              value={captionPosition}
              onChange={(e) =>
                setCaptionPosition(e.target.value as FigureCaptionPosition)
              }
            >
              <option value="below">below</option>
              <option value="above">above</option>
              <option value="staggered">staggered</option>
            </Select>
          </ControlRow>
          <Checkbox
            label="Pixel corners"
            checked={pixelated}
            onChange={(e) => setPixelated(e.target.checked)}
          />
          <Checkbox
            label="Dither on hover"
            checked={dither}
            onChange={(e) => setDither(e.target.checked)}
          />
          <ControlRow label={`Dither cell (${ditherCell}px)`}>
            <Slider
              min={2}
              max={12}
              value={ditherCell}
              disabled={!dither}
              onChange={(e) => setDitherCell(Number(e.target.value))}
            />
          </ControlRow>
        </>
      }
    >
        <div style={{ display: "grid", gap: 18, width: "min(100%, 640px)" }}>
          <Figure
            src={src}
            alt="Playground preview"
            caption={caption || undefined}
            captionPosition={captionPosition}
            pixelated={pixelated}
            dither={dither}
            ditherCell={ditherCell}
            style={{ width: 340, maxWidth: "100%" }}
          />
          <VideoPlayer
            src={EXAMPLE_VIDEO_SRC}
            poster="/jingle-poster.jpg"
            label="Jingle demo"
            caption="Local QuickTime sample"
            aspectRatio="4 / 3"
            pixelated={pixelated}
          />
        </div>
    </ShowcaseSection>
  );
}

/* ---- Playground shell ------------------------------------------------------ */

export function Playground() {
  return (
    <Tabs defaultValue="chat" boxed className="px-playground">
      <TabsList aria-orientation="vertical" className="px-playground-tabs">
        <Tab value="chat">Chat</Tab>
        <Tab value="sprites">Sprites</Tab>
        <Tab value="hud">Game HUD</Tab>
        <Tab value="shader">Shader</Tab>
        <Tab value="forms">Forms</Tab>
        <Tab value="primitives">Primitives</Tab>
        <Tab value="cards">Cards</Tab>
        <Tab value="media">Media</Tab>
      </TabsList>
      <div className="px-playground-content">
        <TabPanel value="chat">
          <ChatPanel />
        </TabPanel>
        <TabPanel value="sprites">
          <SpritesPanel />
        </TabPanel>
        <TabPanel value="hud">
          <HudPanel />
        </TabPanel>
        <TabPanel value="shader">
          <ShaderPanel />
        </TabPanel>
        <TabPanel value="forms">
          <FormsPanel />
        </TabPanel>
        <TabPanel value="primitives">
          <PrimitivesPanel />
        </TabPanel>
        <TabPanel value="cards">
          <CardsPanel />
        </TabPanel>
        <TabPanel value="media">
          <MediaPanel />
        </TabPanel>
      </div>
    </Tabs>
  );
}
