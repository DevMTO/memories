// Qué campos del catálogo se traducen (con la forma de src/lib/records.ts). Slugs,
// URLs, precios y nombres de lugares quedan igual.
import type { FieldSpec } from '#kit/i18n/core.ts';

export const productFields: FieldSpec = {
  text: ['title', 'shortDescription', 'description', 'seoTitle', 'seoDescription'],
  lists: ['features', 'highlights', 'includes', 'notIncludes', 'whatToBring', 'importantNotes'],
  nested: {
    itinerary: { text: ['title', 'description', 'accommodations'], lists: ['meals', 'includes', 'notIncludes'] },
  },
};

export const destinationFields: FieldSpec = {
  text: ['eyebrow', 'title', 'description', 'climate', 'bestSeason'],
};
