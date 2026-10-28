// Envía los formularios de visitantes. Cada <form data-collection> trae en data-*
// el destino y los textos ya traducidos (`data-messages`):
//
// - `data-endpoint`: URL de PocketBase; crea un registro en la colección (ver
//   kit/pocketbase/forms) y aparece en la bandeja de /admin.
// - `data-relay`: URL de kit/forms/relay/form.php en un hosting con PHP (cPanel),
//   para sitios sin PocketBase: solo envía un correo, no se guarda.
//
// Las dos responden igual: 2xx, 400 con `data` (campos inválidos) o 429.

type Messages = { sending: string; sent: string; invalid: string; tooMany: string; failed: string };

function setup(form: HTMLFormElement) {
  const { collection, endpoint, relay } = form.dataset;
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

    const body: Record<string, unknown> = {};
    for (const [key, value] of new FormData(form)) {
      const text = String(value).trim();
      if (!text) continue;
      const input = form.querySelector<HTMLInputElement>(`[name="${key}"]`);
      body[key] = input?.type === 'number' ? Number(text) : text;
    }

    // Build con el seed sin PocketBase (npm run build:static): no hay a dónde enviar.
    if (!endpoint && !relay) return show('error', messages.failed);
    if (relay) body._form = collection;

    button.disabled = true;
    show('info', messages.sending);
    try {
      const res = await fetch(relay || `${endpoint}/api/collections/${collection}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        form.reset();
        const success = form.querySelector<HTMLElement>('[data-form-success]');
        if (success && data.code) {
          // Libro de reclamaciones: el número de hoja asignado.
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

document.querySelectorAll<HTMLFormElement>('form[data-collection]').forEach(setup);
