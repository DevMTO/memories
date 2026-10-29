// PocketBase del proyecto: descarga el binario en pocketbase/bin/ (misma versión
// que la del VPS, leída de pocketbase/version) y lo ejecuta con las migraciones
// y hooks del kit (módulos de pocketbase/kit.json) más los del proyecto
// (pocketbase/pb_migrations, pocketbase/pb_hooks). No usa ningún PocketBase
// instalado en el sistema. Se corre desde la raíz del proyecto:
//
//   serve              → servidor en 127.0.0.1:$PB_PORT (8090 por defecto)
//   superuser          → crea/actualiza el superusuario (POCKETBASE_SUPERUSER_*)
//   install            → solo descarga el binario
//   assemble <dir>     → junta migraciones y hooks en <dir>/pb_migrations y
//                        <dir>/pb_hooks (lo usan serve, schema y kit/deploy/build.sh)
//   schema <out.ts>    → tipos de las colecciones con pocketbase-typegen
//
// serve trabaja sobre una copia (pocketbase/.run/): al cambiar un hook o una
// migración hay que reiniciarlo.
import { spawnSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chmod, cp, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const KIT_PB = fileURLToPath(new URL('..', import.meta.url));
const PB_DIR = join(ROOT, 'pocketbase');
const BIN_DIR = join(PB_DIR, 'bin');
const BIN = join(BIN_DIR, process.platform === 'win32' ? 'pocketbase.exe' : 'pocketbase');
const DATA_DIR = join(PB_DIR, 'pb_data');
const RUN_DIR = join(PB_DIR, '.run');

async function wantedVersion() {
  const version = (await readFile(join(PB_DIR, 'version'), 'utf8')).trim();
  if (!version) throw new Error('pocketbase/version está vacío.');
  return version;
}

function installedVersion() {
  if (!existsSync(BIN)) return null;
  const out = spawnSync(BIN, ['--version'], { encoding: 'utf8' }).stdout ?? '';
  return out.match(/version\s+(\S+)/)?.[1] ?? null;
}

async function install() {
  const version = await wantedVersion();
  if (installedVersion() === version) return;

  const os = { linux: 'linux', darwin: 'darwin', win32: 'windows' }[process.platform as string];
  const arch = { x64: 'amd64', arm64: 'arm64' }[process.arch as string];
  if (!os || !arch) throw new Error(`Plataforma no soportada: ${process.platform}/${process.arch}`);

  const url = `https://github.com/pocketbase/pocketbase/releases/download/v${version}/pocketbase_${version}_${os}_${arch}.zip`;
  console.log(`Descargando PocketBase ${version} (${os}/${arch})…`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo descargar ${url}: HTTP ${res.status}`);

  await rm(BIN_DIR, { recursive: true, force: true });
  await mkdir(BIN_DIR, { recursive: true });
  const zip = join(BIN_DIR, 'pocketbase.zip');
  await writeFile(zip, Buffer.from(await res.arrayBuffer()));

  // Node no descomprime zip: unzip (Linux/macOS) o tar/bsdtar (macOS/Windows).
  const unzip = spawnSync('unzip', ['-oq', zip, '-d', BIN_DIR]);
  if (unzip.error || unzip.status !== 0) {
    const tar = spawnSync('tar', ['-xf', zip, '-C', BIN_DIR]);
    if (tar.error || tar.status !== 0) throw new Error('No se pudo descomprimir: instala unzip.');
  }
  await rm(zip);
  await chmod(BIN, 0o755);
  console.log(`PocketBase ${installedVersion()} listo en pocketbase/bin/.`);
}

// Módulos del kit que usa el proyecto: core (editor, publicaciones, historial)
// siempre; i18n (correcciones de traducción) si lo pide.
async function modules(): Promise<string[]> {
  const file = join(PB_DIR, 'kit.json');
  const wanted: string[] = existsSync(file) ? JSON.parse(await readFile(file, 'utf8')).modules ?? [] : [];
  return [...new Set(['core', ...wanted])];
}

// Copia los archivos de cada origen a `to`; un mismo nombre en dos orígenes es un error.
async function merge(sources: string[], to: string) {
  await mkdir(to, { recursive: true });
  const seen = new Map<string, string>();
  for (const dir of sources) {
    if (!existsSync(dir)) continue;
    for (const name of await readdir(dir)) {
      if (seen.has(name)) throw new Error(`${name} está en ${seen.get(name)} y en ${dir}.`);
      seen.set(name, dir);
      await cp(join(dir, name), join(to, name), { recursive: true });
    }
  }
}

async function assemble(out: string) {
  const mods = await modules();
  await rm(out, { recursive: true, force: true });
  for (const kind of ['migrations', 'hooks']) {
    await merge(
      [...mods.map((mod) => join(KIT_PB, mod, kind)), join(PB_DIR, `pb_${kind}`)],
      join(out, `pb_${kind}`),
    );
  }
}

function run(args: string[]) {
  const child = spawn(BIN, args, { stdio: 'inherit', env: process.env });
  child.on('exit', (code) => process.exit(code ?? 0));
  for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => child.kill(signal));
}

function exec(cmd: string, args: string[]) {
  const result = spawnSync(cmd, args, { stdio: 'inherit' });
  if (result.error || result.status !== 0) process.exit(result.status ?? 1);
}

// Como schema.rs en Diesel: aplica las migraciones a una base vacía y temporal y
// pasa sus colecciones a pocketbase-typegen. No depende de pocketbase/pb_data ni
// de un servidor corriendo. Se commitea el resultado.
async function schema(out: string) {
  const tmp = await mkdtemp(join(tmpdir(), 'pb-schema-'));
  try {
    await assemble(join(tmp, 'run'));
    const dataDir = join(tmp, 'pb_data');
    // Con los hooks: las migraciones cargan helpers con require(`${__hooks}/…`).
    const migrate = spawnSync(
      BIN,
      ['migrate', 'up', `--dir=${dataDir}`, `--migrationsDir=${join(tmp, 'run', 'pb_migrations')}`, `--hooksDir=${join(tmp, 'run', 'pb_hooks')}`],
      { encoding: 'utf8' },
    );
    if (migrate.status !== 0) throw new Error(`Falló migrate up:\n${migrate.stdout}${migrate.stderr}`);

    // Mismo formato que "Export collections" del dashboard, que es lo que lee --json.
    const db = new DatabaseSync(join(dataDir, 'data.db'), { readOnly: true });
    const rows = db.prepare('SELECT * FROM _collections ORDER BY name').all() as Record<string, any>[];
    db.close();
    const collections = rows.map((row) => ({
      ...row,
      system: !!row.system,
      fields: JSON.parse(row.fields),
      indexes: JSON.parse(row.indexes),
      ...JSON.parse(row.options || '{}'),
    }));
    const json = join(tmp, 'collections.json');
    await writeFile(json, JSON.stringify(collections));

    exec(process.execPath, [join(ROOT, 'node_modules', 'pocketbase-typegen', 'dist', 'cli.js'), '--json', json, '--out', out]);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
}

const [command, arg] = process.argv.slice(2);

if (command === 'assemble') {
  if (!arg) throw new Error('Uso: pocketbase.ts assemble <carpeta>');
  await assemble(resolve(arg));
} else {
  await install();
  if (command === 'serve') {
    await assemble(RUN_DIR);
    run([
      'serve',
      `--http=127.0.0.1:${process.env.PB_PORT || 8090}`,
      `--dir=${DATA_DIR}`,
      `--migrationsDir=${join(RUN_DIR, 'pb_migrations')}`,
      `--hooksDir=${join(RUN_DIR, 'pb_hooks')}`,
    ]);
  } else if (command === 'superuser') {
    const { POCKETBASE_SUPERUSER_EMAIL: email, POCKETBASE_SUPERUSER_PASSWORD: password } = process.env;
    if (!email || !password) throw new Error('Faltan POCKETBASE_SUPERUSER_EMAIL / POCKETBASE_SUPERUSER_PASSWORD en .env.');
    run(['superuser', 'upsert', email, password, `--dir=${DATA_DIR}`]);
  } else if (command === 'schema') {
    if (!arg) throw new Error('Uso: pocketbase.ts schema <archivo.ts>');
    await schema(resolve(arg));
  } else if (command !== 'install') {
    console.error('Uso: node kit/pocketbase/scripts/pocketbase.ts <serve|superuser|install|assemble|schema>');
    process.exit(1);
  }
}
