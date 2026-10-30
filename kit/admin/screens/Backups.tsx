// "Copias de seguridad" (#/copias): las copias de PocketBase que hay en la VM, subir
// una (p. ej. la bajada después de publicar) y restaurar. Restaurar reemplaza TODO el
// contenido; antes se guarda una copia del estado actual para poder deshacerlo. Ver
// kit/pocketbase/core/hooks/backups.pb.js y "Copias de seguridad" en kit/deploy/vps.md.
import { useEffect, useState } from 'react';
import { config } from '../config';
import { errorMessage, pb } from '../lib/pocketbase';

type Backup = { key: string; size: number; time: number; kind: string };

const KIND_LABEL: Record<string, string> = {
  publish: 'Después de publicar',
  uploaded: 'Subida desde /admin',
  'before-restore': 'Antes de restaurar (para deshacer)',
  other: 'Otra',
};

const CONFIRM_WORD = 'RESTAURAR';

const formatDate = (seconds: number) =>
  new Date(seconds * 1000).toLocaleString(config().locale ?? 'es-PE', { dateStyle: 'medium', timeStyle: 'short' });
const megabytes = (bytes: number) => `${(bytes / 1048576).toFixed(1)} MB`;

// Después de restaurar, PocketBase se reinicia: se espera a que responda otra vez.
async function waitForRestart() {
  for (let i = 0; i < 120; i++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const ok = await fetch(pb().buildURL('/api/health'))
      .then((res) => res.ok)
      .catch(() => false);
    if (ok) return;
  }
  throw new Error('PocketBase no volvió a responder. Avisa a quien administra el sitio.');
}

export function Backups() {
  const [backups, setBackups] = useState<Backup[] | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const load = () =>
    pb()
      .send('/api/editor/backups', { method: 'GET' })
      .then(
        (res) => setBackups(res.backups),
        (err) => setError(errorMessage(err)),
      );

  useEffect(() => {
    load();
  }, []);

  async function upload() {
    if (!file) return;
    setBusy('Subiendo la copia…');
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      await pb().send('/api/editor/backups/upload', { method: 'POST', body });
      setFile(null);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy('');
    }
  }

  async function restore(backup: Backup) {
    const answer = prompt(
      `Restaurar la copia del ${formatDate(backup.time)} reemplaza TODO el contenido del editor por el de esa copia ` +
        '(lo guardado después se pierde; antes se guarda una copia del estado actual para poder deshacerlo).\n\n' +
        'El sitio publicado no cambia hasta que publiques.\n\n' +
        `Escribe ${CONFIRM_WORD} para confirmar:`,
    );
    if (answer?.trim().toUpperCase() !== CONFIRM_WORD) return;
    setBusy('Restaurando… PocketBase se reinicia; tarda unos segundos.');
    setError('');
    // La respuesta normalmente no llega (el proceso se reinicia a mitad).
    await pb()
      .send('/api/editor/backups/restore', { method: 'POST', body: { key: backup.key } })
      .catch((err) => {
        if (err?.status && err.status !== 0) throw err;
      })
      .then(waitForRestart)
      .then(
        () => location.reload(),
        (err) => {
          setError(errorMessage(err));
          setBusy('');
        },
      );
  }

  return (
    <section>
      <header className="screen-header">
        <h1>Copias de seguridad</h1>
      </header>

      {busy && (
        <div className="publish-status is-running" role="status">
          {busy}
        </div>
      )}
      {error && <p className="notice-error">{error}</p>}

      <article className="card">
        <h2>En el servidor</h2>
        <p className="field-help">
          Se guarda una al publicar cambios de contenido (las 5 últimas), además de las subidas y las de antes de
          restaurar (las 3 últimas de cada una). Restaurar cambia el contenido del editor y la vista previa; el sitio
          publicado cambia cuando publicas.
        </p>
        {!backups && !error && <p className="muted">Cargando…</p>}
        {backups && backups.length === 0 && <p>Todavía no hay copias.</p>}
        {backups && backups.length > 0 && (
          <table className="table">
            <tbody>
              {backups.map((b) => (
                <tr key={b.key}>
                  <td>{formatDate(b.time)}</td>
                  <td>{KIND_LABEL[b.kind] ?? b.kind}</td>
                  <td className="muted">{megabytes(b.size)}</td>
                  <td>
                    <button type="button" className="btn btn-ghost" disabled={!!busy} onClick={() => restore(b)}>
                      Restaurar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </article>

      <article className="card">
        <h2>Subir una copia</h2>
        <p className="field-help">
          Un .zip de copia de seguridad, por ejemplo el que bajaste después de publicar. Queda en la lista de arriba para
          restaurarlo.
        </p>
        <p className="inline-actions">
          <input
            type="file"
            accept=".zip,application/zip"
            disabled={!!busy}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <button type="button" className="btn" disabled={!file || !!busy} onClick={upload}>
            Subir
          </button>
        </p>
      </article>
    </section>
  );
}
