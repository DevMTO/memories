import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../infrastructure/firebaseClient';
import { useAuth, AuthProvider } from './AuthContext';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      window.location.href = '/admin/tours';
    }
  }, [user, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      // Wait for AuthContext to detect user and redirect
    } catch (err: any) {
      setError('Credenciales inválidas o error de conexión.');
    }
  };

  if (loading || user) return <div style={{ textAlign: 'center', padding: '50px' }}>Verificando sesión...</div>;

  return (
    <div className="login-container">
      <style>{`
        .login-container { max-width: 400px; margin: 100px auto; padding: 40px; background: white; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); font-family: sans-serif; }
        .login-title { text-align: center; color: #10594c; margin-bottom: 30px; font-family: 'Playfair Display', serif; }
        .login-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group input { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        .btn-login { background: #10594c; color: white; padding: 12px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 1rem; }
        .btn-login:hover { background: #0a3d34; }
        .error-msg { color: #dc3545; font-size: 0.85rem; text-align: center; }
      `}</style>
      
      <h2 className="login-title">MEMORIES ADMIN</h2>
      <form className="login-form" onSubmit={handleLogin}>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-group">
          <input type="email" placeholder="Correo Electrónico" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-login">INGRESAR</button>
      </form>
    </div>
  );
}

export default function LoginForm() {
  return (
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  );
}
