import { randomUUID } from 'node:crypto';
import type { DatabaseSync } from 'node:sqlite';
import type {
  Destination,
  ItineraryDay,
  Package,
  Tour,
  TravelProduct,
} from '../../core/domain/models';
import type { ITourRepository } from '../../core/domain/ports/ITourRepository';
import { database } from '../sqlite/database';

type ProductRow = {
  id: string;
  kind: 'tour' | 'trekking' | 'package';
  title: string;
  slug: string;
  short_description: string;
  description: string;
  price: number;
  duration_days: number;
  duration_nights: number;
  destination_name: string;
  destination_slug: string;
  location: string;
  image_url: string;
  cities_json: string;
  destinations_json: string;
  gallery_json: string;
  features_json: string;
  highlights_json: string;
  itinerary_json: string;
  includes_json: string;
  not_includes_json: string;
  what_to_bring_json: string;
  important_notes_json: string;
  seo_title: string;
  seo_description: string;
  is_active: number;
  is_featured: number;
  sort_order: number;
  source_file: string;
  created_at: string;
  updated_at: string;
};

const parseJson = <T>(value: string, fallback: T): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const mapRow = (row: ProductRow): TravelProduct => {
  const base = {
    id: row.id,
    kind: row.kind,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    price: row.price,
    durationDays: row.duration_days,
    durationNights: row.duration_nights,
    destinationName: row.destination_name,
    destinationSlug: row.destination_slug,
    location: row.location,
    imageUrl: row.image_url,
    cities: parseJson<string[]>(row.cities_json, []),
    gallery: parseJson<string[]>(row.gallery_json, []),
    features: parseJson<string[]>(row.features_json, []),
    highlights: parseJson<string[]>(row.highlights_json, []),
    itinerary: parseJson<ItineraryDay[]>(row.itinerary_json, []),
    includes: parseJson<string[]>(row.includes_json, []),
    notIncludes: parseJson<string[]>(row.not_includes_json, []),
    whatToBring: parseJson<string[]>(row.what_to_bring_json, []),
    importantNotes: parseJson<string[]>(row.important_notes_json, []),
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    isActive: Boolean(row.is_active),
    isFeatured: Boolean(row.is_featured),
    sortOrder: row.sort_order,
    sourceFile: row.source_file,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  if (row.kind === 'package') {
    return {
      ...base,
      kind: 'package',
      destinations: parseJson<{ id?: string; name: string; slug: string }[]>(row.destinations_json, []),
    };
  }

  return { ...base, kind: row.kind };
};

const toParams = (product: TravelProduct) => ({
  id: product.id || randomUUID(),
  kind: product.kind,
  title: product.title,
  slug: product.slug,
  shortDescription: product.shortDescription || '',
  description: product.description || '',
  price: Number(product.price || 0),
  durationDays: Number(product.durationDays || 1),
  durationNights: Number(product.durationNights || 0),
  destinationName: product.destinationName || 'Perú',
  destinationSlug: product.destinationSlug || 'peru',
  location: product.location || 'Perú',
  imageUrl: product.imageUrl || '/images/hero.webp',
  cities: JSON.stringify(product.cities || []),
  destinations: JSON.stringify(product.kind === 'package' ? product.destinations || [] : []),
  gallery: JSON.stringify(product.gallery || []),
  features: JSON.stringify(product.features || []),
  highlights: JSON.stringify(product.highlights || []),
  itinerary: JSON.stringify(product.itinerary || []),
  includes: JSON.stringify(product.includes || []),
  notIncludes: JSON.stringify(product.notIncludes || []),
  whatToBring: JSON.stringify(product.whatToBring || []),
  importantNotes: JSON.stringify(product.importantNotes || []),
  seoTitle: product.seoTitle || '',
  seoDescription: product.seoDescription || '',
  isActive: product.isActive === false ? 0 : 1,
  isFeatured: product.isFeatured ? 1 : 0,
  sortOrder: Number(product.sortOrder || 0),
  sourceFile: product.sourceFile || '',
});

export class SqliteTravelRepository implements ITourRepository {
  private readonly db: DatabaseSync;

  constructor(db: DatabaseSync = database) {
    this.db = db;
  }

  private list(where = '', params: unknown[] = []): TravelProduct[] {
    const rows = this.db
      .prepare(`SELECT * FROM travel_products ${where} ORDER BY sort_order ASC, title ASC`)
      .all(...params) as unknown as ProductRow[];
    return rows.map(mapRow);
  }

  private find(where: string, value: string): TravelProduct | null {
    const row = this.db
      .prepare(`SELECT * FROM travel_products WHERE ${where} = ? LIMIT 1`)
      .get(value) as unknown as ProductRow | undefined;
    return row ? mapRow(row) : null;
  }

  async getAllTours(): Promise<Tour[]> {
    return this.list("WHERE kind IN ('tour', 'trekking') AND is_active = 1") as Tour[];
  }

  async getTourById(id: string): Promise<Tour | null> {
    const product = this.find('id', id);
    return product && product.kind !== 'package' && product.isActive ? product : null;
  }

  async getTourBySlug(slug: string): Promise<Tour | null> {
    const product = this.find('slug', slug);
    return product && product.kind !== 'package' && product.isActive ? product : null;
  }

  async getFeaturedTours(): Promise<Tour[]> {
    return this.list("WHERE kind IN ('tour', 'trekking') AND is_active = 1 AND is_featured = 1") as Tour[];
  }

  async getAllPackages(): Promise<Package[]> {
    return this.list("WHERE kind = 'package' AND is_active = 1") as Package[];
  }

  async getPackageById(id: string): Promise<Package | null> {
    const product = this.find('id', id);
    return product?.kind === 'package' && product.isActive ? product : null;
  }

  async getPackageBySlug(slug: string): Promise<Package | null> {
    const product = this.find('slug', slug);
    return product?.kind === 'package' && product.isActive ? product : null;
  }

  async getFeaturedPackages(): Promise<Package[]> {
    return this.list("WHERE kind = 'package' AND is_active = 1 AND is_featured = 1") as Package[];
  }

  async getDestinations(): Promise<Destination[]> {
    const products = this.list('WHERE is_active = 1');
    const map = new Map<string, Destination>();

    for (const product of products) {
      const destinations = product.kind === 'package'
        ? product.destinations
        : [{ name: product.destinationName, slug: product.destinationSlug }];

      for (const destination of destinations) {
        if (!destination?.slug || map.has(destination.slug)) continue;
        map.set(destination.slug, {
          id: destination.slug,
          name: destination.name,
          slug: destination.slug,
          imageUrl: product.imageUrl,
        });
      }
    }

    return [...map.values()];
  }

  async getToursByDestination(slug: string): Promise<Tour[]> {
    return (await this.getAllTours()).filter((tour) =>
      tour.destinationSlug === slug || tour.cities?.some((city) => city.toLowerCase().includes(slug.replaceAll('-', ' '))),
    );
  }

  async getPackagesByDestination(slug: string): Promise<Package[]> {
    return (await this.getAllPackages()).filter((pkg) =>
      pkg.destinations.some((destination) => destination.slug === slug),
    );
  }

  async getAllProductsForAdmin(): Promise<TravelProduct[]> {
    return this.list();
  }

  async createProduct(product: TravelProduct): Promise<TravelProduct> {
    const params = toParams(product);
    const statement = this.db.prepare(`
      INSERT INTO travel_products (
        id, kind, title, slug, short_description, description, price,
        duration_days, duration_nights, destination_name, destination_slug,
        location, image_url, cities_json, destinations_json, gallery_json,
        features_json, highlights_json, itinerary_json, includes_json,
        not_includes_json, what_to_bring_json, important_notes_json,
        seo_title, seo_description, is_active, is_featured, sort_order, source_file
      ) VALUES (
        @id, @kind, @title, @slug, @shortDescription, @description, @price,
        @durationDays, @durationNights, @destinationName, @destinationSlug,
        @location, @imageUrl, @cities, @destinations, @gallery,
        @features, @highlights, @itinerary, @includes,
        @notIncludes, @whatToBring, @importantNotes,
        @seoTitle, @seoDescription, @isActive, @isFeatured, @sortOrder, @sourceFile
      )
    `);
    statement.setAllowBareNamedParameters(true);
    statement.run(params);
    return this.find('id', params.id)!;
  }

  async updateProduct(id: string, product: TravelProduct): Promise<TravelProduct | null> {
    if (!this.find('id', id)) return null;
    const params = { ...toParams({ ...product, id } as TravelProduct), id };
    const statement = this.db.prepare(`
      UPDATE travel_products SET
        kind = @kind,
        title = @title,
        slug = @slug,
        short_description = @shortDescription,
        description = @description,
        price = @price,
        duration_days = @durationDays,
        duration_nights = @durationNights,
        destination_name = @destinationName,
        destination_slug = @destinationSlug,
        location = @location,
        image_url = @imageUrl,
        cities_json = @cities,
        destinations_json = @destinations,
        gallery_json = @gallery,
        features_json = @features,
        highlights_json = @highlights,
        itinerary_json = @itinerary,
        includes_json = @includes,
        not_includes_json = @notIncludes,
        what_to_bring_json = @whatToBring,
        important_notes_json = @importantNotes,
        seo_title = @seoTitle,
        seo_description = @seoDescription,
        is_active = @isActive,
        is_featured = @isFeatured,
        sort_order = @sortOrder,
        source_file = @sourceFile,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `);
    statement.setAllowBareNamedParameters(true);
    statement.run(params);
    return this.find('id', id);
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = this.db.prepare('DELETE FROM travel_products WHERE id = ?').run(id);
    return result.changes > 0n;
  }
}
