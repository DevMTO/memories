import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';

const configuredBase = process.env.BASE_PATH?.trim() || '/';
const base = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;
const site = process.env.SITE_URL?.trim() || undefined;

// Legacy Firebase/react-query admin code kept for the future hosted-DB
// migration; its deps aren't installed, so keep it out of the dev scan.
// Paths must be absolute because Astro's own scan pattern is absolute.
const legacyAdminComponents = ['AuthContext', 'ProtectedRoute', 'ToursCrud'].map(
  (name) => '!' + fileURLToPath(new URL(`./src/components/admin/${name}.tsx`, import.meta.url)),
);

export default defineConfig({
  site,
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  base,
  integrations: [react()],
  vite: {
    optimizeDeps: {
      entries: legacyAdminComponents,
    },
  },
});
