// Inicio de sesión del editor (colección `editors`). Sin registro ni "olvidé mi
// contraseña": la contraseña es el secreto EDITOR_PASSWORD.
import { useState, type FormEvent } from 'react';
import { ClientResponseError } from 'pocketbase';
import { errorMessage, pb } from '../lib/pocketbase';

// El correo se recuerda (la sesión vencida ya no lo tiene).
const EMAIL_KEY = 'admin:email';
const storedEmail = () => {
  try {
    return localStorage.getItem(EMAIL_KEY) ?? '';
  } catch {
    return '';
  }
};

export function Login({ title, expired }: { title: string; expired?: boolean }) {
  const [email, setEmail] = useState(() => pb().authStore.record?.email ?? storedEmail());
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await pb().collection('editors').authWithPassword(email.trim(), password);
      try {
        localStorage.setItem(EMAIL_KEY, email.trim());
      } catch {}
    } catch (err) {
      setError(
        err instanceof ClientResponseError && err.status === 400
          ? 'Correo o contraseña incorrectos.'
          : errorMessage(err),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="login card" onSubmit={submit}>
      <h1>{title}</h1>
      <p className="muted">Editor del sitio</p>
      {expired && (
        <p className="notice-error">La sesión venció. Vuelve a entrar; lo que estabas editando sigue abierto.</p>
      )}
      <label>
        Correo
        <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Contraseña
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error && <p className="field-error">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? 'Entrando…' : 'Entrar'}
      </button>
      <p className="field-help">El primer acceso del día puede tardar unos segundos mientras el servidor despierta.</p>
    </form>
  );
}
