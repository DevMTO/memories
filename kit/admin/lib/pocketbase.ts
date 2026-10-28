// Cliente de PocketBase de /admin (en el navegador, con la sesión del editor).
// La URL la pasa admin.astro desde PUBLIC_POCKETBASE_URL.
import PocketBase, { ClientResponseError, type RecordModel } from 'pocketbase';

export type { RecordModel };

let client: PocketBase | undefined;

export function connect(url: string) {
  if (!client) {
    client = new PocketBase(url);
    // Varias pantallas piden la misma colección a la vez; no cancelar entre sí.
    client.autoCancellation(false);
  }
  return client;
}

export function pb() {
  if (!client) throw new Error('PocketBase sin conectar.');
  return client;
}

export function fileUrl(record: RecordModel, filename: string | undefined) {
  return filename ? pb().files.getURL(record, filename) : '';
}

const CODES: Record<string, string> = {
  validation_required: 'Obligatorio.',
  validation_not_unique: 'Ya existe otro registro con este valor.',
  validation_invalid_format: 'Formato inválido.',
  validation_invalid_email: 'Correo inválido.',
  validation_invalid_url: 'URL inválida (debe empezar con https://).',
  validation_length_out_of_range: 'Demasiado largo.',
  validation_min_number_constraint: 'Valor demasiado bajo.',
  validation_file_size_limit: 'El archivo pesa más de 5 MB.',
  validation_invalid_mime_type: 'Solo JPG, PNG o WebP.',
};

// Errores por campo que devuelve PocketBase al validar (data.<campo>.code).
export function fieldErrors(err: unknown): Record<string, string> {
  if (!(err instanceof ClientResponseError)) return {};
  const data = (err.response?.data ?? {}) as Record<string, { code?: string; message?: string }>;
  return Object.fromEntries(
    Object.entries(data).map(([field, e]) => [field, CODES[e.code ?? ''] ?? e.message ?? 'Inválido.']),
  );
}

export function errorMessage(err: unknown): string {
  if (err instanceof ClientResponseError) {
    if (err.status === 0) return 'No se pudo conectar con el servidor. Revisa tu conexión.';
    // Caddy/nginx responden así mientras PocketBase se reinicia (al publicar cambios de código).
    if (err.status >= 502 && err.status <= 504)
      return 'El servidor se está reiniciando: vuelve a intentarlo en unos segundos.';
    // Límite de PocketBase (p. ej. varios intentos de entrar seguidos).
    if (err.status === 429) return 'Demasiados intentos seguidos. Espera unos segundos y vuelve a intentarlo.';
    if (Object.keys(fieldErrors(err)).length) return 'Revisa los campos marcados.';
    return err.response?.message || err.message;
  }
  return err instanceof Error ? err.message : String(err);
}
