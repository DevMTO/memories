import { readFileSync } from 'node:fs';
import sitemap from '@astrojs/sitemap';
import type { AstroIntegration } from 'astro';
import { sitemapI18n } from '../i18n/locales.ts';
import type { Lang } from '../i18n/locales.ts';
import { isPreview } from './preview.ts';

// sitemap-index.xml con @astrojs/sitemap: cada página con sus versiones en otros
// idiomas, y solo las que se indexan. Lee el HTML que el build ya escribió y
// deja fuera las que tienen noindex (/admin, la 404) o una canónica a otra URL
// (copias de una página). En la vista previa, que no se indexa, no hay sitemap.
//
//   integrations: [..., ...sitemaps(langs)]
export function sitemaps(langs: Lang[]): AstroIntegration[] {
  if (isPreview()) return [];
  let outDir: URL;
  return [
    { name: 'sitemap-out-dir', hooks: { 'astro:config:done': ({ config }) => void (outDir = config.outDir) } },
    sitemap({ i18n: sitemapI18n(langs), filter: (page) => indexable(page, outDir) }),
  ];
}

function indexable(page: string, outDir: URL) {
  const { pathname } = new URL(page);
  const html = readPage(pathname, outDir);
  if (html === undefined) return true;
  if (/<meta name="robots" content="noindex/.test(html)) return false;
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  return !canonical || new URL(canonical).pathname === pathname;
}

// /tours/ → <outDir>/tours/index.html; /404/ → <outDir>/404.html.
function readPage(pathname: string, outDir: URL) {
  const route = `.${decodeURIComponent(pathname)}`;
  for (const file of [`${route.replace(/\/?$/, '/')}index.html`, `${route.replace(/\/$/, '')}.html`]) {
    try {
      return readFileSync(new URL(file, outDir), 'utf8');
    } catch {}
  }
  return undefined;
}
