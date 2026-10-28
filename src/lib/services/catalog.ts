// Catálogo del sitio (tours, trekkings y paquetes). Las páginas leen solo de aquí;
// sale de la colección `products` (PocketBase o el seed, ver src/content.config.ts):
// solo lo publicado, ordenado por sortOrder y título.
import { getCollection } from 'astro:content';
import { localImage } from '#kit/content/images.ts';
import type { Package, Tour, TravelProduct } from '../types';

// Ancho al que se optimizan las imágenes del catálogo (portadas y galerías).
export const IMAGE_WIDTH = 1600;

// Orden por sortOrder y después por título, comparado por código de carácter.
const byOrder = (a: TravelProduct, b: TravelProduct) =>
  (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || (a.title < b.title ? -1 : a.title > b.title ? 1 : 0);

let products: Promise<TravelProduct[]> | undefined;

function load() {
  return (products ??= getCollection('products').then(async (entries) => {
    const list = await Promise.all(
      entries.map(async ({ data }) => {
        const base = {
          ...data,
          id: data.slug,
          isActive: true,
          imageUrl: (await localImage(data.imageUrl, IMAGE_WIDTH)) ?? '/images/hero.webp',
          gallery: (await Promise.all(data.gallery.map((url) => localImage(url, IMAGE_WIDTH)))).filter(
            (url): url is string => !!url,
          ),
        };
        return data.kind === 'package'
          ? ({ ...base, kind: 'package' } as Package)
          : ({ ...base, kind: data.kind } as Tour);
      }),
    );
    return list.sort(byOrder);
  }));
}

const isTour = (product: TravelProduct): product is Tour => product.kind !== 'package';
const isPackage = (product: TravelProduct): product is Package => product.kind === 'package';

/** Tours y trekkings. */
export async function getAll(): Promise<Tour[]> {
  return (await load()).filter(isTour);
}

export async function getById(id: string): Promise<Tour | null> {
  return (await getAll()).find((tour) => tour.id === id) ?? null;
}

export async function getBySlug(slug: string): Promise<Tour | null> {
  return (await getAll()).find((tour) => tour.slug === slug) ?? null;
}

export async function getFeatured(): Promise<Tour[]> {
  return (await getAll()).filter((tour) => tour.isFeatured);
}

export async function getPackages(): Promise<Package[]> {
  return (await load()).filter(isPackage);
}

export async function getPackageById(id: string): Promise<Package | null> {
  return (await getPackages()).find((pkg) => pkg.id === id) ?? null;
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  return (await getPackages()).find((pkg) => pkg.slug === slug) ?? null;
}
