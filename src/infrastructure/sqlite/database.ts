import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';
import seedCatalog from '../../data/catalog.seed.json' with { type: 'json' };
import type { TravelProduct } from '../../core/domain/models';

const configuredPath = process.env.SQLITE_PATH?.trim() || 'data/memories.sqlite';
const databasePath = isAbsolute(configuredPath)
  ? configuredPath
  : resolve(process.cwd(), configuredPath);

mkdirSync(dirname(databasePath), { recursive: true });

const database = new DatabaseSync(databasePath);
database.exec('PRAGMA journal_mode = WAL;');
database.exec('PRAGMA foreign_keys = ON;');
database.exec('PRAGMA busy_timeout = 5000;');

database.exec(`
  CREATE TABLE IF NOT EXISTS travel_products (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL CHECK (kind IN ('tour', 'trekking', 'package')),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    price REAL NOT NULL DEFAULT 0,
    duration_days INTEGER NOT NULL DEFAULT 1,
    duration_nights INTEGER NOT NULL DEFAULT 0,
    destination_name TEXT NOT NULL DEFAULT 'Perú',
    destination_slug TEXT NOT NULL DEFAULT 'peru',
    location TEXT NOT NULL DEFAULT 'Perú',
    image_url TEXT NOT NULL DEFAULT '/images/hero.webp',
    cities_json TEXT NOT NULL DEFAULT '[]',
    destinations_json TEXT NOT NULL DEFAULT '[]',
    gallery_json TEXT NOT NULL DEFAULT '[]',
    features_json TEXT NOT NULL DEFAULT '[]',
    highlights_json TEXT NOT NULL DEFAULT '[]',
    itinerary_json TEXT NOT NULL DEFAULT '[]',
    includes_json TEXT NOT NULL DEFAULT '[]',
    not_includes_json TEXT NOT NULL DEFAULT '[]',
    what_to_bring_json TEXT NOT NULL DEFAULT '[]',
    important_notes_json TEXT NOT NULL DEFAULT '[]',
    seo_title TEXT NOT NULL DEFAULT '',
    seo_description TEXT NOT NULL DEFAULT '',
    is_active INTEGER NOT NULL DEFAULT 1,
    is_featured INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    source_file TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_travel_products_kind_active
    ON travel_products(kind, is_active, sort_order);

  CREATE INDEX IF NOT EXISTS idx_travel_products_destination
    ON travel_products(destination_slug, is_active);
`);

const count = database.prepare('SELECT COUNT(*) AS total FROM travel_products').get() as { total: number | bigint };

if (Number(count.total) === 0) {
  const insert = database.prepare(`
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
  insert.setAllowBareNamedParameters(true);

  const seed = (products: TravelProduct[]) => {
    database.exec('BEGIN IMMEDIATE;');
    try {
      for (const product of products) {
        insert.run({
          id: product.id,
          kind: product.kind,
          title: product.title,
          slug: product.slug,
          shortDescription: product.shortDescription || '',
          description: product.description || '',
          price: product.price || 0,
          durationDays: product.durationDays || 1,
          durationNights: product.durationNights || 0,
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
          sortOrder: product.sortOrder || 0,
          sourceFile: product.sourceFile || '',
        });
      }
      database.exec('COMMIT;');
    } catch (error) {
      database.exec('ROLLBACK;');
      throw error;
    }
  };

  seed(seedCatalog as TravelProduct[]);
}

export { database, databasePath };
