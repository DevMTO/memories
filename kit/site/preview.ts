// Vista previa del editor (kit/deploy/build.sh la arma con PREVIEW=1): incluye lo
// oculto y no se indexa. /admin pone la cookie y el servidor web (Caddy/nginx,
// kit/deploy/templates) sirve la vista previa a quien la tenga.
export const PREVIEW_COOKIE = 'site_preview';

export const isPreview = () => process.env.PREVIEW === '1';
