import { useState, type ComponentType, type CSSProperties } from "react";
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
  DialogFooter,
  Field,
  Fieldset,
  Figure,
  GlobalAnimation,
  type GlobalAnimationTone,
  type GlobalAnimationVariant,
  GradientBg,
  HealthBar,
  Highlight,
  Icon,
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
  Score,
  Select,
  Separator,
  Slider,
  Spinner,
  Splash,
  SpriteAvatar,
  Stat,
  Switch,
  Tab,
  TabPanel,
  Table,
  Tabs,
  TabsList,
  Textarea,
  ThemeSwitcher,
  Tooltip,
  useToast,
  VideoPlayer,
} from "../components";
import { publicAsset, spriteAsset } from "../publicAsset";

export interface DocEntry {
  /** Stable id, used in the URL-less selection state and as the React key. */
  key: string;
  title: string;
  category: string;
  /** Prop tables to render, in order — looked up in props.generated.json. */
  components: string[];
  summary: string;
  code: string;
  Example: ComponentType;
  /** Skip the checkered demo backdrop — the component already renders its own
   * full border/background frame, so the backdrop would just double it up. */
  bare?: boolean;
}

export const CATEGORY_ORDER = [
  "Controls",
  "Forms",
  "Containers",
  "Navigation",
  "Feedback",
  "Game HUD",
  "Media",
  "Foundations",
  "Theming",
];

const shadowSprite = { "--px-sprite-size": "72px" } as CSSProperties;
const areaTiles = [
  "wall",
  "path",
  "path",
  "coin",
  "wall",
  "path",
  "path",
  "path",
  "start",
  "path",
  "wall",
  "path",
  "danger",
  "path",
  "wall",
  "path",
  "path",
  "path",
  "coin",
  "path",
  "wall",
  "path",
  "wall",
  "water",
  "water",
  "path",
  "goal",
  "path",
] satisfies readonly AreaMapTile[];

const globalAnimationOptions: Array<{
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

function ButtonExample() {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Button variant="primary">Save</Button>
      <Button variant="ghost">Cancel</Button>
    </div>
  );
}

function BadgeExample() {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Badge variant="success">Online</Badge>
      <Badge variant="danger">3 new</Badge>
    </div>
  );
}

function HighlightExample() {
  return (
    <p style={{ maxWidth: 460, margin: 0, fontWeight: 800, lineHeight: 1.8 }}>
      A <Highlight>brutalist-retro</Highlight> UI kit with{" "}
      <Highlight tone="warning" raised={false}>inline marks</Highlight>.
    </p>
  );
}

function AvatarExample() {
  return (
    <AvatarGroup>
      <Avatar initials="AB" status="online" />
      <Avatar initials="CD" status="away" />
      <Avatar initials="EF" />
    </AvatarGroup>
  );
}

function IconExample() {
  return (
    <div style={{ display: "flex", gap: 12, fontSize: 24 }}>
      <Icon name="play" />
      <Icon name="cog" />
    </div>
  );
}

function SpinnerExample() {
  return <Spinner label="Loading…" />;
}

function SpriteAvatarExample() {
  return <SpriteAvatar sheetUrl={spriteAsset("claude")} state="idle" mode="full" style={shadowSprite} />;
}

function FieldExample() {
  return (
    <Field label="Email" hint="We'll never share it.">
      {(fieldProps) => <Input type="email" placeholder="you@example.com" {...fieldProps} />}
    </Field>
  );
}

function InputExample() {
  return <Input placeholder="Type here…" />;
}

function SelectExample() {
  return (
    <Select defaultValue="b">
      <option value="a">Option A</option>
      <option value="b">Option B</option>
    </Select>
  );
}

function CheckboxExample() {
  const [checked, setChecked] = useState(true);
  return <Checkbox label="Hard mode" checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
}

function RadioExample() {
  const [value, setValue] = useState("a");
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <Radio name="ex" label="A" checked={value === "a"} onChange={() => setValue("a")} />
      <Radio name="ex" label="B" checked={value === "b"} onChange={() => setValue("b")} />
    </div>
  );
}

function SwitchExample() {
  const [on, setOn] = useState(true);
  return <Switch label="Sound" checked={on} onChange={(e) => setOn(e.target.checked)} />;
}

function SliderExample() {
  const [v, setV] = useState(60);
  return <Slider min={0} max={100} value={v} onChange={(e) => setV(Number(e.target.value))} />;
}

function TextareaExample() {
  return <Textarea placeholder="Leave a note…" rows={3} />;
}

function InputGroupExample() {
  return (
    <InputGroup>
      <InputAddon>https://</InputAddon>
      <Input placeholder="your-site.com" />
    </InputGroup>
  );
}

function FieldsetExample() {
  return (
    <Fieldset title="Account" shadow>
      <Field label="Username">{(fieldProps) => <Input placeholder="scarlet" {...fieldProps} />}</Field>
    </Fieldset>
  );
}

function CardExample() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, width: "100%" }}>
      <Card round compact>
        <CardHeader accent>
          <CardTitle>Quest</CardTitle>
        </CardHeader>
        <CardBody>Defeat the deadline.</CardBody>
      </Card>
      <Card tone="danger" compact hoverable>
        <CardBody>Danger card</CardBody>
      </Card>
      <Card tone="info" compact>
        <CardBody>Info card</CardBody>
      </Card>
      <Card tile>
        <Icon name="star" size={24} />
      </Card>
    </div>
  );
}

function CharacterCardExample() {
  return (
    <CharacterCard
      tone="info"
      state="talking"
      avatar={<SpriteAvatar sheetUrl={spriteAsset("claude")} state="talking" mode="full" style={{ "--px-sprite-size": "54px" } as CSSProperties} />}
      name="Scarlet"
      role="Game Master"
      model="✳ claude-opus-4"
      status="speaking"
    />
  );
}

function ChatExample() {
  const [messages, setMessages] = useState(["Ready when you are."]);
  return (
    <Chat
      title="Table talk"
      style={{ width: 360, height: 360 }}
      footer={
        <ChatComposer
          onSend={(message) => setMessages((current) => [...current, message])}
        />
      }
    >
      <ChatSeparator tone="info">Red · Turn 7</ChatSeparator>
      {messages.map((message, index) => (
        <ChatMessage key={index} name={index === 0 ? "Scarlet" : "You"} tone={index === 0 ? "danger" : "info"}>
          {message}
        </ChatMessage>
      ))}
      <ChatAction tag="SYSTEM" tone="accent">Use the composer below.</ChatAction>
    </Chat>
  );
}

function PopoverExample() {
  return (
    <Popover content="I float above the trigger.">
      <Button size="sm">Hover me</Button>
    </Popover>
  );
}

function DialogExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Overwrite save?"
        footer={
          <DialogFooter>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="danger" onClick={() => setOpen(false)}>
              Overwrite
            </Button>
          </DialogFooter>
        }
      >
        This can't be undone.
      </Dialog>
    </>
  );
}

function TableExample() {
  return (
    <Table striped hover>
      <thead>
        <tr>
          <th>Player</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Scarlet</td>
          <td>4</td>
        </tr>
        <tr>
          <td>Cobalt</td>
          <td>3</td>
        </tr>
      </tbody>
    </Table>
  );
}

function AccordionExample() {
  return (
    <Accordion defaultOpen={["rules"]} style={{ maxWidth: 360 }}>
      <AccordionItem value="rules" title="Rules">
        One clue, up to nine guesses.
      </AccordionItem>
      <AccordionItem value="scoring" title="Scoring">
        First team to clear their board wins.
      </AccordionItem>
    </Accordion>
  );
}

function TabsExample() {
  return (
    <Tabs defaultValue="chat" style={{ maxWidth: 360 }}>
      <TabsList>
        <Tab value="chat">Chat</Tab>
        <Tab value="log">Log</Tab>
      </TabsList>
      <TabPanel value="chat">Table talk goes here.</TabPanel>
      <TabPanel value="log">Move history goes here.</TabPanel>
    </Tabs>
  );
}

function MenuExample() {
  return (
    <Menu
      label="Actions"
      items={[
        { label: "Rename", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Delete", onSelect: () => {} },
      ]}
    />
  );
}

function TooltipExample() {
  return (
    <Tooltip content="Ends the current turn">
      <Button size="sm">Next move</Button>
    </Tooltip>
  );
}

function BreadcrumbExample() {
  return (
    <Breadcrumb
      items={[{ label: "Games", href: "#" }, { label: "Codenames", href: "#" }, { label: "Turn 7" }]}
    />
  );
}

function PaginationExample() {
  const [page, setPage] = useState(3);
  return <Pagination page={page} pageCount={12} onPageChange={setPage} />;
}

function AlertExample() {
  return <Alert variant="success" title="Saved">Your changes are live.</Alert>;
}

function ToastExample() {
  const { toast } = useToast();
  return (
    <Button size="sm" onClick={() => toast("Turn passed", { variant: "success" })}>
      Trigger toast
    </Button>
  );
}

function GlobalAnimationExample() {
  const [run, setRun] = useState<{
    id: number;
    variant: GlobalAnimationVariant;
    tone: GlobalAnimationTone;
  } | null>(null);

  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {globalAnimationOptions.map((effect) => (
          <Button
            key={effect.variant}
            size="sm"
            variant={effect.buttonVariant}
            onClick={() =>
              setRun((current) => ({
                id: (current?.id ?? 0) + 1,
                variant: effect.variant,
                tone: effect.tone,
              }))
            }
          >
            {effect.label}
          </Button>
        ))}
      </div>
      {run && (
        <GlobalAnimation
          key={run.id}
          variant={run.variant}
          tone={run.tone}
          seed={run.id}
          onComplete={() => setRun(null)}
        />
      )}
    </>
  );
}

function ProgressExample() {
  return <Progress value={72} showLabel label="Loading" />;
}

function HealthBarExample() {
  return <HealthBar kind="hp" value={7} max={10} label="HP" />;
}

function RpgCardExample() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 150px))", justifyContent: "center", gap: 12, width: "100%" }}>
      <RpgCard
        title="Ranger"
        tone="success"
        level={18}
        avatar={<SpriteAvatar sheetUrl={spriteAsset("claude")} state="idle" mode="full" style={{ "--px-sprite-size": "58px" } as CSSProperties} />}
        hp={{ value: 48, max: 48, valueLabel: "48/48" }}
        exp={{ value: 66, max: 100, tone: "success" }}
      />
      <RpgCard
        title="Mage"
        tone="info"
        level={16}
        avatar={<SpriteAvatar sheetUrl={spriteAsset("glm")} state="thinking" mode="full" style={{ "--px-sprite-size": "58px" } as CSSProperties} />}
        hp={{ value: 36, max: 36, valueLabel: "36/36" }}
        exp={{ value: 52, max: 100, tone: "info" }}
      />
      <RpgCard
        title="Knight"
        tone="warning"
        level={20}
        avatar={<SpriteAvatar sheetUrl={spriteAsset("llama")} state="idle" mode="full" style={{ "--px-sprite-size": "58px", "--px-sprite-seat": "0.66" } as CSSProperties} />}
        hp={{ value: 60, max: 60, valueLabel: "60/60" }}
        exp={{ value: 74, max: 100, tone: "accent" }}
      />
    </div>
  );
}

function PlayerProfileExample() {
  return (
    <PlayerProfile
      title="Player 1"
      avatar={<SpriteAvatar sheetUrl={spriteAsset("llama")} state="idle" mode="face" style={{ "--px-sprite-size": "48px", "--px-sprite-seat": "0.66" } as CSSProperties} />}
      hp={{ value: 32, max: 32, valueLabel: "32/32" }}
      mp={{ value: 18, max: 18, valueLabel: "18/18" }}
      xp={{ value: 462, max: 1000, valueLabel: "462/1000" }}
      style={{ width: 420 }}
    />
  );
}

function DialExample() {
  return <Dial value={6} max={12} tone="danger" size="md" />;
}

function AreaMapExample() {
  return <AreaMap label="Area" detail="Mines" tiles={areaTiles} columns={7} style={{ width: 260 }} />;
}

function ScoreExample() {
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <Score label="Score" value={42350} />
      <Stat label="Players online" value="1,204" delta="12%" direction="up" />
    </div>
  );
}

function SplashExample() {
  return (
    <Splash title="Puxel" subtitle="A brutalist-retro UI kit" prompt="▶ Press start">
      <Button variant="primary" pixel>
        Insert coin
      </Button>
    </Splash>
  );
}

function FigureExample() {
  return (
    <Figure
      src="https://picsum.photos/seed/puxel-docs/480/320"
      alt="Random placeholder landscape"
      caption="Below caption"
      captionPosition="below"
      pixelated
      style={{ maxWidth: 320 }}
    />
  );
}

function VideoPlayerExample() {
  return (
    <VideoPlayer
      src={publicAsset("jingle.mov")}
      poster={publicAsset("jingle-poster.jpg")}
      label="Jingle demo"
      caption="Local QuickTime sample"
      aspectRatio="4 / 3"
      pixelated
      style={{ maxWidth: 420 }}
    />
  );
}

function PixelShaderExample() {
  return (
    <div style={{ position: "relative", width: "100%", height: 160 }}>
      <PixelShader pattern="plasma" cell={6} style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}

function GradientBgExample() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 160,
        overflow: "hidden",
        border: "var(--px-border-w) solid var(--px-border-color)",
        boxShadow: "var(--px-shadow-sm)",
      }}
    >
      <GradientBg
        colors={["--px-danger", "--px-accent", "--px-info", "--px-bg"]}
        direction="down-right"
        pixelation={14}
      />
    </div>
  );
}

function KbdExample() {
  return (
    <p>
      Press <Kbd>Enter</Kbd> to send, <Kbd>Esc</Kbd> to close.
    </p>
  );
}

function SeparatorExample() {
  return (
    <div>
      <p>Above the fold</p>
      <Separator />
      <p>Below the fold</p>
    </div>
  );
}

function ThemeExample() {
  return <ThemeSwitcher />;
}

export const REGISTRY: DocEntry[] = [
  {
    key: "Button",
    title: "Button",
    category: "Controls",
    components: ["Button"],
    summary: "The default clickable control, with variant/size/pixel styling knobs.",
    code: `<Button variant="primary">Save</Button>
<Button variant="ghost">Cancel</Button>`,
    Example: ButtonExample,
  },
  {
    key: "Badge",
    title: "Badge",
    category: "Controls",
    components: ["Badge"],
    summary: "A small status/count pill.",
    code: `<Badge variant="success">Online</Badge>
<Badge variant="danger">3 new</Badge>`,
    Example: BadgeExample,
  },
  {
    key: "Highlight",
    title: "Highlight",
    category: "Controls",
    components: ["Highlight"],
    summary: "Inline marked text with a theme-aware background and optional raised shadow.",
    code: `A <Highlight>brutalist-retro</Highlight> UI kit with
<Highlight tone="warning" raised={false}>inline marks</Highlight>.`,
    Example: HighlightExample,
  },
  {
    key: "Avatar",
    title: "Avatar",
    category: "Controls",
    components: ["Avatar", "AvatarGroup"],
    summary: "A circular identity chip with a status dot; AvatarGroup overlaps a set of them.",
    code: `<AvatarGroup>
  <Avatar initials="AB" status="online" />
  <Avatar initials="CD" status="away" />
  <Avatar initials="EF" />
</AvatarGroup>`,
    Example: AvatarExample,
  },
  {
    key: "Icon",
    title: "Icon",
    category: "Controls",
    components: ["Icon"],
    summary: "Inline pixel icon from the bundled icon set.",
    code: `<Icon name="play" />
<Icon name="cog" />`,
    Example: IconExample,
  },
  {
    key: "Spinner",
    title: "Spinner",
    category: "Controls",
    components: ["Spinner"],
    summary: "A labeled loading indicator.",
    code: `<Spinner label="Loading…" />`,
    Example: SpinnerExample,
  },
  {
    key: "SpriteAvatar",
    title: "Sprite avatar",
    category: "Controls",
    components: ["SpriteAvatar"],
    summary: "Animated sprite-sheet character, driven by a state → clip map.",
    code: `const spriteUrl = import.meta.env.BASE_URL + "sprites/claude.png";

<SpriteAvatar
  sheetUrl={spriteUrl}
  state="idle"
  mode="full"
  style={{ "--px-sprite-size": "72px" }}
/>`,
    Example: SpriteAvatarExample,
    bare: true,
  },
  {
    key: "Field",
    title: "Field",
    category: "Forms",
    components: ["Field"],
    summary: "Label + hint/error wrapper for a single form control. Children is a render prop that receives the input's id/aria-* to wire up.",
    code: `<Field label="Email" hint="We'll never share it.">
  {(fieldProps) => <Input type="email" placeholder="you@example.com" {...fieldProps} />}
</Field>`,
    Example: FieldExample,
  },
  {
    key: "Input",
    title: "Input",
    category: "Forms",
    components: ["Input"],
    summary: "Text input. Also forwards standard <input> attributes.",
    code: `<Input placeholder="Type here…" />`,
    Example: InputExample,
  },
  {
    key: "Select",
    title: "Select",
    category: "Forms",
    components: ["Select"],
    summary: "Styled <select> dropdown.",
    code: `<Select defaultValue="b">
  <option value="a">Option A</option>
  <option value="b">Option B</option>
</Select>`,
    Example: SelectExample,
  },
  {
    key: "Checkbox",
    title: "Checkbox",
    category: "Forms",
    components: ["Checkbox"],
    summary: "Checkbox with a built-in label.",
    code: `<Checkbox label="Hard mode" checked={checked} onChange={(e) => setChecked(e.target.checked)} />`,
    Example: CheckboxExample,
  },
  {
    key: "Radio",
    title: "Radio",
    category: "Forms",
    components: ["Radio"],
    summary: "Radio button with a built-in label.",
    code: `<Radio name="ex" label="A" checked={value === "a"} onChange={() => setValue("a")} />
<Radio name="ex" label="B" checked={value === "b"} onChange={() => setValue("b")} />`,
    Example: RadioExample,
  },
  {
    key: "Switch",
    title: "Switch",
    category: "Forms",
    components: ["Switch"],
    summary: "Toggle switch with a built-in label.",
    code: `<Switch label="Sound" checked={on} onChange={(e) => setOn(e.target.checked)} />`,
    Example: SwitchExample,
  },
  {
    key: "Slider",
    title: "Slider",
    category: "Forms",
    components: ["Slider"],
    summary: "Range slider.",
    code: `<Slider min={0} max={100} value={v} onChange={(e) => setV(Number(e.target.value))} />`,
    Example: SliderExample,
  },
  {
    key: "Textarea",
    title: "Textarea",
    category: "Forms",
    components: ["Textarea"],
    summary: "Multi-line text input.",
    code: `<Textarea placeholder="Leave a note…" rows={3} />`,
    Example: TextareaExample,
  },
  {
    key: "InputGroup",
    title: "Input group",
    category: "Forms",
    components: ["InputGroup", "InputAddon"],
    summary: "Groups an input with a leading/trailing addon.",
    code: `<InputGroup>
  <InputAddon>https://</InputAddon>
  <Input placeholder="your-site.com" />
</InputGroup>`,
    Example: InputGroupExample,
  },
  {
    key: "Fieldset",
    title: "Fieldset",
    category: "Forms",
    components: ["Fieldset"],
    summary: "Titled group box for a cluster of fields.",
    code: `<Fieldset title="Account" shadow>
  <Field label="Username">
    {(fieldProps) => <Input placeholder="scarlet" {...fieldProps} />}
  </Field>
</Fieldset>`,
    Example: FieldsetExample,
    bare: true,
  },
  {
    key: "Card",
    title: "Card",
    category: "Containers",
    components: ["Card", "CardHeader", "CardTitle", "CardBody", "CardFooter"],
    summary: "Composable bordered panel with tone, compact, tile, hover, round, and pixelated variants.",
    code: `<Card round compact>
  <CardHeader accent>
    <CardTitle>Quest log</CardTitle>
  </CardHeader>
  <CardBody>Defeat the Deadline Dragon before Friday.</CardBody>
</Card>`,
    Example: CardExample,
    bare: true,
  },
  {
    key: "CharacterCard",
    title: "Character card",
    category: "Containers",
    components: ["CharacterCard"],
    summary: "Portrait card for a player/NPC, with tone + state-driven status line.",
    code: `const spriteUrl = import.meta.env.BASE_URL + "sprites/claude.png";

<CharacterCard
  tone="info"
  state="talking"
  avatar={<SpriteAvatar sheetUrl={spriteUrl} state="talking" mode="full" />}
  name="Scarlet"
  role="Game Master"
  model="✳ claude-opus-4"
  status="speaking"
/>`,
    Example: CharacterCardExample,
    bare: true,
  },
  {
    key: "Chat",
    title: "Chat",
    category: "Containers",
    components: ["Chat", "ChatComposer", "ChatMessage", "ChatAction", "ChatSeparator"],
    summary: "Scrollable message feed with turn separators, action tags, and an optional composer footer.",
    code: `<Chat
  title="Table talk"
  footer={<ChatComposer onSend={(message) => send(message)} />}
>
  <ChatSeparator tone="info">Red · Turn 7</ChatSeparator>
  <ChatMessage name="Scarlet">Ready when you are.</ChatMessage>
</Chat>`,
    Example: ChatExample,
    bare: true,
  },
  {
    key: "Popover",
    title: "Popover",
    category: "Containers",
    components: ["Popover"],
    summary: "Content that floats above a trigger on hover/focus.",
    code: `<Popover content="I float above the trigger.">
  <Button size="sm">Hover me</Button>
</Popover>`,
    Example: PopoverExample,
  },
  {
    key: "Dialog",
    title: "Dialog",
    category: "Containers",
    components: ["Dialog", "DialogFooter"],
    summary: "Modal dialog with an optional footer slot for actions.",
    code: `<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Overwrite save?"
  footer={
    <DialogFooter>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="danger" onClick={() => setOpen(false)}>Overwrite</Button>
    </DialogFooter>
  }
>
  This can't be undone.
</Dialog>`,
    Example: DialogExample,
  },
  {
    key: "Table",
    title: "Table",
    category: "Containers",
    components: ["Table"],
    summary: "Styled <table> wrapper, with striped/hover row options.",
    code: `<Table striped hover>
  <thead>
    <tr><th>Player</th><th>Score</th></tr>
  </thead>
  <tbody>
    <tr><td>Scarlet</td><td>4</td></tr>
    <tr><td>Cobalt</td><td>3</td></tr>
  </tbody>
</Table>`,
    Example: TableExample,
    bare: true,
  },
  {
    key: "Accordion",
    title: "Accordion",
    category: "Navigation",
    components: ["Accordion", "AccordionItem"],
    summary: "Collapsible list of titled sections.",
    code: `<Accordion defaultOpen={["rules"]}>
  <AccordionItem value="rules" title="Rules">One clue, up to nine guesses.</AccordionItem>
  <AccordionItem value="scoring" title="Scoring">First team to clear their board wins.</AccordionItem>
</Accordion>`,
    Example: AccordionExample,
    bare: true,
  },
  {
    key: "Tabs",
    title: "Tabs",
    category: "Navigation",
    components: ["Tabs", "TabsList", "Tab", "TabPanel"],
    summary: "Tabbed panels, controlled or uncontrolled via value/defaultValue.",
    code: `<Tabs defaultValue="chat">
  <TabsList>
    <Tab value="chat">Chat</Tab>
    <Tab value="log">Log</Tab>
  </TabsList>
  <TabPanel value="chat">Table talk goes here.</TabPanel>
  <TabPanel value="log">Move history goes here.</TabPanel>
</Tabs>`,
    Example: TabsExample,
    bare: true,
  },
  {
    key: "Menu",
    title: "Menu",
    category: "Navigation",
    components: ["Menu"],
    summary: "Button-triggered dropdown menu.",
    code: `<Menu
  label="Actions"
  items={[
    { label: "Rename", onSelect: () => {} },
    { label: "Duplicate", onSelect: () => {} },
    { label: "Delete", onSelect: () => {} },
  ]}
/>`,
    Example: MenuExample,
  },
  {
    key: "Tooltip",
    title: "Tooltip",
    category: "Navigation",
    components: ["Tooltip"],
    summary: "Small hover/focus label for a trigger element.",
    code: `<Tooltip content="Ends the current turn">
  <Button size="sm">Next move</Button>
</Tooltip>`,
    Example: TooltipExample,
  },
  {
    key: "Breadcrumb",
    title: "Breadcrumb",
    category: "Navigation",
    components: ["Breadcrumb"],
    summary: "Path of links back to parent pages.",
    code: `<Breadcrumb
  items={[
    { label: "Games", href: "#" },
    { label: "Codenames", href: "#" },
    { label: "Turn 7" },
  ]}
/>`,
    Example: BreadcrumbExample,
  },
  {
    key: "Pagination",
    title: "Pagination",
    category: "Navigation",
    components: ["Pagination"],
    summary: "Page-number control with prev/next and sibling range.",
    code: `<Pagination page={page} pageCount={12} onPageChange={setPage} />`,
    Example: PaginationExample,
  },
  {
    key: "Alert",
    title: "Alert",
    category: "Feedback",
    components: ["Alert"],
    summary: "Inline banner for a one-off status message.",
    code: `<Alert variant="success" title="Saved">Your changes are live.</Alert>`,
    Example: AlertExample,
    bare: true,
  },
  {
    key: "ToastProvider",
    title: "Toast",
    category: "Feedback",
    components: ["ToastProvider"],
    summary: "Wrap the app in <ToastProvider>, then call the useToast() hook to fire toasts.",
    code: `const { toast } = useToast();
<Button onClick={() => toast("Turn passed", { variant: "success" })}>
  Trigger toast
</Button>`,
    Example: ToastExample,
  },
  {
    key: "GlobalAnimation",
    title: "Global animations",
    category: "Feedback",
    components: ["GlobalAnimation", "Confetti"],
    summary: "Full-screen celebration overlays: Codenames-style confetti plus bursts, sparkles, coins, and scanline wipes.",
    code: `<Confetti tone="success" seed={roundId} onComplete={clearCelebration} />

<GlobalAnimation variant="burst" tone="danger" />`,
    Example: GlobalAnimationExample,
  },
  {
    key: "Progress",
    title: "Progress",
    category: "Game HUD",
    components: ["Progress"],
    summary: "Labeled progress bar with striped/animated options.",
    code: `<Progress value={72} showLabel label="Loading" />`,
    Example: ProgressExample,
  },
  {
    key: "HealthBar",
    title: "Health bar",
    category: "Game HUD",
    components: ["HealthBar"],
    summary: "Segmented HP/MP/XP-style meter.",
    code: `<HealthBar kind="hp" value={7} max={10} label="HP" />`,
    Example: HealthBarExample,
  },
  {
    key: "RpgCard",
    title: "RPG card",
    category: "Game HUD",
    components: ["RpgCard"],
    summary: "Portrait card for party rosters, with level, HP, and EXP meters.",
    code: `const spriteUrl = import.meta.env.BASE_URL + "sprites/claude.png";

<RpgCard
  title="Ranger"
  level={18}
  avatar={<SpriteAvatar sheetUrl={spriteUrl} state="idle" mode="full" />}
  hp={{ value: 48, max: 48, valueLabel: "48/48" }}
  exp={{ value: 66, max: 100, tone: "success" }}
/>`,
    Example: RpgCardExample,
  },
  {
    key: "PlayerProfile",
    title: "Player profile",
    category: "Game HUD",
    components: ["PlayerProfile"],
    summary: "Compact player HUD profile with dedicated hp, mp, and xp bar props.",
    code: `const spriteUrl = import.meta.env.BASE_URL + "sprites/llama.png";

<PlayerProfile
  title="Player 1"
  avatar={<SpriteAvatar sheetUrl={spriteUrl} state="idle" mode="face" />}
  hp={{ value: 32, max: 32, valueLabel: "32/32" }}
  mp={{ value: 18, max: 18, valueLabel: "18/18" }}
  xp={{ value: 462, max: 1000, valueLabel: "462/1000" }}
/>`,
    Example: PlayerProfileExample,
  },
  {
    key: "Dial",
    title: "Dial",
    category: "Game HUD",
    components: ["Dial"],
    summary: "Round numeric dial (e.g. a turn counter).",
    code: `<Dial value={6} max={12} tone="danger" size="md" />`,
    Example: DialExample,
  },
  {
    key: "AreaMap",
    title: "Area map",
    category: "Game HUD",
    components: ["AreaMap"],
    summary: "Tiny pixel-grid map for dungeons, mines, boards, and HUD previews.",
    code: `<AreaMap
  label="Area"
  detail="Mines"
  tiles={tiles}
  columns={7}
/>`,
    Example: AreaMapExample,
  },
  {
    key: "Score",
    title: "Score",
    category: "Game HUD",
    components: ["Score", "Stat"],
    summary: "Odometer-style score readout, and a labeled stat with a delta arrow.",
    code: `<Score label="Score" value={42350} />
<Stat label="Players online" value="1,204" delta="12%" direction="up" />`,
    Example: ScoreExample,
  },
  {
    key: "Splash",
    title: "Splash",
    category: "Game HUD",
    components: ["Splash"],
    summary: "Title-screen hero with an optional shader background.",
    code: `<Splash title="Puxel" subtitle="A brutalist-retro UI kit" prompt="▶ Press start">
  <Button variant="primary" pixel>Insert coin</Button>
</Splash>`,
    Example: SplashExample,
    bare: true,
  },
  {
    key: "Figure",
    title: "Figure",
    category: "Media",
    components: ["Figure"],
    summary: "Captioned image frame, with pixelated corners and a dither-overlay option.",
    code: `<Figure
  src="https://picsum.photos/seed/puxel-docs/480/320"
  alt="Random placeholder landscape"
  caption="Below caption"
  captionPosition="below"
  pixelated
/>`,
    Example: FigureExample,
    bare: true,
  },
  {
    key: "VideoPlayer",
    title: "Video player",
    category: "Media",
    components: ["VideoPlayer"],
    summary: "Custom Puxel video chrome over a native video element, with play, seek, mute, and fullscreen controls.",
    code: `const assetBase = import.meta.env.BASE_URL;

<VideoPlayer
  src={assetBase + "jingle.mov"}
  poster={assetBase + "jingle-poster.jpg"}
  label="Jingle demo"
  caption="Local QuickTime sample"
  aspectRatio="4 / 3"
  pixelated
/>`,
    Example: VideoPlayerExample,
    bare: true,
  },
  {
    key: "PixelShader",
    title: "Pixel shader",
    category: "Foundations",
    components: ["PixelShader"],
    summary: "Animated canvas background (plasma/ripple/waves), themed off CSS custom properties.",
    code: `<PixelShader pattern="plasma" cell={6} style={{ position: "absolute", inset: 0 }} />`,
    Example: PixelShaderExample,
  },
  {
    key: "GradientBg",
    title: "Gradient bg",
    category: "Foundations",
    components: ["GradientBg"],
    summary: "Square-pixel canvas gradient with configurable colors, direction, and pixelation.",
    code: `<GradientBg
  colors={["--px-danger", "--px-accent", "--px-info", "--px-bg"]}
  direction="down-right"
  pixelation={14}
/>`,
    Example: GradientBgExample,
  },
  {
    key: "Kbd",
    title: "Kbd",
    category: "Foundations",
    components: ["Kbd"],
    summary: "Inline keyboard-key styling.",
    code: `<p>Press <Kbd>Enter</Kbd> to send, <Kbd>Esc</Kbd> to close.</p>`,
    Example: KbdExample,
  },
  {
    key: "Separator",
    title: "Separator",
    category: "Foundations",
    components: ["Separator"],
    summary: "Horizontal or vertical rule.",
    code: `<p>Above the fold</p>
<Separator />
<p>Below the fold</p>`,
    Example: SeparatorExample,
  },
  {
    key: "Theme",
    title: "Theme",
    category: "Theming",
    components: ["ThemeProvider", "ThemeSwitcher"],
    summary: "Wrap the app in <ThemeProvider>, then drop <ThemeSwitcher /> in anywhere to flip themes.",
    code: `<ThemeProvider defaultTheme="paper">
  <ThemeSwitcher />
</ThemeProvider>`,
    Example: ThemeExample,
  },
];
