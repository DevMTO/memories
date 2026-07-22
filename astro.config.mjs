import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  // A normal production build is served from the domain root. GitHub Pages
  // supplies BASE_PATH in its workflow when the site lives in a repository
  // subdirectory (for example, /memories/).
  base: process.env.BASE_PATH || '/',
  integrations: [react()],
});
