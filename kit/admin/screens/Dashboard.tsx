// Tablero: estado del último deploy, cambios sin publicar e historial.
import { config } from '../config';
import type { RecordModel } from '../lib/pocketbase';
import { PublishButton, STATUS_LABEL, pendingText, usePublish } from '../lib/publish';

const formatDate = (iso: string) =>
  new Date(iso.replace(' ', 'T')).toLocaleString(config().locale ?? 'es-PE', { dateStyle: 'medium', timeStyle: 'short' });

// Por qué se lanzó: el botón Publicar o un push del desarrollador a deploy.
function Reason({ publish }: { publish: RecordModel }) {
  if (!publish.commit) return <>Publicado desde /admin</>;
  const sha = publish.commit.slice(0, 7);
  return (
    <>
      Cambio de código:{' '}
      {publish.commit_url ? (
        <a href={publish.commit_url} target="_blank" rel="noopener">
          <code>{sha}</code>
        </a>
      ) : (
        <code>{sha}</code>
      )}{' '}
      {publish.commit_message}
      {publish.pushed_by && <span className="muted"> ({publish.pushed_by})</span>}
    </>
  );
}

export function Dashboard() {
  const { history, error, pending } = usePublish();
  const latest = history?.[0];

  return (
    <section>
      <header className="screen-header">
        <h1>Inicio</h1>
        <PublishButton />
      </header>

      <div className="cards">
        <article className="card">
          <h2>Último deploy</h2>
          {error && <p className="notice-error">{error}</p>}
          {!history && !error && <p className="muted">Cargando…</p>}
          {history && !latest && <p className="muted">Todavía no se publicó desde aquí.</p>}
          {latest && (
            <>
              <p>
                <span className={`badge badge-${latest.status}`}>{STATUS_LABEL[latest.status] ?? latest.status}</span>{' '}
                <span className="muted">{formatDate(latest.created)}</span>
              </p>
              <p>
                <Reason publish={latest} />
              </p>
              {latest.status === 'failed' && latest.message && <p className="notice-error">{latest.message}</p>}
              {latest.run_url && (
                <p>
                  <a href={latest.run_url} target="_blank" rel="noopener">
                    Ver detalles técnicos ↗
                  </a>
                </p>
              )}
            </>
          )}
        </article>

        <article className="card">
          <h2>Cambios sin publicar</h2>
          {pending === null && <p className="muted">Cargando…</p>}
          {pending && pending.length === 0 && <p>Todo lo guardado ya está en el sitio.</p>}
          {pending && pending.length > 0 && (
            <ul className="plain">
              {pending.map((row) => (
                <li key={row.label}>
                  {row.href ? <a href={row.href}>{row.label}</a> : row.label}: {pendingText(row)}
                </li>
              ))}
            </ul>
          )}
          <p className="field-help">Guardar no cambia el sitio: esto sube con el próximo "Publicar".</p>
        </article>
      </div>

      {history && history.length > 1 && (
        <article className="card">
          <h2>Historial</h2>
          <table className="table">
            <tbody>
              {history.map((r) => (
                <tr key={r.id}>
                  <td>{formatDate(r.created)}</td>
                  <td>
                    <span className={`badge badge-${r.status}`}>{STATUS_LABEL[r.status] ?? r.status}</span>
                  </td>
                  <td>
                    <Reason publish={r} />
                  </td>
                  <td>
                    {r.run_url && (
                      <a href={r.run_url} target="_blank" rel="noopener">
                        detalles
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      )}
    </section>
  );
}
