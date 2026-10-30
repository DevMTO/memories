// Traduce lo que falte antes de generar las páginas, en `astro build` y
// `astro dev`, para todos los idiomas de ENABLED_LANGS salvo el idioma fuente.
// Además publica para /admin /_i18n/<idioma>.json (español → texto mostrado) y
// /_i18n/<idioma>.auto.json (solo la traducción automática, sin correcciones), y
// /_i18n/ids.json: hash de cada texto en español → el texto, para leer las marcas de
// las páginas (ver core.ts). Solo en la vista previa del editor (PREVIEW=1), que es
// lo que sirve editor.<dominio> donde vive /admin: el sitio público no los necesita
// (y subirlos sería tráfico de salida). Solo con los textos de ese build: la caché
// guarda también lo que ya no se usa (fill.ts). En dev, middleware.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { sourceLang, type Lang } from './locales.ts';
import { fillTranslations, type TranslationConfig } from './fill.ts';
import { SOURCES_FILE, sourceHash } from './core.ts';
import { autoDictionary, shownDictionary } from './runtime.ts';

const DICTIONARY_PATH = /^\/_i18n\/([a-z]{2,3}(?:-[A-Z]{2})?)(\.auto)?\.json$/;

export function translations(langs: Lang[], config: TranslationConfig): AstroIntegration {
  return {
    name: 'translations',
    hooks: {
      'astro:config:setup': async ({ command, logger }) => {
        if (command !== 'build' && command !== 'dev') return;
        await fillTranslations(
          langs.filter((lang) => lang !== sourceLang),
          config,
          logger,
        );
      },
      'astro:server:setup': ({ server }) => {
        server.middlewares.use((req, res, next) => {
          const [, lang, auto] = req.url?.split('?')[0].match(DICTIONARY_PATH) ?? [];
          if (!lang || !langs.includes(lang) || lang === sourceLang) return next();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(auto ? autoDictionary(lang) : shownDictionary(lang)));
        });
      },
      'astro:build:done': async ({ dir }) => {
        if (process.env.PREVIEW !== '1') return;
        const out = fileURLToPath(new URL('_i18n/', dir));
        await mkdir(out, { recursive: true });
        const sources: string[] = JSON.parse(await readFile(SOURCES_FILE, 'utf8').catch(() => '[]'));
        const used = (dict: Record<string, string>) =>
          Object.fromEntries(sources.filter((s) => s in dict).map((s) => [s, dict[s]]));
        for (const lang of langs.filter((l) => l !== sourceLang)) {
          await writeFile(`${out}${lang}.json`, JSON.stringify(used(shownDictionary(lang))));
          await writeFile(`${out}${lang}.auto.json`, JSON.stringify(used(autoDictionary(lang))));
        }
        await writeFile(`${out}ids.json`, JSON.stringify(Object.fromEntries(sources.map((s) => [sourceHash(s), s]))));
      },
    },
  };
}
