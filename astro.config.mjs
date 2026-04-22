// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  // Use hybrid rendering: SSG by default, but allow on-demand SSR for pages that need it
  output: "hybrid",
  integrations: [react()],
});
