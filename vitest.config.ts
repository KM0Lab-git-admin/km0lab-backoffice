// Quick tests of production code (services, mappers, checks), without a
// browser. Separate from vite.config.ts on purpose: that one is Lovable's
// wrapper for the app and pulls in plugins a test does not need.
//
//   npm test
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    setupFiles: ["src/test/setup.ts"],
    env: { VITE_API_URL: "http://api.test/api/v1" },
  },
});
