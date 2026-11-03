// Catálogo del sitio (tours, trekkings y paquetes). Las páginas leen solo de aquí;
// sale de la colección `products` (PocketBase o el seed, ver src/content.config.ts):
// solo lo publicado, ordenado por sortOrder y título, en el idioma pedido.
import { getCollection } from 'astro:content';
import { localImage } from '#kit/content/images.ts';
import { localizeRecord } from '#kit/i18n/core.ts';
import { getTranslate } from '#kit/i18n/runtime.ts';
import { sourceLang, type Lang } from '#kit/i18n/locales.ts';
import { productFields } from '../../i18n/fields';
import { IMAGE_WIDTH, IMAGE_WIDTH_SMALL } from '../image-sizes';
import type { Package, Tour, TravelProduct } from '../types';

// Orden por sortOrder y después por título, comparado por código de carácter.
const byOrder = (a: TravelProduct, b: TravelProduct) =>
  (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || (a.title < b.title ? -1 : a.title > b.title ? 1 : 0);

let products: Promise<TravelProduct[]> | undefined;
const translated = new Map<Lang, Promise<TravelProduct[]>>();

function loadSource() {
  return (products ??= getCollection('products').then(async (entries) => {
    const list = await Promise.all(
      entries.map(async ({ data }) => {
        const base = {
          ...data,
          id: data.slug,
          isActive: true,
          imageUrl: (await localImage(data.imageUrl, IMAGE_WIDTH)) ?? '/images/hero.webp',
          imageUrlSmall: await localImage(data.imageUrl, IMAGE_WIDTH_SMALL),
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

function load(lang: Lang) {
  if (lang === sourceLang) return loadSource();
  let found = translated.get(lang);
  if (!found) {
    const translate = getTranslate(lang);
    found = loadSource().then((list) => list.map((product) => localizeRecord(product, productFields, translate)));
    translated.set(lang, found);
  }
  return found;
}

const isTour = (product: TravelProduct): product is Tour => product.kind !== 'package';
const isPackage = (product: TravelProduct): product is Package => product.kind === 'package';

/** Tours y trekkings. */
export async function getAll(lang: Lang = sourceLang): Promise<Tour[]> {
  return (await load(lang)).filter(isTour);
}

export async function getById(id: string, lang: Lang = sourceLang): Promise<Tour | null> {
  return (await getAll(lang)).find((tour) => tour.id === id) ?? null;
}

export async function getBySlug(slug: string, lang: Lang = sourceLang): Promise<Tour | null> {
  return (await getAll(lang)).find((tour) => tour.slug === slug) ?? null;
}

export async function getFeatured(lang: Lang = sourceLang): Promise<Tour[]> {
  return (await getAll(lang)).filter((tour) => tour.isFeatured);
}

export async function getPackages(lang: Lang = sourceLang): Promise<Package[]> {
  return (await load(lang)).filter(isPackage);
}

export async function getPackageById(id: string, lang: Lang = sourceLang): Promise<Package | null> {
  return (await getPackages(lang)).find((pkg) => pkg.id === id) ?? null;
}

export async function getPackageBySlug(slug: string, lang: Lang = sourceLang): Promise<Package | null> {
  return (await getPackages(lang)).find((pkg) => pkg.slug === slug) ?? null;
}
