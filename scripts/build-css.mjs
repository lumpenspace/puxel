/**
 * Bundles src/styles/puxel.css into a single flattened dist/puxel.css with
 * all @import statements resolved — the compiled stylesheet design-sync
 * (and any consumer) expects, as opposed to the @import-only source entry.
 */
import { build } from "esbuild";
import { mkdirSync, rmSync } from "node:fs";

rmSync("dist/puxel.css", { force: true });
mkdirSync("dist", { recursive: true });

await build({
  entryPoints: ["src/styles/puxel.css"],
  outfile: "dist/puxel.css",
  bundle: true,
  minify: false,
  loader: { ".woff2": "dataurl" },
});

console.log("wrote dist/puxel.css");
