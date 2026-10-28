const externalUrl = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i;

/**
 * Resolves a local public-file or internal route against Astro's configured
 * base path. This keeps local assets and internal routes aligned with Astro's configured
 * base path in Node deployments.
 */
export function sitePath(path: string): string {
  if (!path || externalUrl.test(path)) return path;

  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
