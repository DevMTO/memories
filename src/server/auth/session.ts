import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'memories_admin_session';
const SESSION_SECONDS = 60 * 60 * 8;

type CookieStore = {
  get(name: string): { value: string } | undefined;
  set(name: string, value: string, options: {
    httpOnly: boolean;
    sameSite: 'strict';
    secure: boolean;
    path: string;
    maxAge: number;
  }): void;
  delete(name: string, options: { path: string }): void;
};

type SessionPayload = {
  username: string;
  expiresAt: number;
  nonce: string;
};

const getSecret = () => {
  const secret = process.env.SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET debe existir y tener al menos 32 caracteres.');
  }
  return secret;
};

const sign = (value: string) =>
  createHmac('sha256', getSecret()).update(value).digest('base64url');

const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

export const createSessionToken = (username: string) => {
  const payload: SessionPayload = {
    username,
    expiresAt: Date.now() + SESSION_SECONDS * 1000,
    nonce: randomBytes(16).toString('hex'),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
};

export const verifySessionToken = (token?: string | null): SessionPayload | null => {
  if (!token) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature || !safeEqual(sign(encoded), signature)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.username || payload.expiresAt <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

export const readAdminSession = (cookies: CookieStore) =>
  verifySessionToken(cookies.get(ADMIN_COOKIE)?.value);

export const setAdminSession = (cookies: CookieStore, username: string, secure: boolean) => {
  cookies.set(ADMIN_COOKIE, createSessionToken(username), {
    httpOnly: true,
    sameSite: 'strict',
    secure,
    path: '/',
    maxAge: SESSION_SECONDS,
  });
};

export const clearAdminSession = (cookies: CookieStore) => {
  cookies.delete(ADMIN_COOKIE, { path: '/' });
};

export const verifyAdminCredentials = (username: string, password: string) => {
  const expectedUser = process.env.ADMIN_USER?.trim();
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword) {
    throw new Error('ADMIN_USER y ADMIN_PASSWORD no están configurados.');
  }
  return safeEqual(username, expectedUser) && safeEqual(password, expectedPassword);
};

export const isSameOrigin = (request: Request) => {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
};
