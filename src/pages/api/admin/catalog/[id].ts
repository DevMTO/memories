import type { APIRoute } from 'astro';
import { travelRepository } from '../../../../infrastructure/di';
import { sanitizeProduct } from '../../../../server/catalog/validation';
import { isSameOrigin } from '../../../../server/auth/session';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });

export const PUT: APIRoute = async ({ request, params }) => {
  if (!isSameOrigin(request)) return json({ error: 'Origen no permitido.' }, 403);
  const id = params.id;
  if (!id) return json({ error: 'Identificador inválido.' }, 400);

  try {
    const product = sanitizeProduct(await request.json(), id);
    const updated = await travelRepository.updateProduct(id, product);
    return updated ? json({ product: updated }) : json({ error: 'Registro no encontrado.' }, 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo actualizar.';
    return json({ error: message }, /UNIQUE constraint failed/i.test(message) ? 409 : 400);
  }
};

export const DELETE: APIRoute = async ({ request, params }) => {
  if (!isSameOrigin(request)) return json({ error: 'Origen no permitido.' }, 403);
  const id = params.id;
  if (!id) return json({ error: 'Identificador inválido.' }, 400);
  return await travelRepository.deleteProduct(id)
    ? json({ deleted: true })
    : json({ error: 'Registro no encontrado.' }, 404);
};
