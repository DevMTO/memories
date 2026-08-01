import type { APIRoute } from 'astro';
import {
  clearAdminSession,
  isSameOrigin,
  readAdminSession,
  setAdminSession,
  verifyAdminCredentials,
} from '../../../server/auth/session';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });

export const GET: APIRoute = ({ cookies }) => {
  const session = readAdminSession(cookies);
  return json({ authenticated: Boolean(session), username: session?.username || null });
};

export const POST: APIRoute = async ({ request, cookies, url }) => {
  if (!isSameOrigin(request)) return json({ error: 'Origen no permitido.' }, 403);

  try {
    const body = await request.json() as { username?: string; password?: string };
    const username = body.username?.trim() || '';
    const password = body.password || '';

    if (!verifyAdminCredentials(username, password)) {
      return json({ error: 'Usuario o contraseña incorrectos.' }, 401);
    }

    setAdminSession(cookies, username, url.protocol === 'https:');
    return json({ authenticated: true, username });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo iniciar sesión.';
    return json({ error: message }, 500);
  }
};

export const DELETE: APIRoute = ({ request, cookies }) => {
  if (!isSameOrigin(request)) return json({ error: 'Origen no permitido.' }, 403);
  clearAdminSession(cookies);
  return json({ authenticated: false });
};
