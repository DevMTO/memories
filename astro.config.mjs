import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

const configuredBase = process.env.BASE_PATH?.trim() || '/';
const base = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;
const site = process.env.SITE_URL?.trim() || undefined;

export default defineConfig({
  site,
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  base,
  integrations: [react()],
});
