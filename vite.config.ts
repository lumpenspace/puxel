import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Showcase app build — kept in dist/app/ so it never collides with the
// library build (vite.lib.config.ts), which owns dist/ directly.
export default defineConfig({
  base: process.env.GITHUB_PAGES ? "/puxel/" : "/",
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5199,
    strictPort: !!process.env.PORT,
  },
  build: {
    outDir: "dist/app",
  },
});
