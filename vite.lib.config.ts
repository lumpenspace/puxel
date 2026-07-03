import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Library build: bundles src/components/index.ts as an importable ESM
// package entry, separate from the app build in vite.config.ts.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: "src/components/index.ts",
      formats: ["es"],
      fileName: () => "puxel.js",
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "react-dom"],
    },
  },
});
