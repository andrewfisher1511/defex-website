import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // Matches Next.js's own module resolution: the "server-only" package
    // exports an empty module under the "react-server" condition and a
    // throwing one otherwise (see its package.json). Without this condition
    // here, every "import server-only" — required in any file under
    // src/lib that must never reach a client bundle — throws immediately
    // when that file is imported by a test.
    conditions: ["react-server"],
  },
  // Vitest runs tests through Vite's SSR pipeline, which resolves modules
  // via `ssr.resolve.*` rather than the top-level `resolve.*` above —
  // needs the same condition or "server-only" still throws.
  ssr: {
    resolve: {
      conditions: ["react-server"],
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
