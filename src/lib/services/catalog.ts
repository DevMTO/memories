// Catálogo del sitio (tours, trekkings y paquetes). Las páginas leen solo de aquí;
// por ahora sale de src/data/catalog.seed.json. Solo lo activo, ordenado por
// sortOrder y título.
import seedCatalog from '../../data/catalog.seed.json' with { type: 'json' };
import type { Package, Tour, TravelProduct } from '../types';

// Valores por defecto de los campos que el JSON puede omitir.
function normalize(product: TravelProduct): TravelProduct {
  const base = {
    ...product,
    shortDescription: product.shortDescription || '',
    description: product.description || '',
    price: product.price || 0,
    durationDays: product.durationDays || 1,
    durationNights: product.durationNights || 0,
    destinationName: product.destinationName || 'Perú',
    destinationSlug: product.destinationSlug || 'peru',
    location: product.location || 'Perú',
    imageUrl: product.imageUrl || '/images/hero.webp',
    cities: product.cities || [],
    gallery: product.gallery || [],
    features: product.features || [],
    highlights: product.highlights || [],
    itinerary: product.itinerary || [],
    includes: product.includes || [],
    notIncludes: product.notIncludes || [],
    whatToBring: product.whatToBring || [],
    importantNotes: product.importantNotes || [],
    seoTitle: product.seoTitle || '',
    seoDescription: product.seoDescription || '',
    isActive: product.isActive !== false,
    isFeatured: Boolean(product.isFeatured),
    sortOrder: product.sortOrder || 0,
    sourceFile: product.sourceFile || '',
  };
  return product.kind === 'package'
    ? { ...base, kind: 'package', destinations: product.destinations || [] }
    : ({ ...base, kind: product.kind } as Tour);
}

// Orden por sortOrder y después por título, comparado por código de carácter.
const byOrder = (a: TravelProduct, b: TravelProduct) =>
  (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || (a.title < b.title ? -1 : a.title > b.title ? 1 : 0);

const active = (seedCatalog as TravelProduct[]).map(normalize).filter((p) => p.isActive).sort(byOrder);

const isTour = (product: TravelProduct): product is Tour => product.kind !== 'package';
const isPackage = (product: TravelProduct): product is Package => product.kind === 'package';

/** Tours y trekkings. */
export async function getAll(): Promise<Tour[]> {
  return active.filter(isTour);
}

export async function getById(id: string): Promise<Tour | null> {
  return active.filter(isTour).find((tour) => tour.id === id) ?? null;
}

export async function getBySlug(slug: string): Promise<Tour | null> {
  return active.filter(isTour).find((tour) => tour.slug === slug) ?? null;
}

export async function getFeatured(): Promise<Tour[]> {
  return active.filter(isTour).filter((tour) => tour.isFeatured);
}

export async function getPackages(): Promise<Package[]> {
  return active.filter(isPackage);
}

export async function getPackageById(id: string): Promise<Package | null> {
  return active.filter(isPackage).find((pkg) => pkg.id === id) ?? null;
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  return active.filter(isPackage).find((pkg) => pkg.slug === slug) ?? null;
}
