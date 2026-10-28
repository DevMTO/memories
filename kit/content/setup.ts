// Primeras líneas de astro.config.mjs: variables de entorno y origen del contenido.
import { existsSync } from 'node:fs';

// Astro no carga .env en astro.config.mjs. Se cargan con Node en process.env (así
// también los ve el código de las páginas): primero .env.<modo> y después .env;
// `loadEnvFile` no pisa lo ya definido, así que las variables del entorno (p. ej.
// las de build.env en el VPS) tienen prioridad, luego .env.<modo> y al final .env.
//
// Origen del contenido: `astro dev` lee el seed salvo con `--mode pocketbase`
// (npm run dev:pb); `astro build` lee PUBLIC_POCKETBASE_URL salvo con
// `--mode seed` (npm run build:static). Con el seed queda CONTENT_SOURCE=seed.
export function setupEnv(argv = process.argv) {
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  for (const file of [`.env.${mode}`, '.env']) {
    if (existsSync(file)) process.loadEnvFile(file);
  }

  const modeArg = argv.findIndex((arg) => arg === '--mode' || arg.startsWith('--mode='));
  const cliMode = modeArg === -1 ? undefined : argv[modeArg].split('=')[1] ?? argv[modeArg + 1];
  const useSeed = mode === 'development' ? cliMode !== 'pocketbase' : cliMode === 'seed';
  if (useSeed) process.env.CONTENT_SOURCE ??= 'seed';
}

// Para `image.domains`: las imágenes de PocketBase se descargan y optimizan en el build.
export function pocketbaseImageDomains() {
  const url = process.env.PUBLIC_POCKETBASE_URL;
  return url ? [new URL(url).hostname] : [];
}
