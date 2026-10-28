import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { pocketbaseImageDomains, setupEnv } from '#kit/content/setup.ts';

// .env y origen del contenido (seed o PocketBase): ver kit/content/setup.ts.
setupEnv();

const configuredBase = process.env.BASE_PATH?.trim() || '/';
const base = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;
const site = process.env.SITE_URL?.trim() || undefined;

export default defineConfig({
  site,
  base,
  image: { domains: pocketbaseImageDomains() },
  integrations: [react()],
});
