// Contenido del sitio: PocketBase o, con CONTENT_SOURCE=seed, src/lib/seed.ts (ver
// kit/content/pocketbase.ts).
import { createContent } from '#kit/content/pocketbase.ts';

export { fileUrl, fileUrls, formsEndpoint, optional, pocketbaseUrl, type PbRecord } from '#kit/content/pocketbase.ts';

export const { fetchAll } = createContent({ seed: async () => (await import('#src/lib/seed.ts')).seed });
