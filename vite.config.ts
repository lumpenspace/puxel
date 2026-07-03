import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Showcase app build — kept in dist/app/ so it never collides with the
// library build (vite.lib.config.ts), which owns dist/ directly.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist/app",
  },
});
