// El contacto del sitio (WhatsApp, correo, dirección) se edita en /admin: ver
// src/lib/services/site.ts (getContact).

export const buildWhatsAppUrl = (whatsappNumber: string, message?: string) => {
  const base = `https://wa.me/${whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

export const SITE_DEVELOPER = {
  name: 'Turix',
  url: 'https://turix.tech/',
} as const;
