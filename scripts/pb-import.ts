// Importa a PocketBase el contenido inicial (src/lib/seed.ts; ver
// kit/pocketbase/scripts/import.ts): crea lo que falta y completa lo vacío, sin
// pisar lo editado en /admin.
//
//   npm run pb:import        → PocketBase local (.env)
//   npm run pb:import:prod   → producción (.env.production)
//   … -- --optimize          → imágenes reducidas y en WebP
//   … -- --overwrite         → los registros que ya existen vuelven a los valores del seed
import { importSeed, key } from '#kit/pocketbase/scripts/import.ts';
import { seed } from '#src/lib/seed.ts';

await importSeed({
  seed,
  matchKey: {
    destinations: (f) => key(f.slug),
    products: (f) => key(f.slug),
    settings: () => '',
  },
  userAgent: `memories-import/1.0 (${process.env.SITE_URL || 'https://memoriestravel.com'})`,
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
