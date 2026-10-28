// Páginas de destino (colección `destinations`): textos e imagen de cabecera.
import { getCollection } from 'astro:content';
import { localImage } from '#kit/content/images.ts';
import { IMAGE_WIDTH } from './catalog';

export type DestinationPage = {
  slug: string;
  name: string;
  imageUrl: string;
  eyebrow: string;
  title: string;
  description: string;
  altitude?: string;
  climate?: string;
  bestSeason?: string;
};

export async function getDestinationPages(): Promise<DestinationPage[]> {
  const entries = (await getCollection('destinations')).sort((a, b) => a.data.sortOrder - b.data.sortOrder);
  return Promise.all(
    entries.map(async ({ data: { sortOrder, imageUrl, ...data } }) => ({
      ...data,
      imageUrl: (await localImage(imageUrl, IMAGE_WIDTH)) ?? '/images/hero.webp',
    })),
  );
}

export async function getDestinationPage(slug: string) {
  return (await getDestinationPages()).find((destination) => destination.slug === slug) ?? null;
}
