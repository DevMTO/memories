// Envía los formularios de visitantes al relay de correo (kit/forms/relay/form.php,
// en el hosting). El correo lo arma el sitio, en su idioma; el relay solo lo manda al
// buzón del sitio (su tabla de dominios) con su plantilla HTML.
//
//   <form data-form="contact" data-relay={formsRelay()} data-messages={…}
//         data-subject="Nueva consulta: {name}" data-page-label="Página">
//
// - Filas: cada campo con valor, con su etiqueta visible (ver `labelOf`) y lo que se
//   ve (el texto de la opción elegida en select y radios). No van `website` (trampa
//   para bots), los ocultos sin `data-label` ni los marcados `data-email="skip"`.
// - `data-subject`: asunto; `{campo}` se llena aquí y `{code}` lo pone el relay (el
//   número correlativo de los formularios que lo tienen).
// - `data-intro`, `data-outro`: textos antes y después de las filas.
// - `data-rows`: JSON de filas fijas que van primero ([["RUC", "2060…"], …]).
// - `data-copy`: JSON { subject, intro, outro } de la copia a quien lo envía (campo
//   `email`); solo sale si el relay la permite para este formulario.
// - `data-page-label`: etiqueta de la fila con la página de origen.
// - `data-to` y `data-sig`: el buzón que recibe y su firma, de `formsRecipient()`
//   (kit/forms/relay-url.ts) en el build. Sin ellos, el relay usa el buzón de su tabla.
// - Un dato que va dentro de otro campo: `<input name="travel_date" data-append="message"
//   data-label="Fecha">` agrega "Fecha: <valor>" al mensaje.
//
// Textos de estado (`data-messages`): { sending, sent, invalid, tooMany, failed }, en
// el `[data-form-status]` del formulario. El relay responde 2xx, 400 con `data`
// (campos inválidos) o 429.

type Messages = { sending: string; sent: string; invalid: string; tooMany: string; failed: string };

// Si el relay no responde en este tiempo, se avisa que no se pudo enviar (en vez de
// dejar "Enviando…" para siempre). Es largo a propósito: un envío lento que sí llega
// no debería mostrarse como fallido y tentar a reenviar.
const TIMEOUT_MS = 30_000;
type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const clean = (text: string | null | undefined) => (text ?? '').replace(/\s*\*\s*$/, '').replace(/\s+/g, ' ').trim();

// Texto propio de un <label> (sin el de los campos o las opciones que contiene).
const ownText = (label: Element | null | undefined) =>
  label
    ? [...label.childNodes]
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent)
        .join(' ')
    : '';

// Etiqueta visible de un campo: data-label, su <label>, la leyenda del grupo
// (radios y casillas), aria-label o placeholder.
function labelOf(input: Field): string {
  const grouped = input.type === 'radio' || input.type === 'checkbox';
  return clean(
    input.dataset.label ||
      (input.id && ownText(input.ownerDocument.querySelector(`label[for="${CSS.escape(input.id)}"]`))) ||
      (grouped && input.closest('fieldset')?.querySelector('legend')?.textContent) ||
      (!grouped && ownText(input.closest('label'))) ||
      input.getAttribute('aria-label') ||
      input.getAttribute('placeholder') ||
      input.name,
  );
}

// Lo que se ve del valor: el texto de la opción elegida en select, radios y casillas.
function shownValue(input: Field): string {
  if (input instanceof HTMLSelectElement) return clean(input.selectedOptions[0]?.textContent) || input.value;
  if (input.type === 'radio' || input.type === 'checkbox') return clean(ownText(input.closest('label'))) || input.value;
  return input.value.trim();
}

const json = <T,>(value: string | undefined, fallback: T): T => {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

// El correo que se manda al relay, armado con lo que hay en el formulario.
function buildEmail(form: HTMLFormElement) {
  const rows = new Map<string, [string, string]>();
  const appended: [Field, string][] = [];
  for (const element of form.elements) {
    const input = element as Field;
    if (!input.name || input.disabled || input.name === 'website' || input.dataset.email === 'skip') continue;
    if ((input.type === 'radio' || input.type === 'checkbox') && !(input as HTMLInputElement).checked) continue;
    if (input.type === 'hidden' && !input.dataset.label) continue;
    const value = shownValue(input);
    if (!value) continue;
    if (input.dataset.append) {
      appended.push([input, value]);
      continue;
    }
    // Varias casillas con el mismo nombre: una fila con todas.
    const previous = rows.get(input.name);
    rows.set(input.name, [labelOf(input), previous ? `${previous[1]}, ${value}` : value]);
  }
  for (const [input, value] of appended) {
    const target = rows.get(input.dataset.append!);
    const line = `${labelOf(input)}: ${value}`;
    if (target) target[1] = `${target[1]}\n\n${line}`;
    else rows.set(input.name, [labelOf(input), value]);
  }

  const { subject = '', intro, outro, pageLabel } = form.dataset;
  const fill = (text: string) => text.replace(/\{(\w+)\}/g, (match, field) => (field === 'code' ? match : rows.get(field)?.[1] ?? ''));
  const email = (form.elements.namedItem('email') as HTMLInputElement | null)?.value.trim() ?? '';
  const copy = json<{ subject?: string; intro?: string; outro?: string } | null>(form.dataset.copy, null);
  return {
    form: form.dataset.form,
    subject: fill(subject),
    intro: intro ? fill(intro) : undefined,
    outro: outro ? fill(outro) : undefined,
    rows: [
      ...json<[string, string][]>(form.dataset.rows, []),
      ...rows.values(),
      [pageLabel ?? '', location.href],
    ],
    reply_to: email || undefined,
    to: form.dataset.to,
    sig: form.dataset.sig,
    copy: copy && {
      subject: fill(copy.subject ?? subject),
      intro: copy.intro ? fill(copy.intro) : undefined,
      outro: copy.outro ? fill(copy.outro) : undefined,
    },
    website: (form.elements.namedItem('website') as HTMLInputElement | null)?.value || undefined,
  };
}

function setup(form: HTMLFormElement) {
  const { relay } = form.dataset;
  const messages = JSON.parse(form.dataset.messages ?? '{}') as Messages;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;

  const show = (kind: 'info' | 'ok' | 'error', text: string) => {
    status.hidden = false;
    status.dataset.kind = kind;
    status.textContent = text;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));

    // Build sin FORMS_RELAY_URL: no hay a dónde enviar.
    if (!relay) return show('error', messages.failed);

    button.disabled = true;
    show('info', messages.sending);
    try {
      const res = await fetch(relay, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildEmail(form)),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        form.reset();
        const success = form.querySelector<HTMLElement>('[data-form-success]');
        if (success && data.code) {
          // Formulario con número (p. ej. libro de reclamaciones): el número asignado.
          success.querySelector('[data-code]')!.textContent = data.code;
          success.querySelector<HTMLElement>('[data-emailed]')!.hidden = !data.emailed;
          success.hidden = false;
          status.hidden = true;
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          show('ok', messages.sent);
        }
      } else if (res.status === 429) {
        show('error', messages.tooMany);
      } else if (res.status === 400 && data.data && Object.keys(data.data).length) {
        for (const field of Object.keys(data.data)) {
          form.querySelector(`[name="${field}"]`)?.setAttribute('aria-invalid', 'true');
        }
        (form.querySelector('[aria-invalid]') as HTMLElement | null)?.focus();
        show('error', messages.invalid);
      } else {
        show('error', messages.failed);
      }
    } catch {
      show('error', messages.failed);
    } finally {
      button.disabled = false;
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach(setup);
