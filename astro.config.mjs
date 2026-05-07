import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  base: process.env.BASE_PATH || (process.env.NODE_ENV === 'production' ? '/memories/' : '/'),
  integrations: [react()],
});