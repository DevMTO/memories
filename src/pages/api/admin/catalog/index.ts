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

const errorStatus = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'No se pudo guardar el registro.';
  return /UNIQUE constraint failed/i.test(message) ? 409 : 400;
};

export const GET: APIRoute = async () => {
  const products = await travelRepository.getAllProductsForAdmin();
  return json({ products });
};

export const POST: APIRoute = async ({ request }) => {
  if (!isSameOrigin(request)) return json({ error: 'Origen no permitido.' }, 403);
  try {
    const product = sanitizeProduct(await request.json());
    return json({ product: await travelRepository.createProduct(product) }, 201);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'No se pudo guardar.' }, errorStatus(error));
  }
};
