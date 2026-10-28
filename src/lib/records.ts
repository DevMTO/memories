// Registros de PocketBase (o del seed) → la forma que usan los servicios y las
// páginas (src/lib/types.ts). Lo usan los loaders (src/content.config.ts) y el
// traductor (src/i18n/translation.ts), que corre en Node.
import { fileUrl, fileUrls, optional, type PbRecord } from '#src/lib/pocketbase.ts';

const lines = (value: unknown) => (Array.isArray(value) ? value.map(String) : []);

export const productFromRecord = (r: PbRecord) => ({
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
});

export const destinationFromRecord = (r: PbRecord) => ({
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
});
