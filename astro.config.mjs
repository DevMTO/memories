// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";

export default defineConfig({
  output: "hybrid",

  adapter: node({
    mode: "standalone",
  }),

  integrations: [react()],
});