import { useMemo, useState } from "react";
import "../styles/docs.css";
import { Badge, Input, Table } from "../components";
import { CATEGORY_ORDER, REGISTRY, type DocEntry } from "./registry";
import { COMPONENT_DOCS } from "./props";

type CodeLanguage = "shell" | "tsx";

type HighlightToken = {
  text: string;
  kind?: "attr" | "comment" | "component" | "keyword" | "number" | "operator" | "punctuation" | "string" | "tag";
};

const TSX_KEYWORDS = new Set([
  "as",
  "const",
  "default",
  "else",
  "export",
  "false",
  "from",
  "function",
  "if",
  "import",
  "interface",
  "let",
  "new",
  "null",
  "return",
  "true",
  "type",
  "undefined",
  "var",
]);

const SHELL_COMMANDS = new Set(["npm", "npx", "pnpm", "yarn", "node"]);
const SHELL_SUBCOMMANDS = new Set(["add", "build", "dev", "exec", "install", "run"]);

const tsxTokenPattern =
  /\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|<\/?[A-Za-z][\w.:-]*|\/>|=>|===|!==|==|!=|<=|>=|&&|\|\||[{}()[\].,;:?]|[=<>/]|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$-]*\b/g;

const shellTokenPattern = /#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|--?[\w-]+|[;&|]|\b[\w./@-]+\b/g;

function pushPlain(tokens: HighlightToken[], text: string) {
  if (text) tokens.push({ text });
}

function highlightTsx(code: string) {
  const tokens: HighlightToken[] = [];
  let lastIndex = 0;
  let inTag = false;

  for (const match of code.matchAll(tsxTokenPattern)) {
    const text = match[0];
    const index = match.index ?? 0;
    pushPlain(tokens, code.slice(lastIndex, index));

    let kind: HighlightToken["kind"];
    if (text.startsWith("//") || text.startsWith("/*")) {
      kind = "comment";
    } else if (text.startsWith('"') || text.startsWith("'") || text.startsWith("`")) {
      kind = "string";
    } else if (text.startsWith("<") && text !== "<") {
      kind = "tag";
      inTag = true;
    } else if (text === ">" || text === "/>") {
      kind = "punctuation";
      inTag = false;
    } else if (inTag && /^[A-Za-z_$][\w$-]*$/.test(text)) {
      kind = "attr";
    } else if (TSX_KEYWORDS.has(text)) {
      kind = "keyword";
    } else if (/^[A-Z][\w$]*$/.test(text)) {
      kind = "component";
    } else if (/^\d/.test(text)) {
      kind = "number";
    } else if (/^(=>|===|!==|==|!=|<=|>=|&&|\|\||=|<|>|\/)$/.test(text)) {
      kind = "operator";
    } else if (/^[{}()[\].,;:?]$/.test(text)) {
      kind = "punctuation";
    }

    tokens.push({ text, kind });
    lastIndex = index + text.length;
  }

  pushPlain(tokens, code.slice(lastIndex));
  return tokens;
}

function highlightShell(code: string) {
  const tokens: HighlightToken[] = [];
  let lastIndex = 0;
  let expectsCommand = true;

  for (const match of code.matchAll(shellTokenPattern)) {
    const text = match[0];
    const index = match.index ?? 0;
    const before = code.slice(lastIndex, index);
    pushPlain(tokens, before);

    if (before.includes("\n")) expectsCommand = true;

    let kind: HighlightToken["kind"];
    if (text.startsWith("#")) {
      kind = "comment";
    } else if (text.startsWith('"') || text.startsWith("'")) {
      kind = "string";
    } else if (text.startsWith("-")) {
      kind = "attr";
    } else if (expectsCommand && SHELL_COMMANDS.has(text)) {
      kind = "keyword";
    } else if (SHELL_SUBCOMMANDS.has(text)) {
      kind = "component";
    } else if (/^\d/.test(text)) {
      kind = "number";
    } else if (/^[;&|]$/.test(text)) {
      kind = "operator";
      expectsCommand = true;
    }

    tokens.push({ text, kind });
    if (kind !== "operator" && text.trim()) expectsCommand = false;
    lastIndex = index + text.length;
  }

  pushPlain(tokens, code.slice(lastIndex));
  return tokens;
}

function CodeBlock({ code, language = "tsx" }: { code: string; language?: CodeLanguage }) {
  const tokens = useMemo(() => (language === "shell" ? highlightShell(code) : highlightTsx(code)), [code, language]);

  return (
    <pre className={`px-docs-code px-docs-code--${language}`}><code>{tokens.map((token, index) =>
          token.kind ? (
            <span key={`${index}-${token.kind}`} className={`px-docs-token px-docs-token--${token.kind}`}>
              {token.text}
            </span>
          ) : (
            token.text
          ),
        )}</code></pre>
  );
}

function matches(entry: DocEntry, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    entry.title.toLowerCase().includes(q) ||
    entry.category.toLowerCase().includes(q) ||
    entry.summary.toLowerCase().includes(q) ||
    entry.components.some((c) => c.toLowerCase().includes(q))
  );
}

const INSTALL_KEY = "__install__";

function InstallSection() {
  return (
    <div className="px-docs-main">
      <div>
        <div className="px-docs-header">
          <h2 className="px-display" style={{ margin: 0 }}>
            Installation
          </h2>
        </div>
        <p className="px-docs-summary">Get Puxel into your project and rendering its first themed component.</p>
      </div>

      <section>
        <h3 className="px-docs-section-title">1. Install</h3>
        <CodeBlock language="shell" code="npm install puxel" />
      </section>

      <section>
        <h3 className="px-docs-section-title">2. Import the stylesheet</h3>
        <p className="px-docs-summary">
          Once, at your app's entry point. It ships every theme (paper, midnight, arcade, terminal) —
          switching is just a data attribute, no separate imports needed.
        </p>
        <CodeBlock code={'import "puxel/puxel.css";'} />
      </section>

      <section>
        <h3 className="px-docs-section-title">3. Wrap your app in a ThemeProvider</h3>
        <p className="px-docs-summary">
          Everything else — components, <code>useToast()</code>, <code>useTheme()</code> — assumes this is
          somewhere above it in the tree.
        </p>
        <CodeBlock
          code={`import "puxel/puxel.css";
import { ThemeProvider, ToastProvider, Button } from "puxel";

export function App() {
  return (
    <ThemeProvider defaultTheme="paper">
      <ToastProvider>
        <Button variant="primary">Hello Puxel</Button>
      </ToastProvider>
    </ThemeProvider>
  );
}`}
        />
      </section>

      <section>
        <h3 className="px-docs-section-title">4. Explore</h3>
        <p className="px-docs-summary">
          Search the components in the sidebar for props, usage snippets, and a live example of each.
        </p>
      </section>
    </div>
  );
}

function PropsTable({ name }: { name: string }) {
  const doc = COMPONENT_DOCS[name];
  if (!doc || doc.props.length === 0) {
    return <p className="px-docs-props-note">No custom props — see the composition example above.</p>;
  }
  return (
    <Table striped>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {doc.props.map((p) => (
          <tr key={p.name}>
            <td>
              <code>
                {p.name}
                {p.required ? "*" : ""}
              </code>
            </td>
            <td>
              <code>{p.type}</code>
            </td>
            <td>{p.defaultValue ?? "—"}</td>
            <td>{p.description || "—"}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export function DocsPage() {
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string>(INSTALL_KEY);

  const grouped = useMemo(() => {
    const filtered = REGISTRY.filter((e) => matches(e, query));
    const byCategory = new Map<string, DocEntry[]>();
    for (const entry of filtered) {
      const list = byCategory.get(entry.category) ?? [];
      list.push(entry);
      byCategory.set(entry.category, list);
    }
    return CATEGORY_ORDER.map((category) => ({ category, entries: byCategory.get(category) ?? [] })).filter(
      (g) => g.entries.length > 0,
    );
  }, [query]);

  const isInstall = selectedKey === INSTALL_KEY;
  const selected = REGISTRY.find((e) => e.key === selectedKey) ?? null;
  const inFilteredGroups = grouped.some((g) => g.entries.some((e) => e.key === selectedKey));
  const active = isInstall ? null : inFilteredGroups ? selected : grouped[0]?.entries[0];

  return (
    <div className="px-docs">
      <aside className="px-docs-sidebar">
        <button
          type="button"
          className={`px-docs-item${isInstall ? " px-docs-item--active" : ""}`}
          onClick={() => setSelectedKey(INSTALL_KEY)}
        >
          Installation
        </button>
        <Input
          type="search"
          placeholder="Search components…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search components"
        />
        {grouped.length === 0 && <p className="px-docs-empty">No components match "{query}".</p>}
        {grouped.map(({ category, entries }) => (
          <div key={category} className="px-docs-group">
            <p className="px-docs-group-title">{category}</p>
            {entries.map((entry) => (
              <button
                key={entry.key}
                type="button"
                className={`px-docs-item${active?.key === entry.key ? " px-docs-item--active" : ""}`}
                onClick={() => setSelectedKey(entry.key)}
              >
                {entry.title}
              </button>
            ))}
          </div>
        ))}
      </aside>

      {isInstall ? (
        <InstallSection />
      ) : (
        active && (
        <div className="px-docs-main">
          <div>
            <div className="px-docs-header">
              <h2 className="px-display" style={{ margin: 0 }}>
                {active.title}
              </h2>
              <Badge>{active.category}</Badge>
            </div>
            <p className="px-docs-summary">{active.summary}</p>
          </div>

          <section>
            <h3 className="px-docs-section-title">Example</h3>
            <div className={`px-docs-example${active.bare ? " px-docs-example--bare" : ""}`}>
              <active.Example />
            </div>
          </section>

          <section>
            <h3 className="px-docs-section-title">Usage</h3>
            <CodeBlock code={active.code} />
          </section>

          <section>
            <h3 className="px-docs-section-title">Props</h3>
            {active.components.map((name) => (
              <div key={name} className="px-docs-props-group">
                {active.components.length > 1 && <p className="px-docs-props-group-title">{name}</p>}
                <PropsTable name={name} />
              </div>
            ))}
          </section>
        </div>
        )
      )}
    </div>
  );
}
