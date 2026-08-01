import { defineMiddleware } from 'astro:middleware';
import { sitePath } from './core/site-path';
import { readAdminSession } from './server/auth/session';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const withoutBase = (pathname: string) =>
  basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || '/'
    : pathname;

const isProtectedPath = (pathname: string) =>
  (pathname.startsWith('/gestion') && pathname !== '/gestion/login') ||
  pathname.startsWith('/api/admin/catalog');

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname, search } = context.url;
  const routePath = withoutBase(pathname);
  if (!isProtectedPath(routePath)) return next();

  const session = readAdminSession(context.cookies);
  if (session) {
    context.locals.adminUser = session.username;
    return next();
  }

  if (routePath.startsWith('/api/')) {
    return new Response(JSON.stringify({ error: 'Sesión no válida.' }), {
      status: 401,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
      },
    });
  }

  const nextUrl = encodeURIComponent(`${pathname}${search}`);
  return context.redirect(`${sitePath('/gestion/login')}?next=${nextUrl}`);
});
