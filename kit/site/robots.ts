import { isPreview } from './preview.ts';

// robots.txt: fuera /admin y, en la vista previa, todo. Anuncia el sitemap de
// @astrojs/sitemap. Se sirve desde src/pages/robots.txt.ts:
//
//   export const GET: APIRoute = ({ site }) => robotsTxt(site);
export function robotsTxt(site: URL | undefined) {
  const lines = isPreview()
    ? ['User-agent: *', 'Disallow: /']
    : ['User-agent: *', 'Disallow: /admin', ...(site ? ['', `Sitemap: ${new URL('sitemap-index.xml', site).href}`] : [])];
  return new Response(`${lines.join('\n')}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
