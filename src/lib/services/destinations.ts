// Páginas de destino (colección `destinations`): textos e imagen de cabecera.
import { getCollection } from 'astro:content';
import { localImage } from '#kit/content/images.ts';
import { localizeRecord } from '#kit/i18n/core.ts';
import { getTranslate } from '#kit/i18n/runtime.ts';
import { sourceLang, type Lang } from '#kit/i18n/locales.ts';
import { destinationFields } from '../../i18n/fields';
import { IMAGE_WIDTH, IMAGE_WIDTH_SMALL } from '../image-sizes';

export type DestinationPage = {
  slug: string;
  name: string;
  imageUrl: string;
  imageUrlSmall?: string;
  eyebrow: string;
  title: string;
  description: string;
  altitude?: string;
  climate?: string;
  bestSeason?: string;
};

export async function getDestinationPages(lang: Lang = sourceLang): Promise<DestinationPage[]> {
  const entries = (await getCollection('destinations')).sort((a, b) => a.data.sortOrder - b.data.sortOrder);
  const translate = getTranslate(lang);
  return Promise.all(
    entries.map(async ({ data: { sortOrder, imageUrl, ...data } }) =>
      localizeRecord(
        {
          ...data,
          imageUrl: (await localImage(imageUrl, IMAGE_WIDTH)) ?? '/images/hero.webp',
          imageUrlSmall: await localImage(imageUrl, IMAGE_WIDTH_SMALL),
        },
        destinationFields,
        translate,
      ),
    ),
  );
}

export async function getDestinationPage(slug: string, lang: Lang = sourceLang) {
  return (await getDestinationPages(lang)).find((destination) => destination.slug === slug) ?? null;
}
