import { useState, type ReactNode } from "react";
import {
  Accordion,
  AccordionItem,
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  Field,
  Fieldset,
  HealthBar,
  Input,
  InputAddon,
  InputGroup,
  Kbd,
  Menu,
  Pagination,
  Progress,
  Radio,
  Score,
  Select,
  Separator,
  Slider,
  Spinner,
  Splash,
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
  ToastProvider,
  Tooltip,
  useToast,
} from "./components";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 className="px-display px-display--md" style={{ marginTop: 24 }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>{children}</div>;
}

function Showcase() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(3);
  const [hp, setHp] = useState(7);
  const [score, setScore] = useState(42350);
  const [volume, setVolume] = useState(60);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px 96px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <h1 className="px-display px-display--lg">
          Puxel<span style={{ color: "var(--px-accent-2)" }}>_</span>
        </h1>
        <ThemeSwitcher />
      </header>

      <Splash
        title="Puxel"
        subtitle="A brutalist-retro UI kit with modern manners"
        prompt="▶ Press start"
      >
        <Row>
          <Button variant="primary" pixel onClick={() => setScore((s) => s + 150)}>
            Insert coin
          </Button>
          <Button onClick={() => toast("Welcome, player one!", { variant: "success" })}>
            New game
          </Button>
        </Row>
      </Splash>

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

      <Section title="Game HUD">
        <Row>
          <Score label="Score" value={score} />
          <Score label="Hi-score" value={999999} surface />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <HealthBar kind="hp" value={hp} max={10} />
            <HealthBar kind="mp" value={4} max={10} />
            <HealthBar kind="xp" value={8} max={10} />
          </div>
        </Row>
        <Row>
          <Button size="sm" variant="danger" onClick={() => setHp((h) => Math.max(0, h - 1))}>
            Take hit
          </Button>
          <Button size="sm" variant="success" onClick={() => setHp((h) => Math.min(10, h + 1))}>
            Heal
          </Button>
        </Row>
        <Row>
          <div style={{ flex: 1, minWidth: 220 }}>
            <Progress value={72} showLabel label="Loading" />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <Progress value={45} striped animated variant="info" label="Downloading" />
          </div>
        </Row>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
          }}
        >
          <Stat label="Players online" value="1,204" delta="12%" direction="up" />
          <Stat label="Crash rate" value="0.03%" delta="8%" direction="down" />
          <Stat label="Coins collected" value="88,412" delta="31%" direction="up" />
        </div>
      </Section>

      <Section title="Forms">
        <Fieldset title="Player setup" accent shadow>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
            <Field label="Player name" hint="Shown on the leaderboard">
              {(p) => <Input {...p} placeholder="AAA" />}
            </Field>
            <Field label="Guild" error="This guild name is taken">
              {(p) => <Input {...p} error placeholder="The Pixel Pushers" />}
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
            <Field label="Bio">{(p) => <Textarea {...p} placeholder="A mysterious adventurer…" />}</Field>
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
      </Section>

      <Section title="Cards">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          <Card>
            <CardHeader accent>
              <CardTitle>Quest log</CardTitle>
              <Badge variant="secondary">3 new</Badge>
            </CardHeader>
            <CardBody>
              Defeat the Deadline Dragon before Friday. Reward: 500 XP and a long weekend.
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
              This card lifts on hover — use it for clickable list items and links.
              <div style={{ marginTop: 12 }}>
                <AvatarGroup>
                  <Avatar initials="P1" />
                  <Avatar initials="P2" status="online" />
                  <Avatar initials="P3" status="busy" />
                </AvatarGroup>
              </div>
            </CardBody>
          </Card>
        </div>
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
          <Button variant="success" onClick={() => toast("Item crafted!", { variant: "success" })}>
            Success toast
          </Button>
          <Button variant="danger" onClick={() => toast("You died.", { variant: "danger" })}>
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
          <TabPanel value="stats">STR 14 · DEX 9 · INT 17 · LUCK 3. Mostly a wizard, honestly.</TabPanel>
          <TabPanel value="gear">Rusty sword, wooden buckler, and a suspiciously heavy backpack.</TabPanel>
          <TabPanel value="spells">Fireball, Blink, and Summon Coffee (channelled, 4s cast).</TabPanel>
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
            Arrow keys to move, <Kbd>Z</Kbd> to jump, <Kbd>X</Kbd> to attack. Tabs and menus are fully
            keyboard-navigable.
          </AccordionItem>
          <AccordionItem value="saving" title="Saving">
            Progress autosaves at every checkpoint. Manual saves live in the pause menu.
          </AccordionItem>
          <AccordionItem value="secrets" title="Secrets">
            There is a warp zone behind the third waterfall. You didn't hear it from us.
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="Table">
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
          Slot 3 contains 41 hours of progress. This action cannot be undone.
        </Dialog>
      </Section>
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
