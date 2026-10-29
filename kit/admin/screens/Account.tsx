// "Mi cuenta" (#/cuenta): el correo con el que entra el editor y el cambio de su
// contraseña. El correo no se cambia aquí (PocketBase solo deja a un superusuario);
// si olvida la contraseña, el superusuario la cambia en el dashboard (/_/ → editors).
import { useState, type FormEvent } from 'react';
import { ClientResponseError } from 'pocketbase';
import { errorMessage, pb } from '../lib/pocketbase';

const MIN_LENGTH = 8;

export function Account() {
  const email = pb().authStore.record?.email ?? '';
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (password.length < MIN_LENGTH) {
      return setMessage({ kind: 'error', text: `La contraseña nueva debe tener al menos ${MIN_LENGTH} caracteres.` });
    }
    if (password !== confirm) return setMessage({ kind: 'error', text: 'Las contraseñas nuevas no coinciden.' });
    if (password === current) return setMessage({ kind: 'error', text: 'La contraseña nueva es igual a la actual.' });

    setBusy(true);
    setMessage(null);
    try {
      const id = pb().authStore.record!.id;
      await pb().collection('editors').update(id, { oldPassword: current, password, passwordConfirm: confirm });
      // Cambiar la contraseña cierra las sesiones abiertas, esta incluida: se vuelve
      // a entrar con la nueva para seguir trabajando.
      await pb().collection('editors').authWithPassword(email, password);
      setCurrent('');
      setPassword('');
      setConfirm('');
      setMessage({ kind: 'ok', text: 'Contraseña cambiada. Las otras sesiones abiertas (otros equipos) se cerraron.' });
    } catch (err) {
      const wrongCurrent = err instanceof ClientResponseError && err.status === 400 && err.response?.data?.oldPassword;
      setMessage({
        kind: 'error',
        text: wrongCurrent ? 'La contraseña actual no es correcta.' : errorMessage(err),
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <header className="screen-header">
        <h1>Mi cuenta</h1>
      </header>
      <article className="card">
        <p>
          Entras con <strong>{email}</strong>.
        </p>
        <p className="field-help">
          Para cambiar este correo, o si olvidas la contraseña, pídelo a quien administra el sitio.
        </p>
      </article>
      <form className="card record-form" onSubmit={submit}>
        <h2>Cambiar contraseña</h2>
        <div className="field">
          <label className="field-label" htmlFor="account-current">
            Contraseña actual
          </label>
          <input
            id="account-current"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="account-new">
            Contraseña nueva
          </label>
          <input
            id="account-new"
            type="password"
            autoComplete="new-password"
            minLength={MIN_LENGTH}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="field-help">Al menos {MIN_LENGTH} caracteres.</p>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="account-confirm">
            Repite la contraseña nueva
          </label>
          <input
            id="account-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        {message && <p className={`notice-${message.kind}`}>{message.text}</p>}
        <div>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Cambiando…' : 'Cambiar contraseña'}
          </button>
        </div>
      </form>
    </section>
  );
}
