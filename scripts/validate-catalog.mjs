import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const catalogPath = resolve(projectRoot, 'src/data/catalog.seed.json');
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
const errors = [];

const fail = (message) => errors.push(message);
const requireText = (value, label) => {
  if (typeof value !== 'string' || value.trim().length === 0) fail(`${label} debe tener texto.`);
};
const validateList = (value, label) => {
  if (!Array.isArray(value)) {
    fail(`${label} debe ser una lista.`);
    return;
  }
  value.forEach((item, index) => requireText(item, `${label}[${index}]`));
};
const validateLocalImage = (value, label) => {
  requireText(value, label);
  if (typeof value !== 'string' || !value.startsWith('/')) {
    fail(`${label} debe ser una ruta local que empiece con /.`);
    return;
  }
  const filePath = resolve(projectRoot, 'public', value.replace(/^\/+/, ''));
  if (!existsSync(filePath)) fail(`${label} no existe: ${value}`);
};

if (!Array.isArray(catalog)) fail('El catálogo raíz debe ser una lista.');
if (catalog.length !== 25) fail(`Se esperaban 25 productos y se encontraron ${catalog.length}.`);

const ids = new Set();
const slugs = new Set();
const sourceFiles = new Set();
const counts = { tour: 0, trekking: 0, package: 0 };

for (const [index, product] of catalog.entries()) {
  const prefix = `Producto ${index + 1}`;
  requireText(product.id, `${prefix}.id`);
  requireText(product.slug, `${prefix}.slug`);
  requireText(product.title, `${prefix}.title`);
  requireText(product.description, `${prefix}.description`);
  requireText(product.shortDescription, `${prefix}.shortDescription`);
  requireText(product.destinationName, `${prefix}.destinationName`);
  requireText(product.sourceFile, `${prefix}.sourceFile`);

  if (ids.has(product.id)) fail(`ID duplicado: ${product.id}`);
  if (slugs.has(product.slug)) fail(`Slug duplicado: ${product.slug}`);
  ids.add(product.id);
  slugs.add(product.slug);
  if (sourceFiles.has(product.sourceFile)) fail(`Archivo fuente duplicado: ${product.sourceFile}`);
  sourceFiles.add(product.sourceFile);

  if (!(product.kind in counts)) fail(`${prefix}.kind no es válido: ${product.kind}`);
  else counts[product.kind] += 1;

  if (!Number.isInteger(product.durationDays) || product.durationDays < 1) {
    fail(`${prefix}.durationDays debe ser un entero positivo.`);
  }
  if (!Number.isInteger(product.durationNights) || product.durationNights < 0) {
    fail(`${prefix}.durationNights debe ser un entero mayor o igual a cero.`);
  }

  if (!Array.isArray(product.itinerary) || product.itinerary.length === 0) {
    fail(`${prefix}.itinerary debe incluir al menos un día.`);
  } else {
    if (product.itinerary.length !== product.durationDays) {
      fail(`${prefix}: duración ${product.durationDays} no coincide con ${product.itinerary.length} días de itinerario.`);
    }
    product.itinerary.forEach((day, dayIndex) => {
      const dayPrefix = `${prefix}.itinerary[${dayIndex}]`;
      if (day.day !== dayIndex + 1) fail(`${dayPrefix}.day debe ser ${dayIndex + 1}.`);
      requireText(day.title, `${dayPrefix}.title`);
      requireText(day.description, `${dayPrefix}.description`);
      validateList(day.meals ?? [], `${dayPrefix}.meals`);
      validateList(day.includes ?? [], `${dayPrefix}.includes`);
      validateList(day.notIncludes ?? [], `${dayPrefix}.notIncludes`);
    });
  }

  for (const field of ['features', 'highlights', 'includes', 'notIncludes', 'whatToBring', 'importantNotes', 'cities']) {
    validateList(product[field] ?? [], `${prefix}.${field}`);
  }

  const contaminatedIncludes = (product.includes ?? []).filter((item) => /^no\s+incluye\b/i.test(item));
  const contaminatedExcludes = (product.notIncludes ?? []).filter((item) => /^incluye\b/i.test(item));
  if (contaminatedIncludes.length) fail(`${prefix}.includes contiene encabezados de “No incluye”.`);
  if (contaminatedExcludes.length) fail(`${prefix}.notIncludes contiene encabezados de “Incluye”.`);

  validateLocalImage(product.imageUrl, `${prefix}.imageUrl`);
  if (!Array.isArray(product.gallery) || product.gallery.length === 0) {
    fail(`${prefix}.gallery debe contener imágenes.`);
  } else {
    product.gallery.forEach((image, imageIndex) => validateLocalImage(image, `${prefix}.gallery[${imageIndex}]`));
  }

  if (product.kind === 'package') {
    if (!Array.isArray(product.destinations) || product.destinations.length === 0) {
      fail(`${prefix}.destinations debe incluir destinos para un paquete.`);
    } else {
      product.destinations.forEach((destination, destinationIndex) => {
        requireText(destination.name, `${prefix}.destinations[${destinationIndex}].name`);
        requireText(destination.slug, `${prefix}.destinations[${destinationIndex}].slug`);
      });
    }
  }
}

const expectedCounts = { tour: 12, trekking: 8, package: 5 };
for (const [kind, expected] of Object.entries(expectedCounts)) {
  if (counts[kind] !== expected) fail(`Se esperaban ${expected} productos de tipo ${kind} y se encontraron ${counts[kind]}.`);
}

if (errors.length > 0) {
  console.error(`Catálogo inválido: ${errors.length} problema(s).`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Catálogo válido: ${catalog.length} productos (${counts.tour} tours, ${counts.trekking} trekkings y ${counts.package} paquetes).`);
