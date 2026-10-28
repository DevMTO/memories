// Contenido inicial del sitio con la forma de los registros de PocketBase (ver
// kit/content/seed.ts): el catálogo (src/data/catalog.seed.json), las páginas de
// destino y los datos de contacto. Lo usan `npm run dev`, `npm run build:static` y
// `npm run pb:import`. Las imágenes son las de public/.
import { defineSeed, readJson, type Seed } from '#kit/content/seed.ts';

const DATA = 'src/data/';

async function load(): Promise<Seed> {
  const catalog: Record<string, any>[] = await readJson(`${DATA}catalog.seed.json`);
  const destinations: Record<string, any>[] = await readJson(`${DATA}destinations.seed.json`);
  const settings = await readJson(`${DATA}settings.seed.json`);

  return {
    destinations: destinations.map(({ image, ...fields }) => ({
      id: fields.slug,
      fields: { ...fields, status: 'published' },
      images: { image },
    })),
    products: catalog.map((p) => ({
      id: p.slug,
      fields: {
        kind: p.kind,
        title: p.title,
        slug: p.slug,
        status: p.isActive === false ? 'draft' : 'published',
        sort_order: p.sortOrder ?? 0,
        is_featured: !!p.isFeatured,
        short_description: p.shortDescription,
        description: p.description,
        price: p.price,
        duration_days: p.durationDays,
        duration_nights: p.durationNights,
        destination_name: p.destinationName,
        destination_slug: p.destinationSlug,
        location: p.location,
        cities: p.cities ?? [],
        destinations: p.kind === 'package' ? (p.destinations ?? []) : [],
        features: p.features ?? [],
        highlights: p.highlights ?? [],
        itinerary: p.itinerary ?? [],
        includes: p.includes ?? [],
        not_includes: p.notIncludes ?? [],
        what_to_bring: p.whatToBring ?? [],
        important_notes: p.importantNotes ?? [],
        seo_title: p.seoTitle,
        seo_description: p.seoDescription,
      },
      images: { cover: p.imageUrl, gallery: p.gallery ?? [] },
    })),
    settings: [{ id: 'settings', fields: settings, images: {} }],
  };
}

export const seed = defineSeed({ load });
