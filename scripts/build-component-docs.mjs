/**
 * Extracts prop tables for every exported component in src/components/*.tsx
 * via the TypeScript compiler API (react-docgen-typescript), and writes them
 * to src/docs/props.generated.json for the in-app documentation page.
 *
 * Re-run with `npm run docs:props` whenever component props change.
 */
import { readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { withCustomConfig } from "react-docgen-typescript";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const componentsDir = join(root, "src/components");

const parser = withCustomConfig(join(root, "tsconfig.app.json"), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => prop.parent == null || !prop.parent.fileName.includes("node_modules"),
});

function formatType(type) {
  if (!type) return "unknown";
  if (type.name === "enum" && Array.isArray(type.value)) {
    return type.value.map((v) => v.value).join(" | ");
  }
  return type.name;
}

const files = readdirSync(componentsDir)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => join(componentsDir, f));

const byComponent = {};
for (const file of files) {
  let docs;
  try {
    docs = parser.parse(file);
  } catch {
    continue;
  }
  for (const doc of docs) {
    byComponent[doc.displayName] = {
      description: doc.description,
      props: Object.values(doc.props)
        .map((p) => ({
          name: p.name,
          type: formatType(p.type),
          required: p.required,
          defaultValue: p.defaultValue?.value ?? null,
          description: p.description || "",
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
  }
}

const out = join(root, "src/docs/props.generated.json");
writeFileSync(out, `${JSON.stringify(byComponent, null, 2)}\n`);
console.log(`Wrote props for ${Object.keys(byComponent).length} components to ${out}`);
