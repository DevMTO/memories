const externalUrl = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i;

/**
 * Resolves a local public-file or internal route against Astro's configured
 * base path. This keeps both root deployments and GitHub Pages project sites
 * working from the same build.
 */
export function sitePath(path: string): string {
  if (!path || externalUrl.test(path)) return path;

  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
