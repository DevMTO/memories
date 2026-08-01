import React, { useState } from 'react';
import { sitePath } from '../../core/site-path';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(sitePath('/api/admin/session'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo iniciar sesión.');

      const next = new URLSearchParams(window.location.search).get('next');
      window.location.href = next?.startsWith('/') && !next.startsWith('//')
        ? next
        : sitePath('/gestion');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <img
          src={sitePath('/images/IMAGOTIPOS/IMAGOTIPO-MEMORIES-TRAVEL-1.webp')}
          alt="Memories Travel Perú"
          className="admin-login-logo"
        />
        <p className="admin-kicker">Gestión privada</p>
        <h1>Catálogo de experiencias</h1>
        <p className="admin-login-copy">Administra tours, trekkings y paquetes desde una sola interfaz.</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <label>
            Usuario
            <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
          </label>
          <label>
            Contraseña
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
          </label>
          {error && <p className="admin-alert admin-alert--error">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? 'Verificando…' : 'Ingresar'}</button>
        </form>
      </section>
    </main>
  );
}
