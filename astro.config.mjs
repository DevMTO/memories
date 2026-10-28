import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { pocketbaseImageDomains, setupEnv } from '#kit/content/setup.ts';
import { parseLangs } from '#kit/i18n/locales.ts';
import { translations } from '#kit/i18n/integration.ts';
import { translationConfig } from '#src/i18n/translation.ts';

// .env y origen del contenido (seed o PocketBase): ver kit/content/setup.ts.
setupEnv();

export default defineConfig({
  // URL pública del sitio, usada en hreflang y URLs absolutas.
  site: process.env.SITE_URL?.trim() || undefined,
  image: { domains: pocketbaseImageDomains() },
  integrations: [react(), translations(parseLangs(process.env.ENABLED_LANGS), translationConfig)],
});
