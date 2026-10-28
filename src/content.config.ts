import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { fetchAll, fileUrl, fileUrls, optional } from '#src/lib/pocketbase.ts';

// El contenido vive en PocketBase (o en el seed, con CONTENT_SOURCE=seed) y se lee
// en el build. Sin sesión, las reglas de PocketBase solo devuelven lo publicado.
// Los loaders lo dejan con la forma que usan los servicios (src/lib/types.ts); las
// imágenes salen como URL y los servicios las optimizan (kit/content/images.ts).

const list = () => z.array(z.string()).default([]);
const lines = (value: unknown) => (Array.isArray(value) ? value.map(String) : []);

const products = defineCollection({
  loader: async () =>
    (await fetchAll('products')).map((r) => ({
      id: r.slug,
      kind: r.kind,
      title: r.title,
      slug: r.slug,
      isFeatured: !!r.is_featured,
      sortOrder: r.sort_order ?? 0,
      shortDescription: r.short_description ?? '',
      description: r.description ?? '',
      price: r.price ?? 0,
      durationDays: optional(r.duration_days) ?? 1,
      durationNights: r.duration_nights ?? 0,
      destinationName: optional(r.destination_name) ?? 'Perú',
      destinationSlug: optional(r.destination_slug) ?? 'peru',
      location: optional(r.location) ?? 'Perú',
      cities: lines(r.cities),
      destinations: Array.isArray(r.destinations) ? r.destinations : [],
      imageUrl: fileUrl(r, r.cover),
      gallery: fileUrls(r, r.gallery),
      features: lines(r.features),
      highlights: lines(r.highlights),
      itinerary: Array.isArray(r.itinerary) ? r.itinerary : [],
      includes: lines(r.includes),
      notIncludes: lines(r.not_includes),
      whatToBring: lines(r.what_to_bring),
      importantNotes: lines(r.important_notes),
      seoTitle: r.seo_title ?? '',
      seoDescription: r.seo_description ?? '',
    })),
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
    (await fetchAll('destinations')).map((r) => ({
      id: r.slug,
      slug: r.slug,
      name: r.name,
      sortOrder: r.sort_order ?? 0,
      eyebrow: r.eyebrow ?? '',
      title: r.title ?? '',
      description: r.description ?? '',
      altitude: optional(r.altitude),
      climate: optional(r.climate),
      bestSeason: optional(r.best_season),
      imageUrl: fileUrl(r, r.image),
    })),
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
