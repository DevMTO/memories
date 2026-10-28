import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { pocketbaseImageDomains, setupEnv } from '#kit/content/setup.ts';
import { parseLangs } from '#kit/i18n/locales.ts';
import { translations } from '#kit/i18n/integration.ts';
import { translationConfig } from '#src/i18n/translation.ts';

// .env y origen del contenido (seed o PocketBase): ver kit/content/setup.ts.
setupEnv();

const configuredBase = process.env.BASE_PATH?.trim() || '/';
const base = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;
const site = process.env.SITE_URL?.trim() || undefined;

export default defineConfig({
  site,
  base,
  image: { domains: pocketbaseImageDomains() },
  integrations: [react(), translations(parseLangs(process.env.ENABLED_LANGS), translationConfig)],
});
