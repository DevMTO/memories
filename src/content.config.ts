import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { fetchAll } from '#src/lib/pocketbase.ts';
import { destinationFromRecord, productFromRecord } from '#src/lib/records.ts';

// El contenido vive en PocketBase (o en el seed, con CONTENT_SOURCE=seed) y se lee
// en el build. Sin sesión, las reglas de PocketBase solo devuelven lo publicado.
// Los loaders lo dejan con la forma que usan los servicios (src/lib/types.ts); las
// imágenes salen como URL y los servicios las optimizan (kit/content/images.ts).

const list = () => z.array(z.string()).default([]);

const products = defineCollection({
  loader: async () =>
    (await fetchAll('products')).map(productFromRecord),
  schema: z.object({
    kind: z.enum(['tour', 'trekking', 'package']),
    title: z.string(),
    slug: z.string(),
    isFeatured: z.boolean(),
    sortOrder: z.number(),
    shortDescription: z.string(),
    description: z.string(),
    price: z.number(),
    durationDays: z.number(),
    durationNights: z.number(),
    destinationName: z.string(),
    destinationSlug: z.string(),
    location: z.string(),
    cities: list(),
    destinations: z.array(z.object({ id: z.string().optional(), name: z.string(), slug: z.string() })).default([]),
    imageUrl: z.string().optional(),
    gallery: list(),
    features: list(),
    highlights: list(),
    itinerary: z
      .array(
        z.object({
          day: z.number(),
          title: z.string(),
          description: z.string(),
          accommodations: z.string().optional(),
          meals: list(),
          includes: list(),
          notIncludes: list(),
        }),
      )
      .default([]),
    includes: list(),
    notIncludes: list(),
    whatToBring: list(),
    importantNotes: list(),
    seoTitle: z.string(),
    seoDescription: z.string(),
  }),
});

const destinations = defineCollection({
  loader: async () =>
    (await fetchAll('destinations')).map(destinationFromRecord),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    sortOrder: z.number(),
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    altitude: z.string().optional(),
    climate: z.string().optional(),
    bestSeason: z.string().optional(),
    imageUrl: z.string().optional(),
  }),
});

// Un solo registro (lo crea la migración).
const settings = defineCollection({
  loader: async () =>
    (await fetchAll('settings')).slice(0, 1).map((r) => ({
      id: 'settings',
      whatsapp: r.whatsapp ?? '',
      emergencyPhone: r.emergency_phone ?? '',
      email: r.email ?? '',
      address: r.address ?? '',
    })),
  schema: z.object({
    whatsapp: z.string(),
    emergencyPhone: z.string(),
    email: z.string(),
    address: z.string(),
  }),
});

export const collections = { products, destinations, settings };
