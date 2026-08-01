import { randomUUID } from 'node:crypto';
import type {
  ItineraryDay,
  TravelProduct,
  TravelProductKind,
} from '../../core/domain/models';

const allowedKinds = new Set<TravelProductKind>(['tour', 'trekking', 'package']);

const text = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value.trim() : fallback;

const number = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const boolean = (value: unknown, fallback = false) =>
  typeof value === 'boolean' ? value : fallback;

const stringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.map((item) => text(item)).filter(Boolean)
    : [];

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const itinerary = (value: unknown): ItineraryDay[] => {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => {
    const record = item && typeof item === 'object' ? item as Record<string, unknown> : {};
    return {
      day: Math.max(1, Math.trunc(number(record.day, index + 1))),
      title: text(record.title, `Día ${index + 1}`),
      description: text(record.description),
      accommodations: text(record.accommodations) || undefined,
      meals: stringArray(record.meals),
      includes: stringArray(record.includes),
      notIncludes: stringArray(record.notIncludes),
    };
  });
};

export const sanitizeProduct = (input: unknown, id?: string): TravelProduct => {
  const record = input && typeof input === 'object' ? input as Record<string, unknown> : {};
  const kind = allowedKinds.has(record.kind as TravelProductKind)
    ? record.kind as TravelProductKind
    : 'tour';
  const title = text(record.title);
  if (!title) throw new Error('El título es obligatorio.');

  const slug = slugify(text(record.slug) || title);
  if (!slug) throw new Error('No se pudo generar un slug válido.');

  const destinations = Array.isArray(record.destinations)
    ? record.destinations
        .map((item) => {
          const destination = item && typeof item === 'object' ? item as Record<string, unknown> : {};
          const name = text(destination.name);
          return name ? { name, slug: slugify(text(destination.slug) || name) } : null;
        })
        .filter(Boolean) as { name: string; slug: string }[]
    : [];

  const base = {
    id: id || text(record.id) || randomUUID(),
    kind,
    title,
    slug,
    shortDescription: text(record.shortDescription),
    description: text(record.description),
    price: Math.max(0, number(record.price)),
    durationDays: Math.max(1, Math.trunc(number(record.durationDays, 1))),
    durationNights: Math.max(0, Math.trunc(number(record.durationNights))),
    destinationName: text(record.destinationName, kind === 'package' ? 'Perú' : 'Cusco'),
    destinationSlug: slugify(text(record.destinationSlug) || text(record.destinationName) || 'peru'),
    location: text(record.location, kind === 'package' ? 'Perú' : 'Cusco'),
    cities: stringArray(record.cities),
    imageUrl: text(record.imageUrl, '/images/hero.webp'),
    gallery: stringArray(record.gallery),
    features: stringArray(record.features),
    highlights: stringArray(record.highlights),
    itinerary: itinerary(record.itinerary),
    includes: stringArray(record.includes),
    notIncludes: stringArray(record.notIncludes),
    whatToBring: stringArray(record.whatToBring),
    importantNotes: stringArray(record.importantNotes),
    seoTitle: text(record.seoTitle),
    seoDescription: text(record.seoDescription),
    isActive: boolean(record.isActive, true),
    isFeatured: boolean(record.isFeatured),
    sortOrder: Math.max(0, Math.trunc(number(record.sortOrder))),
    sourceFile: text(record.sourceFile),
  };

  if (kind === 'package') {
    return { ...base, kind, destinations };
  }
  return { ...base, kind };
};
