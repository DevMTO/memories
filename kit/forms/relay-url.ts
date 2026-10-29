// En el build: adónde envían los formularios (kit/forms/relay/form.php).
import { createHmac } from 'node:crypto';

// URL del relay para `data-relay`: FORMS_RELAY_URL (.env en local, build.env en el
// VPS). Sin ella los formularios avisan que no se pudo enviar.
export const formsRelay = () => process.env.FORMS_RELAY_URL?.trim() || undefined;

// El buzón que recibe el formulario (p. ej. el correo de "Datos de la empresa"),
// firmado con FORMS_RELAY_KEY, la clave del sitio en la tabla del relay: el relay solo
// envía a una dirección firmada, así nadie puede cambiarla en la página. Va como
// atributos del <form>: `<form {...formsRecipient(settings.email)}>`. Sin clave o sin
// correo no agrega nada y el relay usa el buzón de su tabla. La clave no sale del
// build: en la página solo queda la firma.
export function formsRecipient(email: string | null | undefined): Record<string, string> {
  const key = process.env.FORMS_RELAY_KEY?.trim();
  const to = email?.trim();
  if (!key || !to) return {};
  return { 'data-to': to, 'data-sig': createHmac('sha256', key).update(to).digest('hex') };
}
